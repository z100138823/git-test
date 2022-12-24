<template>
    <div style="color: #666">
        <div style="margin: 20px 0;">
            <div class="pd-10" style="font-size: 30px;color: #2440B3;cursor: pointer">{{comment.title}}</div>
            <div style="font-size: 14px;margin-top:10px">
                <i class="el-icon-user-solid"></i><span>{{comment.role}}</span>
                <i class="el-icon-time" style="margin-left: 10px"></i><span>{{comment.time}}</span>
            </div>
        </div>

        <div style="margin: 20px 0">
            <mavon-editor
                    class="md"
                    :value="comment.content"
                    :subfield="false"
                    :defaultOpen="'preview'"
                    :toolbarsFlag="false"
                    :editable="false"
                    :scrollStyle="true"
                    :ishljs="true"
            />
        </div>

<!--        评论框-->
        <div style="margin: 30px 0">
            <div style="margin: 10px 0">
                <div style="border-bottom: 1px solid orangered;padding: 10px 0;font-size: 20px"><b>评论</b></div>
                <div style="padding: 10px 0">
                    <el-input size="small" type="textarea" v-model="commentForm.content"></el-input>
                </div>
                <div class="pd-10" style="text-align: right">
                    <el-button type="primary" size="small" @click="save">评论</el-button>
                </div>
            </div>

            <!--        评论区-->
            <div>
                <div v-for="item in discuss" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 10px 0">
                    <div style="display: flex">
                        <!--头像-->
                        <div style="width: 100px;text-align: center">
                            <el-image :src="item.avatar" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
                        </div>
                        <!--内容-->
                        <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">
                            <b>{{item.nickname}}：</b>
                            <span>{{item.content}}</span>
                            <div style="display: flex;line-height: 20px;margin-top: 5px">
                                <div style="width: 200px">
                                    <i class="el-icon-time"></i><span style="margin-left: 5px">{{item.time}}</span>
                                </div>
                                <div style="text-align: right;flex: 1">
                                    <el-button style="margin-left: 5px" type="text" @click="replyToUser(item.id)">回复</el-button>
                                    <el-button type="text" style="color: red" @click="del(item.id)" v-if="user.id===item.roleId">删除</el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--回复列表-->
                    <div v-if="item.children.length"  style="padding-left: 150px;">
                        <div v-for="childItem in item.children" :key="childItem.id" style="background-color: #f0f0f0;padding: 5px 20px">
                            <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">
                                <div>
                                    <b style="color: #3a8ee6" v-if="childItem.pnickname"> >{{childItem.pnickname}}</b>
                                </div>
                                <div>
                                    <b>{{childItem.nickname}}：</b>
                                    <span>{{childItem.content}}</span>
                                </div>
                                <div style="display: flex;line-height: 20px;margin-top: 5px">
                                    <div style="width: 200px">
                                        <i class="el-icon-time"></i><span style="margin-left: 5px">{{childItem.time}}</span>
                                    </div>
                                    <div style="text-align: right;flex: 1">
                                        <el-button style="margin-left: 5px" type="text" @click="replyToUser(childItem.id)">回复</el-button>
                                        <el-button type="text" style="color: red" @click="del(childItem.id)" v-if="user.id===childItem.roleId">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

<!--        回复-->
        <el-dialog title="回复" :visible.sync="dialogFormVisible" width="50%" >
            <el-form label-width="80px" size="small">
                <el-form-item label="评论标题">
                    <el-input type="textarea" v-model="commentForm.replayContent" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </el-dialog>

        <div>
        <!--评论框-->
<!--        <div style="margin: 30px 0">-->
<!--            <div style="margin: 10px 0">-->
<!--                <div style="border-bottom: 1px solid orangered;padding: 10px 0;font-size: 20px"><b>评论</b></div>-->
<!--                <div style="padding: 10px 0">-->
<!--                    <el-input size="small" type="textarea" v-model="discussForm.content"></el-input>-->
<!--                </div>-->
<!--                <div class="pd-10" style="text-align: right">-->
<!--                    <el-button type="primary" size="small" @click="save">评论</el-button>-->
<!--                </div>-->
<!--            </div>-->

<!--            &lt;!&ndash;评论列表&ndash;&gt;-->
<!--            <div>-->
<!--                <div v-for="item in discuss" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 10px 0;display: flex">-->
<!--                    <div style="display: flex">-->
<!--                        &lt;!&ndash;头像&ndash;&gt;-->
<!--                        <div style="width: 100px;text-align: center">-->
<!--                            <el-image :src="item.avatar" style="width: 50px;height: 50px;border-radius: 50%"></el-image>-->
<!--                        </div>-->
<!--                        &lt;!&ndash;内容&ndash;&gt;-->
<!--                        <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">-->
<!--                            <b>{{item.nickname}}：</b>-->
<!--                            <span>{{item.content}}</span>-->
<!--                            <div style="display: flex;line-height: 20px;margin-top: 5px">-->
<!--                                <div style="width: 200px">-->
<!--                                    <i class="el-icon-time"></i><span style="margin-left: 5px">{{item.time}}</span>-->
<!--                                </div>-->
<!--                                <div style="text-align: right;flex: 1">-->
<!--                                    <el-button style="margin-left: 5px" type="text" @click="replyToUser(item.id)">回复</el-button>-->
<!--                                    <el-button type="text" style="color: red" @click="del(item.id)" v-if="user.id===item.roleId">删除</el-button>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    &lt;!&ndash;回复&ndash;&gt;-->
<!--                    <div v-if="item.children.length"  style="padding-left: 150px;">-->
<!--                        <div v-for="subItem in item.children" :key="subItem.id" style="background-color: #e8e89e;padding: 5px 20px">-->

