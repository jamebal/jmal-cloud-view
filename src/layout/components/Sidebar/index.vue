<template>
  <div :class="{ 'has-logo': showLogo }">

    <el-dialog class="dialog-cm" width="500px" title="修改标签" :close-on-click-modal="false" :visible.sync="dialogTagVisible" append-to-body>
      <el-form ref="managerForm" size="medium" :model="form" label-position="left" :rules="rules" label-width="95px">
        <el-form-item label="标签名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称"/>
        </el-form-item>
        <el-form-item label="标签颜色:" prop="color">
          <div class="form-tag-color">
            <svg-icon class="tag-color-icon" :style="{ color: tagColors.hex }" icon-class="tag2"></svg-icon>
            <sketch-picker v-model="tagColors"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTagVisible = false">取 消</el-button>
        <el-button size="small" native-type="submit" type="primary" :loading="tagUpdateLoading"
                   @click.native.prevent="updateTag">保 存
        </el-button>
      </div>
    </el-dialog>

    <div class="scrollbar-head">
      <logo v-if="showLogo" :collapse="isCollapse" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>

    <!--标签菜单-->
    <e-vue-contextmenu ref="contextShow" @ctx-show="show" @ctx-hide="hide">
      <div ref="contextShow" class="tag-menu">
        <ul>
          <li v-for="(item, index) in tagMenus" :key="item.label" @click="tagMenusOperation(item.operation)">
            <label class="menuitem">
              <svg-icon :icon-class="item.iconClass" />
              <span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
        </ul>
      </div>
    </e-vue-contextmenu>

    <div v-if="showTag && tagList.length > 0" class="scrollbar-tag" :class="{ collapse: isCollapse }">标签</div>
    <div class="scroll-decoration-top"></div>
    <el-scrollbar class="tag-list" wrap-class="scrollbar-wrapper">
      <div v-if="isCollapse">
        <ul class="infinite-list">
          <el-tooltip class="item"
            v-if="showTag"
            effect="dark"
            :content="tag.name"
            placement="right"
            v-for="tag in tagList"
            :key="tag.tagId"
          >
            <li class="infinite-list-item collapse" @click="tagClick(tag)">
              <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
            </li>
          </el-tooltip>
        </ul>
      </div>
      <div v-else  class="tag-drop-container">
        <ul class="infinite-list">
          <li v-for="tag in tagList" v-if="showTag" :key="tag.id"
            class="infinite-list-item"
            @click="tagClick(tag)"
          >
            <div class="tag-name-icon">
              <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
              <div class="tag-name">{{ tag.name }}</div>
            </div>
            <el-button slot="reference" class="btn-more" size="mini" icon="el-icon-more" @click.stop.prevent="clickTagMore(tag, $event)"></el-button>
          </li>
        </ul>
      </div>
    </el-scrollbar>
    <div class="scroll-decoration-bottom"></div>
    <div class="scrollbar-footer">
      <div class="quota-space">
        <el-progress
          v-show="percentage > 0"
          :class="{ collapse: isCollapse }"
          :percentage="percentage"
          :format="progressFormat"
          :color="customColors"
        ></el-progress>
      </div>
      <div class="webdav">
        <div
          :class="{ normal: true, collapse: isCollapse }"
          @mousemove="showCopyBtn = true"
          @mouseleave="showCopyBtn = false"
        >
          <svg-icon class="webdav-icon" icon-class="disk-drive"></svg-icon>
          <div class="wedav-text">WebDAV</div>
          <el-tooltip placement="right" v-if="showCopyBtn">
            <div slot="content">{{ $t('app.clickCopyWebDAVAddress') }}<br />{{ webdavUrl }}</div>
            <svg-icon
              class="copy-btn"
              icon-class="menu-fuzhi"
              @click="copyWebDAVLink('.copy-btn')"
              :data-clipboard-text="webdavUrl"
            ></svg-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadImageInput from '@/components/input/UploadImageInput.vue'
import Sortable from 'sortablejs'
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {formatSize} from "@/utils/number";
import fileConfig from "@/utils/file-config";
import Clipboard from "clipboard";
import tagApi from '@/api/tag'
import AppLink from './Link'
import { Sketch } from 'vue-color'

