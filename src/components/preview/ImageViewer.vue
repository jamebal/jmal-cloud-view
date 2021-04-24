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
        hidden: function (e) {
          Bus.$emit('updateImageViewerStatus', false)
        },
        view: function (e) {
          Bus.$emit('imageViewerCurrentIndex', e.detail.index)
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
        const findIndex = this.imageFiles.findIndex(file => file.id === this.file.id)
        this.imageFiles.forEach((element, index) => {
          this.images.push({
            thumbnail: this.imageThumbnailUrl + element.id,
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
    Bus.$on('imageViewerCurrentIndex', (index) => {
      // this.$nextTick(() => {
      //   let img = document.querySelector('.viewer-container .viewer-canvas > img')
      //   let url = this.getImageUrlbyThumbnail(this.images[index])
      //   console.log(img, 'url', url)
      //   img.src = url
      // })
      // const findIndex = this.imageFiles.findIndex(file => file.id === this.file.id)
      // if(this.imagesFristIndex === -1) {
      //   const centerIndex = (this.images.length - 1) / 2
      //   if (findIndex >= centerIndex) {
      //     this.imagesFristIndex = findIndex - centerIndex
      //   } else {
      //     this.imagesFristIndex = 0
      //   }
      //   this.imagesLastIndex += this.images.length
      // }
      // console.log('imagesFristIndex', this.imagesFristIndex, 'imagesLastIndex', this.imagesLastIndex, 'index', index)
      // if (index <= 2 && this.imagesFristIndex > 0) {
      //   let end = this.imagesFristIndex
      //   let begin = 0
      //   if (end >= 3) {
      //     begin = end - 3
      //   }
      //   console.log('begin', begin, 'end', end)
      //   let unshifts = this.imageFiles.slice(begin, end).reverse()
      //   unshifts.forEach((element, index) => {
      //     this.images.unshift(this.getImageUrl(element))
      //     this.imagesFristIndex--
      //   })
      //   console.log('index', index , 'unshifts.length', unshifts.length)
      //   // const that = this
      //   // setTimeout(function (){
      //   //   that.vantImagePreview.startPosition = index - unshifts.length
      //   // }, 200)
      // }
      // if (index >= (this.images.length - 1) && this.imagesLastIndex < (this.imageFiles.length - 1)) {
      //   let begin = this.imagesLastIndex + 1
      //   let end = begin + 1
      // }
    })
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    getImageUrl(element) {
      let url = fileConfig.previewUrl(this.$store.state.user.name, element, this.$store.getters.token)
      if (this.shareId) {
        url = fileConfig.publicPreviewUrl(element.id, window.shareId);
      }
      return url
    },
    getImageUrlbyThumbnail(url) {
      let id = url.split('&id=')[1]
      if (id) {
        const findIndex = this.imageFiles.findIndex(file => file.id === id)
        return this.getImageUrl(this.imageFiles[findIndex])
      }
      return url
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
        },
        onChange(index) {
          Bus.$emit('imageViewerCurrentIndex', index)
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
