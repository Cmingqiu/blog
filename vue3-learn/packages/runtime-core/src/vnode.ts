import { isArray, isObject, isString, ShapeFlags } from '@vue/shared';
/**
 * 创建虚拟节点：一个描述真实dom的js对象
 * 虚拟节点：可以跨平台；可以先对虚拟dom进行操作，之后一起渲染成真实dom，其缓存作用
 * @param type
 * @param props
 * @returns
 */
export function createVnode (type, props, children = null) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
      ? ShapeFlags.STATEFUL_COMPONENT
      : 0;
  const vnode = {
    __v_isVnode: true,
    type, //如果是组件 type就是一个对象，如果是dom，type就是标签名
    props,
    children, //如果是组件 children就是插槽slot
    key: props && props.key,
    el: null, //真实节点 dom diff结束后挂在到el
    shapeFlag,
    component: null //组件对应的实例
  };

  normalizeChildren(vnode);
  return vnode;
}

/**
 * 根据children标识shapeFlag,只考虑children是数组或者字符串或者没有children
 * @param vnode
 */
function normalizeChildren (vnode) {
  const { children } = vnode;
  let type = 0;
  if (children) {
    type = isArray(children)
      ? ShapeFlags.ARRAY_CHILDREN
      : ShapeFlags.TEXT_CHILDREN;

    vnode.shapeFlag |= type;//即 vnode.shapeFlag =vnode.shapeFlag | type;
  }
}
