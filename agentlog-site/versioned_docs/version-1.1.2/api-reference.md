---
sidebar_position: 2
---

# API 参考

AgentLog 后台提供完整的 REST API，默认运行在 `http://localhost:7892`，可通过环境变量 `AGENTLOG_PORT` 覆盖。

## 基础信息

### 服务状态
```http
GET /health
```

**响应示例**：
```json
{
  "status": "ok",
  "version": "0.4.0",
  "timestamp": "2025-03-29T10:30:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

### 配置信息
```http
GET /api/config
```

**响应示例**：
```json
{
  "backendUrl": "http://localhost:7892",
  "databasePath": "~/.agentlog/agentlog.db",
  "logLevel": "info",
  "retentionDays": 90,
  "corsOrigin": "http://localhost:3000"
}
```

## 会话管理

### 创建会话
```http
POST /api/sessions
Content-Type: application/json
```

**请求体**：
```json
{
  "provider": "deepseek",
  "model": "deepseek-r1",
  "source": "cline",
  "workspacePath": "/projects/my-app",
  "prompt": "请帮我重构这个函数",
  "reasoning": "<think>分析原函数职责...</think>",
  "response": "我将帮你重构...",
  "affectedFiles": ["src/utils.ts"],
  "durationMs": 120000,
  "tags": ["重构", "工具函数"],
  "note": "重要架构决策",
  "transcript": [
    {
      "role": "user",
      "content": "请帮我重构这个函数",
      "timestamp": "2025-03-29T10:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "我将帮你重构...",
      "reasoning": "<think>分析原函数职责...</think>",
      "timestamp": "2025-03-29T10:02:00.000Z"
    }
  ],
  "tokenUsage": {
    "inputTokens": 150,
    "outputTokens": 200,
    "cacheCreationTokens": 50,
    "cacheReadTokens": 25,
    "apiCallCount": 1
  }
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "createdAt": "2025-03-29T10:00:00.000Z"
  }
}
```

### 查询会话列表
```http
GET /api/sessions
```

**查询参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | `number` | 页码，从 1 开始（默认 1） |
| `pageSize` | `number` | 每页条数，最大 100（默认 20） |
| `startDate` | `string` | 开始时间（ISO 8601） |
| `endDate` | `string` | 结束时间（ISO 8601） |
| `provider` | `string` | 模型提供商过滤 |
| `source` | `string` | 来源过滤（cline/cursor/opencode） |
| `keyword` | `string` | 关键词搜索（prompt/response/note） |
| `onlyBoundToCommit` | `boolean` | 只返回已绑定到 Commit 的会话 |
| `commitHash` | `string` | 按 Commit Hash 过滤 |

**响应示例**：
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "abc123xyz",
        "createdAt": "2025-03-29T10:00:00.000Z",
        "provider": "deepseek",
        "model": "deepseek-r1",
        "source": "cline",
        "prompt": "请帮我重构...",
        "response": "我将帮你重构...",
        "commitHash": "a1b2c3d4e5",
        "affectedFiles": ["src/utils.ts"],
        "durationMs": 120000
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 20
  }
}
```

### 获取单个会话详情
```http
GET /api/sessions/{sessionId}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "createdAt": "2025-03-29T10:00:00.000Z",
    "provider": "deepseek",
    "model": "deepseek-r1",
    "source": "cline",
    "workspacePath": "/projects/my-app",
    "prompt": "请帮我重构这个函数",
    "reasoning": "<think>分析原函数职责...</think>",
    "response": "我将帮你重构...",
    "commitHash": "a1b2c3d4e5",
    "affectedFiles": ["src/utils.ts"],
    "durationMs": 120000,
    "tags": ["重构", "工具函数"],
    "note": "重要架构决策",
    "transcript": [
      {
        "role": "user",
        "content": "请帮我重构这个函数",
        "timestamp": "2025-03-29T10:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "我将帮你重构...",
        "reasoning": "<think>分析原函数职责...</think>",
        "timestamp": "2025-03-29T10:02:00.000Z"
      }
    ],
    "tokenUsage": {
      "inputTokens": 150,
      "outputTokens": 200,
      "cacheCreationTokens": 50,
      "cacheReadTokens": 25,
      "apiCallCount": 1
    }
  }
}
```

