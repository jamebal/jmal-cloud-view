<template>
  <div ref="artRef"></div>
</template>
<script>

import { loadScript } from '@/utils/load-script'

export default {
  name: 'Artplayer',
  data() {
    return {
      instance: null,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const artPlayerJsUrl = window.location.origin + '/resource/artplayer@5.1.6.js';
    loadScript(artPlayerJsUrl, undefined).then(() => {
      this.onRead();
    })
  },
  beforeDestroy() {
    if (this.instance && this.instance.destroy) {
      this.instance.destroy(false);
    }
  },
  methods: {
    onRead() {
      this.instance = new Artplayer({
        ...this.option,
        container: this.$refs.artRef,
      })
      this.$nextTick(() => {
        this.$emit('get-instance', this.instance);
      })
    },
  },
};
</script>
