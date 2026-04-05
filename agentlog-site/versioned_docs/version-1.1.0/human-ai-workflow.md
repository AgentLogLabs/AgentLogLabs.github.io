---
id: human-ai-workflow
title: 人机协同工作流
sidebar_position: 1
---

# AgentLog 人机协同工作流

AgentLog Phase 1 引入了全新的 **Trace/Span 数据模型** 与 **双流采集机制**，旨在彻底解决 AI Agent 与人类开发者在复杂协作过程中的"上下文断层"问题。

## 核心痛点与解决方案

在传统的 Agent 协作开发中，通常面临以下困境：
- **断点流转**：Agent 报错停止，人类接管修改代码，再次唤醒 Agent 时，Agent 丢失了人类修改的上下文。
- **状态孤岛**：不同 Agent 之间的切换（如从 Builder 到 Reviewer）难以传递完整的执行历史和报错环境。

AgentLog Phase 1 的核心创新在于**人机一致性追踪**：
你的每一次 Git 提交、每一条命令行干预，都会被网关自动捕获，并作为人类维度的 Span 挂载到当前的全局 TraceID 之下。这让 AgentLog 具备了真正意义上的 JIT (Just-In-Time) 上下文恢复能力。

## 场景一：断点接管与人机混合接力赛 (Handoff Tracing)

**痛点**：AI Agent 报错卡死，人类接手时"一脸懵逼"，只能去翻长达几千行的聊天记录，且修复后 Git Commit 割裂。

**场景标签**：单物理节点、人机混合协作、上下文缝合

### 🎬 场景还原

```
1. 自动驾驶碰壁：周五下午，开发者启动了 OpenClaw 的 Builder Agent 负责重构支付网关。
   Agent 跑了 20 分钟，改了 15 个文件，但在对接第三方 Stripe 接口时遇到死锁报错，
   尝试 3 次修复失败后，主动抛出异常（Panic）。

2. 生成 Trace Ticket：此时，AgentLog 自动介入。它没有机械地记录错误，
   而是生成了一个包含了当前内存快照、变更 Diff、连续推理过程的 Ticket (Span ID: 101)，
   归属在这个重构任务的 Trace ID: A-999 下。

3. 人类携重武器入场：开发者收到通知，打开 VS Code/Cursor（外部工具）。
   通过 AgentLog 插件，一键点击 "Resume Ticket #101"。
   AgentLog 瞬间将之前 Builder Agent 的核心决策逻辑和死锁原因，作为 Context 注入到 Cursor 的对话框中。

4. 修复与无缝缝合：开发者在 Cursor 中与 AI 协同，花了 5 分钟手动修复了死锁问题，
   并执行 git commit -m "fix: resolve stripe deadlock"。

5. 黑匣子归档：AgentLog 的 Git Hook 触发。系统自动将 Span ID 101 (Agent的努力与失败)
   + Span ID 102 (人类与Cursor的修复过程) + 最终的 Git Commit Hash 完美缝合在 Trace ID A-999 的时间线上。
```

### 💡 产品价值

实现了真正的"上下文不掉线"。代码有出处，接盘无痛苦。

## 核心流程概览

完整链路涉及三个角色：
1. **AgentSwarm Agent**（OpenClaw Builder）
2. **人类**（通过 VS Code/OpenCode/Cursor 等工具）
3. **AgentSwarm Agent**（继续完成工作）

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

### 字段说明

| 字段 | 说明 |
|------|------|
| `pending` | 待认领的 Trace，key 为 TraceId |
| `pending[].targetAgent` | 目标 Agent 类型（opencode/cursor/claude-code 等） |
| `pending[].createdAt` | 创建时间 |
| `active` | 当前活跃的 Session，key 为 SessionUuid |
| `active[].traceId` | 该 Session 正在处理的 Trace |
| `active[].agentType` | Agent 类型 |
| `active[].status` | 状态（always active） |
| `active[].worktree` | Git worktree 路径 |

## VS Code UI 设计

### 右键菜单设计

```
右键 Trace A-999 → Resume with...
├── 🤖 OpenCode
├── 🎯 Cursor
├── 🧠 Claude Code
└── 📋 Other Agent...
```

### 各 Agent 的行为

| Agent 类型 | 启动时检查 | 认领条件 |
|-----------|-----------|----------|
| OpenCode | 读取 `pending[].targetAgent` | === opencode |
| Cursor | 读取 `pending[].targetAgent` | === cursor |
| Claude Code | 读取 `pending[].targetAgent` | === claude-code |

