## 去重

1. ES6 的 Set 数据结构实现去重，由于 Set 没有重复值，再通过扩展运算符... ，将 set 数据重新构造成数组

```js
function uniq1(arr) {
  if (!Array.isArray(arr)) return arr;
  return [...new Set(arr)];
}
```

2. 利用数组的 filter 和 indexOf 去重

```js
function uniq2(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.filter((v, index) => index === arr.indexOf(v));
}
```

3.  两个数组比对

```js
function uniq3(arr) {
  if (!Array.isArray(arr)) return arr;
  let newArr = [arr[0]];
  for (let i = 0, len = arr.length; i < len; i++) {
    //判读 arr[i]不存在 newArr 中

    /* 方法一
      if (!newArr.includes(arr[i]))   newArr.push(arr[i]);
    */

    /* 方法二
      if (newArr.indexOf(arr[i]) === -1) newArr.push(arr[i]);
    */

    // 方法三
    if (!~newArr.indexOf(arr[i])) newArr.push(arr[i]);
  }
  return newArr;
}
```

4. 利用对属性去重，速度最快， 占空间最多，空间换时间

```js
function uniq4(arr) {
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
}
```

5. 利用数组方法 reduce 遍历，思路同 uniq3

```js
function uniq5(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.reduce((newArr, current, i) => {
    if (!newArr.includes(current)) newArr.push(current);
    return newArr;
  }, []);
}
```

6.  遍历数组有相同的就剔除掉，注意剔除后改变了原数组，下标要相应-1

```js
function uniq6(arr) {
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
}
```

7. 思路：获取没重复的最右一值放入新数组  
   （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）  
    方法的实现代码相当酷炫

```js
function uniq7(arr) {
  if (!Array.isArray(arr)) return arr;
  var temp = [];
  var index = [];
  for (var i = 0, l = arr.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (arr[i] === arr[j]) {
        i++;
        j = i;
      }
    }
    temp.push(arr[i]);
    index.push(i);
  }
  console.log('最右侧无重复项的下标: ', index);
  return temp;
}
```

8. 排序后相邻去除法

```js
function uniq8(arr) {
  if (!Array.isArray(arr)) return arr;
  arr.sort();
  var temp = [arr[0]];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] !== temp[temp.length - 1]) {
      temp.push(arr[i]);
    }
  }
  return temp;
}
```

<test />

## 排序
