(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (factory());
}(this, (function () {
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ?
            "symbol" : typeof obj;
    };

    var sheet = void 0;
    var _ = {
        getLength: function getLength(v1) {
            if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) !== 'object') {
                console.error('getLength error!');
                return;
            }
            return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        },
        getAngle: function getAngle(v1, v2) {
            if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) !== 'object' || (typeof v2 ===
                    'undefined' ? 'undefined' : _typeof(v2)) !== 'object') {
                console.error('getAngle error!');
                return;
            }
            // 鍒ゆ柇鏂瑰悜锛岄『鏃堕拡涓� 1 ,閫嗘椂閽堜负 -1锛�
            var direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1,

                // 涓や釜鍚戦噺鐨勬ā锛�
                len1 = this.getLength(v1),
                len2 = this.getLength(v2),
                mr = len1 * len2,
                dot = void 0,
                r = void 0;
            if (mr === 0) return 0;
            // 閫氳繃鏁伴噺绉叕寮忓彲浠ユ帹瀵煎嚭锛�
            // cos = (x1 * x2 + y1 * y2)/(|a| * |b|);
            dot = v1.x * v2.x + v1.y * v2.y;
            r = dot / mr;
            if (r > 1) r = 1;
            if (r < -1) r = -1;
            // 瑙ｅ€煎苟缁撳悎鏂瑰悜杞寲涓鸿搴﹀€硷紱
            return Math.acos(r) * direction * 180 / Math.PI;
        },
        getBasePoint: function getBasePoint(el) {
            if (!el) return {
                x: 0,
                y: 0
            };
            var offset = this.getOffset(el);
            var x = offset.left + el.getBoundingClientRect().width / 2,
                y = offset.top + el.getBoundingClientRect().width / 2;
            return {
                x: Math.round(x),
                y: Math.round(y)
            };
        },
        extend: function extend(obj1, obj2) {
            for (var k in obj2) {
                if (obj2.hasOwnProperty(k)) {
                    if (_typeof(obj2[k]) == 'object' && !(obj2[k] instanceof Node)) {
                        if (_typeof(obj1[k]) !== 'object') {
                            obj1[k] = {};
                        }
                        this.extend(obj1[k], obj2[k]);
                    } else {
                        obj1[k] = obj2[k];
                    }
                }
            }
            return obj1;
        },
        getVector: function getVector(p1, p2) {
            if ((typeof p1 === 'undefined' ? 'undefined' : _typeof(p1)) !== 'object' || (typeof p2 ===
                    'undefined' ? 'undefined' : _typeof(p2)) !== 'object') {
                console.error('getvector error!');
                return;
            }
            var x = Math.round(p1.x - p2.x),
                y = Math.round(p1.y - p2.y);
            return {
                x: x,
                y: y
            };
        },
        getPoint: function getPoint(ev, index) {
            if (!ev || !ev.touches[index]) {
                console.error('getPoint error!');
                return;
            }
            return {
                x: Math.round(ev.touches[index].pageX),
                y: Math.round(ev.touches[index].pageY)
            };
        },
        getOffset: function getOffset(el) {
            el = typeof el == 'string' ? document.querySelector(el) : el;
            var rect = el.getBoundingClientRect();
            var offset = {
                left: rect.left + document.body.scrollLeft,
                top: rect.top + document.body.scrollTop,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
            return offset;
        },
        matrixTo: function matrixTo(matrix) {
            var arr = matrix.replace('matrix(', '').replace(')', '').split(',');
            var cos = arr[0],
                sin = arr[1],
                tan = sin / cos,
                rotate = Math.atan(tan) * 180 / Math.PI,
                scale = cos / Math.cos(Math.PI / 180 * rotate),
                trans = void 0;
            trans = {
                x: parseInt(arr[4]),
                y: parseInt(arr[5]),
                scale: scale,
                rotate: rotate
            };
            return trans;
        },
        getUseName: function getUseName(evName) {
            var useName = evName.replace('start', '');
            var end = useName.indexOf('rotate') !== -1 ? 'nd' : 'end';
            useName = useName.replace(end, '');
            return useName;
        },
        domify: function domify(DOMString) {
            var htmlDoc = document.implementation.createHTMLDocument();
            htmlDoc.body.innerHTML = DOMString;
            return htmlDoc.body.children;
        },
        getEl: function getEl(el) {
            if (!el) {
                console.error('el error,there must be a el!');
                return;
            }
            var _el = void 0;
            if (typeof el == 'string') {
                _el = document.querySelector(el);
            } else if (el instanceof Node) {
                _el = el;
            } else {
                console.error('el error,there must be a el!');
                return;
            }
            return _el;
        },
        data: function data(el, key) {
            el = this.getEl(el);
            return el.getAttribute('data-' + key);
        },
        include: function include(str1, str2) {
            if (str1.indexOf) {
                return str1.indexOf(str2) !== -1;
            } else {
                return false;
            }
        },
        getPos: function getPos(el) {
            if (!el) return;
            el = this.getEl(el);
            var defaulTrans = void 0;
            var style = window.getComputedStyle(el, null);
            var cssTrans = style.transform || style.webkitTransform;

            if (window.getComputedStyle && cssTrans !== 'none') {
                defaulTrans = this.matrixTo(cssTrans);
            } else {
                defaulTrans = {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0
                };
            }
            return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
        },
        addCssRule: function addCssRule(selector, rules) {
            if (!sheet) {
                sheet = createStyleSheet();
            }
            sheet.insertRule(selector + '{' + rules + '}', sheet.rules.length);
        }
    };

    function createStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        return style.sheet;
    }

    var base64 =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QUY3RkU4M0E5OEIxMUU2QjU0QTkxRjBDMUE2RDg3NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QUY3RkU4NEE5OEIxMUU2QjU0QTkxRjBDMUE2RDg3NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdBRjdGRTgxQTk4QjExRTZCNTRBOTFGMEMxQTZEODc0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdBRjdGRTgyQTk4QjExRTZCNTRBOTFGMEMxQTZEODc0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ckj5SQAAA5tJREFUeNrsm0tIVUEYx7+TSuHVIk2sjfTQTaQLo425KXq3yF7gwrASwozKVmG0DNoElUQgYRQECT0JKum1SjeRkFaLnuAmpCxIrxkit//X/W7dpOu9Z+acmSOeD34oepn5fs6Z15nRicViNJ1iBk2zCIVD4VB4akd2ql/UnvGk/CJQBSpBKVgE5oE8+f0w+AI+gnegB3TJz7Sio9mlsEYUgO1COXAm+WyesBCskp/xPNkHbghfjbSwQhSDw/xwgFka5fAfqEJoAVdBKxgISh/OAU3gKditKTsxuKw9UnaT1GVVmPvkXXAcRHwcayJSx31QZkt4HegEywwOskvBPanbqHA9aAf5FmaWiNRdb0q4DpwEWRan0yzJoc5v4Q1SUVCCc1nvlzAPUGctt+z/WrpVcvNUmKeDNkt9Nl3kS27ZXgrvNzwauw3ObZ9XK635oDmDteuCdJ+5/YyGOrp+r5/9iCOyFB3QbeFGL1ZPPssmpqtG3Ue6QGXotyCbiF1gro7wDpCrKTtsSJYk1506wtu0n7OZ5DhmB7CtqsJFsp/VirUVFNm7mmYblK6QlwyuhavSbN4n7bMPeylqSdqR3F1PS5U6A5STJJv89eIT+m7g1f9ycMdtC5epyibe07CcpZYuVXmkS3SnHovSJSrChW5qSDX1WJIuVBHO9ar2hPSjPmPSuX684nEt3f7YqLRr4ZEpLD2iIjwYlJauXel6Hz6oItwfhMebZWtW/DmayTT6VYTf2u7TirIc71RWWj2mBjL+fk35vyuy6E+KKcpyPFcR7pacHFvSGkV2qzzSnyl+imdlytKIXprkuDXdPHzT5DwdHSUv9hW3dF4AXAc/TAjzALVFvc8mgnO9piPMh9EdJmRr9GVJcv2mI8xxDoxOAVnu/63pPpTJe+lPFD9iOeqHMHZZvK0c8qCo05TBLYFMNw/nwWsKbrwCF3Q3D8kxRvErB9EAynJOByRHz4Q53oBDYDxAspzLQcmNvBbm4DsWLQES5lw6vdoPp4orUtG45ZZtkVzIb2GOy6CByNgRysQ+2yA5kClhjgcUvwLx0qAszxSbpG4yLczxAWwGJ3wewaNSx0bdfboXL/HGZJ6uBpc8XpWNSpnVUseYboFe3rXkVc4xcIriR5Z8ipfucmmqjVOv7NQCfbk0ecPRJhRL6/CJ3hKwGMyh+A3aHPp7fZi7xnvwguLXhwf86htO+F8toXAoHAqHwgGOXwIMAGwpGJYKZlZqAAAAAElFTkSuQmCC";

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var HandlerBus = function () {
        function HandlerBus(el) {
            _classCallCheck(this, HandlerBus);

            this.handlers = [];
            this.el = el;
        }

        _createClass(HandlerBus, [{
            key: 'add',
            value: function add(handler) {
                this.handlers.push(handler);
                return this;
            }
    }, {
            key: 'del',
            value: function del(handler) {
                var _this = this;

                if (!handler) {
                    this.handlers = [];
                } else {
                    this.handlers.forEach(function (value, index) {
                        if (value === handler) {
                            _this.handlers.splice(index, 1);
                        }
                    });
                }
                return this;
            }
    }, {
            key: 'fire',
            value: function fire() {
                var _this2 = this,
                    _arguments = arguments;

                if (!this.handlers || !this.handlers.length === 0) return;
                this.handlers.forEach(function (handler) {
                    if (typeof handler === 'function') handler.apply(_this2.el,
                        _arguments);
                });
                return this;
            }
    }]);

        return HandlerBus;
    }();

    var EVENT = ['touchstart', 'touchmove', 'touchend', 'drag', 'dragstart', 'dragend', 'pinch',
        'pinchstart', 'pinchend', 'rotate', 'rotatestart', 'rotatend', 'singlePinchstart',
        'singlePinch', 'singlePinchend', 'singleRotate', 'singleRotatestart', 'singleRotatend'];

    var ORIGINEVENT = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

    function MTouch() {
        var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        // 鍏煎涓嶄娇鐢� new 鐨勬柟寮忥紱
        if (!(this instanceof MTouch)) return new MTouch(el);
        // 寮€鍏筹紱
        // 鍒濆鍖栨椂鍏抽棴锛屽湪璋冪敤 on 鍑芥暟鏃跺搴斿紑鍚紱
        this.use = {
            drag: false,
            pinch: false,
            rotate: false,
            singlePinch: false,
            singleRotate: false
        };
        // 鑾峰彇瀹瑰櫒鍏冪礌锛�
        this.operator = this.el = _.getEl(el);
        // 鐘舵€佽褰曪紱
        this.draging = this.pinching = this.rotating = this.singlePinching = this.singleRotating = false;
        // 鍏ㄥ眬鍙傛暟璁板綍锛�
        this.fingers = 0;
        this.startScale = 1;
        this.startPoint = {};
        this.secondPoint = {};
        this.pinchStartLength = null;
        this.singlePinchStartLength = null;
        this.vector1 = {};
        this.singleBasePoint = {};

        // 鎻掑叆css;
        this._css();
        // 鍒濆鍖栨敞鍐屼簨浠堕槦鍒楋紱
        this._driveBus();
        // 鐩戝惉鍘熺敓 touch 浜嬩欢锛�
        this._bind();
    }

    MTouch.prototype._driveBus = function () {
        var _this = this;

        EVENT.forEach(function (evName) {
            _this[evName] = new HandlerBus(_this.el);
        });
    };

    MTouch.prototype._bind = function () {
        var _this2 = this;

        ORIGINEVENT.forEach(function (evName) {
            var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
            // 闇€瑕佸瓨涓� bind(this) 鍚庣殑鍑芥暟鎸囧悜锛岀敤浜� destroy;
            _this2['_' + fn + '_bind'] = _this2['_' + fn].bind(_this2);
            _this2.el.addEventListener(evName, _this2['_' + fn + '_bind'], false);
        });
    };
    MTouch.prototype.destroy = function () {
        var _this3 = this;

        ORIGINEVENT.forEach(function (evName) {
            var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
            _this3.el.removeEventListener(evName, _this3['_' + fn + '_bind'], false);
        });
    };
    MTouch.prototype._start = function (e) {
        if (!e.touches || e.type !== 'touchstart') return;
        // 璁板綍鎵嬫寚鏁伴噺锛�
        this.fingers = e.touches.length;
        // 璁板綍绗竴瑙︽帶鐐癸紱
        this.startPoint = _.getPoint(e, 0);
        // 璁＄畻鍗曟寚鎿嶄綔鏃剁殑鍩虹鐐癸紱
        this.singleBasePoint = _.getBasePoint(this.operator);
        // 鍙屾寚鎿嶄綔鏃�
        if (this.fingers > 1) {
            // 绗簩瑙︽帶鐐癸紱
            this.secondPoint = _.getPoint(e, 1);
            // 璁＄畻鍙屾寚鍚戦噺锛�
            this.vector1 = _.getVector(this.secondPoint, this.startPoint);
            // 璁＄畻鍚戦噺妯★紱
            this.pinchStartLength = _.getLength(this.vector1);
        } else if (this.use.singlePinch) {
            // 鍗曟寚涓旂洃鍚� singlePinch 鏃讹紝璁＄畻鍚戦噺妯★紱
            var pinchV1 = _.getVector(this.startPoint, this.singleBasePoint);
            this.singlePinchStartLength = _.getLength(pinchV1);
        }
        // 瑙﹀彂 touchstart 浜嬩欢锛�
        this.touchstart.fire({
            origin: e,
            eventType: 'touchstart'
        });
    };
    MTouch.prototype._move = function (ev) {
        if (!ev.touches || ev.type !== 'touchmove') return;
        // 鍒ゆ柇瑙︽帶鐐规槸鍚︿负 singlebutton 鍖哄煙锛�
        var isSingleButton = _.data(ev.target, 'singleButton'),
            curFingers = ev.touches.length,
            curPoint = _.getPoint(ev, 0),
            singlePinchLength = void 0,
            pinchLength = void 0,
            rotateV1 = void 0,
            rotateV2 = void 0,
            pinchV2 = void 0;
        // 褰撲粠鍘熷厛鐨勪袱鎸囧埌涓€鎸囩殑鏃跺€欙紝鍙兘浼氬嚭鐜板熀纭€鎵嬫寚鐨勫彉鍖栵紝瀵艰嚧璺冲姩锛�
        // 鍥犳闇€灞忚斀鎺変竴娆￠敊璇殑touchmove浜嬩欢锛屽緟閲嶆柊璁剧疆鍩虹鎸囧悗锛屽啀缁х画杩涜锛�
        if (curFingers < this.fingers) {
            this.startPoint = curPoint;
            this.fingers = curFingers;
            return;
        }
        // 涓ゆ寚鍏堝悗瑙︽懜鏃讹紝鍙細瑙﹀彂绗竴鎸囦竴娆� touchstart锛岀浜屾寚涓嶄細鍐嶆瑙﹀彂 touchstart锛�
        // 鍥犳浼氬嚭鐜版病鏈夎褰曠浜屾寚鐘舵€侊紝闇€瑕佸湪touchmove涓噸鏂拌幏鍙栧弬鏁帮紱
        if (curFingers > 1 && (!this.secondPoint || !this.vector1 || !this.pinchStartLength)) {
            this.secondPoint = _.getPoint(ev, 1);
            this.vector1 = _.getVector(this.secondPoint, this.startPoint);
            this.pinchStartLength = _.getLength(this.vector1);
        }
        // 鍙屾寚鏃讹紝闇€瑙﹀彂 pinch 鍜� rotate 浜嬩欢锛�
        if (curFingers > 1) {
            var curSecPoint = _.getPoint(ev, 1),
                vector2 = _.getVector(curSecPoint, curPoint);
            // 瑙﹀彂 pinch 浜嬩欢锛�
            if (this.use.pinch) {
                pinchLength = _.getLength(vector2);
                this._eventFire('pinch', {
                    delta: {
                        scale: pinchLength / this.pinchStartLength
                    },
                    origin: ev
                });
                this.pinchStartLength = pinchLength;
            }
            // 瑙﹀彂 rotate 浜嬩欢锛�
            if (this.use.rotate) {
                this._eventFire('rotate', {
                    delta: {
                        rotate: _.getAngle(this.vector1, vector2)
                    },
                    origin: ev
                });
                this.vector1 = vector2;
            }
        } else {
            // 瑙﹀彂 singlePinch 浜嬩欢;
            if (this.use.singlePinch && isSingleButton) {
                pinchV2 = _.getVector(curPoint, this.singleBasePoint);
                singlePinchLength = _.getLength(pinchV2);
                this._eventFire('singlePinch', {
                    delta: {
                        scale: singlePinchLength / this.singlePinchStartLength,
                        deltaX: curPoint.x - this.startPoint.x,
                        deltaY: curPoint.y - this.startPoint.y
                    },
                    origin: ev
                });
                this.singlePinchStartLength = singlePinchLength;
            }
            // 瑙﹀彂 singleRotate 浜嬩欢;
            if (this.use.singleRotate && isSingleButton) {
                rotateV1 = _.getVector(this.startPoint, this.singleBasePoint);
                rotateV2 = _.getVector(curPoint, this.singleBasePoint);
                this._eventFire('singleRotate', {
                    delta: {
                        rotate: _.getAngle(rotateV1, rotateV2)
                    },
                    origin: ev
                });
            }
        }
        // 瑙﹀彂 drag 浜嬩欢锛�
        if (this.use.drag) {
            if (!isSingleButton) {
                this._eventFire('drag', {
                    delta: {
                        deltaX: curPoint.x - this.startPoint.x,
                        deltaY: curPoint.y - this.startPoint.y
                    },
                    origin: ev
                });
            }
        }
        this.startPoint = curPoint;
        // 瑙﹀彂 touchmove 浜嬩欢锛�
        this.touchmove.fire({
            eventType: 'touchmove',
            origin: ev
        });
        ev.preventDefault();
    };
    MTouch.prototype._end = function (ev) {
        var _this4 = this;

        if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel') return;
        // 瑙﹀彂 end 浜嬩欢锛�
    ['pinch', 'drag', 'rotate', 'singleRotate', 'singlePinch'].forEach(function (evName) {
            _this4._eventEnd(evName, {
                origin: ev
            });
        });
        this.touchend.fire({
            eventType: 'touchend',
            origin: ev
        });
    };
    MTouch.prototype._eventFire = function (evName, ev) {
        var ing = evName + 'ing',
            start = evName + 'start';
        if (!this[ing]) {
            ev.eventType = start;
            this[start].fire(ev);
            this[ing] = true;
        } else {
            ev.eventType = evName;
            this[evName].fire(ev);
        }
    };
    MTouch.prototype._eventEnd = function (evName, ev) {
        var ing = evName + 'ing',
            end = void 0;
        if (evName == 'rotate' || evName == 'singleRotate') {
            end = evName + 'nd';
        } else {
            end = evName + 'end';
        }
        if (this[ing]) {
            ev.eventType = end;
            this[end].fire(ev);
            this[ing] = false;
        }
    };
    // 娣诲姞 button 鍖哄煙锛�
    // 鑳屾櫙鏍峰紡鐢变笟鍔℃柟瀹氬埗锛�
    MTouch.prototype._addButton = function (el) {
        var button = _.domify('<div class="mtouch-singleButton" data-singleButton=\'true\'></div>')[0];
        el.appendChild(button);
        el.setAttribute('data-mtouch-addButton', true);
    };
    // 鍒囨崲 operator;
    MTouch.prototype.switch = function (el) {
        var addButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var _el = void 0;
        if (!el) {
            this.operator = this.el;
            return;
        }
        this.operator = _el = _.getEl(el);
        if (!_.data(_el, 'mtouch-addButton') && (this.use.singleRotate || this.use.singlePinch) &&
            addButton) {
            this._addButton(_el);
        }
    };
    MTouch.prototype.on = function (evName) {
        var _this5 = this;

        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var operator = arguments[2];

        if (_.include(evName, ' ')) {
            evName.split(' ').forEach(function (v) {
                _this5._on(v, handler, operator);
            });
        } else {
            this._on(evName, handler, operator);
        }
        return this;
    };
    MTouch.prototype._on = function (evName, handler, operator) {
        this.use[_.getUseName(evName)] = true;
        this[evName].add(handler);
        this.switch(operator);
    };
    MTouch.prototype.off = function (evName, handler) {
        this[evName].del(handler);
    };

    MTouch.prototype._css = function () {
        _.addCssRule('.mtouch-singleButton',
            'position:absolute;right:-15px;bottom: -15px;width:30px;height: 30px;background-size: 100% 100%;background-image:url(' +
            base64 + ');');
    };

    window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    }();

    if (!isMobile()) {
        $('.js-mask').show();
    }

    // drag;
    var dragTrans = {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };
    var $drags = $('.js-drag-el');
    var $drag = $('.b');
    var wrap = document.querySelector('.js-area');
    var wrapRect = wrap.getBoundingClientRect();
    var elRect = $drag[0].getBoundingClientRect();
    var freeze = false;
    var mt = MTouch('.js-area');
    mt.on('drag', function (ev) {
        if (!freeze) {
            dragTrans.x += ev.delta.deltaX;
            dragTrans.y += ev.delta.deltaY;
            set($drag, limit(wrap, $drag[0], dragTrans));
        }
    });

    mt.on('pinch singlePinch', function (ev) {
        if (!freeze) {
            dragTrans.scale *= ev.delta.scale;
            set($drag, dragTrans);
        }
    });
    mt.on('rotate singleRotate', function (ev) {
        if (!freeze) {
            dragTrans.rotate += ev.delta.rotate;
            set($drag, dragTrans);
        }
    });

    mt.switch('.b', true);

    $drags.on('click', function (e) {
        freeze = false;
        $drags.removeClass('active');
        $(this).addClass('active');
        dragTrans = _.getPos(this);
        $drag = $(this);
        mt.switch(this);
        e.stopPropagation();
    });
    $(wrap).on('click', function () {
        $drags.removeClass('active');
        mt.switch(null);
        freeze = true;
    });

    function limit(wrap, el, trans) {
        var bounce = 40;
        var minX = -el.offsetLeft - bounce;
        var maxX = wrapRect.width - el.offsetLeft - elRect.width + bounce;
        var minY = -el.offsetTop - bounce;
        var maxY = wrapRect.height - el.offsetTop - elRect.height + bounce;
        trans.x = trans.x < minX ? minX : trans.x;
        trans.x = trans.x > maxX ? maxX : trans.x;
        trans.y = trans.y < minY ? minY : trans.y;
        trans.y = trans.y > maxY ? maxY : trans.y;
        return trans;
    }

    // pinch;
    var pinchTrans = {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };
    var $pinch = $('.js-pinch-el');
    MTouch('.pinch').on('pinch', function (ev) {
        pinchTrans.scale *= ev.delta.scale;
        set($pinch, pinchTrans);
    });
    //
    // rotate;
    var rotateTrans = {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };
    var $rotate = $('.js-rotate-el');
    MTouch('.rotate').on('rotate', function (ev) {
        rotateTrans.rotate += ev.delta.rotate;
        set($rotate, rotateTrans);
    });

    var singlePinchTrans = {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };
    var $singlePinch = $('.js-singlePinch-el');
    // let $singlePinchWidth = $singlePinch.width();
    // let $singlePinchHeight = $singlePinch.height();
    // let $active = $('.js-singlePinch-el-0');
    MTouch('.singlePinch').on('singlePinch', function (ev) {
        console.log(ev);
        // $singlePinchWidth += ev.delta.deltaX;
        // $singlePinchHeight += ev.delta.deltaY;
        // console.log($singlePinchWidth,$singlePinchHeight);
        singlePinchTrans.scale *= ev.delta.scale;
        set($singlePinch, singlePinchTrans);
        // $singlePinch.css({
        //     width:$singlePinchWidth + 'px',
        //     height:$singlePinchHeight + 'px',
        // });
    }, '.js-singlePinch-el');

    // singleRotate;
    var singleRotateTrans = {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };
    var $singleRotate = $('.js-singleRotate-el');
    MTouch('.singleRotate').on('singleRotate', function (ev) {
        singleRotateTrans.rotate += ev.delta.rotate;
        set($singleRotate, singleRotateTrans);
    }, '.js-singleRotate-el');

    function set($el, transform) {
        window.requestAnimFrame(function () {
            $el.css('transform', 'translate3d(' + transform.x + 'px,' + transform.y +
                'px,0px) rotate(' + transform.rotate + 'deg) scale(' + transform.scale + ')');
        });
    }

    function isMobile() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent
            .match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }

})));
//# sourceMappingURL=example.js.map