var active = {
  init: function () {
    active.aMap();
  },
  aMap: function () {
    var layer_std = new AMap.TileLayer();
    var map = new AMap.Map('allmap', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 13, //初始化地图层级
      layers: [
        layer_std
      ],
      center: [110.597205, 20.902689]
    });

    map.on("complete", function () {
      log.success("地图加载完成！");
    });
    /**mengban
    var Layer_m = new AMap.TileLayer({
      zIndex: 9,
      getTileUrl: function (x, y, z) {
        return 'tiles/tile.jpg';
      }
    });
    map.remove(layer_std);
    Layer_m.setMap(map);
    mengban */

    // var tilerLayer = new AMap.TileLayer({
    //   zIndex: 13,
    //   getTileUrl: function (x, y, z) {
    //     console.log('/src/baidumap/' + z + '/' + x + '_' + y + '.png');
    //     return '/linzesenWeb/naozhouren/src/baidumap/' + z + '/' + x + '_' + y + '.png';
    //   }
    // });
    // tilerLayer.setMap(map);

  },

};