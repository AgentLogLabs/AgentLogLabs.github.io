import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '自动捕获',
    icon: '🎙️',
    description: (
      <>
        拦截发往 DeepSeek / Qwen / Kimi 等 API 的请求，提取 Prompt + Response，完整记录 AI 交互过程。
      </>
    ),
  },
  {
    title: 'Git 绑定',
    icon: '🔗',
    description: (
      <>
        通过 post-commit 钩子，自动将每次提交与相关 AI 会话关联，追溯代码变更的 AI 决策过程。
      </>
    ),
  },
  {
    title: '本地优先',
    icon: '🏠',
    description: (
      <>
        所有数据存储在本机 SQLite，完全离线可用，保护你的代码隐私和知识产权。
      </>
    ),
  },
  {
    title: '推理保存',
    icon: '🧠',
    description: (
      <>
        专项支持 DeepSeek-R1 的推理链，完整存储中间思考步骤，理解 AI 的决策逻辑。
      </>
    ),
  },
  {
    title: '一键导出',
    icon: '📝',
    description: (
      <>
        支持导出为中文周报、PR/Code Review 说明、JSONL 原始数据、CSV 表格，便于分享和汇报。
      </>
    ),
  },
  {
    title: '侧边栏面板',
    icon: '📊',
    description: (
      <>
        VS Code 侧边栏显示会话列表、Commit 绑定关系、统计数据，随时查看 AI 使用情况。
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon} role="img" aria-label={title}>
          {icon}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}