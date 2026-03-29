---
sidebar_position: 1
---

# 开发指南

本文档介绍如何参与 AgentLog 项目的开发工作。

## 环境准备

### 系统要求
- **Node.js**：>= 18.x（推荐 20.x LTS）
- **pnpm**：>= 9.x（必须，使用 workspaces）
- **Git**：>= 2.x
- **操作系统**：macOS、Linux、Windows（WSL2 推荐）

### 开发工具推荐
- **VS Code**：主开发环境
- **必备扩展**：
  - TypeScript 支持
  - ESLint
  - Prettier
  - GitLens
- **调试工具**：
  - VS Code 调试器
  - Chrome DevTools（Webview 调试）

## 项目结构

```
agentlog/
├── package.json              # 根 package.json（pnpm workspaces 配置）
├── pnpm-workspace.yaml      # pnpm workspaces 配置
├── packages/                # 子包目录
│   ├── shared/             # 共享类型定义
│   │   ├── src/
│   │   │   ├── index.ts    # 公共导出
│   │   │   └── types.ts    # 核心类型定义
│   │   └── package.json
│   ├── backend/            # 本地后台服务
│   │   ├── src/
│   │   │   ├── index.ts    # Fastify 服务入口
│   │   │   ├── db/         # 数据库层
│   │   │   ├── routes/     # REST API 路由
│   │   │   ├── services/   # 业务逻辑
│   │   │   └── mcp.ts      # MCP Server 入口
│   │   └── package.json
│   └── vscode-extension/   # VS Code 插件
│       ├── src/
│       │   ├── extension.ts # 插件主入口
│       │   ├── client/      # HTTP 客户端
│       │   ├── providers/   # TreeView/Webview
│       │   └── commands/    # 命令实现
│       └── package.json
├── docs/                   # 项目文档
└── scripts/               # 开发脚本
```

## 开发工作流

### 1. 获取代码
```bash
# 克隆仓库
git clone https://github.com/agentlog/agentlog.git
cd agentlog

# 安装依赖
pnpm install

# 构建共享包（其他包依赖此包）
pnpm build:shared
```

### 2. 启动开发环境
```bash
# 启动后台服务（热重载）
pnpm dev

# 或分别启动各包
pnpm dev:backend    # 后台服务
pnpm dev:shared     # 共享包 watch 模式
```

### 3. 调试 VS Code 扩展
1. 用 VS Code 打开项目根目录
2. 按 `F5` 启动扩展调试
3. 新窗口打开后，AgentLog 扩展会自动激活

### 4. 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test:backend
pnpm test:shared