### 追加对话记录
```http
PATCH /api/sessions/{sessionId}/transcript
Content-Type: application/json
```

**请求体**：
```json
{
  "turns": [
    {
      "role": "tool",
      "content": "读取了 src/utils.ts 文件",
      "toolName": "read",
      "toolInput": "filePath=src/utils.ts",
      "timestamp": "2025-03-29T10:01:00.000Z"
    }
  ],
  "tokenUsage": {
    "inputTokens": 175,
    "outputTokens": 200
  }
}
```

### 更新会话意图
```http
PATCH /api/sessions/{sessionId}/intent
Content-Type: application/json
```

**请求体**：
```json
{
  "response": "已完成函数重构",
  "affectedFiles": ["src/utils.ts", "src/helpers.ts"],
  "durationMs": 180000
}
```

### 更新标签
```http
PATCH /api/sessions/{sessionId}/tags
Content-Type: application/json
```

**请求体**：
```json
{
  "tags": ["bugfix", "高优先级"]
}
```

### 更新备注
```http
PATCH /api/sessions/{sessionId}/note
Content-Type: application/json
```

**请求体**：
```json
{
  "note": "这个重构很重要，需要测试覆盖"
}
```

### 绑定/解绑 Commit
```http
PATCH /api/sessions/{sessionId}/commit
Content-Type: application/json
```

**绑定请求体**：
```json
{
  "commitHash": "a1b2c3d4e5f6g7h8i9j0"
}
```

**解绑请求体**：
```json
{
  "commitHash": null
}
```

### 删除会话
```http
DELETE /api/sessions/{sessionId}
```

### 获取统计数据
```http
GET /api/sessions/stats
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "totalSessions": 150,
    "unboundSessions": 3,
    "sessionsByProvider": {
      "deepseek": 80,
      "openai": 50,
      "qwen": 20
    },
    "sessionsBySource": {
      "cline": 100,
      "cursor": 40,
      "opencode": 10
    },
    "averageDurationMs": 120000,
    "totalTokens": {
      "input": 45000,
      "output": 68000
    }
  }
}
```

### 查询未绑定会话
```http
GET /api/sessions/unbound
```

**查询参数**：支持与会话列表相同的过滤参数。

## Commit 绑定管理

### Git Hook 接收端
```http
POST /api/commits/hook
Content-Type: application/json
```

**请求体**：
```json
{
  "commitHash": "a1b2c3d4e5f6g7h8i9j0",
  "message": "重构用户认证模块",
  "authorName": "张三",
  "authorEmail": "zhangsan@example.com",
  "changedFiles": ["src/auth.ts", "src/middleware.ts"],
  "workspacePath": "/projects/my-app"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "boundSessions": 3,
    "newCommitBinding": true
  }
}
```

### 手动批量绑定
```http
POST /api/commits/bind
Content-Type: application/json
```

**请求体**：
```json
{
  "commitHash": "a1b2c3d4e5f6g7h8i9j0",
  "sessionIds": ["session1", "session2", "session3"],
  "message": "重构用户认证模块",
  "authorName": "张三",
  "authorEmail": "zhangsan@example.com",
  "changedFiles": ["src/auth.ts", "src/middleware.ts"],
  "workspacePath": "/projects/my-app"
}
```

### 解绑会话
```http
DELETE /api/commits/unbind/{sessionId}
```

### 获取所有绑定记录
```http
GET /api/commits
```

