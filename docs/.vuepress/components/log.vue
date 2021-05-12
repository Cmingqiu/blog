<template>
  <div>
    <h2>{{ title }}</h2>
    logxxx
  </div>
</template>

<script>
export default {
  props: ['title'],
  mounted() {
    console.log(111);
  }
};
</script>
