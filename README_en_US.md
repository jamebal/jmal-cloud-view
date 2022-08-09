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


### deploy
**Either of the following two startup methods is recommended[docker-compose](https://docs.docker.com/compose//)**

> docker run

```shell
docker run \
--restart=always \
--name jmalcloud \
-p 7070:80 \
-p 7071:8080 \
-p 7072:8088 \
-p 27018:27017 \
-v /Users/jmal/temp/jmalcloud-docker/files/:/jmalcloud/files/ \
-v /Users/jmal/temp/jmalcloud-docker/db/:/data/db/ \
-d registry.cn-guangzhou.aliyuncs.com/jmalcloud/jmalcloud:latest
```

> docker-compose

docker-compose.yml

```yaml
version: "3.5"
services:
  jmalcloud:
    image: registry.cn-guangzhou.aliyuncs.com/jmalcloud/jmalcloud:latest
    container_name: jmalcloud
    volumes:
      - /Users/jmal/temp/jmalcloud-docker/files/:/jmalcloud/files/
      - /Users/jmal/temp/jmalcloud-docker/db/:/data/db/
    ports:
      - "7070:80"
      - "7071:8080"
      - "7072:8088"
      - "27018:27017"
```

Start: Run the following command in the docker-compose.yml file directory

```shell
docker-compse up -d
```

> Start-up parameters

Port :
`7070` : Web portal
`7071` : Blog portal
`7072` : Web api portal, 例如：http://localhost:7072/public/doc.html
`27018` : MongoDB
Volume :
`/jmalcloud/files/` : Netdisk file storage directory
`/data/db/` : mongodb data storage directory

> Try visiting

Wait for about 40 seconds after startup, access port 7070 and see the following screen, indicating successful deployment

![](https://www.jmal.top/api/file/jmal/Image/Document/2021-03/20210301%E6%88%AA%E5%B1%8F%20144.png)

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
