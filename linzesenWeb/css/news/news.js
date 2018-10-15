layui.use(['element', 'form', 'upload', 'laytpl', 'layer'], function() {
	var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
	var form = layui.form,
		upload = layui.upload,
		laytpl = layui.laytpl,
		layer = layui.layer;

	var active = {
		init: function() {
			active.pluginInit();
			active.buttonInit();
			var lens = 0;
			$(".edit-info .edit-text").bind('input propertychange', function() {
				lens = ($(this).val()).length;
				var lastStr = parseInt(150 - lens);
				console.log(lens, lastStr);
				if(lastStr <= 0) {
					lastStr = 0
				}
				$(".edit-info .font-num span").html(lastStr);
			});
		},
		buttonInit: function() {
			//列表的按钮功能
			$(".news-box .list-item-action button.flex-item").click(function(e) {

				var that = this;
				var index = $(this).find("span").html();

				if(index == "评论") {
					$(that).addClass("active");
					if($(".news-box .list-item-extend").find("div").length > 0) {
						if($(that).hasClass("active")) {
							$(that).removeClass("active");
							$(".news-box .list-item-extend").html("");
						}
						return false;
					}
					//第三步：渲染模版
					var data = {
						title: "Layui常用模块 "
					}
					var getTpl = $("#commentlistpanel").html();
					var view = $(".news-box .list-item-extend")
					$(".news-box .list-item-extend").html(getTpl);
					laytpl(getTpl).render(data, function(html) {
						view.innerHTML = html;
					});

					return false;
				} else if(index == "分享") {

					lzs_flieload.downLoadCss("../../../plugin/share/share.min.css");
					lzs_flieload.downLoadJs("../../../plugin/share/jquery.share.js", function() {
						layer.open({
							type: 1,
							title: false,
							closeBtn: false,
							area: ['400px', '300px'],
							shade: 0.8,
							id: 'LAY_layuipro' //设定一个id，防止重复弹出
								,
							btn: ['关闭'],
							btnAlign: 'c',
							moveType: 1 //拖拽模式，0或者1
								,
							content: "<div class='flex-c-y  flex-c' style='height:100%;-webkit-flex-wrap: wrap;  flex-wrap: wrap; '><div id='share-2'></div></div>",
							success: function(layero) {
								var html = '<div class="center" style="width:100%"><h5>分享链接</h5><input type="text" value=""><span>复制</span></div>';
								$("#share-2").before(html);
								$('#share-2').share({
									sites: ['qzone', 'qq', 'weibo', 'wechat']
								});
							},
							yes: function(index) {
								$(that).removeClass("active");
								$(".news-box .list-item-extend").html("");
								layer.closeAll();
							},
						});
					});
				} else {
					var html = "";
					if($(that).hasClass("checked")) {
						$(that).removeClass("checked");
						$(".news-box .list-item-extend").html("");
					} else {
						$(that).addClass("checked");
						var text = ($(that).html()).substring(0, ($(that).html()).indexOf("<span"));
						html = "<div class='list-item-action-animtion'>" + text + "</div>";
						$(".section-news .news-box .list-item").append(html);
						setTimeout(function() {
							$(".list-item-action-animtion").remove();
						}, 2000);
					}
					return false;

				}
			});

			$("#add-edittext-flie span").click(function(e) {
				var index = $(this).index();
				var that = this;
				var mainView = '';
				if(index == 1) {

					mainView = '<div class="layui-upload">' +
						'<div class="flex-c"><span class="flex-item">共<em class="num_totla">2</em>张，还能上传<em class="num_remain">7</em>张</span><button type="button" class="layui-btn" id="multifileButton">多图片上传</button> </div>' +
						'<blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;"> 预览图：' +
						' <div class="layui-upload-list" id="multifileList"></div>' +
						'</blockquote>' +
						'</div>'
					lzs_dialog.locate(that, mainView, function() {
						//多图片上传
						upload.render({
							elem: '#multifileButton',
							url: '/upload/',
							multiple: true,
							before: function(obj) {
								//预读本地文件示例，不支持ie8
								obj.preview(function(index, file, result) {
									$('#multifileList').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
								});
							},
							done: function(res) {
								//上传完毕
							}
						});

					});

				} else if(index == 2) {
					lzs_dialog.locate(that);
				} else if(index == 3) {
					lzs_dialog.locate(that);
				}
			});

		},
		//插件初始化
		pluginInit: function() {
			layer.photos({
				photos: '.layer-img-preview',
				anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
			});
			//监听导航点击
			element.on('nav(demo)', function(elem) {
				//console.log(elem)
				layer.msg(elem.text());
			});
		},
		loginView: function() {
			//登录的弹出框
			layer.open({
				type: 1,
				title: false //不显示标题栏
					,
				closeBtn: false,
				area: ['380px', '430px'],
				shade: 0.8,
				id: 'LAY_layuipro' //设定一个id，防止重复弹出
					,
				btn: ['关闭'],
				btnAlign: 'c',
				moveType: 1 //拖拽模式，0或者1
					,
				content: "<iframe src='../login.html'></iframe>",
				success: function(layero) {},
				yes: function(index) {
					debugger;
					$(that).removeClass("active");
					$(".news-box .list-item-extend").html("");
					layer.closeAll();
				},
			});
		}

	};
	active.init();
	//监听提交
	form.on('submit(edit-info1)', function(data) {
		debugger;
		layer.alert(JSON.stringify(data.field), {
			title: '最终的提交信息'
		})
		return false;
	});
	return false;
});

initEmotion();
//初始化表情包
function initEmotion() {
	//初始化表情包的css和js
	lzs_flieload.downLoadCss("../../../plugin/emotion/jquery.sinaEmotion.css");
	lzs_flieload.downLoadJs("../../../plugin/emotion/jquery.sinaEmotion.js", function() {
		$('.emoji').SinaEmotion($('.edit-text'));
	});
}
swiperload();

function swiperload() {
	var swiper = new Swiper('.swiper-header', {
		slidesPerView: 1,
		//  slidesPerColumn: 2, //显示两行
		//spaceBetween: 20,//
		//			      slidesPerGroup: 5,
		//			      loop: true,
		//			      loopFillGroupWithBlank: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		paginationClickable: true,
		simulateTouch: true, //禁止鼠标模拟
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			//hideOnClick: true,
		},
		//滑到最后一个隐藏前进按钮
		on: {
			slideChangeTransitionEnd: function() {
				if(this.isEnd) {
					this.navigation.$nextEl.css('display', 'none');
				} else {
					this.navigation.$nextEl.css('display', 'block');
				}
			},
		},
	});

}