// 初始化地图
var BMapExt = new BMapExtension(domMain, BMap, require('echarts'), require('zrender'));
var map = BMapExt.getMap();
var container = BMapExt.getEchartsContainer();
var point = new BMap.Point(startPoint.x, startPoint.y);
map.centerAndZoom(point, 5);
map.enableScrollWheelZoom(true);



option = {
    color: ['gold', 'aqua', 'lime'],
    title: {
        text: '模拟迁徙',
        subtext: '数据纯属虚构',
        x: 'right'
    },
    tooltip: {
        trigger: 'item',
        formatter: function (v) {
            return v[1].replace(':', ' > ');
        }
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['北京', '上海', '广州'],
        selectedMode: 'single',
        selected: {
            '上海': false,
            '广州': false
        }
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        x: 'right',
        y: 'center',
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    dataRange: {
        min: 0,
        max: 100,
        y: '60%',
        calculable: true,
        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua']
    },
    series: [
        {
            name: '北京',
            type: 'map',
            mapType: 'none',
            data: [],
            markLine: {
                smooth: true,
                effect: {
                    show: true,
                    scaleSize: 1,
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
                },
                data: [
                    [{ name: '北京' }, { name: '上海', value: 95 }],
                    [{ name: '北京' }, { name: '广州', value: 90 }],
                    [{ name: '北京' }, { name: '大连', value: 80 }],
                    [{ name: '北京' }, { name: '南宁', value: 70 }],
                    [{ name: '北京' }, { name: '南昌', value: 60 }],
                    [{ name: '北京' }, { name: '拉萨', value: 50 }],
                    [{ name: '北京' }, { name: '长春', value: 40 }],
                    [{ name: '北京' }, { name: '包头', value: 30 }],
                    [{ name: '北京' }, { name: '重庆', value: 20 }],
                    [{ name: '北京' }, { name: '常州', value: 10 }]
                ]
            },
            markPoint: {
                symbol: 'emptyCircle',
                symbolSize: function (v) {
                    return 10 + v / 10
                },
                effect: {
                    show: true,
                    shadowBlur: 0
                },
                itemStyle: {
                    normal: {
                        label: { show: false }
                    }
                },
                data: [
                    { name: '上海', value: 95 },
                    { name: '广州', value: 90 },
                    { name: '大连', value: 80 },
                    { name: '南宁', value: 70 },
                    { name: '南昌', value: 60 },
                    { name: '拉萨', value: 50 },
                    { name: '长春', value: 40 },
                    { name: '包头', value: 30 },
                    { name: '重庆', value: 20 },
                    { name: '常州', value: 10 }
                ]
            }
        }
    ]
};

if (myChart && myChart.dispose) {
    myChart.dispose();
}
myChart = BMapExt.initECharts(container, curTheme);
window.onresize = myChart.resize;
BMapExt.setOption(option, true)
