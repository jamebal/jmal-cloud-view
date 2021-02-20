# JmalCloud Personal NetDisk ｜ [中文](https://github.com/jamebal/jmal-cloud-view/edit/master/README.md)
JmalCloud It's a private cloud storage project that makes it simple and secure to manage your files in the cloud

✅ Support online preview of images, audio, video and other files

✅ Provide powerful online text editor

✅ Support oversized file upload, breakpoint transfer

✅ Support webDAV

### Online Preview Address: https://www.jmal.top , username:amdin, password:jmalcloud

Some screenshots:
![image](https://www.jmal.top/api/file/admin/%E6%88%AA%E5%B1%8F%20133.png.webp)


### Deployment

#### 1.Environmental Preparation

- nginx 1.18+
- mongodb 4.0+
- jdk 1.8+

#### 2.Download the web interface program and configure nginx

Go to[here](https://github.com/jamebal/jmal-cloud-view/releases)Download the latest version, select dist.tar to download

Download and unpack it somewhere

The nginx configuration is as follows: (only two places need to be modified)

```nginx
server {
        listen 80;
        # 1.Here fill in your ip address, or domain name
        server_name xxx;
        # 2.This is the path to the extracted dist.tar
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

#### 3.Download the netdisk service program

Go to[here](https://github.com/jamebal/jmal-cloud-server/releases)The latest jar packages

Start (need to install jdk, mongodb environment in advance)

`java -jar clouddisk-2.0-exec.jar --spring.profiles.active=prod --file.rootDir=xxx`

  where `file.rootDir` is the real storage location of the netdisk file

#### 4.access
Just type your IP or domain name directly into your browser



### Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

### Follow-up Updates

- [ ] iOS APP
- [ ] Android APP
- [ ] PC

### Permission

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
