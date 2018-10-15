/**
 * Name:adminApp.js
 * Desc:华喜·希安 - 系统用户管理
 * Author:LINZESEN · date 2018/2/24
 * LICENSE:LINZESEN
 */

//自定义接口的地址
var UrlAddress = {
	table: "../../src/demo.json", //表格的url的地址
	urlForm: "" ,//表单的url的地址
	addForm: '' //点击添加表单的url的地址
}

layui.use(['upload', 'table', 'common', 'element', 'laydate'], function() {
	var $ = layui.jquery,
		com = layui.common,
		form = layui.form,
		table = layui.table,
		upload = layui.upload,
		laydate = layui.laydate,
		element = layui.element;
	var cropbox = {};

	function DateType(data) {
		if(typeof(data) == undefined) {
			return "";
		} else if(!data && typeof(data) != "undefined" && data != 0) {
			return "";
		} else if(data == null) {
			return "";
		} else {
			return data;
		}
	}

	var me = {
			//初始化入口
			init: function() {
				$('#search').on('click', function() {
					me.getlist();
				});
				$('#search').click();
				//单选的按钮
				table.on('checkbox(tableList)', function(obj) {
					var checkStatus = table.checkStatus('tableList');
					if(checkStatus.data.length > 1) {
						$('.layui-table tbody    tr[data-index="' + obj.data.LAY_TABLE_INDEX + '"]  .layui-form-checkbox').removeClass("layui-form-checked");
						layer.msg('请只选择一条数据');
					}
				});
                me.buttonGroup();
				me.initUploadControlValue();
			},
			//表格增删改查的点击按钮
			//add=增加，look=查看，edit=编辑，delect=删除
			buttonGroup:function(add,look,edit,delect){
								//添加
				$('#addBtn').on('click', function() {
					me.gotoAdd();
					laydate.render({
						elem: '#F_BIRTHDAY',
						format: 'yyyy-MM-dd' //可任意组合
					});
				});
				//编辑
				$('#editBtn').on('click', function() {
					var checkStatus = table.checkStatus('tableList');
					if(checkStatus.data.length > 1) {
						layer.msg('请只选择一条数据');
					} else {
						if(checkStatus.data[0].F_AUDITSTATUS == 1 || checkStatus.data[0].F_AUDITSTATUS == 5) {
							layer.msg("教育局审核中，不允许修改")
							return;
						}
						me.gotoUpdate(checkStatus.data[0]);
					}
				});

				//查看
				$('#detailBtn').on('click', function() {
					var checkStatus = table.checkStatus('tableList');
					if(checkStatus.data.length > 1) {
						layer.msg('请只选择一条数据');
					} else {
						me.gotoLook(checkStatus.data[0]);
					}

				});
			
			    $('#editPassword').on('click', function() {

					var checkStatus = table.checkStatus('tableList');
					if(checkStatus.data.length > 1) {
						layer.msg('请只选择一条数据');
					} else {
						me.gotoReset(checkStatus.data[0]);
					}

				});
			    
			    $('#recordBtn').on('click', function() {
					var checkStatus = table.checkStatus('tableList');

					if(checkStatus.data.length > 1) {
						layer.msg('请只选择一条数据');
					} else {
						var status = checkStatus.data[0].F_AUDITSTATUS;
						checkStatus.data[0].F_BIRTHDAY = new Date(parseInt(checkStatus.data[0].F_BIRTHDAY.replace(/\/Date\((-?\d+)\)\//, '$1'))).toLocaleDateString();
						checkStatus.data[0].F_CREATEDATE = new Date(parseInt(checkStatus.data[0].F_CREATEDATE.replace(/\/Date\((-?\d+)\)\//, '$1'))).toLocaleDateString();

						if(status == 0 || status == 3 || status == 2) {
							me.doRecord(checkStatus.data[0], true)
						} else if(status == 1) {
							com.oktip("课程备案信息已提交审核，请等待审核结果!");
						} else if(status == 6) {
							layer.confirm('教师已删除，重新启用需向市局备案！', function(index) {
								me.doRecord(checkStatus.data[0]);
								layer.close(index);
							});

						} else if(status == 7) {
							layer.confirm('重启教师正在审核，请耐心等待！', function(index) {
								layer.close(index);
							});

						}

					}

				});
				//删除的
				$('#deleteBtn').on('click', function() {
					var checkStatus = table.checkStatus('tableList');
					var msg = "";

					if(checkStatus.data.length > 1) {
						layer.msg('请只选择一条数据');
					} else {
						if(checkStatus.data[0].F_AUDITSTATUS == 0) {
							msg = "确认离职吗？"

						} else
						if(checkStatus.data[0].F_AUDITSTATUS == 1 || checkStatus.data[0].F_AUDITSTATUS == 7) {
							msg = "该教师正在审核，无法离职。请先取消申请备案！"
							layer.msg(msg)
							return;
						} else
						if(checkStatus.data[0].F_AUDITSTATUS == 2 || checkStatus.data[0].F_AUDITSTATUS == 3) {
							msg = "该教师已备案，即将向监控中心发起离职申请，确定要执行此操作吗？"
						} else
						if(checkStatus.data[0].F_AUDITSTATUS == 5) {
							msg = "监控中心正在审核离职材料，无法执行此操作";
							layer.msg(msg)
							return;
						} else {
							msg = "确定离职吗？"

						}
						layer.confirm(msg, function(index) {
							me.doDisable(checkStatus.data[0]);
							layer.close(index);
						});

					}

				});

			},
			getFileHostUrl: function() {
				//获取文件主机域名
				return window.location.origin;
			},
			initUploadControlValue: function() {
				//获取值初始化到预览控件
				var F_FILENAMES = $('#F_FILENAMES').val();
				var itemsArr = '';
				if(F_FILENAMES != undefined) {
					itemsArr = F_FILENAMES.split(',');
				}
				if(itemsArr.length > 0) {
					for(var i = 0; i < itemsArr.length; i++) {
						var itemArr = itemsArr[i].split('|');
						if(itemArr.length > 1) {
							me.setValueToViewControl(itemArr[0], itemArr[1], true);
						}
					}
				}

			},
			setValueToViewControl: function(displayName, displayValue, isInit) {
				//设置值给预览控件

				var aElement = "<a target='_blank' href='" + me.getFileHostUrl() + displayValue + "'  style='color: red;'>" + displayName + " </a><br />";
				$('#UploadFilesView').append(aElement);

				if(!isInit) {
					var F_FILENAMES = $('#F_FILENAMES').val();

					if(F_FILENAMES == '') {
						F_FILENAMES = (displayName + "|" + displayValue);
					} else {
						F_FILENAMES = F_FILENAMES + "," + (displayName + "|" + displayValue);
					}
					$('#F_FILENAMES').val(F_FILENAMES);
				}

			},
			gotoUpload: function() {
				///上传图片的方法
				upload.render({
					elem: '#UploadFiles',
					before: function(obj) {
						layer.load(2);
					},
					done: function(res, index, upload) {
						var a = res;
						me.setValueToViewControl(res.FileNameOld, res.RelativeFilePath);
						layer.closeAll('loading');
					}
				});
			},
			//去添加
			gotoAdd: function() {
				com.open({
					type: 1,
					title: '设置弹出框的名字',
					data: {},
					path: "#edit-form",
					btn: ['保存', '取消'],
					shade: false,
					//offset: ['100px', '30%'],
					area: ['700px', '70%'],
					maxmin: true,
					btnAlign: 'c',
					yes: function(index) {
						//触发表单的提交事件
						$('form.layui-form').find('button[lay-filter=edit]').click();
					},
					success: function(layero, index) {
						layer.full(index);
						//弹出窗口成功后渲染表单
						var form = layui.form;
						layero.find(".UserName").show();
						layero.find(".PassWord").show();
						layero.find("#Birthday").on("click", function() {
							laydate({
								elem: this,
								istime: true,
								format: 'YYYY-MM-DD'
							});
						})
						//先保障最大化后初始化上传， 不然按钮定位不准
						//setTimeout(function () {
						//    yy_upload.upload($("#HeadImage"), { fileNumLimit: 2, formData: { "stag": 1, "btag": 6, tpsy: false, hasmin: false, wzsy: "" } });
						//}, 300);
						laydate.render({
							elem: '#time-select'
						});
						me.gotoupload('F_CERTIFICATE');
						me.gotoupload('F_HEADIMAGE');

						me.gotoupload();
						form.render();
						form.on('submit(edit)', function(data) {
							me.renderControl(layero);
							me.doAdd(data.field);
							return false;
						});
					}
				});
			},
			//执行添加
			doAdd: function(json) {

				json.F_PASSWORD = $.md5(json.F_PASSWORD);
				var lindex = com.load(2);
				$.ajax({
					type: "post",
					url: UrlAddress.addForm,
					data: json,
					success: function(json) {
						com.close(lindex);
						if(json.Status.Code != 200) {
							com.notip(json.Status.Remark);
							return;
						}
						layer.closeAll();
						com.oktip("添加教师成功!");
						me.getlist();
					}
				});
			},
			//提交教师备案
			gotoRecord: function(json) {
				com.open({
					type: 1,
					title: '申请教师备案',
					data: json,
					path: "#Record-form",
					btn: ['提交备案', '取消'],
					shade: false,
					area: ['700px', '70%'],
					maxmin: true,
					yes: function(index) {
						//触发表单的提交事件
						$('form.layui-form').find('button[lay-filter=edit]').click();
					},
					success: function(layero, index) {
						layer.full(index);
						//弹出窗口成功后渲染表单
						laydate.render({
							elem: '#time-select'
						});
						form.render();
						me.gotoUpload();

						form.on('submit(edit)', function(data) {
							me.renderControl(layero);
							me.doRecord(data.field, true);
							console.log("form", layero.find("form").serialize());
							return false;
						});
					}
				});
			},
			//提交教师备案
			doRecord: function(json, reload) {
				var lindex = com.load();
				$.ajax({
					type: "post",
					url: UrlAddress.RecordForm,
					data: json,
					success: function(data) {
						com.close(lindex);
						if(data.Status.Code != 200) {
							com.notip(data.Status.Remark);
							return;
						}
						com.closeAll();
						com.oktip("备案提交成功!");
						if(reload) {
							me.getlist();
						}
					}
				});
			},
			//获取列表
			getlist: function(prePageIndex) {
				table.render({
					elem: '#tableList',
					url: UrlAddress.table,
					skin: 'line' //行边框风格
						,
					page: {
						//layout: ['count'] //自定义分页布局
						layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'] //自定义分页布局
							,
						curr: 1 //设定初始在第 5 页
							,
						groups: 8 //显示个连续页码
							,
						first: false //不显示首页
							,
						last: false //不显示尾页
					},
					limit: 8,
					limits: [2, 8, 10, 20, 30, 50, 100],
					fieldKey: "F_TEACHERID",
					height: 'full',
					where: $("#searchFromSearch").serialize(),
					initSort: {
						field: "F_CREATEDATE",
						type: "desc"
					},
					cols: [
						[{
								field: 'sex',
								title: '全部',
								minWidth: 100,
								checkbox: true,
								fixed: true
							},

							{
								field: 'username',
								title: '教师姓名',
								minWidth: 200,
								align: 'center',
								unresize: true
							}, {
								field: 'F_SEX',
								title: '性别',
								minWidth: 100,
								align: 'center',
								templet: function(d) {
									if(d.F_SEX == 0) {
										return "男";
									} else {
										return "女";
									}
								}
							}, {
								field: 'F_DEGREE',
								title: '学历',
								minWidth: 200,
								sort: true
							}, {
								field: 'F_AUDITSTATUS',
								title: '备案审核状态',
								minWidth: 100,
								sort: true,
								templet: function(d) {
									var AUDITSTATUS = DateType(d.F_AUDITSTATUS);

									if(AUDITSTATUS == 0) {
										return "未备案";
									} else if(AUDITSTATUS == 1) {
										//console.log("已发布");
										return "未审核";
									} else if(AUDITSTATUS == 2) {
										//console.log("已发布");
										return "审核通过";
									} else if(AUDITSTATUS == 3) {
										//console.log("已发布");
										return "未通过";
									} else {
										return "未备案";
									}
								}

							}, {
								field: 'F_PHONE',
								title: '联系电话',
								sort: true,
								minWidth: 100
							}

							//, { fixed: false, width: 350, toolbar: '#ColToolBtn', align: 'center' }

						]
					],
					success: function(selector, result) {

					}
				});

				//监听按钮栏操作
				table.on('tool(tableList)', function(obj) {
					var data = obj.data;
					if(obj.event === 'detail') {
						me.gotoLook(data);
					} else if(obj.event === 'record') {

						var status = data.F_AUDITSTATUS;
						if(status == 0 || status == 3 || status == 2) {
							me.doRecord(data);
						} else if(status == 1) {
							com.oktip("教师备案信息已提交审核，请等待审核结果!");
							alert('数据', status)
						} else if(status == 6) {
							com.oktip("教师已删除，重新启用需向市局备案！");
							me.doRecord(data);
						}

					} else if(obj.event === 'edit') {
						me.gotoUpdate(data);
					} else if(obj.event === 'password') {
						me.gotoReset(data);
					} else if(obj.event === 'delete') {
						var status = data.F_AUDITSTATUS;
						if(status = 2) {
							layer.confirm('删除教师需向市局申请备案，确定删除吗？', function(index) {

								me.doDisable(data);
								layer.close(index);
							});
						} else {
							layer.confirm('确定删除教师吗？', function(index) {
								me.doDisable(data);
								layer.close(index);
							});

						}

					}

				});

			},
			//准备查看
			gotoLook: function(json) {
				com.open({
					type: 1,
					title: '查看信息',
					data: json,
					path: "#edit-form",
					btn: ['确定', '取消'],
					shade: false,
					area: ['700px', '70%'],
					maxmin: true,
					success: function(layero, index) {
						layer.full(index);
						me.initUploadControlValue();
						setTimeout(function() {
							layero.find("input[type=text]").attr("readonly", "").addClass("readonly");
							layero.find("textarea").attr("readonly", "").addClass("readonly");
						});
					}
				});
			},
			//准备修改
			gotoUpdate: function(json) {
				com.open({
						type: 1,
						title: '教师信息编辑',
						data: json,
						path: "#edit-form",
						btn: ['保存', '取消'],
						shade: false,
						area: ['700px', '70%'],
						maxmin: true,
						yes: function(index) {
							//触发表单的提交事件
							$('form.layui-form').find('button[lay-filter=edit]').click();

						},
						success: function(layero, index) {
							layer.full(index);
							//弹出窗口成功后渲染表单
							laydate.render({
								elem: '#F_BIRTHDAY',
								format: 'yyyy-MM-dd' //可任意组合
							});
							me.gotoupload('F_CERTIFICATE');
							me.gotoupload('F_HEADIMAGE');
							form.render();
							me.gotoUpload();
							me.initUploadControlValue();
							form.on('submit(edit)', function(data) {
								me.renderControl(layero);
								me.doUpdate(data.field, true);
								return false;
							});
						}
				})
		},
		//执行修改
		doUpdate: function(json, reload) {
			var lindex = com.load();
			$.ajax({
				type: "post",
				url: UrlAdress.Update,
				data: {
					UID: JSON.f_ID
				},
				success: function(data) {
					var F_TEACHINGSUBJECTS = $('#F_TEACHINGSUBJECTS').val();
					var F_TEACHYEAR = $('#F_TEACHYEAR').val();
					var F_TEACHERTITLE = $('#F_TEACHERTITLE').val();
					var F_DEGREE = $("#F_DEGREE").val();
					var F_TEACHERNAME = $('#F_TEACHERNAME').val();
					var F_SEX = $('#F_SEX').val(); //性别
					var F_PHONE = $('#F_PHONE').val(); //手机
					var F_TEACHERADDRESS = $('#F_TEACHERADDRESS').val(); //住址
					var F_INTRODUCE = $('#F_INTRODUCE').val(); //個人介紹
					//未备案直接修改 或敏感信息不变

					debugger
					if(data.F_AUDITSTATUS == 0 || data.F_AUDITSTATUS == 3 || (data.F_INTRODUCE == F_INTRODUCE && data.F_TEACHERADDRESS == F_TEACHERADDRESS && data.F_PHONE == F_PHONE && data.F_SEX == F_SEX && data.F_SCOPEID == F_SCOPEID && data.F_TEACHERNAME == F_TEACHERNAME && data.F_TEACHYEAR == F_TEACHYEAR && data.F_TEACHERTITLE == F_TEACHERTITLE)) {
						var lindex = com.load();
						$.ajax({
							type: "post",
							url: "/Organization/EditTeacherInfo/",
							data: json,
							success: function(data) {
								com.close(lindex);
								if(data.Status.Code != 200) {
									com.notip(data.Status.Remark);
									return;
								}
								com.closeAll();
								com.oktip("修改教师信息成功!");
								if(reload) {
									me.getlist();
								}
							}
						});
					} else if(data.F_AUDITSTATUS == 2) {
						//已备案并且修改了敏感信息重新备案
						layer.confirm('您已修改了敏感信息，该教师将重新备案，确定要执行此操作？', {
							btn: ['确定', '取消'] //按钮
						}, function() {
							var lindex = com.load();
							$.ajax({
								type: "post",
								url: "/Organization/EditTeacherSensitiveInfo/",
								data: json,
								success: function(data) {
									com.close(lindex);
									if(data.Status.Code != 200) {
										com.notip(data.Status.Remark);
										return;
									}
									com.closeAll();
									com.oktip("修改教师信息成功!");
									if(reload) {
										me.getlist();
									}
								}
							});
						});
					} else if(data.F_AUDITSTATUS == 5) {
						layer.msg("该教师离职申请正在审核，无法编辑！")
					} else if(data.F_AUDITSTATUS == 6) {
						layer.msg("改教师已离职，请先去备案再修改教师信息！")
					} else {
						layer.msg("无法执行此操作")
					}
				}

			});
		},
		//教师账号修改
		gotoReset: function(json) {
			com.open({
				type: 1,
				title: '教师账号修改',
				data: json,
				path: "#password-form",
				btn: ['保存', '取消'],
				shade: false,
				area: ['700px', '70%'],
				maxmin: true,
				yes: function(index) {
					//触发表单的提交事件
					$('form.layui-form').find('button[lay-filter=edit]').click();
				},
				success: function(layero, index) {
					layer.full(index);
					form.render();
					form.on('submit(edit)', function(data) {
						me.renderControl(layero);
						me.doEdit(data.field, true);
						return false;
					});
				}
			});
		},
		//执行修改
		doEdit: function(json, reload) {
			console.log(json);
			json.F_PASSWORD = $.md5((json.F_PASSWORD + ''));
			var lindex = com.load();
			$.ajax({
				type: "post",
				url: "/Organization/EditTeacherAccount/",
				data: json,
				success: function(data) {
					com.close(lindex);
					if(data.Status.Code != 200) {
						com.notip(data.Status.Remark);
						return;
					}
					com.closeAll();
					com.oktip("修改教师信息成功!");
					if(reload) {
						me.getlist();
					}
				}
			});
		},
		doDisable: function(json) {
		   //删除教师
		   
            $.ajax({
                type: "post",
                url: "/Organization/DeleteTeacher",
                data: json,
                success: function (json) {
                    if (json.Status.Code != 200) {
                        layer.alert(json.Status.Remark);
                        return;
                    }
                    layer.alert("操作成功!", function () {
                        layer.closeAll();
                        me.getlist();
                    });
                }
            });
		},
		//渲染控件处理
		renderControl: function(selector) {
			var idsz = new Array();
			var namesz = new Array();
			selector.find(".F_TEACHERID").each(function(i, s) {
				if($(s).prop("checked")) {
					idsz.push($(s).val());
					namesz.push($(s).attr("title"));
				}
			});
			if(idsz.length > 0) {
				selector.find("#F_TEACHERID").val(idsz.join(","));
				// selector.find("#F_TEACHERNAME").val(namesz.join(","));
			} else {
				selector.find("#F_TEACHERID").val("");
				// selector.find("#F_TEACHERNAME").val("");
			}
		},
		gotoupload: function(fieldName) {
			upload.render({
				elem: '#upload_file_' + fieldName //绑定元素  
					,
				before: function(obj) {
					// layer.load(2); //上传loading  
				},
				done: function(res, index, upload) {
					var a = res;
					$('#' + fieldName + '').val(res.FileNameNew);
					$('#Photo_View_' + fieldName).attr('src', res.Src);
					//上传完毕回调  
					//if (res.src != "" && res.src != null) {
					//    $('#FileName').val(res.name);
					//    $("#FileUrl").val(res.src);
					//    获取当前触发上传的元素  
					//    var items = this.item;
					//    items.hide();
					//}
					//  layer.close(this);

				}
			});

		}, 
		gotobuildlayedit: function() {
			layedit.set({
				uploadImage: {
					url: '/Organization/UploadForLayUILayEdit/' //接口url
						,
					type: 'post' //默认post 
				}
			});

			layedit.build('F_LEESONINFO', {
				height: 200,
				tool: [
					'strong' //加粗
					, 'italic' //斜体
					, 'underline' //下划线
					, 'del' //删除线
					, '|' //分割线
					, 'left' //左对齐
					, 'center' //居中对齐
					, 'right' //右对齐
					, 'link' //超链接
					, 'unlink' //清除链接
					, 'face' //表情
					, 'image' //插入图片
					, 'file' //插入图片
					// , 'help' //帮助
				]
			}); //建立编辑器

		}
    }
    me.init();
});