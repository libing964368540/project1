window.onload = function () {
    var exportPath = 'http://ms.breaksport.cn';// http://ms.itzx.cn:1002/
    var $body = $('body');
    setTimeout(function () {
        // 导航：
        var $navUl = $body.find('#header .nav ul');
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
                        if (v.ListClassifySon.length !== 0){
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
                }
            });
        }
    }, 700);
//获取url-id方法：
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)return unescape(r[2]);
        return null;
    }

    var artId = GetQueryString('artId');

// 设置内容块的最小高度：
    var MinHeight = function () {
        var h = $(window).height();
        var a = 180;
        var b = $('#footer').height();
        $('#content').css('min-height', h - (a + b));
    };
    MinHeight();
    // head动画：
    setTimeout(function () {
        var $nav = $body.find('#header .nav');
        $(window).scroll(function (e) {
            var code = parseInt($(document).scrollTop());
            if (code >= 111) {
                $nav.addClass('fix');
            } else {
                $nav.removeClass('fix');
            }
        });
        // 导航动画：
        $nav.find('ul li').hover(function () {
            $(this).children('ul').addClass('show');
        }, function () {
            $(this).children('ul').removeClass('show');
        });
    }, 900);
    // 产生随机数：
    function radom(size) {
        //x上限，y下限
        var x = 9;
        var y = 0;
        var rand = "";
        for (var i = 1; i <= size; i++) {
            rand += parseInt(Math.random() * (x - y + 1) + y);
        }
        return rand
    }

    // 获取日期方法：
    var date = new Date();
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year + "年" + month + "月" + day + "日"].join();
    }
    date = formatDate(date);

    // 处理时间戳的方法：
    var ChangeDateTime = function (cellval, flag) {
        if (cellval != null) {
            var date = new Date(parseInt(cellval.replace("/Date(", "").replace("/date(", "").replace(")/", ""), 10));
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            if (flag == 1)
                return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + minute + ":" + second;
            else if (flag == 2)
                return date.getFullYear() + "-" + month + "-" + currentDate;
            else if (flag == 3)
                return date;
        }
        else return "";
    };
    //头
    new Vue({
        el: "#header",
        data: {
            header: ""
        },
        methods: {
            get: function () {
                this.$http.get('header.html').then(function (data) {
                    this.header = data.data
                })
            }
        },
        mounted: function () {
            this.get()
        }
    });
    var vm = new Vue({
        el: "#content",
        data: {
            clText: "",
            remove:true,
            reachTexts: "",
            comDataNum: "",
            replayText: "",
            setWidth:{
                width:885+'px'
            },
            imgPath:"./img/tou.jpg",
            comText: "",
            downUrl: '',
            erJi: '',
            pageNum: "",
            comData: []
        },
        computed: {
            comNum: function () {
                if (this.comText.length >= 140) {
                    this.comText = this.comText.substr(0, 140);
                    return 0
                } else {
                    return 140 - this.comText.length
                }
            }
        },
        methods: {
            isShowParent: function (item) {
                item.isShowP = !item.isShowP
                this.replayText = "";
            },
            goBack: function () {
                window.history.go(-1);
            },
            page: function (num) {
                $body.find("#pages #Pagination").pagination(num, {
                    load_first_page: false,
                    callback: function (current_page) {
                        vm.comData = [];
                        vm.pageShowCom(artId, current_page + 1, 10)
                    }
                })
            },//分页方法
            reachText: function () {
                if (artId == 13) {
                    artId = GetQueryString('articleId');
                    this.$http({
                        url: exportPath + "/portArticle/ArticleInfo",
                        method: "jsonp",
                        data: {ArticleId: artId},
                        jsonp: "jsonpcallback"
                    }).then(function (mes) {
                        this.clText = mes.data.FileName;
                        this.erJi = mes.data.ClassifyName + " >"
                        this.downUrl = exportPath + mes.data.FileSaveName;
                        this.reachTexts = '<video id="my-video" controls  poster="" style="    width:500px;height: 328px;margin: 30px auto;display: block; "> <source src="' + this.downUrl + '" type="video/mp4" />  抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以 <a href="' + this.downUrl + '">下载</a>并用你喜欢的播放器观看!</video>'
                    })
                } else {
                    this.$http({
                        url: exportPath + "/portArticle/ArticleInfo",
                        method: "jsonp",
                        data: {ArticleId: artId},
                        jsonp: "jsonpcallback"
                    }).then(function (mes) {
                        if (mes.data.FileSaveName == null) {
                            this.downUrl = ""
                            $body.find('#content .notice_list .sidebarR .model>ul').html("");
                        } else {
                            this.downUrl = mes.data.FileSaveName;
                        }
                        this.clText = mes.data.FileName;
                        if (mes.data.ClassifyId === 10) {
                            this.reachTexts = mes.data.ArticleDiscription;
                            this.erJi = mes.data.ClassifyName + " >"
                            this.remove=false
                            this.setWidth.width=1200+'px'
                        } else {
                            this.reachTexts = mes.data.ArticleDetail;
                            this.$http({
                                url: exportPath + "/portClassify/ClassifyListSon",
                                data: {ClassifyId: mes.data.ParentClassify},
                                method: "jsonp",
                                jsonp: "jsonpcallback"
                            }).then(function (parentDate) {
                                this.erJi = parentDate.data.ClassifyName + " >"
                            })
                        }
                    })
                }
            },//富文本请求  以及面包屑处理
            showCom: function (artId, PageNow, PageSize) {
                this.$http({
                    url: exportPath + "/portComment/CommentPageList",
                    method: "jsonp",
                    data: {ArtileId: artId, PageNow: PageNow, PageSize: PageSize},
                    jsonp: "jsonpcallback"
                }).then(function (mes) {
                    var data = $.parseJSON(mes.data.DataList);
                    vm.comDataNum = mes.data.DataCount;

                    if (mes.data.DataCount > 10) {
                        $.each(data, function (j, v) {
                            if (v.CommentUser.indexOf('游客')!==0) {
                                vm.imgPath="./img/guanli.jpg"
                            }
                            vm.comData.push({
                                isShowP: false,
                                CommentId: v.CommentId,
                                name: v.CommentUser,
                                time: ChangeDateTime(v.CommentTime, 2),
                                content: v.CommentInfo,
                                arr: []
                            });
                            var replayNum = v.ReCommentList
                            for (var i = 0; i < replayNum.length; i++) {
                                vm.comData[j].arr.push({
                                    isShowS: false,
                                    nameOne: replayNum[i].ReCommentUserName,
                                    nameTwo: v.CommentUser,
                                    time: ChangeDateTime(replayNum[i].ReCommentDate, 2),
                                    content: replayNum[i].ReCommentInfo,
                                    ReCommentId: replayNum[i].ReCommentId,
                                    arr: []
                                })
                            }
                        })
                        //初始化分页
                        var pageNum = Math.ceil(mes.data.DataCount / 10);
                        vm.pageNum = pageNum;
                        vm.page(pageNum)
                    } else {
                        $.each(data, function (j, v) {
                            vm.comData.push({
                                isShowP: false,
                                CommentId: v.CommentId,
                                name: v.CommentUser,
                                time: ChangeDateTime(v.CommentTime, 2),
                                content: v.CommentInfo,
                                arr: []
                            });
                            var replayNum = v.ReCommentList
                            for (var i = 0; i < replayNum.length; i++) {
                                vm.comData[j].arr.push({
                                    isShowS: false,
                                    nameOne: replayNum[i].ReCommentUserName,
                                    nameTwo: replayNum[i].CommentUser,
                                    time: ChangeDateTime(replayNum[i].ReCommentDate, 2),
                                    content: replayNum[i].ReCommentInfo,
                                    ReCommentId: replayNum[i].ReCommentId
                                })
                            }
                        })
                    }
                })
            },//获取评论内容
            pageShowCom: function (artId, PageNow, PageSize) {
                this.$http({
                    url: exportPath + "/portComment/CommentPageList",
                    method: "jsonp",
                    data: {ArtileId: artId, PageNow: PageNow, PageSize: PageSize},
                    jsonp: "jsonpcallback"
                }).then(function (mes) {
                    var data = $.parseJSON(mes.data.DataList);
                    vm.comDataNum = mes.data.DataCount;
                    $.each(data, function (j, v) {
                        // console.log(v)
                        vm.comData.push({
                            isShowP: false,
                            CommentId: v.CommentId,
                            name: v.CommentUser,
                            time: ChangeDateTime(v.CommentTime, 2),
                            content: v.CommentInfo,
                            arr: []
                        });
                        var replayNum = v.ReCommentList
                        for (var i = 0; i < replayNum.length; i++) {
                            vm.comData[j].arr.push({
                                isShowS: false,
                                nameOne: replayNum[i].ReCommentUserName,
                                nameTwo: v.CommentUser,
                                time: ChangeDateTime(replayNum[i].ReCommentDate, 2),
                                content: replayNum[i].ReCommentInfo,
                                ReCommentId: replayNum[i].ReCommentId
                            })
                        }
                    })
                })
            },
            btnSubmit: function () {
                if (this.comText.trim().length === 0) {
                    alert('请输入内容')
                } else {
                    var className = this.erJi;
                    className = className.replace(">", "");
                    this.$http({
                        url: exportPath + "/portComment/CommentInsert",
                        method: "jsonp",
                        data: {
                            ArticleId: artId,
                            ClassifyName: className,
                            ArticleTitle: this.clText,
                            CommentInfo: this.comText,
                            CommentUser: "游客" + radom(6)
                        },
                        jsonp: "jsonpcallback"
                    }).then(function () {
                        vm.comData.unshift({
                            isShowP: false,
                            name: "游客" + radom(6),
                            time: date,
                            content: this.comText,
                            arr: []
                        });
                        window.location.reload();
                        vm.comText = "";
                    })
                }
            },//提交评论请求
            replay: function (item) {
                if (this.replayText.trim().length === 0) {
                    alert('请输入内容')
                } else {
                    item.isShowP = !item.isShowP;
                    var rDom = "游客" + radom(6);
                    this.$http({
                        url: exportPath + "/portComment/ReCommentInsert",
                        method: "jsonp",
                        data: {
                            CommentId: item.CommentId,
                            CommentInfo: vm.replayText,
                            CommentUser: rDom
                        },
                        jsonp: "jsonpcallback"
                    }).then(function () {
                        item.arr.unshift({
                            isShowS: false,
                            nameOne: rDom,
                            content: vm.replayText,
                            nameTwo: item.name,
                            time: date,
                        })
                        console.log(item)
                    })
                }
            }//一级回复评论
        },
        mounted: function () {
            this.reachText();
            this.showCom(artId, 1, 10)
        }
    });
    //尾部
    new Vue({
        el: "#footer",
        data: {
            footer: ""
        },
        methods: {
            get: function () {
                this.$http.get('footer.html').then(function (data) {
                    this.footer = data.data
                })
            }
        },
        mounted: function () {
            this.get()
        }
    })
};
