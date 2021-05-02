import fileApi from '@/api/file-api'

export default {

  baseUrl: '/api',
  // webDAV的url
  webDAVUrl: function(username) {
    return window.location.origin + `${this.baseUrl}/webDAV/${username}`
  },
  // 预览文件的url
  previewUrl: function(username, file, token) {
    if (token) {
      return `${this.baseUrl}/file/${username}${file.path}${encodeURIComponent(file.name)}?jmal-token=${token}`
    } else {
      return `${this.baseUrl}/file/${username}${file.path}${encodeURIComponent(file.name)}`
    }
  },
  // mardown里上传图片后的图片预览地址
  mardownPreviewUrl: function (path){
    return window.location.origin + `${this.baseUrl}${path}`
  },
  // 预览文件
  preview: function(username, file, token) {
    const url = this.previewUrl(username, file, token)
    window.open(url, '_blank')
  },
  // 下载文件
  download: function(username, file, token) {
    fileApi.isAllowDownload().then(() => {
      let url = `${this.baseUrl}/file/${username}${file.path}${encodeURIComponent(file.name)}?jmal-token=${token}&o=download`
      window.open(url, '_self')
    })
  },
  // 打包下载文件
  packageDownload: function(fileIds, token) {
    fileApi.isAllowDownload().then(() => {
      window.open(`${this.baseUrl}/packageDownload?fileIds=${fileIds}&jmal-token=${token}`, '_self')
    })
  },
  // 共享文件下载
  publicDownload: function(shareId, file) {
    window.open(this.publicDownloadUrl(shareId, file), '_self')
  },
  // 共享文件预览
  publicPreview: function(fileId, shareId) {
    const url = this.publicPreviewUrl(fileId, shareId)
    window.open(url, '_blank')
  },
  // 共享文件预览Url
  publicPreviewUrl: function(fileId, shareId) {
    return `${this.baseUrl}/public/s/preview/${fileId}/${shareId}`
  },
  // 共享文件打包下载
  publicPackageDownload: function(shareId, fileIds) {
    window.open(this.publicPackageDownloadUrl(shareId, fileIds), '_self')
  },
  // 共享文件下载Url
  publicDownloadUrl: function(shareId, file) {
    return window.location.origin + `${this.baseUrl}/public/s/download/${file.id}/${shareId}`
  },
  // 共享文件打包下载Url
  publicPackageDownloadUrl: function(shareId, fileIds) {
    return window.location.origin + `${this.baseUrl}/public/s/packageDownload?shareId=${shareId}&fileIds=${fileIds}`
  },
}
