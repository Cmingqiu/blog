<template>
  <div class="wrap">
    <h2>{{ title }}</h2>
    多行文本收缩省略号
    <div class="box">
      <p :title="str">{{ str }}</p>
    </div>
    <input type="text" v-model="iptVal" @input="change" />
  </div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {
      iptVal: '000',
      str: `static：对象遵循常规流。top，right，bottom，left等属性不会被应用。
        relative：
        对象遵循常规流，并且参照自身在常规流中的位置通过top，right，bottom，left属性进行偏移时不影响常规流中的任何元素。
        absolute：对象脱离常规流，使用top，right，bottom，left等属性进行绝对定位，`,
    };
  },
  methods: {
    change() {},
  },
  mounted() {
    /* function debounce(fn, delay) {
      let timer = null;
      return function (...params) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          fn.call(this, ...params);
        }, delay);
      };
    } */

    /* function throttle(fn, interval) {
      var timer = null,
        last = null;
      return function (...args) {
        let now = new Date();
        if (last && now - last < interval) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            last = now;
            fn.call(this, ...args);
          }, interval);
        } else {
          last = now;
          fn.call(this, ...args);
        }
      };
    } */
    function throttle(func, wait = 300) {
      let timer = null,
        last = null; //记录上一次操作时间
      return function (...args) {
        let now = new Date(), //记录当前时间
          remaining = wait - (now - last); //记录还差多久达到我们一次触发的频率
        if (remaining <= 0) {
          //两次操作的间隔时间已经超过wait了
          clearTimeout(timer);
          timer = null;
          last = now;
          func.call(this, ...args);
        } else if (!timer) {
          //两次操作的间隔时间还不符合触发的频率
          timer = setTimeout(() => {
            timer = null;
            last = new Date();
            func.call(this, ...args);
          }, remaining);
        }
      };
    }

    function log(a) {
      console.log('a');
    }

    window.onscroll = throttle(log, 1000);
  },
};
</script>

<style>
.wrap {
  height: 1000px;
}
.box {
  width: 200px;
  height: 300px;
  border: 1px solid black;
}
p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /*设置p元素最大4行，父元素需填写宽度才明显*/
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  /* autoprefixer: off */
  /* autoprefixer: on */
  /*因为代码环境的关系-webkit-box-orient被过滤掉了 autoprefixer 这个关键字可以免除被过滤的动作*/
}
</style>
