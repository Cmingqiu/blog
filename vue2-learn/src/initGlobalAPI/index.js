// Vue.options定义全局选项，包括props,methods,data,computed,watch,beforeCreate,created...

import { mergeOptions } from '../utils';

// 使用全局api(比如Vue.mixin,Vue.extend,Vue.filter,Vue.directive),就会将数据放在Vue.options
export function initGlobalAPI(Vue) {
  Vue.options = {};
  Vue.mixin = function(options) {
    this.options = mergeOptions(this.options, options);
    return this;
  };
}
