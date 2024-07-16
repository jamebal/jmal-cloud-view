export function formatExif(exifInfo) {
  if (!exifInfo) {
    return ''
  }
  let exifStr = ''
  if (exifInfo['dateTimeOriginal']) {
    exifStr += `内容创作时间: ${exifInfo['dateTimeOriginal']}`
  }
  if (exifInfo['resolution']) {
    exifStr += `\r\n分辨率: ${exifInfo['resolution']}`
  }
  if (exifInfo['make']) {
    exifStr += `\r\n设备制造商: ${exifInfo['make']}`
  }
  if (exifInfo['model']) {
    exifStr += `\r\n设备型号: ${exifInfo['model']}`
  }
  if (exifInfo['aperture']) {
    exifStr += `\r\n光圈值: ${exifInfo['aperture']}`
  }
  if (exifInfo['exposureTime']) {
    exifStr += `\r\n曝光时间: ${exifInfo['exposureTime']}`
  }
  if (exifInfo['focalLength']) {
    exifStr += `\r\n焦距: ${exifInfo['focalLength']} 毫米`
  }
  if (exifInfo['isoEquivalent']) {
    exifStr += `\r\nISO感光度: ${exifInfo['isoEquivalent']}`
  }
  if (exifInfo['flash']) {
    exifStr += `\r\n闪光灯: ${exifInfo['flash']}`
  }
  if (exifInfo['fNumber']) {
    exifStr += `\r\n光圈数: ${exifInfo['fNumber']}`
  }
  if (exifInfo['exposureProgram']) {
    exifStr += `\r\n曝光程序: ${exifInfo['exposureProgram']}`
  }
  if (exifInfo['meteringMode']) {
    exifStr += `\r\n测光模式: ${exifInfo['meteringMode']}`
  }
  if (exifInfo['whiteBalanceMode']) {
    exifStr += `\r\n白平衡: ${exifInfo['whiteBalanceMode']}`
  }
  if (exifInfo['software']) {
    exifStr += `内容创作者: ${exifInfo['software']}`
  }
  if (exifInfo['longitude']) {
    exifStr += `\r\n经度: ${exifInfo['longitude']}`
  }
  if (exifInfo['latitude']) {
    exifStr += `\r\n纬度: ${exifInfo['latitude']}`
  }
  return exifStr
}

export function formatVideo(videoInfo) {
  if (!videoInfo) {
    return ''
  }
  let videoStr = ''
  if (videoInfo['height'] && videoInfo['width']) {
    videoStr += `尺寸: ${videoInfo['width']} x ${videoInfo['height']}`
  }
  if (videoInfo['bitrate']) {
    videoStr += `\r\n码率: ${videoInfo['bitrate']}`
  }
  if (videoInfo['frameRate']) {
    videoStr += `\r\n帧率: ${videoInfo['frameRate']} fps`
  }
  if (videoInfo['format']) {
    videoStr += `\r\n格式: ${videoInfo['format']}`
  }
  if (videoInfo['duration']) {
    videoStr += `\r\n时长: ${videoInfo['duration']}`
  }
  if (videoInfo['toBitrate']) {
    videoStr += `\r\n转码后的码率: ${videoInfo['toBitrate']} kbps`
  }
  if (videoInfo['toFrameRate']) {
    videoStr += `\r\n转码后的帧率: ${videoInfo['toFrameRate']} fps`
  }
  if (videoInfo['toHeight']) {
    videoStr += `\r\n转码后的高度: ${videoInfo['toHeight']}`
  }
  return videoStr
}
