import { 
  Network, 
  Cpu, 
  GitBranch, 
  FileText, 
  Download, 
  ShieldCheck, 
  Globe,
  Plane,
  Zap,
  History,
  FileJson,
  Lock,
  Languages
} from 'lucide-react';

export const FEATURES = [
  {
    title: "MCP Protocol",
    description: "利用 Model Context Protocol 协议，AI Agent 主动上报交互记录，完整还原 AI 交互细节。",
    icon: Network,
  },
  {
    title: "Reasoning",
    description: "支持 DeepSeek-R1 推理过程缓存，完整记录思考步骤，辅助 AI 诊断与场景复现。",
    icon: Cpu,
  },
  {
    title: "Git Commit",
    description: "通过 Git Hook 自动将交互记录与 Git Commit 关联，准确追踪代码变更与 AI 决策链。",
    icon: GitBranch,
  },
  {
    title: "Commit Docs",
    description: "自动生成 Markdown/JSON/YAML 格式的 AI 交互上下文文档，便于人工 AI 对话 Code Review。",
    icon: FileText,
  },
  {
    title: "One-click Export",
    description: "支持将记录导出为 Markdown, PR/Code Review 说明，JSONL 格式数据，便于分享与配置。",
    icon: Download,
  },
  {
    title: "Local First",
    description: "所有数据存储在本地 SQLite，完全离线可用，保护您的代码隐私与数据所有权。",
    icon: ShieldCheck,
  },
  {
    title: "Internationalization",
    description: "完整支持中英文双语界面，适配不同语言习惯，满足全球开发者需求。",
    icon: Globe,
  },
];

export const THEMES = [
  {
    name: "Theme",
    icon: GitBranch,
    bg: "bg-[#1e1e1e]",
    text: "text-white"
  },
  {
    name: "Off-White",
    icon: Plane,
    bg: "bg-[#f5f5f5]",
    text: "text-black"
  },
  {
    name: "Dark Gray",
    icon: Plane,
    bg: "bg-[#333333]",
    text: "text-white"
  },
  {
    name: "Selected",
    icon: Plane,
    bg: "bg-[#007acc]",
    text: "text-white",
    selected: true
  }
];
