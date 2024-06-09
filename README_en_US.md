# JmalCloud Personal Netdisk ｜ [中文](https://github.com/jamebal/jmal-cloud-view/blob/master/README.md)
JmalCloud It's a private cloud storage project that makes it simple and secure to manage your files in the cloud

✅ Support OSS, Alibaba Cloud OSS , Tencent Cloud OSS and MinIO

✅ Supports online preview of images, audio, video and other files

✅ Supports editing and previewing of Word, Excel, PPT, process and mind map

✅ support x86, arm64 (Centos/Debian/Ubuntu/macOS)

✅ provides a powerful online text editor

✅ Supports large file uploading and resumable uploading

✅ supports WebDAV

### Online Demo:
[Live Demo](https://jmal.cc/demo) , username:demo, password:demo1234


### Deploy
- Prerequisites：`Docker` and `Docker Compose v2.0+`

Refer to [docker-compose.yml](https://github.com/jamebal/jmal-cloud-server/blob/master/docker-compose.base.yml)

```shell
docker compose up -d
```

#### Resetting Administrator Password
```shell
# 1. Reset the password
docker exec -it jmalcloud_mongodb mongo jmalcloud --eval "db.getCollection('user').update({ 'creator': true }, {\$set: { 'password': '1000:c5b705ea13a1221f5e59110947ed806f8a978e955fbd2ed6:22508de12228c34a235454a0caf3bcaa5552858543258e56' }}, { 'multi': false, 'upsert': false })"
# 2. Restart the container
docker restart jmalcloud_server
# The password after resetting is: jmalcloud
```

### Dev
#### Environment Requirements:
- jdk17+
- mongodb4.4+
- node v16.x.x
##### 1. Clone the server-side project
`git clone https://github.com/jamebal/jmal-cloud-server.git`

##### 2. Modify the configuration file `src/main/resources/file.yml`
   Change the parameters `rootDir` and `ip2region-db-path` to your own directory and start the service

##### 3. Clone the web-side project
`git clone https://github.com/jamebal/jmal-cloud-view.git`

##### 4. Run `npm install` in the project directory
##### 5. Start the web-side with `npm run dev`

### Some screenshots:
![image0](./doc/%E6%88%AA%E5%B1%8F%20192.png)
![image1](./doc/%E6%88%AA%E5%B1%8F%2028.png)
![image2](./doc/%E6%88%AA%E5%B1%8F%2029.png)
![image3](./doc/%E6%88%AA%E5%B1%8F%2030.png)
![image4](./doc/%E6%88%AA%E5%B1%8F%2031.png)
![image5](./doc/%E6%88%AA%E5%B1%8F%2032.png)
![image6](./doc/%E6%88%AA%E5%B1%8F%2033.png)
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
