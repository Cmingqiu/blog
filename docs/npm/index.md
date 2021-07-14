# 使用 Verdaccio 搭建 npm 私服

## 前言

端用这个可以搭建一个自有/私有的 npm 源仓库，就比如淘宝的 cnpm 或者你可以直接把 npm 的镜像源指向淘宝的源，而 Verdaccio 这个就是让你有一个自己的或者公司的私有 npm 镜像源，这非常有利于一个公司前端团队开发的包并不想被外部人员使用，但又不想拷贝来拷贝去的

## 安装

```js
cnpm i verdaccio -g
```

## 运行

直接使用命令工具输入：`verdaccio;`  
本地已经开启私服服务器，只是现在还没有包，需要上传包到服务器。
![npm](@public/img/npm/1.png)

![npm](@public/img/npm/2.png)

## 切换源地址

1. 添加源地址

```js
nrm add myRegistry http://localhost:4873/
```

2. 切换源地址

```js
nrm use myRegistry
//也可以使用 npm config ser registry http://localhost:4873/
```

## 在 myRegistry 源地址新建用户

```js
npm adduser
```

## 发布包到服务器

```js
npm publish
```

## 私服已经有包可以下载

![npm](@public/img/npm/3.png)
