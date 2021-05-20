<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    testMyApply() {
      Function.prototype.myApply = function (context, args) {
        if (typeof this !== 'function')
          throw new Error('caller must be a function!调用对象不是函数');
        context = context || globalThis;
        if (typeof context !== 'object')
          context = new context.constructor(context);
        context.fn = this;
        const result = context.fn(...args);
        delete context.fn;
        return result;
      };

      function log(a, b, c) {
        console.log('myApply - this: ', this, a, b, c);
      }
      log.myApply(11, ['a', 'b', 'c']);
    },
    testOrigin() {
      function log(a, b, c, d, e) {
        console.log('testOrigin - this: ', this, a, b, c, d, e);
      }
      log.apply(111);
    },
    /* testMyCall() {
      Function.prototype.myCall = function (context, ...args) {
        if (typeof this !== 'function')
          throw new Error('caller must be a function!调用对象不是函数');
        context = context || globalThis;
        if (typeof context !== 'object')
          context = new context.constructor(context);
        context.fn = this;
        const result = context.fn(...args);
        delete context.fn;
        return result;
      };

      function log(a, b, c) {
        console.log('testMyCall - this: ', this, a, b, c);
      }
      log.myCall(11, 'a', 'b', 'c');
    },
    testOrigin() {
      function log() {
        console.log('testOrigin - this: ', this);
      }
      log.call(111);
    }, */
  },
  mounted() {
    this.testOrigin();
    this.testMyApply();
  },
};
</script>
