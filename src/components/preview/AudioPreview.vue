<template>
  <div ref="audioPreview" v-if="show">
  <div class="audio-player"
    v-aplayerDrag="{ x: transformX, y: transformY }"
    @mouseenter="closeBarShow = true" @mouseleave="closeBarShow = false">
    <aplayer
      ref="audioPlayer"
      autoplay
      listFolded
      loop.sync="all"
      order.sync="list"
      :mini.sync="mini"
      :music.sync="music"
      :list="list"
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
import fileConfig from '@/utils/file-config'
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
        music: {
          id: '',
          src: '', // 音频文件的 URL
          title: '', // 歌曲名称
          artist: '', // 演唱者
          pic: '', // 封面图片 URL
          lrc: '', // LRC 歌词或者歌词文件的 URL
          theme: '', // 歌曲的主题色，会覆盖播放器的主题色
        },
        list: [],
        mini: false,
        audioPlayerDoc: undefined
      }
    },
    watch: {
      show(val) {
        if (val && !this.audioPlayerDoc) {
          this.$nextTick(() => {
            this.audioPlayerDoc = document.querySelector('.audio-player')
          })
        }
      }
    },
    mounted() {
      Bus.$on('onAddAudio',(newFile, audioCoverUrl) => {
        this.show = true
        let url = fileConfig.previewUrl(this.$store.state.user.name, newFile, this.$store.getters.token)
        if(!this.$store.state.user.token){
          url = fileConfig.publicPreviewUrl(newFile.id, window.shareId);
        }
        let music = newFile.music
        let fileName = newFile.name.substring(0,newFile.name.length - newFile.suffix.length-1)
        this.music = {
          id: newFile.id,
          src: url,
          title: music.songName ? music.songName : fileName,
          artist: music.songName ? music.singer : fileName,
          pic: music.songName ? audioCoverUrl+newFile.id :'',
          lrc: '',
          theme: 'pic'
        }
        let musicIndex = this.list.findIndex(item => item.id === newFile.id)
        if(musicIndex < 0){
          this.list.push(this.music)
          this.$nextTick(()=>{
            this.$refs.audioPlayer.play()
          })
        } else {
          let listMusic = this.audioPlayerDoc.querySelectorAll('.aplayer-list ol li')[musicIndex]
          listMusic.click()
        }
      })
    },
    methods: {
      close(){
        this.show = false
        this.audioPlayerDoc = undefined
        this.$refs.audioPlayer.pause()
        this.list.splice(0, this.list.length)
      }
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
