<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        1,
        2,
        3,
        4,
        2,
        3,
        20,
        10,
        30,
        20,
        10,
        1,
        2,
        3,
        4,
        1,
        2,
        3,
        4,
        1,
        2,
        3,
        4
      ]
    };
  },
  methods: {
    uniq1(arr) {
      if (!Array.isArray(arr)) return arr;
      return [...new Set(arr)];
    },
    //利用filter和indexOf 去重
    uniq2(arr) {
      if (!Array.isArray(arr)) return arr;
      return arr.filter((v, index) => index === arr.indexOf(v));
    },
    uniq3(arr) {
      if (!Array.isArray(arr)) return arr;
      let newArr = [arr[0]];
      for (let i = 0, len = arr.length; i < len; i++) {
        //判读arr[i]不存在newArr中

        /* 方法一
        if (!newArr.includes(arr[i])) {
          newArr.push(arr[i]);
        } */
        /* 方法二
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        } */
        // 方法三
        if (!~newArr.indexOf(arr[i])) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    //利用对属性去重，速度最快， 占空间最多，空间换时间
    uniq4(arr) {
      if (!Array.isArray(arr)) return arr;
      let obj = {},
        newArr = [];
      arr.forEach((v) => {
        if (!obj[v]) {
          newArr.push(v);
          obj[v] = true;
        }
      });
      return newArr;
    },
    //利用数组方法reduce遍历，思路同uniq3
    uniq5(arr) {
      if (!Array.isArray(arr)) return arr;
      return arr.reduce((newArr, current, i) => {
        if (!newArr.includes(current)) newArr.push(current);
        return newArr;
      }, []);
    },
    //在原有数组的基础上，剔除重复项
    uniq6(arr) {
      if (!Array.isArray(arr)) return arr;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },
    // [1,2,1]
    uniq7(arr) {
      if (!Array.isArray(arr)) return arr;
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            i++;
            j = i;
          }
        }
        newArr.push(arr[i]);
      }
      return newArr;
    }
  },
  mounted() {
    console.log(this.uniq5(this.arr));
    console.log(this.uniq6(this.arr));
    console.log(this.uniq7([1, 2, 1]));
  }
};
</script>
