var ctx;
var webIdsList = [];
var appIdsList = [];
var weibodsList = [];
var wechatIdsList = [];
$(function () {
    /* 头部导航高亮 */
    $('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function () {
        if ($(this).attr('data-mark') == 'nav.custom') {
            $(this).addClass('active');
        }
    });

    $().showHeader({
        callback: function () {
            $('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function () {
                if ($(this).attr('data-mark') == 'nav.custom') {
                    $(this).addClass('active');
                }
            });
        }
    })
    ctx = $('#context').val();
    console.log(ctx)
    $('#ico-refresh,#ico-heart').css('visibility', 'visible');

    //获取定制信息
    getCustomStatus(ctx, '/custom/front/customOrNot', 'get');

    getCustomData(ctx, '/uec/custom/front/getMyCustomGroup', 'get');

    //获取微信列表
    getWechatList();
    //获取微博列表
    getWeiboList();
    //获取网站和App列表
    getWebSourcesData(ctx + '/custom/front/listUserSiteByType');
    getAppSourcesData(ctx + '/custom/front/listUserSiteByType');

    // 添加修改事件
    $('#totalAddModify').click(function () {
        $("#myaccordion>li>.link").removeClass("tabSelectted");
        $("#myaccordion>li>.submenu").hide();
        // $('.addAndModifyGrounp').hide();
        $('.addAndModifyGrounp').show();
        $('#myCustomContent').hide();
        //进入添加修改页时，默认展示  新闻线索页面。
        $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddMyCustom');
        $('.addModifyNavsIner li a').removeClass('clickedStyle');
        $('.addModifyNavsIner li:first a').addClass('clickedStyle');
    });

    $('.analysis').click(function () {
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoReviewAnalysis');
    });

    $('.special').click(function () {
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoCustomSpecial');
    });

    $('.addAndModifyGrounp .addModifyNavsIner li a').click(function () {
        var name = $(this).text();
        if (name == '微信') {
            //判断是否添加了微信的定制
            judgeCustomed(ctx, 'get', {type: 1});
        } else if (name == '微博') {
            //判断是否添加了微博的定制
            judgeCustomed(ctx, 'get', {type: 2});
        } else if (name == '网站/APP') {
            $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddWebandApp');
        } else {
            $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddMyCustom');
        }
    });


    $('.addModifyNavsIner li a').click(function () {
        $(this).addClass('clickedStyle');
        $(this).parent().siblings().find('a').removeClass('clickedStyle');
    });

    // 左侧列表下拉事件
    $("#myaccordion>li>.link>i").click(function () {
        var obj = $(this);
        var parent = obj.parent();
        $("#myaccordion>li>.link").removeClass("tabSelectted");
        parent.addClass("tabSelectted");

        $('.addAndModifyGrounp').hide();
        $('#myCustomContent').show();

        if (parent.attr('isopen') == 'opened') {
            parent.attr('isopen', 'closed');
            parent.siblings().hide();
            obj.removeClass("fa-angle-up").addClass("fa-angle-down");
        } else {
            obj.removeClass("fa-angle-down").addClass("fa-angle-up");
            parent.attr('isopen', 'opened');
            parent.siblings().show();
            parent.parent().siblings().find('.submenu').hide();
            parent.parent().siblings().find('.link').attr('isopen', 'closed');
        }
    });

    // 左侧列表切换事件
    $("#myaccordion>li>.link>span").click(function () {
        var obj = $(this);
        var parent = obj.parent();
        $("#myaccordion>li>.link").removeClass("tabSelectted");
        obj.parent().addClass("tabSelectted");

        $('.addAndModifyGrounp').hide();
        $('#myCustomContent').show();

        var spanIndex = parseInt(obj.attr("data-spanIndex") || 0);
        if (spanIndex != 0 || $(this).parent().attr('isopen') != 'opened') {
            $('.mdynews').css('border', 'none');
        }
        if (parent.attr('isopen') == 'opened') {
            parent.siblings().show();
            parent.parent().siblings().find('.submenu').hide();
        } else {
            parent.parent().siblings().find('.submenu').hide();
            parent.parent().siblings().find('.link').attr('isopen', 'closed');
        }
        loadTotalList(spanIndex);
    })

});

function getCustomStatus(rootUrl, requestUrl, type) {
    $.ajax({
        url: rootUrl + requestUrl,//这个就是请求地址对应sAjaxSource
        type: type,
        dataType: 'json',
        async: true,
        success: function (res) {
            if (!res.result) {
                setTimeout(function () {
                    $('#myCustomContent').hide();
                    $('.addAndModifyGrounp').show();
                    $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddMyCustom');
                }, 600)
            }
        }
    })
}

