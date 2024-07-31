<template>
  <div :style="{position: grid ? 'relative': 'unset'}">
    <div v-if="item.isFavorite && !public">
        <div v-if="pc">
          <svg-icon v-if="!grid" class="pc list icon-favorite" icon-class="Favoritestarrate"/>
          <svg-icon v-if="grid" class="pc grid icon-favorite" icon-class="Favoritestarrate"/>
        </div>
        <div v-else>
          <svg-icon v-if="!grid" class="mobile list icon-favorite" icon-class="Favoritestarrate"/>
          <svg-icon v-if="grid" class="mobile grid icon-favorite" icon-class="Favoritestarrate"/>
        </div>
    </div>
    <div v-if="item.mountFileId">
        <div v-if="pc">
          <svg-icon v-if="!grid" class="pc list icon-share" icon-class="guazai"/>
          <svg-icon v-if="grid" class="pc grid icon-share" icon-class="guazai"/>
        </div>
        <div v-else>
          <svg-icon v-if="!grid" class="mobile list icon-share" icon-class="guazai"/>
          <svg-icon v-if="grid" class="mobile grid icon-share" icon-class="guazai"/>
        </div>
    </div>
    <div v-if="item.isShare && item.shareBase && !public">
        <div v-if="pc">
          <svg-icon v-if="!grid" class="pc list icon-share" icon-class="share"/>
          <svg-icon v-if="grid" class="pc grid icon-share" icon-class="share"/>
        </div>
        <div v-else>
          <svg-icon v-if="!grid" class="mobile list icon-share" icon-class="share"/>
          <svg-icon v-if="grid" class="mobile grid icon-share" icon-class="share"/>
        </div>
    </div>
    <div v-if="item.tags && item.tags.length > 0 && !public">
        <div v-if="pc">
          <svg-icon v-if="grid" class="pc grid icon-tag" icon-class="tag2" :style="{left: 14 * index + 'px', color: tag.color}" v-for="(tag,index) in item.tags.slice(0, 3)" :key="tag.tagId"/>
          <!--     列表模式下只能显示一个标签     -->
          <svg-icon v-else class="pc list icon-tag" icon-class="tag2" :style="{color: tag.color}" v-for="tag in item.tags.slice(0, 1)" :key="tag.tagId"/>
        </div>
        <div v-else>
          <svg-icon v-if="grid" class="mobile grid icon-tag" icon-class="tag2" :style="{left: 1 * index + 'rem', color: tag.color}" v-for="(tag,index) in item.tags.slice(0, 3)" :key="tag.tagId"/>
          <svg-icon v-else class="mobile list icon-tag" icon-class="tag2" :style="{color: tag.color}" v-for="tag in item.tags.slice(0, 1)" :key="tag.tagId"/>
        </div>
    </div>
    <div v-if="item.ossFolder && !public">
        <div v-if="pc">
          <el-tag v-if="!grid" size="small" class="pc list oss-folder">{{ item.ossPlatform }}</el-tag>
          <el-tag v-if="grid" size="small" class="pc grid oss-folder">{{ item.ossPlatform }}</el-tag>
        </div>
        <div v-else>
          <el-tag v-if="!grid" size="small" class="mobile list oss-folder">{{ item.ossPlatform }}</el-tag>
          <el-tag v-if="grid" size="small" class="mobile grid oss-folder">{{ item.ossPlatform }}</el-tag>
        </div>
    </div>
    <svg-icon v-if="item.isFolder" icon-class="folder"/>
    <div v-else-if="item.contentType && item.contentType.indexOf('video') > -1">
      <div v-if="item.mediaCover === undefined || item.mediaCover === 'true'">
        <div v-if="grid && pc" class="grid-play-icon">
          <svg-icon icon-class="play1"/>
        </div>
        <el-image lazy v-if="grid" :style="{'height':details?'110px':(gridWidth-50) + 'px'}" fit="contain"
                  :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="error" class="image-slot-error">
            <svg-icon icon-class="video"/>
          </div>
        </el-image>
        <el-avatar v-if="!grid" shape="square" fit="contain"
                   :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="default">
            <svg-icon class="avatar-default-image" icon-class="video"/>
          </div>
        </el-avatar>
      </div>
      <svg-icon v-else icon-class="video"/>
    </div>
    <div v-else-if="item.contentType && item.contentType.indexOf('audio') > -1">
      <div v-if="item.music !== undefined">
        <div v-if="item.music.name !== null">
          <el-image v-if="grid" :style="{'height':details?'110px':(gridWidth-50) + 'px'}" fit="contain"
                    :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="error" class="image-slot-error">
            <svg-icon icon-class="audio"/>
          </div>
        </el-image>
        <el-avatar v-if="!grid" shape="square"
                   :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="default">
            <svg-icon class="avatar-default-image" icon-class="audio"/>
          </div>
        </el-avatar>
        </div>
      </div>
      <svg-icon v-else icon-class="audio"/>
    </div>
    <div v-else-if="(item.contentType && item.contentType.startsWith('image')) || item.showCover">
      <el-image v-if="grid || grid === 'details'" :style="{'height':details?'110px':(gridWidth-35) + 'px'}"
                fit="contain" :src="item.fileId ? (imageUrl+item.fileId) : (imageUrl+item.id)">
        <div slot="error" class="image-slot-error">
          <svg-icon icon-class="image"/>
        </div>
      </el-image>

      <el-avatar v-if="!grid" shape="square"
                 :src="item.fileId ? (imageUrl+item.fileId) : (imageUrl+item.id)"></el-avatar>
    </div>
    <svg-icon v-else :icon-class="findIconClass"/>
  </div>
