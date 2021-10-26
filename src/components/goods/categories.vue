<template>
    <div>
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-button type='primary' @click='showAddCateDialog'>添加分类</el-button>
            </el-row>
            <tree-table
            :data='cateList'
            :columns='columns'
            :selection-type='false'
            :expand-type='false'
            :show-index='true'
            border>
                <template slot='isok' slot-scope="scope">
                    <i class='el-icon-success' v-if='scope.row.cat_deleted === false'
                    style='color:lightgreen;'></i>
                    <i class='el-icon-error' v-else style='color:red;'></i>
                </template>
                <template slot='order' slot-scope='scope'>
                    <el-tag v-if='scope.row.cat_level === 0' size="mini">一级</el-tag>
                    <el-tag type='success' size='mini' v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type='warning' size='mini' v-else>三级</el-tag>
                </template>
                <template slot='opt'>
                    <el-button type='primary' icon='el-icon-edit' size="mini">编辑</el-button>
                    <el-button type='danger' icon='el-icon-delete' size="mini">删除</el-button>
                </template>
            </tree-table>
        </el-card>
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%">
            <el-form :model='addCateForm'
            :rules='addCateFormRules' ref='addCateFormRef'
            label-width="100px">
                <el-form-item label='活动名称' prop='cat_name'>
                    <el-input v-model='addCateForm.cat_name'></el-input>
                </el-form-item>
                <el-form-item label='父级分类:'>
                    <el-cascader
                    :options='parentCateList'
                    :props="cascaderProps"
                    v-model='selectedKeys'
                    @change='parentCateChange'
                    collapse-tags
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: ''
      },
      addCateFormRules: {
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$http.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    async showAddCateDialog() {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange() {
    }
  }
}
</script>
<style lang="less" scoped>
</style>
