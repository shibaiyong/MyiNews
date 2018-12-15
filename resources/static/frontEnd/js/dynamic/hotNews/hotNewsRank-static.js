var hotNewsList,
    highlightList = [],
    customAddVal = [];
var timeCode;//用来标识每次请求热点新闻的时间戳，防止重复刷新时出现错乱
$(function () {
    //$('.screenConditionBox').addClass({'float':'right'},{'marginLeft':'245px'});
    footerPutBottom();
    /*头部导航高亮*/
    $().showHeader({
        callback: function () {
            $('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function () {
                if ($(this).attr('data-mark') == 'nav.hot') {
                    $(this).addClass('active');
                }
            });
        }
    })
    //iNews 热点排行优化 2018-3-14
    //$('.srceenList').removeClass('hide');
    //$('.srceenListPeriod').removeClass('hide');
    $('.srceenBranches').removeClass('hide');
    $('.moduleClassify').removeClass('hide');
    var screenIndex = 0;
    $('.screenConditionBox .pros').each(function () {
        if ($(this).hasClass('hide')) {

        } else {
            var mlLeft = 125 * screenIndex;
            $(this).css({
                'marginLeft': mlLeft + 'px',
            })
            ++screenIndex;
        }
    })

//	榜单
    $().getData({
        getAjaxUrl: ctx + '/common/dic/front/listRankingType',  //请求路径
        boxClassName: '.srceenList',
        ulClassName: '#srceenListPro',
        inter: false
    })
//	榜单周期
    $().getData({
        getAjaxUrl: ctx + '/common/dic/front/listRankingCycle',  //请求路径
        boxClassName: '.srceenListPeriod',
        ulClassName: '#srceenListPeriodPro',
    })
//	筛选条数
    $().getData({
        boxClassName: '.srceenBranches',
        ulClassName: '#srceenBranchesPro',
    })

//分类条目 2018-3-14
    $().getData({
        getAjaxUrl:ctx + '/hot/front/getHotLabels',
        boxClassName:'.moduleClassify',
        ulClassName:'#moduleClassifyPro',
        inter: false
    })

    loadHotRanking();

//	点击榜单刷新列表
    $('#srceenListPro').click(function () {
        loadHotRanking();
        return false;
    })
    //	点击榜单周期刷新列表
    $('#srceenListPeriodPro').click(function () {
        loadHotRanking();
        return false;
    })
    //	点击榜单条数刷新列表 前5条
    $('#srceenBranchesPro').click(function () {
        loadHotRanking();
        return false;
    })

    //点击分类 刷新列表 对模块进行分类  2018-3-14
    $('#moduleClassifyPro').click(function () {

        loadHotRanking();
        return false;
    })

    //	iSearch点击查询
    $('.customAddBtn').customInputClickBtn({
        'refreshTable': function () {
            hotNewsList.ajax.reload();
            $('.searchesCon').slideDown();
            $('.hotRankList').hide();
        }
    })
//	iSearch加载本地数据
    customAddVal = JSON.parse(localStorage.getItem('isearch'));
    $(".customAddInput").parseLocalArrayData({
        'dataSources': customAddVal,
        'afterSelect': function () {
            hotNewsList.ajax.reload();
            $('.searchesCon').slideDown();
            $('.hotRankList').hide();
        }
    });

    hotNewsList = $('.searchesTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource: ctx + '/hot/front/pageHotNews',//服务器请求
        fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams: function (aoData) {
            var queryStr = $('.customAddInput').val();
            aoData.push(
                {"name": "queryStr", "value": queryStr}
            );
        },

//				       服务器传过来的值
        "rowCallback": function (row, data, index) {

            var summary = '';
            var isearchVal = $('.customAddInput').val();
            if (null != data.cusSummary) {
                if (data.cusSummary.length > 150) {
                    summary = data.cusSummary.substr(0, 150) + '...';
                } else {
                    summary = data.cusSummary;
                }
                if (isearchVal != '') {
                    //title
                    var titleCon = '<a href="' + ctx + '/hot/front/hot/detail/' + data.webpageCode + '?queryStr=' + isearchVal + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
                } else {
                    //title
                    var titleCon = '<a href="' + ctx + '/hot/front/hot/detail/' + data.webpageCode + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
                }

            } else {
                summary = '暂无摘要';
                //title
                if (isearchVal != '') {
                    var titleCon = '<a href="' + ctx + '/hot/front/hot/detail/' + data.webpageCode + '?queryStr=' + isearchVal + '" target="_blank"  class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '">' + data.title + '</a>'
                } else {
                    var titleCon = '<a href="' + ctx + '/hot/front/hot/detail/' + data.webpageCode + '" target="_blank"  class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '">' + data.title + '</a>'
                }

            }
            $('td:eq(1)', row).html(titleCon).addClass('titleRightClick');


            var browseNum = '<span class="browseNum' + index + '"></span>';
            $('td:eq(9)', row).html(browseNum);

            var negativeCon = '<span class="negativeNum' + index + '"></span>';
            $('td:eq(8)', row).html(negativeCon);
        },

//				       服务器传过来的值
        columns: [//显示的列
            {
                data: 'releaseDatetime', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var releaseDatetime = new Date(data);
                        var time = releaseDatetime.formatDate('MM-dd hh:mm');
                        return time;
                    } else {
                        return '-';
                    }
                }
            },
            {data: 'title', "bSortable": false},
            {
                data: 'rankingTypeDetail', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        if (data.name != null && data.name != '') {
                            var rankingType = data.name;
                            return rankingType;
                        } else {
                            return '-'
                        }

                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'rankingCycleDetail', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        if (data.name != null && data.name != '') {
                            var rankingCycle = data.name;
                            return rankingCycle;
                        } else {
                            return '-'
                        }
                    } else {
                        return '-'
                    }
                }
            },
            {data: 'rankingNum', "bSortable": false},
            {
                data: 'clickingNum', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        return data;
                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'commentNum', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        return data;
                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'participateNum', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        return data;
                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'sentiment', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        var negative = data.negative * 100 + '&';
                        return negative;
                    } else {
                        return '-';
                    }
                }
            },
            {
                data: 'statEntity', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        if (data.browseNum != null && data.browseNum != '') {
                            var browseNum = data.browseNum;
                            return browseNum;
                        } else {
                            return '-';
                        }
                    } else {
                        return '-';
                    }
                }
            }
        ],

        "aaSorting": [[0, ""]],
    });

    $('.searchesTable').on('xhr.dt', function (e, settings, json, xhr) {
        highlightList = json.highlightList
    });

    $('.searchesTable').on('draw.dt', function () {

        //		相似相关获取
        var textArr = hotNewsList.column(2).nodes().data();
        var textArrCon = [];
        if (textArr.length > 0) {
            for (var count = 0; textArr.length > count; count++) {
                textArrCon.push(textArr[count].webpageCode);
            }
            //			负面指数
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getsentimentindex',
                'dataParam': {'webpageCode': textArrCon.join(',')},
                'callback': function (data) {
                    console.log(data);
                    $('.searchesTable tbody').find('[class*="negativeNum"]').each(function (index) {
                        if (data[index].negative != null && data[index].negative != '') {
                            var colorStyle = ''
                            if (data[index].negative > 60) {
                                colorStyle = 'red'
                            } else if (data[index].negative > 40) {
                                colorStyle = 'gray'
                            } else {
                                colorStyle = 'green'
                            }

                            $(this).text(data[index].negative + '%');
                            $(this).addClass(colorStyle);
                        } else {
                            $(this).text('-');
                        }

                    })
                }
            });
            //		浏览量
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getBrowseNum',
                'dataParam': {'webpageCode': textArrCon.join(',')},
                'callback': function (data) {
                    $('.searchesTable tbody').find('[class*="browseNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });
            //			建、采
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getDraftType',
                'dataParam': {'webpageCode': textArrCon.join(',')},
                'callback': function (data, con) {
                    console.log(data);
                    $('.dataConBoxTable tbody').find('.titleRightClick').each(function (index) {
                        if (data[index][0] == 1) {
                            $(this).append('<span class="label-status label-jian">【建】</span>');
                        } else if (data[index][0] == 2) {
                            $(this).append('<span class="label-status label-cai">【采】</span>');
                        } else {
                        }
                    })
                }
            });

        }

