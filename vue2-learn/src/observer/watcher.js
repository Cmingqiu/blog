import Dep from './dep';
import { queueWatcher } from './scheduler';

let id = 0;

/**
 * exprOrFn是更新逻辑 :
 *  如果是函数，就是渲染watcher，propOrCb == updateComponent()
 *  如果是字符串，就是用户watcher，propOrCb == 属性名
 * callback是用户watcher的回调
 * 渲染watcher 计算属性watcher watch用户watcher
 */
class Watcher {
  constructor(vm, exprOrFn, callback, options = {}) {
    this.id = id++;
    this.deps = [];
    this.depIds = new Set();
    this.callback = callback;
    this.options = options;
    //执行取值会收集watcher
    this.getter =
      typeof exprOrFn === 'function' ? exprOrFn : () => vm[exprOrFn];
    this.oldValue = this.get(); //默认先执行一次，获取老值
  }
  get() {
    //执行之前先把当 前的watcher放在全局上，取值走get的时候可以拿到watcher，执行完毕后再将全局上置空
    Dep.target = this;
    let value = this.getter();
    Dep.target = null;
    return value;
  }
  // 触发更新，进入属性的setter，调用dep.notify()通知依赖更新，调用此方法
  update() {
    queueWatcher(this);
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  //真正的执行更新
  run() {
    let newValue = this.get();
    //用户watcher才会进
    if (this.options.user) {
      this.callback(newValue, this.oldValue);
    }
  }
}

export default Watcher;


/* 
流程：
前提： 执行defineReactive的时候，给每个属性绑定了一个dep，这个dep用来存放watcher的

1.默认会先实例化1个渲染watcher，初始化watcher的时候会更新视图
2.在更新视图之前，先将当前watcher放在全局上
3.执行渲染函数的时候会进行取值，进入属性的getter中
4.在getter中会将当前watcher存入属性对应的dep中
5.后续属性发生变化，进入setter，执行dep.notify()通知dep中的watcher更新
*/