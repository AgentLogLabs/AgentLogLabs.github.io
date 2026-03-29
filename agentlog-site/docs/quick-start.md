---
sidebar_position: 3
---

# 快速开始

## 方式一：VS Code 插件（推荐）

VS Code 插件包含内置后端，最适合仅使用 VS Code 的用户。

### 前置要求

- VS Code
- Node.js >= 18（仅开发模式需要）

### 安装步骤

1. 在 VS Code 中搜索并安装 **AgentLog** 插件
2. 安装完成后，VS Code 侧边栏会出现 AgentLog 面板
3. 插件会自动启动后台服务

### 启动后台服务（开发模式）

```bash
git clone https://github.com/agentlog/agentlog.git
cd agentlog
pnpm install
pnpm dev
```

## 方式二：Docker 后端 + 外部 AI Agent

不依赖 VS Code，通过 Docker 部署后端服务，支持任意 MCP 客户端（Cline、Cursor、OpenCode、Roo Code 等）。

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

### 安装步骤

```bash
git clone https://github.com/agentlog/agentlog.git
cd agentlog/docker
cp .env.example .env
docker-compose up -d
```

### 配置 AI Agent

启动后，按照 [Docker 部署](./docker-deployment) 文档中的说明配置你的 AI Agent MCP 客户端。

### 验证服务

```bash
curl http://localhost:7892/health
```

## 下一步

- [VS Code 插件详细安装](./installation)
- [Docker 部署详细配置](./docker-deployment)
- [MCP 集成指南](./mcp-integration)
