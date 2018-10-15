/**
 * Name:tableui.js
 * Desc:华喜·希安 - 展示表格组件.用于展示偏前台个性化的表格展示
 * Author:Yang Wei · date 2018/3/21
 * LICENSE:HX·XA.YangWei
 */
layui.define(['layer', 'laypage', 'laytpl', 'common', 'form'], function (exports) {
    "use strict";
    var $ = layui.jquery,
		layer = parent.layui.layer === undefined ? layui.layer : parent.layui.layer,
		laytpl = layui.laytpl,
		common = layui.common,
        form = layui.form;

    var tableui = function () {
        this.config = {
            url: undefined, //数据远程地址
            type: 'POST', //数据的获取方式  get or post
            elem: undefined, //内容容器
            params: null, //获取数据时传递的额外参数
            openWait: true,//加载数据时是否显示等待框 
            tempElem: undefined, //模板容器
            paged: true,
            pageConfig: { //参数应该为object类型
                elem: undefined,
                pageSize: 15 //分页大小
            },
            success: undefined, //type:function
            fail: undefined, //type:function
            complate: undefined, //type:function
            serverError: function (xhr, status, error) { //ajax的服务错误
                throwError("错误提示： " + xhr.status + " " + xhr.statusText);
            }
        };
    };
    /**
     * 版本号
     */
    tableui.prototype.v = '1.0.1';

    /**
	 * 设置
	 * @param {Object} options
	 */
    tableui.prototype.set = function (options) {
        var that = this;

        $.extend(true, that.config, options);
        return that;
    };
    /**
	 * 初始化
	 * @param {Object} options
	 */
    tableui.prototype.init = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        var _config = that.config;
        if (_config.url === undefined) {
            throwError('tableui Error:请配置远程URL!');
        }
        if (_config.elem === undefined) {
            throwError('tableui Error:请配置参数elem!');
        }
        if ($(_config.elem).length === 0) {
            throwError('tableui Error:找不到配置的容器elem!');
        }
        if (_config.tempElem === undefined) {
            throwError('tableui Error:请配置参数tempElem!');
        }
        if ($(_config.tempElem).length === 0) {
            throwError('tableui Error:找不到配置的容器tempElem!');
        }
        if (_config.paged) {
            var _pageConfig = _config.pageConfig;
            if (_pageConfig.elem === undefined) {
                throwError('tableui Error:请配置参数pageConfig.elem!');
            }
        }
        if (_config.type.toUpperCase() !== 'GET' && _config.type.toUpperCase() !== 'POST') {
            throwError('tableui Error:type参数配置出错，只支持GET或都POST');
        }
        //绑定排序
        $(_config.elem).parents("table").eq(0).find("[order]").each(function (i, s) {
            var otype = "asc";
            if ($(s).attr("otype") == "desc") {
                otype = "desc";
            }
            var icon = "&#xe619;";
            //将页面上与当前参数符合的按钮设置排序变化
            if (otype == "asc") {
                icon = "&#xe619;"
            } else {
                icon = "&#xe61a;"
            }
            var imgstr = "&nbsp;<i class='layui-icon' style='font-size: 14px; color: #1E9FFF;'>{0}</i>";
            $(s).html(imgstr.replace("{0}", icon));
            $(s).parents("th").eq(0).css("cursor", "pointer");

            $(s).parents("th").eq(0).unbind("click").click(function () {
                if ($(_config.elem).data("orderclose")) { return layer.msg("请勿连续点击!"); }
                $(_config.elem).data("orderclose", true); //禁用再次点击
                var clickorder = $(this).find("[order]").attr("otype");
                if (clickorder == "desc") {
                    $(this).find("[order]").attr("otype", "asc");
                    $(this).find("[order]").html(imgstr.replace("{0}", "&#xe619;"));
                } else {
                    $(this).find("[order]").attr("otype", "desc")
                    $(this).find("[order]").html(imgstr.replace("{0}", "&#xe61a;"));
                }
                _config.pageConfig.SortColumn = $(this).find("[order]").attr("order");
                _config.pageConfig.SortOrder = $(this).find("[order]").attr("otype");
                that.get(_config);
            });
        });
        //默认参数
        var df = {
            pageIndex: 1,
            pageSize: 10,
            SortColumn: "",
            SortOrder: "",
            RowCount: 0,
        };
        _config.pageConfig = $.extend(true, df, _config.pageConfig);
        _config.pageConfig.RowCount = 0;
        that.get(_config);
        return that;
    };
    /**
	 * 获取数据
	 * @param {Object} options
	 */
    tableui.prototype.get = function (options) {
        var that = this;
        var _config = that.config;
        _config.pageConfig.pageSize = _config.pageConfig.limit;
        _config.pageConfig.pageIndex = _config.pageConfig.curr;
        var loadIndex = undefined;
        if (_config.openWait) {
            loadIndex = layer.load(2);
        }
        $.extend(true, _config, options);
        //layer.alert("||"+JSON.stringify(_config));
        $.ajax({
            type: _config.type,
            url: _config.url,
            data: "IsPager=true&PageSize=" + _config.pageConfig.pageSize + "&PageIndex=" + _config.pageConfig.pageIndex
                + "&SortColumn=" + _config.pageConfig.SortColumn + "&SortOrder=" + _config.pageConfig.SortOrder + "&RowCount=" + _config.pageConfig.RowCount + "&" + _config.params,
            dataType: 'json',
            success: function (result, status, xhr) {
                $(_config.elem).data("orderclose", false);
                $(_config.elem).data("prePageIndex", _config.pageConfig.pageIndex);
                if (result.Status.Code == 200) {
                    //获取模板
                    var tpl = $(_config.tempElem).html();
                    //渲染数据
                    laytpl(tpl).render(result.ReturnData, function (html) {
                        $(_config.elem).html(html);
                        $(_config.elem).find(".jsontime").each(function () {
                            var format = $(this).attr("format");
                            if (!format) { format = "yyyy-MM-dd"; }
                            $(this).html(common.date.format(common.date.jsonToDate($(this).attr("bindvalue")), format));
                        })
                        //绑定行点击、复选框全选效果
                        form.render();
                        $('.site-table tbody tr td').on('click', function (event) {
                            var $this = $(this).parents("tr");
                            var $thistd = $(this);
                            var noEvent = $thistd.hasClass("noEvent");
                            noEvent = $thistd.find("input[type=checkbox],input[type=radio],.layui-btn").length > 0;
                            var $input = $this.find('input[lay-skin=primary]');
                            if ($input.prop("checked")) {
                                $this.removeClass('trselected').addClass('trselected');
                            } else {
                                $this.removeClass('trselected');
                            }
                            if (noEvent) { return; }
                            if ($input.prop("checked")) {
                                $input.prop("checked", false);
                            } else {
                                $input.prop("checked", true);
                            }
                            if ($input.prop("checked")) {
                                $this.removeClass('trselected').addClass('trselected');
                            } else {
                                $this.removeClass('trselected');
                            }
                            form.render('checkbox');
                        });
                        $('.site-table tbody tr').on('dblclick', function (event) {
                            if (options.dbClick) {
                                options.dbClick($(this));
                            }
                        });
                        form.on('checkbox(selected-all)', function (data) {
                            var elem = data.elem;
                            $(_config.elem).find('input[lay-skin=primary]').prop("checked", elem.checked);
                            form.render('checkbox');
                            $(_config.elem).find('input[lay-skin=primary]').each(function () {
                                if ($(this).prop("checked")) {
                                    $(this).parents("tr").eq(0).removeClass("trselected").addClass("trselected");
                                } else {
                                    $(this).parents("tr").eq(0).removeClass("trselected");
                                }
                            })
                        });
                    });
                    if (_config.paged && (result.RecordCount != $(_config.pageConfig.elem).data("RecordCount"))) {
                        if (result.RecordCount === null) {
                            throwError('tableui Error:请返回数据总数！');
                            return;
                        }
                        _config.pageConfig.RowCount = result.RecordCount;
                        var _pageConfig = _config.pageConfig;
                        var pageSize = _pageConfig.pageSize;
                        var pages = result.RecordCount % pageSize == 0 ?
							(result.RecordCount / pageSize) : (result.RecordCount / pageSize + 1);
                        var defaults = {
                            elem: _pageConfig.elem.replace("#",""),
                            curr: _config.pageConfig.pageIndex,
                            count: result.RecordCount,
                            groups: 3,
                            jump: function (obj, first) {
                                //得到了当前页，用于向服务端请求对应数据
                                if (!first) {
                                    _config.pageConfig.curr = obj.curr;
                                    _config.pageConfig.limit = obj.limit;
                                    that.get(_config);
                                }
                            }
                        };
                        $.extend(true, defaults, _pageConfig);//参数合并
                        //layer.alert(JSON.stringify(defaults));
                        layui.laypage.render(defaults);
                        if (_config.pageConfig.RowCount <= 0)
                        {
                            $(_pageConfig.elem).hide();
                        }
                        _config.loaded = true;
                        $(_config.pageConfig.elem).data("RecordCount", result.RecordCount);
                    }
                    if (_config.success) {
                        _config.success($(_config.elem).parents("table").eq(0), result); //渲染成功
                        $(_config.elem).parents("table").eq(0).find(".tnumber").each(function (i, s) {
                            $(this).html((_config.pageConfig.pageIndex-1) * _config.pageConfig.pageSize + i+1);
                        })
                    }
                    if (result.RecordCount > 0) {
                        $(_config.elem).parents("table").eq(0).find(".nodata").remove();
                        $(_config.pageConfig.elem).show();
                    } else {
                        $(_config.pageConfig.elem).hide();
                    }
                } else {
                    if (_config.fail) {
                        _config.fail(result.Status.Remark); //获取数据失败
                    } else {
                        layer.alert(result.Status.Remark, { icon: 5 });
                    }
                }

                if (_config.complate) {
                    _config.complate(); //渲染完成
                }
                if (loadIndex !== undefined)
                    layer.close(loadIndex);//关闭等待层
            },
            error: function (xhr, status, error) {
                if (loadIndex !== undefined)
                    layer.close(loadIndex);//关闭等待层
                _config.serverError(xhr, status, error); //服务器错误
            }
        });
    };
    /**
	 * 抛出一个异常错误信息
	 * @param {String} msg
	 */
    function throwError(msg) {
        throw new Error(msg);
        return;
    };

    var tableui = new tableui();
    exports('tableui', function (options) {
        return tableui.set(options);
    });
});