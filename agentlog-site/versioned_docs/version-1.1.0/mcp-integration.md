---
sidebar_position: 4
---

# MCP 集成指南

本文档详细说明 AgentLog 的 MCP 协议实现、工具列表及调用规则。

> **提示**：如果你使用 Docker 部署后端，请先阅读 [Docker 部署](./docker-deployment) 文档完成服务部署和 AI Agent 配置。

## MCP 协议简介

**Model Context Protocol (MCP)** 是一个开放协议，允许 AI 应用程序与外部工具和服务通信。AgentLog 实现了 MCP Server，提供五个核心工具：

| 工具 | 功能 |
|------|------|
| **`log_turn`** | 逐轮上报每一条消息（user / assistant / tool），首次调用自动创建 Trace |
| **`log_intent`** | 任务结束后调用一次，记录整体意图、决策逻辑、受影响文件 |
| **`query_historical_interaction`** | 检索历史 AI 交互记录，支持多维过滤 |
| **`claim_pending_trace`** | 启动时调用，认领分配给当前 Agent 的待处理 Trace |
| **`query_traces`** | 查询 Trace 列表（语义检索）或直接获取单个 Trace 详情 |

## 调用流程

```
┌─────────────────────────────────────────────────────────────┐
│  启动时：claim_pending_trace()                              │
│  检查是否有待认领的 Trace                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  对话开始：log_turn(role="user", ...)                       │
│  → 返回 trace_id，后续必须传入                              │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
┌─────────────────────┐                 ┌─────────────────────┐
│  log_turn           │                 │  log_turn           │
│  (role="assistant") │                 │  (role="tool")      │
│  记录 AI 回复        │                 │  记录工具执行结果    │
└─────────────────────┘                 └─────────────────────┘
         │                                         │
         └────────────────────┬─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  任务完成：log_intent(task="...", affected_files=[...])     │
│  → 归档 Trace，标记完成                                     │
└─────────────────────────────────────────────────────────────┘
```

## 工具详解

### 1. log_turn — 逐轮消息上报

**⚠️ 强制协议 - 禁止跳过 ⚠️**

每轮对话必须按以下顺序调用本工具，记录完整的 AI 编码过程！

**调用流程：**
```
Step 1. log_turn(role="user", ...)         ← 对话开始时调用（禁止省略）
Step 2. log_turn(role="tool", ...)         ← 每次工具执行后调用
Step 3. log_turn(role="assistant", ...)    ← 每次回复后调用
循环 Step 2-3 直到任务完成
Step 4. log_intent(...)                    ← 任务完成时调用一次
```

**⚠️ 禁止行为：**
- ✗ 不调用 log_turn 就直接执行 read/edit/bash（将导致编码过程无法记录）
- ✗ 省略 trace_id（会导致每条消息创建独立 Trace，对话碎片化）
- ✗ 在 log_turn 之前调用 log_intent（将导致存证数据不完整）
- ✗ 批量延迟上报（必须实时逐条调用）

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `trace_id` | string | 否 | Trace ID（首次调用时省略，后续必须传入） |
| `role` | string | ✅ | 消息角色：`user` / `assistant` / `tool` |
| `content` | string | ✅ | 消息内容 |
| `model` | string | 条件 | 角色为 `assistant` 时必须传入 |
| `tool_name` | string | 否 | 角色为 `tool` 时的工具名称（如 `bash`、`read`、`edit`） |
| `tool_input` | string | 否 | 工具输入参数摘要 |
| `reasoning` | string | 否 | 推理模型的思考过程（DeepSeek-R1 / Claude extended thinking） |
| `workspace_path` | string | 否 | 工作区根目录绝对路径（仅首次调用时有效） |
| `token_usage` | object | 否 | 当前累计 Token 用量 |

**返回：**
```json
{
  "trace_id": "01AR9...",
  "span_id": "01AR9...",
  "status": "ok",
  "is_new_trace": true,
  "message": "新 Trace 已创建，请在此后调用中传入 trace_id=..."
}
```

### 2. log_intent — 任务归档

**⚠️ 强制协议 - 禁止跳过 ⚠️**

本工具必须在 log_turn 之后调用，是整个记录流程的最后一步。

**正确调用顺序：**
```
Step 1. log_turn(role="user", ...)           ← 建立 Trace
Step 2. log_turn(role="tool"/"assistant")    ← 逐条记录（循环）
Step 3. log_intent(...)                      ← 任务归档（仅一次）
```