**查询参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | `number` | 页码（默认 1） |
| `pageSize` | `number` | 每页条数（默认 20） |
| `workspacePath` | `string` | 按工作区过滤 |
| `authorEmail` | `string` | 按作者过滤 |

### 获取单个 Commit 信息
```http
GET /api/commits/{commitHash}
```

### 获取 Commit 关联的所有会话
```http
GET /api/commits/{commitHash}/sessions
```

### 生成 Commit 上下文文档
```http
GET /api/commits/{commitHash}/context
```

**查询参数**：
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `format` | `markdown` / `json` / `xml` | `markdown` | 输出格式 |
| `language` | `zh` / `en` | `zh` | 输出语言 |
| `includePrompts` | `boolean` | `true` | 包含用户 Prompt |
| `includeResponses` | `boolean` | `true` | 包含模型 Response |
| `includeReasoning` | `boolean` | `true` | 包含推理过程 |
| `includeChangedFiles` | `boolean` | `true` | 包含变更文件列表 |
| `maxContentLength` | `number` | `2000` | 单条内容最大字符数（0=不截断） |
| `maxSessions` | `number` | `0` | 最多包含的会话数量（0=不限制） |

**POST 版本**：
```http
POST /api/commits/{commitHash}/context
Content-Type: application/json
```

**请求体**：同上查询参数作为 JSON 对象。

### 生成 Commit 解释摘要
```http
GET /api/commits/{commitHash}/explain
```

**查询参数**：
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `language` | `zh` / `en` | `zh` | 输出语言 |
| `maxLength` | `number` | `1000` | 摘要最大长度 |

**POST 版本**：
```http
POST /api/commits/{commitHash}/explain
Content-Type: application/json
```

### 安装 Git Hook
```http
POST /api/commits/hook/install
```

**请求体**：
```json
{
  "workspacePath": "/projects/my-app"
}
```

### 移除 Git Hook
```http
DELETE /api/commits/hook/remove
```

**请求体**：
```json
{
  "workspacePath": "/projects/my-app"
}
```

## 导出功能

### 获取支持的导出格式
```http
GET /api/export/formats
```

**响应**：
```json
{
  "success": true,
  "data": {
    "formats": [
      {
        "id": "weekly-report",
        "name": "中文周报",
        "description": "汇总本周所有 AI 辅助的代码变更",
        "extension": ".md",
        "defaultLanguage": "zh"
      },
      {
        "id": "pr-description",
        "name": "PR/Code Review 说明",
        "description": "生成包含 AI 交互上下文的 PR 描述",
        "extension": ".md",
        "defaultLanguage": "zh"
      },
      {
        "id": "jsonl",
        "name": "JSONL 原始数据",
        "description": "完整的结构化数据，便于自定义分析",
        "extension": ".jsonl",
        "defaultLanguage": null
      },
      {
        "id": "csv",
        "name": "CSV 表格",
        "description": "表格格式，便于 Excel 处理和分析",
        "extension": ".csv",
        "defaultLanguage": null
      }
    ]
  }
}
```

### 生成导出内容
```http
POST /api/export
Content-Type: application/json
```

**请求体**：
```json
{
  "format": "weekly-report",
  "language": "zh",
  "startDate": "2025-03-23",
  "endDate": "2025-03-29",
  "filters": {
    "providers": ["deepseek", "openai"],
    "sources": ["cline", "cursor"],
    "workspacePaths": ["/projects/my-app"],
    "tags": ["重构", "bugfix"]
  },
  "options": {
    "groupBy": "project",
    "includeDetails": true,
    "maxSessions": 50
  }
}
```

### 预览导出内容
```http
POST /api/export/preview
Content-Type: application/json
```

**请求体**：与导出接口相同，但只返回前 50 行内容。

## MCP 工具 API

以下 API 主要供 MCP Server 内部使用，也可直接调用。

### 创建 MCP 会话（简化）
```http
POST /api/mcp/sessions
Content-Type: application/json
```

