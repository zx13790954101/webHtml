	var active = {
				init: function() {
					document.onreadystatechange = () => {
						const _readyState = document.readyState
						if(_readyState === 'complete' || _readyState === 'loaded') {
							$(".mask-box").hide();
							$(".loader").hide();
						}
					}
				},

			}
			active.init();

			scaleW = window.innerWidth / 320;
			scaleH = window.innerHeight / 480;
			var resizes = document.querySelectorAll('.resize');
			for(var j = 0; j < resizes.length; j++) {
				resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
				resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
				resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
				resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
			}

			var mySwiper = new Swiper('.mainSwiper', {
				direction: 'vertical',
				pagination: '.mainSwiper .swiper-pagination',
				//virtualTranslate : true,
				mousewheelControl: true,
				onInit: function(swiper) {
					swiperAnimateCache(swiper);
					swiperAnimate(swiper);
				},
				onSlideChangeEnd: function(swiper) {
					swiperAnimate(swiper);
				},
				onTransitionEnd: function(swiper) {
					swiperAnimate(swiper);
				},

				watchSlidesProgress: true,

				onProgress: function(swiper) {
					for(var i = 0; i < swiper.slides.length; i++) {
						var slide = swiper.slides[i];
						var progress = slide.progress;
						//	var translate = progress * swiper.height / 4;
						scale = 1 - Math.min(Math.abs(progress * 0.5), 1);
						var opacity = 1 - Math.min(Math.abs(progress / 2), 0.5);
						slide.style.opacity = opacity;
						es = slide.style;
						//es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + translate + 'px,-' + translate + 'px) scaleY(' + scale + ')';

					}
				},

				onSetTransition: function(swiper, speed) {
					for(var i = 0; i < swiper.slides.length; i++) {
						es = swiper.slides[i].style;
						es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';

					}
				},

			})
			setTimeout(function() {
				var headSwiper = new Swiper('.head-swiper', {
					slidesPerView: 1,
					//  slidesPerColumn: 2, //显示两行
					// spaceBetween: 20,
					//			      slidesPerGroup: 5,
					//			      loop: true,
					//			      loopFillGroupWithBlank: true,
					pagination: '.head-swiper .swiper-pagination',
					simulateTouch: true, //禁止鼠标模拟
					navigation: {
						nextEl: '.head-swiper .swiper-button-next',
						prevEl: '.head-swiper .swiper-button-prev',
					},
				});
				var caseSwiper = new Swiper('.caseSwiper', {
					slidesPerView: 3,
					slidesPerColumn: 1,
					spaceBetween: 30,
					pagination: {
						el: '.caseSwiper .swiper-pagination',
						clickable: true,
					},
				});
				var aboutSwiper = new Swiper('.about-swiper', {
					slidesPerView: 1,
					//  slidesPerColumn: 2, //显示两行
					// spaceBetween: 20,
					//			      slidesPerGroup: 5,
					//			      loop: true,
					//			      loopFillGroupWithBlank: true,
					pagination: '.about-swiper .swiper-pagination',
					simulateTouch: true, //禁止鼠标模拟
					navigation: {
						nextEl: '.about-swiper .swiper-button-next',
						prevEl: '.about-swiper .swiper-button-prev',
					},
				});
			}, 100);