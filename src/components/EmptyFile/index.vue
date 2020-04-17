<template>
  <div class="container">
    <div class="share-empty">
      <div class="share-empty-icon">
        <img v-if="emptyShare" src="~@/assets/img/pic_sharing_empty.png" ref="image" style="max-width: 100%;" alt="">
        <img v-if="!emptyShare" src="~@/assets/img/emptyfile_intro.png" ref="image" style="max-width: 100%;" alt="">
      </div>
      <p class="share-empty-status">
        {{emptyStatus}}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EmptyFile',
    props: {
      emptyImgUrl: {
        type: String,
        default: '~@/assets/img/widget-img.jpeg'
      },
      emptyStatus:{
        type: String,
        default: '空空如也~'
      },
      emptyShare: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // sourceImg: this.emptyImgUrl,
      }
    },
    methods: {
      sourceImg(){
        return '~@/assets/img/widget-img.jpeg'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    /*min-height: calc(100vh - 50px);*/
  }
  .share-empty {
    height: 30%;
    width: 50%;
    color: #6e6e6e;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -15% 0 0 -25%;
  }
  .share-empty-icon {
    width: 268px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .share-empty-status {
    text-align: center;
    padding-top: 40px;
    font-size: 18px;
    line-height: 28px;
  }
  .share-empty-text {
    padding-top: 20px;
    font-size: 16px;
    text-align: center;
    line-height: 28px;
  }
</style>

