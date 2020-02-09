# jmal-cloud-view
netdisk server 

based on [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

## Setup

### 1.run nginx server and need to be install nginx plugin of [mod_zip](https://github.com/evanmiller/mod_zip) 

view [nignx.conf](https://github.com/jamebal/jmal-cloud-server/blob/master/src/main/resources/nginx.conf)

### 2.run web server (view[jmal-cloud-server](https://github.com/jamebal/jmal-cloud-server))

```bash
# clone the jmal-cloud-sever
git clone https://github.com/jamebal/jmal-cloud-server.git
cd jmal-cloud-server

# run server
run java-server
```

### 3.setup the proejct

```bash
# clone the project
git clone https://github.com/jamebal/jmal-cloud-view.git

# enter the project directory
cd jmal-cloud-view

# install dependency
npm install

# develop
npm run dev
```
This will automatically open http://localhost:9528

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/jamebal/jmal-cloud-view/blob/master/LICENSE) license.

Copyright (c) 2020-present jmal
