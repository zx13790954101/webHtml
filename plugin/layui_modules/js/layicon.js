/**
 * Name:layicon.js
 * Desc:华喜·希安 - 图标选择控件
 * Author:Yang Wei · date 2018/2/10
 * LICENSE:HX·XA.YangWei
 */
layui.define(['layer'], function (exports) {
    "use strict";

    var $ = layui.jquery,
        layer = layui.layer;
    var _input;
    var $iid;
    var json = {
        init: function (selector) {
            _input = selector;
            _input.hide();
            $iid = "layicon_" + selector.attr("id");
            var $icon = "<div id=" + $iid + " style='height:36px;line-height:30px;background-color:#fff;color:#000;padding-left:5px;cursor:pointer;font-size:30px;border:1px solid #E6E6E6;' >"
                + "<i class='layui-icon' style='margin-left:5px' ><span style='color:#666' >请选择..</span></i></div>";
            selector.before($icon);
            $("#" + $iid).unbind("click").on("click", function () {
                $iid = $(this).attr("id");
                json.openIcon();
            });
            if (_input.val() != undefined && _input.val().length > 0) {
                $("#" + $iid).find("i.layui-icon").html(_input.val());
            }
            if (!$("body").data("layiconhtml")) {
                $("body").data("layiconhtml", "none");
                //预加载模板
                $.ajax({
                    type: "get",
                    url: "/ResourcesMng/temp/layicon.html?r=" + Math.random(),
                    success: function (html) {
                        $("body").data("layiconhtml", html);
                    }
                });
            }
        },
        openIcon: function () {
            var html = $("body").data("layiconhtml");
            layer.open({
                type: 1,
                title: '选择图标（双击选择）',
                data: {},
                shade: false,
                content: html,
                //offset: ['100px', '30%'],
                area: ['700px', '70%'],
                maxmin: false,
                closeBtn: 2,
                btnAlign: 'c',
                success: function (selector, index) {
                    selector.find("li").unbind("click").on("click", function () {
                        selector.find(".iconchecked").removeClass("iconchecked");
                        $(this).addClass("iconchecked");
                    });
                    selector.find("li").unbind("dblclick").on("dblclick", function () {
                        var iresult = $(this).find(".code").text();
                        _input.val(iresult);
                        $("#" + $iid).find("i.layui-icon").html(iresult);
                        layer.close(index);
                    });
                }
            });
        }
    }
    exports('layicon', json);
});