var num = {};
var option = {
    "pageLatestNews": {
        "class": "customAddBtn",
    },
    "getMyCustomThread": {
        "class": "customAddBtn",
    },
    "getMyCustomSiteAndApp": {
        "class": "customAddBtn",
    }
    ,
    "getMyCustomWechat": {
        "class": "customAddBtn",
    }
    ,
    "getMyCustomMicroblog": {
        "class": "customAddBtn",
    }
    ,
    "searchTopNews": {
        "class": "customAddBtn",
    }
    ,
    "pageclusternews": {
        "class": "customAddBtn",
    }
    ,
    "pageEvent": {
        "class": "customAddBtn",
    }
}
var style = {}
$(document).ajaxSuccess(function (event, request, settings) {
    var ctx = $('#ctx').val();
    var obj = JSON.parse(request.responseText);
    if (request.status == 200 && obj.errorCode && (obj.errorCode == 103 || obj.errorCode == 401)) {
        if (!!ctx) {
            window.location.href = ctx + '/login';
        } else {
            //刷新当前页面
            location.reload();
        }
    }
});

$(document).ajaxComplete(function (event, request, settings) {
    try {
        var url = settings.url;
        url = url.split("?")[0]
        url = url.split("/")[url.split("/").length - 1]
        if (option[url]) {
            console.log("ajaxComplete " + url)
            if (num[url] && typeof num[url] == "number") {
                num[url]--
            }
            if (num[url] == 0) {
                $("." + option[url].class).css("pointer-events", "");
            }
        }
    } catch (error) {

    }
});

$(document).ajaxSend(function (event, request, settings) {
    try {
        var url = settings.url;
        url = url.split("?")[0]
        url = url.split("/")[url.split("/").length - 1]
        if (option[url]) {
            console.log("ajaxSend " + url)
            if (num[url] && typeof num[url] == "number") {
                num[url]++
            } else {
                num[url] = 1
            }
            $("." + option[url].class).css("pointer-events", "none");
        }
    } catch (error) {

    }
});

// $( document ).ajaxError(function( event, request, settings ) {
//     var  obj = JSON.parse(request.responseText);
//     if (request.status == 401) {
//         window.location.href = '/login';
//     }
// });

