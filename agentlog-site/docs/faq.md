---
sidebar_position: 4
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
1. **系统提示**：AGENTS.md、项目文档、指令等（约 7,283 tokens）
2. **工具调用结果**：读取的文件内容、命令输出、代码片段等（约 50,000 tokens）
3. **历史消息**：所有 user/assistant/tool 消息的完整文本（约 1,421 tokens）
4. **当前模型输入**：上述所有内容的聚合上下文

**AgentLog 的 tokens 仅包含**：
- `input_tokens`：模型实际消耗的输入 token（约 285）
- `output_tokens`：模型实际生成的输出 token（约 400）
- 符合 MCP 协议 `token_usage` 字段的定义

### 核心结论

1. **OpenCode/Cursor 显示的是「上下文窗口总负载」**：反映 AI 处理的实际上下文大小和工作复杂度。
2. **AgentLog 记录的是「模型实际消耗」**：反映模型 API 的成本和资源消耗。
3. **两者互补**：前者帮助评估上下文复杂度，后者帮助核算 API 成本。

### 建议
- **无需担心**：这是预期行为，并非数据缺失或错误。
- **统一统计**：如需统一，可在 `log_turn(role='tool')` 中传入工具内容的实际 token 数。
- **界面区分**：建议在界面中明确标注「上下文 tokens」vs「模型 tokens」。

## 为什么 token_usage 字段有时不更新？

**问题**：OpenCode/Cursor 等 MCP 客户端有时未在 `log_turn` 调用中传入 `token_usage` 参数，导致会话的 token 消耗统计停滞。

**原因**：
- MCP 协议要求 `token_usage` 为累计值，需每次调用时传入
- 客户端实现可能遗漏该参数，尤其当工具调用频繁时
- 若不传入，AgentLog 后端保持原有 `token_usage` 不变

**解决方案**：
1. **客户端改进**：确保每次 `log_turn` 调用都传入累计 `token_usage`
2. **服务端估算（已实现）**：AgentLog MCP 服务器 v0.4.0+ 在未收到 `token_usage` 时会自动估算：
   - 从现有会话读取当前 `token_usage`
   - 按 4 字符 ≈ 1 token 估算新消息的 token 数
   - 用户/工具消息计入 `inputTokens`，助理消息计入 `outputTokens`
   - 更新后写回会话
3. **手动补全**：对已有会话运行脚本补全 token 统计

**验证方法**：
```bash
# 检查会话的 token_usage 是否自动更新
curl -s http://localhost:7892/api/sessions/你的会话ID | jq '.data.tokenUsage'
```

**注意事项**：
- 自动估算基于字符数，与模型实际消耗可能有 ±20% 误差
- 如需精确统计，仍需客户端传入准确的 `token_usage`
- 重启 OpenCode/Cursor 后 MCP 服务器重新加载，新逻辑生效

## 数据存储在哪里？

所有数据均存储在本机，默认路径 `~/.agentlog/agentlog.db`。

### 自定义存储路径
```bash
# 通过环境变量指定
export AGENTLOG_DB_PATH=/custom/path/agentlog.db

# 或通过配置文件
# 在 VS Code 设置中添加：
# "agentlog.databasePath": "/custom/path/agentlog.db"
```

### 数据备份
```bash
# 手动备份
cp ~/.agentlog/agentlog.db ~/backup/agentlog_$(date +%Y%m%d).db

# 通过导出功能备份
# 使用 JSONL 格式导出完整数据
```

## 如何导出数据？

AgentLog 支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格。

### 导出方式
1. **VS Code 侧边栏**：点击导出按钮，选择格式和配置
2. **API 接口**：`POST /api/export` 进行程序化导出
3. **命令行工具**：使用内置脚本批量导出

### 导出格式对比
| 格式 | 最佳用途 | 文件大小 | 可读性 |
|------|----------|----------|--------|
| **中文周报** | 团队进度同步、个人总结 | 较小 | 高（Markdown） |
| **PR 说明** | 代码审查、PR 描述 | 小 | 高（Markdown） |
| **JSONL** | 数据分析、系统集成 | 大 | 中（结构化） |
| **CSV** | 统计分析、Excel 处理 | 中等 | 中（表格） |

