var table;
EnterPress();
$(function () {
    /*头部导航高亮*/

    $().showHeader({
        callback: function () {
            $('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function () {
                if ($(this).attr('data-mark') == 'nav.top') {
                    $(this).addClass('active');
                }
            });
        }
    })

//  去掉来源
    $('.srceenMap').removeClass('hide');
    var screenIndex = 0;
    $('.screenConditionBox .subpage').each(function () {
        if ($(this).hasClass('hide')) {
            return;
        } else {
            var mlLeft = 125 * screenIndex;
            $(this).css({
                'marginLeft': mlLeft + 'px',
            }) 
            ++screenIndex;
        }
    })

//	地区
    $().getData({
        getAjaxUrl: ctx + '/common/dic/front/listRegion',  //请求路径
        boxClassName: '.srceenMap',
        ulClassName: '#srceenMapPro',
    })


//	iSearch搜索
    $('.customAddBtn').customInputClickBtn({
        'refreshTable': function () {
            table.ajax.reload();
            $('.searchesCon').slideDown();
            $('.hotRankList').hide();
        }
    })

    $('#queryStr').limit_input_length();
    footerPutBottom();
    pinterest();


    getHeadLinesData();

//	点击地区刷新列表
    $('#srceenMapPro').click(function () {
        getHeadLinesData();
        return false;
    })
//	查询表格
    tableAjaxData();

    $('#timeSelect').change(function () {
        table.ajax.reload();
    })

//	iSearch加载本地数据
    customAddVal = JSON.parse(localStorage.getItem('isearch'));
    $(".customAddInput").parseLocalArrayData({
        'dataSources': customAddVal,
        'afterSelect': function () {
            table.ajax.reload();
            $('.searchesCon').slideDown();
            $('.hotRankList').hide();
        }
    });
});

//查询表格数据传值
function tableAjaxData() {
    table = $('.searchesTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource: ctx + '/latest/front/searchTopNews',//服务器请求
        fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams: function (aoData) {
//	       	给服务器传的值
            var time = $("#timeSelect").val();
            var startTime = '';
            var endTime = '';
            if (time == 'day') {
                startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)).toUTCString();
                endTime = new Date().toUTCString();
            } else if (time == 'threeDay') {
                startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 72)).toUTCString();
                endTime = new Date().toUTCString();
            } else if (time == 'week') {
                startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7)).toUTCString();
                endTime = new Date().toUTCString();
            } else if (time == 'month') {
                startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30)).toUTCString();
                endTime = new Date().toUTCString();
            }

            var queryStr = $("#queryStr").val();

            if (time == '') {
                aoData.push(
                    {"name": "showSimilar", "value": true},
                    {"name": "isTopNews", "value": true},
                    {"name": "labels", "value": 93},
                    {"name": "queryStr", "value": queryStr}
                );
            } else {
                aoData.push(
                    {"name": "showSimilar", "value": true},
                    {"name": "isTopNews", "value": true},
                    {"name": "labels", "value": 93},
                    {"name": "startTime", "value": startTime},
                    {"name": "endTime", "value": endTime},
                    {"name": "queryStr", "value": queryStr}
                );
            }

        },

//	       服务器传过来的值
        "rowCallback": function (row, data, index) {
            //checkbox选择
            var summary = '';
            var isearchVal = $('.customAddInput').val();
            if (null != data.cusSummary) {
                if (data.cusSummary.length > 150) {
                    summary = data.cusSummary.substr(0, 150) + '...';
                } else {
                    summary = data.cusSummary;
                }
                //title
                if (isearchVal != '') {
                    var titleCon = '<a href="' + ctx + '/latest/front/news/detail/' + data.webpageCode + '?queryStr=' + isearchVal + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
                } else {
                    var titleCon = '<a href="' + ctx + '/latest/front/news/detail/' + data.webpageCode + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
                }

            } else {
                summary = '暂无摘要';
                //title
                if (isearchVal != '') {
                    var titleCon = '<a href="' + ctx + '/latest/front/news/detail/' + data.webpageCode + '?queryStr=' + isearchVal + '" target="_blank" class="beyondEllipsis"  data-id="' + data.webpageCode + '">' + data.title + '</a>'
                } else {
                    var titleCon = '<a href="' + ctx + '/latest/front/news/detail/' + data.webpageCode + '" target="_blank" class="beyondEllipsis"  data-id="' + data.webpageCode + '">' + data.title + '</a>'
                }

            }
            $('td:eq(0)', row).html(titleCon).addClass('titleRightClick');

        },

