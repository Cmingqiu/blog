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
        href: '/icons/favicon-16x16.png'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.png', //导航logo
    repo: 'Cmingqiu/blog', //导航上的github链接
    docsDir: 'docs',
    // docsRepo: '',
    // lastUpdated: '上次更新:', //默认不显示更新时间
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    smoothScroll: true,
    sidebarDepth: 2, // 默认值是 1   最大值是2：同时提取 h2 和 h3 标题
    // displayAllHeaders: true, //显示所有页面的标题链接,不建议设置true  默认值：false
    //导航链接
    nav: [
      { text: 'Blog', link: '/start/', target: '_self' },
      {
        text: 'Webpack',
        link: 'https://cmingqiu.github.io/webpack/start/',
        target: '_self'
      },
      { text: 'Node', link: '/node/', target: '_self' },
      { text: 'Vue', link: '/vue/', target: '_self' }
      // {
      //   text: '语言',
      //   items: [
      //     {
      //       text: '中文',
      //       link: 'https://www.baidu.com'
      //     },
      //     {
      //       text: 'English',
      //       link: 'https://google.com'
      //     }
      //   ]
      // }
    ],
    //简单例子
    //sidebar: ['/', 'basic/button', ['form/input', '表单']]
    sidebar: [
      ['start/', '起步'],
      {
        title: 'SSH配置及原理',
        path: '/SSH/' // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //collapsable: false,  不展开(来让一个组永远都是展开状态), 默认值是 true折叠,
      },
      ['npm/', '搭建npm私服'],
      {
        title: 'JS基础',
        children: [
          ['JS/closure', '闭包'],
          ['JS/prototype', '原型及原型链'],
          ['JS/browser-render-flow', '浏览器渲染流程'],
          ['JS/array-uniq-sort', '数组去重和排序']
        ]
      },
      {
        title: 'CSS',
        children: [
          ['CSS/multi-line-ellipsis', '多行文本显示省略号'],
          ['CSS/layout', '布局']
        ]
      },
      {
        title: 'Jenkins自动化部署',
        children: [
          ['Jenkins/concept', '概念'],
          ['Jenkins/setting', '搭建环境'],
          ['Jenkins/ngrok', '内网穿透']
        ]
      },
      {
        title: '每日一题',
        children: [
          {
            title: '2021年',
            children: [
              {
                title: '5月',
                sidebarDepth: 0,
                children: [
                  ['/dailyQuestion/2021/05/20', '0520:实现call,apply,bind'],
                  [
                    '/dailyQuestion/2021/05/21',
                    '0521:如何实现a==1&&a==2&&a==3为true'
                  ],
                  [
                    '/dailyQuestion/2021/05/22',
                    '0522:new 关键字原理及实现 new'
                  ],
                  [
                    '/dailyQuestion/2021/05/24',
                    '0524:一个页面从输入 URL 到页面加载完的过程中都发生了什么事情？'
                  ],
                  ['/dailyQuestion/2021/05/28', '0528:防抖和节流']
                ]
              },
              {
                title: '6月',
                sidebarDepth: 0,
                children: []
              }
            ]
          }
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
}
