<template>
    <div>
        <div style="color: #666">
            <div style="margin: 10px 0">
                <el-input size="small" style="width: 300px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
                <el-button class="ml-5" type="primary" @click="load" size="small">搜索</el-button>
                <el-button type="warning" @click="reset" size="small">重置</el-button>
            </div>

            <div style="margin: 10px 0">
                <div style="padding: 10px 0;border-bottom: 1px dashed #ccc" v-for="item in tableData" :key="item.id">
<!--                    <div class="pd-10" style="font-size: 20px;color: #2440B3;cursor: pointer">{{item.title}}</div>-->
                    <div class="pd-10" style="font-size: 20px;color: #2440B3;cursor: pointer" @click="$router.push('/front/commentShow?id=' +item.id)">{{item.title}}</div>
                    <div style="font-size: 14px;margin-top:10px">
                        <i class="el-icon-user-solid"></i><span>{{item.role}}</span>
                        <i class="el-icon-time" style="margin-left: 10px"></i><span>{{item.time}}</span>
                    </div>
                </div>
            </div>

            <div style="padding: 10px 0">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[2, 5, 10, 20]"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "CommentView",
        data() {
            return {
                form:{},
                tableData: [],
                name: '',
                multipleSelection: [],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                dialogFormVisible:false,
                leaders:[],
                user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{},
                content:'',
                contentViewVisible:false
            }
        },
        created() {
            this.load()
        },
        methods: {
            load() {
                this.request.get("/comment/page", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        name: this.name,
                    }
                }).then(res => {

                    this.tableData = res.data.records
                    this.total = res.data.total

                })
            },
            view(content){
              this.content=content
              this.contentViewVisible=true
            },
            imgAdd(pos,$file){
              let $vm=this.$refs.md
              //将图片上传到服务器
              const formData=new FormData();
              formData.append('file',$file);
              axios({
                  url:'http://localhost:9090/file/upload',
                  method:'post',
                  data:formData,
                  headers:{'Content-Type':'multipart/form-data'},
              }).then((res)=>{
                  $vm.$img2Url(pos,res.data);//将返回的url替换到文本原位置
              })
            },
            changeEnable(row) {
                this.request.post("/comment/update", row).then(res => {
                    if (res.code === '200') {
                        this.$message.success("操作成功")
                    }
                })
            },
            handleAdd(){
                this.dialogFormVisible=true
                this.form={}
            },
            handleEdit(row){
                this.form=row
                this.dialogFormVisible=true
            },
            del(id) {
                this.request.delete("/comment/" + id).then(res => {
                    if (res.code === '200') {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val
            },
            delBatch() {
                let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
                this.request.post("/comment/del/batch", ids).then(res => {
                    if (res.code === '200') {
                        this.$message.success("批量删除成功")
                        this.load()
                    } else {
                        this.$message.error("批量删除失败")
                    }
                })
            },
            reset() {
                this.name = ""
                this.load()
            },
            save(){
                this.request.post("/comment",this.form).then(res=>{
                    if(res.code==='200'){
                        this.$message.success("保存成功")
                        this.dialogFormVisible=false//新增成功关闭弹窗
                        this.load()
                    }else {
                        this.$message.error("保存失败")
                    }
                })
            },
            handleSizeChange(pageSize) {
                console.log(pageSize)
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum) {
                console.log(pageNum)
                this.pageNum = pageNum
                this.load()
            },
            handleFileUploadSuccess(res) {
                console.log(res)
                this.load()
            },
            download(url) {
                window.open(url)
            }
        }
    }
</script>

<style scoped>

</style>