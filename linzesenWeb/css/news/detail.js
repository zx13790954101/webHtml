layui.use(['element'], function() {
	var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块

	var active = {
		init: function() {

			lzs_flieload.downLoadCss("../../../plugin/share/share.min.css");
			lzs_flieload.downLoadJs("../../../plugin/share/jquery.share.js", function() {
						$('#share-2').share({
							sites: ['qzone', 'qq', 'weibo', 'wechat']
						});
			});
		},
	}
	active.init();
});

initEmotion();
//初始化表情包
function initEmotion() {

}