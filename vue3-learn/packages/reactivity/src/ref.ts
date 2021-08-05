import { hasChanged, isArray, isObject } from '@vue/shared';
import { track, trigger } from './effect';
import { reactive } from './reactive';
const convert = (value) => isObject(value) ? reactive(value) : value;



//支持对象，使用reactive
export function ref (value) {
  return createRef(value);
}
export function shallowRef (value) {
  return createRef(value, true);
}


/**
 * 利用类的属性访问器 创建响应式ref
 * @param value
 * @param isShallow 是否是浅的  默认是深度
 * @returns
 */
function createRef (value, isShallow = false) {
  const ref = new RefImpl(value, isShallow);
  return ref;
}

class RefImpl {
  public _value;
  public _v_isRef = true;
  constructor(public _rawValue, public isShallow) {
    this._value = isShallow ? _rawValue : convert(_rawValue);
    this._rawValue = _rawValue;
  }
  get value () {
    //依赖收集
    track(this, 'get', 'value')
    return this._value;
  }
  set value (newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._value = this.isShallow ? newValue : convert(newValue);
      this._rawValue = newValue;//用于下次比对
      trigger(this, 'edit', 'value', newValue)
    }
  }
}




/**
 * 
 * @param target 代理对象
 * @param key 拆包的属性
 */
export function toRef (target, key) {
  return new ObjectRefImpl(target, key)
}

class ObjectRefImpl {
  public _v_isRef = true;
  constructor(public _object, public _key) {

  }
  get value () {
    return this._object[this._key]
  }
  set value (newValue) {
    this._object[this._key] = newValue
  }
}


/**
 * 将响应式对象reactive拆分成单个的响应式值ref,内部使用toRef
 * @param target 待拆包对象
 */
export function toRefs (target) {
  let res = isArray(target) ? [] : {}
  for (let key in target) {
    res[key] = toRef(target, key)
  }
  return res
}