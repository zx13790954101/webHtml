var active = {
  init: function () {
    active.baiduMap();
  },
  baiduMap: function () {
    var tileLayer = new BMap.TileLayer({
      isTransparentPng: true
    });
    tileLayer.getTilesUrl = function (tileCoord, zoom) {
      console.log(zoom + '/' + tileCoord.x + '_' + tileCoord.y + '/');
      var x = tileCoord.x;
      var y = tileCoord.y;
      return /*dir*/ 'tiles/' + zoom + '/' + x + '_' + y + '.png'; //
    }

    var map = new BMap.Map('allmap', {
      minZoom: 3,
      maxZoom: 19
    });
    map.addTileLayer(tileLayer);
    map.addControl(new BMap.NavigationControl());
    map.centerAndZoom(new BMap.Point(110.5974065, 20.903798), 14);
    map.enableScrollWheelZoom();
  }
};