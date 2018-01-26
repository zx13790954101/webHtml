function init(){
	
}
//表单工具箱
var formTool={
	//如果是价格的输入框，输入小数onkeyup执行下面函数
	//obj 等于对象的$(obj)==obj,clearNoNum( $(obj) )
    clearNoNum:function(obj){  
    	
        $(obj).keyup(function () {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            }).bind("paste", function () {  //CTR+V事件处理    
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            }).css("ime-mode", "disabled"); //CSS设置输入法不可用
  
    }
}
//时间工具箱
var timeTool={
	
}
