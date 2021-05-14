#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run  build

# 进入生成的文件夹
cd dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:Cmingqiu/Cmingqiu.github.io.git master

# 将本地maser分支提交到远程分支doc-pages上
# 如果发布到 https://<USERNAME>.github.io/<REPO> 
git push -f git@github.com:Cmingqiu/blog.git master:doc-pages


# 如果使用 travis 持续集成
# git push -f https://${GITHUB_TOKEN}@github.com/Cmingqiu/blog.git master:doc-pages

cd -

 