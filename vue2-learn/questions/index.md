1. new Vue 做了什么？
2. data 为什么写成函数而不是对象？
   组件是可以多次复用的，如果 data 是对象，data 就会被组件的子类引用，会复用同一个 data，造成数据混乱。改成函数后，每次 new 的时候就会产生全新的数据，多次复用的组件会保证数据唯一性

```js
function Vue() {}
Vue.extend = function (options) {
  function Sub() {
    this.data = Sub.options.data;
  }
  Sub.options = options; //存下来
  return Sub;
};

const MyComponent = {
  data: {
    name: 'xx'
  }
};
let Sub = Vue.extend(MyComponent);
let s1 = new Sub();
let s2 = new Sub();
//s1有data , s2有data 并且引用的都是同一个地址
s1.data.name = 'yyy';
console.log(s2.data); //s2.data 会被修改
```
