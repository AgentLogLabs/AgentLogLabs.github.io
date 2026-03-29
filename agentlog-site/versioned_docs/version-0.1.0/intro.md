---
sidebar_position: 1
---

# AgentLog — AI 编程飞行记录仪

> 一款本地轻量后台服务 + MCP 协议集成，通过 Git Commit 绑定 AI Agent 交互日志，支持一键导出周报或 PR 说明。

## 两种使用方式

AgentLog 提供两种并列的使用方式：

| 方式 | 组成部分 | 适用场景 |
|------|----------|----------|
| **VS Code 插件** | VS Code 插件 + 内置后端 | 仅使用 VS Code 的用户，开箱即用 |
| **Docker 后端 + 外部 AI Agent** | Docker 部署后端服务 + 任意 MCP 客户端 | 使用 Cline、Cursor、OpenCode、Roo Code 等，或不打算使用 VS Code 插件的用户 |

## 核心特性

### 🎙️ MCP 协议主动上报
通过 Model Context Protocol 标准，让 AI Agent（Cline、Roo Code、OpenCode 等）主动上报交互记录，无需拦截 API 请求。支持 SSE 流式响应实时记录 AI 输出，跨平台兼容 Windows/macOS/Linux。

### 🧠 推理过程保存
专项支持 DeepSeek-R1 的 `<think>` 推理链和 Claude extended thinking，完整存储中间思考步骤，便于后续追溯决策逻辑。

### 🔗 Git Commit 绑定
通过 post-commit 钩子，自动将每次提交与相关 AI 会话关联。也支持在侧边栏手动绑定/解绑会话与 Commit，批量绑定多个会话到同一 Commit。

### 🌿 Git Worktree 多 Agent 并行
多个 AI Agent 可同时在同一仓库的不同 worktree 上独立工作，各自会话精准绑定到对应 Commit，互不干扰。只需在任意一个 worktree 安装 Git 钩子，所有 worktree 均自动支持。

> 详见：[核心特性详解 - Git Worktree](./reference/features#git-worktree-多-agent-并行)

### 📄 Commit 上下文文档
自动生成 Markdown/JSON/XML 格式的 AI 交互上下文文档，便于注入新 AI 对话或 Code Review。

### 📊 侧边栏面板
VS Code 侧边栏实时显示未提交的 AI 会话、历史 Commit 记录及统计数据。点击会话节点查看完整交互记录，支持 Markdown 渲染和推理过程折叠。

### 📝 一键导出
支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格。可按时间范围、模型/来源过滤，配置是否包含推理过程。

### 🏠 本地优先
所有数据存储在本机 SQLite（`~/.agentlog/agentlog.db`），完全离线可用。后台服务仅监听 `127.0.0.1`，无遥测不上报。

> 详见：[核心特性详解 - 数据存储](./reference/features#数据存储)

### 🌐 中英文国际化
完整支持中文和英文输出，界面和导出文档自由切换。

### 🔄 核心工作流
三大核心工作流无缝衔接：
1. **MCP 主动记录**：AI Agent → MCP Server → Backend → SQLite
2. **Git Hook 绑定**：`git commit` → Hook → Backend → 关联游离会话
3. **上下文复活**：历史 Commit → 提取 AI 记忆 → 粘贴到新对话

> 详见：[核心特性详解 - 核心工作流](./reference/features#核心工作流)

## 典型使用场景

### 记录 AI 会话
在 VS Code 中使用 Cline、Cursor、OpenCode 等 AI Agent 编码时，AgentLog 自动通过 MCP 协议记录每一次交互，包括完整的 Prompt、Response 和推理过程。打开侧边栏即可查看所有会话。

### 自动绑定 Git Commit
完成代码修改后执行 `git commit`，AgentLog 自动将本次的 AI 会话绑定到该 Commit。在侧边栏「历史 Commit 记录」区域可查看每个 Commit 关联的完整 AI 交互历史。

### 一键导出周报 / PR 说明
需要汇报工作时，AgentLog 可一键导出中文周报，按项目和时间汇总所有 AI 辅助的代码变更。绑定到 Commit 后，还可生成带 AI 交互上下文的 PR 说明，方便 Reviewer 理解修改意图。

### 复活历史上下文
项目交接或中断后继续工作时，可以从历史 Commit 中提取当时的 AI 交互记录，一键复活到新对话中。新 AI 无需重复解释背景，直接继承历史上下文继续工作。

### 多项目并行管理
同时开发多个项目时，AgentLog 自动按工作区隔离会话记录。每个项目的 AI 交互独立存储，侧边栏支持按仓库路径筛选。Git Worktree 场景下，不同 worktree 的会话也能精准绑定到对应 Commit。

## 快速导航

- **[VS Code 插件快速开始](./quick-start)** - 通过 VS Code 插件使用 AgentLog
- **[Docker 部署](./docker-deployment)** - 通过 Docker 部署后端，支持任意 AI Agent
- **[MCP 集成](./mcp-integration)** - 了解 MCP 协议和工具使用
- **[常见问题](./faq)** - 解答常见疑问