<template>
  <div class="office-preview" v-if="show">
    <van-overlay :show="show">
      <div class="block">
        <div class="close-bar" @click="close">
          <svg-icon class="preview-close" icon-class="close"/>
        </div>
        <div class="wrapper">
          <only-office-editor v-model="file" :read-only="readOnly"></only-office-editor>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import OnlyOfficeEditor from "@/components/office/OnlyOfficeEditor";

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
      readOnly: true,
    }
  },
  watch: {
    status: function(visible){
      if(visible){
        this.show = true
        this.checkReadOnly(this.file.userId)
      }
    }
  },
  methods: {
    close() {
      this.show = false
      this.$emit('update:status', false)
    },
    checkReadOnly(fileUserId){
      if(this.$store.state.user.token && this.$store.state.user.userId === fileUserId){
        this.readOnly = false
      }
      if (!this.$pc) {
        this.readOnly = true
        this.$nextTick(() => {
          const closeBar = document.querySelector('.office-preview .close-bar');
          closeBar.style.right = '2.5rem'
          closeBar.style.float = 'left'
          closeBar.style.transform = 'rotate(225deg)'
        })
      }
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
    top: -2.5rem;
    right: -2.5rem;
    float: right;
    width: 0;
    height: 0;
    border-radius: 2.5rem;
    border-width: 2.5rem;
    border-style: solid;
    border-color: transparent transparent transparent #d4d4d475;
    line-height: 2.5rem;
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
    font-size: 1.25rem;
    top: -8px;
    right: 13px;
  }
}

.wrapper {

  >>> .component-only-office {
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
