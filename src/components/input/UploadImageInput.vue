<template>
  <div>
    <el-upload
      action="/api/upload-markdown-image"
      :headers="headers"
      :data="extraData"
      name="files"
      accept="image/*"
      :show-file-list="true"
      :file-list="fileList"
      list-type="picture"
      :limit="1"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="text">点击上传</el-button>或者输入图片的url
      <div slot="tip">{{ uploadTip }}</div>
    </el-upload>
    <el-tooltip v-if="fileList.length === 0" class="item" effect="dark" placement="bottom">
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
      console.log('change')
      this.$emit('input', value)
    },
    input(value) {
      console.log('input')
    },
    handleSuccess(response, file, fileList) {
      if(response.code === 0){
        if(response.data && response.data.length > 0){
          this.currentValue = window.location.origin + fileConfig.mardownPreviewUrl(response.data[0].filepath) + "?o=thumbnail"
          this.change(this.currentValue)
          fileList[0].name = response.data[0].filename;
          fileList[0].url = this.currentValue;
        }
      }
    },
    loadSuccess() {
      if(this.timer == null){
        if(this.isLocked){
          const that = this
          this.timer = setTimeout(function (){
            if(!that.currentValue.startsWith(window.location.origin)){
              that.uploadTip = "图片加载成功，准备上传"
              markdownApi.uploadLinkImage({
                username: that.$store.state.user.name,
                userId: that.$store.state.user.userId,
                url: that.currentValue
              }).then((res) => {

              })
            }
          }, 500)
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
