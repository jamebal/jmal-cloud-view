export default {
  computed: {
    gridFilename() {
      // 优化文件名，如果文件名过长，则进行截取
      return function(item) {
        let filename = item.name;
        // 如果是文件夹，直接返回文件夹名
        if (item.isFolder || !this.grid) {
          return filename;
        }
        const verticalImage = item.w && item.h && (item.w / item.h < 1.6)
        const verticalVideo = item.video && (item.video.width / item.video.height < 1.6)
        const singleLine = verticalImage || verticalVideo || item.showCover
        const gridFilenameLength = singleLine ? 13 : 28
        // 分离文件名和后缀
        let parts = filename.split('.');
        let suffix = parts.length > 1 ? parts.pop() : '';
        let base = parts.join('.');
        // 获取文件名的有效长度
        let effectiveLength = this.getEffectiveLength(base, suffix);
        // 如果有效长度小于或等于规定的长度，则直接返回文件名
        if (effectiveLength <= gridFilenameLength) {
          return filename;
        }
        // 根据是否有后缀来确定需要截取的长度
        let sliceLength = gridFilenameLength - (suffix ? suffix.length + 2 : 1); // +2 是为了“…”和分隔符
        let prev = '';
        let currentLength = 0;
        // 截取字符串，确保不会在中文字符中间断开
        for (let char of Array.from(base)) {
          let charLength = this.getCharLength(char);
          if (currentLength + charLength > sliceLength) {
            break;
          }
          currentLength += charLength;
          prev += char;
        }
        // 根据是否有后缀返回相应的格式
        if (suffix) {
          return prev + '…' + suffix;
        }
        return prev + '…';
      };
    },
    getSummaries3() {
      let totalSize = 0
      this.fileList.forEach(file => {
        totalSize += file.size
      })
      return totalSize > 0
        ? this.fileList.length + '项 ' + this.getShowSumSize(totalSize)
        : ''
    },
  },
  methods: {
    // 判断给定的字符是否是中文
    isChineseChar(char) {
      return char.charCodeAt(0) > 255
    },
    // 获取字符的长度。中文字符长度为2，其他字符长度为1
    getCharLength(char) {
      //return this.isChineseChar(char) ? 2 : 1
      // 简单判断字符长度：中文字符和全角字符长度为2，其他为1
      if (this.isChineseChar(char)) {
        return 2;
      } else if (char === ' ') {
        return 2; // 空格作为一个字符处理
      } else {
        return 1;
      }
    },
    // 获取有效长度。如果有后缀，则包括后缀和点的长度；否则是基础名称和后7位的长度
    getEffectiveLength(base, suffix) {
      let chineseLength = Array.from(base).reduce((count, char) => count + this.getCharLength(char), 0)
      return suffix ? chineseLength + suffix.length + 1 : chineseLength
    },
    getNewFileName(fileList, newFileName) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        let fileName = file.name || file.label
        filenameList.push(fileName)
      })
      const newName = newFileName
      while (filenameList.includes(newFileName)) {
        append += 1
        if (newName.indexOf('.') > 0) {
          const name = newName.substring(0, newName.lastIndexOf('.'))
          const suffix = newName.substring(newName.lastIndexOf('.'))
          newFileName = `${name}${append}${suffix}`
        } else {
          newFileName = `${newName}${append}`
        }
      }
      return newFileName
    },
    getDuplicateFileName(fileList, filename) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        let fileName = file.name || file.label
        filenameList.push(fileName)
      })
      let newName = filename
      while (filenameList.includes(filename)) {
        append += 1
        if (newName.indexOf('.') > 0) {
          let name = newName.substring(0, newName.lastIndexOf('.'))
          if (name.indexOf(' 副本') > 0) {
            name = name.substring(0, name.lastIndexOf(' 副本'))
          }
          const suffix = newName.substring(newName.lastIndexOf('.'))
          if (append === 1) {
            filename = `${name} 副本${suffix}`
          } else {
            filename = `${name} 副本${append}${suffix}`
          }
        } else {
          if (newName.indexOf(' 副本') > 0) {
            newName = newName.substring(0, newName.lastIndexOf(' 副本'))
          }
          if (append === 1) {
            filename = `${newName} 副本`
          } else {
            filename = `${newName} 副本${append}`
          }
        }
      }
      return filename
    },
  }
}
