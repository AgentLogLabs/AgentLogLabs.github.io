import { 
  Network, 
  Cpu, 
  GitBranch, 
  GitPullRequest, 
  FileText, 
  PanelLeft, 
  Download, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

export const FEATURES = [
  {
    title: "基于 MCP 协议的主动上报",
    description: "利用 Model Context Protocol 协议，AI Agent 主动上报交互记录，完整还原 AI 交互细节。",
    icon: Network,
  },
  {
    title: "拒绝过程缓存",
    description: "支持 DeepSeek-R1 推理过程缓存，完整记录思考步骤，辅助 AI 诊断与场景复现。",
    icon: Cpu,
  },
  {
    title: "Git Commit 绑定",
    description: "通过 Git Hook 自动将交互记录与 Git Commit 关联，准确追踪代码变更与 AI 决策链。",
    icon: GitBranch,
  },
  {
    title: "Git Worktree 支持",
    description: "多个 AI Agent 同时在不同 worktree 上并行开发，各自独立记录与管理 Commit，互不干扰。",
    icon: GitPullRequest,
  },
  {
    title: "Commit 上下文文档",
    description: "自动生成 Markdown/JSON/YAML 格式的 AI 交互上下文文档，便于人工 AI 对话 Code Review。",
    icon: FileText,
  },
  {
    title: "侧边栏面板",
    description: "VS Code 侧边栏实时展示交互记录，Commit 快速预览，设计简洁，不影响 AI 使用习惯。",
    icon: PanelLeft,
  },
  {
    title: "一键导出",
    description: "支持将记录导出为 Markdown, PR/Code Review 说明，JSONL 格式数据，便于分享与配置。",
    icon: Download,
  },
  {
    title: "本地优先",
    description: "所有数据存储在本地 SQLite，完全离线可用，保护您的代码隐私与数据所有权。",
    icon: ShieldCheck,
  },
  {
    title: "中英文国际化",
    description: "完整支持中英文双语界面，适配不同语言习惯，满足全球开发者需求。",
    icon: Globe,
  },
];
