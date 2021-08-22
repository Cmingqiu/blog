1. new Vue 做了什么？
2. data 为什么写成函数而不是对象？
   组件是可以多次复用的，如果 data 是对象，data 就会被组件的子类引用，会复用同一个 data，造成数据混乱。改成函数后，每次 new 的时候就会产生全新的数据，多次复用的组件会保证数据唯一性

```js
function Vue() {}
Vue.extend = function(options) {
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

3. Vue.mixin 的原理？
4. 生命周期合并策略是什么？
5. 如何挂载组件？
6. 模板编译阶段：template -> ast -> render
   1）将 template 转成 ast 语法树；
   2）遍历 ast，标记静态节点，便于 dom diff 优化；
   3）将 ast 转成 render 函数。字符串拼接，使用 new Function + with 语法生产 render 函数

  <!-- 更新组件调用此方法 
   数据改变后，dom diff重新生成vnode，转真实dom，挂载真实dom
  -->

    ```js
    const updateComponent = () => {
      vm._update(vm.render());
    };
    ```

7. 合并？ 拷贝？ 防抖？ 节流？ 柯里化？
