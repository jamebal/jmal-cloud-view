<template>
  <div class="container">
    <div class="share-empty">
      <div class="share-empty-icon">
        <svg-icon icon-class="kongkongruye" style="width: 268px; height: auto;"/>
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
      emptyStatus:{
        type: String,
        default: '空空如也~'
      },
      emptyShare: {
        type: Boolean,
        default: false
      }
    },
    created(){
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    min-height: calc(100vh - 101px);
  }
  .share-empty {
    color: #6e6e6e;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

