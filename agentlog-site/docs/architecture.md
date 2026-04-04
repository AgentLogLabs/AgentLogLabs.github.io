---
sidebar_position: 1
---

# 架构设计

> **Phase 1 架构** — AgentLog 采用 **Trace/Span 可观测性标准** + **双流采集引擎**，实现人机协同的上下文无缝衔接。

## 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI Agent (Builder / Reviewer)                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  OpenClaw / Cline / Roo Code + Telemetry Probe            │    │
│  │  • 拦截 ❤️ 和工具调用                                       │    │
│  │  • 调用 get_failed_attempts(trace_id) 获取历史状态          │    │
│  └───────────────────────────┬────────────────────────────────┘    │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ stdio / HTTP
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AgentLog Gateway (网关)                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│  │  Span Ingestion │  │  Trace Context  │  │  JIT Hydration  │       │
│  │  POST /api/spans│  │  (ULID 管理)    │  │  MCP 工具       │       │
│  │  SSE 流式响应   │  │                │  │  get_failed_*   │       │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
└───────────┼──────────────────────┼─────────────────────┼──────────────┘
            │                      │                     │
            ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SQLite Database                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│  │     traces      │  │     spans       │  │ commit_bindings│       │
│  │   (ULID PK)     │  │  (actor_type)   │  │  (向后兼容)     │       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
            ▲                      ▲
            │                      │
┌───────────┴──────────────────────┴─────────────────────────────────┐
│                    外部流采集 (External Stream)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   Git Hooks     │  │   VS Code 插件  │  │   CLI 工具       │      │
│  │  (post-commit)  │  │  (编辑器事件)   │  │  (手动触发)      │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

## Phase 1 核心架构：双流采集与 JIT 状态复水

### 1. 双流采集引擎 (Dual-Stream Collection)

为彻底解决人类微操与 Agent 流转的断点问题，Phase 1 引入了双流采集引擎：

| 流 | 来源 | 采集方式 | Span 类型 |
|----|------|----------|-----------|
| **内部流 (Internal)** | OpenClaw / AI Agent | Telemetry Probe 无侵入拦截 | `actor: agent` |
| **外部流 (External)** | 人类开发者 | Git Hook + 编辑器插件 | `actor: human` |

**内部流采集**：
- 通过 OpenClaw 旁路探针 (Telemetry Probe) 无阻塞拦截 `<think>` 推理链与工具调用
- 通过 `POST /api/spans` 异步上报，对主业务零阻塞
- 支持 SSE 流式响应实时记录 AI 输出

**外部流采集**：
- Git Hook (`post-commit`) 捕获人类开发者的提交流程
- 编辑器插件捕获保存、调试等物理操作
- 统一封装为 `actor: human` 的 Span 并关联当前 TraceID

### 2. Trace / Span 数据模型

Phase 1 废弃了旧的 `agent_sessions` 表，采用工业级可观测性标准：

#### Trace（全局追踪）
代表一次完整的研发意图或多步骤任务流：
- **标识**：ULID（时间排序唯一标识符）
- **生命周期**：穿透所有参与的 Agent 生命周期
- **关联**：通过 `trace_id` 关联所有相关 Span

#### Span（工作单元）
无论是 Agent 的一次推理、一次工具调用，还是人类的一次 Git 提交，都抽象为统一的 Span：

```typescript
interface Span {
  id: string;              // Span 唯一标识
  trace_id: string;        // 所属 Trace（ULID）
  parent_id?: string;       // 父 Span（用于嵌套）
  
  actor_type: "agent" | "human";  // 参与者类型
  actor_name: string;        // Agent 名称或 "human"
  model?: string;          // 使用的模型（如 "minimax/M2.7"）
  
  name: string;            // Span 名称（如 "推理" / "git_commit"）
  payload: object;         // 泛化载荷（见下方）
  
  start_time: number;      // 开始时间（Unix ms）
  end_time?: number;       // 结束时间
  duration_ms?: number;    // 持续时长
  
  status: "running" | "completed" | "error";
  error?: string;          // 错误信息
}
```

**Payload 示例**：

| 场景 | Payload 结构 |
|------|-------------|
| Agent 推理 | `{ "type": "reasoning", "thought": "...", "model": "deepseek-r1" }` |
| 工具调用 | `{ "type": "tool_call", "tool": "Bash", "args": {...}, "result": "..." }` |
| Git 提交 | `{ "type": "git_commit", "hash": "abc123", "message": "...", "files": [...] }` |
| 人类接管 | `{ "type": "handoff", "action": "code_edit", "files": [...], "note": "..." }` |

