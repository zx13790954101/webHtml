/**
 * Name:Count_EducationHot.js
 * Desc:华喜·希安 - 教育热点JS
 * Author:Yang Wei · date 2018/2/24
 * LICENSE:HX·XA.YangWei
 */
layui.use(['form', 'element'], function () {
    var $ = layui.jquery,
        form = layui.form,
        element = layui.element;
        
    var CacheData = { Data: [], Total: {} };
    var TabId = "";
    var me = {
        //初始化入口
        init: function () {
            var xAxisData = new Array();
            //1、加载数据
            me.getData(function () {

                var newData = CacheData.Data;//初始化32个镇街的数据
                var totalData = CacheData.Total;//初始化总的数据

                //32个镇街的数据进行封装
                var mapArr = new Array();
                var pieArr = new Array();
                var seriesData = new Array();
                var mapData = new Array();
                var bar1 = new Array();
                
                $.each(newData, function (i, json) {

                    //1.1封装每块图表需要的data
                    var sumList = [{ name: '随迁子女学生', value: json.LOWUPSTUDENTNUM },
                                    { name: '留守儿童学生', value: json.STAYCHILDRENNUM },
                                    { name: '孤儿学生', value: json.ORPHANSTUDENT },
                                    { name: '残疾学生', value: json.DEFORMITYNUM },
                                    { name: '烈士及优抚子女学生', value: json.MARTYRNUM },
                                    { name: '申请资助学生', value: json.APPLYMONEYNUM },
                                    { name: '倍增学生', value: json.DOUBLYNUM }
                                   ];
                    var LOWUPSTUDENTNUM = [{ name: '随迁子女学生', value: json.LOWUPSTUDENTNUM }, { name: '非随迁子女学生', value: json.UNLOWUPSTUDENTNUM }];
                    var STAYCHILDRENNUM = [{ name: '留守儿童学生', value: json.STAYCHILDRENNUM }, { name: '非留守儿童学生', value: json.UNSTAYCHILDRENNUM }];
                    var ORPHANSTUDENT = [{ name: '孤儿学生数', value: json.ORPHANSTUDENT }, { name: '非孤儿学生数', value: json.UNORPHANSTUDENT }];
                    var DEFORMITYNUM = [{ name: '残疾学生数', value: json.DEFORMITYNUM }, { name: '非残疾学生数', value: json.UNDEFORMITYNUM }];
                    var MARTYRNUM = [{ name: '烈士及优抚子女学生', value: json.MARTYRNUM }, { name: '非烈士及优抚子女学生', value: json.UNMARTYRNUM }];
                    var APPLYMONEYNUM = [{ name: '申请资助学生', value: json.APPLYMONEYNUM }, { name: '非申请资助学生', value: json.UNAPPLYMONEYNUM }];
                    var DOUBLYNUM = [{ name: '倍增学生数', value: json.DOUBLYNUM }, { name: '非倍增学生数', value: json.UNDOUBLYNUM }];
            
                    mapArr = {
                        name: StreetJsonCom.getJsonInfo(json.STID).name,
                        value: json.STUDENTNUM,
                        sum:sumList,
                        LOWUPSTUDENTNUM: LOWUPSTUDENTNUM,
                        STAYCHILDRENNUM: STAYCHILDRENNUM,
                        ORPHANSTUDENT: ORPHANSTUDENT,
                        DEFORMITYNUM: DEFORMITYNUM,
                        MARTYRNUM: MARTYRNUM,
                        APPLYMONEYNUM: APPLYMONEYNUM,
                        DOUBLYNUM: DOUBLYNUM
                    };
                    mapData.push(mapArr);
                });

                //1.2、总览的数据
                var json = totalData;
                var total_sumList = [{ name: '随迁子女学生', value: json.LOWUPSTUDENTNUM },
                                { name: '留守儿童学生', value: json.STAYCHILDRENNUM },
                                { name: '孤儿学生', value: json.ORPHANSTUDENT },
                                { name: '残疾学生', value: json.DEFORMITYNUM },
                                { name: '烈士及优抚子女学生', value: json.MARTYRNUM },
                                { name: '申请资助学生', value: json.APPLYMONEYNUM },
                                { name: '倍增学生', value: json.DOUBLYNUM }
                ];
                var total_LOWUPSTUDENTNUM = [{ name: '随迁子女学生', value: json.LOWUPSTUDENTNUM }, { name: '非随迁子女学生', value: json.UNLOWUPSTUDENTNUM }];
                var total_STAYCHILDRENNUM = [{ name: '留守儿童学生', value: json.STAYCHILDRENNUM }, { name: '非留守儿童学生', value: json.UNSTAYCHILDRENNUM }];
                var total_ORPHANSTUDENT = [{ name: '孤儿学生数', value: json.ORPHANSTUDENT }, { name: '非孤儿学生数', value: json.UNORPHANSTUDENT }];
                var total_DEFORMITYNUM = [{ name: '残疾学生数', value: json.DEFORMITYNUM }, { name: '非残疾学生数', value: json.UNDEFORMITYNUM }];
                var total_MARTYRNUM = [{ name: '烈士及优抚子女学生', value: json.MARTYRNUM }, { name: '非烈士及优抚子女学生', value: json.UNMARTYRNUM }];
                var total_APPLYMONEYNUM = [{ name: '申请资助学生', value: json.APPLYMONEYNUM }, { name: '非申请资助学生', value: json.UNAPPLYMONEYNUM }];
                var total_DOUBLYNUM = [{ name: '倍增学生数', value: json.DOUBLYNUM }, { name: '非倍增学生数', value: json.UNDOUBLYNUM }];

                var  mapArrTotal = {
                        sum: total_sumList,
                        LOWUPSTUDENTNUM: total_LOWUPSTUDENTNUM,
                        STAYCHILDRENNUM: total_STAYCHILDRENNUM,
                        ORPHANSTUDENT: total_ORPHANSTUDENT,
                        DEFORMITYNUM: total_DEFORMITYNUM,
                        MARTYRNUM: total_MARTYRNUM,
                        APPLYMONEYNUM: total_APPLYMONEYNUM,
                        DOUBLYNUM: total_DOUBLYNUM
                };

                //2、初始化上左边地图
                me.initMap(mapData, mapArrTotal);
                //3、初始化上右边页卡饼状图形
                me.initTopRight(mapArrTotal,"东莞市");
                //4、初始化中部页卡 柱状图、饼状图
                me.initMiddle(mapData);

                me.aClick();
            });

        },
        //获取最大数
        getVisualMapMaxNum: function ()
        {
            var max = 0;
            $.each(CacheData.Data, function (i, json) {
                if (parseInt(json.STUDENTNUM) >= max) {
                    max = json.STUDENTNUM;
                }
            });
            return max+10;
        },
        //加载地图
        initMap: function (xAxisData, mapDataTotal) {
            me.initTopLeftMap(xAxisData);
            //初始化调用第一个加载总数列表数据
            var firstData = { data: mapDataTotal };
            me.tableHtml('regCustomer', firstData,"东莞市");
        },
        //加载地图
        initTopLeftMap: function (xAxisData)
        {
            $.get('/Areas/Hx_DGLargeData_Analysis/Views_Js/dongguan.json?v='+Math.random(), function (geoJson) {
                var myChart = myChart = echarts.init(document.getElementById('topLeftChart'));
                echarts.registerMap('dongguan', geoJson);
                myChart.setOption(
                    option = {
                    title: {
                        text: '教育热点',
                        x: 'center',
                        y: 'top'
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
                            zoom: 1.1,
                            mapType: 'dongguan', // 自定义扩展图表类型
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
                            data: xAxisData
                        }
                    ]
                }),
                //绑定地图上的点击事件
                myChart.on('click', function (result) {
                    //console.log(result)
                    me.tableHtml('regCustomer', result,result.data.name);
                    me.initTopRight(result.data, result.data.name);
                });
            });
        },
        //加载右上饼状比例
        initTopRight:function(chartdata,bigtitle)
        {
            var renderChart = function (selector,title)
            {
                var data = $("#" + selector).data("data");
                var typetitle = [];
                $.each(data, function (i, ss) {
                    typetitle.push(ss.name);
                })
                var pieId1 = echarts.init(document.getElementById(selector), 'macarons');
                optionPie1 = {
                    title: {
                        text: title,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        top: '30',
                        data: typetitle //['民办学校','公办学校']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: data,
                            // [
                            //     {value:335, name:'民办学校'},
                            //     {value:310, name:'公办学校'}
                            // ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: [
                        '#87CEFA', '#FF9873'
                    ]
                };
                pieId1.setOption(optionPie1);
            }

            //存储自己的值对象
            $("#topRightChart1").data("data", chartdata.LOWUPSTUDENTNUM);
            $("#topRightChart2").data("data", chartdata.STAYCHILDRENNUM);
            $("#topRightChart3").data("data", chartdata.ORPHANSTUDENT);
            $("#topRightChart4").data("data", chartdata.DEFORMITYNUM);
            $("#topRightChart5").data("data", chartdata.MARTYRNUM);
            $("#topRightChart6").data("data", chartdata.APPLYMONEYNUM);
            $("#topRightChart7").data("data", chartdata.DOUBLYNUM);

            //绑定点击事件
            element.on('tab(section_header_right)', function (elem) {
                if (elem.index == 0) {
                    renderChart("topRightChart1", bigtitle + "随迁子女学生比例");
                }
                if (elem.index == 1) {
                    renderChart("topRightChart2", bigtitle + "留守儿童学生比例");
                }
                if (elem.index == 2) {
                    renderChart("topRightChart3", bigtitle + "孤儿学生比例");
                }
                if (elem.index == 3) {
                    renderChart("topRightChart4", bigtitle + "残疾学生比例");
                }
                if (elem.index == 4) {
                    renderChart("topRightChart5", bigtitle + "烈士学生比例");
                }
                if (elem.index == 5) {
                    renderChart("topRightChart6", bigtitle + "申请资助学生比例");
                }
                if (elem.index == 6) {
                    renderChart("topRightChart7", bigtitle + "倍增学生比例");
                }
            });
            $(".section_header_right").find(".layui-this").click();
        },
        //加载中部统计图
        initMiddle: function (chartdata)
        {
            var renderBarChart = function (selector,titlesz,title,bustype) {
                var numsz = $("#" + selector).data("data");
                var typetitle = [];
                var barId1 = echarts.init(document.getElementById(selector), 'macarons');
                optionBar1 = {
                    title: {
                        text: title,
                        x: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            formatter: function (value) {
                                return value.split("").join("\n");
                            }
                        },
                        data: titlesz
                    },
                    color: ['#3398DB'],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }],

                    series: [{
                        data: numsz,
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
                barId1.setOption(optionBar1);
                //绑定地图上的点击事件
                barId1.on('click', function (result) {
                    me.initTable(selector, StreetJsonCom.getJsonInfoByName(result.name).idcode,bustype);
                });

            }

            var renderPieChart = function (selector, titlesz,title) {
                var numsz = $("#" + selector).data("data");
                var typetitle = [];
                var pieId1 = echarts.init(document.getElementById(selector), 'macarons');
                var piePtion1 = {
                    title: {
                        text:title,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '75%',
                            center: ['50%', '50%'],
                            data: numsz,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                pieId1.setOption(piePtion1);
            }

            var titlesz = [];
            var bar1num = [];
            var bar2num = [];
            var bar3num = [];
            var bar4num = [];
            var bar5num = [];
            var bar6num = [];
            var bar7num = [];
            var titlesz = [];
            var pie1num = [];
            var pie2num = [];
            var pie3num = [];
            var pie4num = [];
            var pie5num = [];
            var pie6num = [];
            var pie7num = [];
            $.each(CacheData.Data, function (i, json) {
                var stname=StreetJsonCom.getJsonInfo(json.STID).name;
                titlesz.push(stname);
                bar1num.push(json.LOWUPSTUDENTNUM);
                bar2num.push(json.STAYCHILDRENNUM);
                bar3num.push(json.ORPHANSTUDENT);
                bar4num.push(json.DEFORMITYNUM);
                bar5num.push(json.MARTYRNUM);
                bar6num.push(json.APPLYMONEYNUM);
                bar7num.push(json.DOUBLYNUM);

                pie1num.push({ name: stname, value: json.LOWUPSTUDENTNUM });
                pie2num.push({ name: stname, value: json.STAYCHILDRENNUM });
                pie3num.push({ name: stname, value: json.ORPHANSTUDENT });
                pie4num.push({ name: stname, value: json.DEFORMITYNUM });
                pie5num.push({ name: stname, value: json.MARTYRNUM });
                pie6num.push({ name: stname, value: json.APPLYMONEYNUM });
                pie7num.push({ name: stname, value: json.DOUBLYNUM });
            });
            //各自存储各自的对象
            $("#bar1").data("data", bar1num);
            $("#bar2").data("data", bar2num);
            $("#bar3").data("data", bar3num);
            $("#bar4").data("data", bar4num);
            $("#bar5").data("data", bar5num);
            $("#bar6").data("data", bar6num);
            $("#bar7").data("data", bar7num);

            $("#schoolPie1").data("data", pie1num);
            $("#schoolPie2").data("data", pie2num);
            $("#schoolPie3").data("data", pie3num);
            $("#schoolPie4").data("data", pie4num);
            $("#schoolPie5").data("data", pie5num);
            $("#schoolPie6").data("data", pie6num);
            $("#schoolPie7").data("data", pie7num);
            //绑定点击事件
            element.on('tab(section_bottom)', function (elem) {
                if (elem.index == 0) {
                    renderBarChart("bar1", titlesz, "各地区随迁子女总数",1);
                    renderPieChart("schoolPie1", titlesz, "各地区随迁子女比例");
                }
                if (elem.index == 1) {
                    renderBarChart("bar2", titlesz, "各地区留守儿童学生总数",2);
                    renderPieChart("schoolPie2", titlesz, "各地区留守儿童学生比例");
                }
                if (elem.index == 2) {
                    renderBarChart("bar3", titlesz, "各地区孤儿学生总数",3);
                    renderPieChart("schoolPie3", titlesz, "各地区孤儿学生比例");
                }
                if (elem.index == 3) {
                    renderBarChart("bar4", titlesz, "各地区残疾学生总数",4);
                    renderPieChart("schoolPie4", titlesz, "各地区残疾学生比例");
                }
                if (elem.index == 4) {
                    renderBarChart("bar5", titlesz, "各地区烈士及优抚子女学生总数",5);
                    renderPieChart("schoolPie5", titlesz, "各地区烈士及优抚子女学生比例");
                }
                if (elem.index == 5) {
                    renderBarChart("bar6", titlesz, "各地区申请资助学生总数",6);
                    renderPieChart("schoolPie6", titlesz, "各地区申请资助学生比例");
                }
                if (elem.index == 6) {
                    renderBarChart("bar7", titlesz, "各地区倍增学生总数",7);
                    renderPieChart("schoolPie7", titlesz, "各地区倍增学生比例");
                }
            });
            $(".section_bottom").find(".layui-this").click();
        },
        //加载表格
        initTable: function (selector,stid,bustype)
        {
           var $nowtable= $("#" + selector).parents(".layui-tab-item").eq(0).find(".detailtable").find("table");
           var $nowtbody= $("#" + selector).parents(".layui-tab-item").eq(0).find(".detailtable").find("table").find("tbody");
           var $bar= $("#" + selector).parents(".layui-tab-item").eq(0).find(".totalchart").find('.bar');
           $("#" + selector).parents(".layui-tab-item").eq(0).find(".aClick").show();
           $.ajax({
               type: "get",
               url: "/Hx_DGLargeData_Analysis/Count_EducationHot/GetSchoolList",
               data: "BUSTYPE="+bustype+"&STID="+stid,
               dataType:"json",
               success: function (json) {
                    $bar.hide();
                    $nowtbody.html('');
                   if (json.code != 200) {
                       layer.alert(json.info);
                       return;
                   }
                   var jsonData = json.data;
                   var data = jsonData.Data;
                   console.log(data)
                   $nowtable.show();
                   if(data.length > 0){
                        var html="";
                        var STUDENTNUMRATE="";
                        for (var i = 0; i < data.length; i++) {
                            if(data[i].STUDENTNUMRATE!=0){
                                STUDENTNUMRATE=data[i].STUDENTNUMRATE+"%"
                            }
                            html+="<tr>"+
                                        "<td style='text-align:center'>"+data[i].SCHOOLNAME+"</td>"+
                                        "<td style='text-align:center'>"+data[i].STUDENTNUM+"</td>"+
                                        "<td style='text-align:center'>"+data[i].SMALLSPAN+"</td>"+
                                        "<td style='text-align:center'>"+data[i].GIRLNUM+"</td>"+
                                        "<td style='text-align:center'>"+STUDENTNUMRATE+"</td>"+
                                    "</tr>"
                        }
                        console.log($nowtbody)
                        $nowtbody.append(html);
                   }else{
                         //$nowtable.hide();
                   }
                   
                   
               }
           });

        },
        //地图统计表格数据
        tableHtml: function (id, data,bigtitle) {
            var data = data.data;
            var sum = data.sum;
            var len = sum.length;
            var tbody = $('#' + id).find("tbody");
            $("#reg_table").find(".cityname").html(bigtitle);
            tbody.html('');
            if (len > 0) {
                for (var i = 0; i < len; i++) {
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
        //获取数据
        getData: function (callback)
        {
            $.ajax({
                type: "get",
                url: "/Hx_DGLargeData_Analysis/Count_EducationHot/GetList",
                data: null,
                dataType:"json",
                success: function (json) {
                    if (json.code != 200) {
                        layer.alert(json.info);
                        return;
                    }
                    CacheData = json.data;
                    callback();
                }
            });
        },
        //根据街镇ID获取JSON对象
        getJson: function ()
        {
            if (TabId == "") {
               return CacheData.Total;
            } else {
                var json = null;
                $.each(CacheData, function (i, s) {
                    if (s.STID == stid) {
                        json = s;
                        return s;
                    }
                })
                return json;
            }
        },
        aClick:function(){
            $(".aClick").click(function(){  
                $(this).siblings(".totalchart").find(".bar").show();
                $(this).siblings(".totalchart").find(".detailtable").find("table").hide();
                $(this).hide();
            });  
        }
    }
    me.init();
});