/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Github, Globe, ExternalLink, ChevronRight, Plane, GitBranch, Sun, Moon } from 'lucide-react';
import { FEATURES, THEMES } from './constants';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.3)]">
            <Plane className="text-surface w-5 h-5 rotate-[-45deg]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">AgentLog</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
          <a href="#" className="hover:text-primary transition-colors">支付</a>
          <a href="#" className="hover:text-primary transition-colors">快速开始</a>
          <a href="#" className="hover:text-primary transition-colors">安装</a>
          <a href="#" className="hover:text-primary transition-colors">常见问题</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors text-white/70">
          GitHub <ExternalLink className="w-4 h-4" />
        </a>
        <div className="flex items-center gap-2 p-1 bg-surface-low rounded-full border border-outline-variant">
          <button className="p-1.5 hover:bg-surface-high rounded-full transition-colors">
            <Sun className="w-4 h-4 text-primary" />
          </button>
          <button className="p-1.5 hover:bg-surface-high rounded-full transition-colors">
            <Moon className="w-4 h-4 text-white/30" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-40 pb-32 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_60%)]" />
      <div className="grid grid-cols-12 h-full w-full">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border-r border-b border-outline-variant" />
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary blur-[80px] opacity-20" />
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full border border-primary/10" />
            <Plane className="text-primary w-32 h-32 md:w-40 md:h-40 drop-shadow-[0_0_30px_rgba(0,209,255,0.5)]" />
            {/* Speed lines */}
            <div className="absolute right-[-20px] top-[40%] w-12 h-[2px] bg-gradient-to-l from-primary to-transparent opacity-50" />
            <div className="absolute right-[-40px] top-[50%] w-20 h-[2px] bg-gradient-to-l from-primary to-transparent opacity-30" />
            <div className="absolute right-[-10px] top-[60%] w-16 h-[2px] bg-gradient-to-l from-primary to-transparent opacity-40" />
          </motion.div>
        </div>

        <h1 className="font-display text-7xl md:text-8xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          AgentLog
        </h1>
        <p className="text-xl md:text-2xl text-white/40 mb-12 font-display tracking-wide uppercase">
          AI Code Governance & Context Recovery
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button className="px-10 py-4 bg-[#f1a139] text-black font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(241,161,57,0.4)] primary-glow-strong">
            Quick Start
          </button>
          <button className="px-10 py-4 bg-transparent border border-outline-variant text-white/80 font-bold rounded-lg hover:bg-surface-low transition-colors">
            Install Guide
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ title, description, icon: Icon, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="group p-10 rounded-3xl tonal-card flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-surface-high flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
      <Icon className="text-primary w-8 h-8" />
    </div>
    <h3 className="font-display text-lg font-bold mb-4 tracking-tight">
      {title}
    </h3>
    <p className="text-white/30 leading-relaxed text-sm font-mono">
      {description}
    </p>
  </motion.div>
);

const VSCodeSidebar = () => (
  <div className="mt-32 w-full max-w-5xl mx-auto">
    <div className="flex flex-col items-center mb-12">
      <h2 className="font-display text-sm uppercase tracking-[0.3em] text-white/30 mb-8">VSCode Sidebar (Monochrome)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {THEMES.map((theme, i) => (
          <div key={i} className={`p-6 rounded-2xl ${theme.bg} flex flex-col items-center gap-4 relative overflow-hidden group cursor-pointer`}>
            {theme.selected && <div className="absolute top-3 right-3 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.selected ? 'bg-white/10' : 'bg-white/5'}`}>
              <theme.icon className={`w-6 h-6 ${theme.text} ${theme.name === 'Theme' ? '' : 'rotate-[-45deg]'}`} />
            </div>
            <span className={`text-xs font-medium ${theme.text} opacity-60`}>{theme.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Features = () => (
  <section className="py-32 bg-surface-dim">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {FEATURES.map((feature, i) => (
          <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-surface-low group-hover:bg-surface-high transition-colors flex items-center justify-center">
              <feature.icon className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-display uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors text-center">
              {feature.title}
            </span>
          </div>
        ))}
      </div>
      
      <VSCodeSidebar />
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 border-t border-outline-variant bg-surface-dim">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-low rounded-xl flex items-center justify-center border border-outline-variant">
          <Plane className="text-primary w-6 h-6 rotate-[-45deg]" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">AgentLog</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-10 text-white/40 text-sm font-medium">
        <a href="#" className="hover:text-primary transition-colors">Documentation</a>
        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
        <a href="#" className="hover:text-primary transition-colors">Terms</a>
        <a href="https://github.com" className="hover:text-primary transition-colors flex items-center gap-2">
          <Github className="w-4 h-4" /> GitHub
        </a>
      </div>

      <p className="text-white/20 text-xs font-mono">
        © 2026 THE INTELLIGENCE LEDGER. ALL RIGHTS RESERVED.
      </p>
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
