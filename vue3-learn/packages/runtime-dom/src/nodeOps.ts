// 元素 增、删、改、查、  元素插入文本、创建文本、文本的内容设置、获取父元素、获取下一元素
export const nodeOps = {
  createElement: tagName => document.createElement(tagName),
  remove: child => child.parentNode & child.parentNode.removeChild(child),
  insert: (child, parent, anchor = null) => parent.insertBefore(child, anchor), //anchor为null 就是appendChild
  querySelector: selector => document.querySelector(selector),
  setElementText: (el, text) => (el.textContent = text), //元素插入文本  避免xss攻击
  createText: text => document.createTextNode(text),
  setText: (node, text) => (node.nodeValue = text),
  parentNode: node => node.parentNode,
  nextSibling: el => el.nextElementSibling
};
