<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-cm" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="managerForm" :model="form" label-position="left" :rules="rules" label-width="85px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="分类缩略名" prop="thumbnailName">
          <el-input v-model="form.thumbnailName" style="width: 100%;" placeholder="分类缩略名用于创建友好的链接形式."/>
        </el-form-item>
        <el-form-item label="父级分类" prop="parentCategoryId">
          <el-cascader
            v-model="form.parentCategoryId"
            placeholder="不选择"
            :options="categories"
            :show-all-levels="false"
            :props="{ checkStrictly: true }"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"/>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :loading="categoryUpdateLoading"
                     @click.native.prevent="onSave('managerForm')">保 存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="clearfix">
          <div class="card-header-back" v-if="parentCategory.name">
            <span class="header-back-title" @click="backParent">
              <i class="el-icon-back"></i>
              <span>返回上级目录</span>
            </span>
            <el-divider direction="vertical"></el-divider>
          </div>
          <div class="card-header content-title"><span>{{ parentCategory.name ? `管理 ${parentCategory.name} 的子分类` : '管理分类' }}</span> </div>
          <el-button class="card-button" size="mini" type="primary" @click="add()">新增分类</el-button>
        </div>
        <div class="card-header-right" v-show="this.multipleSelection.length > 0">
          <el-button v-show="this.multipleSelection.length === 1" size="small" @click="handleEdit()">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete()">删除</el-button>
        </div>
      </div>
      <el-table
        :data="categoryList"
        stripe
        @selection-change="handleSelectionChange"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="subCategorySize"
          label="子分类">
          <template slot-scope="scope">
            <a v-if="scope.row.subCategorySize > 0"
               @click="subCategoryList(scope.row.id)">{{ scope.row.subCategorySize }}个分类</a>
            <a v-else @click="add(scope.row.id)">新增</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="thumbnailName"
          label="缩略名">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="默认">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault">默认</span>
            <a v-if="!scope.row.isDefault && scope.row.id === cellMouseIndexId" @click="setDefault(scope.row)">默认</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="quota"
          label="文章数">
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import categoryApi from "@/api/category";

export default {
  name: 'categoryManager',
  data() {
    return {
      title: "分类管理",
      categoryList: [],
      dialogVisible: false,
      dialogTitle: '',
      categoryUpdateLoading: false,
      valid: true,
      categories: [],
      parentCategory: {},// 父级分类信息
      parentCategoryId: undefined,
      form: {
        name: '',
        thumbnailName: '',
        parentCategoryId: '',
        desc: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ]
      },
      editMove: 1,// 1添加,2修改
      multipleSelection: [],
      cellMouseIndexId: ''
    }
  },
  computed: {},
  mounted() {
    this.getCategories()
    this.getParentCategory()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 返回父级分类
    backParent() {
      this.subCategoryList(this.parentCategory.parentCategoryId)
    },
    getParentCategory() {
      if (this.$route.query.parent) {
        categoryApi.categoryInfo({
          categoryId: this.$route.query.parent
        }).then(res => {
          this.parentCategory = res.data
        })
      } else {
        this.parentCategory = {}
      }
    },
    getCategories() {
      categoryApi.categories({
        userId: this.$store.state.user.userId,
        parentCategoryId: this.$route.query.parent
      }).then(res => {
        this.categoryList = res.data
      })
    },
    categoryTree() {
      categoryApi.categoryTree({userId: this.$store.state.user.userId}).then(res => {
        this.categories = res.data
      })
    },
    // 子分类列表
    subCategoryList(parentCategoryId) {
      if (parentCategoryId) {
        this.$router.push(`${window.location.pathname}?parent=${parentCategoryId}`)
      } else {
        this.$router.push(window.location.pathname)
      }
      this.getCategories()
      this.getParentCategory()
    },
    async add(parentCategoryId) {
      this.categoryTree()
      this.dialogVisible = true
      this.dialogTitle = '添加分类'
      this.editMove = 1
      await this.$nextTick()
      this.$refs.managerForm.resetFields()
      if (this.$route.query.parent) {
        this.form.parentCategoryId = this.$route.query.parent;
      }
      if (parentCategoryId) {
        this.form.parentCategoryId = parentCategoryId;
      }
    },
    // 设置formData
    setFormData() {
      let data = new FormData();
      for (let formKey in this.form) {
        if (this.form.hasOwnProperty(formKey) && this.form[formKey]) {
          data.append(formKey, this.form[formKey])
        }
      }
      return data
    },
    // 设为默认
    setDefault(row) {
      categoryApi.setDefault({categoryId: row.id}).then(() => {
        this.getCategories()
        this.$message({
          message: `${row.name} 已经被设为默认分类`,
          type: 'success',
          duration: 1500
        })
      }).catch(() => {

      })
    },
    // 保存
    onSave() {
      this.$refs.managerForm.validate((valid) => {
        this.valid = valid
        if (valid) {
          this.categoryUpdateLoading = true
          if (this.editMove === 1) {
            this.addCategory(this.setFormData())
          }
          if (this.editMove === 2) {
            this.updateCategory(this.setFormData())
          }
        } else {
          return false;
        }
      });
    },
    handleEdit() {
      this.editMove = 2
      this.dialogVisible = true
      this.dialogTitle = '修改分类'
      categoryApi.categoryInfo({
        categoryId: this.multipleSelection[0].id
      }).then(res => {
        this.form = res.data
      })
      this.categoryTree()
    },
    // 删除分类
    handleDelete() {
      let categoryIds = []
      this.multipleSelection.forEach(category => {
        categoryIds.push(category.id)
      })
      this.$confirm('所选分类下的所有内容都将被删除, 您确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        categoryApi.delete({categoryIds: categoryIds}).then(() => {
          this.onDeleted()
        }).catch(() => {
          console.log('sdf')
          this.onError()
        })
      })
    },
    // 修改分类
    updateCategory(data) {
      categoryApi.update(data).then(() => {
        this.onSuccess()
      }).catch(() => {
        this.onError()
      })
    },
    // 添加分类
    addCategory(data) {
      if (!this.form.hasOwnProperty('userId')) {
        data.append('userId', this.$store.state.user.userId)
      }
      categoryApi.add(data).then(() => {
        this.onSuccess()
      }).catch(() => {
        this.onError()
      })
    },
    onDeleted(){
      this.$notify({
        title: '删除成功',
        type: 'success',
        duration: 1000
      })
      this.getCategories()
    },
    onSuccess(message) {
      this.getCategories()
      let msg = '保存成功!'
      if (message) {
        msg = message
      }
      this.categoryUpdateLoading = false
      this.dialogVisible = false
      this.$message({
        message: msg,
        type: 'success',
        duration: 1000
      })
    },
    onError() {
      this.categoryUpdateLoading = false
    },
    // 单元格hover进入时事件
    cellMouseEnter(row) {
      this.cellMouseIndexId = row.id
    },
    // 单元格hover退出时事件
    cellMouseLeave() {
      this.cellMouseIndexId = ''
    },
  }
}
</script>

<!--<style src="@styles/cropper.css"></style>-->
<style lang="scss" scoped>
@import "src/styles/setting";
.content-title {
  font-size: 16px;
  font-weight: 600;
}
/deep/ .el-page-header {
  height: 32px;
  line-height: 32px;
}

</style>
