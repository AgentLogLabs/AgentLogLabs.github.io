---
sidebar_position: 3
---

# 常见问题 (FAQ)

关于 AgentLog 的常见问题解答。

## 为什么 token 数量不一致？

这是**统计范围不同**导致的正常现象，两者均正确但反映不同维度的信息：

| 统计维度 | OpenCode/Cursor 显示 | AgentLog 记录 |
|----------|---------------------|---------------|
| **统计范围** | 整个上下文窗口 **所有内容** | 仅 **用户消息 + 助理回复** |
| **包含内容** | 系统提示 + 历史消息 + 工具结果 + 文件内容 + 模型输入输出 | 模型输入输出（API 返回的 `usage` 数据） |
| **典型值** | 数万 tokens | 数百 tokens |

### 详细解释

**OpenCode/Cursor 的 tokens 包含**：
1. **系统提示**：AGENTS.md、项目文档、指令等
2. **工具调用结果**：读取的文件内容、命令输出、代码片段等
3. **历史消息**：所有 user/assistant/tool 消息的完整文本
4. **当前模型输入**：上述所有内容的聚合上下文

**AgentLog 的 tokens 仅包含**：
- `input_tokens`：模型实际消耗的输入 token
- `output_tokens`：模型实际生成的输出 token

### 核心结论

1. **OpenCode/Cursor 显示的是「上下文窗口总负载」**
2. **AgentLog 记录的是「模型实际消耗」**
3. **两者互补**

## 为什么 token_usage 字段有时不更新？

**问题**：MCP 客户端有时未在 `log_turn` 调用中传入 `token_usage` 参数。

**解决方案**：
1. **客户端改进**：确保每次 `log_turn` 调用都传入累计 `token_usage`
2. **服务端估算**：AgentLog MCP 服务器 v0.4.0+ 会自动估算未收到 `token_usage` 时的消耗

**验证方法**：
```bash
curl -s http://localhost:7892/api/sessions/你的会话ID | jq '.data.tokenUsage'
```

## 数据存储在哪里？

所有数据均存储在本机，默认路径 `~/.agentlog/agentlog.db`。

## 如何导出数据？

AgentLog 支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格。

通过 Webview 侧边栏或 API 接口进行导出操作。