## MCP 连接失败怎么办？

### 常见错误
1. **"无法连接 MCP Server"**：AgentLog 后台服务未启动
2. **"工具调用失败"**：MCP 配置错误或权限问题
3. **"会话未记录"**：AI Agent 未正确调用 MCP 工具

### 解决步骤
1. **检查后台服务**：
   ```bash
   # 确认 AgentLog 后台运行
   curl http://localhost:7892/health
   # 应返回 {"status":"ok","version":"...","database":"connected"}
   ```

2. **验证 MCP 配置**：
   - 运行 `AgentLog: 验证 MCP 连接` 命令
   - 检查 MCP 配置文件路径和内容
   - 确认 AI Agent 已重启（配置变更后需重启）

3. **查看日志**：
   - VS Code 输出面板选择 "AgentLog"
   - 检查 `~/.agentlog/agentlog.log`
   - 查看 AI Agent 的 MCP 连接日志

### 配置示例
**Cline 配置** (`~/.cline/mcp.json`)：
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

## Git Hook 未自动绑定会话？

### 可能原因
1. **Hook 未安装**：未执行 `AgentLog: 安装 Git Hook` 命令
2. **权限问题**：`.git/hooks/prepare-commit-msg` 没有执行权限
3. **时间窗口不匹配**：AI 会话与 Commit 时间差超过阈值（默认 ±5 分钟）

### 解决方案
1. **手动安装 Hook**：
   ```bash
   # 在项目根目录执行
   curl -X POST http://localhost:7892/api/commits/hook/install \
     -H "Content-Type: application/json" \
     -d '{"workspacePath": "'"$(pwd)"'"}'
   ```

2. **检查 Hook 文件**：
   ```bash
   # 确认文件存在且有执行权限
   ls -la .git/hooks/prepare-commit-msg
   # 应显示 -rwxr-xr-x
   
   # 如果没有权限，添加执行权限
   chmod +x .git/hooks/prepare-commit-msg
   ```

3. **手动绑定**：
   - 在 VS Code 侧边栏右键点击未绑定的会话
   - 选择「绑定到最新 Commit」或指定 Commit

### 调试 Hook
```bash
# 手动触发 Hook 测试
.git/hooks/prepare-commit-msg .git/COMMIT_EDITMSG "message" abc123def

# 查看后端日志
tail -f ~/.agentlog/agentlog.log
```

## 为什么推理过程没有保存？

### 支持情况
AgentLog 专项支持以下模型的推理过程：
- **DeepSeek-R1**：完整保存 `<think>` 推理链
- **Claude extended thinking**：保存思考过程
- **其他模型**：如果模型返回推理内容，AgentLog 会保存

### 检查步骤
1. **确认模型支持**：使用 DeepSeek-R1 或 Claude 等支持推理的模型
2. **检查配置**：确保 `agentlog.captureReasoning` 设置为 `true`
3. **验证 MCP 调用**：确认 `log_turn` 传入了 `reasoning` 参数

### 配置示例
在 VS Code 设置中：
```json
{
  "agentlog.captureReasoning": true,
  "agentlog.autoCapture": true
}
```

## 侧边栏不显示会话？

### 可能原因
1. **后台服务未运行**：AgentLog 后台进程已停止
2. **工作区不匹配**：当前文件夹不是会话记录的工作区
3. **数据过滤**：侧边栏筛选器排除了当前会话

### 排查步骤
1. **重启扩展**：重新加载 VS Code 窗口（Cmd/Ctrl+Shift+P → "Developer: Reload Window"）
2. **检查工作区**：确认当前打开的文件夹是 AI 工作时的工作区
3. **清除筛选**：点击侧边栏顶部的筛选按钮，清除所有过滤条件
4. **查看日志**：VS Code 输出面板选择 "AgentLog"，查看错误信息

### 快速测试
```bash
# 测试后台服务
curl http://localhost:7892/api/sessions/stats

# 测试数据库连接
curl http://localhost:7892/health
```

## 数据保留策略是什么？

### 默认策略
- **保留期限**：90 天（可通过 `retentionDays` 配置调整）
- **清理时机**：服务启动时检查并清理过期数据
- **清理内容**：删除超过保留期限的会话和对应的 Commit 绑定

