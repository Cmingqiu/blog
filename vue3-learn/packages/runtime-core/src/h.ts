/* 
h(div,'str')
h(div,[])
h(div,h('p')) //vnode
h(component,()=>{}) //default slot

h(div,{})
h(div,{},'str')
h(div,{},[])
h(div,h('p'))//vnode
h(component,{},()=>{})//slot
h(component,{}, {})//named slot
*/

import { isArray, isObject, isVnode } from '@vue/shared';
import { createVnode } from './vnode';

/**
 * 核心就是createVnode
 * @param type
 * @param propsOrChildren
 * @param children
 * @returns
 */
export function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren)) {
      //propsOrChildren是对象
      if (isVnode(propsOrChildren) || !isArray(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren]);
      } else {
        return createVnode(type, null, propsOrChildren);
      }
    } else {
      //propsOrChildren是文本
      return createVnode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    } else if (l === 3 && isVnode(children)) {
      //children是数组或字符串
      //文本不用转数组，可以直接innerHTML
      children = [children];
    }
    return createVnode(type, propsOrChildren, children);
  }
}
