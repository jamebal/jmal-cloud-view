import request from '@/utils/request'

export default {
  // 获取分享者信息
  getAppToken: function(params) {
    return request({
      url: 'oss/aliyun/getAppToken',
      method: 'get',
      params
    })
  },
}
