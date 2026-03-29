/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Github, Globe, ExternalLink, ChevronRight, Terminal } from 'lucide-react';
import { FEATURES } from './constants';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Terminal className="text-surface w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">AgentLog</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
          <a href="#" className="hover:text-primary transition-colors">支付</a>
          <a href="#" className="hover:text-primary transition-colors">快速开始</a>
          <a href="#" className="hover:text-primary transition-colors">安装</a>
          <a href="#" className="hover:text-primary transition-colors">常见问题</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          GitHub <ExternalLink className="w-4 h-4" />
        </a>
        <button className="p-2 hover:bg-surface-high rounded-full transition-colors">
          <Globe className="w-5 h-5" />
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_50%)]" />
      <div className="grid grid-cols-12 h-full w-full">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border-r border-b border-outline-variant" />
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-surface-high rounded-2xl border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_50px_-12px_rgba(0,209,255,0.3)]">
          <Terminal className="text-primary w-12 h-12" />
        </div>
        <h1 className="font-display text-6xl md:text-7xl font-bold mb-4 tracking-tighter">
          AgentLog
        </h1>
        <p className="text-xl md:text-2xl text-white/60 mb-10 font-medium">
          AI 编程飞行记录仪
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-8 py-3 bg-primary text-surface font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,209,255,0.4)]">
            快速开始 <ChevronRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-3 bg-surface-high border border-primary/30 text-primary font-bold rounded-lg hover:bg-surface-highest transition-colors">
            安装指南
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ title, description, icon: Icon, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group p-8 rounded-2xl bg-surface-low hover:bg-surface-high transition-all duration-300 border border-transparent hover:border-primary/10"
  >
    <div className="w-12 h-12 rounded-xl bg-surface-high group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors">
      <Icon className="text-primary w-6 h-6" />
    </div>
    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-white/50 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

const Features = () => (
  <section className="py-20 bg-surface">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-outline-variant bg-surface-low/30">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Terminal className="text-primary w-5 h-5" />
        <span className="font-display font-bold text-lg">AgentLog</span>
      </div>
      <p className="text-white/40 text-sm">
        © 2026 AgentLog. 本地优先，隐私安全。
      </p>
      <div className="flex items-center gap-6 text-white/60 text-sm">
        <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
        <a href="#" className="hover:text-primary transition-colors">服务条款</a>
        <a href="https://github.com" className="hover:text-primary transition-colors flex items-center gap-1">
          <Github className="w-4 h-4" /> GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
