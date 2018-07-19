(function($){

	$.fn.tsSlide = function(settings){

		var defaults = {
			width      : 960,
			height     : 400,
			position   : 1,
			interval   : 5000,
			duration   : 500,
			animation  : true,
			paginator  : true,
			navigator  : true,
			progress   : true,
			skin       : 'tsSlide',
			percentage : 0
		};

		var options = $.extend({}, defaults, settings);

		this.each(function(){

			var slider = $(this),
				sliderLi = slider.find('li');
			// sliderLi.length == 0 && console.error('error: empty slider!');

			var wrapper = slider
					.wrap('<div class="' + options.skin + '"/>')
					.parent()
					.css({
						'width': options.width,
						'background-size': '100% 100%'
					}),
				startPosition = options.position;

			if(options.position == 0 || options.position > sliderLi.length){
				// console.error('error: start position value must be between 1 and ' + sliderLi.length + '!');
				startPosition = 1;
			}
			
			slider
				.on('mouseenter', function(){
					$(this).addClass('hover');
					hoverControl();
				})
				.on('mouseleave', function(){
					$(this).removeClass('hover');
					hoverControl();
				})
				.css('height', options.height);
			
			sliderLi
				.css('width', options.width)
				.filter(':nth-child(' + startPosition + ')')
				.addClass('current');

			//Controls (navigation, pagination and progress bar)
			var position, paginator, paginatorLi, progress, progressWidth, progressElapsed, interact = false, sliderHeight;

			if((options.navigator || options.paginator) && sliderLi.length > 1){
				

				if(options.paginator){
					paginator = wrapper
						.append('<ul class="paginator"/>')
						.find('.paginator')
						.hide();

					sliderLi.each(function(){
						paginator.append('<li>&nbsp;</li>');
					});

					paginatorLi = paginator
						.find('li')
						.on('click', function(){
							if(interact){
								position = $(this).index();
								// console.log('position='+position+'   index='+index);
								if((index - 1) != position){
									sliderLi
										.removeClass('current')
										.filter(':nth-child(' + ++position + ')')
										.addClass('current');
									play();
								}
							}
						})
				}
				if(options.navigator){
					wrapper
						.append('<div class="navigator prev"><span /></div><div class="navigator next"><span /></div>')
						.find('.navigator')
						.hide()
						.on('click', function(){
							var btn = $(this);
							btn.hasClass('next') && interact && next();
							btn.hasClass('prev') && interact && prev();
						});
				}
			}

			progress = wrapper
				.prepend('<div class="progress"/>')
				.find('.progress').width(0);

			!options.progress && progress.height(0);

			//Functions (init, play, next, prev, pause, resume)
			var timeLeft = options.interval, current, index, paused;

			function init(){				
				progressResize();
				sliderLi.length > 1 ? play() : sliderLi.fadeIn(options.duration);
			}

			function play(){
				progressReset();
				interact = false;
				current = sliderLi
					.filter('.current')
					.siblings()
					.fadeOut(options.animation && options.duration || 0)
					.end()
					.fadeIn(options.animation && options.duration || 0, function(){
						interval();
					});

				$('.navigator')
					.add('.paginator')
					.fadeIn(options.animation && options.duration || 0);

				index = sliderLi.index(current) + 1;
				
				if(options.paginator){
					paginatorLi
						.removeClass('current')
						.filter(':nth-child(' + index + ')')
						.addClass('current');
				}
			}

			function next(){
				sliderLi.removeClass('current');
				if(++index <= sliderLi.length){
					current
						.next()
						.addClass('current')
				} else {
					sliderLi
						.filter(':first-child')
						.addClass('current');
				}
				play();
			}

			function prev(){
				sliderLi.removeClass('current');
				if(--index >= 1){
					current
						.prev()
						.addClass('current')
				} else {
					sliderLi
						.filter(':last-child')
						.addClass('current');
				}
				play();
			}

			function pause(){
				paused = true;
				progressElapsed = progress
					.stop()
					.width();
				timeLeft = (progressWidth - progressElapsed) * (options.interval / progressWidth);
			}

			function interval(){
				paused = false;
				interact = true;
				progress
					.stop()
					.show()
					.animate({
						width: '+=' + (progressWidth - progressElapsed)
					}, timeLeft, 'linear', function(){
						progressReset();
						next();
					});
				hoverControl();
			}

			function progressReset(){
				progress.stop().width(0);				
				progressElapsed = 0;
				timeLeft = options.interval;
			}

			function progressResize(){
				$(window)
					.resize(function(){
						// console.log('触发');
						// console.log(window.innerWidth);
						progressWidth = slider.width();
						
						if(window.innerWidth <= 782 ){
							options.percentage = 64 / 77;
						}else{
							options.percentage = 144 / 55;
						}
						//setHeight
						setHeight(options.percentage);
						pause(); interval();
					}).resize();
			}

			function setHeight(percentage){
				if(percentage !== 0){
					sliderHeight = slider.width() / percentage;
					// console.log(slider);
					slider.height(sliderHeight);
				}
			}
			function hoverControl(){
				if(interact){
					// console.log(slider);
					if(slider.hasClass('hover')){
						pause();
                        // console.log('pause');

					} else if(paused){
						interval();
                        // console.log('pause-over');

					}
				}
			}

			
			init();

		});
	}
})(jQuery);