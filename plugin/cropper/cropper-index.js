//cropper 的初始化
//url :上传的upload的url的地址
//widht:上传的比例的宽度
//height: 上传的比例的高度
//cropperImgName :上传的图片的名字
//cropperImgPath:上传的图片的src
//cropperImgView: 上传的图片显示的dom的位置
function cropperInit(cropperUrl, cropperWidth, cropperHeight, cropperImgName, cropperImgPath, cropperImgView) {

    var cropper_View = '<div class="container" >' +
                        ' <div class="flex-center  cropper-title"><h4 class="flex-item">图片上传</h4><h5 class="close flex-item flex-right">X</h5></div>' +
                                      '  <label class="btn btn-primary btn-upload flex-center" for="inputImage" title="Upload image file">' +
                                           ' <input type="file" class="sr-only" id="inputImage" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" style="display:none">' +
                                         '   <span class="docs-tooltip  btn" data-toggle="tooltip" data-animation="false" title="Import image with Blob URLs">' +
                                           '    上传图片  </span><h6 class="upload_imgname">选择上传的照片</h6>' +
                                      '  </label>' +
                            '<div class="row">'+
                                '<div class=" col-lg-8 col-xs-12">' +
                                   ' <div class="img-container">'+
                                    '    <img id="image" src="/DefaultFiles/Default.jpg" alt="Picture">'+
                                  '  </div>'+
                              '  </div>'+
                              '  <div class=" col-lg-3 col-xs-0">'+
                                '    <div class="docs-preview clearfix">'+
                              '          <div class="img-preview preview-lg"></div>'+
                               '     </div></div> </div>'+
                              '  <div class="docs-buttons   flex-center">' +
                                   ' <div class="btn-group">'+
                                      '  <button type="button" class="btn btn-primary" data-method="zoom" data-option="0.1" title="Zoom In">'+
                                         '   <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;zoom&quot;, 0.1)">'+
                                          '      放大</span>'+
                                       ' </button>'+
                                       ' <button type="button" class="btn btn-primary" data-method="zoom" data-option="-0.1" title="Zoom Out">'+
                                        '    <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;zoom&quot;, -0.1)">'+
                                     '           缩小</span>'+
                                      '  </button>'+
                                   ' </div>'+
                                   ' <div class="btn-group  none">'+
                                       ' <button type="button" class="btn btn-primary" data-method="move" data-option="-10" data-second-option="0" title="Move Left">'+
                                        '    <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, -10, 0)">'+
                                        '        左移 </span>'+
                                      '  </button>'+
                                      '  <button type="button" class="btn btn-primary" data-method="move" data-option="10" data-second-option="0" title="Move Right">'+
                                       '     <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 10, 0)">'+
                                         '       右移</span>'+
                                      '  </button>'+
                                     '   <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="-10" title="Move Up">'+
                                         '   <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 0, -10)">'+
                                         '       上移</span>'+
                                      '  </button>'+
                                       ' <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="10" title="Move Down">'+
                                       '     <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 0, 10)">'+
                                          '      下移</span>'+
                                       ' </button>'+
                                   ' </div>'+
                                   ' <div class="btn-group">'+
                                     '   <button type="button" class="btn btn-primary" data-method="rotate" data-option="-90" title="Rotate Left">'+
                                         '   <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;rotate&quot;, -90)">'+
                                          '      左转90º </span>'+
                                       ' </button>'+
                                      '  <button type="button" class="btn btn-primary" data-method="rotate" data-option="90" title="Rotate Right">'+
                                      '      <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;rotate&quot;, 90)">'+
                                      '          右转90º </span>'+
                                     '   </button>'+
                                   ' </div>'+
                                   ' <div class="btn-group">'+
                                        '<button type="button" class="btn btn-primary" data-method="reset" title="Reset">'+
                                          '  <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;reset&quot;)">'+
                                          '      刷新 </span>'+
                                      '  </button>'+
                                  '  </div>'+
                                  '  <div class="btn-group btn-group-crop flex-item flex-right">'+
                                   '     <button class="btn btn-primary" data-method="getCroppedCanvas" data-option="{ &quot;width&quot;: 180, &quot;height&quot;: 90 }" type="button">'+
                                      '      点击上传截图的图片 </button>'+
                                   ' </div>'+
                           ' </div>'+
                     '  </div>' ;
        
    if($(".cropper-model").length>0){
    	$(".cropper-model").html("");
    	    $(".cropper-model").html(cropper_View);
    }else{
    	    $('body').append('<div class="cropper-model  none2 ">'+cropper_View+'</div>');
    }


    
    var console = window.console || { log: function () { } };
    var URL = window.URL || window.webkitURL;
  
    var $image = $('#image');
    var $download = $('#download');
    var $inputImage = $('#inputImage');
    var uploadedImageURL = '';
    var options = '';

    

    //获取图片截取的位置
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
 
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8020/webHtml/html/cropper/cropper.js",
        dataType: "script",
        success: function () {


            //弹出框的初始化
            if ($(".cropper-model").hasClass("none2")) {
                $(".cropper-model").removeClass("none2");
            } else {
                $(".cropper-model").addClass("none2");
            }

            //判断比例是否为空，
            if (cropperWidth == null) {
                cropperWidth = 1;
                cropperHeight = 1;
            }

            options = {
                aspectRatio: cropperWidth / cropperHeight, //裁剪框比例1:1
                preview: '.img-preview',
                viewMode: 1,
                autoCropArea: 1,
                mouseWheelZoom: true,
                crop: function (e) {
                    $dataX.val(Math.round(e.x));
                    $dataY.val(Math.round(e.y));
                    $dataHeight.val(Math.round(e.height));
                    $dataWidth.val(Math.round(e.width));
                    $dataRotate.val(e.rotate);
                    $dataScaleX.val(e.scaleX);
                    $dataScaleY.val(e.scaleY);
                }
            };
            var originalImageURL = $image.attr('src');
            var uploadedImageURL;


            // Tooltip
            //  $('[data-toggle="tooltip"]').tooltip();


            // Cropper
            $image.on({
                ready: function (e) {
                    console.log(e.type);
                },
                cropstart: function (e) {
                    console.log(e.type, e.action);
                },
                cropmove: function (e) {
                    console.log(e.type, e.action);
                },
                cropend: function (e) {
                    console.log(e.type, e.action);
                },
                crop: function (e) {
                    console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
                },
                zoom: function (e) {
                    console.log(e.type, e.ratio);
                }
            }).cropper(options);

            $image.cropper("setAspectRatio", cropperWidth / cropperHeight)


            // Buttons
            if (!$.isFunction(document.createElement('canvas').getContext)) {
                $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
            }

            if (typeof document.createElement('cropper').style.transition === 'undefined') {
                $('button[data-method="rotate"]').prop('disabled', true);
                $('button[data-method="scale"]').prop('disabled', true);
            }


            // Download
            //if (typeof $download[0].download === 'undefined') {
            //  $download.addClass('disabled');
            //}

            // Import image
            //colse的关闭的按钮
            $(".cropper-model .close").click(function () {
                debugger;
                if ($(".cropper-model").hasClass("none2")) {
                    $(".cropper-model").removeClass("none2");
                } else {
                    $(".cropper-model").addClass("none2");
                }
            });
            // Options
            $('.docs-toggles').on('change', 'input', function () {
                var $this = $(this);
                var name = $this.attr('name');
                var type = $this.prop('type');
                var cropBoxData;
                var canvasData;

                if (!$image.data('cropper')) {
                    return;
                }

                if (type === 'checkbox') {
                    options[name] = $this.prop('checked');
                    cropBoxData = $image.cropper('getCropBoxData');
                    canvasData = $image.cropper('getCanvasData');

                    options.ready = function () {
                        $image.cropper('setCropBoxData', cropBoxData);
                        $image.cropper('setCanvasData', canvasData);
                    };
                } else if (type === 'radio') {
                    options[name] = $this.val();
                }

                $image.cropper('destroy').cropper(options);
            });


            // Methods
            $('.docs-buttons').on('click', '[data-method]', function () {

                var $this = $(this);
                var data = $this.data();
                var $target;
                var result;

                if ($this.prop('disabled') || $this.hasClass('disabled')) {
                    return;
                }

                if ($image.data('cropper') && data.method) {
                    data = $.extend({}, data); // Clone a new one

                    if (typeof data.target !== 'undefined') {
                        $target = $(data.target);

                        if (typeof data.option === 'undefined') {
                            try {
                                data.option = JSON.parse($target.val());
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    }

                    if (data.method === 'rotate') {
                        $image.cropper('clear');
                    }

                    //改变图片的尺寸 ,上传上去的图片的像素
                    data.option.width = data.option.width * 2;
                    data.option.height = data.option.height * 2;

                    result = $image.cropper(data.method, data.option, data.secondOption);

                    if (data.method === 'rotate') {
                        $image.cropper('crop');
                    }

                    switch (data.method) {
                        case 'scaleX':
                        case 'scaleY':
                            $(this).data('option', -data.option);
                            break;

                        case 'getCroppedCanvas'://上传头像
                            if (result) {
                                var imgBase = result.toDataURL('image/jpeg');
                                console.log("sss", imgBase)
                                var data = { imgBase: imgBase };
                                if ((data.imgBase).length > 30) {
                                    $.ajax({
                                        type: "post",
                                        url: cropperUrl,
                                        data: data,
                                        success: function (json) {
                                            if (json.Status.Code == 200) {
                                                $(".cropper-model").addClass("none2");
                                                layer.msg("上传成功")
                                                $(cropperImgName).val(json.FileNameNew)
                                                $(cropperImgPath).val(json.Src)
                                                $(cropperImgView).attr("src", json.Src)
                                                $("#image").attr("src", "~/DefaultFiles/Default.jpg")

                                                $image.cropper('clear');
                                                $image.cropper('replace', "/DefaultFiles/Default.jpg", true);
                                                //    $image.cropper('enable');
                                                $image.cropper('destroy');
                                                //   $image.cropper('reset');
                                                URL.revokeObjectURL(uploadedImageURL);
                                                uploadedImageURL = '';
                                                $(".cropper-model .img-container").html("");

                                                $(".cropper-model .img-container").html('<img id="image" src="/DefaultFiles/DefaultSchool.png" alt="Picture">');
                                                $(".cropper-model .img-clearfix").html("");

                                                $(".cropper-model .img-clearfix").html(' <div class="img-preview preview-lg"></div>');
                                                //  $image.attr('src', originalImageURL);
                                            } else {
                                                layer.msg("上传失败")
                                            }

                                        }, error: function (xhr, type, errorThrown) {

                                            layer.msg("上传失败")
                                            console.log(errorThrown, type)
                                        }
                                    });
                                }
                            }

                            break;

                        case 'destroy':
                            if (uploadedImageURL) {
                                URL.revokeObjectURL(uploadedImageURL);
                                uploadedImageURL = '';
                                $image.attr('src', originalImageURL);
                            }

                            break;
                    }

                    if ($.isPlainObject(result) && $target) {
                        try {
                            $target.val(JSON.stringify(result));
                        } catch (e) {
                            console.log(e.message);
                        }
                    }

                }
            });


            // Keyboard
            $(document.body).on('keydown', function (e) {

                if (!$image.data('cropper') || this.scrollTop > 300) {
                    return;
                }

                switch (e.which) {
                    case 37:
                        e.preventDefault();
                        $image.cropper('move', -1, 0);
                        break;

                    case 38:
                        e.preventDefault();
                        $image.cropper('move', 0, -1);
                        break;

                    case 39:
                        e.preventDefault();
                        $image.cropper('move', 1, 0);
                        break;

                    case 40:
                        e.preventDefault();
                        $image.cropper('move', 0, 1);
                        break;
                }

            });


            // Import image
            var $inputImage = $('#inputImage');

            if (URL) {
                $inputImage.change(function () {
                    var files = this.files;
                    var file;

                    if (!$image.data('cropper')) {
                        return;
                    }

                    if (files && files.length) {
                        file = files[0];

                        if (/^image\/\w+$/.test(file.type)) {
                            if (uploadedImageURL) {
                                URL.revokeObjectURL(uploadedImageURL);
                            }
                         
                            uploadedImageURL = URL.createObjectURL(file);
                            $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                         
                            $(".cropper-model .upload_imgname").html($("#image").attr("src"))
                            $inputImage.val('');
                        } else {
                            window.alert('Please choose an image file.');
                        }
                    }
                });
            } else {
                $inputImage.prop('disabled', true).parent().addClass('disabled');
            }
        }

   });
}