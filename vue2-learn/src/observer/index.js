import arrayMethods from '../array';

class Observer {
  constructor(value) {
    // value.__ob__ = this; //会导致栈溢出，添加不可枚举属性__ob__
    Object.defineProperty(value, '__ob__', {
      value: this,
      configurable: false,
      enumerable: false
    });

    if (Array.isArray(value)) {
      //对数组响应式处理，APO重写数组方法
      // value.__proto__ = arrayMethods
      Object.setPrototypeOf(value, arrayMethods);
      // 如果数组中是对象，还要进行数据劫持
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  observeArray(value) {
    value.forEach(v => observe(v));
  }
  //对象响应式处理
  walk(value) {
    Object.keys(value).forEach(key => {
      defineReactive(value, key, value[key]);
    });
  }
}

export function observe(data) {
  if (typeof data !== 'object' || data === null) return;
  if (data.__ob__) return; //已经观测过就不再处理
  return new Observer(data); //通过instanceOf Observer 可以知道数据是否被观测过
}

export function defineReactive(obj, key, value) {
  observe(value); //递归拦截数据
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      observe(newVal); // 对set的数据拦截
      value = newVal;
    }
  });
}
