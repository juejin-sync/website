import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || (process.env.GITHUB_ACTIONS ? '/juejin-sync/' : '/')

export default defineConfig({
  title: '掘金同步助手',
  titleTemplate: ':title · 掘金同步助手',
  description: '一款轻量开源的 Chrome 浏览器扩展：支持掘金发文一键同步至各大平台草稿箱，原图无损，自动排版，一键直达。',
  base,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  vite: {
    css: {
      postcss: {}
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon.png` }],
    ['link', { rel: 'shortcut icon', href: `${base}favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#1E80FF' }],
    ['meta', { name: 'keywords', content: '掘金, CSDN, 微信公众号, 博客园, 知乎, 文章同步, 掘金同步助手, juejin-sync, Chrome扩展, Markdown, 图床转存, 草稿幂等, Manifest V3' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '掘金同步助手 · 创作者多平台文章同步工具' }],
    ['meta', { property: 'og:description', content: '一款轻量开源的 Chrome 浏览器扩展：支持掘金发文一键同步至各大平台草稿箱，原图无损，自动排版，一键直达。' }],
    ['meta', { property: 'og:image', content: `${base}logo-128.png` }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '掘金同步助手',
    nav: [
      { text: '使用指南', link: '/guide/' },
      {
        text: '核心特性',
        items: [
          { text: '智能同步引擎', link: '/features/sync-engine' },
          { text: '原图无损转存与清洗', link: '/features/image-pipeline' },
          { text: '草稿幂等防重与自愈', link: '/features/idempotence' },
          { text: '微信高保真排版', link: '/features/ui-craftsmanship' }
        ]
      },
      {
        text: '架构与安全',
        items: [
          { text: '同步链路与状态机', link: '/deep-dive/pipeline' },
          { text: '零信任端侧隐私底座', link: '/deep-dive/security-privacy' }
        ]
      },
      { text: '更新日志', link: '/changelog/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '项目介绍与原则', link: '/guide/' },
            { text: '安装与加载', link: '/guide/installation' },
            { text: '3 分钟快速上手', link: '/guide/quick-start' },
            { text: '排版预演 (Dry-run)', link: '/guide/dry-run' },
            { text: '常见问题与排错', link: '/guide/faq' }
          ]
        },
        {
          text: '更多了解',
          items: [
            { text: '核心特性深剖', link: '/features/sync-engine' },
            { text: '底层架构与安全', link: '/deep-dive/pipeline' }
          ]
        }
      ],
      '/features/': [
        {
          text: '核心特性',
          items: [
            { text: '智能同步引擎', link: '/features/sync-engine' },
            { text: '原图转存与清洗', link: '/features/image-pipeline' },
            { text: '草稿幂等与自愈', link: '/features/idempotence' },
            { text: '旗舰工艺 UI 2.0', link: '/features/ui-craftsmanship' }
          ]
        },
        {
          text: '相关文档',
          items: [
            { text: '使用指南', link: '/guide/' },
            { text: '架构与安全', link: '/deep-dive/pipeline' }
          ]
        }
      ],
      '/deep-dive/': [
        {
          text: '架构与安全',
          items: [
            { text: '同步链路与状态机', link: '/deep-dive/pipeline' },
            { text: '零信任隐私底座', link: '/deep-dive/security-privacy' }
          ]
        },
        {
          text: '产品演进',
          items: [
            { text: '版本更新日志', link: '/changelog/' }
          ]
        }
      ],
      '/changelog/': [
        {
          text: '更新日志',
          items: [
            { text: 'v1.4.0 (最新)', link: '/changelog/#v1-4-0' },
            { text: 'v1.3.1', link: '/changelog/#v1-3-1' },
            { text: 'v1.3.0', link: '/changelog/#v1-3-0' },
            { text: 'v1.2.0', link: '/changelog/#v1-2-0' },
            { text: 'v1.1.0', link: '/changelog/#v1-1-0' },
            { text: 'v1.0.0', link: '/changelog/#v1-0-0' },
            { text: 'v0.6.1', link: '/changelog/#v0-6-1' },
            { text: 'v0.6.0', link: '/changelog/#v0-6-0' },
            { text: 'v0.5.3', link: '/changelog/#v0-5-3' },
            { text: 'v0.5.2', link: '/changelog/#v0-5-2' },
            { text: 'v0.5.1', link: '/changelog/#v0-5-1' },
            { text: 'v0.5.0', link: '/changelog/#v0-5-0' },
            { text: 'v0.4.1', link: '/changelog/#v0-4-1' },
            { text: 'v0.4.0', link: '/changelog/#v0-4-0' },
            { text: 'v0.3.0', link: '/changelog/#v0-3-0' },
            { text: 'v0.2.1', link: '/changelog/#v0-2-1' },
            { text: 'v0.2.0', link: '/changelog/#v0-2-0' },
            { text: 'v0.1.1', link: '/changelog/#v0-1-1' },
            { text: 'v0.1.0', link: '/changelog/#v0-1-0' }
          ]
        }
      ]
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/juejin-sync/juejin-sync' }
    ],
    footer: {
      message: '基于 MIT 协议开源 · 面向技术创作者的轻量、端侧安全内容中枢',
      copyright: 'Copyright © 2026-present 掘金同步助手 (Juejin Sync) 团队'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新于'
    }
  }
})
