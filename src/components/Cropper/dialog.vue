<template>
    <div>
      <el-dialog
        title="选择头像"
        :visible.sync="dialogSelectFile"
        top="7.5vh"
        width="70%"
        :append-to-body="true"
      >
        <select-file></select-file>
      </el-dialog>
      <div class="container">
        <div class="img-container" v-loading="loading">
          <div class="img-region" v-show="avatar.length > 0 || fileImg.size">
            <img :src="sourceImg" ref="image" style="max-width: 100%;" alt="">
          </div>
          <div class="button-region">
            <el-button v-if="fileImg.size" type="primary" @click="sureSava">保存头像</el-button>
<!--            <el-button @click="uploadImg">{{avatar.length === 0?'选择头像':'重新选择'}}</el-button>-->
            <el-button @click="selectImg">选择头像</el-button>
          </div>
        </div>
        <el-divider v-show="avatar.length > 0 || fileImg.size" direction="vertical"></el-divider>
        <div v-show="avatar.length > 0 || fileImg.size" class="avatar-preview">
          <h3>头像预览</h3>
          <div class="before big"></div>
          <span>大头像100*100</span>
          <div class="before small margin-top"></div>
          <span>小头像55*55</span>
        </div>
      </div>
    </div>
</template>

<script>
  import "@/assets/css/cropper.css"
  import Cropper from 'cropperjs'
  import SelectFile from "@/components/ShowFile/SelectFile";

  export default {
    name: 'CropperDialog',
    components: {SelectFile},
    props: {
      fileImg: {
        type: File,
        default: null
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      avatar: {
        type: String,
        defalut: ''
      }
    },
    data () {
      return {
        loading: true,
        cropper: null,
        sourceImg: '',
        dialogSelectFile: false
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.initCropper()
        this.loading = false
        this.changeDialog(this.dialogVisible)
        this.changImg(this.fileImg)
      })
    },
    watch: {
      dialogVisible(val) {
        this.changeDialog(val)
      }
    },
    methods: {
      changeDialog(value){
        if(value){
          if(this.avatar.length === 0){
            // 没有任何头像，直接代开文件选择框
            this.selectImg()
          }
        }
      },
      initCropper(){
        this.cropper = new Cropper(this.$refs.image, {
          responsive: true,
          restore: true,
          checkCrossOrigin: true,
          checkOrientation: true,
          modal: true,
          guides: true,
          center: true,
          highlight: true,
          autoCrop: true,
          movable: true,
          rotatable: true,
          scalable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: true,
          preview: '.before',
          aspectRatio: 1,
          viewMode: 1,
          // dragMode: 'none',
          // initialAspectRatio: 1,
          // background: false,
          // autoCropArea: 0.6,
        });
      },
      selectImg() {
        this.dialogSelectFile = true
      },
      changImg(file) {
        this.loading = true
        const that = this
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
          that.cropper.replace(reader.result)
          that.loading = false
        }
      },
      sureSava(){
        let cro = this.cropper.getCroppedCanvas({
          maxWidth: 1204 ,
          maxHeight: 1024,
          fillColor: '#FFF',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        })
        let dataURL = cro.toDataURL('image/jpeg');
        cro.toBlob((blob)=>{
          this.$emit('croppedCanvas', dataURL, blob)
        })
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .container{
    display: flex;
  }
  .big{
    width: 100px;
    height: 100px;
    overflow: hidden;
  }
  .small{
    width: 55px;
    height: 55px;
    overflow: hidden;
  }
  .img-container{
    height: 450px;
    line-height: 450px;
    text-align: center;
    width: 712px;
    overflow: hidden;
    .img-region {
      height: 350px;
      line-height: 350px;
      text-align: center;
      width: 623px;
      overflow: hidden;
    }
    .button-region {
      height: 100px;
      line-height: 100px;
    }
  }
  .afterCropper{
    flex: 1;
    margin-left: 20px;
    border: 1px solid salmon;
    text-align: center;
  }
  .afterCropper img{
    width: 150px;
    margin-top: 30px;
  }
  .avatar-preview {
    span{
      font-size: 12px;
    }
    .margin-top{
      margin-top: 15px;
    }
  }
  /deep/.el-divider--vertical {
    height: 450px;
    margin: 0 20px;
  }
  /deep/.el-loading-spinner {
     top: 0;
     margin-top: 0;
  }
  >>>.el-dialog__body {
    padding: 0;
  }
  >>>.el-dialog__header {
    padding: 16px 20px 10px;
  }
</style>
