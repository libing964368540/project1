setTimeout(function () {
    var $body = $("body");
    var $navUl = $body.find("#header .nav ul");
    var $nav = $body.find("#header .nav");
    var $banner = $body.find("#content .banner");
    var $bannerList = $banner.find(".bannerList");
    var $nextBtn = $("#next-img");
    var $prevBtn = $("#prev-img");
    var $tip = $banner.find(".tip");
    var $listBox = $body.find("#content .model .mList .listBox");
    var $mRight = $body.find("#content .model .mOne .mRight .mRightList");
    var $rightH3 = $body.find("#content .model .mOne .mRight>h3>span:first");
    var $videoBox = $body.find("#content .model .videoList .listBox");
    nav($navUl);
    function nav($navUl) {
        $.ajax({
            type: "post",
            url: exportPath + "/portClassify/ClassifyList",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            success: function (data) {
                var navInfo = "";
                var numId = "";
                $.each(data, function (i, v) {
                    if (v.ListClassifySon.length !== 0) {
                        numId = v.ListClassifySon[0].ClassifyId
                    } else {
                        numId = v.ClassifyId
                    }
                    navInfo += '<li> <a href="' + v.LinkUrl + ".html?data-id=" + numId + "&parentId=" + v.ClassifyId + "&index=" + 0 + '">' + v.ClassifyName + "</a> <ul>";
                    $.each(v.ListClassifySon, function (m, n) {
                        navInfo += '<li><a href="' + v.LinkUrl + ".html?data-id=" + n.ClassifyId + "&parentId=" + n.ClassifyParent + "&index=" + m + '">' + n.ClassifyName + "</a></li>"
                    });
                    navInfo += "</ul></li>"
                });
                $(navInfo).appendTo($navUl);
                $nav.find("ul li").hover(function () {
                    $(this).children("ul").addClass("show")
                }, function () {
                    $(this).children("ul").removeClass("show")
                })
            }
        })
    }

    $(window).scroll(function (e) {
        var code = parseInt($(document).scrollTop());
        if (code >= 111) {
            $nav.addClass("fix")
        } else {
            $nav.removeClass("fix")
        }
    });
    MinHeight();
    function MinHeight() {
        var h = $(window).height();
        var a = 180;
        var b = 200;
        $("#content").css("min-height", h - (a + b))
    }

    erWei();
    function erWei() {
        var $erWeiBox = $body.find("#footer .fR");
        $.ajax({
            type: "post",
            url: exportPath + "/portRQCode/",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            success: function (data) {
                $('<div class="wxOne"> <img src="' + exportPath + data.RQCodeLeft + '" alt=""> <span>' + data.RQCodeNameLeft + '</span> </div> <div class="wxTwo"> <img src="' + exportPath + data.RQCodeRight + '" alt=""> <span>' + data.RQCodeNameRight + "</span> </div>").appendTo($erWeiBox)
            }
        })
    }
    notice();
    function notice() {
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticlePageList",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ClassifyId: 10, PageNow: "", PageSize: "100"},
            success: function (data) {
                data = $.parseJSON(data.DataList);
                $.each(data, function (i, v) {
                    $('<a href="showPage.html?artId=' + v.ArticleId + '"> <div class="notice"> <span class="now"> 最新公告</span> <span class="record">' + v.ArticleTitle + '</span><span class="timeDate">' + ChangeDateTime(v.ArticleTime, 3) + '</span> </div> <div class="mask"></div><img src="' + exportPath + v.ArticlePic + '" alt=""> </a>').appendTo($bannerList)
                });
                setTimeout(function () {
                    var $blImg = $("#content .banner .bannerList a");
                    var h = $blImg.height();
                    $bannerList.height(h);
                    $.opcatyBanner($bannerList, $blImg, $nextBtn, $prevBtn, $tip)
                }, 2000)
            }
        })
    }
    sLan();
    function sLan() {
        $.ajax({
            type: "post",
            url: exportPath + "/portClassify/ClassifyIsHome",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            success: function (data) {
                var sInfo = "";
                $.each(data, function (i, v) {
                    $.ajax({
                        type: "post",
                        url: exportPath + "/portArticle/ArticleInHome",
                        jsonp: "jsonpcallback",
                        dataType: "jsonp",
                        data: {ClassifyId: v.ClassifyId, PageSize: 6},
                        success: function (data) {
                            sInfo += '<div class="list"> <h3><span>' + v.ClassifyName + '</span><span><a href="' + v.LinkUrl + ".html?data-id=" + v.ClassifyId + "&parentId=" + v.ClassifyId + "&index=" + 0 + '"> </a></span></h3> <div class="listCon">';
                            $.each(data, function (m, n) {
                                (function (n) {
                                    sInfo += '<a href="javascript:;" data-id="' + n.ArticleId + '"> <span class="title" title="' + n.ArticleDiscription + '"> <span class="file">' + n.ArticleTitle + '</span> </span> <span class="user">' + n.ArticleAuthor + '</span> <span class="date">' + ChangeDateTime(n.ArticleTime, 2) + "</span> </a>"
                                })(n)
                            });
                            sInfo += "</div> </div>"
                        }
                    })
                });
                setTimeout(function () {
                    $(sInfo).appendTo($listBox)
                }, 2500)
            }
        })
    }
    teacher();
    function teacher() {
        $rightH3.text("教师竞赛");
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticleInHome",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ClassifyId: 2, PageSize: 6},
            success: function (data) {
                $.each(data, function (i, v) {
                    $('<a href="javascript:;" data-id="' + v.ArticleId + '"> <span class="title" title="' + v.ArticleDiscription + '"> <span class="file">' + v.ArticleTitle + '</span> </span> <span class="user">' + v.ArticleAuthor + '</span> <span class="date">' + ChangeDateTime(v.ArticleTime, 2) + "</span> </a>").appendTo($mRight)
                })
            }
        })
    }
    videoDate();
    function videoDate() {
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticleInHome",
            jsonp: "jsonpcallback",
            data: {ClassifyId: 13, PageSize: 4},
            dataType: "jsonp",
            success: function (data) {
                $.each(data, function (i, v) {
                    $('<div class="vb"><a href="showPage.html?artId=' + v.ClassifyId + "&articleId=" + v.ArticleId + '"><video id="my-video"  poster="" style=" width:279px;height: 238px; display: block; "> <source src="' + exportPath + v.FileSaveName + '" type="video/mp4" /></video></a> <p>' + v.ArticleTitle + "</p> <p><span>" + v.ArticleAuthor + "</span><span>" + ChangeDateTime(v.ArticleTime, 2) + "</span></p></div>").appendTo($videoBox)
                })
            }
        })
    }
    $body.on("click", "#content .model .mOne .mRight .mRightList a", function () {
        var artId = $(this).attr("data-id");
        top.window.location = "showPage.html?artId=" + artId
    });
    $body.on("click", "#content .model .mList .listBox .list .listCon a", function () {
        var artId = $(this).attr("data-id");
        top.window.location = "showPage.html?artId=" + artId
    });
    $body.on("click", "#content .model .mOne .mRight h3 span:last", function () {
        var id = $(this).attr("data-id");
        top.window.location = "teacher_race.html?data-id=" + id + "&parentId=" + id + "&index=" + 0
    })
}, 600);