import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'RockOS',
  tagline: 'RockOS 是 PLCT 实验室支持开发的面向 EIC770X 系列芯片生态的 Debian 优化发行版',
  favicon: 'img/plct-logo.png',

  // Set the production url of your site here
  url: 'https://docs.rockos.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rockos-riscv', // Usually your GitHub org/user name.
  projectName: 'rockos-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'RockOS',
      logo: {
        alt: 'PLCT Logo',
        src: 'img/plct-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '安装教程',
        },
        { to: '/blog', label: '博客', position: 'left' },
        { to: '/ProjectList', label: '项目列表', position: 'left' },
        { to: '/ImageList', label: '镜像列表', position: 'left' },
        {
          href: 'https://github.com/rockos-riscv',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '安装',
              to: '/docs/installation',
            },
            {
              label: 'KVM 使用',
              to: '/docs/kvm',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'PLCT Lab',
              href: 'https://plctlab.org/',
            },
            {
              label: 'RuyiSDK',
              href: 'https://ruyisdk.org/',
            },
            {
              label: 'Jiachen Project',
              href: 'https://rv2036.org/',
            },
          ],
        },
      ],
      copyright: `Copyright © 2024-${new Date().getFullYear()} PLCT Lab. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
