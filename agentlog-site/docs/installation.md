---
sidebar_position: 1
---

# VS Code 插件安装

本指南详细介绍如何安装 AgentLog VS Code 插件。

## 环境准备

- VS Code
- Git

## 安装步骤

### 1. 安装插件

在 VS Code 中搜索 **AgentLog**，点击安装。

[![Marketplace](https://img.shields.io/badge/Marketplace-AgentLog-brightgreen?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=AgentLogLabs.agentlog-vscode)

或者 [直接下载 VSCode 插件](https://marketplace.visualstudio.com/items?itemName=AgentLogLabs.agentlog-vscode)

### 2. 开始使用

安装完成后，VS Code 侧边栏会出现 AgentLog 面板，表示安装成功。

插件会自动启动后台服务（端口 7892）。

## 配置

在 VS Code 设置（`settings.json`）中配置 AgentLog。

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `agentlog.backendUrl` | `http://localhost:7892` | 后台服务地址 |
| `agentlog.autoCapture` | `true` | 是否自动捕获 AI 交互 |
| `agentlog.captureReasoning` | `true` | 是否捕获推理过程 |
| `agentlog.autoBindOnCommit` | `true` | commit 时自动绑定最近未绑定的会话 |
| `agentlog.debug` | `false` | 开启调试日志 |

## 其他安装方式

如果你不使用 VS Code，可通过 Docker 部署后端服务：

- [Docker 部署](./docker-deployment) - 支持任意 MCP 客户端（Cline、Cursor、OpenCode、Roo Code 等）
