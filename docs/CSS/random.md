## 星空背景

```html
<div class="g-wrap"></div>
```

```scss
// 随机数
@function randomNum($max, $min: 0, $u: 1) {
  @return ($min + random($max)) * $u;
}

@function shadowSet($n, $size) {
  $shadow: 0 0 0 0 #fff;
  @for $i from 0 through $n {
    $x: randomNum(350);
    $y: randomNum(500);
    $scale: randomNum($size) / 10;

    $shadow: $shadow, #{$x}px #{$y}px 0 #{$scale}px rgba(255, 255, 255, 0.8);
  }
  @return $shadow;
}

.g-wrap {
  position: relative;
  margin: auto;
  width: 350px;
  height: 500px;
  background: #0b1a3a;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    box-shadow: shadowSet(100, 6);
    animation: bmove 50s infinite linear alternate;
  }

  &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    box-shadow: shadowSet(100, 4);
    animation: cmove 80s infinite linear alternate;
  }
}

@keyframes bmove {
  from {
    transform: translateZ(10px) translateY(0);
  }
  to {
    transform: translateZ(10px) translateY(-80px);
  }
}

@keyframes cmove {
  from {
    transform: translateZ(-5px) translateY(0);
  }
  to {
    transform: translateZ(-5px) translateY(80px);
  }
}
```
