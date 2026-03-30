---
sidebar_position: 3
---

# 数据模型

AgentLog 使用 SQLite 数据库存储所有数据，采用严格的数据模型确保数据一致性和查询性能。

## 数据库概览

- **数据库引擎**：SQLite 3.x（通过 `better-sqlite3` 驱动）
- **存储路径**：`~/.agentlog/agentlog.db`（可通过 `AGENTLOG_DB_PATH` 环境变量覆盖）
- **当前版本**：Schema v4
- **WAL 模式**：默认启用 Write-Ahead Logging，支持读写并发

## 表结构

### agent_sessions 表

存储 AI 交互会话的完整记录，包括逐轮对话和 Token 用量统计。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | TEXT | PRIMARY KEY | 会话唯一标识（nanoid） |
| `created_at` | TEXT | NOT NULL | 创建时间（ISO 8601 格式） |
| `provider` | TEXT | NOT NULL | AI 提供商，如 `deepseek`、`openai`、`anthropic` |
| `model` | TEXT | NOT NULL | 模型名称，如 `deepseek-r1`、`gpt-4`、`claude-3.5-sonnet` |
| `source` | TEXT | NOT NULL | 会话来源，如 `cline`、`cursor`、`opencode`、`mcp-tool-call` |
| `workspace_path` | TEXT | NOT NULL | 工作区绝对路径（多 worktree 场景下为各 worktree 路径） |
| `git_repo_root` | TEXT | | Git 仓库根目录（多 worktree 共享，用于跨 worktree 绑定） |
| `prompt` | TEXT | NOT NULL | 用户提示（首次 user 消息内容） |
| `reasoning` | TEXT | | 模型推理过程，如 DeepSeek-R1 的 `<think>` 内容 |
| `response` | TEXT | NOT NULL | 模型最终响应（最后一条 assistant 消息内容） |
| `commit_hash` | TEXT | | 关联的 Git commit hash，未绑定时为 `NULL` |
| `affected_files` | TEXT | NOT NULL | JSON 数组，涉及的文件路径列表 |
| `duration_ms` | INTEGER | NOT NULL | 会话总耗时（毫秒） |
| `tags` | TEXT | | JSON 数组，用户标签 |
| `note` | TEXT | | 用户备注 |
| `metadata` | TEXT | | JSON 对象，提供商特定扩展字段 |
| `transcript` | TEXT | NOT NULL | JSON 数组，逐轮对话记录 |
| `token_usage` | TEXT | | JSON 对象，Token 用量统计 |

#### 索引
```sql
-- 按创建时间查询（侧边栏时间倒序）
CREATE INDEX idx_sessions_created_at ON agent_sessions(created_at DESC);

-- 按工作区查询（多项目支持）
CREATE INDEX idx_sessions_workspace ON agent_sessions(workspace_path);

-- 按仓库根目录查询（多 worktree 场景，跨 worktree 匹配）
CREATE INDEX idx_sessions_git_repo_root ON agent_sessions(git_repo_root);

-- 按模型提供商查询（统计过滤）
CREATE INDEX idx_sessions_provider ON agent_sessions(provider);

-- 按 Commit 查询（查看 Commit 关联会话）
CREATE INDEX idx_sessions_commit_hash ON agent_sessions(commit_hash);
```

### commit_bindings 表

存储 Git Commit 与 AgentSession 的绑定关系。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `commit_hash` | TEXT | PRIMARY KEY | Git commit hash（完整 SHA-1） |
| `session_ids` | TEXT | NOT NULL | JSON 数组，关联的 session ID 列表 |
| `message` | TEXT | NOT NULL | Commit 消息 |
| `committed_at` | TEXT | NOT NULL | 提交时间（ISO 8601） |
| `author_name` | TEXT | NOT NULL | 提交者名称 |
| `author_email` | TEXT | NOT NULL | 提交者邮箱 |
| `changed_files` | TEXT | NOT NULL | JSON 数组，变更的文件列表 |
| `workspace_path` | TEXT | NOT NULL | 工作区路径 |

