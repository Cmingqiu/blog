import Dep from './dep';
import { queueWatcher } from './scheduler';

let id = 0;

/**
 * fn是更新逻辑 updateComponent()
 * 渲染watcher 计算属性watcher watch用户watcher
 */
class Watcher {
  constructor(fn) {
    this.id = id++;
    this.getter = fn;
    this.deps = [];
    this.depIds = new Set();
    this.get();
  }
  get() {
    //执行之前先把当 前的watcher放在全局上，取值走get的时候可以拿到watcher，执行完毕后再将全局上置空
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }
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
  run() {
    this.get();
  }
}

export default Watcher;
