<template>
    <div>
        <div style="margin: 10px 0">
            <el-carousel height="250px" align="center" type="card" :interval="10000">
                <el-carousel-item v-for="(item,index) in imgs" :key="index">
<!--                    <h3 class="small">{{item}}</h3>-->
                    <img :src="item.idView" class="image">

                </el-carousel-item>
            </el-carousel>
        </div>

<!--        <div style="margin: 10px 0">-->
<!--            <el-row :gutter="10">-->
<!--                <el-col :span="6">-->
<!--                    <img :src="files[0].url" alt="" style="width: 100%" class="image">-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--        </div>-->
        <div style="margin: 10px 0">
            <el-row :gutter="10">
                <el-col :span="6" v-for="item in files" :key="item.id" style="margin-bottom: 10px">
                    <div style="border: 1px solid #ccc;padding-bottom: 10px">
                        <img :src="item.url" alt="" style="width: 230px;height: 230px">
                        <div style="color: #666;padding:10px;white-space:nowrap">{{item.name}}</div>
                        <div style="padding: 10px"><el-button type="primary">购买</el-button> </div>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    export default {
        name: "HomePage",
        data(){
            return{
                imgs:[
                    {id:0,idView:require("@/assets/picture/item1.png")},
                    {id:0,idView:require("@/assets/picture/item2.png")},
                    {id:0,idView:require("@/assets/picture/item3.png")},
                    {id:0,idView:require("@/assets/picture/item4.png")},
                ],
                files:[]
            }
        },
        created() {
            this.request.get("/echarts/file/front/all").then(res=>{
                console.log(res.data)
                this.files=res.data.filter(v=>v.type==='png'||v.type==='jpg'||v.type==='webp'||v.type==='jpeg')
                console.log(this.files)
            })
        }
    }
</script>

<style scoped>

</style>