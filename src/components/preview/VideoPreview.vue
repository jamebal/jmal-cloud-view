<template>
<div class="preview" v-if="show">
<van-overlay :show="show">
  <div class="wrapper">
    <div class="block">
      <div class="close-bar" @click="close">
        <svg-icon class="audio-player-close" icon-class="close"/>
      </div>
      <Artplayer @get-instance="getInstance" :option="option" :style="style"/>
    </div>
  </div>
</van-overlay>
</div>
</template>

<script>
import fileConfig from '@/utils/file-config'
import Artplayer from "@/components/preview/Artplayer.vue";

export default {
    name: 'VideoPreview',
    components: {
      Artplayer
    },
    props: {
      file: {
        type: Object,
        default: function () {
          return {}
        }
      },
      shareId: {
        type: String,
        default: undefined
      },
      status: {
        type: Boolean,
        default: false
      }
    },
    computed: {
    },
    data() {
      return {
        pc: this.$pc,
        option: {
          url: '',
          fullscreen: true,
          fullscreenWeb: true,
          //pip: true, // 是否在底部控制栏里显示 画中画 的开关按钮
          flip: true, // 是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单 里
          playbackRate: true, // 是否显示视频播放速度功能，会出现在 设置面板 和 右键菜单 里
          aspectRatio: true, // 是否显示视频长宽比功能，会出现在 设置面板 和 右键菜单 里
          screenshot: true, // 是否在底部控制栏里显示 视频截图 功能
          setting: true, // 是否在底部控制栏里显示 设置面板 的开关按钮
        },
        style: {
          width: '100vw',
          height: '60vh',
          maxWidth: '900px',
          maxHeight: '600px',
        },
        show: this.status,
        timeout: null,
        playing: false,
      }
    },
    watch: {
      status: function(visible){
        if(visible){
          this.option.url = fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
          if(this.shareId){
            this.option.url = fileConfig.publicPreviewUrl(this.file.id, window.shareId, this.$store.getters.shareToken)
          }
          this.option.id = this.file.id
          this.show = true
        }
      }
    },
    methods: {
      close() {
        this.show = false
        this.$emit('update:status', false)
      },
      getInstance(art) {
      },
    }
}
</script>

<style lang="scss" scoped>
.preview {
  position: fixed;
    top: 0;
    left: 0;
    z-index: 1002;
    width: 100%;
    height: 100%;
}

.van-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1003;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
}

.block {


  .close-bar {
    z-index: 2006;
    position: absolute;
    top: -36px;
    right: -36px;
    float: right;
    width: 0;
    height: 0;
    border-radius: 36px;
    border-width: 36px;
    border-style: solid;
    border-color: transparent transparent transparent #d4d4d475;
    line-height: 36px;
    opacity: 1;
    transform: rotate(315deg);
  }

  .close-bar:hover {
    cursor: pointer;
    border-color: transparent transparent transparent #69696975;
  }

  .audio-player-close {
    transform: rotate(315deg);
    z-index: 2009;
    position: absolute;
    font-size: 18px;
    top: -8px;
    right: 13px;
  }

}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

</style>