//	       服务器传过来的值
        columns: [//显示的列
            {data: 'title', "bSortable": false},
            {
                data: 'releaseDatetime', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var releaseDatetime = new Date(data);

                        //获取当前年
                        var nowDate = new Date();
                        var nowyear = nowDate.getFullYear();
                        var year = releaseDatetime.formatDate('yyyy');
                        var time = '';
//	             			判断发布时间是否为当前年份
                        if (year == nowyear) {
                            time = releaseDatetime.formatDate('MM-dd hh:mm');
                        } else {
                            time = releaseDatetime.formatDate('yyyy-MM-dd');
                        }

                        return time;
                    } else {
                        return '-';
                    }
                }
            },
            {data: 'sourceReport', "bSortable": false}
        ],

        "aaSorting": [[1, ""]],
    });

    $('.searchesTable').on('xhr.dt', function (e, settings, json, xhr) {
        highlightList = json.highlightList
    });

    $('.searchesTable').on('draw.dt', function () {
        $('.paginate_button').click(function () {
            scrollOffset($(".searchesTable").offset());
        });
        footerPutBottom();


//			搜索词高亮显示
        var textArr = table.column(5).nodes().data();
        var highTitleArr = [];
        if (highlightList != null) {
            for (var log = 0; textArr.length > log; log++) {
                highTitleArr.push({
                    'webpageCode': textArr[log].webpageCode,
                    'title': textArr[log].title
                })
            }

            for (var i = 0; highlightList.length > i; i++) {
                for (var j = 0; highTitleArr.length > j; j++) {
                    highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i], '<span class="red">' + highlightList[i] + '</span>');
                    $('.searchesTable').find('td.titleRightClick').find('a[data-id=' + highTitleArr[j].webpageCode + ']').html(highTitleArr[j].title)
                }
            }
        }

        /*鼠标划入悬停提示*/
        $("[data-toggle='tooltip']").tooltip();
        $("[data-toggle='popover']").popover({
            html: true,
            trigger: 'hover',
        });

    });
}

/*bootstrap与masonry结合实现瀑布流*/
function pinterest() {
    var $container = $('.masonry-container');
    $container.imagesLoaded(function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });
    $('a[data-toggle=tab]').each(function () {
        var $this = $(this);
        $this.on('shown.bs.tab', function () {
            $container.imagesLoaded(function () {
                $container.masonry({
                    columnWidth: '.item',
                    itemSelector: '.item'
                });
            });
        });
    });
}

/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) {
    $("body,html").animate({
        scrollTop: scroll_offset.top - 100
    }, 0);
}

function loadTopNews(id) {
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
//	window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
    var queryStr = $("#queryStr").val();
    if (null != queryStr && queryStr.length > 0) {
        window.open(ctx + '/latest/front/gotoLatestNewsDetail/' + id + '?queryStr=' + queryStr);
    } else {
        window.open(ctx + '/latest/front/gotoLatestNewsDetail/' + id);
    }
}

/*enter键进入*/
function EnterPress() {
    $(document).keydown(function (event) {
        var e = event || window.event;
        var k = e.keyCode || e.which;
        if (k == 13) {
            if ($('.customAdd').find('input').is(":focus") == true) {
                $('.customAddBtn').click();
            }

        }
    });
}

//一次加载全部的媒体头条
// function getHeadLinesData() {
//     var regions = $('.srceenMap h2').attr('data-innerid');
//     $.ajax({
//         url: ctx + '/latest/front/getTopNewsView',//这个就是请求地址对应sAjaxSource
//         data: {'regions': regions},
//         type: 'get',
//         dataType: 'json',
//         async: true,
//         success: function (data) {
//             console.log(JSON.stringify(data));
//             if (data.result == true) {
//                 $('.headLinesContent').html("");
//                 var obj = data.resultObj;
//                 for (var count = 0; obj.length > count; count++) {
//                     var content = '';
//                     content += '<div><div class="col-md-4 col-sm-12 item p-left" >';
//                     content += '<div class="thumbnail p-all">';
//                     content += '<div class="caption p-all">';
//                     content += '<div class="captionTitle clearfix ">';
//                     content += '<img src="' + obj[count].image + '"  />';
//                     content += '<a href="' + ctx + '/latest/front/topnews/more/' + obj[count].source + '"  target="_blank" class="fullWebMore">更多 >></a>';
//                     content += '</div>';
//                     content += '<div class="captionCon">';
//                     content += '<ul class="list-group-style" >';
//
//                     for (var plug = 0; obj[count].topList.length > plug; plug++) {
//                         var time = new Date(obj[count].topList[plug].releaseDatetime).formatDate('yyyy-MM-dd');
//                         content += '<li class="list-style-item titleRightClick" >';
//                         content += '<a href="' + ctx + '/latest/front/news/detail/' + obj[count].topList[plug].webpageCode + '" target="_blank"  class="beyondEllipsis">';
//                         content += '<i class="fa fa-angle-double-right red"></i>';
//                         content += '<em>' + obj[count].topList[plug].title + '</em></a>';
//                         content += '<span class=" listTil listTilNew"  >' + time + '</span></li>';
//                     }
//                     content += '</ul></div></div></div></div></div>'
//                     $('.headLinesContent').append(content);
//                 }
//             }
//         }
//     })
// }
//

/**
 * @author fa
 * @emil fengao1004@126.com
 * create at 2018/2/26
 * description: 每次加载三条媒体头条  by冯傲 2018 02 26
 */
