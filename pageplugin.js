function appendselectoption(obj, current, from, to) {
	var str = "";
	obj.options.length = 0;
	for (var i = from; i < to + 1; i++) {
		obj.options.add(new Option(i, i))
	};
	obj.value = current
};

function pageplugin(pagesize, url, ext, async) {
	this.url = url;
	this.async = async;
	this.pagesize = pagesize;
	this.pageindex = 0;
	this.rowcount = 0;
	this.pagecount = 0;
	this.time1, this.time2;
	this.append = false;
	this.visible = true;
	this.ext = ext == undefined ? "" : ext;
	this.smart_page_pagesize = "smart_page_pagesize" + this.ext;
	this.smart_page_pageindex = "smart_page_pageindex" + this.ext;
	this.smart_page_rowcount = "smart_page_rowcount" + this.ext;
	this.smart_page_pagecount = "smart_page_pagecount" + this.ext;
	this.smart_page_first = "smart_page_first" + this.ext;
	this.smart_page_pre = "smart_page_pre" + this.ext;
	this.smart_page_next = "smart_page_next" + this.ext;
	this.smart_page_last = "smart_page_last" + this.ext;
	this.smart_page_pageindex_input = "smart_page_pageindex_input" + this.ext;
	this.smart_page_pageindex_select = "smart_page_pageindex_select" + this.ext;
	this.smart_page_goto = "smart_page_goto" + this.ext;
	this.container = "smart_page_container" + this.ext;
	pageplugin.prototype.setpage = function(data) {
		var json = eval('(' + data + ')');
		if (json.time1 != this.time1 && json.time2 != this.time) {
			this.time1 = json.time1;
			this.time2 = json.time2;
			this.pageindex = json.pageindex;
			this.rowcount = json.rowcount;
			this.pagecount = this.rowcount % this.pagesize == 0 ? this.rowcount / this.pagesize : parseInt(this.rowcount / this.pagesize) + 1;
			$GetClassObj(this.smart_page_pagesize).val(this.pagesize);
			$GetClassObj(this.smart_page_pageindex).val(this.pageindex);
			$GetClassObj(this.smart_page_rowcount).val(this.rowcount);
			$GetClassObj(this.smart_page_pagecount).val(this.pagecount);
			var selectElements = $GetClassObj(this.smart_page_pageindex_select).obj;
			if (selectElements != null && selectElements.length > 0) {
				for (var i = 0; i < selectElements.length; i++) {
					appendselectoption(selectElements[i], this.pageindex, 1, this.pagecount)
				}
			};
			if (this.visible) {
				if (this.pageindex == this.pagecount || 0 == this.pagecount) {}
			}
		}
	};
	pageplugin.prototype.sethtml = function(html) {
		var $container = $Get(this.dataspace);
		if ($container.obj == null) $container = $GetClassObj(this.dataspace);
		if (this.append) {
			ac$container.val($container.val() + html)
		} else $container.val(html)
	};
	pageplugin.prototype.setdata = function(data) {
		var json = eval('(' + data + ')');
		if (json.time1 != this.time1 && json.time2 != this.time) {
			this.sethtml(data)
		}
	};
	pageplugin.prototype.getdata = function(pageindex) {
		pageindex = pageindex == undefined ? 1 : pageindex;
		if (this.pageindex != pageindex) {
			var to_url = this.url + (this.url.indexOf('?') == -1 ? "?" : "&") + "pageindex=" + pageindex + "&pagesize=" + this.pagesize;
			to_url += "&random=" + Math.random();
			var http = new HttpRequest(to_url, "", this.async);
			http.page_context = this;
			http.setdata = function(http_json) {
				http.page_context.setpage(http_json.responseText);
				http.page_context.setdata(http_json.responseText);
			};
			http.send(http)
		}
	};
	pageplugin.prototype.firstpage = function(context) {
		if (context.pageindex > 1) {
			context.getdata(1)
		}
	};
	pageplugin.prototype.prepage = function(context) {
		if (context.pageindex > 1) {
			context.getdata(context.pageindex - 1)
		}
	};
	pageplugin.prototype.nextpage = function(context) {
		if (context.pagecount > context.pageindex) {
			context.getdata(context.pageindex + 1)
		}
	};
	pageplugin.prototype.lastpage = function(context) {
		if (context.pagecount > context.pageindex) {
			context.getdata(context.pagecount)
		}
	};
	pageplugin.prototype.selectpageindexinput = function(context) {
		$Get(context.smart_page_pageindex_input).val(this.value);
	};
	pageplugin.prototype.goto = function(context) {
		var pageindex = $Get(context.smart_page_pageindex_input).val();
		context.getdata(pageindex)
	};
	var param = [this];
	var obj = $GetClassObj(this.smart_page_first).obj;
	var eventName = 'click';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.firstpage, param)
		}
	};
	param = [this];
	obj = $GetClassObj(this.smart_page_next).obj;
	eventName = 'click';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.nextpage, param)
		}
	};
	param = [this];
	obj = $GetClassObj(this.smart_page_pre).obj;
	eventName = 'click';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.prepage, param)
		}
	};
	param = [this];
	obj = $GetClassObj(this.smart_page_last).obj;
	eventName = 'click';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.lastpage, param)
		}
	};
	param = [this];
	obj = $GetClassObj(this.smart_page_pageindex_select).obj;
	eventName = 'change';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.selectpageindexinput, param)
		}
	};
	param = [this];
	obj = $GetClassObj(this.smart_page_goto).obj;
	eventName = 'click';
	if (obj != null && obj.length > 0) {
		for (var i = 0; i < obj.length; i++) {
			addEventHandler(obj[i], eventName, this.goto, param)
		}
	}
};
$Get = function(id) {
	return new GetId(id)
};

