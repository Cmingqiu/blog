### ngrok 下载使用

GitHub 收到 push 动作后要主动通知 Jenkins，所以 Jenkins 所在服务器一定要有外网 IP，由于 jenkins 配置在本地，所以需要 ngrok 将 IP 暴露到网络中

1. 下载  
   登录到[https://ngrok.com/download](https://ngrok.com/download)下载 [ngrok 压缩包](/assets/ngrok-stable-windows-amd64.zip)，选 windows 版本
2. 解压缩  
   将 ngrok-stable-windows-amd64.zip 文件解压到指定的目录，比如：F:\ngrok-stable-windows-amd64
3. 获取 token  
   切换到下载页面，单击以下链接，获取 token(注意：此步要翻墙)
   ![ngrok](~@public/img/ngrok/1.png)
   ![ngrok](~@public/img/ngrok/2.png)
4. 认证 token  
   切换到解压后的目录，执行认证 `ngrok authoken xxx`（token:3LoDHiNZAGSc3Cdi9ThEW_75ZCKKBh73UCHDc4WdAy）
   ![ngrok](~@public/img/ngrok/3.png)
5. 在解压后的目录下启动  
   切换到 ngrok 所在的目录，启动命令行，执行：`ngrok http 9527`（9527 是 tomcat 的监听端口），拷贝 forwarding 指示的 ip，后续会用到。注意：cmd 的窗口不要关闭;可以使用 http 或者 https 协议。  
   ![ngrok](~@public/img/ngrok/4.png)

:::tip
注意：
关机重启后就要重新进入 ngrok 所在的目录执行 ngrok http 8080 命令生成新的 IP，同时 jenkins 和 github 中的 webhook 对应的 ip 也要修改
:::
