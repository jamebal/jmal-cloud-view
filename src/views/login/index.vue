<template>
  <div class="login-container">

    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>

    <el-card class="box-card">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 v-if="!initialize" class="title">
            <span class="jmal-cloud-log"><svg-icon icon-class="jmal-cloud"></svg-icon></span>
            <span>JmalCloud</span>
          </h3>
          <h3 v-if="initialize" class="title">创建管理员</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
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
            placeholder="密码"
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
          <el-checkbox label="记住我" v-model="loginForm.rememberMe"></el-checkbox>
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
            placeholder="确认密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin: 30px 0;" @click.native.prevent="handleLogin">{{initialize?'创建':'登录'}}</el-button>

        <!--<div class="tips">-->
        <!--<span style="margin-right:20px;">username: admin</span>-->
        <!--<span> password: any</span>-->
        <!--</div>-->

      </el-form>
    </el-card>
    <footer id="footer" class="clearfix">
      <br><br><br>
      <div class="copyright">
        <p><span>{{ webstieRecord.copyright }}</span></p>
        <p><a href="http://beian.miit.gov.cn" target="_blank">{{ webstieRecord.recordPermissionNum }}</a></p>
      </div>
      <br>
    </footer>
  </div>
</template>

<script>
import { getWebstieRecord } from "@/api/setting-api";
import { hasUser, initialization } from '@/api/user'
import { getRememberName } from '@/utils/auth'
import store from "@/store";

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!this.validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数字'))
      } else {
        callback()
      }
    }
    const confirmPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数字'))
      } else if(this.loginForm.password !== value) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      webstieRecord: {
        copyright: 'Copyright © 2020 Journey Magical AL',
        recordPermissionNum: '"鄂 ICP 备 2020021454 号 - 1"'
      },
      loginForm: {
        username: '',
        password: '',
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

    let rememberName = getRememberName()
    if(rememberName){
      this.loginForm.username = rememberName
      this.loginForm.rememberMe = true
    }

    getWebstieRecord().then((res) => {
      this.webstieRecord = res.data
    })
  },
  methods: {
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
            initialization(data).then(()=>{
                this.initialize = false
                this.$message.success('创建成功')
            })
          }else{
            // 登录
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$store.dispatch('user/setMenuList').then((res) => {
                console.log(this.redirect)
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
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
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
    border: 1px solid #d9d9d9;
    border-radius: 5px;
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

  .box-card {
    text-align: center;
    max-width: 316px;
    margin-top: 128px;
    margin-left: auto;
    margin-right: auto;
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
    }

    .jmal-cloud-log {
      font-size: 42px;
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

</style>
