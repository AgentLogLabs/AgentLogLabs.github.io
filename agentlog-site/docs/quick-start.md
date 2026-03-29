---
sidebar_position: 3
---

# 快速开始

了解如何使用 AgentLog 记录你的 AI 编程过程。

## 前置要求

- Node.js >= 18
- pnpm >= 9
- Git

## 安装依赖

```bash
pnpm install
```

## 开发模式

```bash
# 启动后台服务（热重载）
pnpm dev

# 或分别启动各包的 watch 模式
pnpm build:shared   # 先构建共享类型
pnpm dev:backend    # 启动后台（tsx watch）
```

### 在 VS Code 中调试插件

1. 用 VS Code 打开项目根目录
2. 按 `F5` 启动扩展调试（会打开新的 Extension Development Host 窗口）
3. 在新窗口中，后台服务会自动启动

## 构建全部

```bash
pnpm build
```