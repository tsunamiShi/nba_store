(function ($) {

    $.fn.mySlide = function (settings) {
        var defaults = {
            num: [5],
            widthSwitch: [],
            interval: 300
        }
        // console.log(Math.floor(-0.21))

        var options = $.extend({}, defaults, settings);

        //简单判断一下，完整的是还需要数组内数字从大到小排列。
        // 两种办法，报错，让用户修改参数，或者我给他排好。我这边默认它从大到小写了。
        // (options.num.length - 1) === options.widthSwitch.length ? true : console.error("你输入的初始化数据有问题")

        this.each(function () {
            var $slideWrap = $('.my-slide-wrap'),
                $slide = $('.my-slide'),
                $slideUl = $('.slide-ul'),
                $slideWidth = $slide.width(),   //轮播图展示出来的宽度
                $slideLi = $slide.find('li'),   //总的li
                $slideNum = $slideLi.length,    //li总个数
                $slideLiWidth,  //li的宽度
                $windowWidth,   //当前窗口的宽度
                $liShowNum,     //展示的li的个数         
                lock = true,
                index = 1;

            function getWindowWidth() {
                return $(window).width();
            }

            var $prev = $slideWrap.find('.prev'),
                $next = $slideWrap.find('.next');


            // 点击 -> 检查状态(跳跃index) -> index增减
            $prev.on('click', prev)
            function prev() {
                // var left = -$slideLiWidth * ($slideNum / 2);

                // if ($slideUl.position().left === 0) {
                //     $slideUl.css({
                //         'left': left
                //     })

                //     index = $slideNum / 2 + 1;
                // }
                // console.log(index)

                if (index === 1) {
                    // console.log('prev-side');
                    index = $slideNum / 2 + 1;
                    $slideUl.css({
                        'left': -(index - 1) * $slideLiWidth
                    })
                }
                move('prev');
                console.log(index);
            }
            $next.on('click', next)

            function next() {
                // var left = -$slideLiWidth * ($slideNum - $liShowNum);
                // var positionLeft = $slideUl.position().left;
                // if (positionLeft === left) {
                //     left = -$slideLiWidth * ($slideNum / 2 - $liShowNum);
                //     $slideUl.css({
                //         'left': left
                //     })
                //     index = $slideNum / 2;
                // }
                // console.log(index)
                if (index === ($slideNum - $liShowNum + 1)) {
                    // console.log('next-side')
                    index = $slideNum / 2 - $liShowNum + 1;
                    $slideUl.css({
                        'left': -(index - 1) * $slideLiWidth
                    })
                }
                move('next');
                console.log(index);

            }

            function move(direction) {
                if (lock) {
                    interval(direction);
                }
            }

            function interval(sign) {
                lock = false;
                if (sign == 'prev') {
                    sign = '+';
                    index--;
                } else if (sign === 'next') {
                    sign = '-';
                    index++;
                };
                $('.prev').off('click');
                $('.next').off('click');
                $slideUl
                    .stop()
                    .show()
                    .animate({
                        left: sign + '=' + $slideLiWidth
                    }, 300, 'linear', function () {
                        lock = true;
                        $('.prev').on('click', prev);
                        $('.next').on('click', next);
                    })
            }

            windowResize();

            function windowResize() {
                $(window)
                    .resize(function () {

                        // console.log(index);
                        $windowWidth = getWindowWidth();
                        var arr = options.widthSwitch,
                            len = arr.length,
                            cnt = 0;
                        for (var i = 0; i < len; i++) {
                            if ($windowWidth > arr[i]) {
                                break;
                            }
                            cnt++;
                        }
                        $liShowNum = options.num[cnt];

                        if (index + $liShowNum >= $slideNum) {
                            index = index - $slideNum / 2;
                        }


                        setWidth($liShowNum);
                        setSlideHeight();
                        $slideUl
                            .stop()
                            .css({
                                'left': -(index - 1) * $slideLiWidth
                            }, 100, 'linear', function () {
                                // console.log($slideUl.position().left)
                                // console.log('over');
                            })
                    }).resize();
            }

            function setWidth(num) {
                $slideWidth = Math.floor($slide.width());
                $slideLiWidth = Math.floor($slideWidth / num);
                $slideLi.width($slideLiWidth);
                $slideUl.width($slideLiWidth * $slideNum);
            }

            function setSlideHeight() {
                var height = $slideLi.height();
                $slide.height(height);
                $('.slide-turn-btn').height(height);
            }
        })

    }

})(jQuery)
