var map = null;
//判断是不是移动端
var if_moblie = true;
if (parseInt($(window).width()) <= 560) {
  if_moblie = false;
}
//获取地图的数据
var getMapData = null;
var baiduMap = {
  init: function () {
    baiduMap.baiduMap();
    //百度自带的搜索功能
    // /active.getSearchTip();
    baiduMap.searchBackBtn();
    //分类的点的点击事件
    baiduMap.typeTabPoint();
    var window_w = $(window).width();
    if (window_w <= 560) {
      $('.mobile-bg').fadeIn();
    }
  },
  baiduMap: function () {
    // var tileLayer = new BMap.TileLayer({
    //   isTransparentPng: true
    // });
    // tileLayer.getTilesUrl = function (tileCoord, zoom) {
    //   console.log(zoom + '/' + tileCoord.x + '_' + tileCoord.y + '/');
    //   var x = tileCoord.x;
    //   var y = tileCoord.y;
    //   return /*dir*/ 'tiles/' + zoom + '/' + x + '_' + y + '.png'; //
    // }
    let window_w = $(window).width();
    var zindex = 14;
    if (window_w <= 560) {
      zindex = 13
    }

    map = new BMap.Map('allmap', {
      minZoom: zindex,
      maxZoom: 22
    })

    //自定义样式

    window.BMap = BMap
    // map.addTileLayer(tileLayer);
    //map.addControl(new BMap.NavigationControl());
    map.centerAndZoom(new BMap.Point(110.597205, 20.902689), zindex)
    map.enableScrollWheelZoom();

    //设置首页的样式为黑夜
    // $.getJSON('../src/custom_map_config.json', function (data) {
    //   map.setMapStyleV2({
    //     styleJson: data
    //   });
    // })



    //设置可以显示的范围
    // var b = new BMap.Bounds(new BMap.Point(110.597205, 20.902689), new BMap.Point(110.597205, 20.902689));
    // try {
    //   BMapLib.AreaRestriction.setBounds(map, b);
    // } catch (e) {
    //   alert(e);
    // }
    //active.getLocation()
    // var markerArray = [{
    //   longitude: '110.5724540000',
    //   latitude: '20.8940390000',
    //   label: "2",
    //   title: "酒店"
    // }]
    // baiduMap.addMarker(markerArray)
    baiduMap.addPolyline()
    // var geolocation = new BMap.Geolocation();
    // geolocation.getCurrentPosition(function (r) {
    //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //     // map.panTo(r.point);
    //     alert('您的位置：' + r.point.lng + ',' + r.point.lat);
    //     var pt = r.point;
    //     var geoc = new BMap.Geocoder();
    //     geoc.getLocation(pt, function (rs) {
    //       var addComp = rs.addressComponents;
    //       alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

    //     });
    //   } else {
    //     alert('failed' + this.getStatus());
    //   }
    // }, {
    //   enableHighAccuracy: true
    // })z
  },
  //分类的点
  typeTabPoint: function () {
    $(".right-bar li").click(function (e) {
      let that = $(this);
      if (!that.hasClass('active')) {
        that.addClass("active").siblings().removeClass("active");
      }

      let name = that.find("span").html();
      let data = null;
      $("#suggestId")[0].value = name;
      if (name == "娱乐") {
        data = getMapData.recreationjt
      } else if (name == "住宿") {
        data = getMapData.hotel
      } else if (name == "交通") {
        data = getMapData.traffic
      } else if (name == "美食") {
        data = getMapData.food
      } else if (name == "超市") {
        data = getMapData.shop
      } else if (name == "攻略") {
        data = getMapData.psp
      }
      baiduMap.addMarker(data, 2);
      $(".tool-bar").removeClass("default-bar");
      $(".right-bar").removeClass("default-bar");
      $(".r-content").removeClass("default-bar");
      $("#app").removeClass("default");
    });
  },
  //判断当前的位置-params
  //return 当前的位置的经纬度
  getLocation: function () {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 1000
    }

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function (pos) {
        alert(
          '  经度：' +
          pos.coords.latitude +
          '  纬度：' +
          pos.coords.longitude +
          '  高度：' +
          pos.coords.altitude +
          '  精确度(经纬)：' +
          pos.coords.accuracy +
          '  精确度(高度)：' +
          pos.coords.altitudeAccuracy +
          '  速度：' +
          pos.coords.speed
        )
      })
    } else {
      //浏览器不支持geolocation
      alert('浏览器不支持geolocation')
    }
  },
  //添加覆盖物
  addPolyline: function () {
    var Polygon = new BMap.Polygon(
      [
        new BMap.Point(110.576104, 20.892653),
        new BMap.Point(110.5739270213, 20.8958612759),
        new BMap.Point(110.5711717761, 20.8951967079),
        new BMap.Point(110.5718134406, 20.8929544086)
      ], {
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: 'red'
      }
    ) //创建折线
    //map.addOverlay(Polygon) //增加折线
    baiduMap.getBoundary([
      new BMap.Point(110.576104, 20.892653),
      new BMap.Point(110.5739270213, 20.8958612759),
      new BMap.Point(110.5711717761, 20.8951967079),
      new BMap.Point(110.5718134406, 20.8929544086)
    ])
  },
  //设置区域图
  getBoundary: function (Polygon) {
    var bdary = new BMap.Boundary()
    bdary.get(Polygon, function (rs) {
      //获取行政区域
      var count = rs.boundaries.length //行政区域的点有多少个

      var pointArray = []
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 2,
          strokeColor: '#ff0000',
          fillOpacity: 0.5,
          fillColor: 'red'
        }) //建立多边形覆盖物

        map.addOverlay(ply) //添加覆盖物
      }
    })
  },
  //数据监听
  //添加marker 覆盖物
  addMarker: function (array, type) {
    let backData = [];

    $(array).each(function (index, item) {
      let itemData = null;

      var point2 = new BMap.Point(item.latitude, item.longitude);

      if (type == 1) {
        var myIcon = new BMap.Icon(
          '../src/icon/jw.png',
          new BMap.Size(23, 35)
        )
        let marker = new BMap.Marker(point2, {
          icon: myIcon
        }) // 创建点
        var label = new BMap.Label('2', {
          offset: new BMap.Size(5, 4)
        })
        label.setStyle({
          background: 'none',
          color: 'red',
          border: 'none' //只要对label样式进行设置就可达到在标注图标上显示数字的效果
        })
        marker.setLabel(label) //显示地理名称 a
        map.addControl(
          new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
          })
        )
        //设置第二个地点
        map.addOverlay(marker)
        //标注点的点击事件
        marker.addEventListener('click', baiduMap.markerListen)
        // /     marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
        return;
      }

      // 圆形覆盖物
      function customOverlay(point) {
        this.point = point
      }
      customOverlay.prototype = new BMap.Overlay()
      // 初始化，设置覆盖物形状
      customOverlay.prototype.initialize = function () {
        var div = (this.div = document.createElement('div'))
        var childDiv = document.createElement('i');
        var childDiv2 = document.createElement('div')
        // childDiv.src =
        //   '../src/hua.png'
        childDiv.className = 'iconfont icon-zuobiaofill  circle-marker-child'
        childDiv2.className = 'triangle'
        div.appendChild(childDiv);
        div.appendChild(childDiv2)
        div.className = 'circle-marker'
        map.getPanes().labelPane.appendChild(div)
      }
      customOverlay.prototype.addEventListener = function (event, fun) {
        this.div['on' + event] = fun;
      }
      // 覆盖物的位置
      customOverlay.prototype.draw = function () {
        var p = map.pointToOverlayPixel(this.point)
        this.div.style.left = p.x + 'px'
        this.div.style.top = p.y + 'px'
      }

      var marker2 = new customOverlay(point2)
      map.addOverlay(marker2)
      //   map.addOverlay(marker); 
      marker2.addEventListener('click', function () {
        let sContent =
          "<div class='infoWin_box'><h4 >天安门</h4>" +
          "<div class='img-w info_windows_img'><img  id='imgDemo' src='../src/1.jpg'   class='' title='天安门'/></div>" +
          "<p class='content'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" +
          "</div>";
        let infoWindow = new BMap.InfoWindow(sContent, point2); // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, point2);
      });

    })
  },
  //marker的点击事件
  markerListen: function (point, type) {

    var opts = {
      width: 250, // 信息窗口宽度
      height: 80, // 信息窗口高度
      title: "信息窗口", // 信息窗口标题
      enableMessage: true //设置允许信息窗发送短息
    };
    // 百度地图API功能
    let sContent =
      "<div class='infoWin_box'><h4 >天安门</h4>" +
      "<div class='img-w info_windows_img'><img  id='imgDemo' src='../src/1.jpg'   class='' title='天安门'/></div>" +
      "<p class='content'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" +
      "</div>";
    let infoWindow = new BMap.InfoWindow(sContent, point); // 创建信息窗口对象 

    if (type == 'default') {
      map.openInfoWindow(infoWindow, point);
    } else {
      this.openInfoWindow(infoWindow);
    }
    //infoWindow.disableAutoPan();//关闭打开信息窗口时地图自动平移。
    //图片加载完毕重绘infowindow
    //	   document.getElementById('imgDemo').onload = function (){
    //		   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
    //	   }
    //	console.log('markerListen', e);
  },
  //百度原生的搜索框输入提示
  //name 搜索框的class
  getSearchTip: function (classname) {
    var ac = new BMap.Autocomplete( //建立一个自动完成的对象
      {
        "input": "suggestId",
        "location": map
      });
    ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件

      var str = "";
      var _value = e.fromitem.value;
      var value = "";
      if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

      value = "";
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
      G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
      var _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

      setPlace();
    });
    //百度地图API功能-搜索功能-getSearchTip
    function setPlace() {
      map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp)); //添加标注
      }
      var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }
    // 百度地图API功能-搜索功能
    function G(id) {
      return document.getElementById(id);
    }
  },
  //搜索框的关闭按钮  
  searchBackBtn: function () {
    $(".search-btn").click(function () {

      var myKeys = $("#suggestId")[0].value;
      var local = new BMap.LocalSearch(map, {
        renderOptions: {
          map: map,
          panel: "r-result"
        },
        pageCapacity: 4
      });
      local.searchInBounds(myKeys, map.getBounds());

    });
    //关闭按钮
    $(".back-btn").click(function () {
      $(".poidetail").fadeOut();
    });

    var window_w = $(window).width();
    if (window_w <= 560) {
      $(".tool-bar").removeClass("default-bar");
      return;
    }

    //搜索框获取焦点功能
    $("#suggestId").focus(function () {
      $(".tool-bar").removeClass("default-bar");
      $(".right-bar").removeClass("default-bar");
      $(".r-content").removeClass("default-bar");
      $("#app").removeClass("default");
    });
    //搜索框获取焦点功能
    $("#suggestId").blur(function () {

      if ($("#suggestId")[0].value == "") {
        $(".tool-bar").addClass("default-bar");
        $(".right-bar").addClass("default-bar");
        $(".r-content").addClass("default-bar");
        $("#app").addClass("default");
      }
    });
    //搜索框获取焦点功能
    $("#suggestId").click(function () {

      if ($("#suggestId")[0].value == "") {
        $(".tool-bar").removeClass("default-bar");
        $(".right-bar").removeClass("default-bar");
        $(".r-content").removeClass("default-bar");
        $("#app").removeClass("default");
      }
    });
    //搜索框获取焦点功能
    $("#allmap").click(function () {
      if ($("#suggestId")[0].value == "") {
        $(".tool-bar").addClass("default-bar");
        $(".right-bar").addClass("default-bar");
        $(".r-content").addClass("default-bar");
        $("#app").addClass("default");
      }
    });



  },

  //导航功能
  getGps: function () {

  },
}
//ajaxurl
const ajaxUrl = {
  mapDataUrl: "../src/getMapData.json"
}

