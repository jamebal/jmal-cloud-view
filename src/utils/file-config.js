import fileApi from '@/api/file-api'

export default {

  baseUrl: '/api',
  webDAVUrl: function(username) {
    return window.location.origin + `${this.baseUrl}/webDAV/${username}`
  },
  previewUrl: function(username, file, token) {
    return `${this.baseUrl}/file/${username}${file.path}${file.name}?jmal-token=${token}`
  },
  mardownPreviewUrl: function (path){
    return window.location.origin + `${this.baseUrl}${path}`
  },
  publicPreviewUrl: function(fileId) {
    return `${this.baseUrl}/public/preview/${fileId}`
  },
  preview: function(username, file, token) {
    const url = this.previewUrl(username, file, token)
    window.open(url, '_blank')
  },
  publicPreview: function(fileIds) {
    const url = this.publicPreviewUrl(fileIds)
    window.open(url, '_blank')
  },
  download: function(username, file, token) {
    fileApi.isAllowDownload().then(() => {
      let url = `${this.baseUrl}/file/${username}${file.path}${file.name}?jmal-token=${token}&o=download`
      window.open(url, '_self')
    })
  },
  publicDownload: function(shareId, file) {
    window.open(this.publicDownloadUrl(shareId, file), '_self')
  },
  packageDownload: function(fileIds, token) {
    fileApi.isAllowDownload().then(() => {
      window.open(`${this.baseUrl}/packageDownload?fileIds=${fileIds}&jmal-token=${token}`, '_self')
    })
  },
  publicPackageDownload: function(shareId, fileIds) {
    window.open(this.publicPackageDownloadUrl(shareId, fileIds), '_self')
  },
  publicDownloadUrl: function(shareId, file) {
    return window.location.origin + `${this.baseUrl}/public/s/download/${file.id}/${shareId}`
  },
  publicPackageDownloadUrl: function(shareId, fileIds) {
    return window.location.origin + `${this.baseUrl}/public/s/packageDownload?shareId=${shareId}&fileIds=${fileIds}`
  },
}
