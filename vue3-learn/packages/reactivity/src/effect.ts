import { isArray, isIntegerKey } from '@vue/shared';

/**
 * @param fn
 * @param options {immediate,lazy,scheduler}
 * @returns
 */
export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) effect();
  return effect; //返回响应式的effect
}

const effectStack = [];
export let activeEffect; //导出使get中的key 和activeEffect关联
let id = 0;

//利用栈结构[]模拟函数执行过程
/*  effectStack: [effect1] -> [effect1,effect2] ->  [effect1]

effect(()=>{      //effect1
  console.log(proxy.name);    
  effect(()=>{    //effect2
    console.log(proxy.address);
  })
  console.log(proxy.age);
}) */

/**
 * 创建一个响应式的effect
 * @param fn
 * @param options
 * @returns
 */
function createReactiveEffect(fn, options) {
  const reactiveEffect = function reactiveEffect() {
    try {
      effectStack.push(reactiveEffect);
      activeEffect = reactiveEffect;
      return fn(); //走get 依赖js的单线程
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  reactiveEffect.id = id++;
  reactiveEffect._isEffect = true;
  reactiveEffect.options = options;
  reactiveEffect.deps = []; //收集依赖了哪些属性

  return reactiveEffect;
}

let targetMap = new WeakMap();
/**
 * 构建关联关系的映射表：
 * WeakMap{
 *  Object[target]:WeakMap{
 *    [key]:Set[effect,effect],
 *    [key]:Set[effect,effect],
 *    ...
 *  },
 *  Object[target]:WeakMap{
 *    [key]:Set[effect,effect],
 *    [key]:Set[effect,effect],
 *    ...
 *  },
 *  ...
 * }
 */

/**
 * 收集依赖
 * @param target
 * @param type get
 * @param key
 */
export function track(target, type, key) {
  if (!activeEffect) return; //不用收集依赖

  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));

  if (!deps.has(activeEffect)) deps.add(activeEffect);
}

/**
 * 触发更新 去映射表中找
 * @param target
 * @param type add  edit
 * @param key
 * @param newValue
 * @param oldValue
 */
export function trigger(target, type, key, newValue?, oldValue?) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let effectsSet = new Set();
  /* 
    1. 修改数组length,修改的length比下标小,触发数组更新
    2. JSON.stringify(proxy.arr) 修改数组下标 ，触发更新(JSON.stringify会访问数组每项和length)
  */
  if (isArray(target) && key === 'length') {
    depsMap.forEach((deps, key) => {
      //更改的数组长度比 收集到属性的值 小
      if (key > newValue || key === 'length') {
        add(deps);
      }
    });
  } else {
    add(depsMap.get(key));
    switch (type) {
      case 'add':
        //放开set中的针对数组length限制
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'));
        }
        break;
    }
  }

  triggerEffects(effectsSet);
  /**
   * 将所有的更改项收集，一次性触发，并且具有过滤功能
   * @param effects
   */
  function add(effects) {
    if (effects) {
      effects.forEach(effect => effectsSet.add(effect));
    }
  }
}

function triggerEffects(effects) {
  effects.forEach(effect => {
    if (effect.options.scheduler) {
      //自定义执行策略schedular
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  });
}
