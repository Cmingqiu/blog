export const createElement = (vm, tag, props = {}, children = []) => {
  return vnode(vm, tag, props, children, null, props.key);
};

export const createTextElement = (vm, text) => {
  return vnode(vm, null, null, null, text);
};

/**
 * 创建虚拟dom
 * @param {*} vm  对应的实例
 * @param {*} tag 标签名 / 组件
 * @param {*} props 属性
 * @param {*} key
 * @param {*} children
 * @returns
 */
function vnode(vm, tag, props = {}, children = [], text, key) {
  return {
    vm,
    tag,
    props,
    children,
    text,
    key
  };
}

/**
 * patch 用于初始化或者更新dom  第一个参数如果是真实元素就是初始化挂载，否则是更新
 * 1.先根据虚拟节点创建真实节点，2.将新节点插入老节点的前面，删除老节点
 * @param {*} oldVnode 真实元素或者vnode
 * @param {*} vnode 新的vnode
 */
export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    //初始化
    let elm = crateElm(vnode);
    const parentElm = oldVnode.parentNode;
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return elm;
  } else {
    //更新
  }
}

function crateElm(vnode) {
  if (typeof vnode === 'string') {
    //文本
    return document.createTextNode(vnode);
  }
  const { tag, props, children, text } = vnode;
  if (typeof tag === 'string') {
    //元素
    vnode.el = document.createElement(tag); //真实dom和虚拟节点映射在一起，方便dom diff复用节点
    children.forEach(child => {
      vnode.el.appendChild(crateElm(child));
    });
  } else {
    //文本
    vnode.el = document.createTextNode(text);
  }
  /* if (props) {
    for (let key in props) {
      vnode.el;
    }
  } */
  return vnode.el;
}
