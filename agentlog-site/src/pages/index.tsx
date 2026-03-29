import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Plane, ChevronRight } from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-25, 25]);

  const glowScale = useTransform(springX, [-0.5, 0.5], [1, 1.5]);
  const glowOpacity = useTransform(springY, [-0.5, 0.5], [0.15, 0.5]);

  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
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
          <div className={styles.heroLogoWrapper}>
            <motion.div
              className={styles.heroLogoGlow}
              style={{ scale: glowScale, opacity: glowOpacity }}
            />
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 800 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={styles.heroLogo}
            >
              <div className={styles.heroLogoCircle} />
              <Plane className={styles.heroLogoIcon} />
              <div className={styles.speedLine1} />
              <div className={styles.speedLine2} />
              <div className={styles.speedLine3} />
            </motion.div>
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
