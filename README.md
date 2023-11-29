# JmalCloud 个人网盘 ｜ [English](https://github.com/jamebal/jmal-cloud-view/blob/master/README_en_US.md)
JmalCloud 是一款私有云存储网盘项目，能够简单安全管理您的云端文件

✅ 支持OSS,阿里云OS、腾讯云OSS和MinIO

✅ 支持图片,音频,视频等文件的在线预览

✅ 支持Word、Excel、PPT、流程图和思维导图的编辑和预览

✅ 支持x86、arm64(Centos/Debian/Ubuntu/macOS)

✅ 提供强大的在线文本编辑器

✅ 支持超大文件上传，断点续传

✅ 支持WebDAV

### 线上Demo:
[查看 Demo](https://l.jmal.cc/demo) , 用户名:demo, 密码:demo1234

### docker部署(推荐)
[docker部署](https://jmal.cc/mv572)
- 必须安装：`Docker` 和 `Docker Compose v2.0+`

```shell
# 1、克隆项目到您的本地或服务器
git clone --depth=1 https://github.com/jamebal/jmal-cloud-server.git
# 或者
git clone --depth=1 https://gitee.com/jmal/jmal-cloud-server.git

# 2、进入目录
cd jmal-cloud-server

# 3、一键安装
./jc.sh install

# 4、更新
./jc.sh pull
./jc.sh update
```
[其它方式部署](https://jmal.cc/b75gm)

### dev
#### 环境准备:
- jdk17+
- mongodb4.4+
- node v16.x.x

##### 1、克隆服务端项目
`git clone  https://github.com/jamebal/jmal-cloud-server.git`
##### 2、修改配置文件 `src/main/resources/file.yml`
修改参数`rootDir` 和 `ip2region-db-path` 改为自己的目录, 即可启动服务
##### 3、克隆web端项目
`git clone https://github.com/jamebal/jmal-cloud-view.git`
##### 4、项目目录下执行`npm install`
##### 5、启动web端`npm run dev`


### 部分截图:
![image0](./doc/%E6%88%AA%E5%B1%8F%20192.png)
![image1](./doc/%E6%88%AA%E5%B1%8F%2028.png)
![image2](./doc/%E6%88%AA%E5%B1%8F%2029.png)
![image3](./doc/%E6%88%AA%E5%B1%8F%2030.png)
![image4](./doc/%E6%88%AA%E5%B1%8F%2031.png)
![image5](./doc/%E6%88%AA%E5%B1%8F%2032.png)
![image6](./doc/%E6%88%AA%E5%B1%8F%2033.png)

### 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

### 许可

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
