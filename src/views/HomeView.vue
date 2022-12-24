<template>
  <div>
      <el-row :gutter="10" style="margin-bottom:60px">
          <el-col :span="6">
              <el-card style="color: #409EFF">
                  <div><i class="el-icon-user-solid"/>商品总数 </div>
                  <div style="padding: 10px 0;text-align: center;font-weight: bold">
                      153
                  </div>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card style="color: #F56C6C">
                  <div><i class="el-icon-money"/>销售总量 </div>
                  <div style="padding: 10px 0;text-align: center;font-weight: bold">
                      $780023400
                  </div>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card style="color: #E6A23C">
                  <div><i class="el-icon-bank-card"/>收益总数 </div>
                  <div style="padding: 10px 0;text-align: center;font-weight: bold">
                      $4337740
                  </div>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card style="color: #67C23A">
                  <div><i class="el-icon-s-shop"/>品类总数 </div>
                  <div style="padding: 10px 0;text-align: center;font-weight: bold">
                      346
                  </div>
              </el-card>
          </el-col>
      </el-row>
      <el-row>
<!--          默认24为一行-->
          <el-col :span="12">
            <div id="main" style="width: 500px;height: 450px"></div>
          </el-col>
          <el-col :span="12">
            <div id="pie" style="width: 500px;height: 400px"></div>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name: "HomeView",
        data(){
            return{

            }
        },
        mounted() {//页面元素渲染后触发
            //柱状图
            var option = {
                title:{
                  text:'仓库品类数量统计',
                  subtext:'趋势图',
                  left:'center'
                },
                tooltip:{
                    trigger:'item'
                },
                legend: {
                    orient:'vertical',
                    left:'left'
                },
                xAxis: {
                    type: 'category',
                    data: ["第一季度","第二季度","第三季度","第四季度"]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:"生活用品",
                        data: [],
                        type: 'bar'
                    },
                    {
                        name: "生活用品",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "非生活用品",
                        data: [],
                        type: 'bar'
                    },
                    {
                        name:"非生活用品",
                        data: [],
                        type: 'line'
                    },
                ]
            };

            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);

            this.request.get("/echarts/members").then(res=>{
                //柱状图赋值
                // option.xAxis.data=res.data.x
                // option.series[0].data=res.data.y
                // option.series[1].data=res.data.y
                option.series[0].data=res.data
                option.series[1].data=res.data

                option.series[2].data=[5,6,7,8]
                option.series[3].data=[5,6,7,8]
                //数值赋值完后set
                //myChart
                myChart.setOption(option);

                //饼图赋值
                pieOption.series[0].data=[
                    {name:"第一季度",value:res.data[0]},
                    {name:"第二季度",value:res.data[1]},
                    {name:"第三季度",value:res.data[2]},
                    {name:"第四季度",value:res.data[3]}
                ]
                //pieChart
                pieChart.setOption(pieOption)

            })

            //饼图
            var pieOption = {
                title:{
                  text:'仓库品类数量比例',
                  subtext: '比例图',
                  left: 'center',
                  radius:'50%'
                },
                tooltip:{
                    trigger:'item'
                },
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                graphic:{            //echarts饼图中间放字
                    type:'text',
                    left:'20%',
                    top:'center',
                    z:2,
                    //  zlevel:10,
                    style:{
                        text:'生活用品                                                        非生活用品',
                        textAlign:'center',
                        fill:'#000',
                        font:' 12px 微软雅黑 '
                    },
                },
                series: [
                    {
                        name: '非生活用品',
                        type: 'pie',
                        radius: [40, 120],
                        center: ['75%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius:4
                        },
                        label:{//途中数值显示
                            normal:{
                                show:true,
                                position:'inner',//标签位置
                                textStyle:{
                                    fontWeight:300,
                                    fontSize:15,//文字字体大小
                                    color:"#fff"
                                },
                                formatter:'{d}%'//光标区域显示比例
                            }
                        },
                        data: [
                            // { value: 40, name: 'rose 1' },
                            // { value: 38, name: 'rose 2' },
                            // { value: 32, name: 'rose 3' },
                            // { value: 30, name: 'rose 4' },
                            // { value: 28, name: 'rose 5' },
                            // { value: 26, name: 'rose 6' },
                            // { value: 22, name: 'rose 7' },
                            // { value: 18, name: 'rose 8' }
                        ]
                    },
                    {
                        name: '生活用品',
                        type: 'pie',
                        radius: [40, 120],
                        center: ['25%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius:4
                        },
                        label:{//途中数值显示
                            normal:{
                                show:true,
                                position:'inner',//标签位置
                                textStyle:{
                                    fontWeight:300,
                                    fontSize:15,//文字字体大小
                                    color:"#fff"
                                },
                                formatter:'{d}%'
                            }
                        },
                        data: [
                            {name:"第一季度",value:5},
                            {name:"第二季度",value:6},
                            {name:"第三季度",value:7},
                            {name:"第四季度",value:8}
                        ]
                    }
                ]
            };

            var pieDom = document.getElementById('pie');
            var pieChart = echarts.init(pieDom);


        }
    }
</script>

<style scoped>

</style>