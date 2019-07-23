//2019/7/16/8:47
//https://www.cnblogs.com/RiseSoft/p/7979637.html
//https://www.cnblogs.com/yaotome/p/8877551.html
//https://www.haolizi.net/example/view_18540.html

var map = null
var active = {
  init: function() {
    active.baiduMap()
  },
  baiduMap: function() {
    // var tileLayer = new BMap.TileLayer({
    //   isTransparentPng: true
    // });
    // tileLayer.getTilesUrl = function (tileCoord, zoom) {
    //   console.log(zoom + '/' + tileCoord.x + '_' + tileCoord.y + '/');
    //   var x = tileCoord.x;
    //   var y = tileCoord.y;
    //   return /*dir*/ 'tiles/' + zoom + '/' + x + '_' + y + '.png'; //
    // }

    map = new BMap.Map('allmap', {
      minZoom: 14,
      maxZoom: 22
    })
    window.BMap = BMap
    // map.addTileLayer(tileLayer);
    //map.addControl(new BMap.NavigationControl());
    map.centerAndZoom(new BMap.Point(110.597205, 20.902689), 14)
    map.enableScrollWheelZoom()
    //设置可以显示的范围
    // var b = new BMap.Bounds(new BMap.Point(110.597205, 20.902689), new BMap.Point(110.597205, 20.902689));
    // try {
    //   BMapLib.AreaRestriction.setBounds(map, b);
    // } catch (e) {
    //   alert(e);
    // }
    active.getLocation()
    var markerArray = [
      {
        longitude: '110.5724540000',
        latitude: '20.8940390000'
      }
    ]
    active.addMarker(markerArray)
    active.addPolyline()
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
    // })
  },
  //判断当前的位置-params
  //return 当前的位置的经纬度
  getLocation: function() {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 1000
    }

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(pos) {
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
  addPolyline: function() {
    var Polygon = new BMap.Polygon(
      [
        new BMap.Point(110.576104, 20.892653),
        new BMap.Point(110.5739270213, 20.8958612759),
        new BMap.Point(110.5711717761, 20.8951967079),
        new BMap.Point(110.5718134406, 20.8929544086)
      ],
      {
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: 'red'
      }
    ) //创建折线
    //map.addOverlay(Polygon) //增加折线
    active.getBoundary([
      new BMap.Point(110.576104, 20.892653),
      new BMap.Point(110.5739270213, 20.8958612759),
      new BMap.Point(110.5711717761, 20.8951967079),
      new BMap.Point(110.5718134406, 20.8929544086)
    ])
  },
  //设置区域图
  getBoundary: function(Polygon) {
    var bdary = new BMap.Boundary()
    bdary.get(Polygon, function(rs) {
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
  addMarker: function(array) {
    let backData = []
    $(array).each(function(index, item) {
      let itemData = null
      var myIcon = new BMap.Icon(
        'http://127.0.0.1:8020/webHtml/linzesenWeb/naozhouren/src/icon/jw.png',
        new BMap.Size(23, 35)
      )

      let marker = new BMap.Marker(new BMap.Point('110.562173', '20.902287'), {
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
      // 圆形覆盖物
      function customOverlay(point) {
        this.point = point
      }
      customOverlay.prototype = new BMap.Overlay()
      // 初始化，设置覆盖物形状
      customOverlay.prototype.initialize = function() {
        var div = (this.div = document.createElement('div'))
        var childDiv = document.createElement('img')
        childDiv.src =
          '../src/hua.png'
        childDiv.className = 'circle-marker-child'
        div.appendChild(childDiv)
        div.className = 'circle-marker'
        map.getPanes().labelPane.appendChild(div)
      }
      // 覆盖物的位置
      customOverlay.prototype.draw = function() {
        var p = map.pointToOverlayPixel(this.point)
        this.div.style.left = p.x - 35 + 'px'
        this.div.style.top = p.y - 35 + 'px'
      }
      var point2 = new BMap.Point(item.longitude, item.latitude)
      var marker2 = new customOverlay(point2)
      map.addOverlay(marker2)
      //   map.addOverlay(marker);
      marker2.addEventListener('click', function() {
        console.log('点击了自定义覆盖物')
      })
      //设置第二个地点
      var point3 = new BMap.Point('110.563879', '20.900497')
      let marker3 = new BMap.Marker(point3)
      map.addOverlay(marker3)
      map.addOverlay(marker)
      marker.addEventListener('click', active.markerListen)
      marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
    })
  },
  //marker的点击事件
  markerListen: function(e) {
    console.log('markerListen', e)
  }
}

var getLocation = {
  //浏览器原生获取经纬度方法
  latAndLon: function(callback, error) {
    var that = this
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var latitude = position.coords.latitude
          var longitude = position.coords.longitude
          localStorage.setItem('latitude', latitude)
          localStorage.setItem('longitude', longitude)
          var data = {
            latitude: latitude,
            longitude: longitude
          }
          if (typeof callback == 'function') {
            callback(data)
          }
        },
        function() {
          if (typeof error == 'function') {
            error()
          }
        }
      )
    } else {
      if (typeof error == 'function') {
        error()
      }
    }
  },

  //微信JS-SDK获取经纬度方法
  weichatLatAndLon: function(callback, error) {
    var that = this
    var timestamp = new Date().getTime() + ''
    timestamp = timestamp.substring(0, 10)
    var ranStr = randomString()

    //微信接口配置
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'XXXXXXXXXXXXXXXXX', // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: ranStr, // 必填，生成签名的随机串
      signature: 'XXXXXXXXXXXXXXXXX', // 必填，签名，见附录1
      jsApiList: ['checkJsApi', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })

    //参见微信JS SDK文档：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
    wx.ready(function() {
      wx.getLocation({
        success: function(res) {
          var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed // 速度，以米/每秒计
          var accuracy = res.accuracy // 位置精度
          localStorage.setItem('latitude', latitude)
          localStorage.setItem('longitude', longitude)
          var data = {
            latitude: latitude,
            longitude: longitude
          }
          if (typeof callback == 'function') {
            callback(data)
          }
        },
        cancel: function() {
          //这个地方是用户拒绝获取地理位置
          if (typeof error == 'function') {
            error()
          }
        }
      })
    })
    wx.error(function(res) {
      if (typeof error == 'function') {
        error()
      }
    })
  },
  //将经纬度转换成城市名和街道地址，参见百度地图接口文档：http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-geocoding
  cityname: function(latitude, longitude, callback) {
    $.ajax({
      url:
        'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' +
        latitude +
        ',' +
        longitude +
        '&output=json&pois=1',
      type: 'get',
      dataType: 'jsonp',
      jsonp: 'callback',
      success: function(data) {
        console.log(data)
        var province = data.result.addressComponent.province
        var cityname = data.result.addressComponent.city
        var district = data.result.addressComponent.district
        var street = data.result.addressComponent.street
        var street_number = data.result.addressComponent.street_number
        var formatted_address = data.result.formatted_address
        localStorage.setItem('province', province)
        localStorage.setItem('cityname', cityname)
        localStorage.setItem('district', district)
        localStorage.setItem('street', street)
        localStorage.setItem('street_number', street_number)
        localStorage.setItem('formatted_address', formatted_address)
        //domTempe(cityname,latitude,longitude);
        var data = {
          latitude: latitude,
          longitude: longitude,
          cityname: cityname
        }
        if (typeof callback == 'function') {
          callback(data)
        }
      }
    })
  },
  //设置默认城市
  setDefaultCity: function(callback) {
    alert('获取地理位置失败！')
    //默认经纬度
    var latitude = '31.337882'
    var longitude = '120.616634'
    var cityname = '苏州市'
    localStorage.setItem('latitude', latitude)
    localStorage.setItem('longitude', longitude)
    localStorage.setItem('cityname', cityname)
    localStorage.setItem('province', '江苏省')
    localStorage.setItem('district', '虎丘区')
    localStorage.setItem('street', '珠江路')
    localStorage.setItem('street_number', '88号')
    localStorage.setItem('formatted_address', '江苏省苏州市虎丘区珠江路88号')
    var data = {
      latitude: latitude,
      longitude: longitude,
      cityname: cityname
    }
    if (typeof callback == 'function') {
      callback(data)
    }
  },
  //更新地理位置
  refresh: function(callback) {
    var that = this
    //重新获取经纬度和城市街道并设置到localStorage
    that.latAndLon(
      function(data) {
        that.cityname(data.latitude, data.longitude, function(datas) {
          if (typeof callback == 'function') {
            callback()
          }
        })
      },
      function() {
        that.setDefaultCity(function() {
          if (typeof callback == 'function') {
            callback()
          }
        })
      }
    )
  }
}