function getHeadLinesData() {
    var regions = $('.srceenMap h2').attr('data-innerid');
    $.ajax({
        url: ctx + '/latest/front/getTotalTopNewsNum',//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            data = typeof data == "string" ? JSON.parse(data) : data;
            if (data.result == true) {
                var total = data.resultObj;
                $('.headLinesContent').html("");
                while (total > 0) {
                    $('.headLinesContent').append('<div id="topNewsList_' + (data.resultObj - total) + '"></div>');
                    total = total - 3;
                }
                total = data.resultObj;
                while (total > 0) {
                    getHeadLinesDataItem(regions, data.resultObj - total, total > 3 ? 3 : total);
                    total = total - 3;
                }
            }
        },
    });
}

function getHeadLinesDataItem(regions, start, size) {
    $.ajax({
        url: ctx + '/latest/front/getPageTopNewsView',//这个就是请求地址对应sAjaxSource
        data: {'regions': regions, 'pageTopStart': start, 'pageTopSize': size},//开始位置，从0开始
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            var id = '#topNewsList_' + start;
            if (data.result == true) {
                if (start == 0) {
                    $(id).html(""); 
                }
                var obj = data.resultObj.value;
                for (var count = 0; obj.length > count; count++) {
                    var content = '';
                    content += '<div><div class="col-md-4 col-sm-12 item p-left" >';
                    content += '<div class="thumbnail p-all">';
                    content += '<div class="caption p-all">';
                    content += '<div class="captionTitle clearfix ">';
                    content += '<img src="' + obj[count].image + '"  />';
                    content += '<a href="' + ctx + '/latest/front/topnews/more/' + obj[count].source + '"  target="_blank" class="fullWebMore">更多 >></a>';
                    content += '</div>';
                    content += '<div class="captionCon">';
                    content += '<ul class="list-group-style" >';
                    for (var plug = 0; obj[count].topList.length > plug; plug++) {
                        var time = new Date(obj[count].topList[plug].releaseDatetime).formatDate('yyyy-MM-dd');
                        content += '<li class="list-style-item titleRightClick" >';
                        content += '<a href="' + ctx + '/latest/front/news/detail/' + obj[count].topList[plug].webpageCode +'/'+obj[count].topList[plug].releaseDatetime+ '" target="_blank"  class="beyondEllipsis">';
                        content += '<i class="fa fa-angle-double-right red"></i>';
                        content += '<em>' + obj[count].topList[plug].title + '</em></a>';
                        content += '<span class=" listTil listTilNew"  >' + time + '</span></li>';
                    }
                    content += '</ul></div></div></div></div></div>'
                    $(id).append(content);
                }
            }
        }
    })
}

// function getHeadLinesDataItem(regions, total, start, size) {
//     $.ajax({
//         url: ctx + '/latest/front/getPageTopNewsView',//这个就是请求地址对应sAjaxSource
//         data: {'regions': regions, 'pageTopStart': start, 'pageTopSize': size},//开始位置，从0开始
//         type: 'get',
//         dataType: 'json',
//         async: true,
//         success: function (data) {
//             console.log(JSON.stringify(data));
//             if (total > start + size) {
//                 getHeadLinesDataItem(regions, total, start + size, total - (start + size) > 3 ? 3 : total - (start + size));
//             }
//             if (data.result == true) {
//                 if (start == 0) {
//                     $('.headLinesContent').html("");
//                 }
//                 var obj = data.resultObj.value;
//                 for (var count = 0; obj.length > count; count++) {
//                     var content = '';
//                     content += '<div><div class="col-md-4 col-sm-12 item p-left" >';
//                     content += '<div class="thumbnail p-all">';
//                     content += '<div class="caption p-all">';
//                     content += '<div class="captionTitle clearfix ">';
//                     content += '<img src="' + obj[count].image + '"  />';
//                     content += '<a href="' + ctx + '/latest/front/topnews/more/' + obj[count].source + '"  target="_blank" class="fullWebMore">更多 >></a>';
//                     content += '</div>';
//                     content += '<div class="captionCon">';
//                     content += '<ul class="list-group-style" >';
//
//                     for (var plug = 0; obj[count].topList.length > plug; plug++) {
//
//                         var time = new Date(obj[count].topList[plug].releaseDatetime).formatDate('yyyy-MM-dd');
//
//                         content += '<li class="list-style-item titleRightClick" >';
//                         content += '<a href="' + ctx + '/latest/front/news/detail/' + obj[count].topList[plug].webpageCode + '" target="_blank"  class="beyondEllipsis">';
//                         content += '<i class="fa fa-angle-double-right red"></i>';
//                         content += '<em>' + obj[count].topList[plug].title + '</em></a>';
//                         content += '<span class=" listTil listTilNew"  >' + time + '</span></li>';
//                     }
//
//                     content += '</ul></div></div></div></div></div>'
//
//                     $('.headLinesContent').append(content);
//                 }
//             }
//         }
//     })
// }