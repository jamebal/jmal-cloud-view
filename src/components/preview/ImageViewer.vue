<template>
<div>
    <viewer v-show="false"
      :options="options"
      :images="images"
      @inited="inited"
      class="viewer" ref="viewer"
    >
      <template slot-scope="scope">
        <div v-for="src in scope.images"  :key="src">
          <!-- <video v-if="src.contentType === 'video'" :src="src.url"> -->
          <!-- <video v-if="src.contentType === 'video'" controls="" name="media"><source :src="src.url" type="video/mp4"></video> -->
          <img :src="src">
        </div>
      </template>
    </viewer>
    <!-- <button type="button" @click="show">Show</button> -->
</div>
</template>
<script>
  import 'viewerjs/dist/viewer.css';
  import Bus from '@/assets/js/bus'
  export default {
    name: "ImageViewer",
    components: {
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
      fileList: {
        type: Array,
        default: function () {
          return []
        }
      },
      status: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    computed: {

    },
    data(){
      return{
        currentSrc: '',
        images: [],
        options: {
          initialViewIndex: 3,
          ready: function (e) {
          },
          show: function (e) {
          },
          shown: function (e) {
          },
          hide: function (e) {
          },
          hidden: function (e) {
            Bus.$emit('updateImageViewerStatus',false)
          },
          view: function (e) {
          },
          viewed: function (e) {
          },
          zoom: function (e) {
          },
          zoomed: function (e) {
          }
        },
      }
    },
    watch: {
      status: function(visible){
        if(visible){
          this.images = []
          let viewIndex = 0
          this.fileList.forEach(element => {
            if(!element.isFolder && element.contentType.indexOf('image') > -1){
              let url = `${process.env.VUE_APP_BASE_FILE_API}preview/${element.name}?jmal-token=${this.$store.state.user.token}&fileIds=${element.id}`
              if(this.shareId){
                url = `${process.env.VUE_APP_BASE_FILE_API}/public/s/preview/${element.name}?fileIds=${element.id}`
              }
              this.images.push(url)
              if(this.file.id === element.id){
                viewIndex = this.images.length-1
              }
            }
          });
          this.show(viewIndex)
        }
      }
    },
    mounted() {
      Bus.$on('updateImageViewerStatus', () => {
        this.$emit('update:status', false)
      })
    },
    methods:{
      inited (viewer) {
        this.$viewer = viewer
      },
      show (viewIndex) {
        let index = 0
        if(viewIndex){
          index = viewIndex
        }
        this.$viewer.index = index
        this.$viewer.show()
      },
      updateStatus() {
      }
    }
  }
</script>

<style>
.viewer-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
}
</style>
