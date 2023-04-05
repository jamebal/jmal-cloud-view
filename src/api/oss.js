import request from '@/utils/request'
const qs = require('qs')

export default {
  /**
   * 获取OSS平台列表
   */
  getPlatformList: function(params) {
    return request({
      url: '/oss/getPlatformList',
      method: 'get',
      params
    })
  },
  /**
   * OSS配置列表
   */
  ossConfigList: function(params) {
    return request({
      url: '/oss/ossConfigList',
      method: 'get',
      params
    })
  },
  /**
   * 新增/修改OSS配置
   */
  putOssConfig: function(data) {
    return request({
      url: '/oss/putOssConfig',
      method: 'put',
      data
    })
  },
  /**
   * 删除OSS配置
   */
  deleteOssConfig: function(params) {
    return request({
      url: '/oss/deleteOssConfig',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
}
