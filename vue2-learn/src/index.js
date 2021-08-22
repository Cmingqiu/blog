import { initMixin } from './init';
import { initGlobalAPI } from './initGlobalAPI';
import { lifeCycleMixin } from './lifecycle';

// 给Vue构造函数扩展原型方法和静态方法
function Vue(options) {
  this._init(options);
}

initMixin(Vue);
lifeCycleMixin(Vue);
initGlobalAPI(Vue);

export default Vue;
