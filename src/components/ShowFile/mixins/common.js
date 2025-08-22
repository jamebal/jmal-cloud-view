import { formatSize, formatTime } from '@/utils/number'

export default {
  computed: {
    imageUrl() {
      return `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`
    },
    audioCoverUrl() {
      return `${process.env.VUE_APP_BASE_API}/view/cover?id=`
    }
  },

  methods: {
    // 格式化最近时间
    formatTime(time) {
      return formatTime(time)
    },
    // 格式化文件大小
    formatSize(size) {
      return formatSize(size)
    },
  }
}
