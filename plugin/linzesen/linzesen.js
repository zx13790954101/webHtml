function init() {}
//表单工具箱
var lzs_form = {
	//如果是价格的输入框，输入小数onkeyup执行下面函数
	//obj 等于对象的$(obj)==obj,clearNoNum( $(obj) )
	clearNoNum: function(obj) {
		$(obj).on('keyup', function(event) {
			var $amountInput = $(this);
			//响应鼠标事件，允许左右方向键移动 
			event = window.event || event;
			if(event.keyCode == 37 | event.keyCode == 39) {
				return;
			}
			//先把非数字的都替换掉，除了数字和. 
			$amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
				//只允许一个小数点              
				replace(/^\./g, "").replace(/\.{2,}/g, ".").
				//只能输入小数点后两位
				replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		});
		$(obj).on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});

	},
	autoAddWitch: function(obj) {
		var widthSize = $(obj).width(); //文本框长度
		var size = 0; //文本框字符长度
		$(obj).keyup(function() {
			//当前输入的文本比上一次的文本值长度短，就缩减文本框的宽度
			if(this.value.length < size) {
				size = $(obj).val().length; //获取文本框的字符长度
				widthSize = parseInt(widthSize - 10); //当前文本宽度-10px
				this.style.width = widthSize + "px";
				return "";
				//否则就增加文本框的宽度
			} else {
				size = $(obj).val().length; //获取文本框的字符长度
				widthSize = parseInt(widthSize + 10); //当前文本宽度+10px
				this.style.width = widthSize + "px";
				return "";
			}
		});
	},
	//单选框的内容是否已经选择了
	selectRaditVal: function() {

	}
}
//时间工具箱
var lzs_time = {

	//时间的格式
	fromDate: function(date) {

		if(date) {
			time = new Date(date);
			var n = time.getFullYear();
			var y = time.getMonth() + 1;
			var r = time.getDate();
			var h = time.getHours();
			var m = time.getMinutes();
			if(m < 10) {
				m = '0' + m;
			}
			var s = time.getSeconds();
			if(s < 10) {
				s = '0' + s;
			}
			var alltime = n + '-' + y + '-' + r + " " + h + ':' + m + ':' + s;
			return alltime;
		}
	},
	//时间差
	TimeDifference: function(milis, setDom) {
		if(milis != "" && milis != null) {
			var newTime = milis; //  结束时间
			var startTime = new Date(); //开始时间
			// var endTime = new Date(newTime).getTime()-startTime.getTime();   //时间差的毫秒数  
			var endTime = parseInt(newTime) * 60 * 1000;

			var interval = setInterval(function timer() {
				endTime = endTime - 1000
				if(endTime > 0) {
					//计算出相差天数  
					var days = Math.floor(endTime / (24 * 3600 * 1000))
					//计算出小时数  
					var leave1 = endTime % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
					var hours = Math.floor(leave1 / (3600 * 1000))
					//计算相差分钟数  
					var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数  
					var minutes = Math.floor(leave2 / (60 * 1000))
					//计算相差秒数  
					var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
					var seconds = Math.round(leave3 / 1000)
					setDom.innerText = (hours < 10 ? ("0" + hours) : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
				} else {
					setDom.innerText = "00:00:00";
					clearInterval(interval);
					//$('.modal-body').html('考试结束。');
					$('.StudentExam_Main  .StudentExam_Main_Right .top').html('考试结束,试卷提交中');
					submit_button();

				}
			}, 1000);
		}
	}

}
//工具箱
var lzs_tool = {
	//停止冒泡行为
	stopBubble: function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器 
		if(e && e.stopPropagation)
			//因此它支持W3C的stopPropagation()方法 
			e.stopPropagation();
		else {
			//否则，我们需要使用IE的方式来取消事件冒泡 
			window.event.cancelBubble = true;
		}

	},

	//阻止浏览器的默认行为 
	stopDefault: function(e) {
		//阻止默认浏览器动作(W3C) 
		if(e && e.preventDefault)
			e.preventDefault();
		//IE中阻止函数器默认动作的方式 
		else {
			window.event.returnValue = false;
		}

		return false;
	},

	//复制代码
	copyCode: function(obj) {
		var Url2 = $(obj).prev().html();
		var oInput = document.createElement('input');
		oInput.value = Url2;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		alert("复制成功");
		console.log("ssss", Url2)
	},
	//复制代码
	copyTaoBao: function(obj) {
		var Url2 = $(obj).html();
		var oInput = document.createElement('input');
		oInput.value = Url2;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		alert("复制成功");
		console.log("ssss", Url2)
	},
	//下载的功能的实现
	download: function(src) {

		src = $(src).attr('class');
		var $a = document.createElement('a');
		$a.setAttribute("href", src);
		$a.setAttribute("download", "");
		var evObj = document.createEvent('MouseEvents');
		evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
		$a.dispatchEvent(evObj);
	},
	//顶置的按钮上下的按钮
	scollTop: function(namxbox, nametop, namebuttom, height) {
		var html="<div class='scroll-top  flex-c' style='border-rudis:4px;width:40px;height:40px;display:none;box-shadow: 0 1px 3px rgba(26,26,26,.1);position:fixed;background-color: white;padding:10px;bottom:2%;right:2%;color:#fff;cursor:pointer;'><span class='top'>top</span></div>";
	
		$(window).scroll(function() {
			if($('.scroll-top').html() === undefined){
				$('body').append(html);
			}
	
			if($(window).scrollTop() >= 1) {
				$('.scroll-top').fadeIn(200);

				if($('.scroll-top') != undefined || $('.scroll-top') != null) {
					$('.scroll-top').click(function() {
						$("html,body").animate({
							scrollTop: 0
						}, 100);
						$('.scroll-top').fadeOut(200);
					});
				}
			} else {
				$('.scroll-top').fadeOut(200);
			}
		});

	}
}
//布局工作，tab 
var lzs_layout = {
	//tab切换
	tabSlider: function(ClassName, callback, type) {

		this.ClassName = ClassName;
		this.callback = callback;
		//判断名字是否存在
		var tabDiv = ".tab-div";
		var tabLi = ".tab-nav"; //初始化
		var tbaContent = ".tab-content";
		if(ClassName) {
			tabDiv = ClassName;
		}
		var name = $(tabDiv).children(tabLi).children(" li");
		//判断tab的类型
		if(type == "collapse") {
			name = $(tabDiv).children(".tab-button");
			$(tabDiv).children(tbaContent).addClass("none");
		}
		name.click(function(event) {
			event.stopPropagation();
			var that = this;
			var index = $(that).index();
			//2. 让当前li添加active类，并且让其他的li移除active类
			//3. 让对应下标的div添加selected，并且让其他div移除selected类
			var data = {
				index: index,
				dom: $(that),
				tabDiv: tabDiv
			}
			if(type == "collapse") {
				if($(that).hasClass("active")) {
					$(that).removeClass("active");
					$(tabDiv).children(tbaContent).removeClass("active");
				} else {
					$(that).addClass("active");
					$(tabDiv).children(tbaContent).addClass("active");
				}
			} else {
				$(that).addClass("active").siblings().removeClass("active");
			}

			if($(tabDiv).children('.tab-content').children(".tab-content-item").eq(index).length > 0) {
				$(tabDiv).children('.tab-content').children(".tab-content-item").eq(index).addClass("active").siblings().removeClass("active");
				console.log(tabDiv);
			} else {
				return data;
			}
			//回调函数
			if(typeof callback === "function") {
				callback(data);
			}

		});

	},

}

