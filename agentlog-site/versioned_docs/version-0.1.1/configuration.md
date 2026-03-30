---
sidebar_position: 2
---

# 配置详解

AgentLog 提供灵活的配置选项，可通过 VS Code 设置、环境变量和命令行参数进行定制。

## VS Code 设置

在 VS Code 设置（`settings.json`）中，所有配置项以 `agentlog.` 为前缀。

### 核心配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `backendUrl` | `string` | `http://localhost:7892` | 后台服务地址，可指向远程服务 |
| `autoBindOnCommit` | `boolean` | `true` | `git commit` 时自动绑定最近未绑定的会话 |
| `retentionDays` | `number` | `90` | 数据保留天数，`0` 表示永久保留 |
| `autoStartBackend` | `boolean` | `true` | VS Code 启动时自动启动后台服务 |
| `debug` | `boolean` | `false` | 开启调试日志，输出详细运行信息 |
| `exportLanguage` | `string` | `zh` | 导出语言，可选 `zh`（中文）或 `en`（英文） |

### MCP 配置

MCP (Model Context Protocol) 相关配置：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `mcp.clientConfigPath` | `string` | `""` | **【已废弃】** 外部 AI Agent 的 MCP 配置文件路径。请改用 **AgentLog: 配置 AI Agent MCP 接入** 命令自动配置。 |
| `mcp.configuredClients` | `array` | `[]` | **（插件自动维护）** 已完成 MCP 配置的 AI 客户端列表，请勿手动编辑。 |

### 设置示例

```json
{
  "agentlog.backendUrl": "http://localhost:7892",
  "agentlog.autoBindOnCommit": true,
  "agentlog.retentionDays": 90,
  "agentlog.debug": false,
  "agentlog.mcp": {
    "clientConfigPath": ""
  }
}
```

## 环境变量

AgentLog 后台服务支持以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `AGENTLOG_PORT` | `7892` | 后台服务监听端口 |
| `AGENTLOG_BACKEND_URL` | `http://localhost:7892` | 后端服务地址（MCP Server 使用） |
| `AGENTLOG_DB_PATH` | `~/.agentlog/agentlog.db` | 数据库文件存储路径 |
| `AGENTLOG_LOG_LEVEL` | `info` | 日志级别：`debug`、`info`、`warn`、`error` |
| `AGENTLOG_LOG_FILE` | `~/.agentlog/agentlog.log` | 日志文件路径，`stdout` 表示输出到控制台 |
| `AGENTLOG_CORS_ORIGIN` | `http://localhost:3000` | CORS 允许的源，多个用逗号分隔 |
| `AGENTLOG_SOURCE` | 自动推断 | 强制指定会话来源（如 `cline`、`opencode`） |
| `AGENTLOG_PROVIDER` | 自动推断 | 强制指定模型提供商（如 `deepseek`、`openai`） |

### 使用示例

```bash
# 启动后台服务时设置环境变量
export AGENTLOG_PORT=8888
export AGENTLOG_DB_PATH=/custom/path/agentlog.db
export AGENTLOG_LOG_LEVEL=debug

# 然后启动服务
pnpm dev
```

## 数据库配置

### SQLite 配置

AgentLog 使用 SQLite 存储数据，可通过以下方式优化：

1. **WAL 模式**：默认启用 Write-Ahead Logging，提高并发性能
2. **连接池**：内置连接池管理，避免频繁打开/关闭连接
3. **自动迁移**：启动时自动检查并执行数据库迁移

### 自定义数据库路径

```bash
# 通过环境变量指定
export AGENTLOG_DB_PATH=/path/to/custom/agentlog.db

# 或通过命令行参数（如果支持）
node dist/index.js --db-path /custom/path/agentlog.db
```

### 备份与恢复

```bash
# 备份数据库
cp ~/.agentlog/agentlog.db ~/backup/agentlog_$(date +%Y%m%d).db

# 恢复数据库（停止服务后）
cp ~/backup/agentlog_backup.db ~/.agentlog/agentlog.db
```

## MCP Server 配置

### 命令行参数

运行 MCP Server 时可指定参数：

```bash
# 开发模式
npx tsx packages/backend/src/mcp.ts

# 生产模式
node packages/backend/dist/mcp.js

# 指定后端地址
AGENTLOG_BACKEND_URL=http://localhost:8888 node dist/mcp.js
```

