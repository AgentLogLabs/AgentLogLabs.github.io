---
sidebar_position: 3
---

# 快速开始

## 方式一：VS Code 插件（推荐）

VS Code 插件包含内置后端，最适合仅使用 VS Code 的用户。

### 前置要求

- VS Code
- Node.js >= 18（仅开发模式需要）

### 安装步骤

1. 在 VS Code 中搜索并安装 **AgentLog** 插件
2. 安装完成后，VS Code 侧边栏会出现 AgentLog 面板
3. 插件会自动启动后台服务（端口 7892）

### 配置 AI Agent

安装插件后，需要配置你的 AI Agent 连接 AgentLog：

1. 打开 VS Code 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入并选择：`AgentLog: 配置 AI Agent MCP 接入`
3. 选择你使用的 AI Agent（Cline、Cursor、OpenCode 等）
4. 重启 AI Agent 使配置生效

### 启动后台服务

安装插件后，启动 AgentLog 后台服务：

1. 打开 VS Code 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入并选择：`AgentLog: 启动后台服务`

### 设置 Git Hook

启用自动 commit 绑定功能：

1. 打开 VS Code 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入并选择：`AgentLog: 设置 Git Hook`
3. 确认安装成功

### 验证连接

配置完成后，验证 AgentLog 是否正常工作：

1. 打开 VS Code 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入并选择：`AgentLog: 验证 MCP 连接`
3. 确认状态为"连接成功"

### 查看会话记录

配置完成后，AI Agent 的每次交互都会自动记录。在 VS Code 侧边栏查看：

1. 点击 VS Code 左侧边栏的 **AgentLog** 图标
2. **「未提交的 AI 会话」**区域显示当前的游离会话
3. 点击任意会话，可查看完整的 Prompt、Response 和推理过程
4. 使用顶部筛选器按时间、模型等条件过滤会话

### 绑定 Git Commit

完成代码修改后，提交代码时 AgentLog 会自动将会话与 Commit 关联：

1. 提交代码：`git add . && git commit -m "你的提交信息"`
2. Git Hook 自动将本次的 AI 会话绑定到该 Commit
3. 在侧边栏**「历史 Commit 记录」**区域查看所有已绑定的 Commit
4. 点击 Commit 节点，展开查看关联的完整 AI 交互记录

如需手动绑定：在侧边栏右键点击游离会话，选择「绑定到最新 Commit」或「选择 Commit 绑定」。

## 方式二：Docker 后端 + 外部 AI Agent

不依赖 VS Code，通过 Docker 部署后端服务，支持任意 MCP 客户端（Cline、Cursor、OpenCode、Roo Code 等）。

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

### 安装步骤

```bash
git clone https://github.com/agentlog/agentlog.git
cd agentlog/docker
cp .env.example .env
docker-compose up -d
```

### 配置 AI Agent

启动后，按照 [Docker 部署](./docker-deployment) 文档中的说明配置你的 AI Agent MCP 客户端。

### 验证服务

```bash
curl http://localhost:7892/health
```

## 下一步

- [VS Code 插件详细安装](./installation)
- [Docker 部署详细配置](./docker-deployment)
- [MCP 集成指南](./mcp-integration)
