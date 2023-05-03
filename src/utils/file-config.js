import fileApi from '@/api/file-api'

export default {
  baseUrl: '/api',
  // 网盘logo
  logoUrl: function(filename) {
    return window.location.origin + `${this.baseUrl}/file/${filename}`
  },
  // webDAV的url
  webDAVUrl: function(username) {
    return window.location.origin + `${this.baseUrl}/webDAV/${username}`
  },
  // office api url
  officeApiUrl: function() {
    return `${window.location.origin}/office/web-apps/apps/api/documents/api.js`
  },
  // office回调url
  officeCallBackUrl: function(token, username, fileId) {
    return `${window.location.origin}${this.baseUrl}/office/track?jmal-token=${token}&name=${username}&fileId=${fileId}`
  },
  // 预览文件的url
  previewUrl: function(username, file, token, shareToken) {
    let fileUrl = `${this.baseUrl}/file/${username}${encodeURI(file.path)}${encodeURI(file.name)}`
    fileUrl = fileUrl.replace(/%5C/g, '/')
    if (token) {
      return `${fileUrl}?jmal-token=${token}&name=${username}`
    }
    if (shareToken) {
      return `${fileUrl}?share-token=${shareToken}`
    }
    return fileUrl
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
      window.open(`${this.baseUrl}/packageDownload?fileIds=${fileIds}&jmal-token=${token}&name=${username}`, '_self')
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
  publicPreviewUrl: function(file, shareId, shareToken) {
    if (!shareToken) {
      shareToken = "none"
    }
    return `${this.baseUrl}/public/s/preview/${file.name}?fileId=${file.id}&shareId=${shareId}&shareToken=${shareToken}`
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
    return window.location.origin + `${this.baseUrl}/public/s/packageDownload?shareId=${shareId}&fileIds=${fileIds}&share-token=${shareToken}`
  },
}