//获取所有的定制线索
var timeCode;
//getCustomData();
//$('#myCustomContent').load(ctx+'/custom/front/gotoMyCustomThread');
function getCustomData(rootUrl, requestUrl, type, callback) {
    $.ajax({
        url: rootUrl + requestUrl,//这个就是请求地址对应sAjaxSource
        type: type,
        dataType: 'json',
        async: true,
        success: function (res) {
            localStorage.customType = "";
            localStorage.innerId = "";
            var data = res.resultObj;
            var len = data.length;
            if (res.result) {
                var str = '';
                var contentweb = getNewsHtml(data);
                $('.submenu').html("");
                for (var i = 0; i < data.length; i++) {
                    str = str + "<li class='mdynews' data-customGroup=" + data[i].customGroup + ">" + data[i].name + "</li>"
                }
                $('.submenu').eq(0).append(str);

                localStorage.newsdata = contentweb;
                localStorage.customNewsArray = JSON.stringify(data);
                localStorage.len = len;
                $('.link').eq(0).find("i")[0].style.visibility = "visible"
                $('#myaccordion>li>.submenu>li').click(function (event) {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px red solid'
                    var target = event.target || event.srcElement;

                    var ifAll = target.parentElement.parentElement.innerHTML.indexOf("<span>新闻线索</span>") != -1
                    var ifWeb = target.parentElement.parentElement.innerHTML.indexOf("<span>网站</span>") != -1
                    var ifApp = target.parentElement.parentElement.innerHTML.indexOf("<span>APP</span>") != -1
                    var ifWechat = target.parentElement.parentElement.innerHTML.indexOf("<span>微信</span>") != -1
                    var ifWeibo = target.parentElement.parentElement.innerHTML.indexOf("<span>微博</span>") != -1
                    localStorage.customgroup = $(this).attr('data-customgroup');
                    localStorage.innerId = "";
                    var customType = ""
                    if (ifAll) {

                    } else if (ifWeb) {
                        customType = "web"
                    } else if (ifApp) {
                        customType = "app"
                    } else if (ifWechat) {
                        customType = "weChat"
                    } else if (ifWeibo) {
                        customType = "weiBo"
                    }
                    localStorage.customType = customType;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                })
                $('#myaccordion>li:first>.link>i').click();
                $('.mdynews:first').css('borderLeft', '5px red solid');
                // $('.mdynews:first').css("color", '#ffffff');
                localStorage.customgroup = $('.submenu:first li:first').attr('data-customgroup');
                $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');//默认加载。
            }
        }
    })
}

//拼接已添加新闻线索的html结构
function getNewsHtml(newsList) {
    var contentweb = "";
    if (newsList.length <= 0) {
        return "";
    }
    for (var i = 0; i < newsList.length; i++) {
        contentweb += '<a href="javascript:;" data-customGroup="' + newsList[i].customGroup + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + newsList[i].customGroup + '">' + newsList[i].name + '</span><span class="blodFont" data-customGroup="' + newsList[i].customGroup + '">&#10005;</span></a>';
    }
    return contentweb;
}

//获取已添加的微信名称列表
//获取已添加的微博名称列表
function loadTotalList(index) {
    if (index == 1 && localStorage.innerId == "loadTotalListWeb") {
        return
    }
    if (index == 2 && localStorage.innerId == "loadTotalListApp") {
        return
    }
    if (index == 3 && localStorage.innerId == "loadTotalListWeChat") {
        return
    }
    if (index == 4 && localStorage.innerId == "loadTotalListWeiBo") {
        return
    }
    if (index == 1) {
        var customType = "web";
        localStorage.customType = customType;
        localStorage.innerId = "loadTotalListWeb";
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
    } else if (index == 2) {
        var customType = "app";
        localStorage.customType = customType;
        localStorage.innerId = "loadTotalListApp";
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
    } else if (index == 3) {
        var customType = "weChat";
        localStorage.customType = customType;
        localStorage.innerId = "loadTotalListWeChat";
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
    } else if (index == 4) {
        var customType = "weiBo";
        localStorage.customType = customType;
        localStorage.innerId = "loadTotalListWeiBo";
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
    }
}

function getWechatList() {
    $.ajax({
        url: ctx + '/custom/front/listWechat',//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.result) {
                var obj = data.resultObj;
                if (obj.length > 0) {
                    var content = '';
                    var contentwechat = '';
                    for (var i = 0; i < obj.length; i++) {
                        wechatIdsList.push(obj[i].biz);
                        content += "<li class='mdynews' data-innerid=" + obj[i].biz + ">" + obj[i].wechat_name + "</li>"
                        contentwechat += '<a href="javascript:;" data-biz="' + obj[i].biz + '" class="sourcesBox"><span class="contentWidth" data-biz="' + obj[i].biz + '">' + obj[i].wechat_name + '</span><span class="blodFont" data-biz="' + obj[i].biz + '">&#10005;</span></a>';
                    }
                    setTimeout(function () {
                        $('.submenu').eq(3)[0].innerHTML = content;
                        $('.submenu').eq(3).find('li').click(function () {
                            $('.mdynews').css('border', 'none');
                            this.style.borderLeft = '5px red solid'
                            var customType = "weChat";
                            localStorage.customType = customType;
                            localStorage.customgroup = '';
                            var innerId = $(this).attr('data-innerid');
                            localStorage.innerId = innerId;
                            $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                        })
                    }, 100)
                    $('.link').eq(3).find("i")[0].style.visibility = "visible";
                }
                localStorage.contentWechat = contentwechat;

            }
        }
    })
}


