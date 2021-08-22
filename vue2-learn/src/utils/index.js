export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    }
  });
}

//生命周期合并策略(策略模式)
let strats = {};
const mergeHook = function(parent, children) {
  /* if (children) {
    if (parent) {
      return parent.concat(children);
    } else {
      return [children];
    }
  } else {
    return parent;
  } */
  if (parent) {
    if (children) {
      return parent.concat(children);
    } else {
      return [parent];
    }
  } else {
    if (children) {
      return [children];
    } else {
      return [];
    }
  }
};

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

export function callHook(vm, hookName) {
  const hooks = vm.$options[hookName] || [];
  hooks.forEach(hook => {
    hook.call(vm);
  });
}

/**
 * 将children对象合并到parent对象上，对象合并必然要遍历2遍
 * 合并策略：
 * 1.生命周期都是数组
 * 2.组件本身的选项和全局命名冲突，以组件自身为主
 * 3.parent有的，children没有，以parent为主
 * 4.只要children有的，不管parent有没有，都以children为主
 * 5.注意先后顺序，先执行全局，在执行组件本身定义的选项
 * @param {*} parent
 * @param {*} children
 */
export function mergeOptions(parent, children) {
  let options = {};
  //1.先遍历children，再遍历parent，有重名的以children的为主
  for (let key in children) {
    mergeField(children, key);
  }
  //2.最后遍历parent,合并parent上有但children没有的属性
  for (let key in parent) {
    if (!children.hasOwnProperty(key)) {
      mergeField(parent, key);
    }
  }
  function mergeField(obj, key) {
    options[key] = strats[key]
      ? strats[key](parent[key], children[key])
      : obj[key];
  }

  return options;
}
