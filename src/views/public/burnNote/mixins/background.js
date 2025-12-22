import { getWebsiteRecord } from '@/api/setting-api'
import { getLoginBackgroundUrl, setLoginBackgroundUrl } from '@/utils/logo'

export default {
  data() {
    return {
      netdiskName: this.$store.state.user.netdiskName,
      netdiskLogo: this.$store.state.user.netdiskLogo,
      appStyle: {
        '--page-background-image': `linear-gradient(var(--login-page-gb-color), var(--login-page-gb-color)), url(${getLoginBackgroundUrl()})`
      },
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
        if (personalization.loginBackgroundUrl !== getLoginBackgroundUrl()) {
          this.appStyle = {
            '--page-background-image': `linear-gradient(var(--login-page-gb-color), var(--login-page-gb-color)), url(${personalization.loginBackgroundUrl})`
          }
        }
        setLoginBackgroundUrl(personalization.loginBackgroundUrl)
      }
    })
  }
}
