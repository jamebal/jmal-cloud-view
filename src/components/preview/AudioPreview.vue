<template>
  <div ref="audioPreview" v-if="show">
    <div class="audio-player"
         v-aplayerDrag="{ x: transformX, y: transformY }"
         @mouseenter="closeBarShow = true" @mouseleave="closeBarShow = false" @touchmove="closeBarShow = true"
         @touchend="touchend">
      <a-player
        ref="audioPlayer"
        autoplay
        listFolded
        loop.sync="all"
        order.sync="list"
        :mini.sync="mini"
        :audio="list"
        :lrc-type="0"
      >
      </a-player>
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
  components: {},
  props: {},
  computed: {},
  data() {
    return {
      pc: this.$pc,
      transformX: !this.$pc ? document.body.clientWidth - 100 : (document.body.clientWidth - 500) / 2,
      transformY: !this.$pc ? document.body.clientHeight / 2 - 100 : 0,
      show: false,
      closeBarShow: false,
      // api ==>  https://aplayer.netlify.app/docs/guide/options.html#volume
      audios: [],
      list: [],
      mini: !this.$pc,
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
    Bus.$on('onAddAudio', (newFile, audioCoverUrl) => {
      if (!this.show) {
        this.show = true
      }
      let url = fileConfig.previewUrl(this.$store.state.user.name, newFile, this.$store.getters.token)
      if (this.$store.getters.token === undefined) {
        url = fileConfig.publicPreviewUrl(newFile.id, window.shareId, this.$store.getters.shareToken);
      }
      let music = newFile.music
      let fileName = newFile.name.substring(0, newFile.name.length - newFile.suffix.length - 1)
      let musicOperation = {
        id: newFile.id,
        url: url,
        name: music.songName ? music.songName : fileName,
        artist: music.songName ? music.singer : fileName,
        cover: music.songName ? audioCoverUrl + newFile.id : '',
        type: newFile.contentType
      }
      let musicIndex = this.audios.findIndex(item => item.id === newFile.id)
      if (musicIndex < 0) {
        if (this.audios.length === 1) {
          let loop = document.querySelector('.aplayer-icon.aplayer-icon-loop');
          loop.style.display = 'inline'
          let order = document.querySelector('.aplayer-icon.aplayer-icon-order');
          order.style.display = 'inline'
        }
        this.audios.push(musicOperation)
        setTimeout(() => {
          this.list = this.audios
          setTimeout(() => {
            this.$refs.audioPlayer.switch(this.audios.length - 1)
          }, 0)
        }, 0)
      } else {
        this.$refs.audioPlayer.switch(musicIndex)
      }
    })
  },
  methods: {
    close() {
      this.show = false
      this.audioPlayerDoc = undefined
      this.$refs.audioPlayer.pause()
      this.audios.splice(0, this.audios.length)
    },
    touchend() {
      const that = this
      setTimeout(function () {
        that.closeBarShow = false
      }, 2500)
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
  margin: 0 !important;
  /* -webkit-filter: blur(15px); */
  /* filter: blur(20px); */
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background: #ffffff45 !important;
  /* background-color: rgba(255,255,255,0.72); */
}

.aplayer .aplayer-lrc:before {
  background: transparent !important;
}

.aplayer .aplayer-lrc:after {
  background: transparent !important;
}

.aplayer .aplayer-list li.aplayer-list-light {
  background: #d4d4d475 !important;
}

.aplayer .aplayer-list li {
  border-top: .5px solid #d4d4d475 !important;
}

.aplayer .aplayer-list li:hover {
  background: #d4d4d475 !important;
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

@media screen and (max-width: 768px) {
  > > > .aplayer {
    z-index: 2;
  }
  .close-bar {
    top: -34px;
    right: -34px;
    border-radius: 36px;
    border-width: 20px;
    z-index: 1;
    transform: rotate(135deg);
    border-color: #ff000075;

    > > > .audio-player-close {
      top: -7px;
      right: -7px;
    }
  }
  .close-bar:hover {
    border-color: #ff0000eb;
  }
}
</style>
