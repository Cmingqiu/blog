import { observe } from './observer';
import { proxy } from './utils';

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    // initProps(vm);
  }
  if (opts.methods) {
    // initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    // initComputed(vm)
  }
  if (opts.watch) {
    // initWatch(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  //将data中的数据代理到vm实例上
  for (let key in data) {
    proxy(vm, '_data', key);
  }
  // 属性劫持，重写对象属性的get和set，只劫持存在的属性，后续添加的属性这里不做处理
  observe(data);
}
