---
sidebar_position: 3
---

# 核心特性详解

本文档提供 AgentLog 核心特性的技术实现细节。

## Git Worktree 多 Agent 并行

### 工作原理

多个 AI Agent 可同时在同一仓库的不同 worktree 上独立工作，各自会话精准绑定到对应 Commit，互不干扰。

```
主仓库                     Worktree A                 Worktree B
my-repo/                   my-repo-feat-login/        my-repo-fix-bug/
  .git/                     (共享同一 .git)            (共享同一 .git)
  src/                      src/                       src/

Agent-1 在此工作           Agent-2 在此工作            Agent-3 在此工作
→ workspacePath            → workspacePath             → workspacePath
  = "my-repo"               = "my-repo-feat-login"     = "my-repo-fix-bug"
→ gitRepoRoot              → gitRepoRoot               → gitRepoRoot
  = "my-repo"               = "my-repo"                = "my-repo"
```

### 三级匹配策略

post-commit 触发时按以下顺序查找未绑定会话：

1. **Level 1（精确）**：按当前 worktree 的 `workspace_path` 精确匹配
2. **Level 2（跨 worktree）**：按 `git_repo_root` 匹配同仓库其他 worktree 的会话
3. **Level 3（兜底）**：生成自动摘要 Session

### 关键技术

- **`gitRepoRoot` 字段**：存储 Git 仓库根目录路径。无论会话发生在哪个 worktree，同一仓库下的所有会话共享相同的 `gitRepoRoot`
- **动态钩子脚本**：post-commit 钩子通过 `git rev-parse --show-toplevel` 动态获取当前 worktree 的真实路径，一次安装，所有 worktree 均生效
- **会话自动推断**：创建 Session 时后端自动通过 `git rev-parse --show-toplevel` 填充 `gitRepoRoot`

### 使用方式

只需在**任意一个** worktree（通常是主仓库）安装 Git 钩子，所有 worktree 均自动支持。

## 数据存储

### 数据库位置

- **默认路径**：`~/.agentlog/agentlog.db`（SQLite）
- **环境变量覆盖**：`AGENTLOG_DB_PATH` 可自定义存储路径
- **自动备份**：支持定期备份到指定目录

### 隐私与安全

- 纯本地存储，不上传任何云端
- 后台服务仅监听 `127.0.0.1`，不对外网暴露
- CORS 限制仅允许 `localhost` 和 VS Code Webview 来源
- 无遥测，不收集任何使用统计数据

## 核心工作流

AgentLog 的三大核心工作流无缝衔接：

1. **MCP 主动记录路径**：AI Agent → MCP Server → Backend → SQLite
2. **Git Hook 绑定路径**：`git commit` → Hook → Backend → 关联游离会话
3. **上下文复活路径**：历史 Commit → 提取 AI 记忆 → 粘贴到新对话

这三个工作流共同构成完整的"AI 编程飞行记录仪"体验。

## 数据保留

- 默认保留 90 天数据（可通过 `retentionDays` 配置调整）
- 支持手动清理历史数据
- 导出功能支持完整数据备份
