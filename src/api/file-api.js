import request from "@/utils/request";

const qs = require("qs");

export default {
  // 上传
  simpleUploadURL: process.env.VUE_APP_BASE_API + '/upload',
  // 上传头像
  simpleUploadAvatarURL: process.env.VUE_APP_BASE_API + '/upload',
  // 合并
  mergeSimpleUpload: function(params) {
    return request({
      url: 'merge',
      method: 'post',
      params
    })
  },
  // 检查文件是否存在
  checkExist: function (params) {
    return request({
      url: "checkExist",
      method: "post",
      params
    })
  },
  // 上传文件夹
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
  // 新建文件夹
  newFolder: function(params) {
    return request({
      url: 'new_folder',
      method: 'post',
      params
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
        params,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
    } else {
      return request({
        url: 'unFavorite',
        method: 'post',
        params,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
    }
  },
  // 为文件分配标签
  setTags: function(data) {
    return request({
      url: 'setTag',
      method: 'post',
      data
    })
  },
  // 将文件设为公共文件
  setPublic: function(params) {
    return request({
      url: 'setPublic',
      method: 'put',
      params
    })
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
  },
  // 搜索文件🔍
  searchFile: function(params) {
    return request({
      url: 'search-file',
      method: 'get',
      params
    })
  },
  // 搜索文件🔍-打开目录
  searchFileAndOpenDir: function(params) {
    return request({
      url: 'search-file-open',
      method: 'get',
      params
    })
  },
  // 查找下级目录
  queryFileTree: function(params) {
    return request({
      url: 'query-file-tree',
      method: 'get',
      params
    })
  },
  // 查找上级目录
  upperLevelList: function(params) {
    return request({
      url: 'upper-level-list',
      method: 'get',
      params
    })
  },
  // 查找下级目录
  listfiles: function(params) {
    return request({
      url: 'listfiles',
      method: 'get',
      params
    })
  },
  // 移动文件/文件夹
  move: function(params) {
    return request({
      url: 'move',
      method: 'get',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 复制文件/文件夹
  copy: function(params) {
    return request({
      url: 'copy',
      method: 'get',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  /**
   * 创建副本
   * @param params
   */
  duplicateFile(params) {
    return request({
      url: 'duplicate',
      method: 'get',
      params
    })
  },
  // 生成分享链接
  generate: function(data) {
    return request({
      url: 'share/generate',
      method: 'post',
      data: data
    })
  },
  // 取消分享
  cancelShareLink: function(params) {
    return request({
      url: 'share/cancel',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 分享列表
  sharelist: function(params) {
    return request({
      url: '/share/list',
      method: 'get',
      params
    })
  },
  // 挂载文件夹
  mountFolder: function(data) {
    return request({
      url: '/share/mount-folder',
      method: 'put',
      data: data
    })
  },
  // 验证提取码
  validShareCode: function(data) {
    return request({
      url: 'public/valid-share-code',
      method: 'post',
      data
    })
  },
  // 访问分享链接
  accessShare: function(params) {
    return request({
      url: 'public/access-share',
      method: 'get',
      params
    })
  },
  // 获取分享者信息
  getSharer: function(params) {
    return request({
      url: 'public/get/sharer',
      method: 'get',
      params
    })
  },
  // 获取分享信息
  getShare: function(params) {
    return request({
      url: '/get/share',
      method: 'get',
      params
    })
  },
  // 访问分享链接里的文件夹
  accessShareOpenDir: function(params) {
    return request({
      url: 'public/access-share/open',
      method: 'get',
      params
    })
  },
  // 通过filepath预览文本文件
  previewTextByPath: function(params) {
    return request({
      url: '/preview/path/text',
      method: 'get',
      params
    })
  },
  // 预览文本文件
  previewText: function(params) {
    return request({
      url: '/preview/text',
      method: 'get',
      params
    })
  },
  // 访问分享的文本文件
  sharePreviewText: function(params) {
    return request({
      url: '/public/s/preview/text',
      method: 'get',
      params
    })
  },
  // 解压文件
  unzip: function(params) {
    return request({
      url: '/unzip',
      method: 'get',
      params
    })
  },
  // 根据path删除文件
  delFile: function(params) {
    return request({
      url: 'delFile',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 根据path重命名文件
  renameByPath: function(params) {
    return request({
      url: '/rename/path',
      method: 'get',
      params
    })
  },
  // 根据path添加文件/文件夹
  addFile: function(params) {
    return request({
      url: '/addfile',
      method: 'post',
      params
    })
  },
  // 是否允许下载
  isAllowDownload: function(params) {
    return request({
      url: '/isAllowDownload',
      method: 'get',
      params
    })
  },
  // 根据id获取文件信息
  getFileInfoById: function(params) {
    return request({
      url: '/file_info',
      method: 'get',
      params
    })
  },
  // 根据id获取文件信息
  getPublicFileInfoById: function(params) {
    return request({
      url: '/public/file_info',
      method: 'get',
      params
    })
  }
}
