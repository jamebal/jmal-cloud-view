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
import Hls from "hls.js";
import FlvJs from "flv.js";

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
  computed: {},
  data() {
    return {
      pc: this.$pc,
      art: null,
      switchQuality: false,
      option: {
        url: '',
        title: '', // 视频标题，目前会出现在 视频截图 和 迷你模式 下
        fullscreen: true,
        fullscreenWeb: this.$pc,
        //pip: true, // 是否在底部控制栏里显示 画中画 的开关按钮
        flip: true, // 是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单 里
        playbackRate: true, // 是否显示视频播放速度功能，会出现在 设置面板 和 右键菜单 里
        aspectRatio: true, // 是否显示视频长宽比功能，会出现在 设置面板 和 右键菜单 里
        screenshot: true, // 是否在底部控制栏里显示 视频截图 功能
        setting: true, // 是否在底部控制栏里显示 设置面板 的开关按钮
        autoplay: true, // 是否自动播放
        autoPlayback: true, // 是否使用自动 回放功能
        theme: '#23ade5',
        hotkey: true, // 是否使用快捷键
        controls: [
          {
            name: 'iina',
            position: 'right',
            tooltip: 'IINA',
            style: {
              marginRight: this.$pc ? '20px' : '0px',
            },
            html: `<a><img style="width: 1.9rem;height: 1.9rem;line-height: 1.9rem" src="${require("@/assets/img/iina.webp")}"></a>`,
            index: 1,
          },
          {
            name: 'nplayer',
            position: 'right',
            tooltip: 'nPlayer',
            style: {
              marginRight: this.$pc ? '20px' : '0px',
            },
            html: `<a><img style="width: 1.9rem;height: 1.9rem;line-height: 1.9rem" src="${require("@/assets/img/nplayer.webp")}"></a>`,
            index: 2,
          },
          {
            name: 'infuse',
            position: 'right',
            tooltip: 'Infuse',
            style: {
              marginRight: this.$pc ? '20px' : '0px',
            },
            html: `<a><img style="width: 1.9rem;height: 1.9rem;line-height: 1.9rem" src="${require("@/assets/img/infuse.webp")}"></a>`,
            index: 3,
          },
          {
            name: 'copyLink',
            position: 'right',
            html: '复制链接',
            index: 5,
            style: {
              marginRight: this.$pc ? '20px' : '0px',
            },
            click: () => this.copyToClipboard(this.videoLink),
          }
        ],
      },
      videoLink: '',
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
  mounted() {
    document.addEventListener('keyup', this.escape)
  },
  destroyed() {
    document.removeEventListener('keyup', this.escape)
  },
  watch: {
    status: function (visible) {
      if (visible) {

        if (!this.$pc) {
          // 去掉this.option.controls中name为 name: 'iina'
          this.option.controls = this.option.controls.filter(item => item.name === 'nplayer' || item.name === 'infuse')
        }

        let videoUrl = fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
        if (this.shareId) {
          videoUrl = fileConfig.publicPreviewUrl(this.file, window.shareId, this.$store.getters.shareToken)
        }
        const originUrl = videoUrl
        if (this.file.m3u8) {
          videoUrl = `${fileConfig.baseUrl}/video/hls/${this.file.m3u8}`
          if (this.shareId) {
            const shareToken = this.$store.getters.shareToken ? this.$store.getters.shareToken : 'token'
            videoUrl = `${fileConfig.baseUrl}/public/video/hls/${window.shareId}/${shareToken}/${this.file.m3u8}`
          }
        }
        this.option.url = videoUrl

        if (this.file.m3u8) {
          const supported = ['mp4', 'ogg', 'mkv', 'webm', 'hls', 'mov']
          if (supported.includes(this.file.suffix.toLowerCase())) {
            this.option.quality = [
              {
                default: true,
                html: 'HD',
                url: this.option.url,
              },
              {
                html: '原文件',
                url: originUrl,
              }
            ]
          }
          this.option.customType = {
            m3u8: this.playM3u8
          }
        }

        if (this.file.contentType.indexOf('flv') > -1) {
          this.option.url = originUrl
          this.option.quality = []
          this.option.customType = {
            flv: this.playFlv
          }
        }

        this.videoLink = window.location.origin + originUrl
        this.title = this.file.name
        this.option.id = this.file.id
        this.show = true
        this.switchQuality = true
      } else {
        this.option.url = ''
        this.videoLink = ''
        this.option.quality = []
      }
    }
  },
  methods: {
    copyToClipboard(text) {
      // 复制文本
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1000,
      });
    },
    escape(event) {
      // 监听ESC键
      if (event.code === 'Escape') {
        this.close()
      }
    },
    close() {
      this.show = false
      this.$emit('update:status', false)
    },
    getInstance(art) {
      this.art = art
      let doc = this.art.controls.$parent
      if (this.$pc)  {
        // iina
        const iina = doc.querySelector('[data-index="1"]').querySelector('a');
        iina.href = `iina://weblink?url=${this.videoLink}`
        // nplayer
        const nplayer = doc.querySelector('[data-index="2"]').querySelector('a');
        nplayer.href = `nplayer-${this.videoLink}`
        // infuse
        const infuse = doc.querySelector('[data-index="3"]').querySelector('a');
        infuse.href = `infuse://x-callback-url/play?url=${this.videoLink}`
      } else {
        // nplayer
        const nplayer = doc.querySelector('[data-index="2"]').querySelector('a');
        nplayer.href = `nplayer-${this.videoLink}`
        // infuse
        const infuse = doc.querySelector('[data-index="3"]').querySelector('a');
        infuse.href = `infuse://x-callback-url/play?url=${this.videoLink}`
      }
    },
    playM3u8(video, url, art) {
      if (Hls.isSupported()) {
        if (art.hls) art.hls.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        art.hls = hls;
        art.on('destroy', () => hls.destroy());
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        art.notice.show = 'Unsupported playback format: m3u8';
      }
    },
    playFlv(video, url, art) {
      if (FlvJs.isSupported()) {
        if (art.flv) art.flv.destroy();
        const flv = FlvJs.createPlayer({ type: 'flv', url });
        flv.attachMediaElement(video);
        flv.load();
        art.flv = flv;
        art.on('destroy', () => flv.destroy());
      } else {
        art.notice.show = 'Unsupported playback format: flv';
      }
    }
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
  background-color: rgba(0, 0, 0, .7);
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
