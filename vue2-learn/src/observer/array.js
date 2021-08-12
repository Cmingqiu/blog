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
