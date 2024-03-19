<template>
  <di>
    <message-dialog
      title="确认信息"
      content="检测到未保存的内容，是否在离开前保存修改？"
      :show.sync="isSaveDialogVisible"
      operatButtonText="放弃修改"
      confirmButtonText="保存"
      @operating="closeConfirmDialog"
      @confirm="confirmUpdate"
    >
    </message-dialog>
    <el-dialog :title='"将标签分配给 \"" + showName + "\""' style="{'font-weight': 600}" :visible.sync="tagDialogVisible" :before-close="beforeClose" @close="tagDialogClose">
        <div class="tag-content">
          <el-tag
            :key="tag.name"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag.name)">

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

          <div class="tag-list">
            <p v-if="existingTags.length > 0">现有标签: </p>
           <el-button
             v-if="!isEditMode"
             size="small"
             :key="tag.name"
             v-for="tag in existingTags"
             @click="addTag(tag)">
             <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
             {{tag.name}}
           </el-button>
            <div v-if="isEditMode">
              <el-tag
                :key="tag.name"
                v-for="tag in existingTags"
                :closable="isEditMode"
                :disable-transitions="false"
                @close="handleCloseCurrentTags(tag.name)">
                <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
                {{tag.name}}
              </el-tag>
            </div>
          </div>

        </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="existingTags.length > 0 || isEditMode" size="small" @click="editMode" >{{ isEditMode ? '取消编辑' : '编辑现有标签' }}</el-button>
        <el-button size="small" type="primary" @click="submitTag" v-loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>
  </di>
</template>

<script>

import fileApi from '@/api/file-api'
import tagApi from '@/api/tag'
import { Sketch } from 'vue-color'
import MessageDialog from "@/components/message/MessageDialog.vue";

export default {
  name: "TagDialog",
  components: {
    MessageDialog,
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
      existingTags: [],
      tagList: [],
      defaultTagColor: '#f56c6c',
      saveLoading: false,
      colors: {
        hex: '#f56c6c',
      },
      isEditMode: false,
      remoteTagIdList: [],
      isSaveDialogVisible: false,
      hasChange: false,
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

        // 加载已有标签列表
        tagApi.tagList({userId: this.$store.state.user.userId,}).then(res => {
          this.tagList = res.data
          this.updateExistingTags()
        })

        if (this.fileList.length === 1) {
          this.showName = this.fileList[0].name
        } else {
          this.showName = this.fileList.length + '项目'
        }
        this.tagDialogVisible = true
      }
    }
  },
  methods: {
    updateExistingTags() {
      this.existingTags = this.tagList.filter(item => {
        return !this.tags.some(tag => tag.name === item.name)
      })
    },
    handleClose(tagName) {
      // 删除tags, 找出tags中的tag.name, 删除
      // 找出tags中的tag.name的索引
      let index = this.tags.findIndex(item => item.name === tagName)
      this.tags.splice(index, 1)
      this.updateExistingTags()
    },
    handleCloseCurrentTags(tagName) {
      let index = this.existingTags.findIndex(item => item.name === tagName)
      const removeTag = this.existingTags.splice(index, 1)
      this.remoteTagIdList.push(removeTag[0].id)
      this.hasChange = true
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
        this.hasChange = true
        this.tags.push({ name: inputValue, color: this.defaultTagColor});
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    addTag(tag) {
      this.hasChange = true
      // 是否有相同的标签
      this.tags.push({ name: tag.name, color: tag.color });
      this.updateExistingTags()
    },
    closeConfirmDialog() {
      this.isSaveDialogVisible = false
      this.hasChange = true
      this.tagDialogClose();
    },
    beforeClose(done) {
      if (this.hasChange) {
        this.isSaveDialogVisible = true
      } else {
        done()
        this.isSaveDialogVisible = false
      }
    },
    tagDialogClose() {
      this.tagDialogVisible = false
      this.$emit('update:status', this.tagDialogVisible)
      this.isEditMode = false
    },
    editMode() {
      this.isEditMode = !this.isEditMode
      if (!this.isEditMode) {
        this.remoteTagIdList = []
      }
      this.updateExistingTags()
    },
    confirmUpdate() {
      this.submitTag()
    },
    submitTag() {
      this.saveLoading = true
      // 提取出文件id
      const fileIdList = this.fileList.map(item => item.id)
      fileApi.setTags({fileIds: fileIdList, tagList: this.tags, removeTagIds: this.remoteTagIdList}).then(() => {
        this.saveLoading = false
        this.$message.success('保存成功');
        this.$emit('onSuccess')
        this.hasChange = false
        this.tagDialogVisible = false
        this.isSaveDialogVisible = false
        this.tagDialogClose()
      }).catch(() => {
        this.saveLoading = false
      })
    },
    updateColor(color, tag) {
      this.hasChange = true
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
    margin-left: 5px;
    margin-top: 5px;
  }
  .button-new-tag {
    margin-top: 5px;
    margin-left: 5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-top: 5px;
    margin-left: 5px;
    width: 90px;
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

  .tag-list {
    p {
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .el-button {
      margin-left: 5px;
      margin-top: 5px;
    }
    .el-button+.el-button {
      margin-left: 5px;
    }
  }

}

</style>
