setTimeout(function () {
    //获取url-id方法：
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)return unescape(r[2]);
        return null;
    }

    var $body = $('body');
    var $navUl = $body.find('#header .nav ul');
    var $box = $body.find('#content #box');
    var $nav = $body.find('#header .nav');
// 导航：
    nav($navUl)
    function nav($navUl) {
        $.ajax({
            type: "post",
            url: exportPath + "/portClassify/ClassifyList",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            success: function (data) {
                var navInfo = ""
                var numId = ""
                $.each(data, function (i, v) {
                    if (v.ListClassifySon.length !== 0) {
                        numId = v.ListClassifySon[0].ClassifyId
                    } else {
                        numId = v.ClassifyId
                    }
                    navInfo += '<li> <a href="' + v.LinkUrl + ".html?data-id=" + numId + "&parentId=" + v.ClassifyId + "&index=" + 0 + '">' + v.ClassifyName + '</a> <ul>'
                    $.each(v.ListClassifySon, function (m, n) {
                        navInfo += '<li><a href="' + v.LinkUrl + ".html?data-id=" + n.ClassifyId + "&parentId=" + n.ClassifyParent + "&index=" + m + '">' + n.ClassifyName + '</a></li>'
                    })
                    navInfo += '</ul></li>'
                })
                $(navInfo).appendTo($navUl)
                // 导航动画：
                $nav.find('ul li').hover(function () {
                    $(this).children('ul').addClass('show')
                }, function () {
                    $(this).children('ul').removeClass('show')
                });
            }
        });
    }

// head动画：
    $(window).scroll(function (e) {
        var code = parseInt($(document).scrollTop());
        if (code >= 111) {
            $nav.addClass('fix');
        } else {
            $nav.removeClass('fix');
        }
    });

// 设置内容块的最小高度：
    MinHeight();
    function MinHeight() {
        var h = $(window).height();
        var a = 180;
        var b = 200;
        $('#content').css('min-height', h - (a + b));
    };
    // 二维码：
    erWei();
    function erWei() {
        var $erWeiBox = $body.find('#footer .fR');
        $.ajax({
            type: "post",
            url: exportPath + "/portRQCode/",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            success: function (data) {
                $('<div class="wxOne"> <img src="' + exportPath + data.RQCodeLeft + '" alt=""> <span>' + data.RQCodeNameLeft + '</span> </div> <div class="wxTwo"> <img src="' + exportPath + data.RQCodeRight + '" alt=""> <span>' + data.RQCodeNameRight + '</span> </div>').appendTo($erWeiBox);
            }
        });
    }


    var dataId = GetQueryString('artId');
    artList(dataId, 1, 100)
    function artList(dataId, Page, Size) {
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticleInfo",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ArticleId: dataId, PageNow: Page, PageSize: Size},
            success: function (data) {
                var articleInfo = data.ArticleDetail;
                articleInfo = articleInfo.replace('src="/', 'src="http://ms.breaksport.cn/');
                $box.html(articleInfo);
            }
        })
    }
}, 500);