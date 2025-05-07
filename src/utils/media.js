export function formatExif(exifInfo, lineBreak) {
  if (!exifInfo) {
    return ''
  }
  lineBreak = lineBreak || '\r\n'
  let exifStr = ''
  if (exifInfo['dateTimeOriginal']) {
    exifStr += `内容创作时间: ${exifInfo['dateTimeOriginal']}`
  }
  if (exifInfo['resolution']) {
    exifStr += `${lineBreak}分辨率: ${exifInfo['resolution']}`
  }
  if (exifInfo['make']) {
    exifStr += `${lineBreak}设备制造商: ${exifInfo['make']}`
  }
  if (exifInfo['model']) {
    exifStr += `${lineBreak}设备型号: ${exifInfo['model']}`
  }
  if (exifInfo['aperture']) {
    exifStr += `${lineBreak}光圈值: ${exifInfo['aperture']}`
  }
  if (exifInfo['exposureTime']) {
    exifStr += `${lineBreak}曝光时间: ${exifInfo['exposureTime']}`
  }
  if (exifInfo['focalLength']) {
    exifStr += `${lineBreak}焦距: ${exifInfo['focalLength']} 毫米`
  }
  if (exifInfo['isoEquivalent']) {
    exifStr += `${lineBreak}ISO感光度: ${exifInfo['isoEquivalent']}`
  }
  if (exifInfo['flash']) {
    exifStr += `${lineBreak}闪光灯: ${exifInfo['flash']}`
  }
  if (exifInfo['fNumber']) {
    exifStr += `${lineBreak}光圈数: ${exifInfo['fNumber']}`
  }
  if (exifInfo['exposureProgram']) {
    exifStr += `${lineBreak}曝光程序: ${exifInfo['exposureProgram']}`
  }
  if (exifInfo['meteringMode']) {
    exifStr += `${lineBreak}测光模式: ${exifInfo['meteringMode']}`
  }
  if (exifInfo['whiteBalanceMode']) {
    exifStr += `${lineBreak}白平衡: ${exifInfo['whiteBalanceMode']}`
  }
  if (exifInfo['software']) {
    exifStr += `${lineBreak}内容创作者: ${exifInfo['software']}`
  }
  if (exifInfo['longitude']) {
    exifStr += `${lineBreak}经度: ${exifInfo['longitude']}`
  }
  if (exifInfo['latitude']) {
    exifStr += `${lineBreak}纬度: ${exifInfo['latitude']}`
  }
  return exifStr
}

export function formatVideo(videoInfo, lineBreak) {
  if (!videoInfo) {
    return ''
  }
  lineBreak = lineBreak || '\r\n'
  let videoStr = ''
  if (videoInfo['height'] && videoInfo['width']) {
    videoStr += `尺寸: ${videoInfo['width']} x ${videoInfo['height']}`
  }
  if (videoInfo['bitrate']) {
    videoStr += `${lineBreak}码率: ${videoInfo['bitrate']}`
  }
  if (videoInfo['frameRate']) {
    videoStr += `${lineBreak}帧率: ${videoInfo['frameRate']} fps`
  }
  if (videoInfo['format']) {
    videoStr += `${lineBreak}格式: ${videoInfo['format']}`
  }
  if (videoInfo['duration']) {
    videoStr += `${lineBreak}时长: ${videoInfo['duration']}`
  }
  if (videoInfo['toBitrate']) {
    videoStr += `${lineBreak}转码后的码率: ${videoInfo['toBitrate']} kbps`
  }
  if (videoInfo['toFrameRate']) {
    videoStr += `${lineBreak}转码后的帧率: ${videoInfo['toFrameRate']} fps`
  }
  if (videoInfo['toHeight']) {
    videoStr += `${lineBreak}转码后的高度: ${videoInfo['toHeight']}`
  }
  return videoStr
}