### 3. JIT Context Hydration（跨 Agent 急诊交接）

当 Agent 流水线中断（如 Builder Agent 失败）时：

```
Builder Agent                          Reviewer Agent
     │                                       │
     │ ❌ 构建失败，生成错误 Span              │
     │    (TraceID: T-xxxxxxxx)              │
     │                                       │
     │ ── 发送极简指令 ──────────────────────► │
     │    "任务失败请接手, TraceID: T-xxxxxxxx"│
     │                                       │
     │          ┌────────────────────────┐   │
     │          │ MCP 工具调用             │   │
     │          │ get_failed_attempts(   │   │
     │          │   trace_id="T-xxxxxxxx"│   │
     │          │ )                       │   │
     │          └────────────────────────┘   │
     │                   │                   │
     │                   ▼                   │
     │              ┌──────────┐              │
     │              │ Gateway   │              │
     │              │ 返回结构化 │              │
     │              │ 报错栈和环境│              │
     │              └──────────┘              │
     │◄───────────────────────────────────── │
     │    📦 结构化报错栈、参数、历史状态       │
     │                                       │
     │ ✅ 状态复水，直接基于错误栈修复          │
```

**核心价值**：
- 无需传递完整的日志作为 prompt
- 只需传递一个 TraceID
- 通过 MCP 工具 `get_failed_attempts(trace_id)` 实时获取结构化历史栈和环境状态

## MCP 工具接口

Phase 1 提供以下 MCP 工具：

| 工具 | 参数 | 返回值 |
|------|------|--------|
| `get_failed_attempts` | `trace_id: string` | 失败 Span 的结构化报错栈、输入参数、环境状态 |
| `get_trace_summary` | `trace_id: string` | Trace 概览（总 Span 数、关键节点、时间线） |
| `append_human_span` | `trace_id, payload` | 追加人类操作 Span |

## 数据库设计

### traces 表

```sql
CREATE TABLE traces (
  id TEXT PRIMARY KEY,                 -- ULID
  name TEXT,                          -- Trace 名称/意图描述
  goal TEXT,                           -- 原始目标/任务描述
  status TEXT DEFAULT 'active',        -- active | completed | error
  created_at TEXT,                     -- ISO 8601
  updated_at TEXT,                     -- ISO 8601
  ended_at TEXT,                       -- 结束时间
  metadata TEXT                         -- JSON：来源、模型等
);
```

### spans 表

```sql
CREATE TABLE spans (
  id TEXT PRIMARY KEY,                 -- ULID
  trace_id TEXT NOT NULL,             -- 外键关联 traces
  parent_id TEXT,                      -- 父 Span（支持嵌套）
  
  actor_type TEXT NOT NULL,            -- 'agent' | 'human'
  actor_name TEXT,                     -- Agent 名称或 'human'
  model TEXT,                          -- 模型标识
  
  name TEXT NOT NULL,                  -- Span 名称
  payload TEXT NOT NULL,               -- JSON：泛化载荷
  
  start_time INTEGER NOT NULL,         -- Unix ms
  end_time INTEGER,                    -- Unix ms
  duration_ms INTEGER,                 -- 计算得出
  
  status TEXT DEFAULT 'running',       -- running | completed | error
  error TEXT,                          -- 错误信息
  
  FOREIGN KEY (trace_id) REFERENCES traces(id)
);
```

### 向后兼容：commit_bindings 表

保留原有的 Git 绑定关系，向后兼容 Phase 0：

```sql
CREATE TABLE commit_bindings (
  commit_hash TEXT PRIMARY KEY,
  trace_id TEXT,                       -- Phase 1: 关联 Trace
  session_ids TEXT,                    -- Phase 0: 旧 Session 兼容
  message TEXT,
  committed_at TEXT,
  author_name TEXT,
  author_email TEXT,
  changed_files TEXT,
  workspace_path TEXT
);
```

## 部署架构

### 开发环境
```
开发者机器
├── OpenClaw (Telemetry Probe)  ──►  Gateway :3000
├── Git Hooks (post-commit)      ──►  Gateway :3000
├── SQLite Database (~/.agentlog/agentlog.db)
└── AI Agent (Cline/OpenCode/Roo Code) + MCP
```

### 生产环境（团队协作）
```
团队成员（各自独立环境）
├── 独立 Gateway 实例
├── 共享 SQLite（可选中央存储）
└── 通过 MCP 工具跨 Agent 传递 TraceID
```

---

*了解更多 Phase 1 使用场景，请参阅 [人机协同工作流](./phase1-tracing.md)。*
