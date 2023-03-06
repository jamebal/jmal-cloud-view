// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {getShareToken, getToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['jmal-token'] = getToken()
      console.log(config.headers)
    }
    if (store.getters.shareToken) {
      config.headers['share-token'] = getShareToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== 0) {
      if (res.code === -2) {
        Vue.prototype.$message({
          message: res.message || '服务器开小差了...',
          type: 'warning',
          duration: 2 * 1000
        })
      } else if (res.code === 5) {
        // to re-login
        setTimeout(function () {
          const hasToken = getToken()
          if(hasToken){
            Vue.prototype.$confirm('登录已失效，请重新登录', '确认登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          }
        },200)
      } else {
        Vue.prototype.$message({
          message: res.message || '服务器开小差了...',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject()
    } else {
      let message = ''
      if(res.message){
        message = res.message.toString()
      }
      if(message !== 'true'){
        Vue.prototype.$message({
          message: res.message,
          type: 'success',
          duration: 1000
        })
      }
      return res
    }
  },
  error => {
    Vue.prototype.$message({
      message: '哎呀！服务器出错了，请稍后再试！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
