---
# 搜索标签
tags:
  - SSH
  - rsa
  - 密钥
---

在 gitlab，github 上面拷贝代码时，通常用到了 git clone ssh://XXX 命令。其中 ssh 指 secure shell（一种安全的网络协议），git 使用这种协议进行远程加密登录。

## 步骤

git 使用 SSH 配置， 初始需要以下三个步骤：

1. 使用秘钥生成工具生成 rsa 秘钥和公钥
2. 将 rsa 公钥添加到代码托管平台
3. 将 rsa 秘钥添加到 ssh-agent 中，为 ssh client 指定使用的秘钥文件
   - 使用 ssh-keygen 命令来创建密钥对， 默认保存路径为~/.ssh/下， 一般 id_rsa 为私钥，id_rsa.pub 为公钥。
   - 使用 cat ~/.ssh/id_rsa.pub 命令获取公钥，然后拷贝到托管网页上， 一般是 setting(设置)——>SSH Keys 里面添加
   - 对于在默认路径~/.ssh/下生成的 id_rsa 密钥对，任何 ssh client 是可以直接读取到，不需要额外配置

## 详细步骤

### 一、生成密钥和公钥：打开 Git Bash，输入如下命令，然后连续按三个回车即可：

```js
ssh-keygen -t rsa -C "your_email@example.com"
```

::: tip
其中 C:/Users/Administrator/.ssh/id_rsa 保存的为密钥，C:/Users/Administrator/.ssh/id_rsa.pub 保存的为公钥
:::
![ssh](/blog/img/ssh/1.png)
![ssh](/blog/img/ssh/2.png)

### 二、将 SSH 私钥添加到 ssh-agent

1. 在后台启动 ssh -agent

```js
eval $(ssh-agent -s)
```

2. 将 SSH 私钥添加到 ssh-agent

```js
ssh-add /c/Users/Administrator/.ssh/id_rsa
```

### 三、将 SSH 公钥添加到 GitHub 账户

1. 先复制 SSH 公钥的完整内容（/c/Users/Administrator/.ssh/id_rsa.pub、C:/Users/Administrator/.ssh）

```js
clip < /c/Users/Administrator/.ssh/id_rsa.pub
```

2. 进入 GitHub 的设置页面（登录 GitHub，在右上角）-> Settings -> SSH and GPG keys
3. 点击 New SSH key 按钮
4. 在 Title 输入框内，为你的新 key 取个名字，在 Key 输入框内，粘贴前面复制好的公钥内容，然后点击 Add key 按钮即可。
   ![ssh](/blog/img/ssh/3.png)

## 测试连接

1. 打开 Git Bash 输入： ssh -T git@github.com，将会看到如下提示：
   ![ssh](/blog/img/ssh/4.png)
2. 输入 yes 后回车，如果提示中的用户名是你的，说明 SSH key 已经配置成功。
   ![ssh](/blog/img/ssh/5.png)
   ![ssh](/blog/img/ssh/6.png)

## SSH 验证原理

SSH 登录安全性由非对称加密保证，产生密钥时，一次产生两个密钥，一个公钥，一个私钥，在 git 中一般命名为 id_rsa.pub, id_rsa。
那么如何使用生成的一个私钥一个公钥进行验证呢？
本地生成一个密钥对，其中公钥放到远程主机，私钥保存在本地
当本地主机需要登录远程主机时，本地主机向远程主机发送一个登录请求，远程收到消息后，返回一个随机生成的字符串，本地拿到该字符串，用存放在本地的私钥进行加密，再次发送到远程，远程用之前存放在远程的公钥对本地发送过来加密过的字符串进行解密，如果解密后与源字符串等同，则认证成功。

![ssh](/blog/img/ssh/7.png)

:::tip

- 一台电脑只需要一个 SSH key （[SSH 原理与运用](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)）
- 一个 SSH key 可以访问你的所有仓库，即使你有 1000000 个仓库，都没问题
- 如果你新买了电脑，就在新电脑上重新生成一个 SSH key，把这个 key 也上传到 GitHub，它可以和之前的 key 共存在 GitHub 上
- 如果你把 key 从电脑上删除了，重新生成一个 key 即可，替换之前的 key
  :::

参考链接：

- [https://blog.csdn.net/Aaron_Miller/article/details/90269019](https://blog.csdn.net/Aaron_Miller/article/details/90269019)
- [https://blog.csdn.net/u013778905/article/details/83501204](https://blog.csdn.net/u013778905/article/details/83501204)
- [https://www.jianshu.com/p/c9aa544a11d3](https://www.jianshu.com/p/c9aa544a11d3)
