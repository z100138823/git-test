<template>
  <div>

    <!--            搜索框-->
    <div style="margin: 10px 0">
        <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
<!--        <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>-->
<!--        <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>-->
        <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
        <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>
    <!--          按钮-->
    <div style="margin: 10px 0">
        <el-button type="primary" @click="handleAdd2">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
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
<!--        <el-upload action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="excelImportSuccess" style="display: inline-block">-->
<!--            <el-button type="primary" class="ml-5">导入<i class="el-icon-bottom"></i> </el-button>-->
<!--        </el-upload>-->
<!--        <el-button type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i> </el-button>-->
    </div>
    <!--            数据栏-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              row-key="id" default-expand-all @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="pagePath" label="页面路径" ></el-table-column>
        <el-table-column label="图标" align="center" label-class-name="fontSize12">
            <template slot-scope="scope" >
                <span :class="scope.row.icon" class="fontSize18"/>
            </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" ></el-table-column>
        <el-table-column label="操作" width="280" align="center">
            <!--                scope插槽，代表一行数据-->
            <template slot-scope="scope" >
                <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单<i class="el-icon-plus"></i></el-button>
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

    <!--            弹窗-->
    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%" >
        <el-form label-width="80px" size="small">
            <el-form-item label="名称">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路径">
                <el-input v-model="form.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="页面路径">
                <el-input v-model="form.pagePath" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标">
                <el-select clearable v-model="form.icon" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                        <i :class="item.value"/>{{item.name}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="唯一标识">
                <el-input v-model="form.flag" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
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
        pageSize: 5,
        name:"",
        email: "",
        address:"",
        form:{},
        dialogFormVisible:false,
        multipleSelection:[],
        options:[],
        headerBg:'headerBg'
      }
    },
    created(){
      this.load()
    },
    methods:{
        load(){
            // axios方式实现前后端连接
            this.request.get("/menu",{
                params:{
                    // pageNum:this.pageNum,
                    // pageSize:this.pageSize,
                    name:this.name,
                    // email:this.email,
                    // address:this.address
                }
            }).then(res=>{
                console.log(res)
                this.tableData=res.data
                // this.total=res.data.total
            })

            //fetch方式实现前后端连接
            // fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&username="+this.username+"&email="+this.email+"&address="+this.address)
            //     .then(res=>res.json()).then(res=>{
            //   console.log(res)
            //   this.tableData=res.userData
            //   this.total=res.total
            // })
        },
        handleAdd2(){
            console.log("点击新增菜单")
            this.dialogFormVisible=true
            this.form={}
        },
        handleAdd(pid){
            console.log("点击新增菜单")
            this.dialogFormVisible=true
            this.form={}
            console.log(pid)
            if(pid){//如果存在pid
                this.form.pid=pid//将此pid设置为form的父id
            }
        },
        handleEdit(row){
            this.form=JSON.parse(JSON.stringify(row))
            this.dialogFormVisible=true
            //请求图标
            this.request.get("/menu/icons").then(res=>{
                console.log(res)
                this.options=res.data
            })
        },
        handleSelectionChange(val){
            console.log(val)
            this.multipleSelection=val

        },
        del(id){
            this.request.delete("/menu/"+id).then(res=>{
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
            this.request.post("/menu/del/batch",ids).then(res=>{
                if(res.code==='200'){
                    this.$message.success("批量删除成功")
                    this.load()
                }else {
                    this.$message.error("批量删除失败")
                }
            })
        },
        reset(){
            this.name=""
            // this.email=""
            // this.address=""
            this.load()
        },
        save(){
            console.log("menu中form对象为",this.form)
            this.request.post("/menu",this.form).then(res=>{
                console.log(this.form)
                console.log("发送menu存储请求")
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
            window.open("http://localhost:9090/menu/export")
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
    .fontSize18{
        font-size: 18px;
    }
    .fontSize12{
        font-size: 12px;
    }
</style>