//多媒体工具类
var lzs_media = {}
//时间的处理
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份         
		"d+": this.getDate(), //日         
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
		"H+": this.getHours(), //小时         
		"m+": this.getMinutes(), //分         
		"s+": this.getSeconds(), //秒         
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度         
		"S": this.getMilliseconds() //毫秒         
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
//ajax
var lzs_ajax = {
	//post的获取方法
	post: function(murl, callback, mdata) {
		$.ajax({
			type: "post",
			url: murl,
			dataType: "json",
			data: mdata,
			//  timeout: 20000,
			success: function(data) {
				if(typeof callback === "function" || callback) {
					callback(data);
				}
				return Jdata;
			},
			error: function(data) {
				console.log("请求失败", data);
			}
		});
	},

	//get的获取方法
	get: function(murl, callback, mdata) {
		if(mdata) {

		}
		$.ajax({
			type: "get",
			url: murl,
			dataType: "json",
			data: mdata,
			//  timeout: 20000,
			success: function(data) {
				if(typeof callback === "function" || callback) {
					callback(data);
				}
				return data;
			},
			error: function(data) {
				console.log("请求失败", data);
			}
		});
	},
	 //获取 url 后的参数值
    getUrl:function(para){
        var paraArr = location.search.substring(1).split('&');
        for(var i = 0;i < paraArr.length;i++){
            if(para == paraArr[i].split('=')[0]){
                return paraArr[i].split('=')[1];
            }
        }
        return '';
    },
}

