## jenkings 下载安装

::: tip 提示
安装 jenkins 之前，需要先安装 Java(jdk / jre)，tomcat(解压 jenkins 的 war 包)
:::

1. Java(jdk / jre)，tomcat 安装好环境配置好
2. 将下载的 jenkins 的 war 包放进 tomcat 的 webapps 文件夹下
3. 启动 tomcat（运行命令 startup.bat）。报错忽视，对后面没影响
4. 访问 jenkins（localhost:9527/jenkins）
5. 根据页面路径输入密码登录

![jenkins](/blog/img/jenkins/2.png)

6. 安装插件
7. 创建管理员用户
8. 实例配置
9. 安装结束，重启 tomcat，重新访问
10. 安装插件 NodeJs 并配置全局工具配置

![jenkins](/blog/img/jenkins/3.png)

## 使用

本文以 github 为例，通过 jenkins 持续集成 github 中的代码到服务器，安装完 jdk,tomcat，jenkins 后就要开始配置 jenkins 了。

1. 配置全局工具配置
   在首页进入 Manage Jenkins，点击 Global Total Configuration
   ![jenkins](/blog/img/jenkins/4.png)

   - 配置 git  
     输入 git 的安装路径，**Name** 随意写，**Path to Git executable** 是服务器 git 安装路径
     ![jenkins](/blog/img/jenkins/5.png)

   - 配置 NodeJS  
     **Global npm packages to install** 指定 npm 镜像源
     ![jenkins](/blog/img/jenkins/6.png)

2. 系统配置  
   在首页进入 Manage Jenkins，点击 Configure System
   ![jenkins](/blog/img/jenkins/7.png)
   a. Jenkins Location 需要集成 webhook 的话需要修改此处，因为 github 需要访问。[见如下配置](./setting.html#github-配置-webhook)
   ![jenkins](/blog/img/jenkins/8.png)

   ![jenkins](/blog/img/jenkins/9.png)

3. 新建 Item，新建自由风格的任务，任务配置如下
   ![jenkins](/blog/img/jenkins/10.png)

   源码管理
   ![jenkins](/blog/img/jenkins/11.png)

   构建触发器 Webhook
   ![jenkins](/blog/img/jenkins/12.png)

   最后一步：进行触发后的构建, 这里使用的是 shell 脚本进行构建
   ![jenkins](/blog/img/jenkins/13.png)

::: tip
构建完成的打包结果放在 C:/Users/Administrator/.jenkins/workspace/test_task
:::

### Github 配置 webhook

配置前要求：

- Jenkins 已经安装 Github 插件
- Jenkins 服务器已经拥有一个公网 IP 地址（通过 ngork，将 IP 暴露到网络中
  GitHub 收到 push 动作后要主动通知 Jenkins，所以 Jenkins 所在服务器一定要有外网 IP，否则 GitHub 无法访问，解决方法：下载 ngrok，将 IP 暴露到网络上。步骤如下：）

1. 第一步：配置 Jenkins 全局  
   尽管 Jenkins 已经配置与 Github 代码库进行通信，但我们需从 Jenkins 手动启动构建，如需启动自动构建，Jenkins 需要在 Hook URL 中监听 Github 的 Post 请求，才会进行自动构建
   要获取 Jenkins 的 Hook URL，打开 Jenkins 首页控制台-->系统管理
   ![jenkins](/blog/img/jenkins/14.png)
   在 Github 插件的配置中，点击“高级”按钮  
   启用 Hook URL，并将 Hook URL 复制出来，并保存刚才的设置
   ![jenkins](/blog/img/jenkins/15.png)

2. 第二步：配置 Github 项目仓库  
    还需要配置 Github 项目仓库，因为 Github 经常有代码处理动作，需要配置 Github 项目仓库在处理这些动作的同时会发送信号至 Jenkins，才使用 Jenkins 自动构建。点击项目的 Setting -> 在"Webhooks"选项卡中，点击"Add webhook" -> 将在 Jenkins 生成的 Hook URL 填入至 Payload URL 中，另外，选择自主事件
   ![jenkins](/blog/img/jenkins/16.png)
   以 Push 为例，并保存，即当 Github 收到了客户端有 Push 动作时，会触发一个 Hook
   ![jenkins](/blog/img/jenkins/17.png)
   保存 WebHook 之后
   ![jenkins](/blog/img/jenkins/18.png)

3. 第三步：配置 Jenkins 项目  
    最后需要配置 Jenkins 项目触发的条件，到此刻，Github 遇到 Push 事件时，Jenkins 会收到通知，但 Jenkins 应该做什么呢？此步骤就是做最后的构建的动作。
   ![jenkins](/blog/img/jenkins/19.png)
   选择构建触发器，并且选择 Github Hook 触发
   ![jenkins](/blog/img/jenkins/20.png)

   4. 第四步，在本地代码库做一些修改，并 Push 至 Github 后，查看 Jenkins 构建效果，本例虽然第三次构建出现错误，但 Github Hook 的路是通的  
      ![jenkins](/blog/img/jenkins/21.png)
      ![jenkins](/blog/img/jenkins/22.png)
