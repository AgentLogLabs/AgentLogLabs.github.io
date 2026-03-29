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

## 核心功能

- **🎙️ 基于 MCP 协议主动上报** - 通过 Model Context Protocol 标准，让 AI Agent（Cline、Roo Code、OpenCode 等）主动上报交互记录，无需拦截 API 请求，兼容性更好
- **🧠 推理过程保存** - 专项支持 DeepSeek-R1 的 `<think>` 推理链，完整存储中间思考步骤
- **🔗 Git Commit 绑定** - 通过 post-commit 钩子，自动将每次提交与相关 AI 会话关联
- **🌿 Git Worktree 支持** - 多个 AI Agent 可同时在不同 worktree 上并行工作，各自会话精准绑定到对应 Commit，互不干扰
- **📄 Commit 上下文文档** - 自动生成 Markdown/JSON/XML 格式的 AI 交互上下文文档，便于注入新 AI 对话或 Code Review
- **📊 侧边栏面板** - VS Code 侧边栏显示会话列表、Commit 绑定关系、统计数据
- **📝 一键导出** - 支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格
- **🏠 本地优先** - 所有数据存储在本机 SQLite，完全离线可用
- **🌐 中英文国际化** - 完整支持中文和英文输出，界面和导出文档自由切换

## 快速导航

- **[VS Code 插件快速开始](./quick-start)** - 通过 VS Code 插件使用 AgentLog
- **[Docker 部署](./docker-deployment)** - 通过 Docker 部署后端，支持任意 AI Agent
- **[MCP 集成](./mcp-integration)** - 了解 MCP 协议和工具使用
- **[常见问题](./faq)** - 解答常见疑问