<template>
  <div class="login-container" :style="backgroundImg">

    <div class="login-content">
      <el-card class="login-card gradient-border" v-if="!mfaForceEnable">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

          <div class="title-container">
            <h3 v-if="!initialize && websiteRecord.netdiskName">
              <div  class="title">
                <Logo v-model="websiteRecord.netdiskLogo" width="65"></Logo>
                <div class="jmal-cloud-name">
                  <div>{{ websiteRecord.netdiskName ? websiteRecord.netdiskName : '' }}</div>
                </div>
              </div>
            </h3>
            <h3 v-if="initialize" class="title">{{ $t('login.createAdmin') }}</h3>
          </div>

          <el-form-item v-show="!mfaRequired" prop="username" class="login-input">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item v-show="!mfaRequired" prop="password" class="login-input">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          </el-form-item>

          <el-form-item v-show="mfaRequired" prop="mfaCode" class="login-input">
            <el-input
              ref="mfaCode"
              v-model="loginForm.mfaCode"
              :placeholder="$t('login.mfaCode')"
              type="text"
              auto-complete="off"
              @keyup.enter.native="verifyMfaCode"
              @input="mfaCodeInput"
            />
          </el-form-item>

          <el-form-item v-if="!initialize && !mfaRequired" class="remember">
            <!--<el-switch v-model="loginForm.rememberMe"></el-switch>-->
            <el-checkbox :label="$t('login.rememberMe')" v-model="loginForm.rememberMe"></el-checkbox>
          </el-form-item>

          <el-form-item v-if="initialize" prop="confirmPassword" class="login-input">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.confirmPassword"
              :type="passwordType"
              :placeholder="$t('login.confirmPassword')"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          </el-form-item>
          <el-button v-if="!mfaRequired" round :loading="loading" type="primary" style="width:100%;margin: 30px 0;" @click.native.prevent="handleLogin">{{initialize?$t('login.create'):$t('login.login')}}</el-button>
          <el-button v-if="mfaRequired" round :loading="verifyMfaCodeLoading" type="primary" style="width:100%;margin: 30px 0;" @click.native.prevent="verifyMfaCode">{{$t('login.verify')}}</el-button>
        </el-form>
      </el-card>
      <el-card class="mfa-card" v-if="mfaForceEnable">
        <mfa-config isLoginPage :login-form="loginForm"></mfa-config>
      </el-card>
    </div>
    <footer id="footer" class="clearfix" style="font-size: 0.725rem;">
      <div v-if="!websiteRecord.footerHtml" class="copyright">
        <div>{{ websiteRecord.copyright }}</div>
        <span>
          <a target="_blank" href="https://beian.miit.gov.cn" >{{ websiteRecord.recordPermissionNum }}</a>
          <a target="_blank" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode='+websiteRecord.networkRecordNumber" ><img v-if="websiteRecord.networkRecordNumberStr" src="~@/assets/img/beian.png"/>{{ websiteRecord.networkRecordNumberStr }}</a>
        </span>
      </div>
      <div ref="footerHtml" v-else class="copyright" v-html="websiteRecord.footerHtml" />
    </footer>
  </div>
</template>

<script>
import { getWebsiteRecord } from "@/api/setting-api"
import { hasUser, initialization } from '@/api/user'
import Logo from "@/components/Logo"
import { getLoginBackgroundUrl, setLoginBackgroundUrl } from '@/utils/logo'
import MfaConfig from '@/views/setting/sys/userSetting/mfaConfig.vue'