### 配置调整
```json
{
  "agentlog.retentionDays": 180  // 保留 180 天，0 表示永久保留
}
```

### 手动清理
```bash
# 通过 API 清理过期数据
curl -X DELETE http://localhost:7892/api/sessions/cleanup?olderThanDays=90

# 导出重要数据后再清理
curl -X POST http://localhost:7892/api/export \
  -H "Content-Type: application/json" \
  -d '{"format": "jsonl", "startDate": "2024-01-01"}' \
  > backup_$(date +%Y%m%d).jsonl
```

## 如何迁移数据到新机器？

### 迁移步骤
1. **导出数据**：在旧机器上导出 JSONL 格式的完整数据
2. **传输文件**：将数据库文件或导出文件复制到新机器
3. **恢复数据**：在新机器上导入数据或替换数据库文件

### 详细操作
```bash
# 1. 在旧机器上导出
curl -X POST http://localhost:7892/api/export \
  -H "Content-Type: application/json" \
  -d '{"format": "jsonl"}' \
  > agentlog_backup_$(date +%Y%m%d).jsonl

# 2. 复制数据库文件（更简单）
scp ~/.agentlog/agentlog.db user@newmachine:~/.agentlog/

# 3. 或导入 JSONL 数据到新机器
# 需要编写导入脚本或使用 AgentLog 导入功能（如有）
```

### 注意事项
- 确保新机器安装相同版本的 AgentLog
- 检查文件权限和路径配置
- 迁移后验证数据完整性

## 支持哪些 AI Agent 和模型？

### 支持的 AI Agent
- **Cline**（VS Code 插件）：通过 MCP 协议支持
- **OpenCode**（命令行工具）：通过 MCP 协议支持
- **Cursor**（IDE）：通过 MCP 客户端配置支持
- **Roo Code**：通过 MCP 协议支持
- **其他支持 MCP 的 Agent**：均可配置接入

### 支持的模型
- **DeepSeek**：V3、R1、Chat 等全系列
- **OpenAI**：GPT-4、GPT-3.5、o1、o3 等
- **Claude**：3.5 Sonnet、3 Haiku 等
- **国内模型**：通义千问、Kimi、ChatGLM、豆包等
- **本地模型**：Ollama、LM Studio 等本地部署模型

### 模型识别
AgentLog 自动从模型名称推断提供商，也支持手动指定：
```json
{
  "provider": "deepseek",  // 手动指定提供商
  "model": "deepseek-r1"   // 模型名称
}
```

## 性能影响大吗？

### 资源占用
- **内存**：后台服务约 50-100 MB，VS Code 扩展约 20-50 MB
- **CPU**：空闲时接近 0%，活跃时根据数据处理量适度使用
- **磁盘**：SQLite 数据库，每万条会话约 10-50 MB

### 优化建议
1. **调整保留期限**：减少 `retentionDays` 可降低数据库大小
2. **定期清理**：手动清理不需要的历史数据
3. **使用筛选**：侧边栏使用筛选功能，避免加载全部数据
4. **关闭调试**：生产环境设置 `"agentlog.debug": false`

### 监控方法
```bash
# 查看数据库大小
ls -lh ~/.agentlog/agentlog.db

# 查看会话数量
curl -s http://localhost:7892/api/sessions/stats | jq '.data.totalSessions'

# 查看内存占用（Linux/macOS）
ps aux | grep agentlog
```

## 如何报告问题或请求功能？

### 问题报告
1. **收集信息**：
   - AgentLog 版本（侧边栏底部或 `/health` 端点）
   - 操作系统和 VS Code 版本
   - 错误日志（VS Code 输出面板和 `~/.agentlog/agentlog.log`）
   - 复现步骤

2. **提交 Issue**：
   - [GitHub Issues](https://github.com/agentlog/agentlog/issues)
   - 使用问题模板，提供完整信息

### 功能请求
1. **检查路线图**：查看 README 中的路线图部分
2. **搜索现有 Issue**：避免重复请求
3. **详细描述**：说明使用场景、预期行为和优先级

### 社区支持
- **GitHub Discussions**：技术讨论和方案交流
- **文档贡献**：改进文档或翻译
- **代码贡献**：提交 Pull Request 修复问题或添加功能