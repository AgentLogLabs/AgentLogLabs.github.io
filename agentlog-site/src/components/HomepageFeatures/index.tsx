import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import {
  Network,
  Cpu,
  GitBranch,
  GitPullRequest,
  FileText,
  PanelLeft,
  Download,
  ShieldCheck,
  Globe,
  type LucideIcon
} from 'lucide-react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: LucideIcon;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '基于 MCP 协议主动上报',
    icon: Network,
    description: (
      <>
        采用 Model Context Protocol 标准，AI Agent 主动上报交互记录，完整捕获 AI 交互过程。
      </>
    ),
  },
  {
    title: '推理过程保存',
    icon: Cpu,
    description: (
      <>
        专项支持 DeepSeek-R1 推理链，完整存储中间思考步骤，理解 AI 的决策逻辑。
      </>
    ),
  },
  {
    title: 'Git Commit 绑定',
    icon: GitBranch,
    description: (
      <>
        通过 Git Hook 自动将提交与相关 AI 会话关联，追溯代码变更的 AI 决策过程。
      </>
    ),
  },
  {
    title: 'Git Worktree 支持',
    icon: GitPullRequest,
    description: (
      <>
        多个 AI Agent 可同时在不同 worktree 上并行工作，各自会话精准绑定到对应 Commit，互不干扰。
      </>
    ),
  },
  {
    title: 'Commit 上下文文档',
    icon: FileText,
    description: (
      <>
        自动生成 Markdown/JSON/XML 格式的 AI 交互上下文文档，便于注入新 AI 对话或 Code Review。
      </>
    ),
  },
  {
    title: '侧边栏面板',
    icon: PanelLeft,
    description: (
      <>
        VS Code 侧边栏显示会话列表、Commit 绑定关系、统计数据，随时查看 AI 使用情况。
      </>
    ),
  },
  {
    title: '一键导出',
    icon: Download,
    description: (
      <>
        支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格，便于分享和汇报。
      </>
    ),
  },
  {
    title: '本地优先',
    icon: ShieldCheck,
    description: (
      <>
        所有数据存储在本机 SQLite，完全离线可用，保护你的代码隐私和知识产权。
      </>
    ),
  },
  {
    title: '中英文国际化',
    icon: Globe,
    description: (
      <>
        完整支持中文和英文输出，界面和导出文档自由切换，满足不同场景需求。
      </>
    ),
  },
];

function Feature({title, icon: Icon, description, index}: FeatureItem & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={clsx('col col--4', styles.featureCol)}
    >
      <div className={styles.featureCard}>
        <div className={styles.featureIconWrapper}>
          <Icon className={styles.featureIcon} />
        </div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </motion.div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}