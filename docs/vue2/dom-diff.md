由于在浏览器中操作 DOM 是很昂贵的。频繁的操作 DOM，会产生一定的性能问题。这就是虚拟 Dom 的产生原因。Vue2 的 Virtual DOM 借鉴了开源库 snabbdom 的实现。Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点。是对真实 DOM 的一层抽象。(也就是源码中的 VNode 类，它定义在 `src/core/vdom/vnode.js` 中。)
VirtualDOM 映射到真实 DOM 要经历 VNode 的 create、diff、patch 等阶段。  
虚拟 DOM 的好处：1. 具有缓存作用，性能优化；2. 跨平台  
为了避免频繁操作 dom，需要先进行 dom diff，尽可能地复用节点，优化性能。  
vue2 中的 dom diff 采用**双指针**循环节点进行判断复用的。

Vue 的 diff 算法是平级比较，不考虑跨级比较的情况。内部采用**深度递归的方式 + 双指针**的方式进行比较。

1. 先比较是否是相同节点
2. 相同节点比较属性,并复用老节点
3. 比较儿子节点，考虑老节点和新节点儿子的情况
4. 优化比较：头头、尾尾、头尾、尾头
5. 比对查找进行复用

diff 情况大致分为以下几种：

1. **老头和新头复用**
   ![1.head-to-head](@public/img/dom-diff/1.head-to-head.jpg)  
   当老头和新头是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，老节点头部指针和新节点头部指针往后移动一位(index++)，直到超出新老节点长度，此时如果新节点队列还有节点，根据新节点尾指针下一个节点是否存在判断向老节点末尾添加还是在老节点开始出插入。  
   如果老头和新头不同，开始比对老尾和新尾...
   ![1.head-to-head2](@public/img/dom-diff/1.head-to-head2.jpg)

2. **老尾和新尾复用**
   ![2.tail-to-tail](@public/img/dom-diff/2.tail-to-tail.jpg)  
   当老尾和新尾是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，老节点尾部指针和新节点尾部指针往后前移动一位(index--)，直到超出新老节点长度，此时如果新节点队列还有节点，根据新节点尾指针下一个节点是否存在判断向老节点末尾添加还是在老节点开始出插入。  
   如果老尾和新尾不同，开始比对老头和新尾...
   ![2.tail-to-tail2](@public/img/dom-diff/2.tail-to-tail2.jpg)

   比对结束后，如果剩下节点是新节点，就按顺序依次的插入老节点头部或尾部，如果剩下的节点是老节点，就删除剩下节点。

3. **老头和新尾复用**  
   ![3.head-to-tail](@public/img/dom-diff/3.head-to-tail.jpg)  
   ![3.head-to-tail2](@public/img/dom-diff/3.head-to-tail2.png)  
   当老头和新尾是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，该老节点移动到尾部指针的后面，同时老节点头部指针往后移动一位(index++) ，新节点尾部指针往前移动一位(index--)。直接复用 DOM 节点，优化倒序的节点。  
   如果老头和新尾不同，开始比对老尾和新头...

4. **老尾和新头复用**  
   ![4.tail-to-head](@public/img/dom-diff/4.tail-to-head.jpg)  
   ![4.tail-to-head2](@public/img/dom-diff/4.tail-to-head2.png)  
   当老尾和新头是相同节点时，复用老节点，并且更新老节点的属性和 children(patchVnode)，该老节点移动到头部指针的前面，同时老节点尾部指针往前移动一位(index--) ，新节点头部指针往后移动一位(index++)。  
   如果老尾和新头不同，开始乱序比对...

5. **乱序比对**  
   当以上 4 中情况都不满足，则开始乱序比对。  
   图 1
   ![5.out-of-order](@public/img/dom-diff/5.out-of-order.png)
   图 2
   ![5.out-of-order2](@public/img/dom-diff/5.out-of-order2.png)

   根据**旧节点**生成映射表，遍历新节点，在映射表中查找：

   1. 如果找到表示可以复用该节点（patchVnode）（见图 1 B C 节点均可复用），移动该老节点到头部指针的前面，将老节点置为 null，新节点的头部指针都往后移一位。开始下一轮比对头头、尾尾、头尾、尾头、乱序比对...
   2. 如果没找到，则将新节点插到旧节点头部指针的前面，同时新节点头部指针往后移一位；（见图 2 E F 节点）  
      最后直到新节点循环完毕，此时移除老节点头部指针和尾部指针中间的所有节点。