function GetId(id) {
	this.obj = document.getElementById(id);
	this.val = function(value) {
		if (value == undefined) {
			if (this.obj.innerHTML != undefined) value = this.obj.innerHTML;
			if (this.obj.value != undefined) value = this.obj.value;
			return value
		} else {
			if (this.obj.innerHTML != undefined) this.obj.innerHTML = value;
			if (this.obj.value != undefined) this.obj.value = value
		}
	}
};
$GetClassObj = function(className) {
	return new getElementsByClassName(className)
};

function getElementsByClassName(n) {
	this.obj = [];
	var allElements = document.getElementsByTagName('*');
	for (var i = 0; i < allElements.length; i++) {
		if (allElements[i].className == n) {
			this.obj[this.obj.length] = allElements[i]
		}
	};
	this.hide = function() {
		if (this.obj != null) {
			for (var i = 0; i < this.obj.length; i++) {
				this.obj[i].style.display = "none"
			}
		}
	};
	this.show = function() {
		if (this.obj != null) {
			for (var i = 0; i < this.obj.length; i++) {
				this.obj[i].style.display = "block"
			}
		}
	};
	this.val = function(value) {
		if (value == undefined) {
			if (this.obj[0].innerHTML != undefined && this.obj[0].innerHTML != null && this.obj[0].innerHTML != '') value = this.obj[0].innerHTML;
			if (this.obj[0].value != undefined && this.obj[0].value != null && this.obj[0].value != '') value = this.obj[0].value;
			return value;
		} else {
			if (this.obj != null) {
				for (var i = 0; i < this.obj.length; i++) {
					if (this.obj[i].innerHTML != undefined) this.obj[i].innerHTML = value;
					if (this.obj[i].value != undefined) this.obj[i].value = value
				}
			}
		}
	}
};

function HttpRequest(url, data, async) {
	this.url = url;
	this.data = data;
	this.async = async;
	this.http_request = CreateHttpRequest();
	this.page_context = null;
	HttpRequest.prototype.setdata = function(backdata) {
		alert(backdata.responseText)
	};
	HttpRequest.prototype.ajax_call_back = function(context) {
		var str = '';
		if (context.http_request.readyState == 4) {
			if (context.http_request.status == 200) {
				str = context.http_request.responseText;
			} else if (context.http_request.status == 404) {
				alert("请求资源不存在！");
				str = context.http_request.responseText;
			} else {
				alert("Ajax请求失败，错误状态为：" + context.http_request.status);
				str = context.http_request.responseText
			};
			var json = {
				"readyState": context.http_request.readyState,
				"status": context.http_request.status,
				"responseText": context.http_request.responseText
			};
			context.setdata(json)
		}
	};
	HttpRequest.prototype.send = function(context) {
		context.url += "&random=" + Math.random();
		addEventHandler(context.http_request, 'readystatechange', this.ajax_call_back, [context]);
		var async = true;
		if (context.async != undefined) if (context.async == true || context.async == false) async = context.async;
		context.http_request.open("GET", context.url, async);
		context.http_request.send(context.data);
	}
};

function CreateHttpRequest() {
	var request = false;
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
		if (request.overrideMimeType) {
			request.overrideMimeType('text/xml')
		}
	} else if (window.ActiveXObject) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP")
		} catch (e) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP")
			} catch (e) {}
		}
	};
	if (!request) {
		window.alert("Create request error!");
		return false
	};
	return request
};

function addEventHandler(obj, eventName, fun, param) {
	var fn = fun;
	if (param) {
		fn = function(e) {
			fun.apply(this, param);
		}
	};
	if (obj.attachEvent) {
		obj.attachEvent('on' + eventName, fn)
	} else if (obj.addEventListener) {
		obj.addEventListener(eventName, fn, false)
	} else {
		obj["on" + eventName] = fn
	}
}