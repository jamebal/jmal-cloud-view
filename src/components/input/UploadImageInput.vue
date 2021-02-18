<template>
  <div class="upload-input-image">
    <el-row>
      <el-col :xs="24">
        <select-file title="选择图片" @select="selectedFile" :visible.sync="dialogSelectFile"></select-file>
        <div class="upload">
          <!--      <div class="url-desc url-desc-first">输入图片的url 或</div>-->
          <el-button class="upload-select-btn" title="选择文件" type="primary" size="small" icon="el-icon-folder" circle @click="dialogSelectFile = true"></el-button>
          <el-upload
            ref="uploadRef"
            class="upload"
            action="/api/upload-markdown-image"
            :headers="headers"
            :data="extraData"
            name="files"
            accept="image/*"
            :show-file-list="false"
            :file-list="fileList"
            :limit="1"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-remove="handleFileListRemove"
            :on-progress="handleProgress"
          >
            <el-button title="上传" type="primary" size="small" icon="el-icon-upload2" circle></el-button>
            <div class="url-desc" v-if="uploadState > 0" slot="tip">
              <span v-show="uploadState === 1">图片上传中{{uploadPercentage}}%</span>
              <span v-show="uploadState === 2">图片上传成功</span>
              <span v-show="uploadState === 3">该图片不支持自动上传</span>
              <span v-show="uploadState === 4">图片加载中</span>
              <i :class="{
            'el-icon-loading': uploadState === 1 ||  uploadState === 4,
            'el-icon-check': uploadState === 2,
            'el-icon-warning-outline': uploadState === 3
          }"></i>
            </div>
          </el-upload>
        </div>
      </el-col>
      <el-col :xs="24">
        <el-tooltip class="item" effect="dark" placement="bottom">
          <el-input
            :autosize="intputAutosize"
            :placeholder="placeholder"
            type="textarea"
            width="100%"
            v-model="currentValue"
            @change="change"
            @input="input"
            @focus="isLocked = true">
          </el-input>
          <div slot="content">
            <el-image :style="{maxWidth: tipImageMaxWidth + 'px'}" :src="currentValue" fit="contain" @load="loadSuccess">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import axios from 'axios'
import fileConfig from "@/utils/file-config";
import SelectFile from "@/components/ShowFile/SelectFile";

export default {
  name: 'UploadImageInput',
  components: {SelectFile},
  props: {
    value: {
      type: String,
      default: ''
    },
    tipImageMaxWidth: {
      type: Number,
      default: 250
    },
    placeholder: {
      type: String,
      default: '请输入图片的url 或 点击上传'
    },
    intputAutosize: {
      type: Object,
      default: ()=>{ return { minRows: 1, maxRows: 6} }
    }
  },
  data() {
    return {
      headers: {
        'jmal-token': this.$store.state.user.token,
        'username': this.$store.state.user.name,
        'userId': this.$store.state.user.userId
      },
      extraData: {
        'username': this.$store.state.user.name,
        'userId': this.$store.state.user.userId
      },
      currentValue: this.value,
      fileList: [],
      isLocked: false, // true表示输入框正在输入状态
      timer: null,
      uploadState: 0, // 文件上传状态, 0 没有文件上传, 1 正在上传, 2 上传成功, 3 不支持自动上传, 4 加载中
      uploadTip: '',
      dialogSelectFile: false,
      uploadPercentage: 0
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
      // const reg = /[^\\\/]*[\\\/]+/g
      // this.fileList.push({name: val.replace(reg, ''), url: val})
    }
  },
  methods: {
    change(value) {
      this.isLocked = false
      this.$emit('input', value)
    },
    input(value) {
    },
    selectedFile(row) {
      this.currentValue = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, row)
      this.change(this.currentValue)
    },
    handleBeforeUpload(){
      this.uploadState = 1
    },
    handleProgress(event, file){
      this.onpregress(file.percentage | 0)
    },
    onpregress(percentage){
      this.uploadPercentage = percentage
    },
    handleSuccess(response) {
      if(response.code === 0){
        if(response.data && response.data.length > 0){
          this.format(response.data[0].filepath, response.data[0].filename)
        }
      }
      this.uploadSuccessAfter()
    },
    uploadSuccessAfter(){
      this.uploadState = 2
      this.fileList = []
      const that = this
      setTimeout(function (){
        that.uploadState = 0
      }, 3000)
    },
    handleFileListRemove(file, fileList) {
      this.fileList = fileList
    },
    format(filepath){
      this.currentValue = fileConfig.mardownPreviewUrl(filepath)
      this.change(this.currentValue)
    },
    // url转blob
    urlToBlob(the_url, callback) {
      const that = this
      let xhr = new XMLHttpRequest();
      xhr.open("get", the_url, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (this.status === 200) {
          if(callback){
            callback(this.response)
          }
        }
      };
      xhr.onerror = function (){
        that.uploadState = 3
        console.log(this.status, this.response)
      }
      xhr.send();
    },
    loadSuccess() {
      if(this.timer == null){
        if(this.isLocked){
          const that = this
          this.timer = setTimeout(function (){
            if(!that.currentValue.startsWith(window.location.origin)){
              that.uploadState = 4
              that.urlToBlob(that.currentValue, response => {
                that.uploadState = 1
                let fileName = that.getFileNameByUrl(that.currentValue)
                if (response.type.startsWith("image") && fileName.indexOf(".")) {
                  let suffix = response.type.replace("image/",".")
                  fileName += suffix
                }
                const file = new window.File(
                  [response],
                  fileName,
                  { type: response.type }
                );
                let data = new FormData()
                data.append("files", file)
                data.append("username", that.$store.state.user.name)
                data.append("userId", that.$store.state.user.userId)
                that.uploadImage(that, data)
              })
            }
          }, 300)
        }
      } else {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    uploadImage(that, data){
      axios.post('/api/upload-markdown-image', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'jmal-token': that.$store.state.user.token
        },
        onUploadProgress: progressEvent => {
          that.onpregress((progressEvent.loaded / progressEvent.total * 100 | 0))
        }
      }).then((res) => {
          const data = res.data.data[0]
          that.format(data.filepath, data.filename)
          that.uploadSuccessAfter()
          that.$refs.uploadRef.clearFiles()
        })
    },
    // 获取url中的文件名
    getFileNameByUrl(url){
      const urlRgx = /[a-zA-z]+:\/\/[^\s]*/
      if(urlRgx.test(url)){
        if(url.indexOf("-1") > -1){
          url = url.split('?')[0]
        }
        let arr = url.split('/')
        return arr[arr.length - 1]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  margin-bottom: 1px;
  display: -webkit-box;
  .upload-select-btn {
    margin-right: 5px;
  }
  .url-desc {
    padding: 4px 10px;
  }
  .url-desc-first {
    padding: 4px 10px 4px 0;
  }
}
/deep/ .el-checkbox {
  font-size: 13px;
  padding: 0 10px;
  .el-checkbox__label {
    padding-left: 5px;
    font-size: 13px;
  }
}
/deep/ .el-upload-list--picture {
  .el-upload-list__item-thumbnail {
    width: unset;
    height: 90px;
    object-fit: cover;
  }
  .el-upload-list__item {
    margin-top: 0;
    padding: 0 0 0 80px;
  }
  .el-upload-list__item.is-success .el-upload-list__item-name {
    line-height: 90px;
  }
}
/deep/ .el-upload-list__item-name {
  margin-right: 10px;
}
</style>
