/* 
 h(
  'div',
  {
    style: {
      color: '#fff',
      backgroundColor: 'red'
    }
  },
  'div'
)
*/

import { createElement, createTextElement } from '../vdom';

export function h(tag, propsOrChildren, children = []) {
  let len = arguments.length;
  if (len === 2) {
    //h('div',{xxx})  h('div','divvvv')
    if (typeof propsOrChildren === 'object') {
      if (Array.isArray(propsOrChildren)) {
        return createElement(this, tag, {}, propsOrChildren);
      } else {
        return createElement(this, tag, propsOrChildren);
      }
    } else {
      return createTextElement(this, text);
    }
  } else {
    if (len > 3) {
      children = Array.from(arguments).slice(2);
    } else if (len === 3 && !Array.isArray(children)) {
      children = [children];
    }
    return createElement(this, tag, propsOrChildren, children);
  }
}
