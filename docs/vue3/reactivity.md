## 目录结构

```
├── packages
│   ├── reactivity
│   │   ├── index.ts
│   │   ├── reactive.ts
│   │   ├── baseHandlers.ts
│   │   ├── ref.ts
│   │   └── effect.ts
│   ├── runtime-core
│   └── runtime-dom

```

Vue3 响应式处理使用 Proxy,性能有所提高

index.ts

```js
export {
  reactive,
  shallowReactive,
  readonly,
  shallowReadonly
} from './reactive';
export { effect, track, trigger } from './effect';
export { ref, shallowRef, toRef, toRefs } from './ref';
export { computed } from './computed';
```

## reactive.ts

```js
import { isObject } from '@vue/shared';
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers';

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

//添加缓存
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
/**
 * @param target 代理对象
 * @param isReadonly 是否是只读的 默认不是仅读
 * @param baseHandlers 处理方式
 * @returns
 */
function createReactiveObject(target, isReadonly = false, baseHandlers) {
  if (!isObject(target)) return target;
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existMap = proxyMap.get(target);
  if (existMap) return existMap;

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
```

## baseHandlers.ts

```js
import {
  extend,
  hasChanged,
  isObject,
  isArray,
  isIntegerKey,
  hasOwn
} from '@vue/shared';
import { activeEffect, track, trigger } from './effect';
import { reactive, readonly } from './reactive';

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);
const readonlySet = {
  set: (target, key) => {
    return console.warn(`can not set key "${key}"`);
  }
};

export const mutableHandlers = { get, set };

export const shallowReactiveHandlers = { get: shallowGet, set: shallowSet };

export const readonlyHandlers = extend({ get: readonlyGet }, readonlySet);

export const shallowReadonlyHandlers = extend(
  { get: shallowReadonlyGet },
  readonlySet
);

//创建get
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      /* console.log(`依赖收集，当前属性${key}`);
      console.log('activeEffect', activeEffect, activeEffect.id); */
      track(target, 'get', key);
    }
    if (isShallow) return res;
    //懒递归 当取值时才递归
    //readonly 会代理，但不能更改，不会收集依赖
    if (isObject(target[key]))
      return isReadonly ? readonly(res) : reactive(res);

    return res;
  };
}

//创建set
function createSetter(isShallow = false) {
  return function set(target, key, newValue, receiver) {
    const oldValue = target[key];
    //区分新增和修改动作
    //对象：有oldValue就是修改，没有就是新增
    //数组：key是数字即修改下标且下标小于数组长度是修改，否则是新增
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);

    const res = Reflect.set(target, key, newValue); //下面要拿到最新值

    //解决数组新增push项触发2次问题：push到数组还会触发length
    if (!hadKey) {
      //新增
      trigger(target, 'add', key, newValue, oldValue);
    } else if (hasChanged(newValue, oldValue)) {
      // 修改
      trigger(target, 'edit', key, newValue, oldValue);
    }

    return res;
  };
}
```

## effect.ts

```js
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
  if (!activeEffect) return; // 没有activeEffect说明不是在effect中取值，不用收集依赖

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
```
