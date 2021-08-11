import { compileToFunction } from './compile';
import { initState } from './state';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    //初始化状态 data,computed,watch,props
    initState(vm);
    // initLifeCycle(vm);

    if (options.el) {
      vm.$mount(el);
    }
  };

  Vue.prototype.$mount = function (el) {
    //render -> template -> el.outerHTML
    const vm = this;
    el = document.querySelector(el);
    const options = vm.$options;
    let render = options.render;
    if (!render) {
      //没写render函数
      let template = options.template;
      if (!template) {
        //没有template,取el的outerHTML
        template = el.outerHTML;
      }
      // 模板编译
      render = compileToFunction(template);
    }
    //执行render函数，返回的是虚拟dom vnode
    options.render = render;
  };
}

export function initLifeCycle(vm) {}
