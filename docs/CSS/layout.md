## 两栏布局

```css
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  color: #fff;
}
```

```html
<div class="wrap">
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

### float + overflow:hidden

左侧栏左浮动，右侧内容是一个 BFC，BFC 不和浮动元素重叠；右侧内容宽度自适应

```css
.wrap {
  width: 90%;
  height: 500px;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.left {
  width: 300px;
  height: 100%;
  background-color: red;
  float: left;
}
.right {
  background-color: blue;
  height: 100%;
  overflow: hidden;
}
```

### 绝对定位 + margin 外边距 (浮动+margin 外边距)

```css
.wrap {
  width: 90%;
  height: 500px;
  position: relative;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.left {
  width: 300px;
  height: 100%;
  position: absolute;
  background-color: red;
}
.right {
  margin-left: 300px;
  background-color: blue;
  height: 100%;
}
```

### flex 弹性布局

```css
.wrap {
  width: 90%;
  height: 500px;
  display: flex;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.left {
  width: 300px;
  height: 100%;
  background-color: red;
}
.right {
  display: flex;
  flex: 1;
  height: 100%;
  background-color: blue;
}
```

## 三栏布局

```html
<div class="wrap">
  <div class="left">left</div>
  <main>main</main>
  <div class="right">right</div>
</div>
```

```css
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  color: #fff;
}
```

### float

```css {23}
.wrap {
  width: 90%;
  height: 500px;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.left,
.right {
  width: 300px;
  height: 100%;
}
.left {
  float: left;
  background-color: red;
}
.right {
  float: right;
  background-color: blue;
}
main {
  width: calc(100% - 600px);
  height: 100%;
  display: inline-block; /* 设置inline-block */
  background-color: cornflowerblue;
}
```

### 定位 + margin 外边距

```css
.wrap {
  width: 90%;
  height: 500px;
  position: relative;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.left,
.right {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
}
.left {
  left: 0;
  background-color: red;
}
.right {
  right: 0;
  background-color: blue;
}
main {
  height: 100%;
  margin: 0 300px;
  background-color: cornflowerblue;
}
```

### flex (代码省略)

---

更加优化的三栏布局是在结构上将内容区提高，优先显示  
圣杯布局(**利用父级的 padding**) 双飞翼布局(利用 **middle 的 margin**)

### 圣杯布局

```html
<div class="wrap">
  <div class="middle">middle</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

```css {15}
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  color: #fff;
}

.wrap {
  width: 90%;
  height: 500px;
  margin: 100px auto;
  padding: 0 300px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.wrap > div {
  float: left;
  height: 100%;
  position: relative;
}
.left,
.right {
  width: 300px;
}
.left {
  margin-left: -100%;
  left: -300px;
  background-color: red;
}
.right {
  margin-left: -300px;
  right: -300px;
  background-color: blue;
}
.middle {
  width: 100%;
  background-color: cyan;
}
```

### 双飞翼布局

```html
<div class="wrap">
  <div class="middle-wrap">
    <div class="middle">middle</div>
  </div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

```css {38}
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  color: #fff;
}

.wrap {
  width: 90%;
  height: 500px;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.wrap > div {
  float: left;
  height: 100%;
}
.left,
.right {
  width: 300px;
}
.left {
  margin-left: -100%;
  background-color: red;
}
.right {
  margin-left: -300px;
  background-color: blue;
}
.middle-wrap {
  width: 100%;
}
.middle {
  height: 100%;
  margin: 0 300px;
  background-color: cyan;
}
```

<!-- ## 瀑布流布局 -->
