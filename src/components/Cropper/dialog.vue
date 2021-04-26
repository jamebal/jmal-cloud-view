<template>
    <div>
      <div class="container">
        <div class="img-container" v-loading="loading">
          <div class="img-region">
            <img :src="sourceImg" ref="image" style="max-width: 100%;" alt="">
          </div>
          <div class="button-region">
            <el-button type="primary" @click="sureSava">保存头像</el-button>
            <el-button v-show="selectImg.id" type="primary" @click="noCropSave(selectImg.id)">不剪裁保存</el-button>
          </div>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="avatar-preview">
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
  import fileConfig from "@/utils/file-config";

  export default {
    name: 'CropperDialog',
    components: {},
    props: {
      fileImg: {
        type: Blob,
        default: {}
      },
      selectImg: {
        type: Object,
        default: {}
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
        filename: '',
        sourceImg: ''
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.initCropper()
        this.loading = false
        this.changImg(this.fileImg)
        this.setSelectImg(this.selectImg)
      })
    },
    methods: {
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
      setSelectImg(selectImg) {
        if(selectImg.id){
          this.loading = true
          this.cropper.reset()
          let url = fileConfig.previewUrl(this.$store.state.user.name, selectImg, this.$store.getters.token) + '&o=crop&w=1024'
          this.sourceImg = url
          this.cropper.replace(url)
          this.loading = false
        }
      },
      changImg(file) {
        this.filename = file.name
        if(file.size > 0){
          this.loading = true
          this.cropper.reset()
          const that = this
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(){
            that.cropper.replace(reader.result)
            that.loading = false
          }
        }
      },
      sureSava() {
        let cro = this.cropper.getCroppedCanvas({
          maxWidth: 1204 ,
          maxHeight: 1024,
          fillColor: '#FFF',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        })
        let dataURL = cro.toDataURL('image/jpeg');
        cro.toBlob((blob)=>{
          blob.name = this.filename
          this.$emit('croppedCanvas', dataURL, blob)
        })
      },
      // 不剪裁保存
      noCropSave(fileId) {
        this.$emit('noCropSave', fileId)
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
</style>
