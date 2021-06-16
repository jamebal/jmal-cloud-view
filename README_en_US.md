# JmalCloud Personal Netdisk ｜ [中文](https://github.com/jamebal/jmal-cloud-view/blob/master/README.md)
JmalCloud It's a private cloud storage project that makes it simple and secure to manage your files in the cloud

✅ Support online preview of images, audio, video and other files

✅ Provide powerful online text editor

✅ Support oversized file upload, breakpoint transfer

✅ Support webDAV

### Online preview address: 
Address 1: https://www.jmal.top , Username:admin,Password:jmalcloud (partial access)

Address 2: https://cloud1.jmal.top , Username:admin,Password:jmalcloud (all permissions)

Some screenshots:
![image0](https://www.jmal.top/api/file/jmal/jmalcloud/releases/%E6%88%AA%E5%B1%8F%20192.png?shareKey=601b697575858bec45c457a3&o=preview)
![image1](https://www.jmal.top/api/file/jmal/jmalcloud/releases/%E6%88%AA%E5%B1%8F%20191.png?shareKey=601b697575858bec45c457a3&o=preview)


### Deployment
Choose one of the following two ways
### Deployment method one: [docker deployment](https://blog.jmal.top/s/docker-jmalcloud) (recommended)
#### 1. Pull image
`docker pull registry.cn-guangzhou.aliyuncs.com/jmalcloud/jmalcloud:latest`
#### 2. Run
`docker run --restart=always --name jmalcloud -p 7070:80 -p 7071:8080 -p 7072:8088 -v /Users/jmal/temp/jmalcloud-docker/files/:/ jmalcloud/files/ -v /Users/jmal/temp/jmalcloud-docker/db/:/data/db/ -d registry.cn-guangzhou.aliyuncs.com/jmalcloud/jmalcloud: latest`
```
Start parameters description : 
Expose port : 
`80` : Web portal
`8080` : Blog entry
`8088` : Netdisk service entry
Disk mapping :
`/jmalcloud/files/` : Netdisk file storage directory
`/data/db/` : mongodb data storage directory
```
#### 3. Visit port 7070 and try it. The interface of creating administrator appears to indicate successful deployment

### Deployment method 2

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

        location /api/ {
                proxy_pass   http://localhost:8088/;
                proxy_set_header Host $proxy_host;
                proxy_set_header X-real-ip $remote_addr;
        }

        location / {
                try_files $uri $uri/ /index.html;
                index index.html index.htm;
        }

        location /mq/ {
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

Go to[here](https://github.com/jamebal/jmal-cloud-server/releases)Download the latest jar packages

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
