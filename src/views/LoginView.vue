<template>
    <div class="wrapper">
        <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px;box-shadow: 0 0 25px #909399;
  background-color:rgba(255,255,255,0.9);">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
<!--            校验是否为空-->
            <el-form :model="user" :rules="rules" ref="userForm"><!--ref=userForm表单提交前进行校验-->
                <el-form-item prop="username">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user"
                              v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password
                              v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item style="margin: 10px 0; text-align: right">
                    <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>
                    <el-button type="primary" size="small" autocomplete="off" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {setRoutes} from "../router";

    export default {
        name: "LoginView",
        data() {
            return {
                user: {},
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},//blur--鼠标失焦触发校验
                        {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            login() {
                this.$refs['userForm'].validate((valid) => {//表单提交前校验
                    if (valid) {  // 表单校验合法
                        this.request.post("/user/login", this.user).then(res => {//post方法
                            if (res.code==='200') {
                                localStorage.setItem("user",JSON.stringify(res.data))//存储用户信息到本地浏览器
                                localStorage.setItem("menus",JSON.stringify(res.data.menus))//存储用户信息到本地浏览器
                                //动态设置路由
                                setRoutes();
                                this.$message.success("登录成功")

                                if(res.data.role==='普通用户'){//如果登录的是普通用户直接跳转到前台界面
                                    this.$router.push("/front/home")
                                }else {
                                    this.$router.push("/")//跳转时经过路由守卫
                                }
                            } else {
                                // this.$message.error("用户名或密码错误")
                                this.$message.error(res.msg)
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style>
    .wrapper {
        /*height: 100vh;*/
        /*background-image: linear-gradient(to bottom right, #FCF338, #32FBF9);*/
        background: url("../assets/picture/bc.jpg");
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;
        overflow: hidden;
    }
</style>