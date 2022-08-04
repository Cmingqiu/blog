:::tip 方法库
[xe-utils](https://x-extends.gitee.io/xe-utils/#/)
:::

## xss 解决方案 - 过滤输入

```js
export function encodeHtml(str) {
  const codeMaps = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
    '&': '&amp;'
  };
  // /[<>"'&]/g
  const reg = new RegExp('[' + Object.keys(codeMaps).join('') + ']', 'g');
  return str.replace(reg, (v, i, str) => codeMaps[v]);
}
```

## 数字补 0

```js
/**
 * 数字补0
 * @param {*} number 数字
 * @returns
 */
export function doubleNumber(number) {
  if (typeof number !== 'number') return number;
  return 0 < number && number < 9 ? '0' + number : '' + number;
}
```

## 获取区间段的随机整值

```js
/**
 * 获取区间段的随机整值
 * @params min 最小值
 * @params max 最大值
 **/
export function randomNum(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
```

## 获取随机颜色一

```js
/**
 * 获取随机颜色一
 * rgb颜色 rgb(255 ,255 ,255 )
 **/
export function randomColor() {
  return `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
  // return `rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`
}
```

## 获取随机颜色二

```js
/**
 * 获取随机颜色二
 * 十六进制颜色 #ff22ff
 **/
export function randomNum() {
  return Math.round(Math.random() * 0xffffff).toString(16);
}
```

## 深拷贝一

```js
/**
 * 深拷贝 另外可借鉴jquery的$.extend(boolean,arg1,arg2,...)方法
 * 对象 / 数组 /
 **/
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}
```

## 深拷贝二

```js
/**
 * 深拷贝正则
 **/
export function cloneReg(target, isDeep) {
  const regFlag = /\w*$/;
  const result = new target.constructor(target.source, regFlag.exec(target));
  //const result = new target.constructor(target.source , target.flags) ES6属性
  if (isDeep) {
    result.lastIndex = 0;
  } else {
    result.lastIndex = target.lastIndex;
  }
  return result;
}
```

## 金额千分位显示

```js

/**
 * 金额千分位显示
 * @param {*} value
 */
export function formatAmount (value) {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (value + '').trim() === ''
  ) {
    return '';
  }
  try {
    value = Number(value);
    return value.toLocaleString();
  } catch (err) {
    return value;
  }
```

## 利用正则实现金额千分位格式化

```js
export function formatAmount(value) {
  return ('' + value).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
}
```

## 检测平台（设备）类型

```js
const uA = navigator.userAgent;
let isWechat = /micromessenger/i.test(uA),
  isWeibo = /weibo/i.test(uA),
  isQQ = /qq\//i.test(uA),
  isIOS = /(iphone|ipod|ipad|ios)/i.test(uA),
  isAndroid = /android/i.test(uA);
```

## 常用正则

```js
// 匹配邮箱
let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$

// (新)匹配手机号
let reg = /^1[0-9]{10}$/;
// (旧)匹配手机号
let reg = /^1(3|4|5|7|8)[0-9]{9}$/;

// 匹配8-16位数字和字母密码的正则表达式
let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;

// 匹配国内电话号码 0510-4305211
let reg = /\d{3}-\d{8}|\d{4}-\d{7}/;

// 匹配身份证号码
let reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

// 匹配腾讯QQ号
let reg = /[1-9][0-9]{4,}/;

// 匹配ip地址
let reg = /\d+\.\d+\.\d+\.\d+/;

// 匹配中文
let reg = /^[\u4e00-\u9fa5]*$/;
```

## 跨端事件处理

```js
// 是否支持触摸事件
let isSupportTouch = 'ontouchstart' in document.documentElement ? true : false;

