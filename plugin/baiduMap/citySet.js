﻿

function SelCity(obj, e) {
    var ths = obj;
    var dal = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li><li>区县</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><ul style="display:none" id="_citys2" class="_citys1  selectcitys2"></div></ul>';
    Iput.show({ id: ths, event: e, content: dal,width:"470"});
    $("#cColse").click(function () {
        Iput.colse();
    });
    var tb_province = [];
    var b = province;
    for (var i = 0, len = b.length; i < len; i++) {
        tb_province.push('<a data-level="0" data-id="' + b[i]['id'] + '" data-name="' + b[i]['name'] + '">' + b[i]['name'] + '</a>');
    }
    $("#_citys0").append(tb_province.join(""));
    $("#_citys0 a").click(function () {
        var g = getCity($(this));
        $("#_citys1 a").remove();
        $("#_citys1").append(g);
        $("._citys1").hide();
        $("._citys1:eq(1)").show();
        $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
        $(this).addClass("AreaS");
        var lev = $(this).data("name");//可以改变一个id来固定是哪个省份
        ths.value = $(this).data("name");//可以改变一个id来固定是哪个省份
        if (document.getElementById("hcity") == null) {
            var hcitys = $('<input>', {
                type: 'hidden',
                name: "hcity",
                "data-id": $(this).data("id"),//可以改变一个id来固定是哪个省份的id
                id: "hcity",
                val: lev
            });
           $(ths).after(hcitys);
        }
        else {
            $("#hcity").val(lev);
            $("#hcity").attr("data-id", $(this).data("id"));
        }
        $("#_citys1 a").click(function () {
            $("#_citys1 a,#_citys2 a").removeClass("AreaS");
            $(this).addClass("AreaS");
            var lev =  $(this).data("name");
            if (document.getElementById("hproper") == null) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: "hproper",
                    "data-id": $(this).data("id"),
                    id: "hproper",
                    val: lev
                });
                $(ths).after(hcitys);
            }
            else {
                $("#hproper").attr("data-id", $(this).data("id"));
                $("#hproper").val(lev);
            }
            var bc = $("#hcity").val();
            ths.value = bc+ "-" + $(this).data("name");

            var ar = getArea($(this));

            $("#_citys2 a").remove();
            $("#_citys2").append(ar);
            $("._citys1").hide();
            $("._citys1:eq(2)").show();

            $("#_citys2 a").click(function () {
                $("#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                var lev = $(this).data("name");
                if (document.getElementById("harea") == null) {
                    var hcitys = $('<input>', {
                        type: 'hidden',
                        name: "harea",
                        "data-id": $(this).data("id"),
                        id: "harea",
                        val: lev
                    });
                    $(ths).after(hcitys);
                }
                else {
                    $("#harea").val(lev);
                    $("#harea").attr("data-id", $(this).data("id"));
                }
                var bc = $("#hcity").val();
                var bp = $("#hproper").val();
                ths.value = bc + "-" + bp + "-" + $(this).data("name");
                //var textWidth = function (text) {
                //    var sensor = $('<pre>' + text + '</pre>').css({ display: 'none' });
                //    $('body').append(sensor);
                //    var width = sensor.width();
                //    sensor.remove();
                //    return width;
                //};
                //$("#select-city").width(textWidth($("#select-city").val()));
                //2018年4月28号，只显示区的显示
                //  ths.value = $(this).data("name")+" | 切换 |";
                localStorage.setItem("address", $(this).data("name") + "[ 切换 ]");
                $("#select-city").attr("title", bc + "-" + bp + "-" + $(this).data("name"));
                localStorage.setItem("address2", bc + "-" + bp + "-" + $(this).data("name"));
              
              
              Iput.colse();
            });

        });
    });
    $("#_citysheng li").click(function () {
        $("#_citysheng li").removeClass("citySel");
        $(this).addClass("citySel");
        var s = $("#_citysheng li").index(this);
        $("._citys1").hide();
        $("._citys1:eq(" + s + ")").show();
    });
}

function getCity(obj) {
    var c = obj.data('id');
    var e = province;
    var f;
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['id'] == parseInt(c)) {
            f = e[i]['city'];
            break
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }
    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(1)").addClass("citySel");
    return g;
}
function getArea(obj) {
    var c = obj.data('id');
    var e = area;
    var f = [];
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['pid'] == parseInt(c)) {
            f.push(e[i]);
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }

//  var g2 = '';
//  $.ajax({
//      type: "post",
//      url: '/home/GetDongGuanArea',
//      dataType: "json",
//      async: false,
//      success: function (json) {
//
//          if (json.Status.Code == 200) {
//              g2 = g2 + '<li><a data-level="1" data-id="全市" data-name="全市" title="东莞市">全市</a></li>';
//              $(json.ReturnData).each(function (index, element) {
//                  g2 += '<li><a data-level="1" data-id="'+element.F_AREAID+'" data-name="' + element.F_AREANAME + '" title="' + element.F_AREANAME + '">' + element.F_AREANAME + '</a></li>'
//
//              })
//             
//          }
//      },
//      error: function (data) {
//          console.log("请求失败", data);
//      }
//  });
//  g = g2

    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(2)").addClass("citySel");
    return g;
}

function getAreaAjax(){
	
    $.ajax({
        type: "post",
        url: '/home/GetDongGuanArea',
        dataType: "json",
        async: false,
        success: function (json) {

            if (json.Status.Code == 200) {
                g2 = g2 + '<li><a data-level="1" data-id="全市" data-name="全市" title="东莞市">全市</a></li>';
                $(json.ReturnData).each(function (index, element) {
                    g2 += '<li><a data-level="1" data-id="'+element.F_AREAID+'" data-name="' + element.F_AREANAME + '" title="' + element.F_AREANAME + '">' + element.F_AREANAME + '</a></li>'

                })
               
            }
        },
        error: function (data) {
            console.log("请求失败", data);
        }
    });
    
}