#### 索引
```sql
-- 按提交时间查询（历史记录排序）
CREATE INDEX idx_commits_committed_at ON commit_bindings(committed_at DESC);

-- 按工作区查询
CREATE INDEX idx_commits_workspace ON commit_bindings(workspace_path);
```

### schema_version 表

Schema 版本管理。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `version` | INTEGER | PRIMARY KEY | 版本号 |
| `applied_at` | TEXT | NOT NULL | 应用时间（ISO 8601） |

## JSON 字段格式

### affected_files
```json
["src/utils.ts", "src/helpers.ts", "tests/utils.test.ts"]
```

### tags
```json
["bugfix", "重构", "高优先级", "需要测试"]
```

### metadata
```json
{
  "apiEndpoint": "https://api.deepseek.com",
  "temperature": 0.7,
  "maxTokens": 2000,
  "streaming": true
}
```

### transcript
逐轮对话记录数组，每轮包含：

```json
[
  {
    "role": "user",
    "content": "请帮我重构 src/utils.ts 中的 calculateTotal 函数",
    "timestamp": "2025-03-29T10:00:00.000Z"
  },
  {
    "role": "assistant",
    "content": "我将帮你重构这个函数，首先分析原函数职责...",
    "reasoning": "<think>分析原函数职责：1. 计算总和 2. 应用折扣 3. 记录日志...</think>",
    "timestamp": "2025-03-29T10:00:30.000Z"
  },
  {
    "role": "tool",
    "content": "已读取 src/utils.ts 文件，共 85 行代码",
    "toolName": "read",
    "toolInput": "filePath=src/utils.ts",
    "timestamp": "2025-03-29T10:01:00.000Z"
  },
  {
    "role": "assistant",
    "content": "基于代码分析，我建议将函数拆分为三个独立函数...",
    "timestamp": "2025-03-29T10:01:30.000Z"
  }
]
```

**字段说明**：
- `role`: `"user"` | `"assistant"` | `"tool"`
- `content`: 消息内容
- `reasoning`: 推理过程（仅 assistant 角色可能有）
- `timestamp`: 消息时间戳（ISO 8601）
- `toolName`: 工具名称（仅 tool 角色）
- `toolInput`: 工具输入参数（仅 tool 角色）

### token_usage
```json
{
  "inputTokens": 285,
  "outputTokens": 420,
  "cacheCreationTokens": 150,
  "cacheReadTokens": 75,
  "apiCallCount": 1
}
```

**字段说明**：
- `inputTokens`: 输入 tokens 总数
- `outputTokens`: 输出 tokens 总数
- `cacheCreationTokens`: 缓存创建 tokens（如有）
- `cacheReadTokens`: 缓存读取 tokens（如有）
- `apiCallCount`: API 调用次数

### session_ids
```json
["session_abc123", "session_def456", "session_ghi789"]
```

### changed_files
```json
["src/auth.ts", "src/middleware.ts", "tests/auth.test.ts"]
```

## 数据关系

### 一对多关系
一个 Commit 可以关联多个 Session：
```
commit_bindings.session_ids → agent_sessions.id
```

### 反向引用
Session 通过 `commit_hash` 引用所属的 Commit：
```
agent_sessions.commit_hash → commit_bindings.commit_hash
```

### 数据一致性
通过事务确保双向引用的一致性：
1. 绑定 Commit 时：更新 `agent_sessions.commit_hash` 并创建/更新 `commit_bindings`
2. 解绑时：将 `agent_sessions.commit_hash` 设为 `NULL` 并更新 `commit_bindings.session_ids`

## 迁移历史