</template>
<script>
import {iconClass} from '@/utils/file-type'

export default {
  name: 'IconFile',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    audioCoverUrl: {
      type: String,
      default: ''
    },
    grid: {
      type: Boolean,
      default: false
    },
    gridWidth: {
      type: Number,
      default: 120
    },
    details: {
      type: Boolean,
      default: false
    },
    public: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      pc: window.pc,
    }
  },
  mounted() {
  },
  computed: {
    findIconClass() {
      let suffix = this.item.suffix;
      if (!suffix && this.item.fileName) {
        suffix = this.item.fileName.substring(this.item.fileName.lastIndexOf('.') + 1);
      }
      if (iconClass.has(suffix)) {
        return iconClass.get(suffix)
      }
      return 'file'
    },
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

.grid-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background: rgb(255 255 255 / 30%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(14px);
  border-radius: 50%;
  .svg-icon {
    font-size: 2rem !important;
  }
}

.avatar-default-image {
  height: 35px;
  width: 35px;
  line-height: 35px;
}

>>> .image-slot-error {
}

.icon-favorite {
  position: absolute;
  color: #f5222d;
  z-index: 1;
}

.pc.grid.icon-favorite {
  font-size: 1.5rem;
  left: 0;
  top: 0;
}

.mobile.grid.icon-favorite {
  width: 1.3rem;
  height: 1.3rem;
}

.pc.list.icon-favorite {
  font-size: 1rem;
  left: 1.5rem;
}

.mobile.list.icon-favorite {
  font-size: 0.5rem;
  margin-left: -1.5rem;
}

.icon-share {
  color: #52c41a;
  position: absolute;
  z-index: 1;
}

.pc.grid.icon-share {
  font-size: 1.5rem;
  right: 0;
  top: 0;
}

.mobile.grid.icon-share {
  width: 1.3rem;
  height: 1.3rem;
  margin-left: 2.8rem;
}

.pc.list.icon-share {
  font-size: 1rem;
  right: 1.3rem;
}

.mobile.list.icon-share {
  font-size: 0.5rem;
  margin-left: 0.5rem;
}

.icon-tag {
  color: #52c41a;
  position: absolute;
  z-index: 1;
}

.pc.grid.icon-tag {
  font-size: 14px;
  left: 0;
  bottom: 0;
}

.mobile.grid.icon-tag {
  width: 1rem;
  height: 1rem;
  left: 0;
  bottom: 1rem;
}

.pc.list.icon-tag {
  font-size: 12px;
  left: 10px;
  bottom: 10px;
}

.mobile.list.icon-tag {
  width: 1rem;
  height: 1rem;
  left: 0.5rem;
  bottom: 0.5rem;
}

.oss-folder {
  position: absolute;
}

.oss-folder {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.pc.grid.oss-folder {
  height: 14px;
  padding: 0 3px;
  line-height: 14px;
}

.pc.list.oss-folder {
  display: none;
}

.mobile.list.oss-folder {
  left: 85%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.mobile.grid.oss-folder {
  top: 40%;
  height: 12px;
  padding: 0 2px;
  line-height: 12px;
}

</style>
