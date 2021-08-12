import arrayMethods from './array';
import Dep from './dep';

class Observer {
  constructor(value) {
    this.dep = new Dep(); //给对象或者数组增加dep实例
    // value.__ob__ = this; //会导致栈溢出，添加不可枚举属性__ob__
    Object.defineProperty(value, '__ob__', {
      value: this,
      configurable: false,
      enumerable: false
    });

    if (Array.isArray(value)) {
      //对数组响应式处理，APO重写数组方法，定义在data中的数组的7个方法都被改写
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

function dependArray(value) {
  value.forEach(c => {
    c.__ob__ && c.__ob__.dep.depend(); //让数组中的对象或者数组再次依赖收集
    Array.isArray(c) && dependArray(c);
  });
}

export function defineReactive(obj, key, value) {
  let dep = new Dep(); //dep是为key服务的
  let childOb = observe(value); //递归拦截数据
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend(); //让对象本身或者数组本身进行依赖收集
          //数组中是对象，会在JOSN.stringify的作用下对对象每个属性进行取值，收集依赖(对象的属性)，所以不用处理数组中对象的情况
          //数组中嵌套数组，需要对内部的数组进行依赖收集处理
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      observe(newVal); // 对set的数据拦截
      value = newVal;
      dep.notify();
    }
  });
}

export function observe(data) {
  if (typeof data !== 'object' || data === null) return;
  if (data.__ob__) return; //已经观测过就不再处理
  return new Observer(data); //通过instanceOf Observer 可以知道数据是否被观测过
}
