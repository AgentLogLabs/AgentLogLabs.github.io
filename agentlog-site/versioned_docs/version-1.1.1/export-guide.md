---
sidebar_position: 3
---

# 导出指南

AgentLog 支持多种格式的数据导出，便于团队协作、代码审查和数据分析。

## 导出概览

| 导出格式 | 文件扩展名 | 主要用途 | 特点 |
|----------|------------|----------|------|
| **中文周报** | `.md` | 团队进度同步、个人工作总结 | 结构化汇总，便于阅读 |
| **PR/Code Review 说明** | `.md` | GitHub/GitLab PR 描述、代码审查 | 包含 AI 交互上下文，减少沟通成本 |
| **JSONL 原始数据** | `.jsonl` | 数据分析、备份归档、系统集成 | 完整结构化数据，机器可读 |
| **CSV 表格** | `.csv` | 统计分析、Excel 处理、可视化 | 表格格式，便于计算和图表 |

## 导出方式

### 1. VS Code 侧边栏导出（推荐）

#### 操作步骤
1. 在 VS Code 侧边栏打开 AgentLog 面板
2. 点击顶部的「导出」按钮（📤 图标）
3. 选择导出格式和配置选项
4. 指定保存路径和文件名
5. 点击「生成」完成导出

#### 界面说明
- **格式选择**：下拉菜单选择四种导出格式
- **时间范围**：日历组件选择开始和结束日期
- **筛选条件**：按模型、来源、工作区等过滤
- **预览功能**：生成前可预览前 50 行内容

### 2. API 导出（高级用户）

AgentLog 提供 REST API 进行程序化导出：

```bash
# 获取支持的导出格式
curl http://localhost:7892/api/export/formats

# 生成中文周报（本周数据）
curl -X POST http://localhost:7892/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "format": "weekly-report",
    "language": "zh",
    "startDate": "2025-03-23",
    "endDate": "2025-03-29"
  }' > weekly_report.md

# 预览导出内容（前50行）
curl -X POST http://localhost:7892/api/export/preview \
  -H "Content-Type: application/json" \
  -d '{"format": "pr-description", "language": "zh"}'
```

### 3. 命令行导出（开发环境）

```bash
# 进入 AgentLog 项目目录
cd /path/to/agentlog

# 使用内置脚本导出
node scripts/export.js --format=jsonl --output=./export/data.jsonl

# 指定时间范围
node scripts/export.js --format=csv --start=2025-03-01 --end=2025-03-31
```

## 导出格式详解

### 中文周报（Weekly Report）

#### 文件结构
```
# AI 编程工作周报（2025-03-23 至 2025-03-29）

## 概览
- 总会话数：24 次
- 涉及文件：18 个
- 主要模型：DeepSeek-R1 (16次), GPT-4 (8次)

## 按项目统计
### 项目A（/path/to/project-a）
- 新增功能：用户认证模块重构
- 涉及文件：src/auth.ts, src/middleware.ts
- 主要会话：3次，总耗时 45分钟

### 项目B（/path/to/project-b）
- Bug修复：数据验证逻辑修正
- 涉及文件：src/validation.ts
- 主要会话：2次，总耗时 20分钟

## 详细会话记录
### 会话ID：abc123xyz
- 时间：2025-03-28 14:30
- 模型：DeepSeek-R1
- 任务：重构用户认证模块
- 涉及文件：src/auth.ts
- 关键决策：将认证逻辑拆分为独立服务

...
```

#### 配置选项
| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `language` | `zh` / `en` | `zh` | 输出语言 |
| `groupBy` | `project` / `day` / `model` | `project` | 分组方式 |
| `includeDetails` | `boolean` | `true` | 是否包含详细会话记录 |
| `maxSessions` | `number` | `50` | 最大会话数量 |

### PR/Code Review 说明

