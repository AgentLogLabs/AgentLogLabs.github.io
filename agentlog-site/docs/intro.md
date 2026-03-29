---
sidebar_position: 1
---

# AgentLog — AI 编程行车记录仪

> 一款面向国内主流大模型的 VS Code/Cursor 插件 + 本地轻量后台，自动捕获 AI Agent 交互日志，与 Git Commit 绑定，一键导出周报或 PR 说明。

## 核心功能

- **🎙️ 自动捕获** - 拦截发往 DeepSeek / Qwen / Kimi 等 API 的请求，提取 Prompt + Response
- **🧠 推理过程保存** - 专项支持 DeepSeek-R1 的 `<think>` 推理链，完整存储中间思考步骤
- **🔗 Git Commit 绑定** - 通过 post-commit 钩子，自动将每次提交与相关 AI 会话关联
- **📊 侧边栏面板** - VS Code 侧边栏显示会话列表、Commit 绑定关系、统计数据
- **📝 一键导出** - 支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格
- **🏠 本地优先** - 所有数据存储在本机 SQLite，完全离线可用

## 快速导航

- **[快速开始](./quick-start)** - 立即开始使用 AgentLog
- **[安装指南](./installation)** - 详细的安装和配置步骤
- **[常见问题](./faq)** - 解答常见疑问