---
sidebar_position: 10
---

# Docker 部署

不使用 VS Code 插件时，可通过 Docker 单独部署 AgentLog 后台服务，支持任意 MCP 客户端（Cline、Cursor、OpenCode、Roo Code 等）。

## 环境要求

- Docker >= 20.10
- Docker Compose >= 2.0

## 快速启动

### 1. 克隆仓库

```bash
git clone https://github.com/agentlog/agentlog.git
cd agentlog
```

### 2. 启动服务

```bash
cd docker
cp .env.example .env
docker-compose up -d
```

### 3. 验证服务

```bash
curl http://localhost:7892/health
```

预期输出：
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-03-29T12:00:00.000Z",
  "uptime": 10
}
```

## 服务说明

Docker Compose 会启动两个服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| **agentlog-api** | 7892 | HTTP API 服务（默认启用） |
| **agentlog-mcp** | stdin/stdout | MCP Server（stdio 模式） |

## 停止服务

```bash
docker-compose down
```

完全清除数据：
```bash
docker-compose down -v
rm -rf data
```

## MCP 客户端配置

### Cline

编辑 `~/.cline/mcp.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

### OpenCode

编辑 `~/.opencode/mcp-servers.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

### Cursor

编辑 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

### Roo Code

编辑 `~/.roo/mcp.json`：

```json
{
  "mcpServers": {
    "agentlog": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "agentlog:latest", "mcp"],
      "env": {
        "AGENTLOG_HOST": "host.docker.internal:7892"
      }
    }
  }
}
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `AGENTLOG_PORT` | 7892 | HTTP API 监听端口 |
| `AGENTLOG_HOST` | 0.0.0.0 | HTTP API 监听地址 |
| `AGENTLOG_DB_PATH` | /data/agentlog.db | SQLite 数据库路径 |

## 数据持久化

数据存储在 Docker Volume 中，容器删除后数据不会丢失。

```bash
# 查看数据卷
docker volume ls | grep agentlog

# 备份数据
docker run --rm -v agentlog_agentlog-data:/data -v $(pwd):/backup alpine tar czf /backup/agentlog-backup.tar.gz -C /data .

# 恢复数据
docker run --rm -v agentlog_agentlog-data:/data -v $(pwd):/backup alpine tar xzf /backup/agentlog-backup.tar.gz -C /data
```

## 故障排查

### 查看日志

```bash
docker-compose logs -f
```

### 进入容器调试

```bash
docker exec -it agentlog sh
```

### 端口冲突

如果 7892 端口已被占用，修改 `docker/.env`：

```
AGENTLOG_PORT=8899
```

然后重启服务：

```bash
docker-compose down
docker-compose up -d
```

## 使用 Docker 镜像

如果已经构建或拉取了镜像，可直接运行：

```bash
# HTTP API 服务
docker run -d --name agentlog -p 7892:7892 -v $(pwd)/docker/data:/data agentlog:latest

# MCP Server
docker run --rm -i agentlog:latest mcp
```

## 多平台构建

### 本地构建

```bash
export DOCKER_BUILDKIT=1
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t agentlog:latest \
  -f docker/Dockerfile ..
```

### 推送到镜像仓库

```bash
# 登录 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 推送镜像
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/USERNAME/agentlog:latest \
  -f docker/Dockerfile \
  --push ..
```