#### 文件结构
```
## 修改说明

### 背景
本次修改由 AI 辅助完成，原始任务：重构用户认证模块

### AI 交互上下文
**用户请求**：
```
请帮我重构 src/auth.ts 中的 authenticate 函数，提高可测试性
```

**AI 分析**（DeepSeek-R1）：
```
<think>
1. 当前函数职责过多，包含验证、数据库查询、日志记录
2. 建议拆分为：验证服务、用户查询服务、日志中间件
3. 需要考虑依赖注入以便单元测试
</think>
```

**AI 建议**：
1. 创建 AuthService 类，负责核心认证逻辑
2. 提取 UserRepository 处理数据库操作
3. 添加 LoggingMiddleware 记录审计日志

### 具体变更
#### src/auth.ts
- 将 `authenticate` 函数拆分为三个类
- 添加依赖注入支持
- 增加单元测试桩

#### src/middleware.ts
- 新增 `loggingMiddleware` 函数
- 集成到 Express 中间件链

### 测试建议
1. 验证 AuthService 的独立测试
2. 检查依赖注入容器配置
3. 确认日志记录完整

---

*本说明由 AgentLog 自动生成，基于 AI 交互记录。*
```

#### 配置选项
| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `commitHash` | `string` | 当前 Commit | 指定生成哪个 Commit 的说明 |
| `includeReasoning` | `boolean` | `true` | 是否包含 AI 推理过程 |
| `includeCodeSnippets` | `boolean` | `true` | 是否包含代码片段 |
| `template` | `github` / `gitlab` / `generic` | `github` | PR 模板风格 |

### JSONL 原始数据

#### 文件格式
每行一个完整的 JSON 对象，代表一次 AI 会话：

```json
{
  "id": "abc123xyz",
  "createdAt": "2025-03-28T14:30:00.000Z",
  "provider": "deepseek",
  "model": "deepseek-r1",
  "source": "cline",
  "workspacePath": "/projects/my-app",
  "prompt": "请帮我重构 src/auth.ts 中的 authenticate 函数",
  "reasoning": "<think>分析原函数职责...</think>",
  "response": "我将帮你重构...",
  "commitHash": "a1b2c3d4e5",
  "affectedFiles": ["src/auth.ts", "src/middleware.ts"],
  "durationMs": 2700000,
  "tags": ["重构", "认证"],
  "transcript": [
    {"role": "user", "content": "请帮我重构...", "timestamp": "2025-03-28T14:30:00.000Z"},
    {"role": "assistant", "content": "我将帮你重构...", "reasoning": "<think>分析...</think>", "timestamp": "2025-03-28T14:31:00.000Z"}
  ],
  "tokenUsage": {
    "inputTokens": 285,
    "outputTokens": 420,
    "cacheCreationTokens": 150,
    "cacheReadTokens": 75
  }
}
```

#### 配置选项
| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pretty` | `boolean` | `false` | 是否美化输出（增加缩进） |
| `includeTranscript` | `boolean` | `true` | 是否包含逐轮对话记录 |
| `includeTokenUsage` | `boolean` | `true` | 是否包含 Token 用量统计 |

### CSV 表格

#### 文件结构
```
id,created_at,provider,model,source,workspace_path,prompt_summary,response_summary,commit_hash,affected_files_count,duration_minutes
abc123xyz,2025-03-28 14:30,deepseek,deepseek-r1,cline,/projects/my-app,"重构 authenticate 函数","拆分为三个服务",a1b2c3d4e5,2,45
def456uvw,2025-03-28 15:20,openai,gpt-4,cursor,/projects/my-app,"修复数据验证","修正边界条件",b2c3d4e5f6,1,15
```

#### 配置选项
| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `separator` | `,` / `;` / `\t` | `,` | 列分隔符 |
| `includeHeaders` | `boolean` | `true` | 是否包含表头 |
| `columns` | `string[]` | 所有字段 | 选择导出的列 |

## 高级导出功能

### 批量导出

```bash
# 导出最近30天所有格式的数据
node scripts/batch-export.js \
  --start=$(date -v-30d +%Y-%m-%d) \
  --output-dir=./exports \
  --formats=weekly-report,pr-description,jsonl,csv
