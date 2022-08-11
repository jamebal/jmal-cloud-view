<template>
  <div class="preview" v-if="show">
    <van-overlay :show="show">
      <div class="block">
        <div class="close-bar" @click="close">
          <svg-icon class="preview-close" icon-class="close"/>
        </div>
        <div class="wrapper">
          <div class="block">
            <only-office-editor v-model="file" :documentKey="documentKey"></only-office-editor>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import OnlyOfficeEditor from "@/components/office/OnlyOfficeEditor";
import fileConfig from "@/utils/file-config";

export default {
  name: 'OfficePreview',
  components: {
    OnlyOfficeEditor,
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
      show: this.status,
      url: '',
    }
  },
  watch: {
    status: function(visible){
      if(visible){
        this.url = fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
        if(this.shareId){
          this.url = fileConfig.publicPreviewUrl(this.file.id, window.shareId);
        }
        this.show = true
      }
    }
  },
  methods: {
    close() {
      this.show = false
      this.$emit('update:status', false)
    },
    documentKey() {
      console.log("documentKey")
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
    background-color: rgba(0,0,0,.5);
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

  .preview-close {
    transform: rotate(-45deg);
    z-index: 2009;
    position: absolute;
    font-size: 18px;
    top: -8px;
    right: 13px;
  }
}

.wrapper {

  >>> .component-only-office {
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
