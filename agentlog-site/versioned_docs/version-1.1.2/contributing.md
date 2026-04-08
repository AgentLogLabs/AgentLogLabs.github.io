---
sidebar_position: 2
---

# 贡献指南

感谢您对 AgentLog 项目的关注！我们欢迎各种形式的贡献，包括代码、文档、测试、问题反馈等。

## 贡献方式

### 1. 报告问题
- **Bug 报告**：详细描述问题现象、复现步骤、期望行为
- **功能请求**：说明使用场景、预期价值、可能的设计方案
- **文档问题**：指出不准确、缺失或难以理解的部分

**报告前请检查**：
- [Issues](https://github.com/agentloglabs/agentlog/issues) 是否已有类似问题
- 使用最新的代码版本
- 提供完整的错误日志和环境信息

### 2. 提交代码
- **小修复**：直接提交 Pull Request
- **新功能**：先创建 Issue 讨论设计方案
- **重构优化**：确保不破坏现有功能

### 3. 改进文档
- 修正错别字和语法错误
- 补充缺失的文档
- 添加使用示例
- 改进文档结构

### 4. 帮助他人
- 解答 Issues 中的问题
- 评审 Pull Request
- 分享使用经验
- 编写教程或博客

## 开发流程

### 1. 前期讨论
对于较大的改动，建议先创建 Issue 讨论：
- **问题描述**：要解决什么问题
- **方案设计**：如何解决，技术选型
- **影响评估**：对现有功能的影响
- **测试计划**：如何验证改动正确性

### 2. 分支管理
```bash
# 1. Fork 仓库
# 2. 克隆你的 Fork
git clone https://github.com/你的用户名/agentlog.git
cd agentlog

# 3. 添加上游仓库
git remote add upstream https://github.com/agentloglabs/agentlog.git

# 4. 创建功能分支
git checkout -b feat/新功能名称

# 5. 定期同步上游代码
git fetch upstream
git rebase upstream/main
```

### 3. 代码提交
```bash
# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 或使用更详细的提交信息
git commit -m "feat: 添加新功能

- 实现了 XXX 功能
- 修复了 YYY 问题
- 优化了 ZZZ 性能

Closes #123"
```

**提交信息规范**：
- 使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式
- 类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`
- 范围：可选，如 `feat(backend): 添加新API`
- 正文：详细说明改动内容和原因
- 脚注：关联 Issue，如 `Closes #123`

### 4. 测试验证
```bash
# 运行所有测试
pnpm test

# 检查类型
pnpm typecheck

# 检查代码风格
pnpm lint

# 确保构建通过
pnpm build
```

### 5. 提交 Pull Request
1. **推送分支**：`git push origin feat/新功能名称`
2. **创建 PR**：在 GitHub 界面创建 Pull Request
3. **填写模板**：完整填写 PR 描述，说明改动内容
4. **关联 Issue**：使用 `Closes #123` 自动关联
5. **等待审查**：维护者会进行代码审查

## 代码规范

### TypeScript
- 使用严格模式（`strict: true`）
- 优先使用接口（`interface`）而非类型别名（`type`）
- 避免 `any` 类型，使用 `unknown` 或具体类型
- 导出函数和类时添加 JSDoc 注释

### 命名规范
- **变量/函数**：camelCase
- **类/接口/类型**：PascalCase
- **常量**：UPPER_SNAKE_CASE
- **文件**：kebab-case.ts
- **私有成员**：前缀 `_`（如 `_privateMethod`）

### 代码风格
- 使用 2 空格缩进
- 单行不超过 100 字符
- 使用单引号（`'`）
- 尾随逗号（trailing commas）
- 分号结尾

### 错误处理
```typescript
// 使用 try-catch 处理可能失败的异步操作
try {
  await someAsyncOperation();
} catch (error) {
  // 记录错误上下文
  logger.error('操作失败', { error, context: '...' });
  // 抛出有意义的错误
  throw new Error(`操作失败: ${error.message}`);
}

// 避免空的 catch 块
```

### 日志记录
```typescript
// 使用结构化日志
logger.info('用户操作', {
  userId,
  action: 'create',
  resource: 'session',
  durationMs
});

// 不同级别日志
logger.debug('调试信息', { details });
logger.warn('警告信息', { reason });
logger.error('错误信息', { error, stack });
```

## 测试要求

### 测试覆盖率
- 新功能至少达到 80% 行覆盖率
- 核心功能（数据库、API、MCP）要求更高
- 边缘情况和错误路径必须覆盖

### 测试类型
```typescript
// 单元测试：测试单个函数
describe('formatDuration', () => {
  it('应该正确格式化毫秒', () => {
    expect(formatDuration(61000)).toBe('1分1秒');
  });
});

// 集成测试：测试模块间协作
describe('会话创建流程', () => {
  it('应该创建会话并写入数据库', async () => {
    const session = await createSession(data);
    const dbRecord = await db.getSession(session.id);
    expect(dbRecord).toBeDefined();
  });
});

// E2E 测试：完整工作流
describe('MCP 记录流程', () => {
  it('应该通过 MCP 记录完整会话', async () => {
    // 模拟 MCP 调用
    // 验证数据库记录
    // 验证侧边栏显示
  });
});
```

### 测试数据
- 使用测试数据库（避免污染生产数据）
- 测试后清理测试数据
- 使用工厂函数创建测试数据
- 避免硬编码的测试数据

## 文档要求

### 代码注释
```typescript
/**
 * 创建新的 AI 会话
 * 
 * @param data 会话数据
 * @returns 创建的会话 ID
 * @throws {ValidationError} 当数据无效时
 * @example
 * const id = await createSession({
 *   provider: 'deepseek',
 *   model: 'deepseek-r1'
 * });
 */
async function createSession(data: CreateSessionDTO): Promise<string> {
  // 实现
}
```

### 用户文档
- 使用清晰简洁的语言
- 提供实际使用示例
- 包含截图或 GIF（如适用）
- 说明前提条件和后续步骤

### API 文档
- 完整的端点描述
- 请求/响应示例
- 参数说明和约束
- 错误码和可能的问题

## 评审标准

### 代码审查要点
1. **正确性**：功能是否按预期工作
2. **安全性**：是否有安全隐患
3. **性能**：是否影响性能
4. **可维护性**：代码是否清晰易读
5. **测试覆盖**：是否有足够的测试
6. **向后兼容**：是否破坏现有功能
7. **文档更新**：是否更新相关文档

### 常见反馈
- **需要更多测试**：添加测试用例
- **代码复杂度高**：拆分为小函数
- **命名不清晰**：使用更具描述性的名称
- **缺少错误处理**：添加适当的错误处理
- **性能问题**：优化算法或数据结构

### 评审流程
1. **初步检查**：自动化检查（CI）
2. **功能验证**：审查者验证功能
3. **代码审查**：审查代码质量
4. **修改请求**：如有问题，请求修改
5. **最终批准**：所有检查通过后合并

## 发布流程

### 版本管理
- **主版本**（Major）：不兼容的 API 变更
- **次版本**（Minor）：向后兼容的新功能
- **修订版本**（Patch）：向后兼容的问题修复

### 发布检查清单
- [ ] 所有测试通过
- [ ] 类型检查通过
- [ ] 代码风格检查通过
- [ ] 构建通过
- [ ] 更新日志（CHANGELOG）已更新
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] 依赖包版本已检查

