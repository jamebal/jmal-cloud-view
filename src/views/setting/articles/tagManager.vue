<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-cm" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="managerForm" :model="form" label-position="left" :rules="rules" label-width="85px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="标签缩略名" prop="slug">
          <el-input v-model="form.slug" style="width: 100%;"/>
          <div class="instruction">标签缩略名用于创建友好的链接形式, 如果留空则默认使用标签名称.</div>
        </el-form-item>
        <el-form-item label="标签背景" prop="categoryBackground">
          <el-input type="textarea" v-model="form.tagBackground" :autosize="{ minRows: 2, maxRows: 6 }"/>
          <div class="instruction">在这里填入图片的URL地址, 以在该标签页面显示一个背景大图.</div>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" :loading="tagUpdateLoading"
                     @click.native.prevent="onSave('managerForm')">保 存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="clearfix">
          <div class="card-header content-title"><span>{{ title }}</span> </div>
          <el-button class="card-button" size="mini" type="primary" @click="add()">新增标签</el-button>
        </div>
        <div class="card-header-right">
          <el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="selectAll">全选</el-checkbox>
          <el-button :disabled="this.multipleSelection.length !== 1" size="small" @click="handleEdit()">编辑</el-button>
          <el-button :disabled="this.multipleSelection.length === 0" size="small" type="danger" @click="handleDelete()">删除</el-button>
        </div>
      </div>
      <div>
        <el-checkbox-group v-model="multipleSelection" size="small" @change="handleCheckTagChange">
          <el-checkbox v-for="tag in tags" :key="tag.id" class="tag-checkbox" :label="tag.id" border>
            {{tag.name}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>

  </div>
</template>

<script>
import tagApi from "@/api/tag";
import categoryApi from "@/api/category";

export default {
  name: 'tagManager',
  data() {
    return {
      title: "标签管理",
      dialogVisible: false,
      dialogTitle: '',
      tagUpdateLoading: false,
      form: {
        name: '',
        slug: '',
        tagBackground: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入标签名称', trigger: 'blur'},
        ]
      },
      tags: [],
      editMove: 1,// 1添加,2修改
      tagGroup: [],
      multipleSelection: [],
      checkAll: false,
      isIndeterminate: false,
    }
  },
  computed: {},
  mounted() {
    this.getTags()
  },
  methods: {
    getTags() {
      tagApi.tagList().then(res => {
        this.tags = res.data
      })
    },
    handleCheckTagChange(value) {
      console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tags.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tags.length;
    },
    selectAll(value) {
      if(value){
        this.tags.forEach(tag => {
          this.multipleSelection.push(tag.id)
        })
      } else {
        this.multipleSelection = []
      }
      this.isIndeterminate = false
    },
    handleEdit() {
      this.editMove = 2
      this.dialogVisible = true
      this.dialogTitle = '修改标签'
       tagApi.tagInfo({
        tagId: this.multipleSelection[0]
      }).then(res => {
        this.form = res.data
      })
    },
    // 删除标签
    handleDelete() {
      let tagIds = this.multipleSelection
      this.$confirm('您确定要删除这些标签吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tagApi.delete({tagIds: tagIds}).then(() => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.multipleSelection = []
          this.isIndeterminate = false
          this.getTags()
        }).catch(() => {
          this.onError()
        })
      })
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
    // 保存
    onSave() {
      this.$refs.managerForm.validate((valid) => {
        this.valid = valid
        if (valid) {
          this.tagUpdateLoading = true
          if (this.editMove === 1) {
            this.addTag(this.setFormData())
          }
          if (this.editMove === 2) {
            this.updateTag(this.setFormData())
          }
        } else {
          return false;
        }
      })
    },
    // 修改标签
    updateTag(data) {
      tagApi.update(data).then(() => {
        this.onSuccess()
      }).catch(() => {
        this.onError()
      })
    },
    // 添加标签
    addTag(data) {
      tagApi.add(data).then(() => {
        this.onSuccess()
      }).catch(() => {
        this.onError()
      })
    },
    async add() {
      this.dialogVisible = true
      this.dialogTitle = '添加标签'
      this.editMove = 1
      await this.$nextTick()
      this.$refs.managerForm.resetFields()
    },
    onError() {
      this.tagUpdateLoading = false
    },
    onSuccess(message) {
      this.getTags()
      let msg = '保存成功!'
      if (message) {
        msg = message
      }
      this.tagUpdateLoading = false
      this.dialogVisible = false
      this.$message({
        message: msg,
        type: 'success',
        duration: 1000
      })
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
/deep/ .tag-checkbox {
  .el-checkbox__inner {
    display: none;
  }
  .el-checkbox__label {
    padding-left: 5px;
  }
}
/deep/ .el-checkbox {
  margin-right: 0;
}
/deep/ .el-checkbox.is-bordered {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
/deep/ .el-checkbox.is-bordered.is-checked {
  background-color: #ecf5ff;
  border-color: #40a9ff;
  color: #d9ecff;
}
/deep/ .el-icon-edit:hover {
  color: #40a9ff;
}
.check-all {
  margin-right: 20px;
}
</style>
