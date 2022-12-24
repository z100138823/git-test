<template>
    <div class="wrapper">
        <div style="margin: 200px auto; background-color: #fff; width: 400px; height: 400px; padding: 20px; border-radius: 10px; box-shadow: 0 0 25px #909399;
  background-color:rgba(255,255,255,0.9);">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>注 册</b></div>
<!--            校验是否为空-->
            <el-form :model="user" :rules="rules" ref="userForm"><!--ref=userForm表单提交前进行校验-->
                <el-form-item prop="username">
                    <el-input placeholder="请输入账号" size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input placeholder="请确认密码" size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item style="margin: 10px 0; text-align: right">
                    <el-button type="primary" size="small" autocomplete="off" @click="login">确定注册</el-button>
                    <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/login')">返回登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
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
                    confirmPassword: [
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
                        if(this.user.password != this.user.confirmPassword){
                            this.$message.error("两次输入密码不一致")
                            return false
                        }
                        this.request.post("/user/register", this.user).then(res => {//post方法
                            if (res.code==='200') {
                                this.$message.success("注册成功")
                                this.$router.push('/login')
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
        background: url("../assets/picture/bc3.jpg");
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;
        overflow: hidden;
    }
</style>