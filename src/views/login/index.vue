<template>
  <div class="login-container">

    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>

    <div class="login-content">
      <el-card class="box-card">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

          <div class="title-container">
            <h3 v-if="!initialize">
              <div  class="title">
                <Logo v-model="webstieRecord.netdiskLogo" width="65"></Logo>
                <div class="jmal-cloud-name">
                  <div>{{ webstieRecord.netdiskName ? webstieRecord.netdiskName : 'JmalCloud' }}</div>
                </div>
              </div>
            </h3>
            <h3 v-if="initialize" class="title">{{ $t('login.createAdmin') }}</h3>
          </div>

          <el-form-item prop="username">
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

          <el-form-item prop="password">
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

          <el-form-item v-if="!initialize" class="remember">
            <!--<el-switch v-model="loginForm.rememberMe"></el-switch>-->
            <el-checkbox :label="$t('login.rememberMe')" v-model="loginForm.rememberMe"></el-checkbox>
          </el-form-item>

          <el-form-item v-if="initialize" prop="confirmPassword">
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
          <el-button round :loading="loading" type="primary" style="width:100%;margin: 30px 0;" @click.native.prevent="handleLogin">{{initialize?$t('login.create'):$t('login.login')}}</el-button>
        </el-form>
      </el-card>
      </div>
    <footer id="footer" class="clearfix" style="font-size: 0.725rem;">
      <div v-if="!webstieRecord.footerHtml" class="copyright">
        <div>{{ webstieRecord.copyright }}</div>
        <span>
          <a target="_blank" href="https://beian.miit.gov.cn" >{{ webstieRecord.recordPermissionNum }}</a>
          <a target="_blank" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode='+webstieRecord.networkRecordNumber" ><img v-if="webstieRecord.networkRecordNumberStr" src="~@/assets/img/beian.png"/>{{ webstieRecord.networkRecordNumberStr }}</a>
        </span>
      </div>
      <div ref="footerHtml" v-else v-html="webstieRecord.footerHtml" />
    </footer>
  </div>
</template>

<script>
import { getWebstieRecord } from "@/api/setting-api";
import { hasUser, initialization } from '@/api/user'
import Logo from "@/components/Logo";

export default {
  name: 'Login',
  components: {Logo},
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
      webstieRecord: {
        copyright: '',
        recordPermissionNum: '',
        netdiskName: '',
        netdiskLogo: this.$store.state.user.netdiskLogo,
        footerHtml: ''
      },
      loginForm: {
        username: this.$route.query.username || '',
        password: this.$route.query.password || '',
        rememberMe: false,
        confirmPassword: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: confirmPassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      initialize: false,
      backgroundImg: {
        background: "url("+require("@/assets/img/login-bg.png")+")",
        width: '100%',
        height: '100%',
        position: 'absolute'
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
    hasUser().then((data)=>{
      if(data.count < 1){
        this.initialize = true
      }
    })

    getWebstieRecord().then((res) => {
      this.webstieRecord = res.data
      if (this.webstieRecord.netdiskName || this.webstieRecord.netdiskLogo) {
        this.$store.dispatch('user/setLogo', {netdiskName: this.webstieRecord.netdiskName, netdiskLogo: this.webstieRecord.netdiskLogo})
      }
      if (this.webstieRecord.footerHtml) {
        this.$nextTick(() => {
          this.loadScripts()
        })
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
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$store.dispatch('user/setMenuList').then((res) => {
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    validUsername() {
      return true
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
@import "src/styles/element-ui";
$bg:#1890ff;;
$cursor: #409eff;


@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}
.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  bottom: 0;
  perspective-origin: 50% 100%;
  left: 50%;
  animation: rotate 90s infinite linear;
}

.star {
  width: 2px;
  height: 2px;
  background: #F7F7B6;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0 -300px;
  transform: translate3d(0, 0, -300px);
  backface-visibility: hidden;
}

.login-container {

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
      caret-color: $cursor;

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
  }
  .el-form-item {
    border: 1px solid #0000001a;
    border-radius: 12px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
@import "src/styles/stars";

$bg:#2d3a4b;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(#002766,30%, #0040f4);

  .login-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 6px);
  }

  .box-card {
    max-width: 316px;
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

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 5px 0 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #0a001f;
      margin: 20px auto 40px auto;
      text-align: center;
      font-weight: 500;
      display: inline-flex;
    }

    .jmal-cloud-name {
      font-size: 22px;
      line-height: 65px;
      margin-left: 10px;
    }
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
  bottom: 0;
  width: 100%;
  color: #ffffff;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  -webkit-transition: 0.5s ease all;
  transition: 0.5s ease all;
}

footer, footer p {
  font-size: .8125rem;
}

.title-container {
  >>> .el-image {
    .el-image__inner {
      border-radius: 16px;
    }
  }
}

</style>
