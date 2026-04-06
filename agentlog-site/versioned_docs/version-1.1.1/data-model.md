---
sidebar_position: 3
---

# 数据模型

AgentLog Phase 1 采用工业级可观测性标准的 **Trace/Span** 模型 (基于 ULID)，实现跨 Agent 状态穿透与人机混合追踪。

## 数据库概览

- **数据库引擎**：SQLite 3.x（通过 `better-sqlite3` 驱动）
- **存储路径**：`.git/agentlog/agentlog.db`
- **当前版本**：Schema v5 (Phase 1)

## 核心模型：Trace & Span

### traces 表

存储全局任务工作流，一个 Trace 可以穿透多个 Agent 的生命周期。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `trace_id` | TEXT | PRIMARY KEY | 全局追踪 ID (基于 ULID) |
| `created_at` | TEXT | NOT NULL | 创建时间（ISO 8601 格式） |
| `intent` | TEXT | | 全局任务意图 |
| `status` | TEXT | | 当前状态：`running` / `pending_handoff` / `in_progress` / `completed` |

### spans 表

存储所有工作单元，包括 Agent 工具调用、大模型推理、人类 Git 提交等。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `span_id` | TEXT | PRIMARY KEY | 工作单元 ID (基于 ULID) |
| `trace_id` | TEXT | NOT NULL | 归属的 Trace ID，外键 |
| `parent_span_id` | TEXT | | 父级 Span ID，用于构建调用链 |
| `actor_type` | TEXT | NOT NULL | 参与者类型：`agent` / `human` / `error` |
| `actor_name` | TEXT | | 参与者名称，如 `Builder-Agent`、`Cursor`、`Human` |
| `payload` | TEXT | | 统一的载荷数据 (JSON 格式) |
| `created_at` | TEXT | NOT NULL | 创建时间 |

### payload 格式示例

#### Agent Span Payload
```json
{
  "type": "agent",
  "model": "claude-3-5-sonnet",
  "prompt": "请帮我重构支付模块",
  "response": "我将开始重构...",
  "reasoning": "<think>分析支付模块结构...</think>",
  "toolCalls": [
    {
      "tool": "read",
      "input": {"filePath": "src/payment.ts"},
      "output": "已读取文件..."
    }
  ],
  "tokenUsage": {
    "inputTokens": 1200,
    "outputTokens": 800
  }
}
```

#### Human Span Payload
```json
{
  "type": "human",
  "action": "git_commit",
  "message": "fix: resolve stripe deadlock",
  "commitHash": "a1b2c3d4e5f6",
  "changedFiles": ["src/stripe.ts", "src/payment.ts"]
}
```

#### Error Span Payload
```json
{
  "type": "error",
  "errorType": "DeadlockError",
  "stackTrace": "at StripeClient.connect (...)",
  "memorySnapshot": {
    "workspacePath": "/path/to/project",
    "currentFiles": ["src/stripe.ts"]
  },
  "diff": {
    "changedFiles": ["src/stripe.ts"],
    "additions": 50,
    "deletions": 10
  },
  "reasoningChain": [
    {"step": 1, "thought": "分析Stripe API...", "action": "修改stripe.ts"},
    {"step": 2, "thought": "检测到死锁...", "action": "尝试修复"}
  ]
}
```

## sessions.json 文件

用于跨 Agent 接力场景，管理 Trace 的认领状态。

**文件位置**：`.git/agentlog/sessions.json`

```json
{
  "pending": {
    "A-999": {
      "createdAt": "2026-04-05T09:50:00Z",
      "targetAgent": "opencode"
    }
  },
  "active": {
    "session-uuid-1": {
      "traceId": "A-999",
      "agentType": "opencode",
      "status": "active",
      "startedAt": "2026-04-05T10:00:00Z",
      "worktree": "/path/to/main"
    }
  }
}
```

## 索引

```sql
-- Trace 查询
CREATE INDEX idx_traces_created_at ON traces(created_at DESC);
CREATE INDEX idx_traces_status ON traces(status);

-- Span 查询
CREATE INDEX idx_spans_trace_id ON spans(trace_id);
CREATE INDEX idx_spans_created_at ON spans(created_at DESC);
CREATE INDEX idx_spans_actor_type ON spans(actor_type);
```

## 状态机

```
┌──────────────┐
│   running    │
└──────┬───────┘
       │
           Error / 认领 ↓
       │
┌──────▼───────┐
│pending_handoff│
└──────┬───────┘
       │
       │ commit + 选择"完成" → completed
       │ commit + 选择"继续修改" → in_progress
       ↓
┌──────────────┐
│ in_progress  │
└──────┬───────┘
       │
       commit ↓
       ↓
┌──────────────┐
│  completed   │
└──────────────┘
```
