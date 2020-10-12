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
    :lrc-type="0">
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
export default {
    name: 'AudioPreview',
    components: {
    },
    props: {
    },
    computed: {
    },
    data() {
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
      Bus.$on('onAddAudio',(newFile,audioCoverUrl) => {
        this.show = true
        let url = `${process.env.VUE_APP_BASE_FILE_API}preview/${newFile.name}?jmal-token=${this.$store.state.user.token}&fileIds=${newFile.id}`
        if(!this.$store.state.user.token){
          url = `${process.env.VUE_APP_BASE_FILE_API}/public/s/preview/${newFile.name}?fileIds=${newFile.id}`
        }
        // let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + newFile.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + newFile.id
        let music = newFile.music
        let fileName = newFile.name.substring(0,newFile.name.length - newFile.suffix.length-1)
        let musicOperation = {
          id: newFile.id,
          name: music.songName ? music.songName : fileName,
          artist: music.songName ? music.singer : fileName,
          url: url,
          type: newFile.contentType,
          cover: music.songName ? audioCoverUrl+newFile.id :'',
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
          this.$refs.audioPlayer.switch(musicIndex)
        }
      })
    },
    watch: {
    },
    methods: {
      close(){
        this.show = false
        this.$refs.audioPlayer.pause();
        this.audio.splice(0,this.audio.length)
      },
      onPicClick() {
        // this.mini = !this.mini
        // console.log(this.$refs.audioPlayer)
      },
    },
    destroyed() {
      Bus.$off('onAddAudio')
    }
}
</script>

<style lang="scss" scoped>
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