**⚠️ 如果省略中间的 log_turn(tool/assistant) 调用，仅仅在最后调用 log_intent，将导致存证数据不完整，无法追溯 AI 的实际编码过程！**

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task` | string | ✅ | 当前执行的任务或目标（简要概述） |
| `model` | string | ✅ | AI 模型完整名称 |
| `trace_id` | string | 建议 | 已有 Trace ID（强烈建议传入） |
| `affected_files` | array | 否 | 受影响的文件路径列表 |
| `workspace_path` | string | 否 | 工作区根目录绝对路径 |
| `transcript` | array | 否 | 完整逐轮对话记录（未使用 log_turn 时） |
| `token_usage` | object | 否 | Token 用量统计 |
| `duration_ms` | number | 否 | 交互总耗时（毫秒） |

### 3. query_historical_interaction — 查询历史交互

**【只读】** 从 AgentLog 数据库检索历史 AI 交互记录，供其他 Agent 分析或调试使用。

**支持多维过滤：**

| 过滤参数 | 说明 |
|----------|------|
| `session_id` | 精确查询单条会话（返回完整 transcript） |
| `filename` | 查找涉及指定文件的会话（模糊匹配） |
| `keyword` | 在 prompt / response / note 中全文搜索 |
| `start_date` / `end_date` | 时间范围过滤（ISO 8601） |
| `commit_hash` | 查找绑定到指定 Commit 的会话 |
| `provider` | 按模型提供商过滤（如 `anthropic` / `deepseek`） |
| `source` | 按 Agent 来源过滤（如 `opencode` / `cline`） |
| `page` / `page_size` | 分页控制（默认第 1 页，每页 20 条） |
| `include_transcript` | 是否在列表结果中包含完整 transcript |

**不传任何参数时返回最近 20 条记录。**

### 4. claim_pending_trace — 认领待处理 Trace

启动时自动调用，检查并认领分配给当前 Agent 的 pending trace。成功认领后，trace 会从 pending 移动到 active 状态。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `workspace_path` | string | 否 | 工作区路径（默认使用 MCP 服务当前目录） |

**返回：**
```json
{
  "success": true,
  "claimed": true,
  "traceId": "01AR9...",
  "sessionId": "01AR9...",
  "message": "成功认领 Trace 01AR9..."
}
```

### 5. query_traces — 查询 Trace

查询 Trace 列表（语义检索）或直接获取单个 Trace 详情。

**使用方式：**
- 传入 `trace_id`：直接获取指定 Trace 的详情（推荐用于 Handoff 场景）
- 不传 `trace_id`：语义搜索 traces.task_goal 和 spans.payload

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `trace_id` | string | 否 | Trace ID（直接获取详情，用于 Handoff 后恢复上下文） |
| `keyword` | string | 否 | 搜索关键字（匹配 task_goal 和 span payload） |
| `workspace_path` | string | 否 | 工作区路径（过滤同一项目） |
| `status` | string | 否 | 按状态过滤：`running` / `paused` / `completed` / `failed` |
| `limit` | number | 否 | 返回数量（默认 10） |
| `page` | number | 否 | 页码（默认 1） |

## 配置方式概览

| 配置方式 | 适用场景 | 操作复杂度 |
|----------|----------|------------|
| **Docker + 手动配置** | 使用 Cline、Cursor、OpenCode、Roo Code 等 | 中等（编辑 JSON） |
| **VS Code 插件自动配置向导** | VS Code 插件用户 | 简单（图形界面） |
| **环境变量** | 开发调试，临时配置 | 简单（命令行） |

## 手动配置文件

### Cline 配置示例

编辑 `~/.cline/mcp.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "npx",
      "args": [
        "-y",
        "@agentlog/backend",
        "mcp"
      ],
      "env": {
        "AGENTLOG_PORT": "7892",
        "AGENTLOG_BACKEND_URL": "http://localhost:7892"
      }
    }
  }
}
```

### OpenCode 配置

OpenCode 通过 `AGENTS.md` 文件配置 MCP 规则。AgentLog 会自动将调用规则写入全局 `AGENTS.md`。

### 通用 MCP 配置结构

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "node",
      "args": [
        "/path/to/agentlog/packages/backend/dist/mcp.js"
      ],
      "env": {
        "AGENTLOG_PORT": "7892",
        "AGENTLOG_BACKEND_URL": "http://localhost:7892"
      }
    }
  }
}
```

## 环境变量配置

| 环境变量 | 默认值 | 说明 |
|----------|--------|------|
| `AGENTLOG_PORT` | `7892` | 后端服务端口 |
| `AGENTLOG_BACKEND_URL` | `http://localhost:7892` | 后端服务地址 |
| `AGENTLOG_DB_PATH` | `~/.agentlog/agentlog.db` | 数据库存储路径 |
| `AGENTLOG_SOURCE` | 自动推断 | 强制指定会话来源（如 `cline`, `opencode`） |
| `AGENTLOG_AGENT_ID` | 自动推断 | OpenClaw Agent 标识 |

## 故障排查

### 常见问题

#### 1. MCP 连接失败
**症状**：AI Agent 提示无法连接 AgentLog MCP Server
**解决**：
- 检查 AgentLog 后台服务是否运行：`curl http://localhost:7892/api/sessions`
- 验证 MCP 配置文件路径和权限
- 查看 AgentLog 扩展日志

#### 2. 会话未记录
**症状**：AI 交互后，AgentLog 侧边栏未显示新会话
**解决**：
- 确认 AI Agent 已重启（配置变更后需重启）
- 检查 AI Agent 是否支持 MCP 协议
- 验证 `log_turn` 工具是否被正确调用

#### 3. trace_id 丢失
**症状**：每次调用都创建新 Trace
**解决**：
- 从首次 log_turn 返回的 JSON 中提取 trace_id 并缓存
- 后续所有调用必须传入该 trace_id

### 日志查看

```bash
# 查看后端服务日志
tail -f ~/.agentlog/agentlog.log

# 手动启动 MCP Server 查看输出
cd /path/to/agentlog
npx tsx packages/backend/src/mcp.ts
```

## 最佳实践

1. **严格遵循调用流程**：log_turn → log_intent，确保数据完整
2. **始终传入 trace_id**：首次调用后缓存，后续必须传入
3. **实时逐条调用**：不要批量延迟上报
4. **记录 tool 调用**：每次工具执行后调用 log_turn(role="tool", ...)
5. **任务完成后归档**：调用 log_intent 标记 Trace 完成

## 后续支持

如需支持新的 AI Agent 或遇到配置问题，请：

1. 查看 [GitHub Issues](https://github.com/agentloglabs/agentlog/issues)
2. 提交新 Issue 时，附上：
   - AI Agent 名称和版本
   - 配置文件内容（脱敏后）
   - 错误日志截图
