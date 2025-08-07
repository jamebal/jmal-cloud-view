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
    // 获取字符的长度。中文字符长度为2，其他字符长度为1
    getCharLength(char) {
      // 优化的字符长度计算函数
      // 使用 Unicode 范围来判断字符宽度，更准确且性能更好

      if (!char) return 0; // 处理空字符或 undefined

      const code = char.codePointAt(0);

      // 全角字符范围判断（长度为2）
      if (
        // 中日韩统一表意文字 (CJK Unified Ideographs)
        (code >= 0x4E00 && code <= 0x9FFF) ||
        // 中日韩扩展A区
        (code >= 0x3400 && code <= 0x4DBF) ||
        // 中日韩符号和标点
        (code >= 0x3000 && code <= 0x303F) ||
        // 全角ASCII、全角标点
        (code >= 0xFF00 && code <= 0xFFEF) ||
        // 平假名
        (code >= 0x3040 && code <= 0x309F) ||
        // 片假名
        (code >= 0x30A0 && code <= 0x30FF) ||
        // 韩文字母
        (code >= 0xAC00 && code <= 0xD7AF) ||
        // 其他可能的宽字符
        (code >= 0x1100 && code <= 0x11FF) || // 韩文字母扩展
        (code >= 0x2E80 && code <= 0x2EFF) || // 中日韩部首补充
        (code >= 0x2F00 && code <= 0x2FDF) || // 康熙部首
        (code >= 0x31C0 && code <= 0x31EF) || // 中日韩笔画
        (code >= 0xF900 && code <= 0xFAFF) || // 中日韩兼容表意文字
        (code >= 0xFE30 && code <= 0xFE4F) || // 中日韩兼容形式
        // 表情符号和其他宽字符
        (code >= 0x1F300 && code <= 0x1F9FF) ||
        // 全角空格
        code === 0x3000
      ) {
        return 2;
      }

      // 半角字符（包括普通空格、ASCII字符等）
      return 1;
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
