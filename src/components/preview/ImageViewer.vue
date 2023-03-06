<template>
  <div>
    <viewer v-show="pc"
            :options="options"
            :images="images"
            @inited="inited"
            class="viewer" ref="viewer"
    >
      <template slot-scope="scope">
        <div v-for="(image,index) in scope.images" :key="index">
          <img :src="image.thumbnail" :data-src="image.source">
        </div>
      </template>
    </viewer>
  </div>
</template>
<script>
import fileConfig from '@/utils/file-config'
import Bus from '@/assets/js/bus'

export default {
  name: "ImageViewer",
  components: {},
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
  computed: {},
  data() {
    return {
      imageThumbnailUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
      publicImageThumbnailUrl: process.env.VUE_APP_BASE_API + '/public/s/view/thumbnail?id=',
      currentSrc: '',
      images: [],
      imagesFristIndex: -1,
      imagesLastIndex: -1,
      imageFiles: [],
      vantImagePreview: null,
      pc: this.$pc,
      options: {
        url: 'data-src',
        initialViewIndex: 3,
        ready: function (e) {
        },
        show: function (e) {
        },
        shown: function (e) {
        },
        hide: function (e) {
        },
        hidden: function () {
          Bus.$emit('updateImageViewerStatus', false)
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
    status: function (visible) {
      this.pc = this.$pc
      if (visible) {
        this.images = []
        let viewIndex = 0
        this.imageFiles = this.fileList.filter(element => !element.isFolder && element.contentType.startsWith('image'))
        this.imageFiles.forEach((element) => {
          this.images.push({
            thumbnail: this.getImageUrlbyThumbnail(element.id),
            source: this.getImageUrl(element)
          })
          if (this.file.id === element.id) {
            viewIndex = this.images.length - 1
          }
        })
        this.show(viewIndex)
      }
    }
  },
  mounted() {
    Bus.$on('updateImageViewerStatus', () => {
      this.imagesFristIndex = -1
      this.imagesLastIndex = -1
      this.$emit('update:status', false)
    })
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    getImageUrl(element) {
      let url = fileConfig.previewUrl(this.$store.state.user.name, element, this.$store.getters.token)
      if (this.shareId) {
        url = fileConfig.publicPreviewUrl(element.id, window.shareId, this.$store.getters.shareToken);
      }
      return url
    },
    getImageUrlbyThumbnail(fileId) {
      if (this.$store.getters.token){
        return this.imageThumbnailUrl + fileId
      } else {
        return this.publicImageThumbnailUrl + fileId
      }
    },
    show(viewIndex) {
      let index = 0
      if (viewIndex) {
        index = viewIndex
      }
      if (this.$pc) {
        this.$viewer.index = index
        this.$viewer.show()
      } else {
        this.imagePreview(index)
      }
    },
    imagePreview(viewIndex) {
      let imageUrls = []
      this.images.forEach(image => {
        imageUrls.push(image.source)
      })
      this.vantImagePreview = vant.ImagePreview({
        images: imageUrls,
        startPosition: viewIndex,
        onClose() {
          Bus.$emit('updateImageViewerStatus', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  display: none;
}

.viewer-backdrop {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
