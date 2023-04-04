import request from '@/utils/request'

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
   * 判断目录是否存在
   */
  existFolderName: function(params) {
    return request({
      url: '/oss/existFolderName',
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
}
