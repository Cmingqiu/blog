(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{314:function(t,e,r){"use strict";r.r(e);var a=r(14),s=Object(a.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"浏览器渲染流程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#浏览器渲染流程"}},[t._v("#")]),t._v(" 浏览器渲染流程")]),t._v(" "),e("h3",{attrs:{id:"简要版本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#简要版本"}},[t._v("#")]),t._v(" 简要版本")]),t._v(" "),e("ul",[e("li",[t._v("解析 html 生成 dom 树")]),t._v(" "),e("li",[t._v("遇到 css 时，css 解析器将计算并生成 cssDOM")]),t._v(" "),e("li",[t._v("将 dom 树和 cssDOM 树合成渲染树，此时计算元素布局等信息")]),t._v(" "),e("li",[t._v("将渲染树生成合成树")]),t._v(" "),e("li",[t._v("渲染主线程生成绘制指令列表提交给合成线程")]),t._v(" "),e("li",[t._v("合成线程利用栅格化生成位图，此时会用 GPU 进程来进行加速")]),t._v(" "),e("li",[t._v("提交给浏览器主进程进行界面展示")])]),t._v(" "),e("h3",{attrs:{id:"详细版本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#详细版本"}},[t._v("#")]),t._v(" 详细版本")]),t._v(" "),e("ul",[e("li",[t._v("DOM 树构建"),e("br"),t._v("\n渲染器进程接收到的数据也就是 html。渲染器进程的核心任务就是把 html、css、js、image 等资源渲染成用户可以交互的 web 页面。渲染器进程的主线程将 html 进行解析，构造 DOM 数据结构。DOM 也就是文档对象类型，是浏览器对页面在其内部的表示形式，是 web 开发程序员可以通过 js 与之交互的数据结构和 API。html 首先通过 tokeniser 标记化，通过词法分析将输入的 html 内容解析成多个标记，根据识别后的标记进行 DOM 树构造，在 DOM 树构建过程中会创建 document 对象，然后以 document 的为根节点的 DOM 树，不断进行修改，向其中添加各种元素")]),t._v(" "),e("li",[t._v("渲染阻塞"),e("br"),t._v("\nhtml 代码中往往会引入一些额外的资源，比如图片、CSS、JS 脚本等等，图片和 CSS 这些资源需要通过网络下载或从缓存中直接加载，这些资源不会阻塞 html 的解析，因为它们不会影响 DOM 树的生成，但当 html 解析过程中遇到 script 标签，就会停止 html 解析流程，转而去加载解析并且执行 js。这是因为浏览器并不知道 js 执行是否会改变当前页面的 html 结构，如果 js 代码里用 document.write 方法来修改 html，之前的和 html 解析就没有任何意义啦，这也就是为什么要把 script 标签要放在合适的位置，或者使用 acync 或 defer 属性来异步加载执行 JS.")]),t._v(" "),e("li",[t._v("Layout Tree"),e("br"),t._v("\n在 html 解析完成之后，我们就会获得一个 DOM Tree,但我们不知道 DOM Tree 上的每个节点应该长什么样子，主线程需要解析 CSS，并确定每个 DOM 节点的计算样式，即使你没有提供自定义的 CSS 样式，浏览器会有自己默认的样式表。在知道 DOM 结构和每个节点的样式后，我们接下来需要知道每个节点需要放在页面上的哪个位置，也就是节点的坐标以及该节点需要占用多大的区域，这个阶段被称为 layout 布局，主线程通过遍历 dom 和计算好的样式来生成 Layout Tree。Layout Tree 上的每个节点都记录了 x/y 坐标和边框尺寸。这需要注意的是 DOM Tree 和 Layout Tree 并不是一一对应的。设置 display:none 的节点不会出现在 Layout Tree 上，而在 before 伪类中添加了 content 值的元素 content 中的内容会出现在 Layout Tree 上，不会出现在 DOM 树里，这是因为 DOM 是通过 html 解析获得的，并不关系样式，而 Layout Tree 是根据 DOM 和计算好的样式来生成，Layout Tree 是和最后展示在屏幕上节点是对应的。")]),t._v(" "),e("li",[t._v("绘制"),e("br"),t._v("\n现在我们已经知道元素的大小形状和位置，但还不知道以什么样的顺序绘制这个节点，例如 z-index 这个属性会影响节点绘制的层级关系，如果按照 dom 的层级结构来绘制页面会导致错误的渲染。所以为了保证在屏幕上展示正确的层级，主线程遍历 Layout Tree 创建一个绘制记录表，该表记录了绘制的顺序，这个阶段被称之为绘制。")]),t._v(" "),e("li",[t._v("栅格化"),e("br"),t._v("\n现在知道文档的绘制顺序，终于到了该把这些信息转换成像素点显示在屏幕上了，这个行为被称为栅格化。chrome 最早使用了一种简单的方式，只栅格化用户可视区域的内容，当用户滚动页面时，再栅格化更多的内容来填充缺失的部分，这种方式带来的问题就是会导致展示延迟。现在 chrome 进行了优化升级，使用了一种更为复杂的栅格化流程叫做合成，合成是一种将页面各个部分分成多个图层，分别对其进行栅格化，并在合成器线程中单独进行合成页面，简单来说就是页面所有的元素按照某种规则进行分图层，并把图层都栅格化好勒，然后只需要把可视区的内容组合成一帧展示给用户即可。")]),t._v(" "),e("li",[t._v("Layer Tree"),e("br"),t._v("\n主线程遍历 Layout Tree 生成 Layer Tree，当 Layer Tree 生成完毕和绘利顺序确定后，主线程将这些信息传递给合成器线程，合成器线程将每个图层栅格化，由于一层可能像页面的整个长度一样大，因此合成器线程将他们切分为许多图块，然后将每个图块发送给栅格化线程，栅格化线程格式化每个图块，并将他们存储在 GPU 内存中，当图块栅格化完成后，合成器线程将收集成为 draw quads 的图块信息，这些信息里记录了图块字，内存中的位置和在页面的哪个位置绘制图块的信息，根据这些信息合成器线程生成一个合成器帧，然后合成器 Frame(帧)通过 IPC 传递给浏览器进程，接着浏览器进程将合成器帧传送到 GPU，然后 GPU 渲染展示到屏幕上。 当页面发生变化时，比如滚动了当前的页面，都会生成一个新的合成器帧，新的帧再传给 GPU，然后再次渲染到屏幕上")])]),t._v(" "),e("h2",{attrs:{id:"页面的加载顺序"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#页面的加载顺序"}},[t._v("#")]),t._v(" 页面的加载顺序")]),t._v(" "),e("ol",[e("li",[t._v("浏览器根据 DNS 服务器得到域名的 IP 地址")]),t._v(" "),e("li",[t._v("向这个 IP 的机器发送 HTTP 请求")]),t._v(" "),e("li",[t._v("服务器收到、处理并返回 HTTP 请求")]),t._v(" "),e("li",[t._v("浏览器得到返回内容")])]),t._v(" "),e("h3",{attrs:{id:"处理脚本和样式表"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#处理脚本和样式表"}},[t._v("#")]),t._v(" 处理脚本和样式表")]),t._v(" "),e("h4",{attrs:{id:"脚本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#脚本"}},[t._v("#")]),t._v(" 脚本")]),t._v(" "),e("p",[t._v("网络的模型是同步的。网页作者希望解析器遇到"),e("code",[t._v("<script>")]),t._v("标记时立即解析并执行脚本。文档的解析将停止，直到脚本执行完毕。如果脚本是外部的，那么解析过程会停止，直到从网络同步抓取资源完成后再继续。此模型已经使用了多年，也在 HTML4 和 HTML5 规范中进行了指定。作者也可以将脚本标注为 defer，这样它就不会停止文档解析，而是等到解析结束后才执行。HTML5 增加了 async 选项，可将脚本标记为异步，以便由其他线程解析和执行。")]),t._v(" "),e("h4",{attrs:{id:"预解析"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#预解析"}},[t._v("#")]),t._v(" 预解析")]),t._v(" "),e("p",[t._v("WebKit 和 Firefox 都进行了这项优化。在执行脚本时，其他线程会解析文档的其余部分，找出并加载需要通过网络加载的其他资源。通过这种方式，资源可以在并行连接上加载，从而提高总体速度。请注意，预解析器不会修改 DOM 树，而是将这项工作交由主解析器处理；预解析器只会解析外部资源(例如外部脚本、样式表和图片)的引用")]),t._v(" "),e("h4",{attrs:{id:"样式表"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#样式表"}},[t._v("#")]),t._v(" 样式表")]),t._v(" "),e("p",[t._v("另一方面，样式表有着不同的模型。理论上来说，应用样式表不会更改 DOM 树，因此似乎没有必要等待样式表并停止文档解析。但这涉及到一个问题，就是脚本在文档解析阶段会请求样式信息。如果当时还没有加载和解析样式，脚本就会获得错误的回复，这样显然会产生很多问题。这看上去是一个非典型案例，但事实上非常普遍。Firefox 在样式表加载和解析的过程中，会禁止所有脚本。而对于 WebKit 而言，仅当脚本尝试访问的样式属性可能受尚未加载的样式表影响时，它才会禁止该脚本。")])])}),[],!1,null,null,null);e.default=s.exports}}]);