<template>
<div ref="audioPreview" v-show="show">
  <div class="audio-player" v-aplayerDrag="{ x: transformX, y: transformY }">
<!-- <div class="audio-player">  -->
  <aplayer
    ref="audioPlayer"
    autoplay
    listFolded
    :mini.sync="mini"
    :audio="audio"
    :lrc-type="3">
  </aplayer>
</div>
</div>
</template>

<script>
import '@/utils/directives.js'
import Bus from '@/assets/js/bus'
export default {
    name: 'AudioPreview',
    components: {
    },
    props: {
    },
    computed: {
    },
    data($this) {
      return {
        transformX: (document.body.clientWidth-500)/2,
        transformY: 0,
        show: true,
        audio: [],
        mini: false,
      }  
    },
    mounted() {
      this.onPicClick = this.onPicClick.bind(this);
      let pic = document.querySelector('.aplayer-pic')
      pic.addEventListener('click', this.onPicClick);
      Bus.$on('onAddAudio',function(newFile){
        console.log(this.$refs)
        this.show = false
        // let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + newFile.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + newFile.id
        // let musicOperation = {
        //   id: newFile.id,
        //   name: newFile.name,
        //   artist: newFile.name,
        //   url: url,
        //   type: newFile.contentType,
        //   cover: 'https://images.unsplash.com/photo-1495420378468-78588a508652?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80'
        // }
        // let musicIndex = this.audio.findIndex(item => item.id===newFile.id)     
        // if(musicIndex < 0){
        //   this.audio.push(musicOperation)
        //   this.$nextTick(()=>{
        //     this.$refs.audioPlayer.switch(this.audio.length-1)
        //   })
        // }else{
        //   console.log(this.$refs.audioPlayer)
        //   this.$refs.audioPlayer.switch(musicIndex)
        // }
      })
    },
    watch: {
    },
    methods: {
      close(){
        this.show = false
        // this.$emit('update:status', false)
      },
      onPicClick() {
        // this.mini = !this.mini
        console.log(this.$refs.audioPlayer)
      },
    }
}
</script>

<style>
.aplayer {
  /* position: relative; */
  width: 500px;
}
.audio-player {
  z-index: 2005;
  position: fixed;
  left: 0;
  top: 0;
}
</style>