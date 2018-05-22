/**
 * Name:layicon.js
 * Desc:华喜·希安 - 上传组建
 * Author:Yang Wei · date 2018/3/6
 * LICENSE:HX·XA.YangWei
 */
layui.define(['layer', 'HxConfig', 'upload', 'common'], function (exports) {
    "use strict";

    var $ = layui.jquery,
       HxConfig = layui.HxConfig,
       upload = layui.upload,
       com=layui.common,
       layer = layui.layer;
    

    var me = {

        init: function (selector,options)
        {
            if (!options) { options = {}; }
            var dfoptions =
            {
                upurl: UPLOADSAVEURL,      //上传接口地址
                geturl: UPLOADREADERURL,   //获取图片地址
                delurl: UPLOADDELETEURL,   //删除图片地址
                exts: "bmp|png|jpg|jpeg",  //默认上传格式. 
                size: 60,                  //限制文件大小，单位 KB
                type: "img",               //上传模板类型
                mulit: false,              //多图模式
                len: 1,                    //最大上传张数
                choose: function (obj) {  },
                sussces: function (elem, data) {
                    com.alert("上传完成" + JSON.stringify(data));
                },
                // SystemTag 所属资源库
                // BusTag    文件类型
                // SmallPic  是否生成小图尺寸 250px-750px (250 350 450 550 650 750)
                // Tpsy      是否增加图片水印
                // Wzsy      文字水印的文字  ""代表不增加
                data: { SystemTag: "Cloud", BusTag: "", SmallPic: false, Tpsy: false, Wzsy: "" }
            }
            if (options.type == "file")
            {
                dfoptions.exts = "bmp|png|jpg|jpeg|rar|txt|zip|doc|ppt|xls|pdf|docx|xlsx|rm|rmvb|mpeg1-4|mov|mtv|dat|wmv|avi|3gp|amv|dmv|flv";
            }
            var option = $.extend(true, {}, dfoptions, options);
            //selector.hide();
            var $piid = "imgup_" + selector.attr("id");
            var $panel = $("<div id=" + $piid + " class='filewarp' ></div>");
            $panel.data("input", selector);
            $panel.data("option", option);

            selector.before($panel);
            //图片模板
            if (option.type == "img") {
                if ($("body").data("imguphtml")) {
                    var html = $("body").data("imguphtml");
                    $panel.html(html);
                    me.renderImg($panel);
                }
                if (!$("body").data("imguphtml")) {
                    $.ajax({
                        type: "get",
                        url: HxConfig.rootPath + "/temp/imgup.html?r=" + Math.random(),
                        success: function (html) {
                            $("body").data("imguphtml", html);
                            $panel.html(html);
                            me.renderImg($panel);
                        }
                    });
                }
            }
            //文件模板
            if (option.type == "file") {
                if ($("body").data("fileuphtml")) {
                    var html = $("body").data("fileuphtml");
                    $panel.html(html);
                    me.renderFile($panel);
                }
                if (!$("body").data("fileuphtml")) {
                    $("body").data("fileuphtml", "none");
                    $.ajax({
                        type: "get",
                        url: HxConfig.rootPath + "/temp/fileup.html?r=" + Math.random(),
                        success: function (html) {
                            $("body").data("fileuphtml", html);
                            $panel.html(html);
                            me.renderFile($panel);
                        }
                    });
                }
            }
        },
        //渲染图片列表处理
        renderImg: function ($panel)
        {
            var option = $panel.data("option");
            me.renderImgResult($panel);
            if (!option.mulit) {
                $panel.find(".maxuptitle").hide();
                $panel.find(".layui-upload-list").removeClass("singlelist").addClass("singlelist");
            } else {
                $panel.find(".layui-upload-list").removeClass("mulitlist").addClass("mulitlist");
            }
            //标题数据替换
            $panel.find(".maxupwz").html(option.len);
            $panel.find(".sizewz").html(com.fileSize(option.size * 1024));
            $panel.find(".extwz").html(option.exts.split("|").join("，"));
            $panel.find(".upbtn").unbind("click", function () {
                $panel = $(this).parents(".filewarp");
            })
            me.renderControl($panel);
        },
        //渲染文件列表处理
        renderFile: function ($panel) {
            var option = $panel.data("option");
            me.renderFileResult($panel);
            $panel.find(".layui-upload-list").removeClass("filemulitlist").addClass("filemulitlist");
            //标题数据替换
            $panel.find(".maxupwz").html(option.len);
            $panel.find(".sizewz").html(com.fileSize(option.size * 1024));
            $panel.find(".extwz").html(option.exts.split("|").join("，"));
            $panel.find(".upbtn").unbind("click", function () {
                $panel = $(this).parents(".filewarp");
            })
            me.renderControl($panel);
        },
        //渲染主控件
        renderControl: function ($panel)
        {
            var option = $panel.data("option");
            var lindex;
            upload.render({
                elem: $panel.find(".upbtn")
              , url: option.upurl
              , accept: "file"
              , exts: option.exts
              , auto: false
              , bindAction: $panel.find(".submitbtn")
              , multiple: false
              , size: option.size
              , data: option.data
              , choose: function (obj) {
                  option.choose(obj);
                  if (option.mulit){
                      var _input = $panel.data("input");
                      var jsonsz = [];
                      if (_input.val().length > 2) {
                          jsonsz = eval('(' + _input.val() + ')');
                      }
                      if (jsonsz.length >= option.len) {
                          com.notip("超出最大上传个数!");
                          return;
                      }
                  }
                  lindex = com.load("上传中");
                  $panel.find(".submitbtn").click();
              }
              , done: function (res) {
                  com.close(lindex);
                  //如果上传失败
                  if (res.code > 0) {
                      com.notip('上传失败');
                      return;
                  }
                  var _input = $panel.data("input");
                  //处理上传后的结果
                  if (option.mulit) {
                      var oldJson = [];
                      var inputvalue = _input.val();
                      if (inputvalue.length > 2) {
                          oldJson = eval('(' + inputvalue + ')');
                          oldJson.push(res.data[0]);
                          _input.val(JSON.stringify(oldJson));
                      } else {
                          _input.val(JSON.stringify(res.data));
                      }
                  } else {
                      _input.val(res.data[0].Token);
                  }
                  if (option.type == "file") {
                      me.renderFileResult($panel);
                  } else {
                      me.renderImgResult($panel);
                  }
                  option.sussces(_input, res.data);
              }, error: function () {
                  com.notip('上传失败');
                  com.close(lindex);
              }
            });
        },
        //渲染图片结果
        renderImgResult: function ($panel)
        {
            var inputvalue = $panel.data("input").val();
            var option = $panel.data("option");
      
            if (inputvalue.length <= 2) { $panel.find(".layui-upload-list").empty(); $panel.data("input").val(""); return; }
            if (!option.mulit)
            {
               
                var $imgtmp = $("<div class='picitem' >"+$panel.find(".pictemp").html()+"</div>");
                $imgtmp.find("img").attr("src", option.geturl + "?Token=" + inputvalue);
                $panel.find(".layui-upload-list").empty().append($imgtmp);
            }
            if (option.mulit)
            {
                var inputJList = eval('(' + inputvalue + ')');
                $panel.find(".layui-upload-list").empty();
                $.each(inputJList, function (i, s) {
                    var $imgtmp = $("<div class='mulitpicitem' >" + $panel.find(".pictemp_mulit").html() + "</div>");
                    $imgtmp.find("img").attr("src", option.geturl + "?Token=" + s.Token);
                    $imgtmp.find(".picsize").html(com.fileSize(s.Size));
                    $imgtmp.attr("title", s.Name);
                    $panel.find(".layui-upload-list").append($imgtmp);
                    $imgtmp.find(".pictool").data("data", s);
                    $imgtmp.find(".settexticon").unbind("click").on("click", function () {
                        com.alert($(this).parents(".pictool").data("data").Name);
                    });
                    $imgtmp.find(".setdelicon").unbind("click").on("click", function () {
                        me.delItem($panel, $(this).parents(".pictool").data("data"));
                    });
                    $imgtmp.find(".settopicon").unbind("click").on("click", function () {
                        me.setTop($panel, $(this).parents(".pictool").data("data"));
                    });
                })
            }
        },
        //渲染文件结果
        renderFileResult: function ($panel) {
            var inputvalue = $panel.data("input").val();
            var option = $panel.data("option");

            if (inputvalue.length <= 2) { $panel.find(".layui-upload-list").empty(); $panel.data("input").val(""); return; }
            var inputJList = eval('(' + inputvalue + ')');
            $panel.find(".layui-upload-list").empty();

            $.each(inputJList, function (i, s) {
                var $imgtmp = $("<div class='mulitfileitem' >" + $panel.find(".filetemp_mulit").html() + "</div>");
                $imgtmp.find("a").html(s.Name);
                $imgtmp.find("a").attr("href", option.geturl + "?Token=" + s.Token);
                $imgtmp.find(".picsize").html(com.fileSize(s.Size));
                $imgtmp.attr("title", s.Name);
                $panel.find(".layui-upload-list").append($imgtmp);
                $imgtmp.find(".filetool").data("data", s);

                $imgtmp.find(".settexticon").unbind("click").on("click", function () {
                    com.alert($(this).parents(".filetool").data("data").Name);
                });
                $imgtmp.find(".setdelicon").unbind("click").on("click", function () {
                    me.delItem($panel, $(this).parents(".filetool").data("data"));
                });
                $imgtmp.find(".settopicon").unbind("click").on("click", function () {
                    me.setTop($panel, $(this).parents(".filetool").data("data"));
                });
            })
        },
        //置顶
        setTop: function ($panel, item)
        {
            var option = $panel.data("option");
            var input = $panel.data("input");
            var olddata = eval('(' + input.val() + ')');
            var newdata = [];
            newdata.push(item);
            $.each(olddata, function (i, s) {
                if ($.trim(s.Token.toString().toLocaleUpperCase()) != $.trim(item.Token.toString().toLocaleUpperCase())) {
                    newdata.push(s);
                }
            });
            input.val(JSON.stringify(newdata));
            if (option.type == "file") {
                me.renderFileResult($panel);
            } else {
                me.renderImgResult($panel);
            }
        },
        //删除
        delItem: function ($panel, item)
        {
            var option = $panel.data("option");
            var input = $panel.data("input");
            var olddata = eval('('+ input.val()+')');
            var newdata = [];
            $.each(olddata, function (i, s) {
                if ($.trim(s.Token.toString().toLocaleUpperCase()) != $.trim(item.Token.toString().toLocaleUpperCase())) {
                    newdata.push(s);
                }
            });
            input.val(JSON.stringify(newdata));
            if (option.type == "file") {
                me.renderFileResult($panel);
            } else {
                me.renderImgResult($panel);
            }
        },
        //销毁对象
        destroy: function (selector)
        {
            $iid = "imgup_" + selector.attr("id");
            $("#" + $iid).remove();
        }
    }
    exports('layup', me);
});