### 发布后
- 验证发布包功能正常
- 更新网站文档（如适用）
- 在社区渠道发布公告
- 监控错误报告和用户反馈

## 社区行为准则

### 基本原则
1. **尊重**：尊重所有贡献者，无论经验水平
2. **包容**：欢迎不同背景和观点的贡献者
3. **专业**：保持专业和技术讨论
4. **协作**：共同解决问题，而非指责

### 沟通指南
- **清晰表达**：使用明确、具体的语言
- **积极倾听**：理解他人观点后再回应
- **建设性反馈**：提供具体、可操作的反馈
- **避免假设**：不假设他人的知识或意图

### 解决争议
1. **私下沟通**：首先尝试私下解决问题
2. **寻求调解**：如无法解决，联系维护者调解
3. **遵循决定**：接受维护者的最终决定

## 资源链接

### 开发资源
- [项目 README](https://github.com/agentloglabs/agentlog#readme)
- [架构文档](./architecture)
- [API 参考](./api-reference)
- [数据模型](./data-model)

### 学习资源
- [TypeScript 入门](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [VS Code 扩展开发](https://code.visualstudio.com/api)
- [Fastify 快速开始](https://www.fastify.io/docs/latest/Guides/Getting-Started/)
- [MCP 协议介绍](https://modelcontextprotocol.io/introduction)

### 联系方式
- [GitHub Issues](https://github.com/agentloglabs/agentlog/issues)：问题和功能请求
- [GitHub Discussions](https://github.com/agentloglabs/agentlog/discussions)：技术讨论
- [电子邮件](mailto:maintainers@agentloglabs.github.io)：私下沟通（如需要）

## 致谢

感谢所有为 AgentLog 项目做出贡献的人！您的每一份贡献都让这个项目变得更好。

### 贡献者名单
查看 [GitHub Contributors](https://github.com/agentloglabs/agentlog/graphs/contributors) 页面。

### 特别感谢
- 早期测试用户提供宝贵反馈
- 文档贡献者改进使用体验
- 代码审查者确保代码质量
- 社区成员分享使用经验