### 版本 1（初始版本）
```sql
-- 创建 agent_sessions 表（不含 transcript 和 token_usage）
CREATE TABLE agent_sessions (...);

-- 创建 commit_bindings 表
CREATE TABLE commit_bindings (...);

-- 创建索引
CREATE INDEX idx_sessions_created_at ON agent_sessions(created_at);
CREATE INDEX idx_sessions_workspace ON agent_sessions(workspace_path);
CREATE INDEX idx_sessions_provider ON agent_sessions(provider);
CREATE INDEX idx_sessions_commit_hash ON agent_sessions(commit_hash);
CREATE INDEX idx_commits_committed_at ON commit_bindings(committed_at);
CREATE INDEX idx_commits_workspace ON commit_bindings(workspace_path);
```

### 版本 2
```sql
-- 新增 transcript 和 token_usage 字段
ALTER TABLE agent_sessions ADD COLUMN transcript TEXT NOT NULL DEFAULT '[]';
ALTER TABLE agent_sessions ADD COLUMN token_usage TEXT;
```

### 版本 3
```sql
-- 新增 git_repo_root 字段，支持多 worktree 场景
ALTER TABLE agent_sessions ADD COLUMN git_repo_root TEXT;

-- 新增索引支持跨 worktree 查询
CREATE INDEX idx_sessions_git_repo_root ON agent_sessions(git_repo_root);
```

### 版本 4（当前版本）
```sql
-- 保持与版本 3 相同，git_repo_root 字段已存在
-- 工作tree支持通过运行时逻辑实现，无需额外Schema变更
```

## 数据生命周期

### 创建流程
1. **MCP 上报**：AI Agent 调用 `log_turn`，创建新会话或追加到现有会话
2. **字段填充**：`log_intent` 补充 `response`、`affected_files`、`duration_ms`
3. **推理提取**：后端自动从 `transcript` 提取 `reasoning` 内容
4. **Token 统计**：累计各轮消息的 Token 用量

### 绑定流程
1. **Git Commit**：用户执行 `git commit`，触发 Git Hook
2. **会话查询**：查找当前工作区 `commit_hash` 为 `NULL` 的会话
3. **事务绑定**：在事务中更新 `agent_sessions.commit_hash` 和 `commit_bindings`
4. **数据持久化**：提交事务，确保数据一致性

### 清理流程
1. **保留策略**：默认保留 90 天数据（可配置）
2. **定期清理**：后台任务清理过期的会话和绑定记录
3. **手动删除**：用户可通过界面或 API 删除特定数据

## 查询模式

### 常用查询示例

#### 1. 获取工作区最近会话
```sql
SELECT * FROM agent_sessions 
WHERE workspace_path = '/projects/my-app'
ORDER BY created_at DESC 
LIMIT 20;
```

#### 2. 查找未绑定的会话
```sql
SELECT * FROM agent_sessions 
WHERE commit_hash IS NULL 
AND workspace_path = '/projects/my-app'
ORDER BY created_at DESC;
```

#### 3. 获取 Commit 详情及关联会话
```sql
-- 获取 Commit 绑定信息
SELECT * FROM commit_bindings 
WHERE commit_hash = 'a1b2c3d4e5';

-- 获取关联的会话
SELECT * FROM agent_sessions 
WHERE commit_hash = 'a1b2c3d4e5'
ORDER BY created_at;
```

#### 4. 按标签统计
```sql
-- 需要应用程序层处理 JSON 数组
-- 伪代码示例：
const sessions = db.query("SELECT tags FROM agent_sessions");
const tagCounts = {};
sessions.forEach(s => {
  const tags = JSON.parse(s.tags || '[]');
  tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});
```

#### 5. Token 用量统计
```sql
-- 按模型统计 Token 用量
SELECT 
  model,
  SUM(JSON_EXTRACT(token_usage, '$.inputTokens')) as total_input,
  SUM(JSON_EXTRACT(token_usage, '$.outputTokens')) as total_output,
  COUNT(*) as session_count
FROM agent_sessions
WHERE token_usage IS NOT NULL
GROUP BY model
ORDER BY total_input DESC;
```

## 性能优化

