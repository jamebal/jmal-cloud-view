import fileApi from '@/api/file-api'
import store from '@/store'
import { defaultPreviewConfig } from '@/utils/index'

function isFilePath(str) {
  // 匹配 test/r2/file.txt
  const filePathRegex = /^[\w\-\/]+[\u4e00-\u9fa5\w\-]+\.\w+$/;
  return filePathRegex.test(str);
}

function internalHasIframePreview(lowerCaseSuffix, fileHandlers) {
  // 将 suffix 转换为小写
  for (let key in fileHandlers) {
    // 将 key 中的扩展名全部转换为小写
    const extensions = key.split(',').map(extension => extension.toLowerCase());
    if (extensions.includes(lowerCaseSuffix)) {
      return fileHandlers[key];
    }
  }
  return null;
}

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
  /**
   * office回调基础url(末尾不带斜杠, 不包含参数)
   * @param callbackServer 回调服务器地址
   */
  officeCallBackBaseUrl: function(callbackServer) {
    let callbackServerUrl = callbackServer || 'http://jmalcloud:8088/api'
    if (callbackServer) {
      if (callbackServer.endsWith('/')) {
        // 去掉最后的/
        callbackServerUrl = callbackServer.substring(0, this.officeServerConfig.callbackServer.length - 1)
      }
    }
    return `${callbackServerUrl}`
  },
  // office回调url
  officeCallBackUrl: function(callbackServer, token, username, fileId) {
    const callbackServerUrl = this.officeCallBackBaseUrl(callbackServer)
    return `${callbackServerUrl}/office/track?jmal-token=${token}&name=${username}&fileId=${fileId}`
  },
  // 预览文件的url
  previewUrl: function(username, file, token, shareToken, serverUrl, joinToken) {
    let baseUrl = serverUrl || this.baseUrl
    let fileUrl = `${baseUrl}/file/${store.getters.name}${encodeURIComponent(file.path)}${encodeURIComponent(file.name)}`
    fileUrl = fileUrl.replaceAll(/%5C|%2F/g, '/')

    if (file.userId !== store.getters.userId && token && !shareToken) {
      return `${baseUrl}/pre-file/${file.id}/${encodeURIComponent(file.name)}`
    }

    if (token) {
      if (joinToken) {
        return `${fileUrl}?jmal-token=${token}&name=${username}`
      }
      return `${fileUrl}`
    }
    if (shareToken) {
      if (isFilePath(file.id)) {
        return `${fileUrl}?share-token=${shareToken}`
      }
      return `${baseUrl}/share-file/${file.id}/${shareToken}/${encodeURIComponent(file.name)}`
    }
    if (isFilePath(file.id)) {
      return fileUrl
    }
    return `${baseUrl}/share-file/${file.id}/${encodeURIComponent(file.name)}`
  },
  // 预览历史文件
  previewHistoryUrl: function(officeCallBackBaseUrl, historyId, name, token) {
    const baseUrl = officeCallBackBaseUrl || this.baseUrl
    return `${baseUrl}/history/preview/file?id=${historyId}&name=${name}&jmal-token=${token}`
  },
  // markdown里上传图片后的图片预览地址
  markdownPreviewUrl: function (path){
    return window.location.origin + `${path}`
  },
  // 预览文件
  preview: function(username, file, token) {
    let url = this.previewUrl(username, file, token)
    url = url.replace(/%5C/g, '/')
    window.open(url, '_blank')
  },
  // 下载文件
  download: function(username, file, token) {
    fileApi.isAllowDownload({fileIds: [file.id]}).then(() => {
      let url = this.previewUrl(username, file, token) + '?o=download'
      window.open(url, '_self')
    })
  },
  // 打包下载文件
  packageDownload: function(fileIds) {
    fileApi.isAllowPackageDownload({fileIds: fileIds}).then(() => {
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
    const url = new URL(`${this.baseUrl}/public/s/packageDownload`, window.location.origin);
    url.search = new URLSearchParams({ fileIds });
    if (shareId) {
      url.searchParams.append('shareId', shareId);
    }
    if (shareToken) {
      url.searchParams.append('share-token', shareToken);
    }
    return url.toString();
  },
  // 文件打包下载Url
  packageDownloadUrl: function(fileId, downloadName, shareToken) {
    const url = new URL(`${this.baseUrl}/public/s/packageDownload/${downloadName}`, window.location.origin);
    url.search = new URLSearchParams({ fileId });
    if (shareToken) {
      url.searchParams.append('share-token', shareToken);
    }
    console.log(url.toString())
    return url.toString();
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
    const fileHandler = internalHasIframePreview(suffix, fileHandlers)
    if (fileHandler !== null) {
      return fileHandler
    }
    if (lowerCaseSuffix === 'pdf' || lowerCaseSuffix === 'epub') {
      return internalHasIframePreview(lowerCaseSuffix, JSON.parse(defaultPreviewConfig))
    }
    return null;
  },
  directFileUrl: function(mark, file) {
    const encodedName = encodeURIComponent(file.name);
    const suffix = file.isFolder ? '.zip' : '';
    return `${window.location.origin}${this.baseUrl}/direct-file/${mark}/${encodedName}${suffix}`
  }
}
