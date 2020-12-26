<template>
  <div>
    <el-upload
      ref="uploadRef"
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
    >
      <el-button size="small" type="text">点击上传</el-button><span>或者输入图片的url</span>
      <div v-if="uploadState > 0" slot="tip">{{ uploadState === 1 ? '图片上传中' : '图片上传成功' }} <i :class="{'el-icon-loading': uploadState === 1, 'el-icon-check': uploadState === 2}"></i></div>
    </el-upload>
    <el-tooltip class="item" effect="dark" placement="bottom">
      <el-input :autosize="{ minRows: 1, maxRows: 4}" type="textarea" width="100%" v-model="currentValue" @change="change" @input="input" @focus="isLocked = true"></el-input>
      <div slot="content">
        <el-image style="width: 150px;" :src="currentValue" fit="contain" @load="loadSuccess"></el-image>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import fileConfig from "@/utils/file-config";
import markdownApi from "@/api/markdown-api.js";

export default {
  name: 'UploadImageInput',
  props: {
    value: {
      type: String,
      default: ''
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
      uploadState: 0, // 文件上传状态, 0 没有文件上传, 1 正在上传, 2 上传成功
      uploadTip: ''
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
    handleBeforeUpload(file){
      this.uploadState = 1
    },
    handleSuccess(response, file, fileList) {
      if(response.code === 0){
        if(response.data && response.data.length > 0){
          this.format(response.data[0].filepath, response.data[0].filename)
        }
      }
      this.uploadState = 2
      this.fileList = []
    },
    handleFileListRemove(file, fileList) {
      this.fileList = fileList
    },
    format(filepath, filename){
      this.currentValue = window.location.origin + fileConfig.mardownPreviewUrl(filepath)
      this.change(this.currentValue)
    },
    loadSuccess() {
      if(this.timer == null){
        if(this.isLocked){
          const that = this
          this.timer = setTimeout(function (){
            if(!that.currentValue.startsWith(window.location.origin)){
              that.uploadState = 1
              markdownApi.uploadLinkImage({
                username: that.$store.state.user.name,
                userId: that.$store.state.user.userId,
                url: that.currentValue
              }).then((res) => {
                that.format(res.data.filepath, res.data.filename)
                that.uploadState = 2
                that.$refs.uploadRef.clearFiles()
              })
            }
          }, 300)
        }
      } else {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture {
  .el-upload-list__item-thumbnail {
    width: unset;
    height: 90px;
    object-fit: cover;
  }
  .el-upload-list__item {
    margin-top: 0;
    padding: 0px 0px 0px 80px;
  }
  .el-upload-list__item.is-success .el-upload-list__item-name {
    line-height: 90px;
  }
}
/deep/ .el-upload-list__item-name {
  margin-right: 10px;
}
</style>
