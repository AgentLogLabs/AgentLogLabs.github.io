import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro",
    "quick-start",
    {
      type: "category",
      label: "安装部署",
      items: ["installation", "docker-deployment"],
    },
    "mcp-integration",
    {
      type: "category",
      label: "使用指南",
      items: ["tutorials", "phase1-tracing", "configuration", "export-guide"],
    },
    {
      type: "category",
      label: "技术参考",
      items: ["architecture", "api-reference", "data-model", "reference/features", "faq"],
    },
    {
      type: "category",
      label: "开发",
      items: ["development", "contributing"],
    },
    {
      type: "category",
      label: "关于我们",
      items: ["team"],
    },
  ],
};

export default sidebars;