# 测试覆盖率
pnpm test:coverage
```

## 代码规范

### TypeScript 规范
- **严格模式**：启用所有严格类型检查
- **ESLint**：使用项目配置的规则
- **Prettier**：代码格式化
- **导入顺序**：第三方库 → 内部模块 → 相对路径

### 提交规范
使用 Conventional Commits：
```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码风格调整（不影响功能）
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具变动
```

### 分支策略
- `main`：稳定版本，受保护分支
- `develop`：开发分支，功能集成
- `feature/*`：新功能开发
- `bugfix/*`：bug 修复
- `release/*`：发布准备

## 核心模块开发

### 共享类型 (packages/shared)
```typescript
// 添加新类型示例
export interface NewType {
  id: string;
  // ... 其他字段
}

// 更新导出
export * from './types';
export * from './new-types'; // 新增文件
```

### 后台服务 (packages/backend)

#### 添加新路由
```typescript
// src/routes/new-route.ts
import { FastifyInstance } from 'fastify';

export default async function newRoute(fastify: FastifyInstance) {
  fastify.get('/api/new-endpoint', async (request, reply) => {
    return { message: 'Hello' };
  });
}

// src/index.ts 中注册
import newRoute from './routes/new-route';
// ...
app.register(newRoute);
```

#### 数据库操作
```typescript
// 使用现有的数据库工具函数
import { db } from './db/database';

const result = db.prepare('SELECT * FROM agent_sessions WHERE id = ?').get(id);
```

### VS Code 扩展 (packages/vscode-extension)

#### 添加新命令
```typescript
// src/commands/new-command.ts
import * as vscode from 'vscode';

export function registerNewCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('agentlog.newCommand', () => {
    vscode.window.showInformationMessage('New command executed!');
  });
  context.subscriptions.push(command);
}

// extension.ts 中注册
import { registerNewCommand } from './commands/new-command';
registerNewCommand(context);
```

#### 扩展 TreeView
```typescript
// 扩展 SessionTreeProvider
class ExtendedTreeProvider extends SessionTreeProvider {
  // 重写或扩展方法
}
```

## 测试指南

### 单元测试
```typescript
// 示例测试文件
import { describe, it, expect } from 'vitest';
import { someFunction } from './module';

describe('someFunction', () => {
  it('should return expected value', () => {
    const result = someFunction('input');
    expect(result).toBe('expected');
  });
});
```

### 集成测试
```typescript
// 测试 API 端点
import { app } from '../src/index';
import { test } from 'vitest';

test('GET /health', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/health'
  });
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toHaveProperty('status', 'ok');
});
```

### VS Code 扩展测试
```typescript
import * as vscode from 'vscode';
import * as assert from 'assert';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('agentlog.agentlog');
    assert.ok(extension);
  });
});
```

## 调试技巧

### 后端调试
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/packages/backend/src/index.ts",
      "runtimeArgs": ["--loader", "tsx"],
      "env": {
        "AGENTLOG_PORT": "7892",
        "AGENTLOG_LOG_LEVEL": "debug"
      }
    }
  ]
}
```

### MCP Server 调试
```bash
# 手动启动 MCP Server 查看输出
cd packages/backend
npx tsx src/mcp.ts

# 或通过环境变量启用详细日志
export AGENTLOG_DEBUG=true
npx tsx src/mcp.ts
```

### VS Code 扩展调试
1. 在扩展代码中设置断点
2. 按 `F5` 启动调试扩展主机
3. 在新窗口中执行触发断点的操作
4. 查看变量和调用堆栈

## 数据库迁移

### 创建新迁移
```typescript
// 在 packages/backend/src/db/migrations/ 中添加新文件
// 例如：003-add-new-column.ts
export const migration = {
  version: 3,
  description: '添加新字段',
  up: `ALTER TABLE agent_sessions ADD COLUMN new_column TEXT`,
  down: `ALTER TABLE agent_sessions DROP COLUMN new_column`
};
```

### 测试迁移
```bash
# 创建测试数据库
cp ~/.agentlog/agentlog.db ~/.agentlog/agentlog-test.db

# 运行迁移测试
AGENTLOG_DB_PATH=~/.agentlog/agentlog-test.db pnpm test:migration
```

## 构建与发布

### 本地构建
```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:shared
pnpm build:backend
pnpm build:extension
```

### 版本管理
```bash
# 更新版本号（遵循 semver）
pnpm version patch  # 0.0.1 → 0.0.2
pnpm version minor  # 0.0.1 → 0.1.0
pnpm version major  # 0.0.1 → 1.0.0

# 更新所有包的版本
pnpm -r version patch
```

### VS Code 扩展打包
```bash
# 生成 .vsix 文件
cd packages/vscode-extension
vsce package

# 或使用脚本
pnpm package:extension
```

## 性能优化

### 数据库性能
```typescript
// 使用预处理语句
const stmt = db.prepare('SELECT * FROM agent_sessions WHERE id = ?');
const result = stmt.get(id);

// 批量操作使用事务
db.transaction(() => {
  // 多个操作
})();
```

### 内存管理
```typescript
// 流式处理大数据
import { createReadStream } from 'fs';

// 分页查询避免内存溢出
const pageSize = 100;
let offset = 0;
let hasMore = true;

while (hasMore) {
  const rows = db.prepare(
    'SELECT * FROM agent_sessions LIMIT ? OFFSET ?'
  ).all(pageSize, offset);
  
  if (rows.length < pageSize) hasMore = false;
  offset += pageSize;
  
  // 处理当前页数据
}
```

## 国际化

### 添加新语言
```typescript
// 在适当的位置添加语言资源
const messages = {
  en: {
    hello: 'Hello',
    goodbye: 'Goodbye'
  },
  zh: {
    hello: '你好',
    goodbye: '再见'
  }
};

// 根据用户设置选择语言
const lang = vscode.env.language;
const t = messages[lang] || messages.en;
```

## 常见问题

### 依赖问题
```bash
# 清除 node_modules 重新安装
rm -rf node_modules packages/*/node_modules
pnpm install

# 更新依赖
pnpm update
```

### 类型错误
```bash
# 检查 TypeScript 错误
pnpm typecheck

# 或单独检查
pnpm typecheck:shared
pnpm typecheck:backend
pnpm typecheck:extension
```

### 测试失败
```bash
# 运行特定测试文件
pnpm test -- packages/backend/test/specific.test.ts

# 调试测试
pnpm test -- --inspect-brk
```

## 学习资源

### 相关技术文档
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Fastify 文档](https://www.fastify.io/docs/latest/)
- [VS Code 扩展 API](https://code.visualstudio.com/api)
- [MCP 协议](https://modelcontextprotocol.io/)
- [SQLite 文档](https://www.sqlite.org/docs.html)

### 代码示例
- 参考现有模块的实现
- 查看测试文件了解使用方式
- 阅读类型定义理解数据结构

### 社区支持
- [GitHub Issues](https://github.com/agentlog/agentlog/issues)
- [Discussions](https://github.com/agentlog/agentlog/discussions)
- 提交 Pull Request 前先讨论方案