<!--                        </div>-->
<!--                        <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">-->
<!--                            <b>{{subItem.nickname}}：</b>-->
<!--                            <span>{{subItem.content}}</span>-->

<!--                            <div style="display: flex;line-height: 20px;margin-top: 5px">-->
<!--                                <div style="width: 200px">-->
<!--                                    <i class="el-icon-time"></i><span style="margin-left: 5px">{{subItem.time}}</span>-->
<!--                                </div>-->
<!--                                <div style="text-align: right;flex: 1">-->
<!--                                    <el-button style="margin-left: 5px" type="text" @click="replyToUser(subItem.id)">回复</el-button>-->
<!--                                    <el-button type="text" style="color: red" @click="del(item.id)" v-if="user.id===subItem.roleId">删除</el-button>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

<!--            <el-dialog title="回复" :visible.sync="dialogFormVisible" width="50%" >-->
<!--                <el-form label-width="80px" size="small">-->
<!--                    <el-form-item label="评论标题">-->
<!--                        <el-input type="textarea" v-model="discussForm.replayContent" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--                <div slot="footer" class="dialog-footer">-->
<!--                    <el-button @click="dialogFormVisible=false">取消</el-button>-->
<!--                    <el-button type="primary" @click="save">确定</el-button>-->
<!--                </div>-->
<!--            </el-dialog>-->

<!--        </div>-->
        </div>
    </div>
</template>

<script>

    export default {
        name: "CommentView",
        data() {
            return {
                user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{},
                comment:{},
                discuss:[],
                dialogFormVisible:false,
                commentForm:{}
            }
        },
        created() {
            this.load()
            this.loadDiscuss()
        },
        methods: {
            load() {
                const id=this.$route.query.id
                this.request.get("/comment/"+id).then(res => {
                    this.comment = res.data
                })

            },
            loadDiscuss(){
                const id=this.$route.query.id
                this.request.get("/discuss/tree/"+id).then(res => {
                    this.discuss = res.data
                })
            },
            save(){//提交评论
                if (!this.user.id){//登录前的校验，必须登录才能评论
                    this.$message.warning("请登录后进行评论")
                    return
                }
                this.commentForm.commentId=this.$route.query.id//评论完需要关联文章的id
                if(this.commentForm.replayContent){//如果回复评论框有值就赋予数据库中content避免回复输入框和普通发表评论框绑定相同值
                    this.commentForm.content=this.commentForm.replayContent
                }
                this.request.post("/discuss",this.commentForm).then(res=>{
                    if(res.code==='200'){
                        this.$message.success("评论成功")
                        this.commentForm={}//评论完需要清空输入框
                        // this.dialogFormVisible=false//新增成功关闭弹窗
                        this.loadDiscuss()
                        this.dialogFormVisible=false
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            },
            del(id) {
                this.request.delete("/discuss/" + id).then(res => {
                    if (res.code === '200') {
                        this.$message.success("删除成功")
                        this.loadDiscuss()
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            replyToUser(pid){
                this.commentForm={pid:pid}//内容置空
                this.dialogFormVisible=true
            }
            // del(id) {
            //     this.request.delete("/discuss/" + id).then(res => {
            //         if (res.code === '200') {
            //             this.$message.success("删除成功")
            //             this.loadDiscuss()
            //         } else {
            //             this.$message.error("删除失败")
            //         }
            //     })
            // },
            // save(){
            //     if (!this.user.id){
            //         this.$message.warning("请登录后进行评论")
            //         return
            //     }
            //     this.discussForm.commentId=this.$route.query.id
            //     if(this.discussForm.replayContent){//如果回复评论框有值就赋予数据库中content避免回复输入框和普通发表评论框绑定相同值
            //         this.discussForm.content=this.discussForm.replayContent
            //     }
            //     this.request.post("/discuss",this.discussForm).then(res=>{
            //         if(res.code==='200'){
            //             this.$message.success("保存成功")
            //             this.discussForm={}//评论完需要清空输入框
            //             // this.dialogFormVisible=false//新增成功关闭弹窗
            //             this.loadDiscuss()
            //             this.dialogFormVisible=false
            //         }else {
            //             this.$message.error(res.msg)
            //         }
            //     })
            // },
            // replyToUser(pid){//回复
            //     // this.discussForm={ pid:pid,topId:pid}//内容置空
            //     this.discussForm={ pid:pid}//内容置空
            //     this.dialogFormVisible=true
            // }
        }
    }
</script>

<style scoped>

</style>