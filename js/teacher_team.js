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
    var parentId = GetQueryString('parentId');
    var $sideBar = $body.find("#content .noticeList .notice_bar .slider");
    var index = GetQueryString('index');
    var dataId = GetQueryString('data-id');
    var $turnPage = $body.find('#content .noticeList .notice_con');
    var $noticeCon = $body.find('#content .noticeList .notice_con .notice_tip');
    dataId = 4;
    index = 0;
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


    // 侧边栏菜单：
    Bar(parentId, $sideBar, index)
    function Bar(parentId, $sideBar, index) {
        $.ajax({
            type: "post",
            url: exportPath + "/portClassify/ClassifyListSon",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ClassifyId: parentId},
            success: function (data) {
                $('<li data-id="' + 4 + '" data-name="教师团队"><a href="javascript:;">教师团队</a></li>').appendTo($sideBar)
                $.each(data.ListClassifySon, function (i, v) {
                    $('<li data-id="' + v.ClassifyId + '" data-name="' + v.ClassifyName + '"><a href="javascript:;">' + v.ClassifyName + '</a></li>').appendTo($sideBar)
                })
                var $Bar = $sideBar.find('li').eq(index);
                var $barTitle = $sideBar.find('.slider_title');
                var $noticeConTitle = $body.find('#content .noticeList .notice_con .notice_con_title>span');
                var $crumbs = $body.find('#content .crumbs>span');
                $Bar.addClass('active')
                $barTitle.text(data.ClassifyName)
                $noticeConTitle.text($Bar.text())
                $crumbs.text(data.ClassifyName)
            }
        });
    }

    //侧边栏点击：
    $body.on('click', '#content .notice_bar .slider li', function () {
        var $noticeConTitle = $body.find('#content .noticeList .notice_con .notice_con_title>span');
        dataId = $(this).attr('data-id');
        var dataName = $(this).attr('data-name');
        $(this).addClass('active').siblings('li').removeClass('active');
        $noticeConTitle.text(dataName)
        conList(dataId, 1, 12)
    })

    conList(dataId, 1, 12);
    function conList(dataId, Page, Size) {
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticlePageList",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ClassifyId: dataId, PageNow: Page, PageSize: Size},
            success: function (data) {
                if (dataId == 4) {
                    $noticeCon.children().remove();
                    $turnPage.children('#pages').remove();
                    if (data.DataCount === 0) {
                        $('<span>暂无数据</span>').appendTo($noticeCon);
                    } else if (data.DataCount > 10) {
                        var dataList = $.parseJSON(data.DataList)
                        $.each(dataList, function (i, v) {
                            $('<div class="teacher_List" data-id="' + v.ArticleId + '"> <div class="teacher_info"> <div class="teacherPhoto"> <img src="' + exportPath + v.ArticlePic + '" alt=""> </div> <div class="teacherName">' + v.ArticleTitle + '</div> </div> </div>').appendTo($noticeCon);
                        })
                        //初始化分页
                        var num = Math.ceil(data.DataCount / 10);
                        page(num, $turnPage)

                    } else {
                        var dataList = $.parseJSON(data.DataList)
                        $.each(dataList, function (i, v) {
                            $('<div class="teacher_List" data-id="' + v.ArticleId + '"> <div class="teacher_info"> <div class="teacherPhoto"> <img src="' + exportPath + v.ArticlePic + '" alt=""> </div> <div class="teacherName">' + v.ArticleTitle + '</div> </div> </div>').appendTo($noticeCon);
                        })
                    }
                } else {
                    $noticeCon.children().remove();
                    $turnPage.children('#pages').remove();
                    if (data.DataCount === 0) {
                        $('<span>暂无数据</span>').appendTo($noticeCon);
                    } else if (data.DataCount > 10) {
                        var dataList = $.parseJSON(data.DataList)
                        $.each(dataList, function (i, v) {
                            $('<a href="javascript:;" data-id="' + v.ArticleId + '"> <span class="title" title="' + v.ArticleTitle + '"> <span class="file">' + v.ArticleTitle + '</span> </span> <span class="user">' + v.ArticleAuthor + '</span> <span class="date">' + ChangeDateTime(v.ArticleTime, 2) + '</span> </a>').appendTo($noticeCon);
                        })
                        //初始化分页
                        var num = Math.ceil(data.DataCount / 10);
                        page(num, $turnPage)

                    } else {
                        var dataList = $.parseJSON(data.DataList)
                        $.each(dataList, function (i, v) {
                            $('<a href="javascript:;" data-id="' + v.ArticleId + '"> <span class="title" title="' + v.ArticleTitle + '"> <span class="file">' + v.ArticleTitle + '</span> </span> <span class="user">' + v.ArticleAuthor + '</span> <span class="date">' + ChangeDateTime(v.ArticleTime, 2) + '</span> </a>').appendTo($noticeCon);
                        })
                    }
                }
            }
        })
    }

    // 初始化分页事件
    function pageConList(dataId, Page, Size) {
        $.ajax({
            type: "post",
            url: exportPath + "/portArticle/ArticlePageList",
            jsonp: "jsonpcallback",
            dataType: "jsonp",
            data: {ClassifyId: dataId, PageNow: Page, PageSize: Size},
            success: function (data) {
                if (dataId == 4) {
                    $noticeCon.children().remove();
                    var dataList = $.parseJSON(data.DataList)
                    $.each(dataList, function (i, v) {
                        $('<div class="teacher_List" data-id="' + v.ArticleId + '"> <div class="teacher_info"> <div class="teacherPhoto"> <img src="' + exportPath + v.ArticlePic + '" alt=""> </div> <div class="teacherName">' + v.ArticleTitle + '</div> </div> </div>').appendTo($noticeCon);
                    })
                } else {
                    $noticeCon.children().remove();
                    var dataList = $.parseJSON(data.DataList)
                    $.each(dataList, function (i, v) {
                        $('<a href="javascript:;" data-id="' + v.ArticleId + '"> <span class="title" title="' + v.ArticleTitle + '"> <span class="file">' + v.ArticleTitle + '</span> </span> <span class="user">' + v.ArticleAuthor + '</span> <span class="date">' + ChangeDateTime(v.ArticleTime, 2) + '</span> </a>').appendTo($noticeCon);
                    })
                }
            }
        });
    }


    function page(num, pageBox) {
        var pageInfo = '<div id="pages"> <div id="Pagination"></div> <div class="searchPage"> <span class="page-sum">共<strong class="allPage">' + num + '</strong>页</span>  </div> </div>';
        $(pageInfo).appendTo(pageBox);
        $body.find("#pages #Pagination").pagination(num, {
                load_first_page: false,
                callback: function (current_page) {
                    pageConList(dataId, current_page + 1, 12)
                }
            }
        )
    }

    // 资源列表点击：
    $body.on('click', '#content .noticeList .notice_con .notice_tip a', function () {
        var artId = $(this).attr('data-id');
        top.window.location = "showPage.html?artId=" + artId;
    })

    $body.on('click', '#content .noticeList .notice_con .notice_tip .teacher_List', function () {
        var artId = $(this).attr('data-id');
        top.window.location = "teacher_list.html?artId=" + artId;
    })

}, 500)
