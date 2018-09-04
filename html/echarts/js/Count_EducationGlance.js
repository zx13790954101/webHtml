/**
 * Name:Count_EducationHot.js
 * Desc:华喜·希安 - 教育概况JS
 * Author:Yang Wei · date 2018/2/24
 * LICENSE:HX·XA.ZhangZhiWu
 */
layui.use(['form', 'element'], function () {
    var $ = layui.jquery,
        form = layui.form,
        element = layui.element,
        layer = layui.layer;
        
    var CacheData = { Data: [], Total: {}};

    var bar1 = new Array();
    var bar1Num = new Array();
    var bar2Num = new Array();
    var bar3Num = new Array();
    var bar4Num = new Array();
    var bar5Num = new Array();
    var bar6Num = new Array();
    var schoolPie1 = new Array();
    var schoolPie2 = new Array();
    var schoolPie3 = new Array();
    var schoolPie4 = new Array();
    var schoolPie5 = new Array();
    var schoolPie6 = new Array();
    var pieData1;
    var pieData2;
    var pieData3;
    var titleName;

    var me = {
        //初始化入口
        init: function () {
            //1、加载数据
            me.getData(function () {
                var newData = CacheData.Data;//初始化32个镇街的数据
                var totalData = CacheData.Total;//初始化总的数据

                //32个镇街的数据进行封装
                var mapArr = new Array();
                var pieArr = new Array();
                var seriesData = new Array();
                var mapData = new Array();
                
                var totalList;
                var school;
                var student;
                var mbgb;
                var schoolPieList1;
                var schoolPieList2;
                var schoolPieList3;
                var schoolPieList4;
                var schoolPieList5;
                var schoolPieList6;

                $.each(newData,function(i,value){
                    //封装每个图表需要的data
                    totalList =[{name:'学校总数',value:newData[i].ALLSCHOOLNUM},{name:'公办学校总数',value:newData[i].GBSCHOOLNUM},{name:'民办学校总数',value:newData[i].MBSCHOOLNUM},{name:'学生总数',value:newData[i].STUDENTNUM},{name:'女生总数',value:newData[i].GIRLNUM}];
                    school =[{name:'民办学校',value:newData[i].MBSCHOOLNUM},{name:'公办学校',value:newData[i].GBSCHOOLNUM}]
                    student=[{name:'男生',value:newData[i].BOYNUM},{name:'女生',value:newData[i].GIRLNUM}]
                    mbgb=[{name:'民办学校学生',value:newData[i].MBXXSTUDENTNUM},{name:'公办学校学生',value:newData[i].GBXXSTUDENTNUM}]
                    
                    mapArr = {
                        name: StreetJsonCom.getJsonInfo(newData[i].STID).name, 
                        value: newData[i].ALLSCHOOLNUM,
                        sum:totalList,
                        school:school,
                        student:student,
                        mbgb:mbgb
                    };

                     //左下角饼图数据封装
                    bar1.push(newData[i].STNAME);
                    bar1Num.push(newData[i].ALLSCHOOLNUM)
                    bar2Num.push(newData[i].GBSCHOOLNUM)
                    bar3Num.push(newData[i].MBSCHOOLNUM)
                    bar4Num.push(newData[i].STUDENTNUM)
                    bar5Num.push(newData[i].MBXXSTUDENTNUM)
                    bar6Num.push(newData[i].GIRLNUM)

                     //右下角饼图数据封装
                     schoolPieList1 = {name:newData[i].STNAME,value:newData[i].ALLSCHOOLNUM}
                     schoolPieList2 = {name:newData[i].STNAME,value:newData[i].GBSCHOOLNUM}
                     schoolPieList3 = {name:newData[i].STNAME,value:newData[i].MBSCHOOLNUM}
                     schoolPieList4 = {name:newData[i].STNAME,value:newData[i].STUDENTNUM}
                     schoolPieList5 = {name:newData[i].STNAME,value:newData[i].MBXXSTUDENTNUM}
                     schoolPieList6 = {name:newData[i].STNAME,value:newData[i].GIRLNUM}

                    mapData.push(mapArr);

                    schoolPie1.push(schoolPieList1);
                    schoolPie2.push(schoolPieList2);
                    schoolPie3.push(schoolPieList3);
                    schoolPie4.push(schoolPieList4);
                    schoolPie5.push(schoolPieList5);
                    schoolPie6.push(schoolPieList6);
                });
                //总的数据
                var mapArrTotal = new Array();
                var mapDataTotal = new Array();
                var totalList2 =[{name:'学校总数',value:totalData.ALLSCHOOLNUM},{name:'公办学校总数',value:totalData.GBSCHOOLNUM},{name:'民办学校总数',value:totalData.MBSCHOOLNUM},{name:'学生总数',value:totalData.STUDENTNUM},{name:'女生总数',value:totalData.GIRLNUM}];
                 pieData1 =[{name:'民办学校',value:totalData.MBSCHOOLNUM},{name:'公办学校',value:totalData.GBSCHOOLNUM}]
                 pieData2=[{name:'男生',value:totalData.BOYNUM},{name:'女生',value:totalData.GIRLNUM}]
                 pieData3=[{name:'民办学校学生',value:totalData.MBXXSTUDENTNUM},{name:'公办学校学生',value:totalData.GBXXSTUDENTNUM}]
                mapArrTotal = {
                    sum:totalList2
                };
                mapDataTotal.push(mapArrTotal);

                

                //2、初始化上左边地图
                me.initMap(mapData,mapDataTotal);

                //3、初始化上右边页卡饼状图形
                var type=['民办学校','公办学校'];
                me.loadPie(type,pieData1,'东莞市');
                //var type2=['男生','女生'];
                //me.loadPie2(type2,pieData2);
                //var type3=['民办学校学生','公办学校学生'];
                //me.loadPie3(type3,pieData3);

                //4、初始化中部页卡 柱状图、饼状图
                me.loadBar1(bar1,bar1Num);  

                me.loadSchoolPie1(schoolPie1)
            });
            
            //2...
            //me.xxx

            //3...
        },
        //加载地图
        initMap: function (mapData,mapDataTotal)
        {
            me.getMap(mapData);
            //初始化调用第一个加载总数列表数据
            var firstData={data:mapDataTotal[0]};
            me.tableHtml('regCustomer',firstData);
        },
        //获取数据
        getData: function (callback)
        {
            $.ajax({
                type: "get",
                url: "http://127.0.0.1:8020/webHtml/html/echarts/js/Count_EducationGlance_getlist.json",
                dataType:"json",
                success: function (json) {
                    //layer.close(lindex);
                    if (json.code != 200) {
                        //layer.alert(json.info);
                        return;
                    }
                    CacheData = json.data;
                    callback();
                }
            });
        },
        //获取地图经纬度组装成东莞镇街图形
        getMap:function(mapData){
            $.get('js/dongguan.json?v='+Math.random(), function (geoJson) {
                var myChart = myChart = echarts.init(document.getElementById('container'));
                echarts.registerMap('dongguan', geoJson);
                myChart.setOption(option = {
                    title: {
                        text: '教育概览',
                        x:'center',
                        y:'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}' //<br/>{c}
                    },
                    visualMap: {
                        min: 0,
                        max: me.getVisualMapMaxNum(),
                        x: 'right',
                        y: 'bottom',
                        text:['高','低'],
                        realtime: false,
                        calculable: true,
                        inRange: {
                            color: ['lightskyblue','yellow', 'orangered']
                        }
                    },
                    series: [
                        {
                            name: '东莞市',
                            type: 'map',
                            zoom:1.1,
                            mapType: 'dongguan', // 自定义扩展图表类型
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:true,
                                        textStyle:{
                                            color: "#000"
                                        }
                                    }
                                },
                                emphasis:{label:{show:true}}
                            },
                            mapLocation : {
                                //width : '90%',
                                //height : '90%'
                            },
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: "#000"
                                        }
                                    }
                                },
                                emphasis: { label: { show: true } }
                            },
                            itemStyle: {
                                normal: { label: { show: true } }, //地图上是否显示镇街名称
                                emphasis: { label: { show: true }, color: '#00FFFF' }
                            },
                            data:mapData
                        }
                    ]
                }),
                //绑定地图上的点击事件
                myChart.on('click', function (result) {
                    titleName = result.data.name
                    me.tableHtml('regCustomer',result,result.data.name);
                    
                    //加载饼图每条的数据
                    var type=['民办学校','公办学校'];
                    me.loadPie(type,result.data.school,result.data.name);
                    
                    var pieId2 = $("#pieId2").val();
                    var pieId3 = $("#pieId3").val();
                    var type2=['男生','女生'];
                    if(pieId2 == 'true'){
                        me.loadPie2(type2,result.data.student,result.data.name);
                    }
                    if(pieId3 == 'true'){
                        var type3=['民办学校学生','公办学校学生'];
                        me.loadPie3(type3,result.data.mbgb,result.data.name);
                    }
    
                });
            });
        },
        //获取最大数
        getVisualMapMaxNum: function () {
            var max = 0;
            $.each(CacheData.Data, function (i, json) {
                if (parseInt(json.ALLSCHOOLNUM) >= max) {
                    max = json.ALLSCHOOLNUM;
                }
            });
            return max+10;
        },
        //点击每个镇街加载学校的数据
        tableHtml:function(id,data,bigtitle){
            var data = data.data;
            var sum = data.sum;
            var len = sum.length;
            var tbody = $('#'+id).find("tbody");
            $("#reg_table").find(".cityname").html(bigtitle);
            tbody.html('');
            if(len > 0){
                for(var i = 0;i < len;i++){
                    var row = sum[i];
                    var name = row.name;
                    var value = row.value;
                    var html = $(
                            "<tr>" + 
                            "<td style='width:150px;background-color:#F0F0F0;color:#333;padding:8px 10px;border-bottom:1px solid #fff;'  >" + name + "</td>" +
                            "<td style='width:80px;background-color:#87CEFA;color:#fff;padding:8px 10px;border-bottom:1px solid #fff;'>" + value + "</td>" +
                            "</tr>"
                    );
                    tbody.append(html);
                }
            }
        },
        //加载学校类型比例饼图
        loadPie:function(type,result,name){
            var pieId1 = echarts.init(document.getElementById('pie1'),'macarons');
            optionPie1 = {
                title : {
                    text: name+'学校类型比例',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top:'30',
                    data: type 
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:
                        result,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color:[
                    '#87CEFA','#FF9873'
                ]
            };
            pieId1.setOption(optionPie1);
        },
        //加载男女学生比例饼图
        loadPie2:function(type,result,name){
            var pieId2 = echarts.init(document.getElementById('pie2'),'macarons');
            optionPie2 = {
                title : {
                    text: name+'男女学生比例',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top:'30',
                    data: type 
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: result,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color:[
                    '#87CEFA','#FF9873'
                ]
            };
            pieId2.setOption(optionPie2);
        },
        //加载民办学校学生占比饼图
        loadPie3:function(type,result,name){
            var pieId3 = echarts.init(document.getElementById('pie3'),'macarons');
            optionPie3 = {
                title : {
                    text: name+'民办学校学生占比',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top:'30',
                    data: type 
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:
                        result,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color:[
                    '#87CEFA','#FF9873'
                ]
            };
            pieId3.setOption(optionPie3);
        },
        //柱形图 学校总数
        loadBar1:function(name,num){
            var barId1 = echarts.init(document.getElementById('bar1'),'macarons');
            var optionBar1 = me.optionBarFunction(name,num,'各地区学校总数');
            barId1.setOption(optionBar1);
        },
        //柱形图 公办学校总数
        loadBar2:function(name,num){
            var barId2 = echarts.init(document.getElementById('bar2'),'macarons');
            var optionBar2 = me.optionBarFunction(name,num,'各地区公办学校总数');
            barId2.setOption(optionBar2);
        },
        //柱形图 民办学校总数
        loadBar3:function(name,num){
            var barId3 = echarts.init(document.getElementById('bar3'),'macarons');
            var optionBar3 = me.optionBarFunction(name,num,'各地区民办学校总数');
            barId3.setOption(optionBar3);
        },
        //柱形图 学生总数
        loadBar4:function(name,num){
            var barId4 = echarts.init(document.getElementById('bar4'),'macarons');
            var optionBar4 = me.optionBarFunction(name,num,'各地区学生总数');
            barId4.setOption(optionBar4);
        },
        //柱形图 民办学校学生总数
        loadBar5:function(name,num){
            var barId5 = echarts.init(document.getElementById('bar5'),'macarons');
            var optionBar5 = me.optionBarFunction(name,num,'各地区民办学校学生总数');
            barId5.setOption(optionBar5);
        },
        //柱形图 女生总数
        loadBar6:function(name,num){
            var barId6 = echarts.init(document.getElementById('bar6'),'macarons');
            var optionBar6 = me.optionBarFunction(name,num,'各地区女生总数');
            barId6.setOption(optionBar6);
        },
        //封装柱形图统一调用的option
        optionBarFunction:function(name,num,title){
            barOption = {
                title: {
                    text: title,
                    x: 'center'
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0,  
                            formatter:function(value) {  
                                return value.split("").join("\n");  
                            }  
                    },
                    data: name//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },  
                color: ['#3398DB'],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }],
                series: [{
                    data: num,//[120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
                    }
                }]
            };
            return barOption;
        },
        //饼图 学校总数
        loadSchoolPie1:function(result){
            var schoolPie1 = echarts.init(document.getElementById('schoolPie1'),'macarons');
            var sPieOption1 = me.piePtionFunction(result,'各地区学校比例');
            schoolPie1.setOption(sPieOption1);
        },
        //饼图 公办学校总数
        loadSchoolPie2:function(result){
            var schoolPie2 = echarts.init(document.getElementById('schoolPie2'),'macarons');
            var sPieOption2 = me.piePtionFunction(result,'各地区公办学校比例');
            schoolPie2.setOption(sPieOption2);
        },
        //饼图 民办学校总数
        loadSchoolPie3:function(result){
            var schoolPie3 = echarts.init(document.getElementById('schoolPie3'),'macarons');
            var sPieOption3 = me.piePtionFunction(result,'各地区民办学校比例');
            schoolPie3.setOption(sPieOption3);
        },
        //饼图 学生总数
        loadSchoolPie4:function(result){
            var schoolPie4 = echarts.init(document.getElementById('schoolPie4'),'macarons');
            var sPieOption4 = me.piePtionFunction(result,'各地区学生比例');
            schoolPie4.setOption(sPieOption4);
        },
        //饼图 民办学校学生总数
        loadSchoolPie5:function(result){
            var schoolPie5 = echarts.init(document.getElementById('schoolPie5'),'macarons');
            var sPieOption5 = me.piePtionFunction(result,'各地区民办学校学生比例');
            schoolPie5.setOption(sPieOption5);
        },
        //饼图 女生总数
        loadSchoolPie6:function(result){
            var schoolPie6 = echarts.init(document.getElementById('schoolPie6'),'macarons');
            var sPieOption6 = me.piePtionFunction(result,'各地区女生比例');
            schoolPie6.setOption(sPieOption6);
        },
        piePtionFunction:function(result,title){
            piePtion2 = {
                title : {
                    text: title,
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '75%',
                        center: ['50%', '50%'],
                        data: result,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                            // normal:{
                            //     label:{
                            //         show:true,
                            //         formatter:'{b}:{c} \n({d}%)'
                            //     }
                            // }
                        }
                    }
                ]
            };
            return piePtion2;
        }
    };

    form.on('switch(switchTest)', function (data) {
        layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
            offset: '6px'
        });
        layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    });
    element.on('nav(navtab)', function (elem) {
        //console.log(elem)
        layer.msg(elem.text());
    });

    element.on('tab(section_header_right)', function (elem) {
        console.log("section_header_right", elem);
        if(titleName == null){
            titleName='东莞市';
        }
        if(elem.index == 0){
            $("#pieId2").val('false');
            $("#pieId3").val('false');
            var type=['民办学校','公办学校'];
            me.loadPie2(type,pieData1,titleName)
        }
        if(elem.index == 1){
            $("#pieId2").val('true');
            $("#pieId3").val('false');
            var type2=['男生','女生'];
            me.loadPie2(type2,pieData2,titleName)
        }
        if(elem.index == 2){
            $("#pieId3").val('true');
            $("#pieId2").val('fasle');
            var type3=['民办学校学生','公办学校学生'];
            me.loadPie3(type3,pieData3,titleName)
        }
    });
    //顶部的tab
    element.on('tab(section_bottom)', function (elem) {
        console.log("section_bottom", elem);
        if(elem.index == 0){
            me.loadBar1(bar1,bar1Num);  
            me.loadSchoolPie1(schoolPie1)
        }
        if(elem.index == 1){
            me.loadBar2(bar1,bar2Num);  
            me.loadSchoolPie2(schoolPie2)
        }
        if(elem.index == 2){
            me.loadBar3(bar1,bar3Num);  
            me.loadSchoolPie3(schoolPie3)
        }
        if(elem.index == 3){
            me.loadBar4(bar1,bar4Num); 
            me.loadSchoolPie4(schoolPie4) 
        }
        if(elem.index == 4){
            me.loadBar5(bar1,bar5Num);
            me.loadSchoolPie5(schoolPie5)  
        }
        if(elem.index == 5){
            me.loadBar6(bar1,bar6Num);  
            me.loadSchoolPie6(schoolPie6)
        }
    });
    me.init();
});