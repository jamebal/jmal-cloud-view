import request from '@/utils/request'

export default {
  /**
   * 查询历史文件列表
   * @param params
   * @returns {*}
   */
  fileHistoryList: function(params) {
    return request({
      url: '/history/list',
      method: 'get',
      params
    })
  },
  /**
   * 查询历史文件列表(根据path)
   * @param params
   * @returns {*}
   */
  fileHistoryPathList: function(params) {
    return request({
      url: '/history/path/list',
      method: 'get',
      params
    })
  },
  /**
   * 预览某版本的历史文件
   * @param params
   * @returns {*}
   */
  previewHistoryText: function(params) {
    return request({
      url: '/history/preview/text',
      method: 'get',
      params
    })
  },
  /**
   * 恢复该历史版本
   * @param params
   * @returns {*}
   */
  recoveryHistory: function(params) {
    return request({
      url: '/history/recovery',
      method: 'put',
      params
    })
  },
  /**
   * 删除该历史版本
   * @param params
   * @returns {*}
   */
  deleteHistory: function(params) {
    return request({
      url: '/history/delete',
      method: 'delete',
      params
    })
  },
}
