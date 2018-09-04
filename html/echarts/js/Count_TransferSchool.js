layui.use(['form', 'element'], function () {
    var $ = layui.jquery,
        form = layui.form,
        element = layui.element;

    var CacheData = { Data: [], Total: {} };
    var TabId = "";
    var iszhuanru = true;
    var selectname = "";
    var me = {
        //初始化入口
        init: function () {
            var xAxisData = new Array();
            var TabId = StreetJsonData[0].idcode;
            $.get('js/dongguan.json?v=' + Math.random(), function (geoJson) {
                echarts.registerMap('dongguan', geoJson);
                me.getData(TabId, function (resultData) {
                    //加载地图
                    me.initMap(resultData);
                });
            });

            //点击页卡切换
            element.on('tab(transferschool_tab)', function (elem) {
                if (elem.index == 0) {
                    iszhuanru = true;
                } else {
                    iszhuanru = false;
                }
                me.initMap(CacheData.Data);
            });

        },
        convertData: function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = StreetJsonData2[dataItem[0].name];
                var toCoord = StreetJsonData2[dataItem[1].name];
                if (fromCoord && toCoord) {
                    //箭头的方向
                    if (iszhuanru) {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [toCoord, fromCoord]
                        });
                    } else {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [fromCoord, toCoord]
                        });
                    }
                }
            }
            return res;
        },
        //获取最大数
        getVisualMapMaxNum: function () {
            var max = 0;
            $.each(CacheData.Data, function (i, json) {
                if (iszhuanru) {
                    if (parseInt(json.PROVINCEINTO) >= max) {
                        max = json.PROVINCEINTO;
                    }
                } else {
                    if (parseInt(json.PROVINCEOUT) >= max) {
                        max = json.PROVINCEOUT;
                    }
                }
            });
            return max + 10;
        },
       
        //加载地图
        initMap: function (resultData) {

            var $titlekeysz = Object.keys(StreetJsonData2);
            var titlesz = JSON.stringify(StreetJsonData2);
            titlesz = eval('(' + titlesz + ')');
            for (var j in titlesz)
            {
                titlesz[j] = false;
                if (j == selectname)
                {
                    titlesz[j] = true;
                }
            }
           
            var AllAreaData = [];
            $($titlekeysz).each(function (index, element) {
                var data = {
                    name: element
                }
                var array = [];//一个地方对应的多一个地方的数据
                $($titlekeysz).each(function (index2, element2) {
                    var array2 = []
                    var thisvalue = 0;
                    $.each(resultData, function (i, json) {
                        if (StreetJsonCom.getJsonInfoByName(element2).idcode == json.STID) {
                            if (iszhuanru) {
                                thisvalue = json.PROVINCEINTO;
                            } else {
                                thisvalue = json.PROVINCEOUT;
                            }
                        }
                    })
                    var data2 = {
                        name: element2,
                        value: thisvalue
                    }
                    array2.push(data);
                    array2.push(data2);
                    array.push(array2);
                });

                var array3 = [];
                array3.push(element);
                array3.push(array);
                AllAreaData.push(array3);
            });

            var SeriesData = [];
            AllAreaData.forEach(function (item, i) {
                SeriesData.push({
                    name: item[0],
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 2
                    },
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            shadowBlur: 21,
                            color: '#3DBEF5',
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    markLine: {
                        smooth: true,
                        effect: {
                            show: true,
                            scaleSize: 2,
                            period: 30,
                            color: '#fff',
                            shadowBlur: 10
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        }
                    },
                    data: me.convertData(item[1])
                }, {
                    name: item[0],
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: 'circle',
                        symbolSize: 4,
                        color: "white"
                    },
                    lineStyle: {
                        normal: {
                            color: '#3DBEF5',
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: me.convertData(item[1])
                }, {
                    name: item[0],
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 1,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: '#3DBEF5'
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: StreetJsonData2[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
            });

            var myChart = echarts.init(document.getElementById("container"));
            var option = {
                backgroundColor: '#404a59',
                title: {
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}' //<br/>{c}
                },
                //自定义头部的数据
                legend: {
                    orient: 'vertical',
                    top: '10',
                    x: '10',
                    selectedMode: false,
                    data: Object.keys(StreetJsonData2),
                    textStyle: {
                        color: '#3DBEF5'
                    },
                    padding: 10, // [5, 10, 15, 20]
                    itemGap: 10,
                    selectedMode: 'single',
                    selected: titlesz
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                //热力图
                dataRange: {
                    min: 0,
                    max: me.getVisualMapMaxNum(),
                    x: 'right',
                    calculable: true,
                    color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                geo: {
                    show: true,
                    //修改的地图的位置与上面导入的dongguan.json 文件有关
                    map: 'dongguan',
                    type: 'map',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#323c48',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                },
                series: SeriesData
            }
            myChart.setOption(option, true);
            //绑定地图页卡切换事件，重新查数渲染
            myChart.on('legendselectchanged', function (obj) {
                me.getData(StreetJsonCom.getJsonInfoByName(obj.name).idcode, function (resultData) {
                    //加载地图
                    selectname = obj.name;
                    myChart.off("legendselectchanged");
                    me.initMap(resultData, obj.name);
                    myChart = null;
                });
            });
        },
        //获取数据
        getData: function (STID, callback) {
            $.ajax({
                type: "get",
                url: "http://127.0.0.1:8020/webHtml/html/echarts/js/Count_TransferSchool_GetList.json?STID=441918",
               // data: {STID:STID},
                dataType: "json",
                success: function (json) {
                    if (json.code != 200) {
                        layer.alert(json.info);
                        return;
                    }
                    CacheData = json.data;
                    var html = '';
                    var html1 = '';
                    var html2 = '';
                    $(json.data.Data).each(function (index, element) {
                        html += ' <li class="flex-center">' +
                                    '   <span class="num">' + index + '</span>' +
                                    '  <span class="cityName">' + element.STNAME + '</span>' +
                                        '<span class="number">' + element.PROVINCEINTO + '人</span>' +
                                        ' <span class="percent">' + element.PROVINCEINTORATE + '%</span> </li> '
                        html1 += ' <li class="flex-center">' +
                                '   <span class="num">' + index + '</span>' +
                                    '  <span class="cityName">' + element.STNAME + '</span>' +
                                    '<span class="number">' + element.PROVINCEOUT + '人</span>' +
                                    ' <span class="percent">' + element.PROVINCEOUTRATE + '%</span> </li> '
                        html2 += ' <li class="flex-center">' +
                                '   <span class="num">' + index + '</span>' +
                                    '  <span class="cityName">' + element.STNAME + '</span>' +
                                    '<span class="number">' + element.NETTRANSFER + '人</span>'

                    });
                    $("#transferschool_right").html(html);
                    $("#transferschool_right1").html(html1);
                    $("#transferschool_right2").html(html2);
                    callback(json.data.Data);
                }
            });
        }
    }
    me.init();
});
