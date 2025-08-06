import { formatSize, formatTime } from '@/utils/number'

export default {
  data() {
    return {
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
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
