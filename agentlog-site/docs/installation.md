---
sidebar_position: 4
---

# 安装

详细安装指南。

## 环境准备

确保你的开发环境满足以下要求：

- Node.js >= 18
- pnpm >= 9
- Git

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/agentlog/agentlog.git
cd agentlog
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建共享类型

其他包依赖此包，所以需要先构建。

```bash
pnpm build:shared
```

### 4. 启动后台服务

启动本地后台服务，默认端口 7892。

```bash
pnpm dev
```

## 配置

在 VS Code 设置（`settings.json`）中配置 AgentLog。

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `agentlog.backendUrl` | `http://localhost:7892` | 后台服务地址 |
| `agentlog.autoCapture` | `true` | 是否自动捕获 AI 交互 |
| `agentlog.captureReasoning` | `true` | 是否捕获推理过程 |
| `agentlog.autoBindOnCommit` | `true` | commit 时自动绑定最近未绑定的会话 |
| `agentlog.debug` | `false` | 开启调试日志 |

## 验证

安装完成后，你可以在 VS Code 侧边栏看到 AgentLog 面板，表示安装成功。