//			搜索词高亮显示
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

    })


})

//最新排行数据获取 采用了优化的方式 注释掉之前的加载方式 by冯傲 2018 02 27
// function loadHotRanking(){
//
//     var rankingType = '';
//     var rankingCycle = '';
//     var listSize = '';
//
//     rankingType = $('.srceenList h2').attr('data-innerid');
//     rankingCycle = $('.srceenListPeriod h2').attr('data-innerid');
//     listSize = $('.srceenBranches h2').text();
//     console.log(listSize);
//
//
//     var data = {'rankingType':rankingType,'rankingCycle':rankingCycle,'listSize':listSize};
//     $.ajax({
//         url : ctx+'/hot/front/loadHotRanking',
//         data : data,
//         type : 'get',
//         dataType : 'json',
//         async : true,
//         success : function(data) {
//             console.log(data);
//             var content = '';
//             if(data.result){
//                 var obj = data.resultObj;
//
//                 if(null == obj || ''==obj){
//                     $('.rankList').html(content);
//                     return;
//                 }
//                 content += '<div class="row masonry-container" >';
//
//                 for (var i = 0; i < obj.length; i++) {
//
//                     content += '<div class="col-md-4 col-sm-6 item p-left"><div class="thumbnail p-all"><div class="caption p-all">';
//                     content += '<div class="captionTitle clearfix "><img src="'+obj[i].image+'"/><a href="'+ctx+'/hot/front/hot/more/'+obj[i].innerid+'" target="_blank" class="fullWebMore">更多 >></a></div>';
//                     content += '<div class="captionCon"><ul class="list-group-style">';
//
//                     for (var j = 0; j < obj[i].hotList.length; j++) {
//                         var hotList = obj[i].hotList[j];
//                         var summary = '';
//                         content += '<li class="list-style-item titleRightClick">';
//
//                         if(null != hotList.cusSummary){
//                             if(hotList.cusSummary.length>150){
//                                 summary = hotList.cusSummary.substr(0,150)+'...';
//                             }else{
//                                 summary = hotList.cusSummary;
//                             }
//                             content += '<a href="'+ctx+'/hot/front/hot/detail/'+hotList.webpageCode+'" target="_blank" class="beyondEllipsis" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-placement="bottom">';
//                         }else{
//                             summary = '暂无摘要';
//                             content += '<a href="'+ctx+'/hot/front/hot/detail/'+hotList.webpageCode+'" target="_blank" class="beyondEllipsis">';
//                         }
//
//
//                         content += '<em>'+(j+1)+'</em>'+hotList.title+'</a>';
//
//                         if (obj[i].name == 'iNews'){
//                             var weightCount = hotList.weight;
//                             if(weightCount != null && weightCount != '' && weightCount != 'undefined'){
//                                 if(weightCount > 10000){
//                                     weightCountStr = Math.floor(weightCount/10000) +'万';
//                                 }else{
//                                     weightCountStr = weightCount;
//                                 }
//                             }else{
//                                 weightCountStr = '-'
//                             }
//
//                             content += '<span class="pull-right listTil listTilNew">['+weightCountStr+']</span></li>';
//                         }else {
//                             var participateNumStr;
//                             if($('.srceenList h2').attr('data-innerid') == '75'){//点击榜
//                                 var count = hotList.clickingNum;
//                                 if(count != null && count != '' && count != 'undefined'){
//                                     if(count > 10000){
//                                         participateNumStr = Math.floor(count/10000) +'万';
//                                     }else{
//                                         participateNumStr = count;
//                                     }
//                                 }else{
//                                     participateNumStr = '-'
//                                 }
//
//                                 content += '<span class="pull-right listTil listTilNew">['+participateNumStr+']</span></li>';
//                             }else if($('.srceenList h2').attr('data-innerid') == '76'){//跟帖榜
//                                 var count = hotList.participateNum;
//                                 if(count != null && count != '' && count != 'undefined'){
//                                     if(count > 10000){
//                                         participateNumStr = Math.floor(count/10000) +'万';
//                                     }else{
//                                         participateNumStr = count;
//                                     }
//                                 }else{
//                                     participateNumStr = '-'
//                                 }
//
//                                 content += '<span class="pull-right listTil listTilNew">['+participateNumStr+']</span></li>';
//                             }else{
//                                 content += '<span class="pull-right listTil listTilNew">[-]</span></li>';
//                             }
//                         }
//                     }
//                     content += '</ul></div>';
//                     content += '</div></div></div>';
//                 }
//                 content += '</div>';
//             }
//
//             $('.rankList').html(content);
//             threeRedChage();
//             $("[data-toggle='popover']").popover({
//                 trigger: 'hover',
//                 html: true,
//             });
//         },
//         error : function(msg) {
//             console.log(msg.errorMsg);
//         }
//
//
//     });
// }
/**
 * @author fa
 * @emil fengao1004@126.com
 * create at 2018/2/27
 * description: 加载热点排行 加载方式优化
 */
