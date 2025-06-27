import request from '@/utils/request'

export default {
  /**
   * 创建直链
   * @param params
   * @returns {*}
   */
  createDirectLink: function(params) {
    return request({
      url: 'direct-link/create',
      method: 'post',
      params
    })
  },
  /**
   * 重置直链
   * @param params
   * @returns {*}
   */
  resetDirectLink: function(params) {
    return request({
      url: 'direct-link/reset',
      method: 'put',
      params
    })
  },
  /**
   * 重置直链
   * @param params
   * @returns {*}
   */
  resetAllDirectLink: function(params) {
    return request({
      url: 'direct-link/reset-all',
      method: 'delete',
      params
    })
  },
}
