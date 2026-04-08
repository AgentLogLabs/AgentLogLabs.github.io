import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AgentLog',
  tagline: 'AI 编程飞行记录仪',
  favicon: 'img/128.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://agentloglabs.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AgentLogLabs', // Usually your GitHub org/user name.
  projectName: 'AgentLogLabs.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },


  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/agentloglabs/agentlog/tree/main/',
          lastVersion: '1.1.2',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blog',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    mermaid: {
      theme: {
        light: 'default',
        dark: 'dark',
      },
    },
    // Replace with your project's social card
    image: 'img/logo.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'AgentLog',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {
          to: '/docs/quick-start',
          label: '快速开始',
          position: 'left',
        },
        {
          to: '/docs/installation',
          label: '安装',
          position: 'left',
        },
        {
          to: '/docs/faq',
          label: '常见问题',
          position: 'left',
        },
        {
          to: '/blog',
          label: '博客',
          position: 'left',
        },
        {
          href: 'https://github.com/agentloglabs/agentlog',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://marketplace.visualstudio.com/items?itemName=AgentLogLabs.agentlog-vscode',
          label: '下载 VSCode 插件',
          position: 'right',
          className: 'button button--primary button--sm',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '安装指南',
              to: '/docs/installation',
            },
            {
              label: '快速开始',
              to: '/docs/quick-start',
            },
            {
              label: '常见问题',
              to: '/docs/faq',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/agentloglabs/agentlog',
            },
            {
              label: '问题反馈',
              href: 'https://github.com/agentloglabs/agentlog/issues',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '项目架构',
              to: '/docs/architecture',
            },
            {
              label: 'API 文档',
              href: 'https://github.com/agentloglabs/agentlog#后台-api-一览',
            },
          ],
        },
        {
          title: '微信群',
          items: [
            {
              html: `<img src="/img/AgentLog-wechat-QR.png" alt="微信群" style="width:120px;border-radius:8px;" />`,
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
