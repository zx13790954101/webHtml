"use strict";
window.onload =function(){
	BaiduMap.loadJScript();  //异步加载地图
} 

var BaiduMap = {
    //初始化地图的div位置
    map: "dituContent",
    //地图的名字
    initStratAddress:"",
    loadJScript:function() {
	    var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = "http://api.map.baidu.com/api?v=2.0&amp;ak=UCXTKdp9dpdTdvimMx11ZFqpQPagGAp9&callback=BaiduMap.initMap";
	    document.body.appendChild(script);
	},
	loadJScript2:function() {
	    var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = "http://api.map.baidu.com/api?v=2.0&amp;ak=UCXTKdp9dpdTdvimMx11ZFqpQPagGAp9&callback=BaiduMap.definiteMap";
	    document.body.appendChild(script);
	},
	//添加点
    definiteMap:function(){
//  		BaiduMap.definiteMap("detailcenter",'113.30764968','23.1200491');
    	var map= new BMap.Map("detailcenter");
    	var point = new BMap.Point('113.30764968','23.1200491');
    	map.centerAndZoom(new BMap.Point('113.30764968', '23.1200491'), 18);
    	var marker = new BMap.Marker(point);  // 创建标注
	    map.addOverlay(marker);              // 将标注添加到地图中
    },
    //初始化地图
    initMap: function () {
        //百度地图的初始化
        var map = new BMap.Map(BaiduMap.map);
        var initStratAddress = BaiduMap.initStratAddress;
        if(initStratAddress!=''){
            map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 15);
        }else{
        	map.centerAndZoom(initStratAddress, 15);
        }
        window.map = map; //将map变量存储在全局
        BaiduMap.setMapEvent();
        //定位
        var geolocation = new BMap.Geolocation();
        var gc = new BMap.Geocoder();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {

                var pt = r.point;  
                gc.getLocation(pt, function (rs) {
                    var addComp = rs.addressComponents;

                    var province = addComp.province;
                    var city = addComp.city;
                    var area = addComp.district;

                    if (province != "" && city != "" && area != "") {
                        //城市的名字
                           $("#select-city").val(province + "-" + city + "-" + area);
                        //2018年4月28号，只显示区的显示
                     //   $("#select-city").val(area + " | 切换 |");
                        //if (localStorage.getItem("address")) {
                        //    $("#select-city").val(localStorage.getItem("address"));
                        //}
                        map.centerAndZoom(province+city+area, 15);
                    }
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    localStorage.setItem("address", area + " [ 切换 ]");
                    localStorage.setItem("address2", province + "-" + city + "-" + area);
                    var nameaddress = province + "-" + city + "-" + area;
                    console.log(nameaddress);
                    $("#select-city").attr("title", nameaddress);
                    if (localStorage.getItem("address")) {
                        $("#select-city").val(localStorage.getItem("address"));
                        $("#select-city").attr("title", province + "-" + city + "-" + area);
                    }
                    //地图缩放
                    map.setZoom(17);
                });
                //console.log('address', area + " [ 切换 ]")
                //console.log('地址', localStorage.getItem("address"))
            }
            else {
                console.log('failed' + this.getStatus());
            }
        }, { enableHighAccuracy: true })
        //定位

  
        //拖动的点击事件
        map.addEventListener("dragend", function (e) {

            if ($("#suggestId").val() == "") {
                //重新回到拖动的经纬度比
                BaiduMap.searchMap();
            }
          
        });
   
        //var myCity = new BMap.LocalCity();
        //myCity.get(myFun);
        //定位功能只能是市

        setTimeout(function () {
            BaiduMap.searchMap();//开始第一次的搜索
        }, 1000);
     
       

        //搜索框的点击事件，enter的实现方式
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) { // enter 键
                //要做的事情,判断鼠标是否在这个地图的div上面不
                if ($(".search-box .map-search").is(':focus')) {
                    BaiduMap.searchMap();//开始第一次的搜索
                    //BaiduMap.addMarker();
                } else {
              
                }
           
            }
        };

   
    },
    BaiduMapsearchMap :function(){
        console.log($(".search-box .map-search").val());
    },
    myFun:function(result) {
        console.log("result", result);
        var cityName = result.name;
        map.setCenter(cityName);
    },
    //地图事件设置函数：
    setMapEvent:function() {
        map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
        map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard(); //启用键盘上下左右键移动地图
    
        $(".BMap_cpyCtrl").css({ "display": "none" });
        $(".anchorBL").css({ "display": "none" });
    },
    //搜索框,type根据type的类型来判断是否是搜索框的判断事件
    searchMap: function (type) {

        var setTime = setInterval(function () {

            if (map.getBounds().getSouthWest() != null) {
                setTimeout(function () {
                  //  localStorage.setItem("address", $("#select-city").val());
                    var bs = map.getBounds();
                    var bssw = bs.getSouthWest();
                    var bsne = bs.getNorthEast();
                    var LowerLeftCoordinate = bssw.lng + "," + bssw.lat;
                    var UpperRightCoordinate = bsne.lng + "," + bsne.lat;
                    map.clearOverlays();
                    BaiduMap.GetMorePoint(LowerLeftCoordinate, UpperRightCoordinate);
                    clearInterval(setTime);
                    if (localStorage.getItem("address")) {
                        $("#select-city").val(localStorage.getItem("address"));
                    }
                 },500);
             
            }

        }, 500);
        //删除点
        //var allOverlay = map.getOverlays();
        //for (var i = 0; i < allOverlay.length - 1; i++) {
        //    map.removeOverlay(allOverlay[i]);
        //}
        //全部删除点
 
    },
    addMarker:function(){
        var datapoint = {
            Name: $(".search-box .map-search").val()
        }
        $.ajax({
            url: "/Company/GetAllSchoolAddress",
            type: "post",
            dataType: "json",
            data: datapoint,
            success: function (data) {
                if (data.Status.Code == 200) {
                    if (data.ReturnData.length > 1) {
                     
                        $(data.ReturnData).each(function (index, item) {
                            // 百度地图API功能
                            var marker = new BMap.Marker(new BMap.Point(item.F_LONGITUDE, item.F_LATITUDE)); // 创建点
                            map.addOverlay(marker);//增加点
                            //添加方法的初始化
                            //  addClickHandler(sContent, marker);
                            var removeMarker = function (e, ee, marker) {
                                map.removeOverlay(marker);
                            }
                        });
                    } else {
                        $(data.ReturnData).each(function (index, item) {

                            // 百度地图API功能
                            var marker = new BMap.Marker(new BMap.Point(item.F_LONGITUDE, item.F_LATITUDE)); // 创建点
                           
                            map.addOverlay(marker);//增加点
                            //添加方法的初始化
                            //  addClickHandler(sContent, marker);
                            var removeMarker = function (e, ee, marker) {
                                map.removeOverlay(marker);
                            };
                            map.centerAndZoom(new BMap.Point(item.F_LONGITUDE, item.F_LATITUDE), 18);
                        });
                    }
              
                } else {
                    console.log("异常报告",data.Status.Code+data.Status.Remark );
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息   
                console.log(textStatus);
            }

        });
    },
    DateType:function(data) {
            if (typeof (data) == undefined) {
                return "";
            } else if (!data && typeof (data) != "undefined" && data != 0) {
                return "";
            } else if (data == null) {
                return "";
            } else {
                return data;
             }
    },
    mapDelect: function(){
        $(".search-box .map-search-ul").css({ height: "0px" });
        $("#suggestId").val("");
    },
    //获取点,名字，左上角的区间，右下角的区间,type=判断搜索类型
    GetMorePoint:function(LowerLeftCoordinate, UpperRightCoordinate) {
        var datapoint = {
           LowerLeftCoordinate: LowerLeftCoordinate
           , UpperRightCoordinate: UpperRightCoordinate
        }
        //判断是否有值
        console.log("aaaa",$(".search-box .map-search").val());
        if ($(".search-box .map-search").val()!= '') {
            datapoint = {
                Name: $(".search-box .map-search").val()
                , LowerLeftCoordinate: LowerLeftCoordinate
                , UpperRightCoordinate: UpperRightCoordinate
            };
        } 

        $.ajax({
            url: "/Company/GetAllSchoolAddress",
            type: "post",
            data: datapoint,
            dataType: "json",
            success: function (data) {
                if (data.Status.Code == 200) {
                   
                    $(data.ReturnData).each(function (index, item) {
                        // 百度地图API功能
                        var marker = new BMap.Marker(new BMap.Point(item.F_LONGITUDE, item.F_LATITUDE)); // 创建点
                      //  console.log("经纬度",item.F_LONGITUDE, item.F_LATITUDE)
                        map.addOverlay(marker);//增加点
                        var sContent = '<li ><a href="/Company/Index/' + item.F_SCHOOLID + '" class="map_title"  target="_blank">\
                                            <h4> ' + BaiduMap.DateType(item.F_SC_NAME) + '</h4>\
                                            <h5 class="">地址: ' + BaiduMap.DateType(item.F_ADDR) + '</h5></a>\
                                            <div class="img-responsive"><img src="' + item.F_SCHOOLLOGOSRC + '"  style="width: 100%;height: auto;"/></div>\
                                            <h5 class="adress">联系电话:  ' + BaiduMap.DateType(item.F_OFFICE_PHONE) + '</h5>\
                                            <h5 class="adress">邮政编码: ' + BaiduMap.DateType(item.F_CLIENT_CODE) + '</h5>\
                                            <h5 class="adress">电子邮箱: ' + BaiduMap.DateType(item.F_FILLER_EMAIL) + '</h5>\
                                            <h5 class="adress">联 系 人: ' + BaiduMap.DateType(item.F_LEGAL_NAME) + '</h5>\
                                            <h5 class="adress">概况</h5><h5>' + BaiduMap.DateType(item.F_INTRODUCE) + '</h5>\
                                            </li>';
                        var contentmap = " ";
                        var opts = {
                            width: 180,
                            height: 10,
                            title: BaiduMap.DateType(item.F_SC_NAME), // 信息窗口标题
                            enableMessage: true//设置允许信息窗发送短息
                        }

                        var infoWindow = new BMap.InfoWindow(contentmap, opts);
                        //点击标注点事件
                        marker.addEventListener("click", function (e) {
                            this.openInfoWindow(infoWindow, new BMap.Point(item.LONGITUDE, item.DIMENSION)); //开启信息窗口
                            //点的搜索框的显示事件
                            var html = '<li>    ' + item.F_SC_NAME + ' </li>';
                            $(".map-search-ul").html(sContent);

                            $(".search-box .map-search-ul").css({ height: "auto" });
                        });

                        //添加方法的初始化
                        //  addClickHandler(sContent, marker);
                        var removeMarker = function (e, ee, marker) {
                            map.removeOverlay(marker);
                        }
                    });
                    if (data.ReturnData.length == 1) {
                        $(data.ReturnData).each(function (index, item) {
                            map.centerAndZoom(new BMap.Point(item.F_LONGITUDE, item.F_LATITUDE), 20);
                        });
                    }
                  

                } else {
                    console.log("异常报告",data.Status.Code+data.Status.Remark );
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息   
                console.log(textStatus);
            }

        });
    }
};


function addClickHandler(content, marker) {
    marker.addEventListener("click", function (e) {
        openInfo(content, e);
        var html = '<li>    ' + content + ' </li>';
        $(".map-search-ul").html(content);
    }
    );
}
function openInfo(content, e) {
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow, point); //开启信息窗口
}