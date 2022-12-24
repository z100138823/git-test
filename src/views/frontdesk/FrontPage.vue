<template>
    <div>
        <div style="display: flex;height: 60px;line-height: 60px;border-bottom: 1px solid #ccc">
            <div style="width: 300px;display: flex;padding-left: 30px">
                <div style="width: 60px">
                    <img src="../../assets/logo1.png" alt="" style="width: 50px;position: relative;top:5px;right: 0">
                </div>
                <div style="flex: 1">前台</div>
            </div>

            <div style="flex: 1">
                <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal" router>
                    <el-menu-item index="/front/home">处理中心</el-menu-item>
                    <el-menu-item index="/front/video">播放视频</el-menu-item>
                    <el-menu-item index="/front/comment">评论区</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">工作台</template>
                        <el-menu-item index="/front/message">历史浏览</el-menu-item>
                        <el-menu-item index="2-1">我的关注</el-menu-item>
                        <el-menu-item index="2-1">我的提醒</el-menu-item>
                        <el-submenu index="2-4">
                            <template slot="title">我的黑名单</template>
                            <el-menu-item index="2-4-1">黑名单解除</el-menu-item>
                            <el-menu-item index="2-4-2">黑名单申诉</el-menu-item>
                            <el-menu-item index="2-4-3">我的帮助</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">外卖呼叫</a> </el-menu-item>
                    <el-menu-item index="3" disabled>消息中心</el-menu-item>
                </el-menu>
            </div>

            <div style="width: 200px">
<!--                判断用户是否登录-->
                <div v-if="!user.username" style="text-align: right;padding-right: 30px">
                    <el-button @click="$router.push('/login')">登录</el-button>
                    <el-button @click="$router.push('/register')">注册</el-button>
                </div>
                <div v-else>
                    <el-dropdown style="width:150px; cursor:pointer;text-align: right">
                        <div style="display: inline-block">
                            <img :src="user.avatar" alt="" style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
                            <span>{{user.nickname}}</span><i class="el-icon-arrow-down" style="margin-left: 5px;"></i>
                        </div>
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
            </div>
        </div>
        <!--子路由-->
        <div style="width: 1000px;margin: 0 auto">
            <router-view/>
        </div>

<!--        <div style="height: 400px">-->
<!--            aufhsehf-->
<!--        </div>-->
<!--        底部-->
<!--        <div style="display: flex;height: 200px;line-height: 60px;border-bottom: 1px solid rgba(116,13,242,0.99)">-->
<!--            <el-menu class="nav" mode="horizontal">-->
<!--                <el-menu-item>HOME</el-menu-item>-->
<!--                <el-menu-item>ABOUT</el-menu-item>-->
<!--                <el-menu-item>BLOG</el-menu-item>-->
<!--                <el-menu-item>CONTACT</el-menu-item>-->
<!--            </el-menu>-->

<!--        </div>-->


        <hr class="line"/>

        <div style="font-size: 14px;">
            <div style="margin: 50px 100px 50px 100px;">
                <div style="display: flex;">
                    <div style="flex: 1;display: flex;">
                        <div style="">
                            <div class="foot-title"><b>帮助中心</b></div>
                            <div class="foot-item">账户管理</div>
                            <div class="foot-item">关于我们</div>
                            <div class="foot-item">栏目分类</div>
                        </div>
                        <div style="margin-left: 100px;">
                            <div class="foot-title"><b>服务支持</b></div>
                            <div class="foot-item">About Tencent</div>
                            <div class="foot-item">侵权投诉</div>
                            <div class="foot-item">免责声明</div>
                        </div>
                        <div style="margin-left: 100px;">
                            <div class="foot-title"><b>商务合作</b></div>
                            <div class="foot-item">长期合作</div>
                            <div class="foot-item">短期合作</div>
                            <div class="foot-item">法律资讯</div>
                        </div>
                        <div style="margin-left: 100px;">
                            <div class="foot-title"><b>服务条款</b></div>
                            <div class="foot-item">客服投诉</div>
                            <div class="foot-item">意见反馈</div>
                            <div class="foot-item">用户协议</div>
                        </div>
                    </div>


                    <!--底部-->
                    <div style="width: 400px;border-left: 1px solid #dfdfdf;text-align: center;">
                        <div style="margin-right: 150px;">
                            <div style="text-align: center;padding-top: 10px"><b>软件下载</b></div>
                            <div style="display:flex;padding-top: 20px">
                                <div style="width: 70px;height: 30px;padding-left: 20px"><img src="../../../src/assets/picture/icon/computer.png" height="50px"></div>
                                <div style="width: 70px;height: 30px;padding-left: 20px"><img src="../../../src/assets/picture/icon/mac.png" height="50px"></div>
                                <div style="width: 70px;height: 30px;padding-left: 20px"><img src="../../../src/assets/picture/icon/phone.png" height="50px"></div>
                                <div style="width: 70px;height: 30px;padding-left: 20px"><img src="../../../src/assets/picture/icon/tv.png" height="50px"></div>
                                <div style="width: 70px;height: 40px;padding-left: 30px"><img src="../../../src/assets/picture/icon/windows.png" height="50px" ></div>
                            </div>
                            <div style="display:flex;padding-top: 10px;white-space:nowrap">
                                <div style="padding-left: 80px;padding-left: 20px">iPad版</div>
                                <div style="padding-left: 80px;padding-left: 30px">Mac版</div>
                                <div style="padding-left: 80px;padding-left: 30px">手机版</div>
                                <div style="padding-left: 80px;padding-left: 30px">TV版</div>
                                <div style="padding-left: 80px;padding-left: 30px">Windows版</div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 200px;border-left: 1px solid #dfdfdf;text-align: center;">
                        <div style="color: #eae613;font-weight: bold;font-size: 18px;line-height: 40px;">000-1354523347</div>
                        <div style="color: gray;"><b>周一至周日8:00~17:00</b></div>
                        <div style="color: gray;margin-bottom: 10px;"><b>（节假日双休带薪）</b></div>
                        <el-button type="success" round icon="el-icon-headset">24小时客服在线</el-button>
                    </div>
                </div>

            </div>
            <div style="background-color: #659dea;height: 40px;text-align: center;line-height: 40px;color: #FFFFFF;">
                ©1999-2023杭州信工有限公司
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "FrontPage",
        data(){
            return{
                user: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{},
            }
        },
        created() {

        },
        methods:{
            logout(){
                this.$store.commit("logout")
                this.$message.success("退出成功")
            }
        }
    }
</script>

<style scoped>
.menuItem{
    display: inline-block;
    width: 100px;
    text-align: center;
    cursor: pointer;
}
.menuItem a{
    color: #edea1a;
}
.menuItem:hover{
    background-color: #42ffeb;
}
.bottom {
    padding: 9px 0 200px 0;
    font-size: 10px;
    color: #408bb8;
}

.foot-title{
    height: 40px;
    line-height: 40px;

}
.foot-item{
    height: 25px;
    line-height: 25px;
    color: gray;
}
.foot-item:hover {
    cursor: pointer;
    color: #e37a2f;
}


</style>