function getWeiboList() {
    $.ajax({
        url: ctx + '/custom/front/listMicroblog',//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.result) {
                var obj = data.resultObj;
                var content = '';
                var contentweibo = '';
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        weibodsList.push(obj[i].oid);
                        content += "<li class='mdynews' data-innerid=" + obj[i].oid + ">" + obj[i].name + "</li>"
                        contentweibo += '<a href="javascript:;" data-customGroup="' + obj[i].oid + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + obj[i].oid + '">' + obj[i].name + '</span><span class="blodFont" data-customGroup="' + obj[i].oid + '">&#10005;</span></a>';
                    }
                    $('.link').eq(4).find("i")[0].style.visibility = "visible"
                }
                localStorage.contentWeibo = contentweibo;

                setTimeout(function () {
                    $('.submenu').eq(4)[0].innerHTML = content;
                    $('.submenu').eq(4).find('li').click(function () {
                        $('.mdynews').css('border', 'none');
                        this.style.borderLeft = '5px red solid'
                        localStorage.customgroup = '';
                        var customType = "weiBo"
                        localStorage.customType = customType;
                        var innerId = $(this).attr('data-innerid');
                        localStorage.innerId = innerId;
                        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                    })
                }, 100)
            } else {
                $('.link').eq(3).find("i").style.visibility = "hidden"
            }
        }
    })
}

function getWebSourcesData(getAjaxUrl) {
    $.ajax({
        url: getAjaxUrl,//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        data: {
            type: 1
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result == true) {
                var obj = data.resultObj;
                var contentapp = '';
                var contentweb = '';
                for (var i = 0; obj.length > i; i++) {
                    webIdsList.push(obj[i].innerid);
                    contentweb += "<li class='mdynews' data-innerid=" + obj[i].innerid + ">" + obj[i].name + "</li>"
                }
                if (contentweb != "") {
                    $('.link').eq(1).find("i")[0].style.visibility = "visible"
                }
            }
            setTimeout(function () {
                $('.submenu').eq(1).html(contentweb);
                $('.submenu').eq(1).find('li').click(function () {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px red solid'
                    localStorage.customgroup = '';
                    var innerId = $(this).attr('data-innerid');
                    localStorage.innerId = innerId;
                    var customType = "web"
                    localStorage.customType = customType;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                })
            }, 500)
        }
    })
}

function getAppSourcesData(getAjaxUrl) {
    $.ajax({
        url: getAjaxUrl,//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        data: {
            type: 4
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result == true) {
                var obj = data.resultObj;
                var contentapp = '';
                var contentweb = '';
                for (var i = 0; obj.length > i; i++) {
                    appIdsList.push(obj[i].innerid);
                    contentapp += "<li class='mdynews' data-innerid=" + obj[i].innerid + ">" + obj[i].name + "</li>"
                }

                if (contentapp != "") {
                    $('.link').eq(2).find("i")[0].style.visibility = "visible"
                }
            }
            setTimeout(function () {

                $('.submenu').eq(2).html(contentapp);

                $('.submenu').eq(2).find('li').click(function () {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px red solid'
                    localStorage.customgroup = '';
                    var innerId = $(this).attr('data-innerid');
                    var customType = "app"
                    localStorage.customType = customType;
                    localStorage.innerId = innerId;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                })
            }, 500)
        }
    })
}

var sourcesCrawl = [];

var plugCrawl = '';
$('.webSources').find('.sourcesBox').each(function () {
    if ($(this).hasClass('active')) {
        plugCrawl = $(this).find('.link').attr('data-innerid');
    }
})
sourcesCrawl.push(plugCrawl);

function judgeCustomed(rootUrl, type, data) {
    $.ajax({
        url: ctx + '/custom/front/checkStatus',
        data: data,
        type: type,
        dataType: 'json',
        async: true,
        success: function (res, index) {
            console.log(res);
            if (res.result) {//添加过定制
                var obj = res.resultObj;
                if (data.type == '1') {
                    if (false) {
                        $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddBuffet');
                    } else {
                        $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoWeChat');
                    }
                } else {
                    if (false) {
                        $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoAddBuffet');
                    } else {
                        $('.showAddModifyContainer').loadPage(ctx + '/custom/front/gotoMicroblogs');
                    }
                }
            } else {//没有添加过定制
            }
        }
    });
}





