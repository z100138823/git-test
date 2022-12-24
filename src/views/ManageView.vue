<template>
  <div style="height:100%">
    <el-container style="height: 100vh;">
<!--      侧边栏-->
      <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246); height: 100%;box-shadow: 2px 0 6px rgb(0 21 41/35%)">
        <AsideView :isCollapse="isCollapse" :logoTextShow="logoTextShow" />
      </el-aside>

<!--      左侧显示框-->
      <el-container>
<!--      主显示页顶栏-->
        <el-header style="border-bottom:1px solid #ccc;">
          <HeaderView :collapseBtnClass="collapseBtnClass" :collapse="collapse" :user="user"/>
        </el-header>

<!--        主显示页数据框-->
        <el-main>
<!--          <el-breadcrumb separator="/">-->
<!--              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
<!--              <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>-->
<!--              <el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
<!--              <el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->

<!--          当前页面的子路由会在页面展示-->
          <router-view @refreshUser="getUser"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import AsideView from "../components/AsideView";
import HeaderView from "../components/HeaderView";

export default {
  name: 'HomeView',
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse:false,
      sideWidth:200,
      logoTextShow:true,
      // user: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
      user: {}
    }
  },
  created() {
      //请求分页查询数据
    // fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize).then(res=>res.json()).then(res=>{
    //     console.log(res)
    //     this.tableData=res.userData
    //     this.total=res.total
    // })

    // this.load()

    //一开始就从后台获取数据
    this.getUser()
  },
  components:{
      AsideView,
      HeaderView
  },
  methods:{
    collapse(){//点击收缩/展开按钮触发
      this.isCollapse=!this.isCollapse
      if(this.isCollapse){//收缩
        this.sideWidth=64
        this.collapseBtnClass='el-icon-s-unfold'
        this.logoTextShow=false
      }else {//展开
        this.sideWidth=200
        this.collapseBtnClass='el-icon-s-fold'
        this.logoTextShow=true
      }
    },
    getUser(){
      let username=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      //通过axios获取user后台信息
      this.request.get("user/username/"+username).then(res=>{
          //重新赋值后台的最新User数据
        this.user=res.data//数据中有menus
        console.log(this.user.menus)
      })
    }
  }
}
</script>

<style>
  /*.el-header {*/
  /*  background-color: #B3C0D1;*/
  /*  color: #333;*/
  /*  line-height: 60px;*/
  /*}*/

  /*.el-aside {*/
  /*  color: #333;*/
  /*}*/


</style>