import { formatExif, formatVideo } from '@/utils/media'

export default {
  methods: {
    extendedInfo(file) {
      if (!file.exif && !file.video) {
        return ''
      }
      return formatExif(file.exif, '<br>') + formatVideo(file.video, '<br>')
    },
    tooltipConfig(item) {
      // 使用模板字符串构建更清晰的 HTML
      const contentHTML = `
        <div class="apple-tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-label">大小:</span>
            <span class="tooltip-value">${this.formatSize(item.size)}</span>
          </div>
          ${item.w && item.h ? `
          <div class="tooltip-row">
            <span class="tooltip-label">尺寸:</span>
            <span class="tooltip-value">${item.w}×${item.h}</span>
          </div>` : ''}
          <div class="tooltip-row">
            <span class="tooltip-label">名称:</span>
            <span class="tooltip-value tooltip-value-name">${item.name}</span>
          </div>
          <div v-if="item.childrenCount" class="tooltip-row">
            <span class="tooltip-label">内容数量:</span>
            <span class="tooltip-value tooltip-value-path">${item.childrenCount}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">上传时间:</span>
            <span class="tooltip-value tooltip-value-date">${item.uploadDate}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">修改时间:</span>
            <span class="tooltip-value tooltip-value-date">${item.updateDate}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">路径:</span>
            <span class="tooltip-value tooltip-value-path">${item.path}</span>
          </div>
         ${this.extendedInfo(item)}
        </div>
      `;

      return {
        content: contentHTML,
        // trigger: 'click',
        delay: 0,
        placement: 'left',
        allowHTML: true,
        theme: 'light',
        // appendTo: 'parent',
        arrow: false
      };
    }
  }
}
