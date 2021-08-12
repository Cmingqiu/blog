/** 依赖管理器dep
 * 每个属性，每个对象(数组)都有dep实例，用来收集watcher
 * 每个watcher都会收集dep，所以dep和watcher是多对多的关系；一个属性用在多个组件中，一个组件有多个属性
 */
let id = 0;

class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

Dep.target = null;

export default Dep;
