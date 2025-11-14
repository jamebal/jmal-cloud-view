import { getWebsiteRecord } from '@/api/setting-api'

export default {
  data() {
    return {
      netdiskName: undefined,
      netdiskLogo: undefined,
      appStyle: {},
    }
  },
  computed: {
  },
  mounted() {
    getWebsiteRecord().then((res) => {
      const { netdiskName, netdiskLogo, personalization } = res.data
      if (netdiskName || netdiskLogo) {
        this.netdiskName = netdiskName
        this.netdiskLogo = netdiskLogo
        this.$store.dispatch('user/setLogo', {netdiskName: netdiskName, netdiskLogo: netdiskLogo})
      }
      if (personalization && personalization.loginBackgroundUrl) {
        this.appStyle = {
          '--page-background-image': `linear-gradient(var(--login-page-gb-color), var(--login-page-gb-color)), url(${personalization.loginBackgroundUrl})`
        }
      }
    })
  }
}
