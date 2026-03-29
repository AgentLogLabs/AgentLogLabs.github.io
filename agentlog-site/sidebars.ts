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
    "features",
    "quick-start",
    "installation",
    "mcp-integration",
    {
      type: "category",
      label: "使用指南",
      items: ["tutorials", "configuration", "export-guide"],
    },
    {
      type: "category",
      label: "技术参考",
      items: ["architecture", "api-reference", "data-model", "faq"],
    },
    {
      type: "category",
      label: "开发",
      items: ["development", "contributing"],
    },
  ],
};

export default sidebars;