export default {
  components: { UploadImageInput, SidebarItem, Logo, AppLink , 'sketch-picker': Sketch },
  data() {

    const checkTagName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标签名称'));
      } else if (/[\[\]\/\\"<>?*]/gi.test(value)) {
        callback(new Error('标签名称不能包含这些字符:<,>,|,*,?,,/,[,]'));
      } else {
        callback();
      }
    };

    return {
      percentage: 0,
      customColors: [
        {color: '#f56c6c', percentage: 150},
        {color: '#f56c6c', percentage: 100},
        {color: '#e6a23c', percentage: 80},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 40},
        {color: '#6f7ad3', percentage: 20}
      ],
      showCopyBtn: false,
      takeUpSpace: 0,
      tagList: [],
      showTag: false,
      tagMenus: [
        { iconClass: 'menu-rename', label: '修改', operation: 'update' },
        { iconClass: 'menu-remove', label: '删除', operation: 'delete' }
      ],
      contextTag: {},
      tagMenusHideTime: 0,
      dialogTagVisible: false,
      form: {
        tagId: '',
        name: '',
      },
      tagColors: {
        hex: '#f56c6c',
      },
      rules: {
        name: [
          { validator: checkTagName, trigger: 'blur' },
        ]
      },
      tagUpdateLoading: false
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters([
      'sidebar',
      'name',
      'userInfo'
    ]),
    webdavUrl() {
      return fileConfig.webDAVUrl(this.name)
    },
    routes() {
      let routes = []
      if(this.$route.meta.menuType === 0){
        this.$router.options.routes.forEach(route => {
          if(route.menuType === 0){
            routes.push(route)
          }
        })
      } else {
        this.$router.options.routes.forEach(route => {
          if(route.menuType === 2){
            routes.push(route)
          }
        })
      }
      return routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    isCollapse(val){
    },
    $route(to) {
      this.showTag = to.meta !== undefined && to.meta.menuType !== undefined && to.meta.menuType === 0;
    },
    message(msg) {
      if (msg.event === 'msg/file/change') {
        this.onmessage(msg.data)
        if (msg.data.url === 'updateTags') {
          this.setTagListData(msg.data.body)
        }
      }
    },
  },
  mounted() {
    this.getTagList()

    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.tagDrop()

  },
  methods: {
    getTagList() {
      if (this.$route.meta.menuType === 0) {
        this.showTag = true
      } else {
        this.showTag = false
        return
      }
      tagApi.tagList({userId: this.$store.state.user.userId}).then(res => {
        this.setTagListData(res.data)
      })
    },
    // tag拖拽
    tagDrop() {
      const tagList = document.querySelector('.tag-drop-container > .infinite-list')
      if (!tagList) return
      const _this = this
      Sortable.create(tagList, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tagList.splice(oldIndex, 1)[0]
          _this.tagList.splice(newIndex, 0, currRow)

          let tagIdList = []
          _this.tagList.forEach(tag => {
            tagIdList.push(tag.id)
          })

          tagApi.setTagSort(tagIdList).then(()=>{
            _this.$message.success('标签顺序已更新');
          }).catch(() => {
          })
        }
      })
    },
    setTagListData(tagList) {
      this.tagList = tagList
      this.showTag = this.tagList.length > 0
    },
    onmessage(msg) {
      const takeUpSpace = msg.space
      if (takeUpSpace) {
        this.takeUpSpace = takeUpSpace
        const space = takeUpSpace/1024/1024/1024
        const percentage = Number((space/this.userInfo.quota * 100).toFixed(1))
        this.percentage = percentage > 100 ? 100 : percentage
      }
    },
    copyWebDAVLink(className) {
      let clipboard = new Clipboard(className)
      clipboard.on('success', e => {
        this.$message({message: '复制成功', type: 'success', duration: 1000})
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({message: '该浏览器不支持自动复制', type: 'warning', duration: 1000})
        clipboard.destroy()
      })
    },
    tagClick(tag) {
      this.$router.push(`/tag?tagId=${tag.id}`);
    },
    clickTagMore(tag, event) {
      this.contextTag = tag
      event.stopPropagation()
      if (new Date().getTime() - this.tagMenusHideTime < 10) {
        return
      }
      const e = {}
      e.pageX = event.pageX + 5
      e.pageY = event.pageY + 2
      e.clientX = event.clientX + 5
      e.clientY = event.clientY + 2
      this.$refs.contextShow.showMenu(event)
    },
    tagMenusOperation(operation) {
      if (operation === 'update') {
        this.$refs.contextShow.hideMenu()
        this.form.name = this.contextTag.name
        this.form.tagId = this.contextTag.id
        this.tagColors.hex = this.contextTag.color
        this.dialogTagVisible = true
      } else if (operation === 'delete') {
        this.$refs.contextShow.hideMenu()
        this.$confirm('此操作将永久删除该标签, 是否继续?', `删除标签: ${this.contextTag.name}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          tagApi.deleteFileTag({ tagId: this.contextTag.id }).then(() => {
            this.getTagList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
        })
      }
    },
    updateTag() {
      this.$refs.managerForm.validate((valid) => {
        if (valid) {
          this.tagUpdateLoading = true
          this.form.color = this.tagColors.hex
          tagApi.updateFileTag(this.form).then(() => {
            this.dialogTagVisible = false
            this.tagUpdateLoading = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }).catch(() => {
            this.tagUpdateLoading = false
          })
        }
      })
    },
    show() {
    },
    hide() {
      this.tagMenusHideTime = new Date().getTime()
    },
    progressFormat() {
      if (this.takeUpSpace === 0) {
        this.takeUpSpace = this.userInfo.takeUpSpace
      }
      const quota = this.userInfo.quota
      const space = this.takeUpSpace/1024/1024/1024
      if(space && quota > 0){
        const percentage = Number((space/quota * 100).toFixed(5))
        this.percentage = percentage > 100 ? 100 : percentage
        if(this.isCollapse){
          return `${formatSize(this.takeUpSpace)}`
        } else {
          return `${formatSize(this.takeUpSpace)}/${quota}GB`
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

>>> .ctx-menu-container {
  border: 0 solid rgba(0, 0, 0, 0);
  min-width: unset;
}

.tag-menu ul {
  list-style: none;
  padding-inline-start: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0 5px;
}
.tag-menu li {
  cursor: pointer;
  margin: 0;
  padding: 0;
  min-width: 110px;
}
.tag-menu li:hover {
  cursor: pointer;
  border-radius: 5px;
  background-color: #409eff30;
}
.tag-menu li > .menuitem {
  cursor: pointer;
  line-height: 28px;
  margin-left: 10px;
}
.tag-menu li > .menuitem > .text {
  cursor: pointer;
  font-weight: normal;
}
.tag-menu li > .menuitem > .svg-icon {
  cursor: pointer;
  margin-right: 8px !important;
}

.sidebar-container.has-logo {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scrollbar-tag {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: 900;
    color: #a4a4a4;
  }
  .scrollbar-tag.collapse {
    padding-left: unset;
    text-align: center;
  }
  .tag-list {
    overflow-y: auto;
    flex: 1;
    .infinite-list {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .infinite-list-item {
      height: 30px;
      line-height: 30px;
      padding: 0 5px 0 5px;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      margin: 0 5px 0 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .tag-name-icon {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tag-name {
          width: 90px;
          white-space: nowrap; /* 强制单行显示 */
          overflow: hidden; /* 隐藏溢出的内容 */
          text-overflow: ellipsis; /* 添加省略号 */
        }
      }

      .btn-more {
        display: none;
        padding: 2px 5px;
        background: #eaeaea;
        border: 0;
      }

      .svg-icon {
        margin-right: 12px !important;
      }
      .el-button:hover {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
      &:hover {
        background-color: #eaeaea !important;
        border-radius: 4px;
        .btn-more {
          display: block;
        }
      }
    }
    .infinite-list-item.collapse {
      padding-left: unset;
      text-align: center;
      .svg-icon {
        margin-right: unset !important;
      }
    }
  }
  .scrollbar-footer {
    margin-top: 15px;
  }
}
.scrollbar-head {
  .el-scrollbar {
    padding-bottom: 15px;
  }
  >>> .submenu-title-noDropdown {
    padding-left: 15px !important;
    padding-right: 10px !important;
  }
  >>> .el-submenu__title {
    padding-left: 15px !important;
    padding-right: 10px !important;
    .el-submenu__icon-arrow {
      right: 15px;
    }
  }
  >>> .nest-menu {
    .el-menu-item {
      padding-left: 25px !important;
      padding-right: 20px !important;
      min-width: unset;
    }
  }
}
.quota-space {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  >>> .el-progress-bar {
    padding-right: 40px;
    margin-left: 20px;
  }
  >>> .el-progress__text {
    margin-left: 20px;
    font-size: 12px !important;
  }
  .collapse {
    >>> .el-progress-bar {
      padding-right: 4px;
      margin-left: 2px;
    }
    >>> .el-progress__text {
      margin-left: 5px;
      display: block;
    }
  }
}
.webdav {
  .normal {
    font-size: 1.5rem;
    height: 46px;
    display: flex;
    line-height: 46px;
    padding-left: 20px;
    .webdav-icon {
      margin-top: 12px;
      margin-right: 0 !important;
    }
    .copy-btn {
      margin-top: 10px;
      margin-right: 0 !important;
      margin-left: 16px;
    }
    .copy-btn:hover {
      cursor: pointer;
    }
    .wedav-text {
      font-size: 12px;
      margin-left: 20px;
      cursor: default;
    }
  }
  .collapse {
    padding-left: 15px;
    .wedav-text {
      display: none;
    }
    .copy-btn {
      display: none;
    }
  }
}
.blue-background-class {
  background-color: rgba(64, 158, 255, 0.82);
  border-radius: 4px;
}
.form-tag-color {
  display: flex;
  .svg-icon {
    font-size: 36px;
    margin-right: 20px;
  }
}
</style>
