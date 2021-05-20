const path = require('path')
module.exports = {
  base: '/blog/',
  dest: 'dist',
  title: 'Cmq Blog',
  description: "Cmq's Blog",
  markdown: {
    lineNumbers: true
  },
  //额外的需要被注入到当前页面的 HTML <head> 中的标签, 例如 favicon
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: './icons/favicon-16x16.png'
      }
    ]
  ],
  themeConfig: {
    logo: './logo.png', //导航logo
    repo: 'Cmingqiu/blog', //导航上的github链接
    docsDir: 'docs',
    // docsRepo: '',
    lastUpdated: '上次更新:',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    smoothScroll: true,
    sidebarDepth: 2, // 默认值是 1   最大值是2：同时提取 h2 和 h3 标题
    // displayAllHeaders: true, //显示所有页面的标题链接,不建议设置true  默认值：false
    //导航链接
    nav: [
      {
        text: '首页',
        link: '/'
      },
      // { text: 'Guide', link: '/guide/' },
      // { text: 'Google', link: 'https://google.com' },
      {
        text: '语言',
        items: [
          {
            text: '中文',
            link: 'https://www.baidu.com'
          },
          {
            text: 'English',
            link: 'https://google.com'
          }
        ]
      }
    ],
    //简单例子
    //sidebar: ['/', 'basic/button', ['form/input', '表单']]
    sidebar: [
      ['start/', '起步'],
      {
        title: 'SSH配置及原理',
        path: '/SSH/',  // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //collapsable: true, // 不展开(来让一个组永远都是展开状态), 默认值是 true,
      },
      {
        title: 'JS基础',
        children: [
          ['JS/closure', '闭包'],
          ['JS/prototype', '原型及原型链'],
          ['JS/20210520', '实现call,apply,bind']
        ]
      },
      {
        title: 'Jenkins自动化部署',
        children: [
          ['Jenkins/concept', '概念'],
          ['Jenkins/setting', '搭建环境'],
          ['Jenkins/ngrok', '内网穿透']
        ]
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': path.resolve(__dirname, './public')
      }
    }
  }
};
