<template>
    <div>
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span='7'>
                    <el-input placeholder="请输入内容"  class="input-with-select" v-model='queryInfo.query' clearable @clear='getUserList'>
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='addDialogVisible = true'>添加用户</el-button>
                </el-col>
            </el-row>
            <el-table border stripe
                :data="userlist"
                style="width: 100%">
                <el-table-column type='index' label="#"></el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色">
                </el-table-column>
                <el-table-column
                    prop="mg_state"
                    label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change='userStateChanged(scope.row)'>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    width="180"
                    label='操作'>
                    <template slot-scope="scope" >
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click='removeUserById(scope.row.id)'></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click='setRole(scope.row)'></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close='addDialogClosed'
            width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
              <el-form-item label="用户名" prop='username'>
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop='password'>
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop='email'>
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop='mobile'>
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
          title="分配角色"
          :visible.sync="setRoleDialogVisible"
          width="50%">
          <div>
            <p>当前的用户:{{userInfo.username}}</p>
            <p>当前的角色:{{userInfo.role_name}}</p>
            <p>分配新角色:
               <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select></p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleSetting">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rules, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/;
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请密码的长度在3~10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
        ],
      },
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        } else {
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.getUserList()
        }
      })
    },
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async setRole(role) {
      this.userInfo = role
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
      console.log(this.userInfo);
    },
    async saveRoleSetting() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择新角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('设置角色失败')
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.selectedRoleId = ''
      this.setRoleDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-table{
    margin-top: 15px;
    font-size:12px;
}
.el-pagination{
    margin-top: 15px;
}
</style>
