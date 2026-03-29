import { 
  GitBranch, 
  Plane,
  Share2,
  ArrowUpRight
} from 'lucide-react';

export const FEATURES = [
  {
    title: "MCP Protocol",
    description: "利用 Model Context Protocol 协议，AI Agent 主动上报交互记录，完整还原 AI 交互细节。",
    icon: Share2,
  },
  {
    title: "Reasoning",
    description: "支持 DeepSeek-R1 推理过程缓存，完整记录思考步骤，辅助 AI 诊断与场景复现。",
    icon: Plane,
  },
  {
    title: "Git Commit",
    description: "通过 Git Hook 自动将交互记录与 Git Commit 关联，准确追踪代码变更与 AI 决策链。",
    icon: GitBranch,
  },
  {
    title: "Commit Docs",
    description: "自动生成 Markdown/JSON/YAML 格式的 AI 交互上下文文档，便于人工 AI 对话 Code Review。",
    icon: GitBranch,
  },
  {
    title: "One-click Export",
    description: "支持将记录导出为 Markdown, PR/Code Review 说明，JSONL 格式数据，便于分享与配置。",
    icon: ArrowUpRight,
  },
  {
    title: "Local First",
    description: "所有数据存储在本地 SQLite，完全离线可用，保护您的代码隐私与数据所有权。",
    icon: Plane,
  },
  {
    title: "Internationalization",
    description: "完整支持中英文双语界面，适配不同语言习惯，满足全球开发者需求。",
    icon: Plane,
  },
];
