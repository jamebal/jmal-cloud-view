<template>
  <div class="hello">
    <p>预览</p>
    <div class="before"></div>
    <button style="margin: 30px auto;" type="error" @click="sureSava">裁剪</button>
    <div class="container">
      <div class="img-container">
        <img src="~@/assets/img/back.jpeg" ref="image" alt="">
      </div>
      <div class="afterCropper">
        <img :src="afterImg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs'

  export default {
    name: 'HelloWorld',
    data () {
      return {
        cropper: null,
        afterImg: ''
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        this.cropper = new Cropper(this.$refs.image, {
          viewMode: 1,
          dragMode: 'none',
          initialAspectRatio: 1,
          aspectRatio: 1,
          preview: '.before',
          background: false,
          autoCropArea: 0.6,
          zoomOnWheel: false,
        })
      },
      sureSava(){
        this.afterImg = this.cropper.getCroppedCanvas({
          imageSmoothingQuality: 'high'
        }).toDataURL('image/jpeg')
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{
    display: flex;
  }
  .before{
    width: 100px;
    height: 100px;
    overflow: hidden;
    /* 这个属性可以得到想要的效果 */
  }
  .img-container{
    height: 400px;
    overflow: hidden;
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
</style>