```js
import { isSameVnode } from './index';

export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    // 初始化渲染操作
    // 根据虚拟节点创造真实节点, 先根据虚拟节点创建一个真实节点，将节点插入到页面中在将老节点删除
    // 为什么$mount('body | html')
    const parentElm = oldVnode.parentNode; // 获取父元素
    const elm = createElm(vnode);
    // 直接扔到body里不行吗？
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);

    return elm;
  } else {
    patchVnoode(oldVnode, vnode); // 比较两个虚拟节点的差异，而且会比较儿子
    return vnode.el; // 最终返回新的el元素
  }
}

function patchVnoode(oldVnode, vnode) {
  // diff算法是同级别比对
  // 需要先比第一层，第一层一定是一个元素
  // 看一下是否需要复用节点，如果不需要直接删除，重新创建
  if (!isSameVnode(oldVnode, vnode)) {
    // 没用到diff算法
    return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
  }
  // 如果是相同节点， 我需要判断这个东西是不是文本，文本只需要用新的文本替换掉老的文本就好了

  // 有tag属性就是元素，没有就是文本， 标签名可能一样都是undefined ，那他们可能是文本

  // 如果是文本或者元素，前后都一样，需要复用老的元素
  let el = (vnode.el = oldVnode.el);

  if (!oldVnode.tag) {
    // 文本
    if (oldVnode.text !== vnode.text) {
      // 直接更新文本
      return (oldVnode.el.textContent = vnode.text);
    }
  }

  // 到这里的情况 两个都是元素，相同标签
  updateProperties(vnode, oldVnode.props);

  // 比对完外部标签后，改进行儿子的比对了

  // 儿子和儿子间的关系 1） 两方都有儿子，比较特殊的 diff
  // 1方有儿子1方没儿子
  // 两方都是文本的

  let oldChildren = oldVnode.children || [];
  let newChildren = vnode.children || [];

  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 两方都有儿子
    updateChildren(el, oldChildren, newChildren);
  } else if (oldChildren.length > 0) {
    // 老的有儿子新的没儿子
    el.innerHTML = '';
  } else if (newChildren.length > 0) {
    // 新的有儿子老的没儿子
    newChildren.forEach(child => el.appendChild(createElm(child)));
  }
}

function updateChildren(el, oldChildren, newChildren) {
  // 比较儿子节点 vue2中diff算法的实现
  // vue2 对常见dom的操作做了一些优化
  // push shift unshift pop reserver sort api经常被用到，我们就考虑对这些特殊的情况做一些优化
  // 内部采用了双指针的方式
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1; // 索引
  let oldStartVnode = oldChildren[oldStartIndex];
  let newStartVnode = newChildren[newStartIndex];
  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex]; // 虚拟节点

  // 如果比对上 就移动被比对上的指针
  function makeIndexByKey(oldChildren) {
    let map = {};
    oldChildren.forEach((item, index) => {
      map[item.key] = index;
    });
    return map;
  }
  let map = makeIndexByKey(oldChildren);

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 一方就遍历结束了
    if (!oldStartVnode) {
      // 防止指针在移动的时候 oldChildren中的那一项已经被移动走了，则直接跳过
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 从头部开始比，比对成功后指向向下移动
      patchVnoode(oldStartVnode, newStartVnode); // 标签一样比属性，属性比完比他们的子
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 从尾部比较
      patchVnoode(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patchVnoode(oldStartVnode, newEndVnode);
      // inseetBefore是具备移动性的，移动走了，原来的就不存在了
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 尾部移动到头部
      patchVnoode(oldEndVnode, newStartVnode);
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } // 四种优化策略
    else {
      // 在对列表操作的时候 都需要给 key （key不能用索引）
      // 乱序比对 需要造一个映射表，去搜索看是否存在，如果存在就复用
      // 需要拿新的第一个的key 去老的映射表里查找
      let moveIndex = map[newStartVnode.key]; // 能找到说明要移动并且复用
      if (moveIndex == undefined) {
        // 直接新增插入
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        // 比较并且移动
        let moveVnode = oldChildren[moveIndex]; // 获取要移动的节点
        patchVnoode(moveVnode, newStartVnode); // 如果能复用就要比对
        el.insertBefore(moveVnode.el, oldStartVnode.el); // 将当前节点移动出来
        oldChildren[moveIndex] = null;
      }
      newStartVnode = newChildren[++newStartIndex]; // VUE3 中先规划了哪些不需要移动，但是vue2 中，如果找到后要复用 ，就要做移动
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if (child !== null) {
        el.removeChild(child.el); // 移除老的中心的不需要的元素
      }
    }
  }
  if (newStartIndex <= newEndIndex) {
    // 新的比老得多，插入  (刚才直接用的向后插入，现在变成了前插入了) 我可以取一下当前的下一个元素，如果有我就做插入，如果没有 就做追加
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 找尾指针的下一个人，如果有就是插入，没有就是追加
      let anchor =
        newChildren[newEndIndex + 1] == null
          ? null
          : newChildren[newEndIndex + 1].el;
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }
}

function updateProperties(vnode, oldProps = {}) {
  // oldProps 可能不存在，如果存在就表示更新
  let newProps = vnode.props || {}; // 获取新的属性
  let el = vnode.el;
  // 比较前后属性是否一致 老的有新的没有，将老的删除掉，
  // 如果新的有 老的 也有，以新的为准
  // 如果新的有老的没有，直接替换成新的
  let oldStyle = oldProps.style || {}; // 如果前后都是样式
  let newStyle = newProps.style || {};
  for (let key in oldStyle) {
    if (!(key in newStyle)) {
      // 老的有的属性 但是新的没有，我就将他移除掉
      el.style[key] = '';
    }
  }
  for (let key in oldProps) {
    if (!(key in newProps)) {
      // 老的有的属性 但是新的没有，我就将他移除掉
      el.removeAttribute(key);
    }
  }
  for (let key in newProps) {
    // 以新的为准
    if (key == 'style') {
      for (let styleName in newStyle) {
        el.style[styleName] = newStyle[styleName]; // 对样式的特殊处理
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
export function createElm(vnode) {
  const { tag, props, children, text } = vnode;
  if (typeof tag == 'string') {
    vnode.el = document.createElement(tag); // 把创建的真实dom和虚拟dom映射在一起方便后续更新和复用
    updateProperties(vnode); // 样式处理  diff算法的时候需要比较新老的属性进行更新
    //子节点递归创建
    children &&
      children.forEach(child => {
        vnode.el.appendChild(createElm(child));
      });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
```
