<template>
    <div style="font-size: 12px;line-height: 60px;display: flex">
        <!--          收缩-->
        <div style="flex: 1;">
            <span :class="collapseBtnClass" style="cursor: pointer;font-size: 18px" @click="collapse"></span>
            <!--          导航显示栏-->
            <el-breadcrumb separator="/" style="display: inline-block;margin-left:10px" >
                <el-breadcrumb-item :to="{ path: '/' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-dropdown style="width:150px; cursor:pointer;text-align: right">
            <div style="display: inline-block">
                <img :src="user.avatar" alt="" style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
                <span>{{user.nickname}}</span><i class="el-icon-arrow-down" style="margin-left: 5px;"></i>
            </div>
            <!--            <i class="el-icon-setting" style="margin-right: 15px"></i>-->
            <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
                <el-dropdown-item style="font-size: 14px;padding: 5px 0">
                    <router-link to="/person">个人信息</router-link>
                </el-dropdown-item>
                <el-dropdown-item style="font-size: 14px;padding: 5px 0">
<!--                    退出需要清除信息，所以需要用到方法-->
                    <span style="text-decoration: none" @click="logout">退出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "HeaderView",
        props:{
            collapseBtnClass:String,
            collapse:'',
            user:Object
        },
        data(){
          return{
              //字符串解析成对象
              user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
          }
        },
        computed:{
            currentPathName () {
                return this.$store.state.currentPathName;　　//需要监听的数据
            }
        },
        watch: {
            currentPathName (newVal, oldVal) {
                console.log(newVal)
            }
        },
        methods:{
            // collapse(){
            //     this.$emit("asideCollapse")
            // },
            logout() {
                this.$router.push("/login")
                localStorage.removeItem("user")
                localStorage.removeItem("menus")
                this.$message.success("退出成功")
            }
        }
    }
</script>

<style scoped>

</style>