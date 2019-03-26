
    // jQuery UI draggable 适配移动端

    var moveFlag = 0; // 是否移动的flag
    // /iPad|iPhone|Android/.test( navigator.userAgent ) &&
    (function ($) {
        var proto = $.ui.mouse.prototype, _mouseInit = proto._mouseInit;
        $.extend(proto, {
            _mouseInit: function () {
                this.element.bind("touchstart." + this.widgetName, $.proxy(this, "_touchStart"));
                _mouseInit.apply(this, arguments);
            }, _touchStart: function (event) {
                this.element.bind("touchmove." + this.widgetName, $.proxy(this, "_touchMove")).bind("touchend." + this.widgetName, $.proxy(this, "_touchEnd"));
                this._modifyEvent(event);
                $(document).trigger($.Event("mouseup"));
                //reset mouseHandled flag in ui.mouse
                this._mouseDown(event);
                //console.log(this);
                //return false;

                //--------------------touchStart do something--------------------
                console.log("i touchStart!");

            }, _touchMove: function (event) {
                moveFlag = 1;
                this._modifyEvent(event);
                this._mouseMove(event);

                //--------------------touchMove do something--------------------
                console.log("i touchMove!");

            }, _touchEnd: function (event) {
                // 主动触发点击事件
                if (moveFlag == 0) {
                    var evt = document.createEvent('Event');
                    evt.initEvent('click', true, true);
                    this.handleElement[0].dispatchEvent(evt);
                }
                this.element.unbind("touchmove." + this.widgetName).unbind("touchend." + this.widgetName);
                this._mouseUp(event);
                moveFlag = 0;

                //--------------------touchEnd do something--------------------
                console.log("i touchEnd!");

            }, _modifyEvent: function (event) {
                event.which = 1;
                var target = event.originalEvent.targetTouches[0];
                event.pageX = target.clientX;
                event.pageY = target.clientY;
            }
        });
    })(jQuery);