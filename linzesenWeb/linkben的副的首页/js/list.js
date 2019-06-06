layui.use(['laypage','layer','flow'], function () {
  var laypage = layui.laypage
  ,layer = layui.layer;
  var flow = layui.flow;

var active={
    init:function(){
      document.onreadystatechange = () => {
        const _readyState = document.readyState
        if (_readyState === 'complete' || _readyState === 'loaded') {
     
        }
      }
      active.headSwiper();
      active.getList();
    },
    //获取数据
    getList:function(){
      $.getJSON("https://linkben.com/api/about/index",function(data){
        var data=data.data.list;
        console.log("data",data);
            //调用分页
          laypage.render({
            elem: 'main-list'
            ,count: data.length
            ,jump: function(obj){
              //模拟渲染
              document.getElementById('list-ul').innerHTML = function(){
                var arr = []
                ,thisData = data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                layui.each(thisData, function(index, item){
                  console.log("index",item);
                  var html='<li class="col-lg-3 col-xs-6">\
                            <div class="box">\
                            <div class="item-img img-r">\
                               <img  lay-src="'+item.productdata+'">\
                            </div>\
                            <div class="ct h5 center ellipsis-line-1">'+item.title+' </div>\
                            <div class="button-array pos-a-b">\
                                  <a class="button" href="'+item.download+'">下载</a>\
                                  <a class="button" href="'+item.href+'">预览</a>\
                            </div> </div> </li>'
                  arr.push(html);
                });
                return arr.join('');
              }();
            }
          });
      });
    },
    headSwiper:function(){
      var headSwiper = new Swiper('.head-swiper', {
        slidesPerView: 1,
        autoplay: 5000,
        speed:1500,
        lazyLoading : true,  //启动延迟加载
        pagination: '.head-swiper .swiper-pagination',
        simulateTouch: false, //禁止鼠标模拟
        navigation: {
          nextEl: '.head-swiper>.swiper-button-next',
          prevEl: '.head-swiper>.swiper-button-prev',
        },
        onInit: function(swiper){
              //Swiper初始化了
          $(".head-swiper>.swiper-button-next").click(function(){
            headSwiper.slideNext();
          });
          $(".head-swiper>.swiper-button-prev").click(function(){
            headSwiper.slidePrev();
          });
              }
      });
    }
}
active.init();
//按屏加载图片
flow.lazyimg({
  elem: '#list-ul img'
});
return false;

});

