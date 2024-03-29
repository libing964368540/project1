    jQuery.opcatyBanner = function ($banner, $blImg, $nextBtn, $prevBtn, $tip) {
        var index = 0;
        var $blImgLength = $blImg.size();
        $blImg.eq(0).addClass('active');
        $.each($blImg, function (i, v) {
            $('<a href="javascript:;"></a>').appendTo($tip)
        });
        $tip.find('a').eq(0).addClass('active')
        $nextBtn.on("click", function () {
            index++;
            if (index > $blImgLength - 1) {
                index = 0;
            }
            changeImg(index);
        });//下一张
        $prevBtn.on("click", function () {
            index--;
            if (index < 0) {
                index = $blImgLength - 1;
            }
            changeImg(index);
        });//上一张
        $tip.on('click', 'a', function () {
            index = $(this).index();
            changeImg(index);
        })

        var changeImg = function (index) {
            $blImg.eq(index).stop(false).addClass('active').siblings().removeClass('active');
            $tip.find('a').eq(index).stop(false).addClass('active').siblings().removeClass('active');
        };

        $banner.on("mouseover mouseout", function (event) {
            if (event.type === "mouseover") {
                clearInterval(time)
            } else if (event.type === "mouseout") {
                time = setInterval(function () {
                    $nextBtn.trigger('click')
                }, 5000);//自动切换
            }
        });

        var time = setInterval(function () {
            $nextBtn.trigger('click')
        }, 5000);//自动切换
    }
