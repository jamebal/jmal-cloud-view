# JmalCloud 个人网盘 ｜ [English](https://github.com/jamebal/jmal-cloud-view/blob/master/README_en_US.md)
JmalCloud 是一款私有云存储网盘项目，能够简单安全管理您的云端文件

✅ 支持图片,音频,视频等文件的在线预览

✅ 提供强大的在线文本编辑器

✅ 支持超大文件上传，断点续传

✅ 支持webDAV

### 线上预览地址: 
地址1: https://www.jmal.top , 用户名:admin,密码:jmalcloud (部分权限)

地址2: https://cloud1.jmal.top , 用户名:admin,密码:jmalcloud (所有权限)

部分截图:
![image0](https://www.jmal.top/api/file/jmal/jmalcloud/releases/%E6%88%AA%E5%B1%8F%20192.png?shareKey=601b697575858bec45c457a3&o=preview)
![image1](https://www.jmal.top/api/file/jmal/jmalcloud/releases/%E6%88%AA%E5%B1%8F%20191.png?shareKey=601b697575858bec45c457a3&o=preview)

### 部署
**以下两种启动方式二选一, 推荐使用[docker-compose](https://docs.docker.com/compose//)**

> docker run 方式启动

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

> docker-compose 方式启动

编辑docker-compose.yml文件

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

启动：在docker-compose.yml文件目录下运行以下命令

```shell
docker-compse up -d
```

> 启动参数

Port :
`7070` : 网盘入口
`7071` : 博客入口
`7072` : 网盘api入口, 例如：http://localhost:7072/public/doc.html
`27018` : MongoDB
Volume :
`/jmalcloud/files/` : 网盘文件存储目录
`/data/db/` : mongodb数据存储目录

> 访问试试看

启动后等待40秒左右，访问7070端口看到如下界面，说明部署成功

![](https://www.jmal.top/api/file/jmal/Image/Document/2021-03/20210301%E6%88%AA%E5%B1%8F%20144.png)

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