function loadHotRanking(){
    var listClassify='';
    listClassify=$('.moduleClassify h2').text(); //模块分类
    console.log(listClassify);
    var label=0;
    if(listClassify=='全部分类'){
        label=111;
    }
    if(listClassify=='综合'){
        label=111;
    }
    if(listClassify=='军事'){
        label=22;
    }
    if(listClassify=='体育'){
        label=20;
    }
    if(listClassify=='娱乐'){
        label=21;
    }
    if(listClassify=='科技'){
        label=24;
    }
    if(listClassify=='财经'){
        label=23;
    }
    console.log(label);
    $.ajax({
        //url: ctx + '/hot/front/getTotalRankNewsNum',
        url:ctx+'/hot/front/getTotalHotLabels',
        data:{'label':label},
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.result == true) {
                console.log(data);
                var conut = data.resultObj;
                $('.rankList').html("");
               // $('.rankList').append('<div id="hotRanking_' + (data.resultObj) + '"></div>');
               // while (conut > 0) {
                   // $('.rankList').append('<div id="hotRanking_' + (data.resultObj - conut) + '"></div>');
                 //   conut = conut - 2;
              //  }
                //conut = data.resultObj;
                console.log(conut);     //
                var timeDate = new Date().getTime();
                timeCode = timeDate;
                loadHotRankingItem(data.resultObj - conut,conut, timeDate);
                // while (conut > 0) {
                //     loadHotRankingItem(data.resultObj - conut, conut > 0 ? 2 : conut, timeDate);
                //     conut = conut - 2;
                // }
            }
        }
    });
}