**请求体**：
```json
{
  "model": "deepseek-r1",
  "source": "mcp-tool-call",
  "workspacePath": "/projects/my-app",
  "transcript": [
    {
      "role": "user",
      "content": "请帮我重构...",
      "timestamp": "2025-03-29T10:00:00.000Z"
    }
  ]
}
```

### 估算 Token 用量
```http
POST /api/mcp/estimate-tokens
Content-Type: application/json
```

**请求体**：
```json
{
  "text": "请帮我重构这个函数...",
  "model": "deepseek-r1"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "estimatedTokens": 28,
    "characters": 112
  }
}
```

## 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": {
    "field": "具体的错误信息"
  }
}
```

### 常见错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `SESSION_NOT_FOUND` | 404 | 会话不存在 |
| `COMMIT_NOT_FOUND` | 404 | Commit 不存在 |
| `DATABASE_ERROR` | 500 | 数据库操作失败 |
| `GIT_HOOK_ERROR` | 500 | Git Hook 操作失败 |
| `EXPORT_ERROR` | 500 | 导出操作失败 |
| `MCP_ERROR` | 500 | MCP 相关错误 |

## 使用示例

### cURL 示例

**创建会话**：
```bash
curl -X POST http://localhost:7892/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "deepseek",
    "model": "deepseek-r1",
    "source": "cline",
    "workspacePath": "/projects/my-app",
    "prompt": "测试请求",
    "response": "测试响应",
    "affectedFiles": ["test.ts"]
  }'
```

**查询最近会话**：
```bash
curl "http://localhost:7892/api/sessions?page=1&pageSize=10"
```

**生成周报**：
```bash
curl -X POST http://localhost:7892/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "format": "weekly-report",
    "language": "zh",
    "startDate": "2025-03-23",
    "endDate": "2025-03-29"
  }' > weekly_report.md
```

### JavaScript/TypeScript 示例

```typescript
import axios from 'axios';

const agentlog = axios.create({
  baseURL: 'http://localhost:7892/api',
});

// 创建会话
const createSession = async () => {
  const response = await agentlog.post('/sessions', {
    provider: 'deepseek',
    model: 'deepseek-r1',
    source: 'cline',
    workspacePath: '/projects/my-app',
    prompt: '请帮我重构...',
    response: '我将帮你重构...',
    affectedFiles: ['src/utils.ts']
  });
  return response.data.data.id;
};

// 查询统计
const getStats = async () => {
  const response = await agentlog.get('/sessions/stats');
  return response.data.data;
};

// 导出数据
const exportWeeklyReport = async () => {
  const response = await agentlog.post('/export', {
    format: 'weekly-report',
    language: 'zh',
    startDate: '2025-03-23',
    endDate: '2025-03-29'
  });
  return response.data;
};
```

### Python 示例

```python
import requests
import json

BASE_URL = "http://localhost:7892/api"

def create_session():
    response = requests.post(
        f"{BASE_URL}/sessions",
        json={
            "provider": "deepseek",
            "model": "deepseek-r1",
            "source": "cline",
            "workspacePath": "/projects/my-app",
            "prompt": "请帮我重构...",
            "response": "我将帮你重构...",
            "affectedFiles": ["src/utils.ts"]
        }
    )
    return response.json()["data"]["id"]

def get_recent_sessions():
    response = requests.get(
        f"{BASE_URL}/sessions",
        params={"page": 1, "pageSize": 10}
    )
    return response.json()["data"]["data"]
```

## 注意事项

### 认证与安全
- 默认仅允许本地访问（127.0.0.1）
- 生产环境建议配置防火墙规则
- 敏感操作（如删除）可添加确认机制

### 性能建议
- 批量操作使用事务 API
- 大量数据查询使用分页
- 频繁访问的数据考虑缓存

### 版本兼容
- API 遵循语义化版本控制
- 不兼容变更会升级主版本号
- 弃用的 API 会保留至少一个版本周期