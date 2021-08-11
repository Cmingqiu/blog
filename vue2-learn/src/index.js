import { initMixin } from './init';

// 给Vue构造函数扩展原型方法和静态方法
function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