function loadHotRankingItem(start, size, timeDate) {
    var rankingType = '';
    var rankingCycle = '';
    var listSize = '';
    var listClassify='';
    rankingType = $('.srceenList h2').attr('data-innerid');   //点击榜
    rankingCycle = $('.srceenListPeriod h2').attr('data-innerid');  //24小时
    listSize = $('.srceenBranches h2').text();   //前5条
    listClassify=$('.moduleClassify h2').text(); //模块分类
   // console.log(listClassify);
    var label=0;
    if (listClassify == '全部分类') {
        label=111;
    }
    if(listClassify=='综合'){
        label=111;
    }
    if(listClassify=='军事'){
        label=22;
    }
    if(listClassify=='体育'){
        label=20;
    }
    if(listClassify=='娱乐'){
        label=21;
    }
    if(listClassify=='科技'){
        label=24;
    }
    if(listClassify=='财经'){
        label=23;
    }
    console.log(listSize);
    var data = {
        'rankingType': rankingType,
        'rankingCycle': rankingCycle,
        'listSize': listSize,
        'pageRankStart': start,
        'pageRankSize': size,
        'label':label,
    };
    $.ajax({
       // url: ctx + '/hot/front/loadPagedHotRanking',
        url:ctx+'/hot/front/loadPagedHotRank',
        data: data,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            var content = '';
            if (data.result && timeDate == timeCode) {
                var id = '#hotRanking_' + start;
                var obj = data.resultObj.value;
                if (null == obj || '' == obj) {
                    $(id).html(content);
                    return;
                }
                content += '<div class="row masonry-container" >';

                for (var i = 0; i < obj.length; i++) {
                    content += '<div class="col-md-6 col-sm-12 item p-left"><div class="thumbnail p-all"><div class="caption p-all">';
                    content += '<div class="captionTitle clearfix "><img src="'+ obj[i].image + '"/><a href="' + ctx + '/hot/front/hot/more/' + obj[i].innerid + '/'+label+'" target="_blank" class="fullWebMore">更多 >></a></div>';
                    content += '<div class="captionCon"><ul class="list-group-style">';

                    for (var j = 0; j < obj[i].hotList.length; j++) {
                        var hotList = obj[i].hotList[j];
                       //console.log(hotList);
                        var summary = '';
                        content += '<li class="list-style-item titleRightClick">';
                        var releaseDatetime = '';
                        if (hotList.releaseDatetime != null && hotList.releaseDatetime != '' &&
                            hotList.releaseDatetime != 'null') {
                            releaseDatetime = '/' + hotList.releaseDatetime;
                        }
                        if (null != hotList.cusSummary) {
                            if (hotList.cusSummary.length > 150) {
                                summary = hotList.cusSummary.substr(0, 150) + '...';
                            } else {
                                summary = hotList.cusSummary;
                            }
                            content += '<a href="' + ctx + '/hot/front/hot/detail/' + hotList.webpageCode + releaseDatetime+'" target="_blank" class="beyondEllipsis" tabindex="0" data-toggle="popover" data-content="' + summary + '" data-placement="bottom">';
                        } else {
                            summary = '暂无摘要';
                            content += '<a href="' + ctx + '/hot/front/hot/detail/' + hotList.webpageCode + releaseDatetime+'" target="_blank" class="beyondEllipsis">';
                        }
                        //判断标题长度 进行不同情况的展示 2018-3-14
                        var hotListTitle='';
                        if(hotList.title.length>30){
                           hotListTitle=hotList.title.substr(0,30)+'...';
                        }else{
                           hotListTitle= hotList.title;
                        }

                        content += '<em>' + (j + 1) + '</em>' + hotListTitle+ '</a>';

                        if (obj[i].name == 'iNews') {
                            var weightCount = hotList.weight;
                            if (weightCount != null && weightCount != '' && weightCount != 'undefined') {
                                if (weightCount > 10000) {
                                    weightCountStr = Math.floor(weightCount / 10000) + '万';
                                } else {
                                    weightCountStr = weightCount;
                                }
                            } else {
                                weightCountStr = '-'
                            }

                            content += '<span class="pull-right listTil listTilNew">[' + weightCountStr + ']</span></li>';
                        } else {
                            var participateNumStr;
                            if ($('.srceenList h2').attr('data-innerid') == '75') {//点击榜
                                var count = hotList.clickingNum;
                                if (count != null && count != '' && count != 'undefined') {
                                    if (count > 10000) {
                                        participateNumStr = Math.floor(count / 10000) + '万';
                                    } else {
                                        participateNumStr = count;
                                    }
                                } else {
                                    participateNumStr = '-'
                                }

                                content += '<span class="pull-right listTil listTilNew">[' + participateNumStr + ']</span></li>';
                            } else if ($('.srceenList h2').attr('data-innerid') == '76') {//跟帖榜
                                var count = hotList.participateNum;
                                if (count != null && count != '' && count != 'undefined') {
                                    if (count > 10000) {
                                        participateNumStr = Math.floor(count / 10000) + '万';
                                    } else {
                                        participateNumStr = count;
                                    }
                                } else {
                                    participateNumStr = '-'
                                }

                                content += '<span class="pull-right listTil listTilNew">[' + participateNumStr + ']</span></li>';
                            } else {
                                content += '<span class="pull-right listTil listTilNew">[-]</span></li>';
                            }
                        }
                    }
                    content += '</ul></div>';
                    content += '</div></div></div>';
                }
                content += '</div>';
            }

           // $(id).html(content);
            $('.rankList').html(content);
            threeRedChage();
            $("[data-toggle='popover']").popover({
                trigger: 'hover',
                html: true,
            });
        },
        error: function (msg) {
            console.log(msg.errorMsg);
        }


    });
}


//排名前三的变红
function threeRedChage() {
    $('.captionCon').each(function () {
        $(this).find('li').each(function (index) {
            if (index == 0) {
                $(this).find('em').addClass('red');
            } else if (index == 1) {
                $(this).find('em').addClass('red');
            } else if (index == 2) {
                $(this).find('em').addClass('red');
            }
        })
    })
}

