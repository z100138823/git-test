<template>
  <div>

    <!--            搜索框-->
    <div style="margin: 10px 0">
        <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
        <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>
        <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
        <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
        <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>
    <!--          按钮-->
    <div style="margin: 10px 0">
        <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
        <el-popconfirm
                class="ml-5"
                confirm-button-text='确定删除'
                cancel-button-text='再考虑会'
                icon="el-icon-info"
                icon-color="red"
                title="不再考虑下吗"
                @confirm="delBatch"
        >
            <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button>
        </el-popconfirm>
<!--        导入模块-->
        <el-upload action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="excelImportSuccess" style="display: inline-block">
            <el-button type="primary" class="ml-5">导入<i class="el-icon-bottom"></i> </el-button>
        </el-upload>
        <el-button type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i> </el-button>
    </div>
    <!--            数据栏-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="140"></el-table-column>
        <el-table-column prop="role" label="角色">
            <template slot-scope="scope">
                <el-tag type="primary" v-if="scope.row.role==='管理员'">管理员</el-tag>
                <el-tag type="warning" v-if="scope.row.role==='组长'">组长</el-tag>
                <el-tag type="success" v-if="scope.row.role==='普通用户'">普通用户</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" width="500" align="center">
            <!--                scope插槽，代表一行数据-->
            <template slot-scope="scope" >
<!--                查询当前组长布置哪些任务-->
                <el-button type="primary" @click="checkTask(scope.row.tasks)" v-if="scope.row.role==='组长'">查看组内成员<i class="el-icon-more"></i></el-button>
                <el-button type="warning" @click="checkMemberTask(scope.row.memberTasks)" v-if="scope.row.role==='普通用户'">查看任务<i class="el-icon-more"></i></el-button>
                <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
                <el-popconfirm
                        class="ml-5"
                        confirm-button-text='确定删除'
                        cancel-button-text='再考虑会'
                        icon="el-icon-info"
                        icon-color="red"
                        title="不再考虑下吗"
                        @confirm="del(scope.row.id)"
                >
                    <el-button type="danger" slot="reference">删除<i class="el-icon-remove-outline"></i></el-button>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!--            分页栏-->
    <div style="padding: 10px 0">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[2, 5, 10, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
    <!--编辑界面弹窗-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%" >
        <el-form label-width="80px" size="small">
            <el-form-item label="用户名">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 100%">
                    <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="任务信息" :visible.sync="show" width="30%" >
        <el-table :data="tasks" border stripe>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="score" label="得分"></el-table-column>
        </el-table>
    </el-dialog>

    <el-dialog title="任务信息" :visible.sync="memberShow" width="30%" >
        <el-table :data="tasks" border stripe>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="score" label="得分"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UserView",
    data(){
      return{
        tableData: [],
        total:0,
        pageNum: 1,
        pageSize: 20,
        username:"",
        email: "",
        address:"",
        form:{},
        dialogFormVisible:false,
        multipleSelection:[],
        headerBg:'headerBg',
        roles:[],
        tasks:[],
        show:false,
        memberTasks:[],
        memberShow:false
      }
    },
    created(){
      this.load()
    },
    methods:{
        load(){
            // axios方式实现前后端连接
            this.request.get("http://localhost:9090/user/page",{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    username:this.username,
                    email:this.email,
                    address:this.address
                }
            }).then(res=>{
                console.log(res)
                this.tableData=res.data.records
                this.total=res.data.total
            })

            //查询出角色信息
            this.request.get("/role").then(res=>{
                this.roles=res.data
            })
        },
        checkTask(tasks){
          this.tasks=tasks
          this.show=true
        },
        checkMemberTask(memberTasks){
          this.memberTasks=memberTasks
          this.memberShow=true
        },
        handleAdd(){
            this.dialogFormVisible=true
            this.form={}
        },
        handleEdit(row){
            this.form=row
            this.dialogFormVisible=true
        },
        handleSelectionChange(val){
            console.log(val)
            this.multipleSelection=val

        },
        del(id){
            this.request.delete("/user/"+id).then(res=>{
                if(res.code==='200'){
                    this.$message.success("删除成功")
                    this.load()
                }else {
                    this.$message.error("删除失败")
                }
            })
        },
        delBatch(){
            let ids=this.multipleSelection.map(v=>v.id)//[{},{},{}]=>[1,2,3]
            this.request.post("/user/del/batch",ids).then(res=>{
                if(res.code==='200'){
                    this.$message.success("批量删除成功")
                    this.load()
                }else {
                    this.$message.error("批量删除失败")
                }
            })
        },
        reset(){
            this.username=""
            this.email=""
            this.address=""
            this.load()
        },
        save(){
            console.log("user中form对象为",this.form)
            this.request.post("/user",this.form).then(res=>{
                console.log("发送user存储请求")
                if(res.code==='200'){
                    this.$message.success("保存成功")
                    this.dialogFormVisible=false//新增成功关闭弹窗
                    this.load()
                }else {
                    this.$message.error("保存失败")
                }
            })
        },
        // handleDelete(id){
        //     this.request.delete("/user/"+id).then(res=>{
        //         if(res.data){
        //             this.$message.success("删除成功")
        //             this.load()
        //         }else {
        //             this.$message.error("删除失败")
        //         }
        //     })
        // },
        handleSizeChange(pageSize){
            console.log(pageSize)
            this.pageSize=pageSize
            this.load()
        },
        handleCurrentChange(pageNum){
            console.log(pageNum)
            this.pageNum=pageNum
            this.load()
        },
        exp(){
            window.open("http://localhost:9090/user/export")
        },
        excelImportSuccess(){
            this.$message.success("导入成功")
            this.load()//导入成功刷新
        }
    }
  }
</script>

<style scoped>
    .headerBg{
        background-color: #eee!important;
    }
</style>