//禁用Enter键表单自动提交
document.onkeydown = function(event) {
  let target, code, tag;
  if (!event) {
    event = window.event; //针对ie浏览器
    target = event.srcElement;
    code = event.keyCode;
    if (code == 13) {
      tag = target.tagName;
      if (tag == 'TEXTAREA') {
        return true;
      } else {
        return false;
      }
    }
  } else {
    target = event.target; //针对遵循w3c标准的浏览器，如Firefox
    code = event.keyCode;
    if (code == 13) {
      tag = target.tagName;
      if (tag == 'INPUT') {
        return false;
      } else {
        return true;
      }
    }
  }
};
```

## 移动端适配方案

```js
(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      var fontSize = 20;
      docEl.style.fontSize = fontSize + 'px';
      var docStyles = getComputedStyle(docEl);
      var realFontSize = parseFloat(docStyles.fontSize);
      var scale = realFontSize / fontSize;
      console.log('realFontSize: ' + realFontSize + ', scale: ' + scale);
      fontSize = (clientWidth / 667) * 20;
      if (isIphoneX()) fontSize = 19;
      fontSize = fontSize / scale;
      docEl.style.fontSize = fontSize + 'px';
    };
  // Abort if browser does not support addEventListener
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);

  // iphoneX判断
  function isIphoneX() {
    return (
      /iphone/gi.test(navigator.userAgent) &&
      screen.height == 812 &&
      screen.width == 375
    );
  }
})(document, window);
```

## 生成星级评分

```js
const StartScore = rate => '★★★★★☆☆☆☆☆'.slice(5 - rate, 10 - rate);
const start = StartScore(3);
// start => "★★★☆☆"
```

## 全屏居中

```js
//自动居中函数
function autoCenter(el) {
  var bodyX = document.documentElement.offsetWidth || document.body.offsetWidth;
  var bodyY =
    document.documentElement.offsetHeight || document.body.offsetHeight;

  var elementX = el.offsetWidth;
  var elementY = el.offsetHeight;

  el.style.left = (bodyX - elementX) / 2 + 'px';
  el.style.top = (bodyY - elementY) / 2 + 'px';
}
```

## 监听 iframe 下载完成

定时器轮询监听 readyState 的状态，如果是 complete 或者 interactive 说明文件加载完成。

```js
let iframe = document.createElement('iframe');
iframe.src = path;
iframe.style.display = 'none';
document.body.appendChild(iframe);
const timer = setInterval(() => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  if (
    iframeDoc.readyState == 'complete' ||
    iframeDoc.readyState == 'interactive'
  ) {
    document.body.removeAttribute(iframe);
    clearInterval(timer);
    resolve('success');
  }
}, 1000);
```

## 判断当前位置是否为页面底部

```js
function bottomVisible() {
  return (
    document.documentElement.clientHeight + window.scrollY >=
    (document.documentElement.scrollHeight ||
      document.documentElement.clientHeight)
  );
}
```

## 判断元素是否在可视范围内

```js
// partiallyVisible 为是否为完全可见
function elementIsVisibleInViewport(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}
```

## 固定滚动条

```js
/**
 * 功能描述：一些业务场景，如弹框出现时，需要禁止页面滚动，
 * 这是兼容安卓和 iOS 禁止页面滚动的解决方案
 */

let scrollTop = 0;

function preventScroll() {
  // 存储当前滚动位置
  scrollTop = window.scrollY;

  // 将可滚动区域固定定位，可滚动区域高度为 0 后就不能滚动了
  document.body.style['overflow-y'] = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = -scrollTop + 'px';
  // document.body.style['overscroll-behavior'] = 'none'
}

function recoverScroll() {
  document.body.style['overflow-y'] = 'auto';
  document.body.style.position = 'static';
  // document.querySelector('body').style['overscroll-behavior'] = 'none'

  window.scrollTo(0, scrollTop);
}
```

## 把有连字符号的字符串转化为驼峰命名法的字符串

```js
function toCamelCase(value) {
  return value.replace(/-(\w)/g, (matched, letter) => letter.toUpperCase());
}
```

## 滚动条平滑滚动回到顶部

```js
function scrollToTop() {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, scrollTop - scrollTop / 8);
  } else {
    window.cancelAnimationFrame(scrollToTop);
  }
}
```

## 函数柯里化

```js
function add() {
  let args = [...arguments];

  function _add() {
    args.push(...arguments);
    return _add;
  }

  _add.toString = function() {
    return args.reduce((pre, cur) => {
      return pre + cur;
    });
  };
  return _add;
}
console.log(add(1, 2)(3, 4)(5)(6)()().toString());
```

## 禁止右键、选择、复制

```js
['contextmenu', 'selectstart', 'copy'].forEach(function(ev) {
  document.addEventListener(ev, function(e) {
    if (e && e.preventDefault) e.preventDefault();
    else window.event.returnValue = false;
    return false;
  });
});
```

## url 添加参数

```js
/**
 * url添加参数
 * @param {String} url
 * @param {Object} params
 */
export function addUrlParams(url, params) {
  Object.keys(params).forEach(key => {
    const parameter = `${key}=${params[key]}`;
    if (url.indexOf(`${key}=`) > 0) {
      url = url.replace(new RegExp(`${key}=([^&]*)`, 'g'), parameter);
    } else {
      if (!url.includes('?')) {
        url += '?';
      } else if (url.indexOf('?') !== url.length - 1) {
        url += '&';
      }
      url += parameter;
    }
  });
  return url;
}
```

Usage

```js
let str1 = this.addUrlParams(url, {
  u_code: this.getLoginAfterData.id,
  a: 'dx'
});
let str2 = this.addUrlParams(str1, {
  authRight: localStorage.getItem('meetingManager_authRight')
});
```

## url 获取参数

```js
//从URL中搜索某个参数
function getQueryString(name) {
  var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
```

::: tip Usage

```js
URL: 'https://xxx.xx/111.html?name=xxx&age=20';
console.log(getQueryString(age)); // 20
```

:::

增加/替换 URL 参数

```js
function changeURLArg(url, arg, value) {
  var pattern = `${arg}=([^&]*)`;
  var replaceText = `${arg}=${value}`;
  if (url.match(pattern)) {
    var tmp = `/(${arg}=)([^&]*)/g`; //是否区分大小写
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText;
    } else {
      return url + '?' + replaceText;
    }
  }
}
```

::: tip Usage

```js
window.location.href = changeURLArg(window.location.href, 'name', 'xxx');
```

:::
