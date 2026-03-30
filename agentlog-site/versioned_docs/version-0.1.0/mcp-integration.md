---
sidebar_position: 4
---

# MCP 集成指南

本文档详细说明 AgentLog 的 MCP 协议实现、工具列表及调用规则。

> **提示**：如果你使用 Docker 部署后端，请先阅读 [Docker 部署](./docker-deployment) 文档完成服务部署和 AI Agent 配置。

## MCP 协议简介

**Model Context Protocol (MCP)** 是一个开放协议，允许 AI 应用程序与外部工具和服务通信。AgentLog 实现了 MCP Server，提供三个核心工具：

1. **`log_turn`** - 逐轮上报每一条消息（user / assistant / tool）
2. **`log_intent`** - 任务结束后调用一次，记录整体意图和受影响文件
3. **`query_historical_interaction`** - 检索历史交互记录

## 配置方式概览

| 配置方式 | 适用场景 | 操作复杂度 |
|----------|----------|------------|
| **Docker + 手动配置** | 使用 Cline、Cursor、OpenCode、Roo Code 等 | 中等（编辑 JSON） |
| **VS Code 插件自动配置向导** | VS Code 插件用户 | 简单（图形界面） |
| **环境变量** | 开发调试，临时配置 | 简单（命令行） |

## 自动配置向导（VS Code 插件）

AgentLog VS Code 插件提供了图形化配置向导，支持主流 AI Agent 的自动配置。

### 启动配置向导

1. 在 VS Code 中打开命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入并选择：`AgentLog: 配置 AI Agent MCP 接入`

### 支持的客户端

向导支持以下 AI Agent 的自动配置：

| AI Agent | 配置文件位置 | 自动配置内容 |
|----------|--------------|--------------|
| **Cline** | `~/.cline/mcp.json` | 添加 AgentLog MCP Server 配置 |
| **OpenCode** | `~/.opencode/AGENTS.md` | 添加 AgentLog 调用规则 |
| **Cursor** | `~/.cursor/mcp.json` | 添加 AgentLog MCP Server 配置 |
| **Roo Code** | `~/.roo/mcp.json` | 添加 AgentLog MCP Server 配置 |
| **其他 MCP 客户端** | 用户自定义路径 | 添加标准 MCP 配置 |

### 配置步骤

1. **选择客户端类型**：从列表中选择你要配置的 AI Agent
2. **验证配置文件**：向导会自动检测现有配置文件
3. **确认写入**：确认后将 AgentLog MCP 配置写入对应文件
4. **重启客户端**：重启 AI Agent 使配置生效

### 配置验证

配置完成后，可执行 `AgentLog: 验证 MCP 连接` 命令，检查：
- MCP 配置文件是否正确
- 后端服务是否可连接
- OpenCode 规则文件是否已更新

## 手动配置文件

对于不支持自动配置的 AI Agent，或需要自定义配置的用户，可手动编辑 MCP 配置文件。

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

### Cline Docker 配置示例

如果使用 Docker 部署后端，可通过 Docker 运行 MCP Server：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

### OpenCode 配置

OpenCode 通过 `AGENTS.md` 文件配置 MCP 规则。AgentLog 会自动将调用规则写入全局 `AGENTS.md`，包含：

```markdown
## AgentLog MCP 使用规则

你已接入 AgentLog MCP Server（工具名前缀：`agentlog-mcp`），必须严格按以下规则调用其工具：

### 工具列表
- `agentlog_log_turn` - 每轮消息产生后立即调用
- `agentlog_log_intent` - 任务整体完成后调用一次
- `agentlog_query_historical_interaction` - 需要检索历史记录时调用

...（完整规则见实际写入内容）
```

### OpenCode Docker 配置

编辑 `~/.opencode/mcp-servers.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

### 通用 MCP 配置结构

大多数 MCP 客户端使用类似的 JSON 配置结构：

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
        "AGENTLOG_BACKEND_URL": "http://localhost:7892",
        "AGENTLOG_DB_PATH": "~/.agentlog/agentlog.db"
      }
    }
  }
}
```

### Docker MCP 配置结构

使用 Docker 运行 MCP Server 时的配置结构：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

其中 `host.docker.internal` 用于在 Linux/Mac 上访问宿主机的 HTTP API 服务。

## 环境变量配置

可通过环境变量调整 MCP Server 行为：

