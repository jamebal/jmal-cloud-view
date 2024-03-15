<template>
  <di>
    <el-dialog :title='"将标签分配给 \"" + showName + "\""' style="{'font-weight': 600}" :visible.sync="tagDialogVisible" @close="tagDialogClose">
        <div class="tag-content">
          <el-tag
            :key="tag.name"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag.id)">

            <el-popover
              placement="bottom"
              trigger="hover">
              <sketch-picker
                v-model="colors"
                @input="updateColor($event, tag)"
              />
              <el-button slot="reference" size="small" class="button-tab-icon"><svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon></el-button>
            </el-popover>

            {{tag.name}}
          </el-tag>

          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitTag" v-loading="saveLoading">保存
        </el-button>
      </div>
    </el-dialog>
  </di>
</template>

<script>

import api from '@/api/file-api'
import { Sketch } from 'vue-color'

export default {
  name: "TagDialog",
  components: {
    'sketch-picker': Sketch
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tagDialogVisible: false,
      showName: '',
      inputVisible: false,
      inputValue: '',
      tags: [],
      defaultTagColor: '#f56c6c',
      saveLoading: false,
      colors: {
        hex: '#f56c6c',
      }
    }
  },
  watch: {
    status(visible) {
      if (visible) {
        if (this.fileList.length === 0) {
          return
        }
        // this.fileList里是有tags为undefined的情况,有则设置noTags为true
        let noTags = false
        this.fileList.forEach(file => {
          if (!file.tags) {
            noTags = true
          }
        })
        if (noTags) {
          this.tags = []
        } else {
          // 提取出fileList中每个file里相同的tags
          this.tags = this.fileList.map(item => item.tags).reduce((prev, next) => {
            return prev.filter(item => {
              return next.some(nextItem => nextItem.name === item.name)
            })
          })
        }
        this.showName = this.fileList.length + '项目'
        this.tagDialogVisible = true
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        // 是否有相同的标签
        let hasSameTag = this.tags.some(tag => tag.name === inputValue);
        if (hasSameTag) {
          this.$message.error('标签已存在');
          return;
        }
        this.tags.push({ name: inputValue, color: this.defaultTagColor});
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    tagDialogClose() {
      this.$emit('update:status', this.tagDialogVisible)
    },
    submitTag() {
      this.saveLoading = true
      // 提取出文件id
      const fileIdList = this.fileList.map(item => item.id)
      api.setTags({fileIds: fileIdList}, this.tags).then(() => {
        this.saveLoading = false
        this.$message.success('保存成功');
        this.$emit('onSuccess')
        this.tagDialogVisible = false
        this.tagDialogClose()
      }).catch(() => {
        this.saveLoading = false
      })
    },
    updateColor(color, tag) {
      // 更新tags
      this.tags.forEach(item => {
        if (item.name === tag.name) {
          item.color = color.hex
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

> > > .el-dialog {
  max-width: 500px;

  .el-dialog__title {
    font-weight: 600;
  }

  .el-tag {
    margin-left: 10px;
    margin-top: 10px;
  }
  .button-new-tag {
    margin-top: 10px;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-top: 10px;
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .button-tab-icon {
    padding: 2px 3px 2px 3px;
    border: 0;
    background: #00000000;
  }

  .el-loading-spinner .circular {
    width: 25px !important;
  }

}

</style>
