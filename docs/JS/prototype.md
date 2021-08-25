---
tags:
  - 原型
  - 原型链
---

## 原型

每个对象都有`__proto__`属性，这个就是隐式原型，指向构造函数的原型 prototype，这个 prototype 就是显式原型。当查找属性时，先从构造函数中找，如果没有，则通过`__proto__`，去构造函数的原型对象上找，也没有的话，会找到 Object.prototype，因为构造函数的原型对象也有`__proto__`属性，指向 Object.prototype,如果还没有的话，则返回 undefined。由此形成了一条原型链。
只有(构造)函数才有 prototype。

## 原型链

![1.png](@public/img/JS/1.png)
![2png](@public/img/JS/2.png)

## 继承

### 原型链继承

让子类的原型指向父类实例，继承父类所有的属性和方法

```js
function Parent() {}

function Child() {}
Child.prototype = new Parent();
```

优点：

1. 实现简单，通俗易懂
2. 继承父类的所有的属性方法，包括构造函数和原型上的

缺点：

1. 父类的引用类型属性会被共享
2. 不能实现多继承，只能继承一个父类
3. 创建子类实例时不能给父类传参
4. 给子类原型添加方法必须放在更改子类原型指向语句的后面，否则新添加的方法不生效

### 构造函数继承

```js
function Parent() {}

function Child() {
  Parent.call(this, ...arguments);
}
```

优点：

1. 解决了原型链继承共享父类引用类型属性的问题
2. 可以多继承
3. 创建子类实例时可以给父类传参

缺点：

1. 只能继承父类构造函数的属性方法，不能继承父类原型，部分继承

### 组合继承

```js
function Parent() {}

function Child() {
  Parent.call(this, ...arguments);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child; //修复子类原型的构造函数指向
```

### 组合继承优化 1

```js
function Parent() {}

function Child() {
  Parent.call(this, ...arguments);
}
Child.prototype = Parent.prototype;
Child.prototype.constructor = Child; //修复子类原型的构造函数指向
```

### 组合继承优化 2 （最佳实践）

```js
function Parent() {}

function Child() {
  Parent.call(this, ...arguments);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; //修复子类原型的构造函数指向
```

### ES6 extends 继承

```js
class Parent {}

class Child extends Parent {}
```

## ES5 和 ES6 的继承有区别

ES5 继承的实现是先创建子类实例 this，给 this 上添加属性和方法
ES6 继承是先给父类 this 添加属性和方法，通过调用 super()，让子类继承父类的 this
