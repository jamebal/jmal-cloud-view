// filters: {
//   numFilter (value) {
//     cutOutNum(value)
//   }
// }
//
/**
 * 对源数据截取decimals位小数，不进行四舍五入
 * @param {*} num 源数据
 * @param {*} decimals 保留的小数位数
 */
export const cutOutNum = (num, decimals) => {
  if (isNaN(num) || (!num && num !== 0)) {
    return '--'
  }
  // 默认为保留的小数点后两位
  const dec = decimals || 2
  // 源数据为整数或者小数点后面小于decimals位的不处理
  const pointIndex = String(num).indexOf('.') + 1 // 获取小数点的位置 + 1
  const pointCount = pointIndex ? String(num).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  if (pointIndex === 0 || pointCount <= dec) {
    return num
  }
  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(num).split('.')[0]}.${String(num).split('.')[1].substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal === 0) {
    realVal = 0
  }
  return realVal
}

/***
 * 计算字符串长度(英文占1个字符，中文汉字占2个字符)
 * @param str
 * @returns {number}
 */
export function strlen(str){
  var len = 0;
  for (var i=0; i<str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
      len++;
    }
    else {
      len+=2;
    }
  }
  return len;
}

/***
 * 截取字符串前10位
 * @param str
 * @returns {string}
 */
export function substring10(str){
  let len = 0;
  let res = '';
  for (let i=0; i<str.length; i++) {
    let c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
      len++;
    }
    else {
      len+=2;
    }
    if(len <= 10){
      res += str[i];
    }
  }
  return res;
}

/***
 * 截取字符串前n位
 * @param str
 * @param n
 * @returns {string}
 */
export function substring(str,n){
  let len = 0;
  let res = '';
  for (let i=0; i<str.length; i++) {
    let c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
      len++;
    }
    else {
      len+=2;
    }
    if(len <= n){
      res += str[i];
    }
  }
  return res;
}

/**
 * @param {number} agoTime
 * @returns {string}
 */
export function formatTime(agoTime) {
  const diff = agoTime / 1000
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return parseInt(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return parseInt(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 30) {
    return parseInt(diff / (3600 * 24)) + '天前'
  } else if (diff <= 3600 * 24 * 30 * 12) {
    return parseInt(diff / (3600 * 24 * 30)) + '个月前'
  } else {
    return parseInt(diff / (3600 * 24 * 30 * 12)) + '年月前'
  }
}

/**
 * formatSize
 * @param {*} size
 */
export function formatSize(size) {
  if (size === 0) {
    return ''
  } else if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size/1024).toFixed(2) + 'k'
  } else if (size < 1024 * 1024 * 1024) {
    return (size/(1024 * 1024)).toFixed(2) + 'M'
  } else {
    return (size/(1024 * 1024 * 1024)).toFixed(2) + 'G'
  }
}

/**
 * formatNetSpeed
 * @param {*} size
 */
export function formatNetSpeed(size) {
  if (size === 0) {
    return '0 B/s'
  } else if (size < 1024) {
    return size + ' B/s'
  } else if (size < 1024 * 1024) {
    return (size/1024).toFixed(2) + ' KB/s'
  } else if (size < 1024 * 1024 * 1024) {
    return (size/(1024 * 1024)).toFixed(2) + ' MB/s'
  } else {
    return (size/(1024 * 1024 * 1024)).toFixed(2) + ' GB/s'
  }
}
