﻿$(function () {
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

    //内容
    new Vue({
        el: "#content",
        data: {
            content: ""
        },
        methods: {
            get: function () {
                this.$http.get('containers.html').then(function (data) {
                    this.content = data.data
                })
            }
        },
        mounted: function () {
            this.get()
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
    });
})

exportPath = "http://ms.breaksport.cn";
ChangeDateTime = function (cellval, flag) {
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
            return date.getFullYear() + "." + month + "." + currentDate;
        else if (flag == 4)
            return date;
    }
    else return "";
};




