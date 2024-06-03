export function formatExif(exifInfo) {
  if (!exifInfo) {
    return ''
  }
  let exifStr = ''
  if (exifInfo['dateTimeOriginal']) {
    exifStr += `\r\n内容创作时间: ${exifInfo['dateTimeOriginal']}\r\n`
  }
  if (exifInfo['resolution']) {
    exifStr += `分辨率: ${exifInfo['resolution']}\r\n`
  }
  if (exifInfo['make']) {
    exifStr += `设备制造商: ${exifInfo['make']}\r\n`
  }
  if (exifInfo['model']) {
    exifStr += `设备型号: ${exifInfo['model']}\r\n`
  }
  if (exifInfo['aperture']) {
    exifStr += `光圈值: ${exifInfo['aperture']}\r\n`
  }
  if (exifInfo['exposureTime']) {
    exifStr += `曝光时间: ${exifInfo['exposureTime']}\r\n`
  }
  if (exifInfo['focalLength']) {
    exifStr += `焦距: ${exifInfo['focalLength']} 毫米\r\n`
  }
  if (exifInfo['isoEquivalent']) {
    exifStr += `ISO感光度: ${exifInfo['isoEquivalent']}\r\n`
  }
  if (exifInfo['flash']) {
    exifStr += `闪光灯: ${exifInfo['flash']}\r\n`
  }
  if (exifInfo['fNumber']) {
    exifStr += `光圈数: ${exifInfo['fNumber']}\r\n`
  }
  if (exifInfo['exposureProgram']) {
    exifStr += `曝光程序: ${exifInfo['exposureProgram']}\r\n`
  }
  if (exifInfo['meteringMode']) {
    exifStr += `测光模式: ${exifInfo['meteringMode']}\r\n`
  }
  if (exifInfo['whiteBalanceMode']) {
    exifStr += `白平衡: ${exifInfo['whiteBalanceMode']}\r\n`
  }
  if (exifInfo['software']) {
    exifStr += `内容创作者: ${exifInfo['software']}\r\n`
  }
  if (exifInfo['longitude']) {
    exifStr += `经度: ${exifInfo['longitude']}\r\n`
  }
  if (exifInfo['latitude']) {
    exifStr += `纬度: ${exifInfo['latitude']}\r\n`
  }
  console.log(exifStr)
  return exifStr
}
