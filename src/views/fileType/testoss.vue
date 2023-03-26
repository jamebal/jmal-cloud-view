<template>
  <input type="file" id="file" />
</template>

<script>

import OSS from "ali-oss"

import aliyunOSSApi from "@/api/aliyunoss";
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
    this.getAccessToken()
    let that = this
    document.getElementById('file').addEventListener('change', function (e) {
      let file = e.target.files[0];
      let storeAs = file.name;
      console.log(file.name + ' => ' + storeAs);
      let client = new OSS({
        accessKeyId: that.accessToken.AccessKeyId,
        accessKeySecret: that.accessToken.AccessKeySecret,
        stsToken: that.accessToken.SecurityToken,
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
  },
  methods: {
    getAccessToken() {
      aliyunOSSApi.getAppToken().then((res) => {
        this.accessToken = res.data
      })
    },
    async refreshToken() {
      this.getAccessToken()
    }
  }
}
</script>

<style scoped>

</style>
