<template>
  <div>
    <div class="pdf-office">
      <iframe ref="pdfIframe" name="PDF Preview" :title="file.name" :src="fileUrl"></iframe>
    </div>
  </div>
</template>

<script>

export default {
  name: "PdfPreview",
  props: {
    id: {
      type: String,
      default: () => {
        return "office_" + Math.round(Math.random() * 10000)
      }
    },
    fileUrl: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data() {
    return {}
  },
  mounted() {
    this.iframeLoad();
  },
  methods: {
    iframeLoad() {
      const iframe = this.$refs.pdfIframe;
      const that = this
      if (iframe.attachEvent) {
        // IE
        iframe.attachEvent('onload', () => {
          that.$emit('onReady')
        });
      } else {
        // 非IE
        iframe.onload = () => {
          that.$emit('onReady')
        };
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf-office {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