//获取ajax的数据
var ajaxData = {
  //获取地图的数据
  getMapData: function () {

    $.getJSON(ajaxUrl.mapDataUrl, function (data) {
      getMapData = data.data.typelist;
    })
  },

}

//天气的情况，
//变化地图的样式，天气的动画
var weather = {
  init: function () {

  },
  //得到天气的api
  getJson: function () {

  }
}

//轮播图的初始化
var swiper = {
  init: function () {
    swiper.headSwiper();
    swiper.newSwiper();
    swiper.hammerInit();
  },
  //向上拖拉功能的-ionic
  hammerInit: function () {
    //  处理高度的问题
    let next_div = $("#more-function");
    let el = document.getElementById("more-function");
    $(el).css({
      "height": $(window).height() - next_div.offset().top - 1 + 'px'
    })
    var default_h = next_div.offset().top;
    var hammer = new Hammer(el);
    hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });
    var pos_x = $("#more-function").position().left;
    var pos_y = $("#more-function").position().top;
    var box_h = $("#more-function").height();
    hammer.on("pan", function (e) {
      let offset_h = pos_y + e.deltaY;
      if (e.deltaY > 0 && default_h <= offset_h) {
        console.log("到底了");
        $("#more-function").css("transform", 'translateY(' + default_h + 'px)');
        $(el).css({
          "height": $(window).height() - default_h + 'px'
        })
        return;
      } else if (e.deltaY < 0 && offset_h <= $(window).height() * 0.4) {
        console.log("到顶了");
        $("#more-function").css("transform", 'translateY(' + $(window).height() * 0.4 + 'px)');
        $(el).css({
          "height": $(window).height() * 0.6 + 'px'
        })
        return;
      }
      $("#more-function").css("transform", 'translateY(' + (offset_h) + 'px)');
      $(el).css({
        "height": $(window).height() - next_div.offset().top + 'px'
      })
    });

    var container_width = $("#more-function").width();
    var container_height = $("#more-function").height();
    hammer.on("panend", function () {
      pos_x = $("#more-function").position().left;
      pos_y = $("#more-function").position().top;
      if (Math.abs(pos_x - container_width / 2) < 50 &&
        Math.abs(pos_y - container_height / 2) < 50) {

      } else {}
    });


  },
  headSwiper: function () {

    var swiper = new Swiper('.nav-swiper', {
      slidesPerView: 1,
      direction: 'vertical',
      autoplay: true,
      speed: 3500,
      loop: true,
      lazyLoading: true, //启动延迟加载
      //  slidesPerColumn: 2, //显示两行
      // spaceBetween: 20,
      //			      slidesPerGroup: 5,
      //			      loop: true,
      //			      loopFillGroupWithBlank: true,
    });
  },
  //新闻的sweiper
  newSwiper: function () {
    var swiper = new Swiper('.new-swiper', {
      // loop: true,

      // spaceBetween: 10,
      centeredSlides: true,
      // slidesPerView: 'auto',
      slidesPerView: 1.5,
      initialSlide: 1,
      watchActiveIndex: true,
      onSwiperCreated: function (swiper) {

      },
      onTouchMove: function (swiper) {
        console.log("swiper", swiper);
      },
    });
  }
}