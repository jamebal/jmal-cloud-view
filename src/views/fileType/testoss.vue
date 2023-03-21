<template>
  <input type="file" id="file" />
</template>

<script>

import OSS from "ali-oss"
export default {
  name: "testoss",
  data() {
    return {
      stsServerUrl: "http://localhost:7080/",
      accessToken: {
        AccessKeyId: '',
        AccessKeySecret: '',
        Expiration: '',
        SecurityToken: ''
      }
    }
  },
  mounted() {
    let that = this
    document.getElementById('file').addEventListener('change', function (e) {
      let file = e.target.files[0];
      let storeAs = file.name;
      console.log(file.name + ' => ' + storeAs);
      // OSS.urllib是SDK内部封装的发送请求的逻辑，开发者可以使用任何发送请求的库向sts-server发送请求。
      OSS.urllib.request(that.stsServerUrl, {method: 'GET'}, (err, response) => {
        if (err) {
          return alert(err);
        }
        try {
          this.accessToken = JSON.parse(response);
        } catch (e) {
          return alert('parse sts response info error: ' + e.message);
        }
        let client = new OSS({
          accessKeyId: this.accessToken.AccessKeyId,
          accessKeySecret: this.accessToken.AccessKeySecret,
          stsToken: this.accessToken.SecurityToken,
          endpoint: 'oss-cn-guangzhou.aliyuncs.com',
          bucket: 'jmalcloud',
          internal: true,
          cname: false,
          secure: true,
          refreshSTSToken: async () => this.refreshToken()
        });
        // storeAs可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        // file可以自定义为File对象、Blob数据以及OSS Buffer。
        client.multipartUpload(storeAs, file).then(function (result) {
          console.log(result);
        }).catch(function (err) {
          console.log(err);
        });
      });
    });
  },
  methods: {
    async refreshToken() {
      // 向您搭建的STS服务获取临时访问凭证。
      const info = await fetch(this.stsServerUrl);
      return {
        accessKeyId: info.AccessKeyId,
        accessKeySecret: info.AccessKeySecret,
        stsToken: info.SecurityToken
      }
    }
  }
}
</script>

<style scoped>

</style>
