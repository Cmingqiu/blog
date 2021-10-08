vue2 中响应式处理分对象和数组，针对对象使用 Object.defineProperty 劫持每个属性，增加 getter 和 setter，如果对象属性较多，嵌套较深，需要递归遍历，性能较差。对于数组，因为数组长度成百上千很正常，给每项增加 get 和 set 会影响性能，而且很少通过下标对数组操作，所以重写的 7 个能修改数组的方法(push、unshift、pop、shift、reverse、sort、splice)。

对象处理

```js
// observer/index.js
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
          //数组中是对象，会在JSON.stringify的作用下对对象每个属性进行取值，收集依赖(对象的属性)，所以不用处理数组中对象的情况
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
      childOb = observe(newVal); // 对set的数据拦截
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
```

数组处理

```js
// 函数劫持

const arrayOldPrototype = Array.prototype;

const methods = [
  'push',
  'unshift',
  'pop',
  'shift',
  'reverse',
  'sort',
  'splice'
];

let arrayMethods = Object.create(arrayOldPrototype);
methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    //...
    const result = arrayOldPrototype[method].call(this, ...args);
    //拦截新增到数组中的数据
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2); // arr.splice(1,1,'s')
        break;
    }
    ob.dep.notify();
    //调用observeArray,对数组处理
    if (inserted) {
      ob.observeArray(inserted);
    }
    return result;
  };
});

export default arrayMethods;
```
