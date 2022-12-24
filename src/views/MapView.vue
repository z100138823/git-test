<template>
    <div>
        <div id="container" style="width: 100%;height: calc(100vh - 100px)"></div>

        <div id="info" ></div>
    </div>
</template>

<script>
    var content=[
        "<div style='font-size: 14px;color: red;width: 200px;height: 50px'>学校位置</div>"
    ];
    //获取用户所在城市信息
    function showCityInfo() {
        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    var citybounds = result.bounds;
                    document.getElementById('info').innerHTML = '您当前所在城市：'+cityinfo;
                    //地图显示当前城市
                    map.setBounds(citybounds);
                }
            } else {
                document.getElementById('info').innerHTML = result.info;
            }
        });
    }

    export default {
        name: "MapView",
        data(){
            return{}
        },
        created() {

        },
        methods:{},
        mounted() {
            var map = new AMap.Map("container", {
                zoom: 13,//缩放级别
                center: [119.82734 , 30.29271],
                resizeEnable: true,
                // mapStyle: 'amap://styles/whitesmoke'
            });

            // 创建 infoWindow 实例（定义新窗口）
            var infoWindow = new AMap.InfoWindow({
                anchor:'top-left',
                content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
            });

            //绑定点击事件
            var clickHandler=function (e) {
                console.log('您在['+e.lnglat.getLng()+','+e.lnglat.getLat()+']位置点击了地图')
                infoWindow.open(map,[119.82734 , 30.29271])
            };
            map.on('click',clickHandler)//绑定事件

            var marker = new AMap.Marker({
                position: new AMap.LngLat(119.82734 , 30.29271),//119.82734 , 30.29271
                // offset: new AMap.Pixel(-10, -10),
                icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 实例
                title: '杭州电子科技大学信息工程学院',
                // zoom: 13
            });
            //将点击事件绑定到marker
            marker.on('click',clickHandler)

            //将创建的点添加到已有地图实例中
            map.add(marker)

            //path为路径的起点经过，终点
            var path = [];
            path.push([119.821821,30.291892]);
            path.push([119.822806,30.287196]);
            path.push([119.824469,30.287791]);

            map.plugin("AMap.DragRoute", function() {
                var route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE); //构造拖拽导航类
                route.search(); //查询导航路径并开启拖拽导航
            });

            showCityInfo();//展示

        }
    }
</script>

<style scoped>

</style>