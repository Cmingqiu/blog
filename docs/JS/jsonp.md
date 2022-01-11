## jsonp 方法封装

```js
/**
 * jsonp请求封装
 * @param {String} url 请求地址
 * @param {String} callbackName 和后端定义的回调名称
 * @param {Object} data 入参
 * @returns
 */
export function jsonp(url, data, callbackName = 'callback') {
  return new Promise((resolve, reject) => {
    let name = `CORS${Date.now()}`
    let ele = null
    window[name] = function(res) {
      resolve(res)
      document.body.removeChild(ele)
      delete window[name]
    }
    ele = document.createElement('script')
    ele.setAttribute(
      'src',
      addUrlParams(url, { ...data, [callbackName]: name })
    )
    document.body.appendChild(ele)
  })
}

//url拼接入参
export function addUrlParams(url, params) {
  Object.keys(params).forEach(key => {
    const parameter = `${key}=${encodeURIComponent(params[key])}`
    if (url.indexOf(`${key}=`) > 0) {
      url = url.replace(new RegExp(`${key}=([^&]*)`, 'g'), parameter)
    } else {
      if (!url.includes('?')) {
        url += '?'
      } else if (url.indexOf('?') !== url.length - 1) {
        url += '&'
      }
      url += parameter
    }
  })
  return url
}
```

## web 端使用发送

```html
<button id="btn">jsonp</button>

<script src="./jsonp.js"></script>
<script>
  btn.onclick = function() {
    jsonp('http://localhost:3000/jsonp', { x: 'hhhh' }).then(res => {
      console.log(res)
    })
  }
</script>
```

## 服务端响应

```js
const express = require('express')
const app = express()

app.get('/jsonp', (req, res) => {
  const { query } = req
  const funcName = query.callback
  res.send(`${funcName}({name:'ZhangSan',list:[1,2,3]})`)
  // res.jsonp({ a: 3 }) 天然支持jsonp
})

app.listen(3000, () => {
  console.log('server is running on port 3000!')
})
```
