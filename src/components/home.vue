<template>
  <el-container class='home-container'>
    <el-header>
        <div>
            <img src='../assets/heima.png'>
            <span>电商后台管理系统</span>
            <span>hello</span>
        </div>
        <el-button type='info' @click="logout">退出</el-button></el-header>
    <el-container>
        <el-aside :width="isCollapse ?'64px':'200px'">
            <div class='toggle-button' @click="toggleCollapse">|||</div>
             <el-menu
                :unique-opened='true'
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                :collapse="isCollapse"
                :collapse-transition='false'
                router
                :default-active="activePath"
                >
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <template slot="title">
                    <i :class="iconlist[item.id]"></i>
                    <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="'/'+item1.path" v-for='item1 in item.children' :key='item1.id' @click="saveNavState('/'+item1.path)">
                        <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{item1.authName}}</span>
                    </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconlist: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shujutongji'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content:space-between;
    padding-left:0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;
        span{
            margin-left:15px ;
        }
    }
}
.el-aside{
    background-color: #333734;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #EAEFF1;
}
.iconfont{
    margin-right:10px;
}
.toggle-button{
    background-color:#4A5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