### 索引策略
1. **覆盖索引**：常用查询字段建立复合索引
2. **查询优化**：避免在 JSON 字段上直接查询，优先使用标量字段过滤
3. **分区考虑**：数据量极大时可考虑按时间分区

### 数据分页
```sql
-- 使用 LIMIT/OFFSET 分页
SELECT * FROM agent_sessions 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- 使用游标分页（更高效）
SELECT * FROM agent_sessions 
WHERE created_at < '2025-03-29T10:00:00.000Z'
ORDER BY created_at DESC 
LIMIT 20;
```

### JSON 处理优化
1. **延迟解析**：只在需要时解析 JSON 字段
2. **字段提取**：使用 `JSON_EXTRACT` 提取特定字段，避免完整解析
3. **缓存结果**：频繁访问的统计结果适当缓存

## 数据完整性

### 约束检查
1. **外键约束**：虽然 SQLite 默认不强制，但应用层维护引用完整性
2. **非空约束**：必需字段（如 `id`、`created_at`）确保不为空
3. **格式验证**：JSON 字段写入前验证格式

### 事务处理
关键操作使用事务：
```typescript
// 绑定 Commit 的事务示例
db.transaction(() => {
  // 1. 更新所有相关会话的 commit_hash
  db.prepare(`
    UPDATE agent_sessions 
    SET commit_hash = ? 
    WHERE id IN (${sessionIds.map(() => '?').join(',')})
  `).run(commitHash, ...sessionIds);
  
  // 2. 创建或更新 commit_bindings
  const existing = db.prepare(
    'SELECT * FROM commit_bindings WHERE commit_hash = ?'
  ).get(commitHash);
  
  if (existing) {
    // 更新现有记录
    db.prepare(`
      UPDATE commit_bindings 
      SET session_ids = ?
      WHERE commit_hash = ?
    `).run(JSON.stringify(sessionIds), commitHash);
  } else {
    // 插入新记录
    db.prepare(`
      INSERT INTO commit_bindings 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      commitHash,
      JSON.stringify(sessionIds),
      message,
      committedAt,
      authorName,
      authorEmail,
      JSON.stringify(changedFiles),
      workspacePath
    );
  }
})();
```

### 备份与恢复
1. **定期备份**：建议每周备份数据库文件
2. **导出归档**：使用 JSONL 导出作为逻辑备份
3. **灾难恢复**：从备份文件恢复数据库

## 扩展性考虑

### 未来可能的扩展
1. **向量化搜索**：添加 `embedding` 字段，支持语义搜索
2. **审计日志**：单独的表记录数据变更历史
3. **用户管理**：多用户支持，添加 `user_id` 字段
4. **团队协作**：共享会话，添加 `team_id` 字段

### 兼容性保证
1. **向前兼容**：新版本不删除现有字段
2. **迁移脚本**：版本升级提供自动迁移脚本
3. **回滚方案**：重要变更提供回滚方案

## 工具函数

数据库层提供的工具函数：

```typescript
// JSON 序列化/反序列化
function toJson(value: unknown): string {
  return JSON.stringify(value);
}

function fromJson<T>(raw: string, fallback: T): T {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// 时间处理
function toIsoString(date: Date): string {
  return date.toISOString();
}

function fromIsoString(iso: string): Date {
  return new Date(iso);
}

// ID 生成
function generateId(): string {
  return nanoid(); // 或使用其他 ID 生成算法
}
```

## 最佳实践

### 数据写入
1. **批量写入**：多个相关操作放在同一事务中
2. **字段验证**：写入前验证数据格式和约束
3. **错误处理**：捕获数据库异常，提供友好错误信息

### 数据读取
1. **按需读取**：只查询需要的字段，避免 `SELECT *`
2. **分页处理**：大量数据使用分页，避免内存溢出
3. **缓存策略**：频繁访问的只读数据适当缓存

### 数据维护
1. **定期清理**：设置合理的数据保留策略
2. **索引维护**：定期分析索引使用情况，优化索引策略
3. **备份验证**：定期验证备份文件的完整性和可恢复性