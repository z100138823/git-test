<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
        </div>
        <div style="margin: 10px 0">
<!--            普通用户无权新增任务-->
            <el-button type="primary" @click="handleAdd" v-if="user.role==='管理员'">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='确定'
                    cancel-button-text='我再想想'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定批量删除这些数据吗？"
                    @confirm="delBatch"
            >
                <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>

        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="score" label="成员分数"></el-table-column>
            <el-table-column prop="times" label="完成时间"></el-table-column>
            <el-table-column prop="leader" label="组长"></el-table-column>
            <el-table-column label="启用">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ccc"
                               @change="changeEnable(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="280" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="selectTask(scope.row.id)">选择任务</el-button>
                    <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="del(scope.row.id)"
                    >
<!--                        普通用户无权删除任务-->
                        <el-button type="danger" slot="reference" v-if="user.role==='管理员'">删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

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
        <el-dialog title="任务信息" :visible.sync="dialogFormVisible" width="30%" >
            <el-form label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分数">
                    <el-input v-model="form.score" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="完成时间">
                    <el-input v-model="form.times" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组长">
                    <el-select clearable v-model="form.leaderId" placeholder="请选择活动区域">
<!--                        label作为显示，id作为存储数据-->
                        <el-option v-for="item in leaders" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
<!--                        <el-option v-for="item in leaders" :key="item.id" :label="item.username" :value="item.id"></el-option>-->
                    </el-select>
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
        name: "TaskView",
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
                user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}
            }
        },
        created() {
            this.load()
        },
        methods: {
            load() {
                this.request.get("/task/page", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        name: this.name,
                    }
                }).then(res => {

                    this.tableData = res.data.records
                    this.total = res.data.total

                })

                this.request.get("/user/role/组长").then(res => {
                    console.log(res)
                    this.leaders=res.data
                    console.log(this.leaders)
                })
            },
            selectTask(taskId){
                this.request.post('/task/memberTask/'+taskId+"/"+this.user.id).then(res=>{
                    if(res.code==='200'){
                        this.$message.success("已成功选择任务")
                    }else {
                        this.$message.success(res.msg)
                    }
                })
            },
            changeEnable(row) {
                this.request.post("/task/update", row).then(res => {
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
                this.request.delete("/task/" + id).then(res => {
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
                this.request.post("/task/del/batch", ids).then(res => {
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
                this.request.post("/task",this.form).then(res=>{
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