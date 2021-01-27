# JmalCloud 个人网盘
JmalCloud 是一款私有云存储网盘项目

### 线上预览地址: https://www.jmal.top , 用户名:amdin,密码:jmalcloud

部分截图:
![image](https://www.jmal.top/api/file/admin/%E6%88%AA%E5%B1%8F%20133.png.webp)

### jmal-cloud-view
网盘前端界面

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

### 部署

#### 1.环境准备

- nginx 1.18+
- mongodb 4.0+
- jdk 1.8+

#### 2.下载网盘界面程序，并配置nginx
去[这里](https://github.com/jamebal/jmal-cloud-view/releases)下载最新的版本，选择dist.tar下载
下载后解压到某个地方
nginx配置如下:
```nginx
server {
        listen 80;
        server_name localhost;
        # 这里为dist.tar解压后的路径
        root xxx/xxx/xxx/dist;

        client_body_temp_path /Users/jmal/temp/filetest/rootpath;
        client_max_body_size 100m;
        client_body_buffer_size 100m;

        location /api {
                proxy_pass   http://localhost:8088/;
                proxy_set_header Host $proxy_host;
        }

        location / {
                try_files $uri $uri/ /index.html;
                index index.html index.htm;
        }

        location /mq {
                proxy_pass   http://localhost:8088/mq/;
                #websocket额外配置开始
                                  proxy_http_version 1.1;
                                  proxy_set_header Upgrade $http_upgrade;
                                  proxy_set_header Connection "upgrade";
                                  proxy_connect_timeout 60s;#l连接超时时间，不能设置太长会浪费连接资源
                      proxy_read_timeout 500s;#读超时时间
                      proxy_send_timeout 500s;#写超时时间
                #websocket额外配置结束
        }

        location /articles {
                proxy_pass   http://localhost:8088/articles;
                proxy_set_header Host $proxy_host;
        }

        location ~ \.(eot|otf|ttf|woff|woff2|svg)$ {
                add_header  Access-Control-Allow-Origin *;
        }
}
```

#### 4.下载网盘服务程序
去[这里](https://github.com/jamebal/jmal-cloud-server/releases)最新的jar包

启动(需要提前安装jdk,mongodb环境)
# file.rrootDir表示网盘文件真实的存储的目录
`java -jar clouddisk-2.0-exec.jar --spring.profiles.active=prod --file.rootDir=/home/jmal/file/`
或者克隆下来自己编译
```bash
git clone https://github.com/jamebal/jmal-cloud-server.git
```

#### 开发模式
```bash
git clone https://github.com/jamebal/jmal-cloud-view.git

cd jmal-cloud-view

npm install

npm run dev
```
然后打开 http://localhost:9528

#### 或者构建
```bash
# 为生产环境构建
npm run build:prod
```

将生成的dist目录配置到[nginx](https://github.com/jamebal/jmal-cloud-server/blob/master/src/main/resources/nginx.conf)中

也可在[这里](https://github.com/jamebal/jmal-cloud-server/releases)下载最新的 dist目录

然后访问 http://localhost 即可

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