```

### 增量导出

```bash
# 基于上次导出时间戳，只导出新增数据
node scripts/incremental-export.js \
  --since=2025-03-28T14:30:00.000Z \
  --format=jsonl \
  --output=./exports/incremental.jsonl
```

### 自动化集成

#### GitHub Actions 示例
```yaml
name: Weekly AI Report
on:
  schedule:
    - cron: '0 18 * * 5'  # 每周五18:00

jobs:
  export-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate AI Weekly Report
        run: |
          curl -X POST http://localhost:7892/api/export \
            -H "Content-Type: application/json" \
            -d '{"format": "weekly-report", "language": "zh"}' \
            > weekly_report.md
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: ai-weekly-report
          path: weekly_report.md
```

#### CI/CD 集成
在 PR 流程中自动生成 AI 上下文说明：

```yaml
name: PR AI Context
on: [pull_request]

jobs:
  generate-context:
    runs-on: ubuntu-latest
    steps:
      - name: Generate PR AI Context
        run: |
          # 获取当前 Commit Hash
          COMMIT_HASH=$(git rev-parse HEAD)
          
          # 生成 PR 说明
          curl -X POST http://localhost:7892/api/commits/$COMMIT_HASH/context \
            -H "Content-Type: application/json" \
            -d '{"format": "markdown", "language": "zh"}' \
            > pr_ai_context.md
          
          # 添加到 PR 评论（需要 GitHub Token）
          gh pr comment $PR_NUMBER --body-file pr_ai_context.md
```

## 数据隐私与安全

### 敏感信息处理
- **自动脱敏**：导出时自动移除可能包含的 API Keys、密码等
- **可选过滤**：可配置正则表达式过滤敏感模式
- **人工审核**：重要数据导出前建议人工检查

### 权限控制
- **本地导出**：默认仅允许本地访问导出接口
- **访问令牌**：生产环境可配置 API 令牌验证
- **IP 白名单**：限制可访问导出接口的 IP 范围

## 性能优化

### 大数据量导出
对于大量历史数据：
```bash
# 分页导出，避免内存溢出
node scripts/paginated-export.js \
  --format=jsonl \
  --page-size=1000 \
  --output-dir=./exports/chunks

# 并行处理（如果支持）
node scripts/parallel-export.js --workers=4
```

### 压缩输出
```bash
# 导出时直接压缩
node scripts/export.js --format=jsonl --compress=gzip --output=./exports/data.jsonl.gz

# 或导出后压缩
gzip -9 ./exports/data.jsonl
```

## 常见问题

### 导出文件过大
1. **分时段导出**：按周/月分割导出文件
2. **选择性导出**：只导出必要字段，如 `--columns=id,created_at,prompt_summary`
3. **启用压缩**：使用 gzip 压缩输出文件

### 导出速度慢
1. **增加分页大小**：减少数据库查询次数
2. **优化筛选条件**：添加时间范围、模型等筛选
3. **使用增量导出**：只导出新增数据

### 格式兼容性问题
1. **CSV 特殊字符**：启用引用和转义 `--csv-quote=always`
2. **JSONL 编码**：确保使用 UTF-8 编码 `--encoding=utf-8`
3. **Markdown 表格**：复杂内容使用代码块包裹

## 最佳实践

### 团队协作
- **统一导出模板**：团队使用相同的导出配置
- **定期归档**：每月导出完整数据并归档
- **共享规范**：制定数据共享和脱敏规范

### 个人使用
- **工作日志**：每周导出中文周报，作为工作记录
- **知识积累**：将重要的 AI 决策导出为独立文档
- **技能分析**：通过 CSV 分析自己常用的 AI 模型和模式

### 系统集成
- **自动化流水线**：将导出集成到 CI/CD 流程
- **监控告警**：监控导出任务执行状态
- **版本管理**：对导出的数据文件进行版本控制