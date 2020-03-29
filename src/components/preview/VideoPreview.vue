<template>
<div class="preview" v-if="show">
<van-overlay :show="show">
  <div class="wrapper">
    <div class="block">
      <video-player class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions">              
      </video-player>
    </div>
    <div role="button" @click="close" class="viewer-button viewer-close" data-viewer-action="mix"></div>
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
      status: {
        type: Boolean,
        default: false
      }
    },
    computed: {
    },
    data() {
      return {
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
      }  
    },
    watch: {
      status: function(visible){
        if(visible){
          let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + this.file.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + this.file.id
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
      close(){
        this.show = false
        this.$emit('update:status', false)
      }
    }
}
</script>

<style>
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