import fileApi from '@/api/file-api'
import store from '@/store'

export default {
  baseUrl: '/api',
  // 网盘logo
  logoUrl: function(filename) {
    return window.location.origin + `${this.baseUrl}/file/${filename}`
  },
  // webDAV的url
  webDAVUrl: function(username) {
    return window.location.origin + `/webDAV/${username}`
  },
  // office api url
  officeApiUrl: function(documentServer) {
    let serverUrl = documentServer || `${window.location.origin}/office`
    if (!serverUrl.endsWith('/')) {
      serverUrl = serverUrl + "/"
    }
    return serverUrl + "web-apps/apps/api/documents/api.js"
  },
  // office回调url
  officeCallBackUrl: function(callbackServer, token, username, fileId) {
    let callbackServerUrl = callbackServer || 'http://jmalcloud:8088'
    if (!callbackServerUrl.endsWith('/')) {
      callbackServerUrl = callbackServerUrl + "/"
    }
    return `${callbackServerUrl}office/track?jmal-token=${token}&name=${username}&fileId=${fileId}`
  },
  // 预览文件的url
  previewUrl: function(username, file, token, shareToken, serverUrl) {
    let owner = null
    if (username !== store.getters.name || localStorage.getItem('mountFileOwner') !== null) {
      owner = localStorage.getItem('mountFileOwner')
    } else {
      owner = username
    }
    if (owner == null) {
      owner = store.getters.name
    }
    let baseUrl = serverUrl || this.baseUrl
    let fileUrl = `${baseUrl}/file/${owner}${encodeURI(file.path)}${encodeURI(file.name)}`
    fileUrl = fileUrl.replaceAll('#', '%23')
    fileUrl = fileUrl.replaceAll(/%5C/g, '/')
    if (token) {
      return `${fileUrl}?jmal-token=${token}&name=${username}`
    }
    if (shareToken) {
      return `${fileUrl}?share-token=${shareToken}`
    }
    return fileUrl
  },
  // 预览历史文件
  previewHistoryUrl: function(historyId, name, token) {
    return `${this.baseUrl}/history/preview/file?id=${historyId}&name=${name}&jmal-token=${token}`
  },
  // markdown里上传图片后的图片预览地址
  markdownPreviewUrl: function (path){
    return window.location.origin + `${this.baseUrl}${path}`
  },
  // 预览文件
  preview: function(username, file, token) {
    let url = this.previewUrl(username, file, token)
    url = url.replace(/%5C/g, '/')
    window.open(url, '_blank')
  },
  // 下载文件
  download: function(username, file, token) {
    fileApi.isAllowDownload().then(() => {
      let url = this.previewUrl(username, file, token) + '&o=download'
      window.open(url, '_self')
    })
  },
  // 打包下载文件
  packageDownload: function(fileIds, token, username) {
    fileApi.isAllowDownload().then(() => {
      fileIds = fileIds.join(',')
      window.open(`${this.baseUrl}/packageDownload?fileIds=${fileIds}`, '_self')
    })
  },
  // 共享文件下载
  publicDownload: function(shareId, file, shareToken) {
    window.open(this.publicDownloadUrl(shareId, file, shareToken), '_self')
  },
  // 共享文件预览
  publicPreview: function(file, shareId, shareToken) {
    const url = this.publicPreviewUrl(file, shareId, shareToken)
    window.open(url, '_blank')
  },
  // 共享文件预览Url
  publicPreviewUrl: function(file, shareId, shareToken, serverUrl) {
    if (!shareToken) {
      shareToken = "none"
    }
    let baseUrl = serverUrl || this.baseUrl
    return `${baseUrl}/public/s/preview/${file.name}?fileId=${file.id}&shareId=${shareId}&shareToken=${shareToken}`
  },
  // 共享文件打包下载
  publicPackageDownload: function(shareId, fileIds, shareToken) {
    window.open(this.publicPackageDownloadUrl(shareId, fileIds, shareToken), '_self')
  },
  // 共享文件下载Url
  publicDownloadUrl: function(shareId, file, shareToken) {
    if (!shareToken) {
      shareToken = "none"
    }
    return window.location.origin + `${this.baseUrl}/public/s/download/${file.name}?fileId=${file.id}&shareId=${shareId}&shareToken=${shareToken}`
  },
  // 共享文件打包下载Url
  publicPackageDownloadUrl: function(shareId, fileIds, shareToken) {
    const queryShareId = shareId ? `&shareId=${shareId}` : ''
    const queryShareToken = shareToken ? `&share-token=${shareToken}` : ''
    return window.location.origin + `${this.baseUrl}/public/s/packageDownload?fileIds=${fileIds}${queryShareId}${queryShareToken}`
  },
  // 文件打包下载Url
  packageDownloadUrl: function(fileId, downloadName, shareToken) {
    const queryShareToken = shareToken ? `?share-token=${shareToken}` : ''
    return window.location.origin + `${this.baseUrl}/public/s/${fileId}/packageDownload/${downloadName}${queryShareToken}`
  },
  /**
   * 判断是否有iframe预览
   * @param suffix 文件后缀
   * @param fileHandlers 文件处理器
   * @returns {*|null} 文件处理器
   */
  hasIframePreview: function(suffix, fileHandlers) {
    // 将 suffix 转换为小写
    const lowerCaseSuffix = suffix.toLowerCase();
    for (let key in fileHandlers) {
      // 将 key 中的扩展名全部转换为小写
      const extensions = key.split(',').map(extension => extension.toLowerCase());
      if (extensions.includes(lowerCaseSuffix)) {
        return fileHandlers[key];
      }
    }
    return null;
  },
}
