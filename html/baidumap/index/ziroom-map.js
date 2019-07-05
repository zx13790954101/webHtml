var ZMap = function (id, center, level) {
  this.initCenter = new ZPoint(116.404, 39.915);//初始化的中心点，同时为了定义网格的中心点
  this.id = id;//div的id
  this.level = level ? level : 13;//地图级别
  this.center = center ? center : this.initCenter;//中心点

  this.map = null;//百度地图实例
  this.xgrids = [];//经线
  this.ygrids = [];//纬线
  this.beSelectBounds = {};
  this.bounds = null;//当前地图的四个顶点
  this.span = null;//当前网格的跨度

  this.init();

}
ZMap.prototype = {
  init: function () {//全局初始化
      var zMap = this;
      this.map = new BMap.Map(this.id);
      this.map.centerAndZoom(this.center.point, this.level);
      this.map.enableScrollWheelZoom();
      this.map.disableInertialDragging();
      this.map.addControl(new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_ZOOM
      })); //缩放按钮
      this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, offset: new BMap.Size(80, 25)})); //比例尺
      this.map.disableDoubleClickZoom();
      this.map.setMapStyle({style: 'googlelite'});
      this.initProperty();
      this.initGrid();

      //添加移动后的点击事件
      this.map.addEventListener("dragend", function () {
          zMap.initProperty();
          zMap.initGrid();
      });
      //添加放大或缩小时的事件
      this.map.addEventListener("zoomend", function () {
          zMap.initProperty();
          zMap.initGrid();
      });
      //设置点击事件
      this.map.addEventListener("click", function (e) {
          var point = e.point;
          //获取当前点是在哪个区块内,获取正方形的四个顶点
          var points = zMap.getGrid(point);

          //判断当前区域是否已经被选中过，如果被选中过则取消选中
          var key = '' + points[0].lng + points[0].lat + points[2].lng + points[2].lat;//使用两个点的坐标作为key
          if (zMap.beSelectBounds[key]) {
              zMap.map.removeOverlay(zMap.beSelectBounds[key]);
              delete zMap.beSelectBounds[key];
              return;
          }
          var polygon = new BMap.Polygon(points, {strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5});
          zMap.map.addOverlay(polygon);
          zMap.beSelectBounds[key] = polygon;

      });
  },
  initProperty: function () {//初始化当前地图的状态
      this.level = this.map.getZoom();
      this.bounds = {
          x1: this.map.getBounds().getSouthWest().lng,
          y1: this.map.getBounds().getSouthWest().lat,
          x2: this.map.getBounds().getNorthEast().lng,
          y2: this.map.getBounds().getNorthEast().lat
      };
      this.span = this.getSpan();//需要使用level属性
  },
  initGrid: function () {//初始化网格
      var zMap = this;
      //将原来的网格线先去掉
      for (var i in zMap.xgrids) {
          this.map.removeOverlay(zMap.xgrids[i]);
      }
      zMap.xgrids = [];
      for (var i in zMap.ygrids) {
          this.map.removeOverlay(zMap.ygrids[i]);
      }
      zMap.ygrids = [];
      //获取当前网格跨度
      var span = zMap.span;
      //初始化地图上的网格
      for (var i = zMap.bounds.x1 + (zMap.initCenter.point.lng - zMap.bounds.x1) % span.x - span.x; i < zMap.bounds.x2 + span.x; i += span.x) {
          var polyline = new BMap.Polyline([
              new BMap.Point(i.toFixed(6), zMap.bounds.y1),
              new BMap.Point(i.toFixed(6), zMap.bounds.y2)
          ], {strokeColor: "black", strokeWeight: 1, strokeOpacity: 0.5});
          zMap.xgrids.push(polyline);
          zMap.map.addOverlay(polyline);
      }
      for (var i = zMap.bounds.y1 + (zMap.initCenter.point.lat - zMap.bounds.y1) % span.y - span.y; i < zMap.bounds.y2 + span.y; i += span.y) {
          var polyline = new BMap.Polyline([
              new BMap.Point(zMap.bounds.x1, i.toFixed(6)),
              new BMap.Point(zMap.bounds.x2, i.toFixed(6))
          ], {strokeColor: "black", strokeWeight: 1, strokeOpacity: 0.5});
          zMap.ygrids.push(polyline);
          zMap.map.addOverlay(polyline);
      }
  },
  getSpan: function () {//获取网格的跨度
      var scale = 0.75;
      var x = 0.00064;
      for (var i = this.level; i < 19; i++) {
          x *= 2;
      }
      var y = parseFloat((scale * x).toFixed(5));
      return {x: x, y: y};
  },
  getGrid: function (point) {//返回当前点在所在区块的四个顶点
      var zMap = this;
      //先找出两条纵线坐标
      var xpoints = this.xgrids.map(function (polyline) {
          return polyline.getPath()[0].lng;
      }).filter(function (lng) {
          return Math.abs(lng - point.lng) <= zMap.span.x;
      }).sort(function (a, b) {
          return a - b;
      }).slice(0, 2);

      //再找出两条横线的坐标
      var ypoints = this.ygrids.map(function (polyline) {
          return polyline.getPath()[0].lat;
      }).filter(function (lat) {
          return Math.abs(lat - point.lat) <= zMap.span.y;
      }).sort(function (a, b) {
          return a - b;
      }).slice(0, 2);

      return [
          new BMap.Point(xpoints[0], ypoints[0]),
          new BMap.Point(xpoints[0], ypoints[1]),
          new BMap.Point(xpoints[1], ypoints[1]),
          new BMap.Point(xpoints[1], ypoints[0])
      ];

  },
  reset: function () {//重置
      this.map.reset();
  }
}

var ZPoint = function (x, y, code) {
  this.code = code;
  this.point = new BMap.Point(x, y);
}