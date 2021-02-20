# JmalCloud 个人网盘 ｜ [English](https://github.com/jamebal/jmal-cloud-view/master/README_en_US.md)
JmalCloud 是一款私有云存储网盘项目，能够简单安全管理您的云端文件

✅ 支持图片,音频,视频等文件的在线预览

✅ 提供强大的在线文本编辑器

✅ 支持超大文件上传，断点续传

✅ 支持webDAV

### 线上预览地址: https://www.jmal.top , 用户名:amdin,密码:jmalcloud

部分截图:
![image](https://www.jmal.top/api/file/admin/%E6%88%AA%E5%B1%8F%20133.png.webp)


### 部署

#### 1.环境准备

- nginx 1.18+
- mongodb 4.0+
- jdk 1.8+

#### 2.下载网盘界面程序，并配置nginx

去[这里](https://github.com/jamebal/jmal-cloud-view/releases)下载最新的版本，选择dist.tar下载

下载后解压到某个地方

nginx配置如下: （只需要修改两个地方）

```nginx
server {
        listen 80;
        # 1.这里填写你的ip地址，或域名
        server_name xxx;
        # 2.这填写为dist.tar解压后的路径
        root xxx;
        client_max_body_size 50m;	
        client_body_buffer_size 512k;

        location /api {
                proxy_pass   http://localhost:8088/;
                proxy_set_header Host $proxy_host;
                proxy_set_header X-real-ip $remote_addr;
        }

        location / {
                try_files $uri $uri/ /index.html;
                index index.html index.htm;
        }

        location /mq {
                proxy_pass   http://localhost:8088/mq/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_connect_timeout 60s;
                proxy_read_timeout 500s;
                proxy_send_timeout 500s;
        }

        location ~ \.(eot|otf|ttf|woff|woff2|svg)$ {
                add_header  Access-Control-Allow-Origin *;
        }
}
```

#### 3.下载网盘服务程序

去[这里](https://github.com/jamebal/jmal-cloud-server/releases)最新的jar包

启动(需要提前安装jdk,mongodb环境)

`java -jar clouddisk-2.0-exec.jar --spring.profiles.active=prod --file.rootDir=xxx`

 其中`file.rootDir`为网盘文件真实的存储的位置

#### 4.访问
在浏览器里直接输入你的IP或域名即可



### 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

### 后续更新

- [ ] iOS APP
- [ ] Android APP
- [ ] PC

### 许可

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
