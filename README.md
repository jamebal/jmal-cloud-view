### DEMO: www.jmal.cloud , 用户名:amdin,密码:123456

部分截图:
![image](https://raw.githubusercontent.com/jamebal/jmal-cloud-view/master/doc/demo.png)

# jmal-cloud-view
网盘前端界面

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

## 开始

### 1.运行nginx服务器，需要安装[mod_zip](https://github.com/evanmiller/mod_zip) 的nginx插件 

nginx配置 [nignx.conf](https://github.com/jamebal/jmal-cloud-server/blob/master/src/main/resources/nginx.conf)

### 2.运行web服务器 [jmal-cloud-server](https://github.com/jamebal/jmal-cloud-server)

```bash
git clone https://github.com/jamebal/jmal-cloud-server.git

# 启动该java服务
```

### 3.启动前端服务(开发模式)

```bash
git clone https://github.com/jamebal/jmal-cloud-view.git

cd jmal-cloud-view

npm install

npm run dev
```
然后打开 http://localhost:9528

### 4. 构建
```bash
# 为测试环境构建
npm run build:stage

# 为生产环境构建
npm run build:prod
```
构建后按照nginx配置即可

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