export default {
  name: 'Login',
  components: { MfaConfig, Logo},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!this.validUsername(value)) {
        callback(new Error(this.$t('login.ruleUsername')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t('login.rulePassword')))
      } else {
        callback()
      }
    }
    const confirmPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t('login.rulePassword')))
      } else if(this.loginForm.password !== value) {
        callback(new Error(this.$t('login.ruleConfirmPassword')))
      } else {
        callback()
      }
    }
    return {
      beianUrl: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=",
      websiteRecord: {
        copyright: '',
        recordPermissionNum: '',
        netdiskName: this.$store.state.user.netdiskName,
        netdiskLogo: this.$store.state.user.netdiskLogo,
        footerHtml: '',
        loginBackgroundUrl: getLoginBackgroundUrl() || '',
      },
      loginForm: {
        username: this.$route.query.username || '',
        password: this.$route.query.password || '',
        rememberMe: false,
        confirmPassword: '',
        mfaCode: '',
        mfaToken: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: confirmPassword }]
      },
      loading: false,
      verifyMfaCodeLoading: false,
      passwordType: 'password',
      redirect: undefined,
      initialize: false,
      mfaRequired: false,
      mfaForceEnable: false,
      backgroundImg: {
        backgroundImage: '',
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        if(route.query.path){
          this.redirect += `&path=${route.query.path}`
        }
      },
      immediate: true
    }
  },
  mounted() {

    this.backgroundImg.backgroundImage = `linear-gradient(var(--login-page-gb-color), var(--login-page-gb-color)), url(${getLoginBackgroundUrl() || require("@/assets/img/logo-bg.webp")})`

    hasUser().then((data)=>{
      if(data.count < 1){
        this.initialize = true
      }
    })

    getWebsiteRecord().then((res) => {
      this.websiteRecord = res.data
      if (this.websiteRecord.netdiskName || this.websiteRecord.netdiskLogo) {
        this.$store.dispatch('user/setLogo', {netdiskName: this.websiteRecord.netdiskName, netdiskLogo: this.websiteRecord.netdiskLogo})
      }
      if (!this.websiteRecord.netdiskName) {
        this.websiteRecord.netdiskName = 'JmalCloud'
      }
      if (this.websiteRecord.footerHtml) {
        this.$nextTick(() => {
          this.loadScripts()
        })
      }
      if (this.websiteRecord.personalization) {
        const newUrl = this.websiteRecord.personalization.loginBackgroundUrl
        if (newUrl !== getLoginBackgroundUrl()) {
          this.backgroundImg.backgroundImage = `linear-gradient(var(--login-page-gb-color), var(--login-page-gb-color)), url(${newUrl})`
        }
        setLoginBackgroundUrl(newUrl)
      }
    })
  },
  methods: {
    loadScripts() {
      const preview = this.$refs.footerHtml;
      const scripts = preview.querySelectorAll('script');

      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.innerHTML = script.innerHTML;
        }
        document.body.appendChild(newScript).parentNode.removeChild(newScript);
      });
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if(this.initialize){
            // 初始化
            let data = new FormData()
            data.append('username',this.loginForm.username)
            data.append('password',this.loginForm.password)
            this.loading = true
            initialization(data).then(()=>{
                this.initialize = false
                this.$message.success(`${this.$t('createAdmin')} ${this.$t('successfully')}`)
                this.loading = false
            })
          }else{
            // 登录
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then((data) => {
              if (data && data.mfaToken) {
                this.mfaRequired = data.mfaRequired
                this.mfaForceEnable = data.mfaForceEnable
                this.loginForm.mfaToken = data.mfaToken
                this.loading = false
              } else {
                this.$store.dispatch('user/setMenuList').then(() => {
                  this.$router.push({ path: this.redirect || '/' })
                  this.loading = false
                }).catch(() => {
                  this.loading = false
                })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    mfaCodeInput(text) {
      if (text.length === 6) {
        this.verifyMfaCode()
      }
    },
    verifyMfaCode() {
      this.verifyMfaCodeLoading = true
      this.$store.dispatch('user/verifyMfaCode', this.loginForm).then(() => {
        this.$store.dispatch('user/setMenuList').then(() => {
          this.$router.push({ path: this.redirect || '/' })
        }).finally(() => {
          this.verifyMfaCodeLoading = false
        })
      }).catch(() => {
        this.verifyMfaCodeLoading = false
      })
    },
    validUsername() {
      return true
    }
  }
}
</script>

<style lang="scss">

@import "src/styles/element-ui";

@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

.login-card, .mfa-card {

  background: var(--login-page-form-bg-color) !important;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-color: var(--login-page-border-color) !important;
  box-shadow: unset !important;

  .el-form-item.login-input {
    border: 1px solid var(--login-page-border-color);
    border-radius: 12px;
    background: var(--login-page-form-input-bg-color) !important;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-color: var(--login-page-border-color) !important;
  }

}

.login-card {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      border-radius: 12px;
      height: 47px;
      caret-color: var(--primary-color);

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #FFFFFF inset !important;
        /*-webkit-text-fill-color: #FFFFFF !important;*/
      }
    }
  }

  .remember {
    border: unset!important;
    text-align: start;
    margin-top: 22px;
    margin-bottom: -20px;
    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: var(--text-color-hover);
    }
  }

}
</style>

<style lang="scss" scoped>
@import 'src/styles/logo-title';

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .login-card {
    max-width: 316px;
    border-radius: 16px;
  }

  .mfa-card {
    border-radius: 16px;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 3px 5px 0 5px;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 0 5px 0 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}

footer {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  color: var(--text-color-hover);
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  -webkit-transition: 0.5s ease all;
  transition: 0.5s ease all;

  .copyright {
    background: var(--login-page-form-bg-color) !important;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1px 10px;
  }
}

footer, footer p {
  font-size: .8125rem;
}

.gradient-border {
  border: 0;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, .3), rgba(255, 255, 255, 0));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    pointer-events: none;
  }
}

</style>
