<template>
  <div>ls</div>
</template>

<script>
export default {
  methods: {
    testMyCall() {
      Function.prototype.myCall = function(ctx, ...args) {
        ctx = ctx || window;
        //this是当前调用call的函数fn
        ctx.fn = this;
        ctx.fn(...args);
        delete ctx.fn;
      };
      function log(a, b, c) {
        console.log('testMyCall - this: ', this, a, b, c);
      }
      log.myCall(111, 'a', 'b', 'c');
    },
    testOrigin() {
      function log() {
        console.log('testOrigin - this: ', this);
      }
      log.call(111);
    }
  },
  mounted() {
    // this.testOrigin();
    this.testMyCall();
  }
};
</script>
