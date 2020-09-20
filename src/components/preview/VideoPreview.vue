<template>
<div class="preview" v-if="show">
<van-overlay :show="show">
  <div class="wrapper">
    <div class="block" @mousemove="onmousemove" @mouseout="onmouseout" @mouseenter="onmouseenter" @mouseleave="onmouseleave">
<!--      <div role="button" @click="close" class="viewer-button viewer-close" data-viewer-action="mix"></div>-->
      <div v-show="pc?closeBarShow:true" class="close-bar" @click="close">
        <svg-icon class="audio-player-close" icon-class="close"/>
      </div>
      <video-player class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @playing="onPlayerPlaying"
        @ended="onPlayerEnded"
        @pause="onPlayerPause">
      </video-player>
    </div>
  </div>
</van-overlay>
</div>
</template>

<script>
import 'vant/lib/overlay/style';
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
    name: 'VideoPreview',
    components: {
      videoPlayer
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
        closeBarShow: false,
        pc: this.$pc,
        playerOptions: {
                    //播放速度
                    playbackRates: [0.5, 1.0, 1.5, 2.0],
                    //如果true,浏览器准备好时开始回放。
                    autoplay: true,
                    // 默认情况下将会消除任何音频。
                    muted: false,
                    // 导致视频一结束就重新开始。
                    loop: false,
                    // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    preload: 'auto',
                    language: 'zh-CN',
                     // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    aspectRatio: '16:9',
                     // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    fluid: true,
                    sources: [],
                    //你的封面地址
                    poster: '',
                     //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    notSupportedMessage: '此视频暂无法播放，请稍后再试',
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: true,
                        //全屏按钮
                        fullscreenToggle: true
                    }
                },
        show: this.status,
        url: '',
        timeout: null,
        playing: false,
      }
    },
    watch: {
      status: function(visible){
        if(visible){
          let url = `${process.env.VUE_APP_BASE_FILE_API}preview/${this.file.name}?jmal-token=${this.$store.state.user.token}&fileIds=${this.file.id}`
          if(this.shareId){
            url = `${process.env.VUE_APP_BASE_FILE_API}/public/s/preview/${this.file.name}?fileIds=${this.file.id}`
          }
          // let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + this.file.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + this.file.id
          this.playerOptions.sources = [{
                        //类型
                        type: this.file.contentType,
                        //url地址
                        src: url,
                    }]
          this.show = true
        }
      }
    },
    methods: {
      close() {
        this.show = false
        this.$emit('update:status', false)
      },
      onPlayerPlaying(){
        this.playing = true
        this.clearTimeout()
        this.timeout = setTimeout(this.timeoutFun, 2500)
      },
      onPlayerPause(){
        this.closeBarShow = true
        this.playing = false
      },
      onPlayerEnded(){
        this.closeBarShow = true
        this.playing = false
      },
      onmousemove() {
        if(!this.closeBarShow){
            this.closeBarShow = true
          }
          this.clearTimeout()
          this.timeout = setTimeout(this.timeoutFun, 2500)
      },
      onmouseout() {
          // console.log('onmouseout')
          // this.timeout = null
      },
      onmouseleave() {
        this.closeBarShow = false
        this.clearTimeout()
      },
      clearTimeout(){
        if(this.timeout != null){
          clearTimeout(this.timeout)
          this.timeout = null
        }
      },
      timeoutFun(){
        if(this.playing){
          console.log("消失",this.$pc)
          if(!this.$pc){
            const closeBar = document.querySelector('.block .close-bar')
            closeBar.style.display = "none"
          }
          this.closeBarShow = false
        }
        this.clearTimeout()
      },
      onmouseenter() {
        this.closeBarShow = true
        let player = document.querySelector('.video-player.video-player.vjs-custom-skin')
        // console.log('player',player)
        // if(!player) return;
        // this.onhover(function() {
        //     console.log('124')
        //   }, player, 2000);
      },
      // onhover(fun, obj, time) {
      //   var s;
      //   obj.onmouseover = function() {
      //       console.log('onmouseover')
      //       s = setTimeout(fun, 1000);
      //     };
      //   obj.onmouseout = function() {
      //     console.log('onmouseout')
      //       if(!s) return;
      //       clearTimeout(s);
      //     };
      // },
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
    position: relative;
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

.block {
  width: 900px;
}
</style>
