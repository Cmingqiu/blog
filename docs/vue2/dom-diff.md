由于在浏览器中操作 DOM 是很昂贵的。频繁的操作 DOM，会产生一定的性能问题。这就是虚拟 Dom 的产生原因。Vue2 的 Virtual DOM 借鉴了开源库 snabbdom 的实现。Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点。是对真实 DOM 的一层抽象。(也就是源码中的 VNode 类，它定义在 `src/core/vdom/vnode.js` 中。)
VirtualDOM 映射到真实 DOM 要经历 VNode 的 create、diff、patch 等阶段。  
虚拟 DOM 的好处：1. 具有缓存作用，性能优化；2. 跨平台  
为了避免频繁操作 dom，需要先进行 dom diff，尽可能地复用节点，优化性能。  
vue2 中的 dom diff 采用**双指针**循环节点进行判断复用的。

Vue 的 diff 算法是平级比较，不考虑跨级比较的情况。内部采用深度递归的方式 + 双指针的方式进行比较。

1. 先比较是否是相同节点
2. 相同节点比较属性,并复用老节点
3. 比较儿子节点，考虑老节点和新节点儿子的情况
4. 优化比较：头头、尾尾、头尾、尾头
5. 比对查找进行复用

diff 情况大致分为以下几种：

1. **老头和新头复用**
   ![1.head-to-head](@public/img/dom-diff/1.head-to-head.jpg)  
   当老头和新头是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，老节点头部指针和新节点头部指针往后移动一位(index++)。开始下一轮比对...
   ![1.head-to-head2](@public/img/dom-diff/1.head-to-head2.jpg)

2. **老尾和新尾复用**
   ![2.tail-to-tail](@public/img/dom-diff/2.tail-to-tail.jpg)  
   当老尾和新尾是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，老节点尾部指针和新节点尾部指针往后前移动一位(index--)。开始下一轮比对...
   ![2.tail-to-tail2](@public/img/dom-diff/2.tail-to-tail2.jpg)

   比对结束后，如果剩下节点是新节点，就按顺序依次的插入老节点头部或尾部，如果剩下的节点是老节点，就删除剩下节点。

3. **老头和新尾复用**  
   ![3.head-to-tail](@public/img/dom-diff/3.head-to-tail.jpg)  
   当老头和新尾是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，该老节点移动到尾部指针的后面，同时老节点头部指针往后移动一位(index++) ，新节点尾部指针往前移动一位(index--)。开始下一轮比对...

4. **老尾和新头复用**  
   ![4.tail-to-head](@public/img/dom-diff/4.tail-to-head.jpg)  
   当老尾和新头是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，该老节点移动到头部指针的前面，同时老节点尾部指针往前移动一位(index--) ，新节点头部指针往后移动一位(index++)。开始下一轮比对...

5. 乱序比对
   当以上 4 中情况都不满足，则开始乱序比对。根据**旧节点**生成映射表，遍历新节点，在映射表中查找：  
   如果没找到，则将新节点插到旧节点头部指针的前面，同时新节点头部指针往后移一位；  
   如果找到表示可以复用该节点（patchVnode），移动该老节点到头部指针的前面，新节点的头部指针都往后移一位，同时老节点置为 null。直到新节点循环完毕，此时移除老节点头部指针和尾部指针中间的所有节点。
