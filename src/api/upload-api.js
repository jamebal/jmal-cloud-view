import request from '@/utils/request'
const qs = require('qs')

export default {
  // 上传
  simpleUploadURL: process.env.VUE_APP_BASE_API + '/upload',
  // 合并
  mergeSimpleUpload: function(params) {
    return request({
      url: 'merge',
      method: 'post',
      params
    })
  },
  uploadFolder: function(params) {
    return request({
      url: 'upload-folder',
      method: 'post',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 文件列表
  fileList: function(params) {
    return request({
      url: 'list',
      method: 'get',
      params
    })
  },
  // 收藏/取消收藏
  favoriteUrl: function(params) {
    const isFavorite = params.isFavorite
    if (isFavorite) {
      return request({
        url: 'favorite',
        method: 'post',
        params
      })
    } else {
      return request({
        url: 'unFavorite',
        method: 'post',
        params
      })
    }
  },
  // 删除
  delete: function(params) {
    return request({
      url: 'delete',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 重名名
  rename: function(params) {
    return request({
      url: 'rename',
      method: 'get',
      params
    })
  }

}
