---
sidebar_position: 1
---

# AgentLog — AI 编程飞行记录仪

<img src="/img/logo.png" width="128" />

> 一款面向国内主流大模型的 VS Code/Cursor 插件 + 本地轻量后台，自动捕获 AI Agent 交互日志，与 Git Commit 绑定，一键导出周报或 PR 说明。

[![Version](https://img.shields.io/badge/version-v1.1.1-blue.svg)](https://github.com/AgentLogLabs/agentlog)

## 背景与痛点

国内开发者大量使用 Cursor、Cline 或基于 DeepSeek/Qwen API 的本地 Agent。代码虽然写得快，但过几天开发者自己都忘了当时 AI 为什么这么改，出了 Bug 无从下手。

**AgentLog** 解决的就是这个问题：在你与 AI 交互时，静默地在后台记录一切，并在你 `git commit` 时自动将这些记录与代码变更绑定。

## 核心价值

### 🎯 上下文永不断裂

传统 Agent 协作开发中，Agent 报错停止后，人类接手时"一脸懵逼"，只能去翻长达几千行的聊天记录。修复后 Git Commit 割裂，上下文彻底丢失。

AgentLog 通过 **Trace/Span 数据模型** 和 **sessions.json 接力机制**，确保人类接管后 Agent 能一键恢复完整上下文，实现真正的"上下文不掉线"。

### 🔗 人机协同追踪

你的每一次 Git 提交、每一条命令行干预，都会被自动捕获，并作为人类维度的 Span 挂载到当前的全局 TraceID 之下。这让 AgentLog 具备了真正意义上的 **JIT (Just-In-Time) 上下文恢复能力**。

## 典型使用场景

### 场景一：断点接管与人机混合接力赛 ⭐

**痛点**：AI Agent 报错卡死，人类接手时"一脸懵逼"，修复后 Git Commit 割裂。

```
1. Builder Agent 重构支付网关，20 分钟改了 15 个文件
2. 对接 Stripe 接口时遇到死锁，尝试 3 次修复失败后抛出异常
3. AgentLog 自动生成包含内存快照、变更 Diff、推理过程的 Ticket
4. 开发者收到通知，在 VS Code 点击 "Resume Ticket"
5. AgentLog 将 Builder 的核心决策和死锁原因注入 Cursor 对话框
6. 开发者修复死锁，执行 git commit
7. AgentLog Git Hook 触发，Span 101 + Span 102 + Commit Hash 完美缝合
```

**产品价值**：代码有出处，接盘无痛苦。

### 场景二：记录 AI 会话

在 VS Code 中使用 Cline、Cursor、OpenCode 等 AI Agent 编码时，AgentLog 自动通过 MCP 协议记录每一次交互，包括完整的 Prompt、Response 和推理过程。打开侧边栏即可查看所有会话。

### 场景三：自动绑定 Git Commit

完成代码修改后执行 `git commit`，AgentLog 自动将本次的 AI 会话绑定到该 Commit。在侧边栏「历史 Commit 记录」区域可查看每个 Commit 关联的完整 AI 交互历史。

### 场景四：一键导出周报 / PR 说明

需要汇报工作时，AgentLog 可一键导出中文周报，按项目和时间汇总所有 AI 辅助的代码变更。绑定到 Commit 后，还可生成带 AI 交互上下文的 PR 说明，方便 Reviewer 理解修改意图。

### 场景五：复活历史上下文

项目交接或中断后继续工作时，可以从历史 Commit 中提取当时的 AI 交互记录，一键复活到新对话中。新 AI 无需重复解释背景，直接继承历史上下文继续工作。

### 场景六：多项目并行管理

同时开发多个项目时，AgentLog 自动按工作区隔离会话记录。每个项目的 AI 交互独立存储，侧边栏支持按仓库路径筛选。Git Worktree 场景下，不同 worktree 的会话也能精准绑定到对应 Commit。

## 两种使用方式

| 方式 | 组成部分 | 适用场景 |
|------|----------|----------|
| **VS Code 插件** | VS Code 插件 + 内置后端 | 仅使用 VS Code 的用户，开箱即用 |
| **Docker 后端 + 外部 AI Agent** | Docker 部署后端服务 + 任意 MCP 客户端 | 使用 Cline、Cursor、OpenCode、Roo Code 等 |

## 核心功能

| 功能 | 说明 |
|------|------|
| 🎙️ **自动捕获** | 拦截发往 DeepSeek / Qwen / Kimi 等 API 的请求，提取 Prompt + Response |
| 🧠 **推理过程保存** | 专项支持 DeepSeek-R1 的 `<think>` 推理链，完整存储中间思考步骤 |
| 🔗 **Git Commit 绑定** | 通过 post-commit 钩子，自动将每次提交与相关 AI 会话关联 |
| 🌿 **Git Worktree 支持** | 多个 AI Agent 可同时在不同 worktree 上并行工作，各自会话精准绑定到对应 Commit，互不干扰 |
| 📊 **侧边栏面板** | VS Code 侧边栏显示会话列表、Commit 绑定关系、统计数据 |
| 📝 **一键导出** | 支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格 |
| 🏠 **本地优先** | 所有数据存储在本机 SQLite（`~/.agentlog/agentlog.db`），完全离线可用 |
| 🔄 **上下文接力** | sessions.json 机制支持 Agent 之间、于人机之间的上下文无缝切换 |

## 支持的模型与工具

### 国内主流模型

| 模型 | 提供商 | 说明 |
|------|--------|------|
| DeepSeek-V3 / R1 | DeepSeek | 完整支持推理链捕获 |
| 通义千问 Qwen-Max / Plus | 阿里云 DashScope | OpenAI 兼容模式 |
| Kimi / Moonshot | 月之暗面 | OpenAI 兼容模式 |
| 豆包 | 字节跳动 Ark | OpenAI 兼容模式 |
| ChatGLM | 智谱 AI | OpenAI 兼容模式 |
| 本地模型 | Ollama / LM Studio | 本地 HTTP 接口 |

### 支持的 AI 编程工具

- **Cline**（VS Code 插件）
- **Cursor**（IDE 内置 AI）
- **Continue**（VS Code 插件）
- **OpenCode**（支持上下文接力）
- **直接 API 调用**（通过 HTTP 拦截）

## 技术栈

| 层次 | 技术 |
|------|------|
| Monorepo | pnpm workspaces |
| 语言 | TypeScript 5.x（全栈） |
| 后台框架 | Fastify 4.x |
| 数据库 | SQLite via `better-sqlite3`（WAL 模式） |
| Git 集成 | `simple-git` |
| VS Code API | `@types/vscode ^1.85` |
| 拦截机制 | Node.js `http/https` Monkey-patch |
| ID 生成 | `nanoid` / ULID |

## 快速导航

- **[快速开始](./quick-start)** - 通过 VS Code 插件使用 AgentLog
- **[安装指南](./installation)** - 详细安装步骤
- **[Docker 部署](./docker-deployment)** - 通过 Docker 部署后端，支持任意 AI Agent
- **[MCP 集成](./mcp-integration)** - 了解 MCP 协议和工具使用
- **[常见问题](./faq)** - 解答常见疑问
