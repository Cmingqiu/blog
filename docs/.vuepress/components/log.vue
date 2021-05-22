<template>
  <div>
    <h2>{{ title }}</h2>
    多行文本收缩省略号
    <div class="box">
      <p :title="str">{{ str }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {
      str: `static：对象遵循常规流。top，right，bottom，left等属性不会被应用。
        relative：
        对象遵循常规流，并且参照自身在常规流中的位置通过top，right，bottom，left属性进行偏移时不影响常规流中的任何元素。
        absolute：对象脱离常规流，使用top，right，bottom，left等属性进行绝对定位，`
    };
  },
  mounted() {}
};
</script>

<style>
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
