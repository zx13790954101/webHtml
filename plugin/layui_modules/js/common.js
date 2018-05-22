/**
 * Name:adminApp.js
 * Desc:华喜·希安 - 拓展layui组件根目录配置
 * Author:Yang Wei · date 2018/2/24
 * LICENSE:HX·XA.YangWei
 */
layui.define(['layer', 'laytpl', 'form', 'tab'], function (exports) {
    "use strict";

    var $ = layui.jquery,
		layer = layui.layer,
        form = layui.form,
	    laytpl = layui.laytpl,
        tab = layui.tab;

    var pageInit = {

        init: function (selector) {
            pageInit.bindInitData(selector);
        },
        bindInitData: function (selector) {
            if (!selector) {
                selector = $("body");
            }
            //********初始化选中
            selector.find("[initvalue]").each(function (i, s) {
                var initvalue = $(this).attr("initvalue");
                if (initvalue.length > 0) {
                    //下拉列表
                    if ($(this).is("select")) {
                        if (initvalue == "0") {
                            if ($(this).find("option[value=0]").length <= 0) {
                                return;
                            }
                        }
                        $(s).val(initvalue);
                        if ($(this).find("option:selected").length == 0) {
                            $(s).find("option").each(function (i, item) {
                                if ($.trim($(item).html()) == $.trim(initvalue)) {
                                    $(item).prop("selected", true);
                                }
                            })
                        }
                    } else {

                        //单选控件
                        if ($(this).attr("type") == "radio") {
                            if ($(this).val() == $(this).attr("initvalue")) {
                                $(s).prop("checked", true);
                            }
                        }

                        //复选框
                        if ($(this).attr("type") == "checkbox") {
                            if (("," + initvalue + ",").indexOf(("," + $(s).val() + ",")) > -1) {
                                $(s).prop("checked", true);
                            }
                        }
                    }
                }
            });
            //********JSON时间格式转换
            selector.find(".jsontime").each(function () {
                var format = $(this).attr("format");
                if (!format) { format = "yyyy-MM-dd"; }
                $(this).html(common.date.format(common.date.jsonToDate($(this).attr("bindvalue")), format));
                $(this).val(common.date.format(common.date.jsonToDate($(this).attr("bindvalue")), format));
            })
            //********必输项处理
            selector.find("[lay-verify*='required']").each(function () {
                $(this).parents(".layui-form-item").eq(0).find(".layui-form-label").find(".bsx-xing").remove().end().append("<span class='bsx-xing' >*</span>");
            })
            form.render();
        }
    }
    pageInit.init();

    var common = {

        render: function (selector) {
            pageInit.init(selector);
        },
        //在框架页中打开一个新页卡
        pageAdd: function (option) {
            var json = $.extend(true, { url: "/otherpage/notfind.html", icon: "&#xe621;", title: "404页面" }, option);
            parent.tab.tabAdd(json);
        },
        //弹出
        alert: function (text, json, callbck) {
            json = $.extend(true, {}, json);
            return layer.alert((text || ""), json, callbck);
        },
        //消息
        msg: function (text, json) {
            json = $.extend(true, { time: 1000 * 2 }, json);
            return layer.msg((text || ""), json);
        },

        //冒泡提示-成功
        oktip: function (text) {
            parent.layer.open({
                type: 1,
                closeBtn: 0,
                time: 1500,
                shade: false,
                anim: 0,
                offset: ['100px'],
                title: false, //不显示标题
                content: "<div style='padding:15px 20px;background-color:#5FB878;border-radius:3px;color:#fff;' ><i class='layui-icon' style='font-size:25px' >&#xe6af;</i>&nbsp;&nbsp;" + (text || "") + "</div>",
            });
        },
        //冒泡提示-失败
        notip: function (text, json) {
            parent.layer.open({
                type: 1,
                closeBtn: 0,
                time: 1500,
                shade: false,
                anim: 0,
                offset: ['100px'],
                title: false, //不显示标题
                content: "<div style='padding:15px 20px;background-color: #E55D40;border-radius:3px;color:#fff;' ><i class='layui-icon' style='font-size:25px' >&#xe69c;</i>&nbsp;&nbsp;" + (text || "") + "</div>",
            });
        },
        //加载中
        load: function (text, json) {
            json = $.extend(true, { icon: 2 }, json);
            return layer.load((text || ""), json);
        },
        //确认
        confirm: function (text, callbck,callbck2) {
            return layer.confirm(text, callbck, callbck2);
        },
        //关闭指定弹窗
        close: function (index) {
            layer.close(index);
        },
        //关闭所有
        closeAll: function () {
            layer.closeAll();
        }
        ,
        /**
		 * 抛出一个异常错误信息
		 * @param {String} msg
		 */
        throwError: function (msg) {
            throw new Error(msg);
            return;
        },
        /**
		 * 弹出一个错误提示
		 * @param {String} msg
		 */
        msgError: function (msg) {
            layer.msg(msg, {
                icon: 5
            });
            return;
        },
        /**
         * 绑定enter输入提交事件
         * @bindSelector 需要绑定事件的元素
         * 需要触发的元素
         */
        bindEnterEvent: function ($bindSelector, $eventSelector) {
            $.each($bindSelector, function () {
                $(this).unbind("keydown").bind("keydown", function (event) {
                    if (event.keyCode == 13) {
                        if (typeof $eventSelector == 'function') {
                            $eventSelector();
                        } else {
                            $eventSelector.click();
                        }
                    }
                })
            });
        },
        /**
       * 取得指定元素中复选框的值，多个以“，”号分割返回
       * @options 参数对象 callback 回调函数
       */
        getSelect: function (text, callback, json) {
            //单个点击
            if (json) {
                if (text && text != "") {
                    common.confirm(text, function () {
                        callback(json);
                    })
                } else {
                    callback(json);
                }
                //多个自动从页面获取
            } else {
                var table = layui.table;
                var idsz = new Array();
                if (table) {
                    var checkStatus = table.checkStatus('tableList');
                    $.each(checkStatus.data, function (i, jitem) {
                        var fieldKey = $("#tableList").data("fieldKey");
                        if (fieldKey.indexOf(".") > -1) {
                            fieldKey = fieldKey.substr(fieldKey.indexOf(".") + 1, fieldKey.length - fieldKey.indexOf("."))
                        }
                        idsz.push(jitem[fieldKey]);
                    });
                } else {
                    $.each($(".ckbox:checked"), function (i,s) {
                        idsz.push($(this).val());
                    });
                }
                if (idsz.length <= 0) {
                    common.msg("请勾选您要操作的数据!");
                    return;
                }
                if (!text || text == "") {
                    text = "您当前选中" + idsz.length + "条记录，确定要继续吗？";
                } else {
                    text = "您当前选中" + idsz.length + "条记录，<br/>"+text;
                }
                common.confirm(text, function () {
                    callback(idsz.join(","));
                })
            }
        },
        //转换json日期为显示格式
        date: {
            /**
             * 将字符串或数值类型转换为日期
             * @param obj 
             * @returns
             */
            toDate: function (obj) {
                return $.type(obj) === 'date' ? obj : ($.type(obj) === 'string' ? _inner.string.toDate(obj) : new Date(obj));
            },
            jsonToDate: function (NewDtime) {
                if (!NewDtime || NewDtime.length <= 0 || NewDtime.indexOf("-") > 0) { return ""; }
                var dt = new Date(parseInt(NewDtime.slice(6, 19)));
                var year = dt.getFullYear();
                var month = dt.getMonth() + 1;
                var date = dt.getDate();
                var hour = dt.getHours().toString().length == 1 ? "0" + dt.getHours() : dt.getHours();
                var minute = dt.getMinutes().toString().length == 1 ? "0" + dt.getMinutes() : dt.getMinutes();
                var second = dt.getSeconds().toString().length == 1 ? "0" + dt.getSeconds() : dt.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            /**
             * 日期格式化
             * @author OuLinhai
             * @date 2018-05-18	
             * @param date 日期
             * @param format 格式字符串
             * @returns 格式化之后的日期字符串
             */
            format: function (date, format) {
                if (!date || date.length <= 0) { return ""; }
                date = new Date(date);
                format = !format ? 'yyyy-MM-dd' : format;
                var dict = {
                    'yyyy': date.getFullYear(),
                    'M': date.getMonth() + 1,
                    'd': date.getDate(),
                    'H': date.getHours(),
                    'm': date.getMinutes(),
                    's': date.getSeconds(),
                    'MM': ('' + (date.getMonth() + 101)).substr(1),
                    'dd': ('' + (date.getDate() + 100)).substr(1),
                    'HH': ('' + (date.getHours() + 100)).substr(1),
                    'mm': ('' + (date.getMinutes() + 100)).substr(1),
                    'ss': ('' + (date.getSeconds() + 100)).substr(1)
                };
                return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
                    return dict[arguments[0]];
                });
            }
        },

        /**
        * 弹出层并绑定模板
        * path :本地模板id
        */
        open: function (options, callback) {
            var getTpl = $(options.path).html();
            options = $.extend(true, { btnAlign: 'c', data: {} }, options);
            options.zIndex = 1994;
            options.full = function (elem) {
                var win = window.top === window.self ? window : parent.window;
                $(win).on('resize', function () {
                    var $this = $(this);
                    elem.width($this.width()).height($this.height()).css({
                        top: 0,
                        left: 0
                    });
                    elem.children('div.layui-layer-content').height($this.height() - 95);
                });
                if (options.resizeDo) {
                    options.resizeDo(elem);
                }
            };
            options.restore = function (elem) {
                if (options.resizeDo) {
                    options.resizeDo(elem);
                }
            };
            if (typeof options.data == "string") {
                var lindex = layer.load(2);
                $.ajax({
                    type: "post",
                    url: options.data,
                    data: options.paras,
                    success: function (json) {
                        layer.close(lindex);
                        if (json.Status.Code != 200) {
                            layer.alert(json.Status.Remark, { icon: 5 });
                            return;
                        }
                        laytpl(getTpl).render(json.ReturnData, function (html) {
                            options.content = html;
                            options.data = json;
                            var oindex = layer.open(options);
                            pageInit.init($("#layui-layer" + oindex));
                            if (callback) {
                                callback($("#layui-layer" + oindex), options)
                            }
                            return;
                        });
                    }
                });
            } else {
                laytpl(getTpl).render(options.data, function (html) {
                    options.content = html;
                    var oindex = layer.open(options);
                    pageInit.init($("#layui-layer" + oindex));
                    if (callback) {
                        callback($("#layui-layer" + oindex), options)
                    }
                    return;
                });
            }
        },
        /**
        * 弹出选择组件
        */
        openSelect: function (parent, options) {
            var listindex = "";
            var dftoptions = {
                type: 2,
                fix: false, //不固定
                maxmin: true,
                btnAlign: 'c',
                btn: ['确认选择', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    var selectArray = [];//选中的数据
                    var idArray = [];    //存储ID数组

                    //1***取得选中的数据
                    body.find(".ckbox:checked").each(function () {
                        var trjson = eval('(' + $(this).parents("tr").attr("bindvalue") + ')');
                        var idkey = options.id;
                        var namekey = options.name;
                        var newJson = "{" + idkey + ":'" + trjson[options.id] + "'," + namekey + ":'" + trjson[options.name] + "'}";
                        newJson = eval('(' + newJson + ')');
                        idArray.push(trjson[options.id]);
                        selectArray.push(newJson);
                    })
                    if (selectArray.length <= 0) {
                        layer.alert("请选择")
                        return;
                    }
                    layer.close(listindex);

                    //2****取得原旧有的
                    var oldIDstr = parent.find("#" + dftoptions.selector).val();
                    var oldArray = parent.find("#Data" + dftoptions.selector).val();
                    if (oldArray.length > 0) { oldArray = eval('(' + oldArray + ')') } else { oldArray = []; };

                    //3、合并结果
                    $.each(selectArray, function (i, s) {
                        var theid = s[options.id];
                        var thename = s[options.name];
                        if (("," + oldIDstr + ",").indexOf("," + theid + ",") == -1)//原来不存在则增加,否则不做处理
                        {
                            if (oldIDstr.length > 0) { oldIDstr += ","; }
                            oldIDstr += theid;
                            oldArray.push(s);
                        }
                    });
                    //4、生成结果
                    var itemspan = "";
                    $.each(oldArray, function (i, s) {
                        itemspan += "<span bindvalue='" + s[options.id] + "' class='item' ><span class='text' >" + s[options.name] + "</span>&nbsp;<i class='layui-icon' style='color: #F7B824'>&#x1007;</i></span>";
                    });
                    var $listspan = parent.find("#" + dftoptions.selector).parents(".mulitSelectedGroup").find(".selectedlist");
                    $listspan.html(itemspan);
                    parent.find("#Data" + dftoptions.selector).val(JSON.stringify(oldArray));
                    parent.find("#" + dftoptions.selector).val(oldIDstr);

                    //绑定删除效果
                    deleteitem();
                }
            }
            dftoptions = $.extend(true, dftoptions, options);
            parent.find("#Get" + dftoptions.selector).on("click", function () {
                listindex = layer.open(dftoptions);
            });

            //绑定删除效果
            var deleteitem = function () {
                $listspan.find(".item").unbind("click").on("click", function () {
                    var delIDArray = [];
                    var delArray = [];
                    $(this).remove();
                    $listspan.find(".item").each(function () {
                        delIDArray.push($(this).attr("bindvalue"));
                        var idkey = options.id;
                        var namekey = options.name;
                        var newJson = "{" + idkey + ":'" + $(this).attr("bindvalue") + "'," + namekey + ":'" + $(this).find(".text").text() + "'}";
                        newJson = eval('(' + newJson + ')')
                        delArray.push(newJson)
                    });
                    if (delArray.length <= 0) {
                        delArray = "";
                    } else {
                        delArray = JSON.stringify(delArray);
                    }
                    parent.find("#Data" + dftoptions.selector).val(delArray);
                    parent.find("#" + dftoptions.selector).val(delIDArray.join(","));
                });
            }

            //首次根据Data集合初始化
            var initArray = parent.find("#Data" + dftoptions.selector).val();
            var initIdArray = [];
            if (initArray.length > 0) { initArray = eval('(' + initArray + ')') } else { initArray = []; };
            var inititemspan = "";
            $.each(initArray, function (i, s) {
                initIdArray.push(s[options.id]);
                inititemspan += "<span bindvalue='" + s[options.id] + "' class='item' ><span class='text'> " + s[options.name] + "</span>&nbsp;<i class='layui-icon' style='color: #F7B824'>&#x1007;</i></span>";
            });
            var $listspan = parent.find("#" + dftoptions.selector).parents(".mulitSelectedGroup").find(".selectedlist");
            $listspan.html(inititemspan);
            parent.find("#" + dftoptions.selector).val(initIdArray.join(","));
            deleteitem();
        },
        //options {tpl:"",data:{},elem:""}
        html: function (options, callback) {
            var getTpl = $(options.tpl).html();
            laytpl(getTpl).render(options.data, function (html) {
                if (options.elem) {
                    options.elem.html(html);
                }
                if (!options.notRender) {
                    common.render();
                }
                callback(html);
            });
        },
        //转换为文件大小
        fileSize: function (limit) {
            var size = "";
            if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B  
                size = limit.toFixed(2) + "B";
            } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
                size = (limit / 1024).toFixed(2) + "KB";
            } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
                size = (limit / (1024 * 1024)).toFixed(2) + "MB";
            } else { //其他转化成GB  
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            }

            var sizestr = size + "";
            var len = sizestr.indexOf("\.");
            var dec = sizestr.substr(len + 1, 2);
            if (dec == "00") {//当小数点后为00时 去掉小数部分  
                return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
            }
            return sizestr;
        },
        //秒转换为时间
        secToTime:function(s) {
            var t;
            if(s > -1){
                var hour = Math.floor(s/3600);
                var min = Math.floor(s/60) % 60;
                var sec = s % 60;
                if(hour < 10) {
                    t = '0'+ hour + ":";
                } else {
                    t = hour + ":";
                }

                if(min < 10){t += "0";}
                t += min + ":";
                if(sec < 10){t += "0";}
                t += sec.toFixed(2);
            }
            return t;
        },
        //导出
        ExportFile: function (options) {
            var form = $("<form>"); form.attr('style', 'display:none'); form.attr('action', options.url);
            options.searchform.find("[name]").each(function (i, s) {
                var cloneObj = $(s).clone(false);
                form.append(cloneObj);
                cloneObj.val($(s).val());
            })
            form.attr('method', 'post'); $('body').append(form); form.submit(); $('body').remove(form);
        }
    };
    exports('common', common);
});