import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      {/* Background Pattern */}
      <div className={styles.heroBackground}>
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid}>
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className={styles.gridCell} />
          ))}
        </div>
      </div>

      <div className={clsx('container', styles.heroContainer)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.heroContent}
        >
          {/* Logo Icon */}
          <div className={styles.heroLogo}>
            <Terminal className={styles.heroLogoIcon} />
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link
              className={clsx('button button--primary button--lg', styles.buttonPrimary)}
              to="/docs/quick-start">
              快速开始 <ChevronRight className={styles.buttonIcon} />
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.buttonOutline)}
              to="/docs/installation">
              安装指南
            </Link>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="AI 编程飞行记录仪"
      description="自动捕获 AI Agent 交互日志，与 Git Commit 绑定，一键导出周报或 PR 说明。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
