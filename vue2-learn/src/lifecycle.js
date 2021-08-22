import { h } from './compile/h';
import Watcher from './observer/watcher';
import { callHook } from './utils';
import { createElement, createTextElement, patch } from './vdom';

export const mountComponent = vm => {
  const updateComponent = () => {
    //1.产生vnode 2.根据vnode生产真实dom
    vm._update(vm._render());
  };
  // updateComponent();

  return new Watcher(vm, updateComponent, () => {
    callHook('beforeUpdate');
  });
};

export function lifeCycleMixin(Vue) {
  // 1.调用render产生vnode
  Vue.prototype._render = function() {
    const vm = this;
    let { render } = vm.$options;
    /* let code = `
       with(this){
         return _c(
               'div',
                 {
                   style: {
                     color: '#fff',
                     backgroundColor: 'red'
                   }
                 },
                 _v(_s(name)+':div')
               )
       }
    render = new Function(code);
   `; */
    let vnode = render.call(vm, h.bind(vm)); //调用render会取值，走get，收集依赖
    return vnode;
  };

  // 2.根据vnode生产真实dom
  Vue.prototype._update = function(vnode) {
    this.$el = patch(this.$el, vnode);
  };

  /** 创建元素
   * _c('div',{},[])
   * @returns vnode
   */
  Vue.prototype._c = function() {
    return createElement(this, ...arguments);
  };

  /** 创建文本
   * _v(_s(变量name)+'文本')
   * @param {*} value
   * @returns vnode
   */
  Vue.prototype._v = function(value) {
    return createTextElement(this, value);
  };

  /** 创建变量
   * _s(变量name)
   * @param {*} value
   * @returns string
   */
  Vue.prototype._s = function(value) {
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };
}
