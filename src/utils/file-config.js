export default {

  baseUrl: '/api',
  previewUrl: function(username, file) {
    return `${this.baseUrl}/file/${username}${file.path}${file.name}`
  },
  publicPreviewUrl: function(fileIds) {
    return `${this.baseUrl}/public/preview/${fileIds}`
  },
  preview: function(username, file) {
    const url = this.previewUrl(username, file)
    console.log(url)
    window.open(url, '_blank')
  },
  publicPreview: function(fileIds) {
    const url = this.publicPreviewUrl(fileIds)
    window.open(url, '_blank')
  },
  download: function(username, file) {
    let url = `${this.baseUrl}/file/${username}${file.path}${file.name}?o=download`
    window.open(url, '_self')
  },
  publicDownload: function(shareId, file) {
    let url = `${this.baseUrl}/public/s/download/${file.id}/${shareId}ff`
    window.open(url, '_self')
  },
  packageDownload: function(fileIds, token) {
    window.open(`${this.baseUrl}/packageDownload?fileIds=${fileIds}&jmal-token=${token}`, '_self')
  },
  publicPackageDownload: function(shareId, fileIds) {
    window.open(`${this.baseUrl}/public/s/packageDownload?shareId=${shareId}&fileIds=${fileIds}`, '_self')
  },
}
