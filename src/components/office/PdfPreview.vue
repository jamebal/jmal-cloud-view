<template>
  <di>
    <div class="pdf-office">
      <iframe ref="pdfIframe" :title="file.name" :src="fileUrl" width="100%" height="100%" align="top" frameborder="0"
              name="PDF Preview"></iframe>
    </div>
  </di>
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
      console.log('loading')
      const iframe = this.$refs.pdfIframe;
      if (iframe.attachEvent) {
        // IE
        iframe.attachEvent('onload', () => {
          this.$emit('onReady')
        });
      } else {
        // 非IE
        iframe.onload = () => {
          this.$emit('onReady')
        };
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf-office {
  position: absolute;
  top: 2.5rem;
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
}
</style>