//tab切换的原型连的继承
//LZS_layout.tabSlider().prototype.ClassName='.tab-div';
//https://www.cnblogs.com/wdlhao/p/5743770.html
//文件加载
var lzs_flieload = {
	downLoadJs:function(url,callback) {
	   setTimeout(function() {
			var elem = document.createElement("script");
			elem.src = url;
			document.body.appendChild(elem);
			if(elem.readyState){   //IE
	　　　　　　          elem.onreadystatechange=function(){
		　　　　　　　　if(elem.readyState=='complete'||elem.readyState=='loaded'){
		　　　　　　　　　　elem.onreadystatechange=null;
		　　　　　　　　　　callback();
		　　　　　　　　}
		　　　　　　}
		　　　　}else{    //非IE
		　　　　　　elem.onload=function(){callback();}
		　　　　}
		}, 2000);
	},
	downLoadCss:function(url) {
	 	setTimeout(function() {
			var elem = document.createElement("link");
			elem.rel = "stylesheet";
			elem.type = "text/css";
			elem.href = url;
			document.body.appendChild(elem);
	    }, 2000);

	}
}
//弹出框的初始化
var lzs_dialog={
	default:function(popView){
		var view="<div class='lzs-dialog layui-anim'   data-anim='layui-anim-scaleSpring'>"+
		"<div class='dialog-header'><div class='back'>关闭</div></div>"+
		"<div class='dialog-info'>"+popView+"</div></div>";
		$(this).after(view)
		var backButton=$(this).parent().children(".lzs-dialog").children(".back");
		var removeView=$(this).parent().children(".lzs-dialog");
		//关闭的按钮
		backButton.click(function(e){
			e.stopPropagation();  
			$(".lzs-dialog").hide(500); 
			removeView.remove();
		});
		$(document).click(function(e){  
			var popup = $(".lzs-dialog");  
	        //判断事件对象不是弹窗对象  并且  弹窗对象不包含事件对象  
	        if (!popup.is(e.target) && popup.has(e.target).length == 0) {  
	            //则隐藏弹窗  
	            popup.hide(500);  
	
	         } 
        }); 
	},
	locate:function(that,popView,callback){
		 
		var view="<div id='lzs-dialog' class='lzs-dialog layui-anim'   data-anim='layui-anim-scaleSpring'>"+
		"<div class='dialog-box'><div class='dialog-bor'></div></div><div class='dialog-header'><span class='back text-right'>关闭</span></div>"+
		"<div class='dialog-info'>"+popView+"</div></div>";
		$(that).parent().after(view);
		
		$(document).click(function(e){  
			var popup = $(".lzs-dialog");  
	        //判断事件对象不是弹窗对象  并且  弹窗对象不包含事件对象  
	        if (!popup.is(e.target) && popup.has(e.target).length == 0) {  
	            //则隐藏弹窗  
	            popup.hide();  
	            popup.remove();
	         } 
        });
        var index=parseInt( $(that).index()  );
        setTimeout(function(){
        	
        	$(that).parent().after(view);
            $("#lzs-dialog").show();
            $(".dialog-box").css({"left":$(that).width()*index+12});
          
            setTimeout(function(){
            	if(typeof callback === "function" || callback) {
					callback();
		         }
              },100)
            
        },100)
        
		var removeView=$("#lzs-dialog");
		var backButton=$("#lzs-dialog").children(".back");
		//关闭的按钮
		backButton.click(function(e){
			e.stopPropagation();  
			$(".lzs-dialog").hide(); 
			removeView.remove();
		});
     	
	}
	
}
