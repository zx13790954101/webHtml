layui.define(['jquery'],
function (exports) {
    var jQuery = layui.jquery;
    jQuery.getScript("/ResourcesMng/jspack/xheditor-1.2.2/xheditor_lang/zh-cn.js");
    /*! xhEditor v1.2.2 | (c) 2009, 2013 xheditor.com.
       Licence: http://xheditor.com/license/lgpl.txt */
    !
    function () {
        var a = {};
        window.XHEDITOR = a
    }(),
    function (a, b) {
        a.mapLang = {},
        a.setLang = function (c, d) {
            d === b && (d = c, c = ""),
            "" !== c && (c += ".");
            var e, f;
            for (var g in d) f = d[g],
            e = c + g,
            "string" == typeof f || f instanceof Array ? a.mapLang[e] = f : a.setLang(e, f)
        },
        a.getLang = function (c) {
            var d = a.mapLang[c];
            if (d === b && (d = c.replace(/{#([^{}]+)}/g,
            function (b, c) {
                var d = a.mapLang[c];
                return d ? d : c
            })), "string" == typeof d) {
                var e = arguments;
                d = d.replace(/{\$(\d+)}/g,
                function (a, c) {
                    var d = e[parseInt(c, 10) + 1];
                    return d !== b ? d : a
                })
            }
            return d
        }
    }(XHEDITOR),
    function (a, b) {
        function c(a) {
            a = a.toLowerCase();
            var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            return {
                browser: b[1] || "",
                version: b[2] || "0"
            }
        }
        if (!a.browser) {
            var d = c(navigator.userAgent),
            e = {};
            d.browser && (e[d.browser] = !0, e.version = d.version),
            e.chrome ? e.webkit = !0 : e.webkit && (e.safari = !0),
            a.browser = e
        }
    }(jQuery),
    function (XHEDITOR, $, undefined) {
        var agent = navigator.userAgent.toLowerCase(),
        bMobile = /mobile/i.test(agent),
        browser = $.browser,
        browerVer = parseFloat(browser.version),
        isIE = browser.msie,
        isIE11 = /trident\//i.test(agent) && (/rv:/i.test(agent) || /Netscape/i.test(agent.appName)),
        isMozilla = browser.mozilla,
        isWebkit = browser.webkit,
        isOpera = browser.opera,
        isChrome = browser.chrome,
        bAir = agent.indexOf(" adobeair/") > -1,
        xCount = 0,
        bShowPanel = !1,
        bClickCancel = !0,
        bShowModal = !1,
        bCheckEscInit = !1,
        _jPanel,
        _jShadow,
        _jCntLine,
        _jPanelButton,
        jModal,
        jModalShadow,
        layerShadow,
        jOverlay,
        jHideSelect,
        onModalRemove,
        editorRoot,
        getLang = XHEDITOR.getLang;
        if ($("script[src*=xheditor]").each(function () {
            var a = this.src;
            return a.match(/xheditor[^\/]*\.js/i) ? (editorRoot = a.replace(/[\?#].*$/, "").replace(/(^|[\/\\])[^\/]*$/, "$1"), !1) : void 0
        }), isIE) {
            try {
                document.execCommand("BackgroundImageCache", !1, !0)
            } catch (e) { }
            var jqueryVer = $.fn.jquery;
            jqueryVer && jqueryVer.match(/^1\.[67]/) && ($.attrHooks.width = $.attrHooks.height = null)
        }
        var specialKeys = {
            27: "esc",
            9: "tab",
            32: "space",
            13: "enter",
            8: "backspace",
            145: "scroll",
            20: "capslock",
            144: "numlock",
            19: "pause",
            45: "insert",
            36: "home",
            46: "del",
            35: "end",
            33: "pageup",
            34: "pagedown",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12"
        },
        arrAlign = [{
            v: "justifyleft"
        },
        {
            v: "justifycenter"
        },
        {
            v: "justifyright"
        },
        {
            v: "justifyfull"
        }],
        arrList = [{
            v: "insertOrderedList"
        },
        {
            v: "insertUnorderedList"
        }],
        htmlPastetext = '<div><label for="xhePastetextValue">{#PastetextTip}</label></div><div><textarea id="xhePastetextValue" wrap="soft" spellcheck="false" style="width:300px;height:100px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlLink = '<div><label for="xheLinkUrl">{#link.url}</label><input type="text" id="xheLinkUrl" value="http://" class="xheText" /></div><div><label for="xheLinkTarget">{#link.target}</label><select id="xheLinkTarget"><option selected="selected" value="">{#default}</option><option value="_blank">{#link.targetBlank}</option><option value="_self">{#link.targetSelf}</option><option value="_parent">{#link.targetParent}</option></select></div><div style="display:none"><label for="xheLinkText">{#link.linkText}</label><input type="text" id="xheLinkText" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlAnchor = '<div><label for="xheAnchorName">{#anchor.name}</label><input type="text" id="xheAnchorName" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlImg = '<div><label for="xheImgUrl">{#img.url}</label><input type="text" id="xheImgUrl" value="http://" class="xheText" /></div><div><div><label for="xheImgAlt">{#img.alt}</label><input type="text" id="xheImgAlt" /></div><div><label for="xheImgAlign">{#img.align}</label><select id="xheImgAlign"><option selected="selected" value="">{#default}</option><option value="left">{#img.alignLeft}</option><option value="right">{#img.alignRight}</option><option value="top">{#img.alignTop}</option><option value="middle">{#img.alignMiddle}</option><option value="baseline">{#img.alignBaseline}</option><option value="bottom">{#img.alignBottom}</option></select></div><div><label for="xheImgWidth">{#img.width}</label><input type="text" id="xheImgWidth" style="width:40px;" /> <label for="xheImgHeight">{#img.height}</label><input type="text" id="xheImgHeight" style="width:40px;" /></div><div><label for="xheImgBorder">{#img.border}</label><input type="text" id="xheImgBorder" style="width:40px;" /></div><div><label for="xheImgHspace">{#img.hspace}</label><input type="text" id="xheImgHspace" style="width:40px;" /> <label for="xheImgVspace">{#img.vspace}</label><input type="text" id="xheImgVspace" style="width:40px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlFlash = '<div><label for="xheFlashUrl">{#flash.url}</label><input type="text" id="xheFlashUrl" value="http://" class="xheText" /></div><div><label for="xheFlashWidth">{#flash.width}</label><input type="text" id="xheFlashWidth" style="width:40px;" value="480" /> <label for="xheFlashHeight">{#flash.height}</label><input type="text" id="xheFlashHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlMedia = '<div><label for="xheMediaUrl">{#media.url}</label><input type="text" id="xheMediaUrl" value="http://" class="xheText" /></div><div><label for="xheMediaWidth">{#media.width}</label><input type="text" id="xheMediaWidth" style="width:40px;" value="480" /> <label for="xheMediaHeight">{#media.height}</label><input type="text" id="xheMediaHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlTable = '<div><label for="xheTableRows">{#table.rows}</label><input type="text" id="xheTableRows" style="width:40px;" value="3" /> <label for="xheTableColumns">{#table.columns}</label><input type="text" id="xheTableColumns" style="width:40px;" value="2" /></div><div><label for="xheTableHeaders">{#table.headers}</label><select id="xheTableHeaders"><option selected="selected" value="">{#none}</option><option value="row">{#table.headersRow}</option><option value="col">{#table.headersCol}</option><option value="both">{#table.headersBoth}</option></select></div><div><label for="xheTableWidth">{#table.width}</label><input type="text" id="xheTableWidth" style="width:40px;" value="200" /> <label for="xheTableHeight">{#table.height}</label><input type="text" id="xheTableHeight" style="width:40px;" value="" /></div><div><label for="xheTableBorder">{#table.border}</label><input type="text" id="xheTableBorder" style="width:40px;" value="1" /></div><div><label for="xheTableCellSpacing">{#table.cellSpacing}</label><input type="text" id="xheTableCellSpacing" style="width:40px;" value="1" /> <label for="xheTableCellPadding">{#table.cellPadding}</label><input type="text" id="xheTableCellPadding" style="width:40px;" value="1" /></div><div><label for="xheTableAlign">{#table.align}</label><select id="xheTableAlign"><option selected="selected" value="">{#default}</option><option value="left">{#table.alignLeft}</option><option value="center">{#table.alignCenter}</option><option value="right">{#table.alignRight}</option></select></div><div><label for="xheTableCaption">{#table.caption}</label><input type="text" id="xheTableCaption" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="{#dialogOk}" /></div>',
        htmlAbout = '<div style="font:12px Arial;width:245px;word-wrap:break-word;word-break:break-all;outline:none;" role="dialog" tabindex="-1"><p><span style="font-size:20px;color:#1997DF;">xhEditor</span><br />v1.2.2 (build 150426)</p><p>{#aboutXheditor}</p><p>Copyright &copy; <a href="http://xheditor.com/" target="_blank">xhEditor.com</a>. All rights reserved.</p></div>',
        itemEmots = {
            "default": {
                name: "{#default}",
                width: 24,
                height: 24,
                line: 7,
                list: ["smile", "tongue", "titter", "laugh", "sad", "wronged", "fastcry", "cry", "wail", "mad", "knock", "curse", "crazy", "angry", "ohmy", "awkward", "panic", "shy", "cute", "envy", "proud", "struggle", "quiet", "shutup", "doubt", "despise", "sleep", "bye"]
            }
        },
        arrTools = {
            Cut: {
                t: "Cut"
            },
            Copy: {
                t: "Copy"
            },
            Paste: {
                t: "Paste"
            },
            Pastetext: {
                t: "Pastetext",
                h: isIE ? 0 : 1
            },
            Blocktag: {
                t: "Blocktag",
                h: 1
            },
            Fontface: {
                t: "Fontface",
                h: 1
            },
            FontSize: {
                t: "FontSize",
                h: 1
            },
            Bold: {
                t: "Bold",
                s: "Ctrl+B"
            },
            Italic: {
                t: "Italic",
                s: "Ctrl+I"
            },
            Underline: {
                t: "Underline",
                s: "Ctrl+U"
            },
            Strikethrough: {
                t: "Strikethrough"
            },
            FontColor: {
                t: "FontColor",
                h: 1
            },
            BackColor: {
                t: "BackColor",
                h: 1
            },
            SelectAll: {
                t: "SelectAll"
            },
            Removeformat: {
                t: "Removeformat"
            },
            Align: {
                t: "Align",
                h: 1
            },
            List: {
                t: "List",
                h: 1
            },
            Outdent: {
                t: "Outdent"
            },
            Indent: {
                t: "Indent"
            },
            Link: {
                t: "Link",
                s: "Ctrl+L",
                h: 1
            },
            Unlink: {
                t: "Unlink"
            },
            Anchor: {
                t: "Anchor",
                h: 1
            },
            Img: {
                t: "Img",
                h: 1
            },
            Flash: {
                t: "Flash",
                h: 1
            },
            Media: {
                t: "Media",
                h: 1
            },
            Hr: {
                t: "Hr"
            },
            Emot: {
                t: "Emot",
                s: "ctrl+e",
                h: 1
            },
            Table: {
                t: "Table",
                h: 1
            },
            Source: {
                t: "Source"
            },
            Preview: {
                t: "Preview"
            },
            Print: {
                t: "Print",
                s: "Ctrl+P"
            },
            Fullscreen: {
                t: "Fullscreen",
                s: "Esc"
            },
            About: {
                t: "About"
            }
        },
        toolsThemes = {
            mini: "Bold,Italic,Underline,Strikethrough,|,Align,List,|,Link,Img",
            simple: "Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,|,Align,List,Outdent,Indent,|,Link,Img,Emot",
            full: "Cut,Copy,Paste,Pastetext,|,Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,|,Align,List,Outdent,Indent,|,Link,Unlink,Anchor,Img,Flash,Media,Hr,Emot,Table,|,Source,Preview,Print,Fullscreen"
        };
        toolsThemes.mfull = toolsThemes.full.replace(/\|(,Align)/i, "/$1");
        var arrDbClick = {
            a: "Link",
            img: "Img",
            embed: "Embed"
        },
        uploadInputname = "filedata",
        arrEntities = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "®": "&reg;",
            "©": "&copy;"
        },
        regEntities = /[<>"®©]/g,
        Xheditor = function (textarea, options) {
            function checkDblClick(a) {
                var b = a.target,
                c = arrDbClick[b.tagName.toLowerCase()];
                if (c) {
                    if ("Embed" === c) {
                        var d = {
                            "application/x-shockwave-flash": "Flash",
                            "application/x-mplayer2": "Media"
                        };
                        c = d[b.type.toLowerCase()]
                    }
                    _this.exec(c)
                }
            }
            function checkEsc(a) {
                return 27 === a.which ? (bShowModal ? _this.removeModal() : bShowPanel && _this.hidePanel(), !1) : void 0
            }
            function loadReset() {
                setTimeout(_this.setSource, 10)
            }
            function saveResult() {
                _this.getSource()
            }
            function cleanPaste(a) {
                var b, c, d;
                if (a && (b = a.originalEvent.clipboardData) && (c = b.items) && (d = c[0]) && "file" == d.kind && d.type.match(/^image\//i)) {
                    var e = d.getAsFile(),
                    f = new FileReader;
                    return f.onload = function () {
                        var a = '<img src="' + event.target.result + '">';
                        a = replaceRemoteImg(a),
                        _this.pasteHTML(a)
                    },
                    f.readAsDataURL(e),
                    !1
                }
                var g = settings.cleanPaste;
                if (0 === g || bSource || bCleanPaste) return !0;
                bCleanPaste = !0,
                _this.saveBookmark();
                var h = isIE ? "pre" : "div",
                i = $("<" + h + ' class="xhe-paste">\ufeff\ufeff</' + h + ">", _doc).appendTo(_doc.body),
                j = i[0],
                k = _this.getSel(),
                l = _this.getRng(!0);
                i.css("top", _jWin.scrollTop()),
                isIE || isIE11 ? (l.moveToElementText(j), l.select()) : (l.selectNodeContents(j), k.removeAllRanges(), k.addRange(l)),
                setTimeout(function () {
                    var a, b = 3 === g;
                    if (b) i.html(i.html().replace(/<br(\s+[^<>]*)?>/gi, "\n")),
                    a = i.text();
                    else {
                        var c = $(".xhe-paste", _doc.body),
                        d = [];
                        c.each(function (a, b) {
                            0 == $(b).find(".xhe-paste").length && d.push(b.innerHTML)
                        }),
                        a = d.join("<br />")
                    }
                    i.remove(),
                    _this.loadBookmark(),
                    a = a.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ""),
                    a && (b ? _this.pasteText(a) : (a = _this.cleanHTML(a), a = _this.cleanWord(a), a = _this.formatXHTML(a), (!settings.onPaste || settings.onPaste && (a = settings.onPaste(a)) !== !1) && (a = replaceRemoteImg(a), _this.pasteHTML(a)))),
                    bCleanPaste = !1
                },
                0)
            }
            function replaceRemoteImg(a) {
                var b = settings.localUrlTest,
                c = settings.remoteImgSaveUrl;
                if (b && c) {
                    var d = [],
                    e = 0;
                    a = a.replace(/(<img)((?:\s+[^>]*?)?(?:\s+src="\s*([^"]+)\s*")(?: [^>]*)?)(\/?>)/gi,
                    function (a, c, f, g, h) {
                        return ! /^(https?|data:image)/i.test(g) || /_xhe_temp/.test(f) || b.test(g) || (d[e] = g, f = f.replace(/\s+(width|height)="[^"]*"/gi, "").replace(/\s+src="[^"]*"/gi, ' src="' + skinPath + 'img/waiting.gif" remoteimg="' + e++ + '"')),
                        c + f + h
                    }),
                    d.length > 0 && $.post(c, {
                        urls: d.join("|")
                    },
                    function (a) {
                        a = a.split("|"),
                        $("img[remoteimg]", _this.doc).each(function () {
                            var b = $(this);
                            xheAttr(b, "src", a[b.attr("remoteimg")]),
                            b.removeAttr("remoteimg")
                        })
                    })
                }
                return a
            }
            function setCSS(a) {
                try {
                    _this._exec("styleWithCSS", a, !0)
                } catch (b) {
                    try {
                        _this._exec("useCSS", !a, !0)
                    } catch (b) { }
                }
            }
            function setOpts() {
                if (bInit && !bSource) {
                    setCSS(!1);
                    try {
                        _this._exec("enableObjectResizing", !0, !0)
                    } catch (a) { }
                    if (isIE) try {
                        _this._exec("BackgroundImageCache", !0, !0)
                    } catch (a) { }
                }
            }
            function forcePtag(a) {
                if (bSource || 13 !== a.which || a.shiftKey || a.ctrlKey || a.altKey) return !0;
                var b = _this.getParent("p,h1,h2,h3,h4,h5,h6,pre,address,div,li");
                return b.is("li") ? !0 : settings.forcePtag ? void (0 === b.length && _this._exec("formatblock", "<p>")) : (_this.pasteHTML("<br />"), isIE && b.length > 0 && 2 === _this.getRng().parentElement().childNodes.length && _this.pasteHTML("<br />"), !1)
            }
            function fixFullHeight() {
                isMozilla || isWebkit || (bFullscreen && _jArea.height("100%").css("height", _jArea.outerHeight() - _jTools.outerHeight()), isIE && _jTools.hide().show())
            }
            function fixAppleSel(a) {
                if (a = a.target, a.tagName.match(/(img|embed)/i)) {
                    var b = _this.getSel(),
                    c = _this.getRng(!0);
                    c.selectNode(a),
                    b.removeAllRanges(),
                    b.addRange(c)
                }
            }
            function xheAttr(a, b, c) {
                if (!b) return !1;
                var d = "_xhe_" + b;
                return c && (urlType && (c = getLocalUrl(c, urlType, urlBase)), a.attr(b, urlBase ? getLocalUrl(c, "abs", urlBase) : c).removeAttr(d).attr(d, c)),
                a.attr(d) || a.attr(b)
            }
            function clickCancelPanel() {
                bClickCancel && _this.hidePanel()
            }
            function checkShortcuts(a) {
                if (bSource) return !0;
                var b = a.which,
                c = specialKeys[b],
                d = c ? c : String.fromCharCode(b).toLowerCase();
                sKey = "",
                sKey += a.ctrlKey ? "ctrl+" : "",
                sKey += a.altKey ? "alt+" : "",
                sKey += a.shiftKey ? "shift+" : "",
                sKey += d;
                var e, f = arrShortCuts[sKey];
                for (e in f) {
                    if (e = f[e], !$.isFunction(e)) return _this.exec(e),
                    !1;
                    if (e.call(_this) === !1) return !1
                }
            }
            function is(a, b) {
                var c = typeof a;
                return b ? "array" === b && a.hasOwnProperty && a instanceof Array ? !0 : c === b : "undefined" != c
            }
            function getLocalUrl(a, b, c) {
                if (a.match(/^(\w+):\/\//i) && !a.match(/^https?:/i) || /^#/i.test(a) || /^data:/i.test(a)) return a;
                var d = c ? $('<a href="' + c + '" />')[0] : location,
                e = d.protocol,
                f = d.host,
                g = d.hostname,
                h = d.port,
                i = d.pathname.replace(/\\/g, "/").replace(/[^\/]+$/i, "");
                if ("" === h && (h = "80"), "" === i ? i = "/" : "/" !== i.charAt(0) && (i = "/" + i), a = $.trim(a), "abs" !== b && (a = a.replace(new RegExp(e + "\\/\\/" + g.replace(/\./g, "\\.") + "(?::" + h + ")" + ("80" === h ? "?" : "") + "(/|$)", "i"), "/")), "rel" === b && (a = a.replace(new RegExp("^" + i.replace(/([\/\.\+\[\]\(\)])/g, "\\$1"), "i"), "")), "rel" !== b && (a.match(/^(https?:\/\/|\/)/i) || (a = i + a), "/" === a.charAt(0))) {
                    var j, k, l = [],
                    m = a.split("/"),
                    n = m.length;
                    for (k = 0; n > k; k++) j = m[k],
                    ".." === j ? l.pop() : "" !== j && "." !== j && l.push(j);
                    "" === m[n - 1] && l.push(""),
                    a = "/" + l.join("/")
                }
                return "abs" !== b || a.match(/^https?:\/\//i) || (a = e + "//" + f + a),
                a = a.replace(/(https?:\/\/[^:\/?#]+):80(\/|$)/i, "$1$2")
            }
            function checkFileExt(a, b) {
                return "*" === b || a.match(new RegExp(".(" + b.replace(/,/g, "|") + ")$", "i")) ? !0 : (alert(getLang("upload.extLimit", b)), !1)
            }
            function formatBytes(a) {
                var b = ["Byte", "KB", "MB", "GB", "TB", "PB"],
                c = Math.floor(Math.log(a) / Math.log(1024));
                return (a / Math.pow(1024, Math.floor(c))).toFixed(2) + b[c]
            }
            function returnFalse() {
                return !1
            }
            var _this = this,
            _text = textarea,
            _jText = $(_text),
            _jForm = _jText.closest("form"),
            _jTools,
            _jArea,
            _win,
            _jWin,
            _doc,
            _jDoc,
            bookmark,
            bInit = !1,
            bSource = !1,
            bFullscreen = !1,
            bCleanPaste = !1,
            outerScroll,
            bShowBlocktag = !1,
            sLayoutStyle = "",
            ev = null,
            timer,
            bDisableHoverExec = !1,
            bQuickHoverExec = !1,
            lastPoint = null,
            lastAngle = null,
            editorHeight = 0,
            settings = _this.settings = $.extend({},
            XHEDITOR.settings, options),
            plugins = settings.plugins,
            strPlugins = [];
            if (plugins && (arrTools = $.extend({},
            arrTools, plugins), $.each(plugins,
            function (a) {
                strPlugins.push(a)
            }), strPlugins = strPlugins.join(",")), settings.tools.match(/^\s*(m?full|simple|mini)\s*$/i)) {
                var toolsTheme = toolsThemes[$.trim(settings.tools)];
                settings.tools = settings.tools.match(/m?full/i) && plugins ? toolsTheme.replace("Table", "Table," + strPlugins) : toolsTheme
            }
            settings.tools.match(/(^|,)\s*About\s*(,|$)/i) || (settings.tools += ",About"),
            settings.tools = settings.tools.split(","),
            settings.editorRoot && (editorRoot = settings.editorRoot),
            bAir === !1 && (editorRoot = getLocalUrl(editorRoot, "abs")),
            settings.urlBase && (settings.urlBase = getLocalUrl(settings.urlBase, "abs"));
            var idCSS = "xheCSS_" + settings.skin,
            idContainer = "xhe" + xCount + "_container",
            idTools = "xhe" + xCount + "_Tool",
            idIframeArea = "xhe" + xCount + "_iframearea",
            idIframe = "xhe" + xCount + "_iframe",
            idFixFFCursor = "xhe" + xCount + "_fixffcursor",
            headHTML = "",
            bodyClass = "",
            skinPath = editorRoot + "xheditor_skin/" + settings.skin + "/",
            arrEmots = itemEmots,
            urlType = settings.urlType,
            urlBase = settings.urlBase,
            emotPath = settings.emotPath,
            emotPath = emotPath ? emotPath : editorRoot + "xheditor_emot/",
            selEmotGroup = "";
            arrEmots = $.extend({},
            arrEmots, settings.emots),
            emotPath = getLocalUrl(emotPath, "rel", urlBase ? urlBase : null),
            bShowBlocktag = settings.showBlocktag,
            bShowBlocktag && (bodyClass += " showBlocktag");
            var arrShortCuts = [];
            this.init = function () {
                function a(a) {
                    var b, c = $(a.target); (b = c.css("width")) && c.css("width", "").attr("width", b.replace(/[^0-9%]+/g, "")),
                    (b = c.css("height")) && c.css("height", "").attr("height", b.replace(/[^0-9%]+/g, ""))
                }
                0 === $("#" + idCSS).length && $("head").append('<link id="' + idCSS + '" rel="stylesheet" type="text/css" href="' + skinPath + 'ui.css" />');
                var b = _jText.outerWidth(),
                c = _jText.outerHeight(),
                d = settings.width || _text.style.width || (b > 10 ? b : 0);
                editorHeight = settings.height || _text.style.height || (c > 10 ? c : 150),
                /^\d+(?:\.\d+)?$/.test(d) && (d += "px"),
                is(editorHeight, "string") && (editorHeight = editorHeight.replace(/[^\d]+/g, ""));
                var e, f, g = settings.background || _text.style.background,
                h = ['<span class="xheGStart"/>'],
                i = /\||\//i;
                $.each(settings.tools,
                function (a, b) {
                    if (b.match(i) && h.push('<span class="xheGEnd"/>'), "|" === b) h.push('<span class="xheSeparator"/>');
                    else if ("/" === b) h.push("<br />");
                    else {
                        if (e = arrTools[b], !e) return;
                        f = e.c ? e.c : "xheIcon xheBtn" + b,
                        h.push('<span><a href="#" title="{#' + e.t + '}" cmd="' + b + '" class="xheButton xheEnabled" tabindex="-1" role="button"><span class="' + f + '" unselectable="on" style="font-size:0;color:transparent;text-indent:-999px;">' + e.t + "</span></a></span>"),
                        e.s && _this.addShortcuts(e.s, b)
                    }
                    b.match(i) && h.push('<span class="xheGStart"/>')
                }),
                h.push('<span class="xheGEnd"/><br />'),
                _jText.after($('<input type="text" id="' + idFixFFCursor + '" style="position:absolute;display:none;" /><span id="' + idContainer + '" class="xhe_' + settings.skin + '" style="display:none"><table cellspacing="0" cellpadding="0" class="xheLayout" style="' + ("0px" != d ? "width:" + d + ";" : "") + "height:" + editorHeight + 'px;" role="presentation"><tr><td id="' + idTools + '" class="xheTool" unselectable="on" style="height:1px;" role="presentation"></td></tr><tr><td id="' + idIframeArea + '" class="xheIframeArea" role="presentation"><iframe frameborder="0" id="' + idIframe + '" src="javascript:;" style="width:100%;"></iframe></td></tr></table></span>')),
                _jTools = $("#" + idTools),
                _jArea = $("#" + idIframeArea),
                headHTML = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><link rel="stylesheet" href="' + skinPath + 'iframe.css"/>';
                var j = settings.loadCSS;
                if (j) if (is(j, "array")) for (var k in j) headHTML += '<link rel="stylesheet" href="' + j[k] + '"/>';
                else headHTML += j.match(/\s*<style(\s+[^>]*?)?>[\s\S]+?<\/style>\s*/i) ? j : '<link rel="stylesheet" href="' + j + '"/>';
                var l = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head>' + headHTML + "<title>{#defaultReadTip} " + (settings.readTip ? settings.readTip : "") + "</title>";
                g && (l += "<style>html{background:" + g + ";}</style>"),
                l += '</head><body spellcheck="0" class="editMode' + bodyClass + '"></body></html>',
                _this.win = _win = $("#" + idIframe)[0].contentWindow,
                _jWin = $(_win);
                try {
                    this.doc = _doc = _win.document,
                    _jDoc = $(_doc),
                    _doc.open(),
                    _doc.write(getLang(l)),
                    _doc.close(),
                    isIE ? _doc.body.contentEditable = "true" : _doc.designMode = "On"
                } catch (m) { }
                setTimeout(setOpts, 300),
                _this.setSource(),
                _win.setInterval = null,
                _jTools.append(getLang(h.join(""))).bind("mousedown contextmenu", returnFalse).click(function (a) {
                    var b = $(a.target).closest("a");
                    return b.is(".xheEnabled") && (clearTimeout(timer), _jTools.find("a").attr("tabindex", "-1"), ev = a, _this.exec(b.attr("cmd"))),
                    !1
                }),
                _jTools.find(".xheButton").hover(function (a) {
                    var b = $(this),
                    c = settings.hoverExecDelay,
                    d = lastAngle;
                    if (lastAngle = null, -1 === c || bDisableHoverExec || !b.is(".xheEnabled")) return !1;
                    if (d && d > 10) return bDisableHoverExec = !0,
                    setTimeout(function () {
                        bDisableHoverExec = !1
                    },
                    100),
                    !1;
                    var e = b.attr("cmd"),
                    f = 1 === arrTools[e].h;
                    return f ? (bQuickHoverExec && (c = 0), void (c >= 0 && (timer = setTimeout(function () {
                        ev = a,
                        lastPoint = {
                            x: ev.clientX,
                            y: ev.clientY
                        },
                        _this.exec(e)
                    },
                    c)))) : (_this.hidePanel(), !1)
                },
                function (a) {
                    lastPoint = null,
                    timer && clearTimeout(timer)
                }).mousemove(function (a) {
                    if (lastPoint) {
                        var b = {
                            x: a.clientX - lastPoint.x,
                            y: a.clientY - lastPoint.y
                        };
                        if (Math.abs(b.x) > 1 || Math.abs(b.y) > 1) {
                            if (b.x > 0 && b.y > 0) {
                                var c = Math.round(Math.atan(b.y / b.x) / .017453293);
                                lastAngle = lastAngle ? (lastAngle + c) / 2 : c
                            } else lastAngle = null;
                            lastPoint = {
                                x: a.clientX,
                                y: a.clientY
                            }
                        }
                    }
                }),
                _jPanel = $("#xhePanel"),
                _jShadow = $("#xheShadow"),
                _jCntLine = $("#xheCntLine"),
                0 === _jPanel.length && (_jPanel = $('<div id="xhePanel"></div>').mousedown(function (a) {
                    a.stopPropagation()
                }), _jShadow = $('<div id="xheShadow"></div>'), _jCntLine = $('<div id="xheCntLine"></div>'), setTimeout(function () {
                    $(document.body).append(_jPanel).append(_jShadow).append(_jCntLine)
                },
                10)),
                $("#" + idContainer).show(),
                _jText.hide(),
                _jArea.css("height", editorHeight - _jTools.outerHeight()),
                isIE & 8 > browerVer && setTimeout(function () {
                    _jArea.css("height", editorHeight - _jTools.outerHeight())
                },
                1),
                _jText.focus(_this.focus),
                _jForm.submit(saveResult).bind("reset", loadReset),
                settings.submitID && $("#" + settings.submitID).mousedown(saveResult),
                $(window).bind("unload beforeunload", saveResult).bind("resize", fixFullHeight),
                $(document).mousedown(clickCancelPanel),
                bCheckEscInit || ($(document).keydown(checkEsc), bCheckEscInit = !0),
                _jWin.focus(function () {
                    settings.focus && settings.focus()
                }).blur(function () {
                    settings.blur && settings.blur()
                }),
                isWebkit && _jWin.click(fixAppleSel),
                _jDoc.mousedown(clickCancelPanel).keydown(checkShortcuts).keypress(forcePtag).dblclick(checkDblClick).bind("mousedown click",
                function (a) {
                    _jText.trigger(a.type)
                }),
                isIE && (_jDoc.keydown(function (a) {
                    var b = _this.getRng();
                    return 8 === a.which && b.item ? ($(b.item(0)).remove(), !1) : void 0
                }), _jDoc.bind("controlselect",
                function (b) {
                    b = b.target,
                    $.nodeName(b, "IMG") && $(b).unbind("resizeend", a).bind("resizeend", a)
                })),
                _jDoc.keydown(function (a) {
                    var b = a.which;
                    return a.altKey && b >= 49 && 57 >= b ? (_jTools.find("a").attr("tabindex", "0"), _jTools.find(".xheGStart").eq(b - 49).next().find("a").focus(), _doc.title = "\ufeff\ufeff", !1) : void 0
                }).click(function () {
                    _jTools.find("a").attr("tabindex", "-1")
                }),
                _jTools.keydown(function (a) {
                    var b = a.which;
                    if (27 == b) _jTools.find("a").attr("tabindex", "-1"),
                    _this.focus();
                    else if (a.altKey && b >= 49 && 57 >= b) return _jTools.find(".xheGStart").eq(b - 49).next().find("a").focus(),
                    !1
                });
                var n = $(_doc.documentElement);
                isOpera ? n.bind("keydown",
                function (a) {
                    a.ctrlKey && 86 === a.which && cleanPaste()
                }) : n.bind(isIE ? "beforepaste" : "paste", cleanPaste),
                settings.disableContextmenu && n.bind("contextmenu", returnFalse),
                settings.html5Upload && n.bind("dragenter dragover",
                function (a) {
                    var b;
                    return (b = a.originalEvent.dataTransfer.types) && -1 !== $.inArray("Files", b) ? !1 : void 0
                }).bind("drop",
                function (a) {
                    function b(a) {
                        var b, c, d;
                        for (e = 0; e < a.length; e++) {
                            if (c = a[e].name.replace(/.+\./, ""), !(b = g.match(new RegExp("(\\w+):[^:]*," + c + "(?:,|$)", "i")))) return 1;
                            if (d) {
                                if (d !== b[1]) return 2
                            } else d = b[1]
                        }
                        return d
                    }
                    var c, d = a.originalEvent.dataTransfer;
                    if (d && (c = d.files) && c.length > 0) {
                        var e, f, g, h = ["Link", "Img", "Flash", "Media"],
                        i = [];
                        for (e in h) f = h[e],
                        settings["up" + f + "Url"] && settings["up" + f + "Url"].match(/^[^!].*/i) && i.push(f + ":," + settings["up" + f + "Ext"]);
                        return 0 === i.length ? !1 : (g = i.join(","), f = b(c), 1 === f ? alert(getLang("upload.extLimit", g.replace(/\w+:,/g, ""))) : 2 === f ? alert(getLang("upload.typeLimit")) : f && _this.startUpload(c, settings["up" + f + "Url"], "*",
                        function (a) {
                            var b, c = [],
                            d = settings.onUpload;
                            d && d(a);
                            for (var e = 0,
                            g = a.length; g > e; e++) b = a[e],
                            url = is(b, "string") ? b : b.url,
                            "!" === url.substr(0, 1) && (url = url.substr(1)),
                            c.push(url);
                            _this.exec(f),
                            $("#xhe" + f + "Url").val(c.join(" ")),
                            $("#xheSave").click()
                        }), !1)
                    }
                });
                var o = settings.shortcuts;
                o && $.each(o,
                function (a, b) {
                    _this.addShortcuts(a, b)
                }),
                xCount++,
                bInit = !0,
                settings.fullscreen ? _this.toggleFullscreen() : settings.sourceMode && setTimeout(_this.toggleSource, 20);
                var p = settings.plugins;
                return p && $.each(p,
                function (a, b) {
                    var c = b.i;
                    c !== undefined && c(_this)
                }),
                !0
            },
            this.remove = function () {
                _this.hidePanel(),
                saveResult(),
                _jText.unbind("focus", _this.focus),
                _jForm.unbind("submit", saveResult).unbind("reset", loadReset),
                settings.submitID && $("#" + settings.submitID).unbind("mousedown", saveResult),
                $(window).unbind("unload beforeunload", saveResult).unbind("resize", fixFullHeight),
                $(document).unbind("mousedown", clickCancelPanel),
                $("#" + idContainer).remove(),
                $("#" + idFixFFCursor).remove(),
                _jText.show(),
                bInit = !1
            },
            this.saveBookmark = function () {
                if (!bSource) {
                    _this.focus();
                    var a = _this.getRng();
                    a = a.cloneRange ? a.cloneRange() : a,
                    bookmark = {
                        top: _jWin.scrollTop(),
                        rng: a
                    }
                }
            },
            this.loadBookmark = function () {
                if (!bSource && bookmark) {
                    _this.focus();
                    var a = bookmark.rng;
                    if (isIE) a.select();
                    else {
                        var b = _this.getSel();
                        b.removeAllRanges(),
                        b.addRange(a)
                    }
                    _jWin.scrollTop(bookmark.top),
                    bookmark = null
                }
            },
            this.focus = function () {
                if (bSource ? $("#sourceCode", _doc).focus() : _win.focus(), isIE) {
                    var a = _this.getRng();
                    a.parentElement && a.parentElement().ownerDocument !== _doc && _this.setTextCursor()
                }
                return !1
            },
            this.setTextCursor = function (a) {
                var b = _this.getRng(!0),
                c = _doc.body;
                if (isIE || isIE11) b.moveToElementText(c);
                else {
                    for (var d = a ? "lastChild" : "firstChild"; 3 != c.nodeType && c[d];) c = c[d];
                    b.selectNode(c)
                }
                if (b.collapse(a ? !1 : !0), isIE || isIE11) b.select();
                else {
                    var e = _this.getSel();
                    e.removeAllRanges(),
                    e.addRange(b)
                }
            },
            this.getSel = function () {
                return _doc.selection ? _doc.selection : _win.getSelection()
            },
            this.getRng = function (a) {
                var b, c;
                try {
                    a || (b = _this.getSel(), c = b.createRange ? b.createRange() : b.rangeCount > 0 ? b.getRangeAt(0) : null),
                    c || (c = _doc.body.createTextRange ? _doc.body.createTextRange() : _doc.createRange())
                } catch (d) { }
                return c
            },
            this.getParent = function (a) {
                var b, c = _this.getRng();
                return isIE ? b = c.item ? c.item(0) : c.parentElement() : (b = c.commonAncestorContainer, c.collapsed || c.startContainer === c.endContainer && c.startOffset - c.endOffset < 2 && c.startContainer.hasChildNodes() && (b = c.startContainer.childNodes[c.startOffset])),
                a = a ? a : "*",
                b = $(b),
                b.is(a) || (b = $(b).closest(a)),
                b
            },
            this.getSelect = function (a) {
                var b = _this.getSel(),
                c = _this.getRng(),
                d = !0;
                if (d = !c || c.item ? !1 : !b || 0 === c.boundingWidth || c.collapsed, "text" === a) return d ? "" : c.text || (b.toString ? b.toString() : "");
                var e;
                if (c.cloneContents) {
                    var f, g = $("<div></div>");
                    f = c.cloneContents(),
                    f && g.append(f),
                    e = g.html()
                } else e = is(c.item) ? c.item(0).outerHTML : is(c.htmlText) ? c.htmlText : c.toString();
                return d && (e = ""),
                e = _this.processHTML(e, "read"),
                e = _this.cleanHTML(e),
                e = _this.formatXHTML(e)
            },
            this.pasteHTML = function (a, b) {
                if (bSource) return !1;
                _this.focus(),
                a = _this.processHTML(a, "write");
                var c = _this.getSel(),
                d = _this.getRng();
                if (b !== undefined) {
                    if (d.item) {
                        var e = d.item(0);
                        d = _this.getRng(!0),
                        d.moveToElementText(e),
                        d.select()
                    }
                    d.collapse(b)
                }
                if (a += "<" + (isIE ? "img" : "span") + ' id="_xhe_temp" width="0" height="0" />', d.insertNode) {
                    if ($(d.startContainer).closest("style,script").length > 0) return !1;
                    d.deleteContents(),
                    d.insertNode(d.createContextualFragment(a))
                } else "control" === c.type.toLowerCase() && (c.clear(), d = _this.getRng()),
                d.pasteHTML(a);
                var f = $("#_xhe_temp", _doc),
                g = f[0];
                isIE ? (d.moveToElementText(g), d.select()) : (d.selectNode(g), c.removeAllRanges(), c.addRange(d)),
                f.remove()
            },
            this.pasteText = function (a, b) {
                a || (a = ""),
                a = _this.domEncode(a),
                a = a.replace(/\r?\n/g, "<br />"),
                _this.pasteHTML(a, b)
            },
            this.appendHTML = function (a) {
                return bSource ? !1 : (_this.focus(), a = _this.processHTML(a, "write"), $(_doc.body).append(a), void _this.setTextCursor(!0))
            },
            this.domEncode = function (a) {
                return a.replace(regEntities,
                function (a) {
                    return arrEntities[a]
                })
            },
            this.setSource = function (a) {
                bookmark = null,
                "string" != typeof a && "" !== a && (a = _text.value),
                bSource ? $("#sourceCode", _doc).val(a) : (settings.beforeSetSource && (a = settings.beforeSetSource(a)), a = _this.cleanHTML(a), a = _this.formatXHTML(a), a = _this.processHTML(a, "write"), isIE ? (_doc.body.innerHTML = '<img id="_xhe_temp" width="0" height="0" />' + a, $("#_xhe_temp", _doc).remove()) : _doc.body.innerHTML = a)
            },
            this.processHTML = function (a, b) {
                function c(a, b, c, d, e, g) {
                    var h, i, j, k, l = "";
                    if (h = d.match(/font-family\s*:\s*([^;"]+)/i), h && (l += ' face="' + h[1] + '"'), i = d.match(/font-size\s*:\s*([^;"]+)/i)) {
                        i = i[1].toLowerCase();
                        for (var m = 0; m < f.length; m++) if (i === f[m].n || i === f[m].s) {
                            j = m + 1;
                            break
                        }
                        j && (l += ' size="' + j + '"', d = d.replace(/(^|;)(\s*font-size\s*:\s*[^;"]+;?)+/gi, "$1"))
                    }
                    if (k = d.match(/(?:^|[\s;])color\s*:\s*([^;"]+)/i)) {
                        var n;
                        if (n = k[1].match(/\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)) {
                            k[1] = "#";
                            for (var o = 1; 3 >= o; o++) k[1] += ("0" + (n[o] - 0).toString(16)).slice(-2)
                        }
                        k[1] = k[1].replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i, "#$1$1$2$2$3$3"),
                        l += ' color="' + k[1] + '"'
                    }
                    return d = d.replace(/(^|;)(\s*(font-family|color)\s*:\s*[^;"]+;?)+/gi, "$1"),
                    "" !== l ? (d && (l += ' style="' + d + '"'), "<font" + (c ? c : "") + l + (e ? e : "") + ">" + g + "</font>") : a
                }
                function d(a, b, c, d, e) {
                    for (var f, h, i = (c ? c : "") + (d ? d : ""), j = [], k = [], l = 0; l < g.length; l++) f = g[l].r,
                    h = g[l].t,
                    i = i.replace(f,
                    function () {
                        return j.push("<" + h + ">"),
                        k.push("</" + h + ">"),
                        ""
                    });
                    return i = i.replace(/\s+style\s*=\s*"\s*"/i, ""),
                    (i ? "<span" + i + ">" : "") + j.join("") + e + k.join("") + (i ? "</span>" : "")
                }
                var e = ' class="Apple-style-span"',
                f = settings.listFontsize;
                if ("write" === b) a = a.replace(/(<(\/?)(\w+))((?:\s+[\w\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*((\/?)>)/g,
                function (a, b, c, d, f, g, h) {
                    d = d.toLowerCase(),
                    isMozilla ? "strong" === d ? d = "b" : "em" === d && (d = "i") : isWebkit && ("strong" === d ? (d = "span", c || (f += e + ' style="font-weight: bold;"')) : "em" === d ? (d = "span", c || (f += e + ' style="font-style: italic;"')) : "u" === d ? (d = "span", c || (f += e + ' style="text-decoration: underline;"')) : "strike" === d && (d = "span", c || (f += e + ' style="text-decoration: line-through;"')));
                    var i, j = "";
                    if ("del" === d) d = "strike";
                    else if ("img" === d) f = f.replace(/\s+emot\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,
                    function (a, b) {
                        return i = b.match(/^(["']?)(.*)\1/)[2],
                        i = i.split(","),
                        i[1] || (i[1] = i[0], i[0] = ""),
                        "default" === i[0] && (i[0] = ""),
                        settings.emotMark ? a : ""
                    });
                    else if ("a" === d) !f.match(/ href=[^ ]/i) && f.match(/ name=[^ ]/i) && (j += " xhe-anchor"),
                    h && (g = "></a>");
                    else if ("table" === d && !c) {
                        var k = f.match(/\s+border\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i); (!k || k[1].match(/^(["']?)\s*0\s*\1$/)) && (j += " xhe-border")
                    }
                    var l;
                    if (f = f.replace(/\s+([\w\-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,
                    function (a, b, c) {
                        return b = b.toLowerCase(),
                        c = c.match(/^(["']?)(.*)\1/)[2],
                        aft = "",
                        isIE && b.match(/^(disabled|checked|readonly|selected)$/) && c.match(/^(false|0)$/i) ? "" : "img" === d && i && "src" === b ? "" : (b.match(/^(src|href)$/) && (aft = " _xhe_" + b + '="' + c + '"', urlBase && (c = getLocalUrl(c, "abs", urlBase))), j && "class" === b && (c += " " + j, j = ""), isWebkit && "style" === b && "span" === d && c.match(/(^|;)\s*(font-family|font-size|color|background-color)\s*:\s*[^;]+\s*(;|$)/i) && (l = !0), " " + b + '="' + c + '"' + aft)
                    }), i) {
                        var m = emotPath + (i[0] ? i[0] : "default") + "/" + i[1] + ".gif";
                        f += ' src="' + m + '" _xhe_src="' + m + '"'
                    }
                    return l && (f += e),
                    j && (f += ' class="' + j + '"'),
                    "<" + c + d + f + g
                }),
                isIE && (a = a.replace(/&apos;/gi, "&#39;")),
                isWebkit || (a = a.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/gi, c), a = a.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/gi, c), a = a.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/gi, c)),
                a = a.replace(/<(td|th)(\s+[^>]*?)?>(\s|&nbsp;)*<\/\1>/gi, "<$1$2>" + (isIE ? "" : "<br />") + "</$1>");
                else {
                    if (isWebkit) for (var g = [{
                            r: /font-weight\s*:\s*bold;?/gi,
                            t: "strong"
                    },
                    {
                        r: /font-style\s*:\s*italic;?/gi,
                        t: "em"
                    },
                    {
                        r: /text-decoration\s*:\s*underline;?/gi,
                        t: "u"
                    },
                    {
                        r: /text-decoration\s*:\s*line-through;?/gi,
                        t: "strike"
                    }], h = 0; 2 > h; h++) a = a.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/gi, d),
                    a = a.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/gi, d),
                    a = a.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/gi, d);
                    a = a.replace(/(<(\w+))((?:\s+[\w\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/g,
                    function (a, b, c, d, e) {
                        c = c.toLowerCase();
                        var g;
                        return d = d.replace(/\s+_xhe_(?:src|href)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,
                        function (a, b) {
                            return g = b.match(/^(["']?)(.*)\1/)[2],
                            ""
                        }),
                        g && urlType && (g = getLocalUrl(g, urlType, urlBase)),
                        d = d.replace(/\s+([\w\-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,
                        function (a, b, c) {
                            if (b = b.toLowerCase(), c = c.match(/^(["']?)(.*)\1/)[2].replace(/"/g, "'"), "class" === b) {
                                if (c.match(/^["']?(apple|webkit)/i)) return "";
                                if (c = c.replace(/\s?xhe-[a-z]+/gi, ""), "" === c) return ""
                            } else {
                                if (b.match(/^((_xhe_|_moz_|_webkit_)|jquery\d+)/i)) return "";
                                if (g && b.match(/^(src|href)$/i)) return " " + b + '="' + g + '"';
                                "style" === b && (c = c.replace(/(^|;)\s*(font-size)\s*:\s*([a-z-]+)\s*(;|$)/i,
                                function (a, b, c, d, e) {
                                    for (var g, h, i = 0; i < f.length; i++) if (g = f[i], d === g.n) {
                                        h = g.s;
                                        break
                                    }
                                    return b + c + ":" + h + e
                                }))
                            }
                            return " " + b + '="' + c + '"'
                        }),
                        "img" !== c || d.match(/\s+alt\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i) || (d += ' alt=""'),
                        b + d + e
                    }),
                    a = a.replace(/(<(td|th)(?:\s+[^>]*?)?>)\s*([\s\S]*?)(<br(\s*\/)?>)?\s*<\/\2>/gi,
                    function (a, b, c, d) {
                        return b + (d ? d : "&nbsp;") + "</" + c + ">"
                    }),
                    a = a.replace(/^\s*(?:<(p|div)(?:\s+[^>]*?)?>)?\s*(<span(?:\s+[^>]*?)?>\s*<\/span>|<br(?:\s+[^>]*?)?>|&nbsp;)*\s*(?:<\/\1>)?\s*$/i, "")
                }
                return a = a.replace(/(<pre(?:\s+[^>]*?)?>)([\s\S]+?)(<\/pre>)/gi,
                function (a, b, c, d) {
                    return b + c.replace(/<br\s*\/?>/gi, "\r\n") + d
                })
            },
            this.getSource = function (a) {
                var b, c = settings.beforeGetSource;
                return bSource ? (b = $("#sourceCode", _doc).val(), c || (b = _this.formatXHTML(b, !1))) : (b = _this.processHTML(_doc.body.innerHTML, "read"), b = _this.cleanHTML(b), b = _this.formatXHTML(b, a), c && (b = c(b))),
                _text.value = b,
                b
            },
            this.cleanWord = function (a) {
                function b(a, b, c) {
                    return c
                }
                var c = settings.cleanPaste;
                if (c > 0 && 3 > c && /mso(-|normal)|WordDocument|<table\s+[^>]*?x:str|\s+class\s*=\s*"?xl[67]\d"/i.test(a)) {
                    a = a.replace(/<!--[\s\S]*?-->|<!(--)?\[[\s\S]+?\](--)?>|<style(\s+[^>]*?)?>[\s\S]*?<\/style>/gi, ""),
                    a = a.replace(/\r?\n/gi, ""),
                    isIE ? (a = a.replace(/<v:shapetype(\s+[^>]*)?>[\s\S]*<\/v:shapetype>/gi, ""), a = a.replace(/<v:shape(\s+[^>]+)?>[\s\S]*?<v:imagedata(\s+[^>]+)?>\s*<\/v:imagedata>[\s\S]*?<\/v:shape>/gi,
                    function (a, b, c) {
                        var d;
                        if (d = c.match(/\s+src\s*=\s*("[^"]+"|'[^']+'|[^>\s]+)/i)) {
                            d = d[1].match(/^(["']?)(.*)\1/)[2];
                            var e = '<img src="' + editorRoot + 'xheditor_skin/blank.gif" _xhe_temp="true" class="wordImage"';
                            return d = b.match(/\s+style\s*=\s*("[^"]+"|'[^']+'|[^>\s]+)/i),
                            d && (d = d[1].match(/^(["']?)(.*)\1/)[2], e += ' style="' + d + '"'),
                            e += " />"
                        }
                        return ""
                    })) : a = a.replace(/<img( [^<>]*(v:shapes|msohtmlclip)[^<>]*)\/?>/gi,
                    function (a, b) {
                        var c, d = '<img src="' + editorRoot + 'xheditor_skin/blank.gif" _xhe_temp="true" class="wordImage"';
                        return c = b.match(/ width\s*=\s*"([^"]+)"/i),
                        c && (d += ' width="' + c[1] + '"'),
                        c = b.match(/ height\s*=\s*"([^"]+)"/i),
                        c && (d += ' height="' + c[1] + '"'),
                        d + " />"
                    }),
                    a = a.replace(/(<(\/?)([\w\-:]+))((?:\s+[\w\-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/?>)/g,
                    function (a, b, d, e, f, g) {
                        return e = e.toLowerCase(),
                        e.match(/^(link)$/) && f.match(/file:\/\//i) || e.match(/:/) || "span" === e && 2 === c ? "" : (d || (f = f.replace(/\s([\w\-:]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/gi,
                        function (a, b, d) {
                            if (b = b.toLowerCase(), /:/.test(b)) return "";
                            if (d = d.match(/^(["']?)(.*)\1/)[2], 1 === c) switch (e) {
                                case "p":
                                    if ("style" === b) return d = d.replace(/"|&quot;/gi, "'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/gi,
                                    function (a, b, c) {
                                        return /^(text-align)$/i.test(b) ? b + ":" + c + ";" : ""
                                    }).replace(/^\s+|\s+$/g, ""),
                                    d ? " " + b + '="' + d + '"' : "";
                                    break;
                                case "span":
                                    if ("style" === b) return d = d.replace(/"|&quot;/gi, "'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/gi,
                                    function (a, b, c) {
                                        return /^(color|background|font-size|font-family)$/i.test(b) ? b + ":" + c + ";" : ""
                                    }).replace(/^\s+|\s+$/g, ""),
                                    d ? " " + b + '="' + d + '"' : "";
                                    break;
                                case "table":
                                    if (b.match(/^(cellspacing|cellpadding|border|width)$/i)) return a;
                                    break;
                                case "td":
                                    if (b.match(/^(rowspan|colspan)$/i)) return a;
                                    if ("style" === b) return d = d.replace(/"|&quot;/gi, "'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/gi,
                                    function (a, b, c) {
                                        return /^(width|height)$/i.test(b) ? b + ":" + c + ";" : ""
                                    }).replace(/^\s+|\s+$/g, ""),
                                    d ? " " + b + '="' + d + '"' : "";
                                    break;
                                case "a":
                                    if (b.match(/^(href)$/i)) return a;
                                    break;
                                case "font":
                                case "img":
                                    return a
                            } else if (2 === c) switch (e) {
                                case "td":
                                    if (b.match(/^(rowspan|colspan)$/i)) return a;
                                    break;
                                case "img":
                                    return a
                            }
                            return ""
                        })), b + f + g)
                    });
                    for (var d = 0; 3 > d; d++) a = a.replace(/<([^\s>]+)(\s+[^>]*)?>\s*<\/\1>/g, "");
                    for (var d = 0; 3 > d; d++) a = a.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/gi, b);
                    for (var d = 0; 3 > d; d++) a = a.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/gi, b);
                    for (var d = 0; 3 > d; d++) a = a.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/gi, b);
                    for (var d = 0; 3 > d; d++) a = a.replace(/<font(\s+[^>]+)><font(\s+[^>]+)>/gi,
                    function (a, b, c) {
                        return "<font" + b + c + ">"
                    });
                    a = a.replace(/(<(\/?)(tr|td)(?:\s+[^>]+)?>)[^<>]+/gi,
                    function (a, b, c, d) {
                        return !c && /^td$/i.test(d) ? a : b
                    })
                }
                return a
            },
            this.cleanHTML = function (a) {
                a = a.replace(/<!?\/?(DOCTYPE|html|body|meta)(\s+[^>]*?)?>/gi, "");
                var b;
                return a = a.replace(/<head(?:\s+[^>]*?)?>([\s\S]*?)<\/head>/i,
                function (a, c) {
                    return b = c.match(/<(script|style)(\s+[^>]*?)?>[\s\S]*?<\/\1>/gi),
                    ""
                }),
                b && (a = b.join("") + a),
                a = a.replace(/<\??xml(:\w+)?(\s+[^>]*?)?>([\s\S]*?<\/xml>)?/gi, ""),
                settings.internalScript || (a = a.replace(/<script(\s+[^>]*?)?>[\s\S]*?<\/script>/gi, "")),
                settings.internalStyle || (a = a.replace(/<style(\s+[^>]*?)?>[\s\S]*?<\/style>/gi, "")),
                settings.linkTag && settings.inlineScript && settings.inlineStyle || (a = a.replace(/(<(\w+))((?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/gi,
                function (a, b, c, d, e) {
                    return settings.linkTag || "link" !== c.toLowerCase() ? (settings.inlineScript || (d = d.replace(/\s+on(?:click|dblclick|mouse(down|up|move|over|out|enter|leave|wheel)|key(down|press|up)|change|select|submit|reset|blur|focus|load|unload)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/gi, "")), settings.inlineStyle || (d = d.replace(/\s+(style|class)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/gi, "")), b + d + e) : ""
                })),
                a = a.replace(/<\/(strong|b|u|strike|em|i)>((?:\s|<br\/?>|&nbsp;)*?)<\1(\s+[^>]*?)?>/gi, "$2")
            },
            this.formatXHTML = function (a, b) {
                function c(a) {
                    for (var b = {},
                    c = a.split(","), d = 0; d < c.length; d++) b[c[d]] = !0;
                    return b
                }
                function d(a) {
                    a = a.toLowerCase();
                    var b = s[a];
                    return b ? b : a
                }
                function e(a, b, c) {
                    if (n[a]) for (; w.last() && o[w.last()];) f(w.last());
                    p[a] && w.last() === a && f(a),
                    c = m[a] || !!c,
                    c || w.push(a);
                    var d = Array();
                    d.push("<" + a),
                    b.replace(u,
                    function (a, b) {
                        b = b.toLowerCase();
                        var c = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : q[b] ? b : "";
                        d.push(" " + b + '="' + c.replace(/"/g, "'") + '"')
                    }),
                    d.push((c ? " /" : "") + ">"),
                    j(d.join(""), a, !0),
                    "pre" === a && (H = !0)
                }
                function f(a) {
                    if (a) for (var b = w.length - 1; b >= 0 && w[b] !== a; b--);
                    else var b = 0;
                    if (b >= 0) {
                        for (var c = w.length - 1; c >= b; c--) j("</" + w[c] + ">", w[c]);
                        w.length = b
                    }
                    "pre" === a && (H = !1, F--)
                }
                function g(a) {
                    j(_this.domEncode(a))
                }
                function h(a) {
                    v.push(a.replace(/^[\s\r\n]+|[\s\r\n]+$/g, ""))
                }
                function i(a) {
                    v.push(a)
                }
                function j(a, c, d) {
                    if (H || (a = a.replace(/(\t*\r?\n\t*)+/g, "")), H || b !== !0) v.push(a);
                    else {
                        if (a.match(/^\s*$/)) return void v.push(a);
                        var e = n[c],
                        f = e ? c : "";
                        e ? (d && F++, "" === G && F--) : G && F++,
                        (f !== G || e) && k(),
                        v.push(a),
                        "br" === c && k(),
                        !e || !m[c] && d || F--,
                        G = e ? c : "",
                        D = d
                    }
                }
                function k() {
                    if (v.push("\r\n"), F > 0) for (var a = F; a--;) v.push("	")
                }
                function l(a, b, c, d) {
                    if (!c) return d;
                    var e = "";
                    return c = c.replace(/ face\s*=\s*"\s*([^"]*)\s*"/i,
                    function (a, b) {
                        return b && (e += "font-family:" + b + ";"),
                        ""
                    }),
                    c = c.replace(/ size\s*=\s*"\s*(\d+)\s*"/i,
                    function (a, b) {
                        return e += "font-size:" + I[(b > 7 ? 7 : 1 > b ? 1 : b) - 1].s + ";",
                        ""
                    }),
                    c = c.replace(/ color\s*=\s*"\s*([^"]*)\s*"/i,
                    function (a, b) {
                        return b && (e += "color:" + b + ";"),
                        ""
                    }),
                    c = c.replace(/ style\s*=\s*"\s*([^"]*)\s*"/i,
                    function (a, b) {
                        return b && (e += b),
                        ""
                    }),
                    c += ' style="' + e + '"',
                    c ? "<span" + c + ">" + d + "</span>" : d
                }
                var m = c("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed"),
                n = c("address,applet,blockquote,button,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,table,tbody,td,tfoot,th,thead,tr,ul,script"),
                o = c("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
                p = c("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),
                q = c("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),
                r = c("script,style"),
                s = {
                    b: "strong",
                    i: "em",
                    s: "del",
                    strike: "del"
                },
                t = /<(?:\/([^\s>]+)|!([^>]*?)|([\w\-:]+)((?:"[^"]*"|'[^']*'|[^"'<>])*)\s*(\/?))>/g,
                u = /\s*([\w\-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g,
                v = [],
                w = [];
                w.last = function () {
                    return this[this.length - 1]
                };
                for (var x, y, z, A, B, C, D, E = 0,
                F = -1,
                G = "body",
                H = !1; x = t.exec(a) ;) y = x.index,
                y > E && (C = a.substring(E, y), A ? B.push(C) : g(C)),
                E = t.lastIndex,
                !(z = x[1]) || (z = d(z), A && z === A && (h(B.join("")), A = null, B = null), A) ? A ? B.push(x[0]) : (z = x[3]) ? (z = d(z), e(z, x[4], x[5]), r[z] && (A = z, B = [])) : x[2] && i(x[0]) : f(z);
                a.length > E && g(a.substring(E, a.length)),
                f(),
                a = v.join(""),
                v = null;
                var I = settings.listFontsize;
                return a = a.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/gi, l),
                a = a.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/gi, l),
                a = a.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/gi, l),
                a = a.replace(/^(\s*\r?\n)+|(\s*\r?\n)+$/g, "")
            },
            this.toggleShowBlocktag = function (a) {
                if (bShowBlocktag !== a) {
                    bShowBlocktag = !bShowBlocktag;
                    var b = $(_doc.body);
                    bShowBlocktag ? (bodyClass += " showBlocktag", b.addClass("showBlocktag")) : (bodyClass = bodyClass.replace(" showBlocktag", ""), b.removeClass("showBlocktag"))
                }
            },
            this.toggleSource = function (a) {
                if (bSource !== a) {
                    _jTools.find("[cmd=Source]").toggleClass("xheEnabled").toggleClass("xheActive");
                    var b, c, d = _doc.body,
                    e = $(d),
                    f = '<span id="_xhe_cursor"></span>',
                    g = 0,
                    h = "";
                    if (bSource ? (b = _this.getSource(), e.html("").removeAttr("scroll").attr("class", "editMode" + bodyClass), isIE ? d.contentEditable = "true" : _doc.designMode = "On", isMozilla && (_this._exec("inserthtml", "-"), $("#" + idFixFFCursor).show().focus().hide()), h = "Source") : (_this.pasteHTML(f, !0), b = _this.getSource(!0), g = b.indexOf(f), isOpera || (g = b.substring(0, g).replace(/\r/g, "").length), b = b.replace(/(\r?\n\s*|)<span id="_xhe_cursor"><\/span>(\s*\r?\n|)/,
                    function (a, b, c) {
                        return b && c ? "\r\n" : b + c
                    }), isIE ? d.contentEditable = "false" : _doc.designMode = "Off", e.attr("scroll", "no").attr("class", "sourceMode").html('<textarea id="sourceCode" wrap="soft" spellcheck="false" style="width:100%;height:100%" />'), c = $("#sourceCode", e).blur(_this.getSource)[0], h = "WYSIWYG"), bSource = !bSource, _this.setSource(b), _this.focus(), bSource) if (c.setSelectionRange) c.setSelectionRange(g, g);
                    else {
                        var i = c.createTextRange();
                        i.move("character", g),
                        i.select()
                    } else _this.setTextCursor();
                    _jTools.find("[cmd=Source]").attr("title", getLang(h)).find("span").text(h),
                    _jTools.find("[cmd=Source],[cmd=Preview]").toggleClass("xheEnabled"),
                    _jTools.find(".xheButton").not("[cmd=Source],[cmd=Fullscreen],[cmd=About]").toggleClass("xheEnabled").attr("aria-disabled", bSource ? !0 : !1),
                    setTimeout(setOpts, 300)
                }
            },
            this.showPreview = function () {
                var a = settings.beforeSetSource,
                b = _this.getSource();
                a && (b = a(b));
                var c = "<html><head>" + headHTML + "<title>{#Preview}</title>" + (urlBase ? '<base href="' + urlBase + '"/>' : "") + "</head><body>" + b + "</body></html>",
                d = window.screen,
                e = window.open("", "xhePreview", "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + Math.round(.9 * d.width) + ",height=" + Math.round(.8 * d.height) + ",left=" + Math.round(.05 * d.width)),
                f = e.document;
                f.open(),
                f.write(getLang(c)),
                f.close(),
                e.focus()
            },
            this.toggleFullscreen = function (a) {
                if (bFullscreen !== a) {
                    var b = $("#" + idContainer).find(".xheLayout"),
                    c = $("#" + idContainer),
                    d = jQuery.browser.version,
                    e = isIE && (6 == d || 7 == d);
                    bFullscreen ? (e && _jText.after(c), b.attr("style", sLayoutStyle), _jArea.height(editorHeight - _jTools.outerHeight()), $(window).scrollTop(outerScroll), setTimeout(function () {
                        $(window).scrollTop(outerScroll)
                    },
                    10)) : (e && $("body").append(c), outerScroll = $(window).scrollTop(), sLayoutStyle = b.attr("style"), b.removeAttr("style"), _jArea.height("100%"), setTimeout(fixFullHeight, 100)),
                    isMozilla ? ($("#" + idFixFFCursor).show().focus().hide(), setTimeout(_this.focus, 1)) : e && _this.setTextCursor(),
                    bFullscreen = !bFullscreen,
                    c.toggleClass("xhe_Fullscreen"),
                    $("html").toggleClass("xhe_Fullfix"),
                    _jTools.find("[cmd=Fullscreen]").toggleClass("xheActive"),
                    setTimeout(setOpts, 300)
                }
            },
            this.showMenu = function (a, b) {
                var c = $('<div class="xheMenu"></div>'),
                d = a.length,
                e = [];
                $.each(a,
                function (a, b) {
                    e.push("-" === b.s ? '<div class="xheMenuSeparator"></div>' : "<a href=\"javascript:void('" + b.v + '\')" title="' + (b.t ? b.t : b.s) + '" v="' + b.v + '" role="option" aria-setsize="' + d + '" aria-posinset="' + (a + 1) + '" tabindex="0">' + b.s + "</a>")
                }),
                c.append(getLang(e.join(""))),
                c.click(function (a) {
                    return a = a.target,
                    $.nodeName(a, "DIV") ? void 0 : (_this.loadBookmark(), b($(a).closest("a").attr("v")), _this.hidePanel(), !1)
                }).mousedown(returnFalse),
                _this.saveBookmark(),
                _this.showPanel(c)
            },
            this.showColor = function (a) {
                var b = settings.listColors,
                c = $('<div class="xheColor"></div>'),
                d = [],
                e = b.length,
                f = 0;
                $.each(b,
                function (a, b) {
                    f % 7 === 0 && d.push((f > 0 ? "</div>" : "") + "<div>"),
                    d.push("<a href=\"javascript:void('" + b + '\')" xhev="' + b + '" title="' + b + '" style="background:' + b + '" role="option" aria-setsize="' + e + '" aria-posinset="' + (f + 1) + '"></a>'),
                    f++
                }),
                d.push("</div>"),
                c.append(d.join("")),
                c.click(function (b) {
                    return b = b.target,
                    $.nodeName(b, "A") ? (_this.loadBookmark(), a($(b).attr("xhev")), _this.hidePanel(), !1) : void 0
                }).mousedown(returnFalse),
                _this.saveBookmark(),
                _this.showPanel(c)
            },
            this.showPastetext = function () {
                var a = $(getLang(htmlPastetext)),
                b = $("#xhePastetextValue", a),
                c = $("#xheSave", a);
                c.click(function () {
                    _this.loadBookmark();
                    var a = b.val();
                    return a && _this.pasteText(a),
                    _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(a)
            },
            this.showLink = function () {
                var a = htmlLink,
                b = _jDoc.find("a[name]").not("[href]"),
                c = b.length > 0;
                if (c) {
                    var d = [];
                    b.each(function () {
                        var a = $(this).attr("name");
                        d.push('<option value="#' + a + '">' + a + "</option>")
                    }),
                    a = a.replace(/(<div><label for="xheLinkTarget)/, '<div><label for="xheLinkAnchor">{#link.anchor}</label><select id="xheLinkAnchor"><option value="">{#link.anchorNone}</option>' + d.join("") + "</select></div>$1")
                }
                var e = $(getLang(a)),
                f = _this.getParent("a"),
                g = $("#xheLinkText", e),
                h = $("#xheLinkUrl", e),
                i = $("#xheLinkTarget", e),
                j = $("#xheSave", e),
                k = _this.getSelect();
                if (c && e.find("#xheLinkAnchor").change(function () {
                    var a = $(this).val();
                    "" != a && h.val(a)
                }), 1 === f.length) {
                    if (!f.attr("href")) return ev = null,
                    _this.exec("Anchor");
                    h.val(xheAttr(f, "href")),
                    i.attr("value", f.attr("target"))
                } else "" === k && g.val(getLang(settings.defLinkText)).closest("div").show();
                settings.upLinkUrl && _this.uploadInit(h, settings.upLinkUrl, settings.upLinkExt),
                j.click(function () {
                    _this.loadBookmark();
                    var a = h.val();
                    if (("" === a || 0 === f.length) && _this._exec("unlink"), "" !== a && "http://" !== a) {
                        var b = a.split(" "),
                        c = i.val(),
                        d = g.val();
                        if (b.length > 1) {
                            _this._exec("unlink"),
                            k = _this.getSelect();
                            var e, j = '<a href="xhe_tmpurl"',
                            l = [];
                            "" !== c && (j += ' target="' + c + '"'),
                            j += ">xhe_tmptext</a>",
                            d = "" !== k ? k : d ? d : a;
                            for (var m = 0,
                            n = b.length; n > m; m++) a = b[m],
                            "" !== a && (a = a.split("||"), e = j, e = e.replace("xhe_tmpurl", a[0]), e = e.replace("xhe_tmptext", a[1] ? a[1] : d), l.push(e));
                            _this.pasteHTML(l.join("&nbsp;"))
                        } else a = b[0].split("||"),
                        d || (d = a[0]),
                        d = a[1] ? a[1] : "" !== k ? "" : d ? d : a[0],
                        0 === f.length ? (d ? _this.pasteHTML('<a href="#xhe_tmpurl">' + d + "</a>") : _this._exec("createlink", "#xhe_tmpurl"), f = $('a[href$="#xhe_tmpurl"]', _doc)) : d && !isWebkit && f.text(d),
                        xheAttr(f, "href", a[0]),
                        "" !== c ? f.attr("target", c) : f.removeAttr("target")
                    }
                    return _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(e)
            },
            this.showAnchor = function () {
                var a = $(getLang(htmlAnchor)),
                b = _this.getParent("a"),
                c = $("#xheAnchorName", a),
                d = $("#xheSave", a);
                if (1 === b.length) {
                    if (b.attr("href")) return ev = null,
                    _this.exec("Link");
                    c.val(b.attr("name"))
                }
                d.click(function () {
                    _this.loadBookmark();
                    var a = c.val();
                    return a ? 0 === b.length ? _this.pasteHTML('<a name="' + a + '"></a>') : b.attr("name", a) : 1 === b.length && b.remove(),
                    _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(a)
            },
            this.showImg = function () {
                var a = $(getLang(htmlImg)),
                b = _this.getParent("img"),
                c = $("#xheImgUrl", a),
                d = $("#xheImgAlt", a),
                e = $("#xheImgAlign", a),
                f = $("#xheImgWidth", a),
                g = $("#xheImgHeight", a),
                h = $("#xheImgBorder", a),
                i = $("#xheImgVspace", a),
                j = $("#xheImgHspace", a),
                k = $("#xheSave", a);
                if (1 === b.length) {
                    c.val(xheAttr(b, "src")),
                    d.val(b.attr("alt")),
                    e.val(b.attr("align")),
                    f.val(b.attr("width")),
                    g.val(b.attr("height")),
                    h.val(b.attr("border"));
                    var l = b.attr("vspace"),
                    m = b.attr("hspace");
                    i.val(0 >= l ? "" : l),
                    j.val(0 >= m ? "" : m)
                }
                settings.upImgUrl && _this.uploadInit(c, settings.upImgUrl, settings.upImgExt),
                k.click(function () {
                    _this.loadBookmark();
                    var a = c.val();
                    if ("" !== a && "http://" !== a) {
                        var k = a.split(" "),
                        l = d.val(),
                        m = e.val(),
                        n = f.val(),
                        o = g.val(),
                        p = h.val(),
                        q = i.val(),
                        r = j.val();
                        if (k.length > 1) {
                            var s, t = '<img src="xhe_tmpurl"',
                            u = [];
                            "" !== l && (t += ' alt="' + l + '"'),
                            "" !== m && (t += ' align="' + m + '"'),
                            "" !== n && (t += ' width="' + n + '"'),
                            "" !== o && (t += ' height="' + o + '"'),
                            "" !== p && (t += ' border="' + p + '"'),
                            "" !== q && (t += ' vspace="' + q + '"'),
                            "" !== r && (t += ' hspace="' + r + '"'),
                            t += " />";
                            for (var v in k) a = k[v],
                            "" !== a && (a = a.split("||"), s = t, s = s.replace("xhe_tmpurl", a[0]), a[1] && (s = '<a href="' + a[1] + '" target="_blank">' + s + "</a>"), u.push(s));
                            _this.pasteHTML(u.join("&nbsp;"))
                        } else if (1 === k.length && (a = k[0], "" !== a && (a = a.split("||"), 0 === b.length && (_this.pasteHTML('<img src="' + a[0] + '#xhe_tmpurl" />'), b = $('img[src$="#xhe_tmpurl"]', _doc)), xheAttr(b, "src", a[0]), "" !== l && b.attr("alt", l), "" !== m ? b.attr("align", m) : b.removeAttr("align"), "" !== n ? b.attr("width", n) : b.removeAttr("width"), "" !== o ? b.attr("height", o) : b.removeAttr("height"), "" !== p ? b.attr("border", p) : b.removeAttr("border"), "" !== q ? b.attr("vspace", q) : b.removeAttr("vspace"), "" !== r ? b.attr("hspace", r) : b.removeAttr("hspace"), a[1]))) {
                            var w = b.parent("a");
                            0 === w.length && (b.wrap("<a></a>"), w = b.parent("a")),
                            xheAttr(w, "href", a[1]),
                            w.attr("target", "_blank")
                        }
                    } else 1 === b.length && b.remove();
                    return _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(a)
            },
            this.showEmbed = function (a, b, c, d, e, f, g) {
                var h = $(getLang(b)),
                i = _this.getParent('embed[type="' + c + '"],embed[classid="' + d + '"]'),
                j = $("#xhe" + a + "Url", h),
                k = $("#xhe" + a + "Width", h),
                l = $("#xhe" + a + "Height", h),
                m = $("#xheSave", h);
                f && _this.uploadInit(j, f, g),
                1 === i.length && (j.val(xheAttr(i, "src")), k.val(i.attr("width")), l.val(i.attr("height"))),
                m.click(function () {
                    _this.loadBookmark();
                    var a = j.val();
                    if ("" !== a && "http://" !== a) {
                        var b = k.val(),
                        f = l.val(),
                        g = /^\d+%?$/;
                        g.test(b) || (b = 412),
                        g.test(f) || (f = 300);
                        var h = '<embed type="' + c + '" classid="' + d + '" src="xhe_tmpurl"' + e,
                        m = a.split(" ");
                        if (m.length > 1) {
                            var n, o = h + "",
                            p = [];
                            o += ' width="xhe_width" height="xhe_height" />';
                            for (var q in m) a = m[q].split("||"),
                            n = o,
                            n = n.replace("xhe_tmpurl", a[0]),
                            n = n.replace("xhe_width", a[1] ? a[1] : b),
                            n = n.replace("xhe_height", a[2] ? a[2] : f),
                            "" !== a && p.push(n);
                            _this.pasteHTML(p.join("&nbsp;"))
                        } else 1 === m.length && (a = m[0].split("||"), 0 === i.length && (_this.pasteHTML(h.replace("xhe_tmpurl", a[0] + "#xhe_tmpurl") + " />"), i = $('embed[src$="#xhe_tmpurl"]', _doc)), xheAttr(i, "src", a[0]), i.attr("width", a[1] ? a[1] : b), i.attr("height", a[2] ? a[2] : f))
                    } else 1 === i.length && i.remove();
                    return _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(h)
            },
            this.showEmot = function (a) {
                var b = $('<div class="xheEmot"></div>');
                a = a ? a : selEmotGroup ? selEmotGroup : "default";
                var c = arrEmots[a],
                d = emotPath + a + "/",
                e = 0,
                f = [],
                g = "",
                h = c.width,
                i = c.height,
                j = c.line,
                k = c.count,
                l = c.list;
                if (k) for (var m = 1; k >= m; m++) e++,
                f.push("<a href=\"javascript:void('" + m + '\')" style="background-image:url(' + d + m + '.gif);" emot="' + a + "," + m + '" xhev="" title="' + m + '" role="option">&nbsp;</a>'),
                e % j === 0 && f.push("<br />");
                else {
                    var n = is(l, "array");
                    $.each(l,
                    function (b, c) {
                        n && (b = c, c = "{#emot." + a + "." + b + "}"),
                        e++,
                        f.push("<a href=\"javascript:void('" + c + '\')" style="background-image:url(' + d + b + '.gif);" emot="' + a + "," + b + '" title="' + c + '" xhev="' + c + '" role="option">&nbsp;</a>'),
                        e % j === 0 && f.push("<br />")
                    })
                }
                var o = j * (h + 12),
                p = Math.ceil(e / j) * (i + 12),
                q = .75 * o;
                q >= p && (q = ""),
                g = $(getLang("<style>" + (q ? ".xheEmot div{width:" + (o + 20) + "px;height:" + q + "px;}" : "") + ".xheEmot div a{width:" + h + "px;height:" + i + "px;}</style><div>" + f.join("") + "</div>")).click(function (a) {
                    a = a.target;
                    var b = $(a);
                    if ($.nodeName(a, "A")) return _this.loadBookmark(),
                    _this.pasteHTML('<img emot="' + b.attr("emot") + '" alt="' + b.attr("xhev") + '">'),
                    _this.hidePanel(),
                    !1
                }).mousedown(returnFalse),
                b.append(g);
                var r, s = 0,
                t = ['<ul role="tablist">'];
                $.each(arrEmots,
                function (b, c) {
                    s++,
                    t.push("<li" + (a === b ? ' class="cur"' : "") + ' role="presentation"><a href="javascript:void(\'' + c.name + '\')" group="' + b + '" role="tab" tabindex="0">' + c.name + "</a></li>")
                }),
                s > 1 && (t.push('</ul><br style="clear:both;" />'), r = $(getLang(t.join(""))).click(function (a) {
                    return selEmotGroup = $(a.target).attr("group"),
                    _this.exec("Emot"),
                    !1
                }).mousedown(returnFalse), b.append(r)),
                _this.saveBookmark(),
                _this.showPanel(b)
            },
            this.showTable = function () {
                var a = $(getLang(htmlTable)),
                b = $("#xheTableRows", a),
                c = $("#xheTableColumns", a),
                d = $("#xheTableHeaders", a),
                e = $("#xheTableWidth", a),
                f = $("#xheTableHeight", a),
                g = $("#xheTableBorder", a),
                h = $("#xheTableCellSpacing", a),
                i = $("#xheTableCellPadding", a),
                j = $("#xheTableAlign", a),
                k = $("#xheTableCaption", a),
                l = $("#xheSave", a);
                l.click(function () {
                    _this.loadBookmark();
                    var a, l, m = k.val(),
                    n = g.val(),
                    o = b.val(),
                    p = c.val(),
                    q = d.val(),
                    r = e.val(),
                    s = f.val(),
                    t = h.val(),
                    u = i.val(),
                    v = j.val(),
                    w = "<table" + ("" !== n ? ' border="' + n + '"' : "") + ("" !== r ? ' width="' + r + '"' : "") + ("" !== s ? ' height="' + s + '"' : "") + ("" !== t ? ' cellspacing="' + t + '"' : "") + ("" !== u ? ' cellpadding="' + u + '"' : "") + ("" !== v ? ' align="' + v + '"' : "") + ">";
                    if ("" !== m && (w += "<caption>" + m + "</caption>"), "row" === q || "both" === q) {
                        for (w += "<tr>", a = 0; p > a; a++) w += '<th scope="col"></th>';
                        w += "</tr>",
                        o--
                    }
                    for (w += "<tbody>", a = 0; o > a; a++) {
                        for (w += "<tr>", l = 0; p > l; l++) w += 0 !== l || "col" !== q && "both" !== q ? "<td></td>" : '<th scope="row"></th>';
                        w += "</tr>"
                    }
                    return w += "</tbody></table>",
                    _this.pasteHTML(w),
                    _this.hidePanel(),
                    !1
                }),
                _this.saveBookmark(),
                _this.showDialog(a)
            },
            this.showAbout = function () {
                var a = $(getLang(htmlAbout));
                a.find("p").attr("role", "presentation"),
                _this.showDialog(a, !0),
                setTimeout(function () {
                    a.focus()
                },
                100)
            },
            this.addShortcuts = function (a, b) {
                a = a.toLowerCase(),
                arrShortCuts[a] === undefined && (arrShortCuts[a] = Array()),
                arrShortCuts[a].push(b)
            },
            this.delShortcuts = function (a) {
                delete arrShortCuts[a]
            },
            this.uploadInit = function (a, b, c) {
                function d(b) {
                    is(b, "string") && (b = [b]);
                    var c, d, e, f = !1,
                    g = b.length,
                    h = [],
                    i = settings.onUpload;
                    for (i && i(b), c = 0; g > c; c++) d = b[c],
                    e = is(d, "string") ? d : d.url,
                    "!" === e.substr(0, 1) && (f = !0, e = e.substr(1)),
                    h.push(e);
                    a.val(h.join(" ")),
                    f && a.closest(".xheDialog").find("#xheSave").click()
                }
                var e = $(getLang('<span class="xheUpload"><input type="text" style="visibility:hidden;" tabindex="-1" /><input type="button" value="' + settings.upBtnText + '" class="xheBtn" tabindex="-1" /></span>')),
                f = $(".xheBtn", e),
                g = settings.html5Upload,
                h = g ? settings.upMultiple : 1;
                if (a.after(e), f.before(a), b = b.replace(/{editorRoot}/gi, editorRoot), "!" === b.substr(0, 1)) f.click(function () {
                    _this.showIframeModal("{#upload.browserTitle}", b.substr(1), d, null, null)
                });
                else {
                    e.append('<input type="file"' + (h > 1 ? ' multiple=""' : "") + ' class="xheFile" size="13" name="' + uploadInputname + '" tabindex="-1" />');
                    var i, j = $(".xheFile", e);
                    j.change(function () {
                        i = [],
                        _this.startUpload(j[0], b, c, d)
                    }),
                    setTimeout(function () {
                        a.closest(".xheDialog").bind("dragenter dragover", returnFalse).bind("drop",
                        function (a) {
                            var e, f = a.originalEvent.dataTransfer;
                            return g && f && (e = f.files) && e.length > 0 && _this.startUpload(e, b, c, d),
                            !1
                        })
                    },
                    10)
                }
            },
            this.startUpload = function (fromFiles, toUrl, limitExt, onUploadComplete) {
                function onUploadCallback(sText, bFinish) {
                    var data = Object,
                    bOK = !1;
                    try {
                        data = eval("(" + sText + ")")
                    } catch (ex) { }
                    return data.err === undefined || data.msg === undefined ? alert(getLang("upload.apiError", toUrl, sText)) : data.err ? alert(data.err) : (arrMsg.push(data.msg), bOK = !0),
                    (!bOK || bFinish) && _this.removeModal(),
                    bFinish && bOK && onUploadComplete(arrMsg),
                    bOK
                }
                var arrMsg = [],
                bHtml5Upload = settings.html5Upload,
                upMultiple = bHtml5Upload ? settings.upMultiple : 1,
                upload,
                fileList,
                filename,
                jUploadTip = $(getLang('<div style="padding:22px 0;text-align:center;line-height:30px;">{#upload.progressTip}<br /></div>')),
                sLoading = '<img src="' + skinPath + 'img/loading.gif">';
                if (!isOpera && bHtml5Upload && (!fromFiles.nodeType || (fileList = fromFiles.files) && fileList[0].name)) {
                    fileList || (fileList = fromFiles);
                    var i, len = fileList.length;
                    if (len > upMultiple) return void alert(getLang("upload.countLimit", upMultiple));
                    for (i = 0; len > i; i++) if (!checkFileExt(fileList[i].name, limitExt)) return;
                    var jProgress = $('<div class="xheProgress"><div><span>0%</span></div></div>');
                    jUploadTip.append(jProgress),
                    upload = new _this.html5Upload(uploadInputname, fileList, toUrl, onUploadCallback,
                    function (a) {
                        if (a.loaded >= 0) {
                            var b = Math.round(100 * a.loaded / a.total) + "%";
                            $("div", jProgress).css("width", b),
                            $("span", jProgress).text(b + " ( " + formatBytes(a.loaded) + " / " + formatBytes(a.total) + " )")
                        } else jProgress.replaceWith(sLoading)
                    })
                } else {
                    if (!checkFileExt(fromFiles.value, limitExt)) return;
                    jUploadTip.append(sLoading),
                    upload = new _this.html4Upload(fromFiles, toUrl, onUploadCallback)
                }
                _this.showModal("{#upload.progressTitle}", jUploadTip, 320, 150),
                upload.start()
            },
            this.html4Upload = function (a, b, c) {
                var d = (new Date).getTime(),
                e = "jUploadFrame" + d,
                f = this,
                g = $('<iframe name="' + e + '" class="xheHideArea" />').appendTo("body"),
                h = $('<form action="' + b + '" target="' + e + '" method="post" enctype="multipart/form-data" class="xheHideArea"></form>').appendTo("body"),
                i = $(a),
                j = i.clone().attr("disabled", "true");
                return i.before(j).appendTo(h),
                this.remove = function () {
                    null !== f && (j.before(i).remove(), g.remove(), h.remove(), f = null)
                },
                this.onLoad = function () {
                    var a = g[0].contentWindow.document,
                    b = $(a.body).text();
                    a.write(""),
                    f.remove(),
                    c(b, !0)
                },
                this.start = function () {
                    h.submit(),
                    g.load(f.onLoad)
                },
                this
            },
            //this.html5Upload = function (a, b, c, d, e) {
            //    function f(b, c, d, e) {
            //        h = new XMLHttpRequest,
            //        upload = h.upload,
            //        h.onreadystatechange = function () {
            //            4 === h.readyState && d(h.responseText)
            //        },
            //        upload ? upload.onprogress = function (a) {
            //            e(a.loaded)
            //        } : e(-1),
            //        h.open("POST", c),
            //        h.setRequestHeader("Content-Type", "application/octet-stream"),
            //        h.setRequestHeader("Content-Disposition", 'attachment; name="' + encodeURIComponent(a) + '"; filename="' + encodeURIComponent(b.name) + '"'),
            //        h.sendAsBinary && b.getAsBinary ? h.sendAsBinary(b.getAsBinary()) : h.send(b)
            //    }
            //    function g(a) {
            //        e && e({
            //            loaded: k + a,
            //            total: l
            //        })
            //    }
            //    for (var h, i = 0,
            //    j = b.length,
            //    k = 0,
            //    l = 0,
            //    m = this,
            //    n = 0; j > n; n++) l += b[n].size;
            //    this.remove = function () {
            //        h && (h.abort(), h = null)
            //    },
            //    this.uploadNext = function (a) {
            //        a && (k += b[i - 1].size, g(0)),
            //        (!a || a && d(a, i === j) === !0) && j > i && f(b[i++], c, m.uploadNext,
            //        function (a) {
            //            g(a)
            //        })
            //    },
            //    this.start = function () {
            //        m.uploadNext()
            //    }
            //},
            //edit by leo yang 重构支持跨域
            this.html5Upload = function (inputname, fromFiles, toUrl, callback, onProgress) {
                var xhr, i = 0, count = fromFiles.length, allLoaded = 0, allSize = 0, _this = this;
                for (var j = 0; j < count; j++) allSize += fromFiles[j].size;
                this.remove = function () { if (xhr) { xhr.abort(); xhr = null; } }
                this.uploadNext = function (sText) {
                    if (sText)//当前文件上传完成
                    {
                        allLoaded += fromFiles[i - 1].size;
                        returnProgress(0);
                    }
                    if ((!sText || (sText && callback(sText, i === count) === true)) && i < count) postFile(fromFiles[i++], toUrl, _this.uploadNext, function (loaded) { returnProgress(loaded); });
                }
                this.start = function () { _this.uploadNext(); }
                function postFile(fromfile, toUrl, callback, onProgress) {
                    xhr = new XMLHttpRequest(), upload = xhr.upload;
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) callback(xhr.responseText);
                    };
                    xhr.open("POST", toUrl, true);
                    var form = new FormData();
                    form["enctype"] = "multipart/form-data";
                    form.append("fileName", fromfile.name);
                    form.append("myFile", fromfile);
                    xhr.send(form);
                    if (upload) upload.onprogress = function (ev) {
                        onProgress(ev.loaded);
                    };
                    else onProgress(-1);//不支持进度
                    //xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                    //xhr.setRequestHeader('Content-Disposition', 'attachment; name="' + encodeURIComponent(inputname) + '"; filename="' + encodeURIComponent(fromfile.name) + '"');
                    //if (xhr.sendAsBinary && fromfile.getAsBinary) xhr.sendAsBinary(fromfile.getAsBinary());
                    //else xhr.send(fromfile);
                }
                function returnProgress(loaded) {
                    if (onProgress) onProgress({ 'loaded': allLoaded + loaded, 'total': allSize });
                }
            },
            this.showIframeModal = function (title, url, callback, w, h, onRemove) {
                function initModalWin() {
                    try {
                        modalWin.callback = callbackModal,
                        modalWin.unloadme = _this.removeModal,
                        $(modalWin.document).keydown(checkEsc),
                        result = modalWin.name
                    } catch (a) { }
                }
                function callbackModal(a) {
                    modalWin.document.write(""),
                    _this.removeModal(),
                    null != a && callback(a)
                }
                var jContent = $('<iframe frameborder="0" src="' + url.replace(/{editorRoot}/gi, editorRoot) + (/\?/.test(url) ? "&" : "?") + "parenthost=" + location.host + '" style="width:100%;height:100%;display:none;" /><div class="xheModalIfmWait"></div>'),
                jIframe = jContent.eq(0),
                jWait = jContent.eq(1);
                _this.showModal(title, jContent, w, h, onRemove);
                var modalWin = jIframe[0].contentWindow,
                result;
                initModalWin(),
                jIframe.load(function () {
                    if (initModalWin(), result) {
                        var bResult = !0;
                        try {
                            result = eval("(" + unescape(result) + ")")
                        } catch (e) {
                            bResult = !1
                        }
                        if (bResult) return callbackModal(result)
                    }
                    jWait.is(":visible") && (jIframe.show().focus(), jWait.remove())
                })
            },
            this.showModal = function (a, b, c, d, e) {
                return bShowModal ? !1 : (_this.panelState = bShowPanel, bShowPanel = !1, layerShadow = settings.layerShadow, c = c ? c : settings.modalWidth, d = d ? d : settings.modalHeight, jModal = $(getLang('<div class="xheModal" style="width:' + (c - 1) + "px;height:" + d + "px;margin-left:-" + Math.ceil(c / 2) + "px;" + (isIE && 7 > browerVer ? "" : "margin-top:-" + Math.ceil(d / 2) + "px") + '">' + (settings.modalTitle ? '<div class="xheModalTitle"><span class="xheModalClose" title="{#close} (Esc)" tabindex="0" role="button"></span>' + a + "</div>" : "") + '<div class="xheModalContent"></div></div>')).appendTo("body"), jOverlay = $('<div class="xheModalOverlay"></div>').appendTo("body"), layerShadow > 0 && (jModalShadow = $('<div class="xheModalShadow" style="width:' + jModal.outerWidth() + "px;height:" + jModal.outerHeight() + "px;margin-left:-" + (Math.ceil(c / 2) - layerShadow - 2) + "px;" + (isIE && 7 > browerVer ? "" : "margin-top:-" + (Math.ceil(d / 2) - layerShadow - 2) + "px") + '"></div>').appendTo("body")), $(".xheModalContent", jModal).css("height", d - (settings.modalTitle ? $(".xheModalTitle").outerHeight() : 0)).html(b), isIE && 6 === browerVer && (jHideSelect = $("select:visible").css("visibility", "hidden")), $(".xheModalClose", jModal).click(_this.removeModal), jOverlay.show(), layerShadow > 0 && jModalShadow.show(), jModal.show(), setTimeout(function () {
                    jModal.find("a,input[type=text],textarea").filter(":visible").filter(function () {
                        return "hidden" !== $(this).css("visibility")
                    }).eq(0).focus()
                },
                10), bShowModal = !0, void (onModalRemove = e))
            },
            this.removeModal = function () {
                jHideSelect && jHideSelect.css("visibility", "visible"),
                jModal.html("").remove(),
                layerShadow > 0 && jModalShadow.remove(),
                jOverlay.remove(),
                onModalRemove && onModalRemove(),
                bShowModal = !1,
                bShowPanel = _this.panelState
            },
            this.showDialog = function (a, b) {
                var c = $('<div class="xheDialog"></div>'),
                d = $(a),
                e = $("#xheSave", d);
                if (1 === e.length) {
                    if (d.find("input[type=text],select").keypress(function (a) {
                        return 13 === a.which ? (e.click(), !1) : void 0
                    }), d.find("textarea").keydown(function (a) {
                        return a.ctrlKey && 13 === a.which ? (e.click(), !1) : void 0
                    }), e.after(getLang(' <input type="button" id="xheCancel" value="{#dialogCancel}" />')), $("#xheCancel", d).click(_this.hidePanel), !settings.clickCancelDialog) {
                        bClickCancel = !1;
                        var f = $('<div class="xheFixCancel"></div>').appendTo("body").mousedown(returnFalse),
                        g = _jArea.offset();
                        f.css({
                            left: g.left,
                            top: g.top,
                            width: _jArea.outerWidth(),
                            height: _jArea.outerHeight()
                        })
                    }
                    c.mousedown(function () {
                        bDisableHoverExec = !0
                    })
                }
                c.append(d),
                _this.showPanel(c, b)
            },
            this.showPanel = function (a, b) {
                if (!ev.target) return !1;
                _jPanel.html("").append(a).css("left", -999).css("top", -999),
                _jPanelButton = $(ev.target).closest("a").addClass("xheActive");
                var c = _jPanelButton.offset(),
                d = c.left,
                e = c.top;
                e += _jPanelButton.outerHeight() - 1,
                _jCntLine.css({
                    left: d + 1,
                    top: e,
                    width: _jPanelButton.width()
                }).show();
                var f = document.documentElement,
                g = document.body;
                d + _jPanel.outerWidth() > (window.pageXOffset || f.scrollLeft || g.scrollLeft) + (f.clientWidth || g.clientWidth) && (d -= _jPanel.outerWidth() - _jPanelButton.outerWidth());
                var h = settings.layerShadow;
                h > 0 && _jShadow.css({
                    left: d + h,
                    top: e + h,
                    width: _jPanel.outerWidth(),
                    height: _jPanel.outerHeight()
                }).show();
                var i = $("#" + idContainer).offsetParent().css("zIndex");
                i && !isNaN(i) && (_jShadow.css("zIndex", parseInt(i, 10) + 1), _jPanel.css("zIndex", parseInt(i, 10) + 2), _jCntLine.css("zIndex", parseInt(i, 10) + 3)),
                _jPanel.css({
                    left: d,
                    top: e
                }).show(),
                b || setTimeout(function () {
                    _jPanel.find("a,input[type=text],textarea").filter(":visible").filter(function () {
                        return "hidden" !== $(this).css("visibility")
                    }).eq(0).focus()
                },
                10),
                bQuickHoverExec = bShowPanel = !0
            },
            this.hidePanel = function () {
                bShowPanel && (_jPanelButton.removeClass("xheActive"), _jShadow.hide(), _jCntLine.hide(), _jPanel.hide(), bShowPanel = !1, bClickCancel || ($(".xheFixCancel").remove(), bClickCancel = !0), bQuickHoverExec = bDisableHoverExec = !1, lastAngle = null, _this.focus(), _this.loadBookmark())
            },
            this.exec = function (a) {
                _this.hidePanel();
                var b = arrTools[a];
                if (!b) return !1;
                if (null === ev) {
                    ev = {};
                    var c = _jTools.find(".xheButton[cmd=" + a + "]");
                    1 === c.length && (ev.target = c)
                }
                if (b.e) b.e.call(_this);
                else switch (a = a.toLowerCase()) {
                    case "cut":
                        try {
                            if (_doc.execCommand(a), !_doc.queryCommandSupported(a)) throw "Error"
                        } catch (d) {
                            alert(getLang("cutDisabledTip"))
                        }
                        break;
                    case "copy":
                        try {
                            if (_doc.execCommand(a), !_doc.queryCommandSupported(a)) throw "Error"
                        } catch (d) {
                            alert(getLang("copyDisabledTip"))
                        }
                        break;
                    case "paste":
                        try {
                            if (_doc.execCommand(a), !_doc.queryCommandSupported(a)) throw "Error"
                        } catch (d) {
                            alert(getLang("pasteDisabledTip"))
                        }
                        break;
                    case "pastetext":
                        window.clipboardData ? _this.pasteText(window.clipboardData.getData("Text", !0)) : _this.showPastetext();
                        break;
                    case "blocktag":
                        var e = [];
                        $.each(settings.listBlocktag,
                        function (a, b) {
                            e.push({
                                s: "<" + b.n + ">{#listBlocktag." + b.n + "}</" + b.n + ">",
                                v: "<" + b.n + ">",
                                t: "{#listBlocktag." + b.n + "}"
                            })
                        }),
                        _this.showMenu(e,
                        function (a) {
                            _this._exec("formatblock", a)
                        });
                        break;
                    case "fontface":
                        var f = [];
                        $.each(getLang("listFontname"),
                        function (a, b) {
                            b.c = b.c ? b.c : b.n,
                            f.push({
                                s: '<span style="font-family:' + b.c + '">' + b.n + "</span>",
                                v: b.c,
                                t: b.n
                            })
                        }),
                        _this.showMenu(f,
                        function (a) {
                            _this._exec("fontname", a)
                        });
                        break;
                    case "fontsize":
                        var g = [];
                        $.each(settings.listFontsize,
                        function (a, b) {
                            g.push({
                                s: '<span style="font-size:' + b.s + ';">{#fontsize.' + b.n + "}(" + b.s + ")</span>",
                                v: a + 1,
                                t: "{#fontsize." + b.n + "}"
                            })
                        }),
                        _this.showMenu(g,
                        function (a) {
                            _this._exec("fontsize", a)
                        });
                        break;
                    case "fontcolor":
                        _this.showColor(function (a) {
                            _this._exec("forecolor", a)
                        });
                        break;
                    case "backcolor":
                        _this.showColor(function (a) {
                            isIE ? _this._exec("backcolor", a) : (setCSS(!0), _this._exec("hilitecolor", a), setCSS(!1))
                        });
                        break;
                    case "align":
                        var h = [];
                        $.each(arrAlign,
                        function (a, b) {
                            h.push({
                                s: "{#align." + b.v + "}",
                                v: b.v
                            })
                        }),
                        _this.showMenu(h,
                        function (a) {
                            _this._exec(a)
                        });
                        break;
                    case "list":
                        var i = [];
                        $.each(arrList,
                        function (a, b) {
                            i.push({
                                s: "{#list." + b.v + "}",
                                v: b.v
                            })
                        }),
                        _this.showMenu(i,
                        function (a) {
                            _this._exec(a)
                        });
                        break;
                    case "link":
                        _this.showLink();
                        break;
                    case "anchor":
                        _this.showAnchor();
                        break;
                    case "img":
                        _this.showImg();
                        break;
                    case "flash":
                        _this.showEmbed("Flash", htmlFlash, "application/x-shockwave-flash", "clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000", ' wmode="opaque" quality="high" menu="false" play="true" loop="true" allowfullscreen="true"', settings.upFlashUrl, settings.upFlashExt);
                        break;
                    case "media":
                        _this.showEmbed("Media", htmlMedia, "application/x-mplayer2", "clsid:6bf52a52-394a-11d3-b153-00c04f79faa6", ' enablecontextmenu="false" autostart="false"', settings.upMediaUrl, settings.upMediaExt);
                        break;
                    case "hr":
                        _this.pasteHTML("<hr />");
                        break;
                    case "emot":
                        _this.showEmot();
                        break;
                    case "table":
                        _this.showTable();
                        break;
                    case "source":
                        _this.toggleSource();
                        break;
                    case "preview":
                        _this.showPreview();
                        break;
                    case "print":
                        _win.print();
                        break;
                    case "fullscreen":
                        _this.toggleFullscreen();
                        break;
                    case "about":
                        _this.showAbout();
                        break;
                    default:
                        _this._exec(a)
                }
                ev = null
            },
            this._exec = function (a, b, c) {
                c || _this.focus();
                var d;
                return d = b !== undefined ? _doc.execCommand(a, !1, b) : _doc.execCommand(a, !1, null)
            }
        };
        XHEDITOR.settings = {
            skin: "default",
            tools: "full",
            clickCancelDialog: !0,
            linkTag: !1,
            internalScript: !1,
            inlineScript: !1,
            internalStyle: !0,
            inlineStyle: !0,
            showBlocktag: !1,
            forcePtag: !0,
            upLinkExt: "zip,rar,txt",
            upImgExt: "jpg,jpeg,gif,png",
            upFlashExt: "swf",
            upMediaExt: "wmv,avi,wma,mp3,mid",
            modalWidth: 350,
            modalHeight: 220,
            modalTitle: !0,
            defLinkText: "{#link.defText}",
            layerShadow: 3,
            emotMark: !1,
            upBtnText: "{#upload.btnText}",
            cleanPaste: 1,
            hoverExecDelay: 100,
            html5Upload: !0,
            upMultiple: 99,
            listBlocktag: [{
                n: "p"
            },
            {
                n: "h1"
            },
            {
                n: "h2"
            },
            {
                n: "h3"
            },
            {
                n: "h4"
            },
            {
                n: "h5"
            },
            {
                n: "h6"
            },
            {
                n: "pre"
            },
            {
                n: "address"
            }],
            listColors: ["#FFFFFF", "#CCCCCC", "#C0C0C0", "#999999", "#666666", "#333333", "#000000", "#FFCCCC", "#FF6666", "#FF0000", "#CC0000", "#990000", "#660000", "#330000", "#FFCC99", "#FF9966", "#FF9900", "#FF6600", "#CC6600", "#993300", "#663300", "#FFFF99", "#FFFF66", "#FFCC66", "#FFCC33", "#CC9933", "#996633", "#663333", "#FFFFCC", "#FFFF33", "#FFFF00", "#FFCC00", "#999900", "#666600", "#333300", "#99FF99", "#66FF99", "#33FF33", "#33CC00", "#009900", "#006600", "#003300", "#99FFFF", "#33FFFF", "#66CCCC", "#00CCCC", "#339999", "#336666", "#003333", "#CCFFFF", "#66FFFF", "#33CCFF", "#3366FF", "#3333FF", "#000099", "#000066", "#CCCCFF", "#9999FF", "#6666CC", "#6633FF", "#6600CC", "#333399", "#330099", "#FFCCFF", "#FF99FF", "#CC66CC", "#CC33CC", "#993399", "#663366", "#330033"],
            listFontsize: [{
                n: "x-small",
                s: "10px"
            },
            {
                n: "small",
                s: "12px"
            },
            {
                n: "medium",
                s: "16px"
            },
            {
                n: "large",
                s: "18px"
            },
            {
                n: "x-large",
                s: "24px"
            },
            {
                n: "xx-large",
                s: "32px"
            },
            {
                n: "-webkit-xxx-large",
                s: "48px"
            }]
        },
        $.fn.xheditor = function (options) {
            var editTest = document.body.contentEditable ? document.body.contentEditable : document.designMode;
            if (!editTest) return !1;
            var arrSuccess = [];
            return this.each(function () {
                if ($.nodeName(this, "TEXTAREA")) if (options === !1) this.xheditor && (this.xheditor.remove(), this.xheditor = null);
                else if (this.xheditor) arrSuccess.push(this.xheditor);
                else {
                    var tOptions = /({.*})/.exec($(this).attr("class"));
                    if (tOptions) {
                        try {
                            tOptions = eval("(" + tOptions[1] + ")")
                        } catch (ex) { }
                        options = $.extend({},
                        tOptions, options)
                    }
                    var editor = new Xheditor(this, options);
                    editor.init() ? (this.xheditor = editor, arrSuccess.push(editor)) : editor = null
                }
            }),
            0 === arrSuccess.length && (arrSuccess = !1),
            1 === arrSuccess.length && (arrSuccess = arrSuccess[0]),
            arrSuccess
        },
        $.fn.oldVal = $.fn.val,
        $.fn.val = function (a) {
            var b, c = this;
            return a === undefined ? c[0] && (b = c[0].xheditor) ? b.getSource() : c.oldVal() : c.each(function () {
                (b = this.xheditor) ? b.setSource(a) : c.oldVal(a)
            })
        },
        $(function () {
            $("textarea").each(function () {
                var a = $(this),
                b = a.attr("class");
                b && (b = b.match(/(?:^|\s)xheditor(?:\-(m?full|simple|mini))?(?:\s|$)/i)) && a.xheditor(b[1] ? {
                    tools: b[1]
                } : null)
            })
        })
    }(XHEDITOR, jQuery);

    //输出接口
    exports('xheditor');
});