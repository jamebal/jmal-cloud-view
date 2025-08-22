<template>
  <div>
    <viewer
      v-show="pc"
      :options="options"
      :images="images"
      @inited="inited"
      class="viewer"
      ref="viewer"
    >
      <template slot-scope="scope">
        <div v-for="(image, index) in scope.images" :key="index">
          <img :src="image.thumbnail" :data-src="image.source" />
        </div>
      </template>
    </viewer>
  </div>
</template>
<script>
import fileConfig from '@/utils/file-config'
import {mapState} from 'vuex'
import store from '@/store'

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
  computed: {
    ...mapState(['message'])
  },
  data() {
    return {
      imageThumbnailUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail`,
      shareImageThumbnailUrl: `${process.env.VUE_APP_BASE_API}/public/s/view/thumbnail`,
      publicImageThumbnailUrl: process.env.VUE_APP_BASE_API + '/public/s/view/thumbnail',
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
          store.dispatch('updateMessage', { event: 'updateImageViewerStatus' })
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
            thumbnail: this.getImageUrlByThumbnail(element),
            source: this.getImageUrl(element)
          })
          if (this.file.id === element.id) {
            viewIndex = this.images.length - 1
          }
        })
        this.show(viewIndex)
      }
    },
    message(msg) {
      if (msg.event === 'updateImageViewerStatus') {
        this.imagesFristIndex = -1
        this.imagesLastIndex = -1
        this.$emit('update:status', false)
      }
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    getImageUrl(element) {
      let url = fileConfig.previewUrl(this.$store.state.user.name, element, this.$store.getters.token)
      if (this.shareId) {
        url = fileConfig.publicPreviewUrl(element, window.shareId, this.$store.getters.shareToken)
      }
      return url
    },
    getImageUrlByThumbnail(file) {
      if (this.$store.getters.token){
        return `${this.imageThumbnailUrl}/${file.name}?id=${file.id}`
      } else {
        if (this.$store.getters.shareToken) {
          return `${this.shareImageThumbnailUrl}/${file.name}?share-token=${this.$store.getters.shareToken}&id=${file.id}`
        }
        return `${this.publicImageThumbnailUrl}/${file.name}?id=${file.id}`
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
      const that = this
      this.vantImagePreview = vant.ImagePreview({
        images: imageUrls,
        startPosition: viewIndex,
        onClose() {
          that.$store.dispatch('updateMessage', { event: 'updateImageViewerStatus'})
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
