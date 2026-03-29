---
sidebar_position: 2
---

# 核心特性

AgentLog 作为“AI 编程飞行记录仪”，提供六大核心功能，解决 AI 生成代码上下文丢失的痛点。

## 🎙️ 基于 MCP 协议主动上报

**工作原理**：AgentLog 采用 **Model Context Protocol (MCP)** 标准，让 AI Agent 主动上报交互记录。AI Agent（如 Cline、Roo Code、OpenCode、Cursor 等）通过 stdio 连接 AgentLog MCP Server，调用 `log_turn` / `log_intent` 工具逐轮或汇总上报交互数据。

**支持的工具**：
- **Cline**（VS Code 插件）
- **Roo Code**（Cursor 内置 AI）
- **OpenCode**（命令行 AI 编程工具）
- **其他支持 MCP 的 AI Agent**

**优势**：
- **标准化协议**：无需 hack 或 monkey-patch，避免兼容性问题
- **完整推理链支持**：专项支持 DeepSeek-R1 的 `<think>` 推理链，完整存储中间思考步骤
- **流式响应兼容**：支持 SSE 流式响应，实时记录 AI 输出
- **跨平台兼容**：Windows / macOS / Linux 全平台支持
- **离线优先**：所有数据存储在本机，完全离线可用

## 🧠 推理过程保存

**DeepSeek-R1 专项支持**：
```xml
<think>
我是 DeepSeek-R1，正在分析用户的需求...
第一步：检查代码结构...
第二步：识别重构机会...
</think>
我将帮你重构这个函数...
```

**完整记录 AI 思考路径**：
- 捕获推理模型（DeepSeek-R1、Claude extended thinking）的完整思考过程
- 与最终回复一并存储，便于后续追溯决策逻辑
- 支持多轮对话中的推理链跟踪

## 🔗 Git Commit 绑定

**自动绑定机制**：
1. **MCP 上报**：AI Agent 通过 `log_turn` / `log_intent` 上报会话（此时为“游离会话”）
2. **Git Hook 触发**：用户执行 `git commit` 时触发 `prepare-commit-msg` 钩子
3. **自动关联**：AgentLog 将当前工作区所有未绑定的会话与本次 Commit 关联
4. **数据持久化**：更新 `agent_sessions.commit_hash` 和 `commit_bindings.session_ids`

**手动操作支持**：
- 在 VS Code 侧边栏手动绑定/解绑会话与 Commit
- 批量绑定多个会话到同一 Commit
- 查看 Commit 关联的所有 AI 交互记录

## 📊 侧边栏面板

**VS Code 侧边栏集成**：
- **📦 未提交的 AI 会话**：实时显示当前工作区的游离会话
- **📚 历史 Commit 记录**：按时间倒序展示已绑定的 Commit 及其关联会话
- **📈 统计数据**：按模型、时间、文件等维度的使用统计

**会话详情查看**：
- 点击会话节点，在右侧 Webview 查看完整交互记录
- 支持 Markdown 渲染，高亮显示代码片段
- 可展开/收起推理过程，聚焦关键信息

## 📝 一键导出

**支持的导出格式**：

| 格式 | 用途 | 特点 |
|------|------|------|
| **中文周报** | 团队进度同步 | 汇总本周所有 AI 辅助的代码变更，按项目/功能分类 |
| **PR/Code Review 说明** | 代码审查 | 生成包含 AI 交互上下文的 PR 描述，方便 reviewer 理解修改意图 |
| **JSONL 原始数据** | 数据分析 | 完整的结构化数据，便于自定义分析或导入其他系统 |
| **CSV 表格** | 统计分析 | 按会话、模型、耗时等字段的表格数据，支持 Excel 分析 |

**导出配置选项**：
- 时间范围筛选
- 按模型/来源过滤
- 包含/排除推理过程
- 中英文输出切换

## 🏠 本地优先

**数据存储**：
- **数据库位置**：`~/.agentlog/agentlog.db`（SQLite）
- **环境变量覆盖**：`AGENTLOG_DB_PATH` 可自定义存储路径
- **自动备份**：支持定期备份到指定目录

**隐私与安全**：
- **纯本地存储**：所有数据存储在本机，不上传任何云端
- **本地网络**：后台服务仅监听 `127.0.0.1`，不对外网暴露
- **CORS 限制**：仅允许 `localhost` 和 VS Code Webview 来源
- **无遥测**：不收集任何使用统计数据，不联网上报

**数据保留**：
- 默认保留 90 天数据（可通过 `retentionDays` 配置调整）
- 支持手动清理历史数据
- 导出功能支持完整数据备份

## 🔄 核心工作流

AgentLog 的三大核心工作流无缝衔接：

1. **MCP 主动记录路径**：AI Agent → MCP Server → Backend → SQLite
2. **Git Hook 绑定路径**：`git commit` → Hook → Backend → 关联游离会话
3. **上下文复活路径**：历史 Commit → 提取 AI 记忆 → 粘贴到新对话

这三个工作流共同构成完整的“AI 编程飞行记录仪”体验，确保每一次 AI 辅助的代码变更都有迹可循、有据可查。