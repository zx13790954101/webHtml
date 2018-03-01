function init(){
	
}
//表单工具箱
var formTool={
	//如果是价格的输入框，输入小数onkeyup执行下面函数
	//obj 等于对象的$(obj)==obj,clearNoNum( $(obj) )
    clearNoNum:function(obj){  
       $(obj).on('keyup', function (event) {
		    var $amountInput = $(this);
		    //响应鼠标事件，允许左右方向键移动 
		    event = window.event || event;
		    if (event.keyCode == 37 | event.keyCode == 39) {
		        return;
		    }
		    //先把非数字的都替换掉，除了数字和. 
		    $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
		        //只允许一个小数点              
		        replace(/^\./g, "").replace(/\.{2,}/g, ".").
		        //只能输入小数点后两位
		        replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		            });
		$(obj).on('blur', function () {
		    var $amountInput = $(this);
		    //最后一位是小数点的话，移除
		    $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
		
    },
    autoAddWitch:function(obj){
    	var widthSize = $(obj).width();   //文本框长度
	    var size=0;  //文本框字符长度
	    $(obj).keyup(function(){  
	            //当前输入的文本比上一次的文本值长度短，就缩减文本框的宽度
	            if(this.value.length<size){
	                size=$(obj).val().length;  //获取文本框的字符长度
	                widthSize=parseInt(widthSize-10);   //当前文本宽度-10px
	                this.style.width=widthSize+"px";
	                return "";
	            //否则就增加文本框的宽度
	            }else{
	                size=$(obj).val().length;  //获取文本框的字符长度
	                widthSize=parseInt(widthSize+10); //当前文本宽度+10px
	                this.style.width=widthSize+"px";
	                return "";
	            } 
	     });
    },
    //单选框的内容是否已经选择了
    selectRaditVal:function(){
    	
    }
}
//时间工具箱
var timeTool={
	 //停止冒泡行为
    stopBubble: function (e) {
        //如果提供了事件对象，则这是一个非IE浏览器 
        if (e && e.stopPropagation)
            //因此它支持W3C的stopPropagation()方法 
            e.stopPropagation();
        else
            //否则，我们需要使用IE的方式来取消事件冒泡 
            window.event.cancelBubble = true;
    },

    //阻止浏览器的默认行为 
    stopDefault: function (e) {
        //阻止默认浏览器动作(W3C) 
        if (e && e.preventDefault)
            e.preventDefault();
            //IE中阻止函数器默认动作的方式 
        else
            window.event.returnValue = false;
        return false;
    },

    //时间的格式
    fromDate: function (date) {
      
        if (date) {
            time = new Date(date);
            var n = time.getFullYear();
            var y = time.getMonth() + 1;
            var r = time.getDate();
            var h = time.getHours();
            var m = time.getMinutes();
            if (m < 10) { m = '0' + m; }
            var s = time.getSeconds();
            if (s < 10) { s = '0' + s; }
            var alltime = n + '-' + y + '-' + r + " " + h + ':' + m + ':' + s;
            return alltime;
        }
    }
}
    
var otherTool={
	
    //下载的功能的实现
    download: function (src) {
     
        src = $(src).attr('class');
        var $a = document.createElement('a');
        $a.setAttribute("href", src);
        $a.setAttribute("download", "");
        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
        $a.dispatchEvent(evObj);
    },
    scollTop:function(namxbox,nametop,namebuttom){
       $(window).scroll(function() {
        if ($(window).scrollTop() >= 300) {
            $(namxbox).fadeIn(600);
        } else {
            $(namxbox).fadeOut(600);
        }
	    });
	    if(nametop!=undefined||nametop!=null){
		    $(nametop).click(function() {
		        $("html,body").animate({
		            scrollTop: 0
		        }, 500);
		    });
	    }
	    if(namebuttom!=undefined||namebuttom!=null){
	    	$(namebuttom).click(function() {
	        $("html,body").animate({
	            scrollTop: $(document).height()
	        }, 500);
	    });
	    
	    } 
	    
    },
    //时间差
    TimeDifference:function(milis, setDom) {
                if (milis != "" && milis != null) {
                    var newTime = milis;//  结束时间
                    var startTime = new Date();//开始时间
                   // var endTime = new Date(newTime).getTime()-startTime.getTime();   //时间差的毫秒数  
                    var endTime =  parseInt(newTime)*60*1000;
                   

                    var interval = setInterval(function timer() {
                        endTime = endTime - 1000
                        if (endTime > 0) {
                            //计算出相差天数  
                            var days = Math.floor(endTime / (24 * 3600 * 1000))
                            //计算出小时数  
                            var leave1 = endTime % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
                            var hours = Math.floor(leave1 / (3600 * 1000))
                            //计算相差分钟数  
                            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
                            var minutes = Math.floor(leave2 / (60 * 1000))
                            //计算相差秒数  
                            var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
                            var seconds = Math.round(leave3 / 1000)
                            setDom.innerText = (hours < 10 ? ("0" + hours) : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                       }
                        else {
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
//时间的处理
Date.prototype.pattern = function (fmt) {
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
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//多媒体工具类
var mediaTool={
	
}
