<template>
<div ref="audioPreview" v-show="show">
  <div class="audio-player" 
    v-aplayerDrag="{ x: transformX, y: transformY }"
    @mouseenter="closeBarShow = true" @mouseleave="closeBarShow = false">
<!-- <div class="audio-player">  -->
  <aplayer
    ref="audioPlayer"
    autoplay
    listFolded
    loop.sync="all"
    order.sync="list"
    :mini.sync="mini"
    :audio="audio"
    :lrctype="3">
  </aplayer>
  <div v-show="closeBarShow" class="close-bar" @click="close">
    <svg-icon class="audio-player-close" icon-class="close"/>
  </div>
</div>
</div>
</template>

<script>
import '@/utils/directives.js'
import Bus from '@/assets/js/bus'
import colorThief from '@/assets/js/color-thief.min.js'
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
        show: false,
        closeBarShow: false,
        audio: [],
        mini: false,
      }  
    },
    mounted() {
      this.onPicClick = this.onPicClick.bind(this);
      let pic = document.querySelector('.aplayer-pic')
      pic.addEventListener('click', this.onPicClick);
      Bus.$on('onAddAudio',newFile => {
        this.show = true
        let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + newFile.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + newFile.id
        let musicOperation = {
          id: newFile.id,
          name: newFile.name,
          artist: newFile.name,
          url: url,
          type: newFile.contentType,
          cover: 'https://images.unsplash.com/photo-1495420378468-78588a508652?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
        }
        let musicIndex = this.audio.findIndex(item => item.id===newFile.id)     
        if(musicIndex < 0){
          if(this.audio.length === 1){
            let loop = document.querySelector('.aplayer-icon.aplayer-icon-loop');
            loop.style.display = 'inline'
            let order = document.querySelector('.aplayer-icon.aplayer-icon-order');
            order.style.display = 'inline'
          }
          this.audio.push(musicOperation)
          this.$nextTick(()=>{
            this.$refs.audioPlayer.switch(this.audio.length-1)
          })
        }else{
          console.log(this.$refs.audioPlayer)
          this.$refs.audioPlayer.switch(musicIndex)
        }
      })
    },
    watch: {
    },
    methods: {
      close(){
        this.show = false
        this.audio.splice(0,this.audio.length)
      },
      onPicClick() {
        // this.mini = !this.mini
        console.log(this.$refs.audioPlayer)
      },
    },
    destroyed() {
      Bus.$off('onAddAudio')
    }
}
</script>

<style>
.aplayer {
  /* position: relative; */
  width: 460px;
  margin: 0!important;
  /* -webkit-filter: blur(15px); */
  /* filter: blur(20px); */
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background: #ffffff45!important;
  /* background-color: rgba(255,255,255,0.72); */
}
.aplayer .aplayer-lrc:before {
  background: transparent!important;
}
.aplayer .aplayer-lrc:after {
  background: transparent!important;
}

.aplayer .aplayer-list li.aplayer-list-light {
    background: #d4d4d475!important;
}

.aplayer .aplayer-list li {
  border-top: .5px solid #d4d4d475!important;
}

.aplayer .aplayer-list li:hover {
  background: #d4d4d475!important;
}

.audio-player {
  z-index: 2005;
  position: fixed;
  left: 0;
  top: 0;
}
.close-bar {
    z-index: 2006;
    position: absolute;
    top: -36px;
    right: -36px;
    width: 0;
    height: 0;
    border-radius: 36px;
    border-width: 36px;
    border-style: solid;
    border-color: transparent transparent transparent #d4d4d475;
    line-height: 36px;
    transform: rotate(-45deg);
}
.close-bar:hover {
    cursor: pointer;
    border-color: transparent transparent transparent #69696975;
}
.audio-player-close {
    transform: rotate(-45deg);
    z-index: 2009;
    position: absolute;
    top: -8px;
    right: 13px;
}
</style>