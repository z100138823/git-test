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
<!--        <el-upload action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="excelImportSuccess" style="display: inline-block">-->
<!--            <el-button type="primary" class="ml-5">导入<i class="el-icon-bottom"></i> </el-button>-->
<!--        </el-upload>-->
<!--        <el-button type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i> </el-button>-->
    </div>
    <!--            数据栏-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="flag" label="唯一标识" ></el-table-column>
        <el-table-column prop="description" label="描述" ></el-table-column>
        <el-table-column label="操作" width="280" align="center">
            <!--                scope插槽，代表一行数据-->
            <template slot-scope="scope" >
                <el-button type="info" @click="selectMenu(scope.row)">分配菜单<i class="el-icon-menu"></i> </el-button>
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
    <!--            弹窗-->
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%" >
        <el-form label-width="80px" size="small">
            <el-form-item label="名称">
                <el-input v-model="form.name" autocomplete="off"></el-input>
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

    <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%" >
<!--        <el-form label-width="80px" size="small">-->
<!--            <el-form-item label="名称">-->
<!--                <el-input v-model="form.name" autocomplete="off"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="描述">-->
<!--                <el-input v-model="form.description" autocomplete="off"></el-input>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
        <el-tree
                :props="props"
                :data="menuData"
                show-checkbox
                node-key="id"
                ref="tree"
                :default-expanded-keys="expends"
                :default-checked-keys="checks"
                @check-change="handleCheckChange">
            <span class="custom-tree-node" slot-scope="{node,data}">
<!--                分配界面前添加图标-->
                <span><i :class="data.icon"></i> {{data.name}}</span>
            </span>
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="menuDialogVis = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
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
        menuDialogVis:false,
        multipleSelection:[],
        headerBg:'headerBg',
        menuData:[
            // {
            //     id:1,
            //     label: '主页',
            //     children: []
            // },
            // {
            //     id: 2,
            //     label: '系统管理',
            //     children: [
            //         {
            //             id:3,
            //             label:'用户管理',
            //             children:[]
            //         },
            //         {
            //             id:4,
            //             label:'角色管理',
            //             children:[]
            //         },
            //         {
            //             id:5,
            //             label:'商品管理',
            //             children:[]
            //         },
            //         {
            //             id:6,
            //             label:'文件管理',
            //             children:[]
            //         }
            //     ]
            // }
        ],
        expends:[],
        checks:[],
        roleId:0,
        roleFlag:'',
        props:{//用来设置分级时分配菜单显示不出文字
            label:'name'
        }
      }
    },
    created(){
      this.load()
    },
    methods:{
        load(){
            // axios方式实现前后端连接
            this.request.get("/role/page",{
                params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    name:this.name,
                    // email:this.email,
                    // address:this.address
                }}).then(res=>{
                console.log(res)
                this.tableData=res.data.records
                this.total=res.data.total
            })

            //fetch方式实现前后端连接
            // fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&username="+this.username+"&email="+this.email+"&address="+this.address)
            //     .then(res=>res.json()).then(res=>{
            //   console.log(res)
            //   this.tableData=res.userData
            //   this.total=res.total
            // })
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
            this.request.delete("/role/"+id).then(res=>{
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
            this.request.post("/role/del/batch",ids).then(res=>{
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
            this.request.post("/role",this.form).then(res=>{
                if(res.code==='200'){
                    this.$message.success("保存成功")
                    this.dialogFormVisible=false//新增成功关闭弹窗
                    this.load()
                }else {
                    this.$message.error("保存失败")
                }
            })
        },
        saveRoleMenu(){
            // console.log(this.$refs.tree.getCheckedNodes());
            console.log(this.roleId)
            console.log(this.$refs.tree.getCheckedKeys());
            this.request.post("/role/roleMenu/"+this.roleId,this.$refs.tree.getCheckedKeys()).then(res=>{
                console.log(res)
                if(res.code==='200'){
                    this.$message.success("绑定成功")
                    this.menuDialogVis=false
                    //操作管理员角色之后需要重新登录
                    if(this.roleFlag==='ROLE_ADMIN'){
                        this.$store.commit("logout")
                    }
                }else {
                    this.$message.error(res.msg)
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
        selectMenu(role){
            this.menuDialogVis=true
            this.roleId=role.id
            this.roleFlag=role.flag
            console.log("当前分配的用户id为"+this.roleId)

            //请求菜单数据
            this.request.get("/menu").then(res=>{
                console.log(res)
                this.menuData=res.data
                //把后台返回的数据处理成id数组
                this.expends=this.menuData.map(v=>v.id)
            })

            this.request.get("/role/roleMenu/"+this.roleId).then(res=>{
                this.menuDialogVis=true//优先渲染弹窗中元素，预先将弹窗模块提前，防止出现前调用
                this.checks=res.data
                //防止分配菜单选中一级菜单全选子级菜单，查出数据库表id和选中id比较，选中id不包含数据库id，则设成false
                this.request.get("/menu/ids").then(r=>{
                    const ids= r.data
                    ids.forEach(id=>{
                        if(!this.checks.includes(id)){
                            this.$refs.tree.setChecked(id,false)//false取消选中
                        }
                    })
                })
            })
        },
        // selectMenu(role){
        //     this.roleId=role.id
        //     this.roleFlag=roleFlag
        //     //请求菜单数据
        //     this.request.get("/menu"
        //         // ,{
        //         // params:{
        //         //     name:"",
        //         // }
        //         // }
        //     ).then(res=>{
        //         console.log(res)
        //         this.menuData=res.data
        //
        //         //把后台返回的菜单数据处理成id数组
        //         this.expends=this.menuData.map(v=>v.id)
        //     })
        //
        //     this.request.get("/role/roleMenu/"+this.roleId).then(res=>{
        //         //先渲染弹窗里的元素
        //         this.menuDialogVis=true
        //         console.log(res)
        //         this.checks=res.data
        //
        //         this.request.get("/menu/ids").then(r=>{
        //             const ids=r.data
        //             ids.forEach(id=>{
        //                 if(!this.checks.includes(id)){
        //                     this.$refs.tree.setChecked(id,false)
        //                 }
        //             })
        //         })
        //         // this.menuDialogVis=true
        //     })
        // },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        // exp(){
        //     window.open("http://localhost:9090/role/export")
        // },
        // excelImportSuccess(){
        //     this.$message.success("导入成功")
        //     this.load()//导入成功刷新
        // }
    }
  }
</script>

<style scoped>
    .headerBg{
        background-color: #eee!important;
    }
</style>