### MCP 客户端配置

各 AI Agent 的 MCP 配置文件示例：

**Cline (`~/.cline/mcp.json`)**：
```json
{
  "mcpServers": {
    "agentlog": {
      "command": "npx",
      "args": ["-y", "@agentlog/backend", "mcp"],
      "env": {
        "AGENTLOG_PORT": "7892"
      }
    }
  }
}
```

**OpenCode (自动写入 `AGENTS.md`)**：
AgentLog 插件会自动将调用规则写入 OpenCode 的全局配置文件。

## Git Hook 配置

### 自动安装

AgentLog 提供命令自动安装 Git Hook：

1. 在 VS Code 命令面板执行 `AgentLog: 安装 Git Hook`
2. 或在终端执行：`curl -X POST http://localhost:7892/api/commits/hook/install`

### 手动配置

如果自动安装失败，可手动创建 `.git/hooks/prepare-commit-msg`：

```bash
#!/bin/bash
# AgentLog Git Hook - 自动绑定 AI 会话到 Commit

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# 调用 AgentLog 后端 API
curl -s -X POST http://localhost:7892/api/commits/hook \
  -H "Content-Type: application/json" \
  -d "{
    \"commitHash\": \"$SHA1\",
    \"message\": \"$(cat $COMMIT_MSG_FILE)\",
    \"workspacePath\": \"$(pwd)\"
  }" > /dev/null 2>&1 &
```

### 多仓库支持

AgentLog 自动识别当前 Git 仓库路径，支持同时监控多个仓库：

- 每个仓库独立记录会话
- Git Hook 仅绑定当前仓库的会话
- 侧边栏按仓库路径筛选

## 高级配置

### 自定义日志格式

通过环境变量配置日志输出：

```bash
# JSON 格式日志，便于日志收集系统处理
export AGENTLOG_LOG_FORMAT=json

# 简单文本格式（默认）
export AGENTLOG_LOG_FORMAT=text
```

### 性能调优

对于大型项目或高频使用场景：

```bash
# 增加数据库连接池大小
export AGENTLOG_DB_POOL_SIZE=10

# 调整 WAL 检查点间隔
export AGENTLOG_DB_WAL_CHECKPOINT=1000

# 启用查询缓存
export AGENTLOG_DB_CACHE_SIZE=-64000
```

### 网络配置

```bash
# 绑定到特定网络接口
export AGENTLOG_HOST=127.0.0.1  # 仅本地访问（默认）
export AGENTLOG_HOST=0.0.0.0    # 所有接口（注意安全风险）

# 设置请求超时
export AGENTLOG_REQUEST_TIMEOUT=30000  # 30秒
```

## 配置验证

### 检查配置状态

```bash
# 检查后端服务是否运行
curl http://localhost:7892/health

# 检查数据库连接
curl http://localhost:7892/api/sessions/stats

# 查看当前配置
curl http://localhost:7892/api/config
```

### 诊断命令

AgentLog VS Code 插件提供诊断命令：

1. **`AgentLog: 验证 MCP 连接`**：检查 MCP 配置和后端连接
2. **`AgentLog: 查看日志`**：打开后端服务日志
3. **`AgentLog: 重置配置`**：恢复默认配置（谨慎使用）

## 故障排除

### 配置不生效
1. 检查配置文件路径和权限
2. 重启 VS Code 或后端服务
3. 查看扩展日志确认配置加载

### 服务启动失败
1. 检查端口占用：`lsof -i :7892`
2. 验证数据库文件权限
3. 查看错误日志：`~/.agentlog/agentlog.log`

### MCP 连接问题
1. 确认 MCP 配置文件路径正确
2. 重启 AI Agent 使配置生效
3. 检查 MCP Server 是否运行：`ps aux | grep mcp`

## 最佳实践

### 开发环境
- 启用 `debug` 模式便于排查问题
- 设置较短的 `retentionDays` 避免数据积累
- 定期清理测试数据

### 生产环境
- 使用自定义数据库路径，避免误删
- 设置合适的日志级别，避免日志过大
- 定期备份数据库文件

### 团队协作
- 统一团队的配置模板
- 使用环境变量管理敏感配置
- 文档化配置变更流程