| 环境变量 | 默认值 | 说明 |
|----------|--------|------|
| `AGENTLOG_PORT` | `7892` | 后端服务端口 |
| `AGENTLOG_BACKEND_URL` | `http://localhost:7892` | 后端服务地址 |
| `AGENTLOG_DB_PATH` | `~/.agentlog/agentlog.db` | 数据库存储路径 |
| `AGENTLOG_SOURCE` | 自动推断 | 强制指定会话来源（如 `cline`, `opencode`） |
| `AGENTLOG_PROVIDER` | 自动推断 | 强制指定模型提供商（如 `deepseek`, `openai`） |

## 故障排查

### 常见问题

#### 1. MCP 连接失败
**症状**：AI Agent 提示无法连接 AgentLog MCP Server
**解决**：
- 检查 AgentLog 后台服务是否运行：`curl http://localhost:7892/api/sessions`
- 验证 MCP 配置文件路径和权限
- 查看 AgentLog 扩展日志：VS Code 输出面板选择 "AgentLog"

#### 2. 会话未记录
**症状**：AI 交互后，AgentLog 侧边栏未显示新会话
**解决**：
- 确认 AI Agent 已重启（配置变更后需重启）
- 检查 AI Agent 是否支持 MCP 协议
- 验证 `log_turn` 工具是否被正确调用

#### 3. token_usage 字段不更新
**症状**：会话的 token 消耗统计停滞
**解决**：
- 确保 AI Agent 在 `log_turn` 调用中传入 `token_usage` 参数
- AgentLog v0.4.0+ 支持自动估算，但客户端传入更精确

### 日志查看

#### AgentLog 后端日志
```bash
# 查看后端服务日志
tail -f ~/.agentlog/agentlog.log

# 或通过端口检查服务状态
curl http://localhost:7892/health
```

#### MCP Server 日志
MCP Server 将日志输出到 stderr，可通过 AI Agent 的日志功能查看，或直接运行调试：

```bash
# 手动启动 MCP Server 查看输出
cd /path/to/agentlog
npx tsx packages/backend/src/mcp.ts
```

## 高级配置

### 自定义 MCP 工具调用

对于需要精细控制记录流程的场景，可参考以下调用模式：

**逐轮记录模式**（推荐）：
```javascript
// 每轮交互后调用 log_turn
await agentlog_log_turn({
  role: "user",
  content: "请帮我重构这个函数...",
  model: "deepseek-r1",
  workspace_path: "/projects/my-app"
});

await agentlog_log_turn({
  session_id: "上一步返回的 session_id",
  role: "assistant",
  content: "我将帮你重构...",
  reasoning: "分析原函数职责...",
  token_usage: { input_tokens: 150, output_tokens: 200 }
});
```

**任务汇总模式**：
```javascript
// 任务完成后调用 log_intent
await agentlog_log_intent({
  task: "重构用户认证模块",
  affected_files: ["src/auth.ts", "src/middleware.ts"],
  model: "deepseek-r1",
  workspace_path: "/projects/my-app",
  transcript: [...], // 完整的逐轮对话记录
  duration_ms: 120000
});
```

### 多工作区支持

AgentLog 自动识别工作区路径，支持同时监控多个项目：

1. 每个工作区的会话独立存储
2. Git Hook 自动绑定当前工作区的 Commit
3. 侧边栏按工作区筛选会话

### 开发调试模式

设置环境变量启用详细日志：

```bash
export AGENTLOG_DEBUG=true
export AGENTLOG_LOG_LEVEL=debug
```

## 最佳实践

1. **使用逐轮记录模式**：确保记录完整的交互过程，便于后续追溯
2. **及时绑定 Commit**：完成代码修改后尽快提交，避免游离会话过多
3. **定期导出备份**：重要项目定期导出 JSONL 格式的完整数据
4. **利用上下文复活**：接手他人项目时，先查看历史 Commit 的 AI 交互记录
5. **团队统一配置**：团队内部统一 MCP 配置，确保数据格式一致

## 后续支持

如需支持新的 AI Agent 或遇到配置问题，请：

1. 查看 [GitHub Issues](https://github.com/agentloglabs/agentlog/issues) 是否有类似问题
2. 提交新 Issue 时，附上：
   - AI Agent 名称和版本
   - 配置文件内容（脱敏后）
   - 错误日志截图
   - 操作系统和环境信息