**设计原则**：每种 Agent 只关心自己类型的 pending 项，互不干扰，具备良好扩展性。

## Error Span 完整格式

当 Agent 遇到错误时，生成的 Error Span 包含以下 payload：

```json
{
  "id": "span-101",
  "traceId": "A-999",
  "parentSpanId": null,
  "actorType": "error",
  "actorName": "Builder-Agent",
  "payload": {
    "errorType": "DeadlockError",
    "stackTrace": "at StripeClient.connect (...)",
    "memorySnapshot": {
      "workspacePath": "/path/to/project",
      "currentFiles": ["src/stripe.ts", "src/payment.ts"],
      "gitStatus": "modified"
    },
    "diff": {
      "changedFiles": ["src/stripe.ts", "src/payment.ts"],
      "additions": 150,
      "deletions": 30
    },
    "reasoningChain": [
      {"step": 1, "thought": "分析Stripe API...", "action": "修改stripe.ts"},
      {"step": 2, "thought": "检测到死锁...", "action": "尝试修复#1"},
      {"step": 3, "thought": "修复失败...", "action": "尝试修复#2"},
      {"step": 4, "thought": "再次失败...", "action": "尝试修复#3"},
      {"step": 5, "thought": "三次失败...", "action": "抛出Panic"}
    ]
  },
  "createdAt": "2026-04-05T10:30:00Z"
}
```

### Error Span 字段说明

| 字段 | 说明 |
|------|------|
| `actorType: "error"` | 标识这是一个错误 Span |
| `payload.errorType` | 错误类型（如 DeadlockError） |
| `payload.stackTrace` | 堆栈信息 |
| `payload.memorySnapshot` | 内存快照（workspacePath、当前文件） |
| `payload.diff` | 变更文件列表及统计 |
| `payload.reasoningChain` | 连续推理过程 |

## Git Hook post-commit 脚本

```bash
#!/bin/bash
# .git/hooks/post-commit
# AgentLog 自动绑定脚本

AGENTLOG_DIR=".git/agentlog"
SESSIONS_FILE="$AGENTLOG_DIR/sessions.json"
TRACE_ID=""
SESSION_ID=""

# 1. 优先读取 sessions.json 中的 active session
if [ -f "$SESSIONS_FILE" ]; then
  ACTIVE=$(jq -r ".active[] | select(.status==\"active\")" "$SESSIONS_FILE" 2>/dev/null)
  if [ -n "$ACTIVE" ]; then
    SESSION_ID=$(echo "$ACTIVE" | jq -r '.sessionId')
    TRACE_ID=$(echo "$ACTIVE" | jq -r '.traceId')
    # 清理 sessions.json
    jq "del(.active[\"$SESSION_ID\"])" "$SESSIONS_FILE" > "$SESSIONS_FILE.tmp"
    mv "$SESSIONS_FILE.tmp" "$SESSIONS_FILE"
  fi
fi

# 2. 如果没有 active session，读取 git config
if [ -z "$TRACE_ID" ]; then
  TRACE_ID=$(git config agentlog.traceId)
fi

# 3. 如果还是没有，创建 human-direct Trace
if [ -z "$TRACE_ID" ]; then
  TRACE_ID="human-direct-$(date +%s)"
fi
```

## MCP 工具

### log_turn

逐轮上报每一条消息，首次调用自动创建 Trace。

### log_intent

任务结束后调用，记录整体意图和受影响文件。

### query_traces

查询 Trace 列表（语义检索）或直接获取单个 Trace。

### claim_pending_trace

启动时调用，认领分配给当前 Agent 的待处理 Trace。

## 技术架构简析

AgentLog Phase 1 采用了独特的**"网关 + 旁路探针"双流采集机制**：

1. **内部流 (旁路探针)**：无侵入式拦截大模型的思维链（`<think>`）与工具调用，通过异步 `POST /api/spans` 接口上报，对主业务零阻塞。

2. **外部流 (Git Hook / 插件)**：覆盖人类开发者的物理按键行为（如 IDE 保存、Git 提交），与探针数据在网关侧进行统一排序合并。

---

了解更多技术细节，请参阅 [架构演进文档](./architecture.md) 或 [数据模型指南](./data-model.md)。
