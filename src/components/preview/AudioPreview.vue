<template>
<div v-if="show">
  <div class="audio-player" v-aplayerDrag="{ x: transformX, y: transformY }">
  <!-- <div class="audio-player"> -->
    <aplayer 
    autoplay
    :list="list"
    :music="musicOperation"
    :float="true"
  />
  </div>
</div>
</template>

<script>
import '@/utils/directives.js'
import Aplayer from 'vue-aplayer'
export default {
    name: 'VideoPreview',
    components: {
      Aplayer
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
        transformX: 0,
        transformY: 0,
        show: this.status,
        list: [],
        audioProps: {}
      }  
    },
    watch: {
      file: function(newFile){
        let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + newFile.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + newFile.id
        this.musicOperation = {
          theme: 'pic',
          title: newFile.name,
          artist: 'Silent Siren',
          src: url,
          pic: 'https://images.unsplash.com/photo-1495420378468-78588a508652?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80'
        }
        this.list.push(this.musicOperation)
      },
      status: function(visible){
        if(visible){
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
.aplayer {
  position: fixed;
  width: 500px;
}
.audio-player {
  z-index: 2005;
  position: fixed;
  left: 0;
  top: 0;
}
</style>