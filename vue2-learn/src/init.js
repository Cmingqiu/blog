import { compileToFunction } from './compile';
import { mountComponent } from './lifecycle';
import Watcher from './observer/watcher';
import { initState } from './state';
import { callHook, mergeOptions } from './utils';

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    // 将用户options和全局Vue.opitons合并
    // 使用this.constructor而不使用Vue是因为_init函数会被子类继承，this.constructor会明确指向Vue
    vm.$options = mergeOptions(this.constructor.options, options);
    callHook(vm, 'beforeCreate');
    //初始化状态 data,computed,watch,props
    initState(vm);
    // initLifeCycle(vm);
    callHook(vm, 'created');

    callHook(vm, 'beforeMount');
    if (options.el) {
      vm.$mount(el);
    }
    callHook(vm, 'mounted');
  };

  Vue.prototype.$mount = function(el) {
    //render -> template -> el.outerHTML
    const vm = this;
    el = vm.$el = document.querySelector(el);
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
      options.render = compileToFunction(template);
    }
    //options上有render函数了，执行render函数，返回的是虚拟dom vnode
    mountComponent(vm); //组件挂载流程
  };

  Vue.prototype.$watch = function(prop, handler) {
    return new Watcher(this, prop, handler, { user: true });
  };
}

export function initLifeCycle(vm) {}
