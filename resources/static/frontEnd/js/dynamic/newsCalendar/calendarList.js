var calendarTable,
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode

$(function () {
    /* 头部导航高亮 */
    $().showHeader();

//	全选功能
    $('.table-operation-status').find('a').eq(0).allCheck({
        'allFun': function (status) {
            if (status) {
                console.log(status);
                if (batchCheckWebPageCode.length == 0) {
                    for (var ca = 0; tableItemWebPageCodeArr.length > ca; ca++) {
                        batchCheckWebPageCode.push(tableItemWebPageCodeArr[ca]);
                    }
                } else {
                    for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {

                        var jishustatus = 0;

                        for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                            if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                                ++jishustatus;
                            }
                        }

                        if (jishustatus == 0) {
                            batchCheckWebPageCode.push(tableItemWebPageCodeArr[i])
                        } else {
                            jishustatus = 0
                        }
                    }
                }
            } else {
                for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {
                    for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                        if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                            batchCheckWebPageCode.splice(j, 1)
                        }
                    }
                }
            }
        }
    });

//	批量收藏
    $('.table-operation-status a').eq(2).click(function () {
        $(this).batchCollect({
            dataUrl: ctx + '/latest/front/collectingAllNews', //请求路径
            dataParam: {'webpageCodeList': batchCheckWebPageCode, 'type': 6},  //传递参数
            callback: function (data) {
                if (data.result) {
                    var obj = data.resultObj;
                    for (var key in obj) {
                        if (obj[key]) {
                            for (var j = 0; tableItemWebPageCodeArr.length > j; j++) {
                                if (key == tableItemWebPageCodeArr[j]) {
                                    $('.inewsOperation').eq(j).find('i:first').attr('class', 'fa fa-heart active');
                                    $('.searchesTable').find('span.check-child').eq(j).removeClass('checked');
                                    $('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
                                }
                            }
                        }
                    }
                    batchCheckWebPageCode = [];
                }
            }
        })
    });
//	批量建稿
    $('.table-operation-status a').eq(3).click(function () {
        $(this).batchBuild({
            dataUrl: ctx + '/latest/front/draft/release/more', //请求路径
            dataParam: {'webpageCodeList': batchCheckWebPageCode},  //传递参数
            callback: function (data, tempwindow) {
                if (data.result) {

                    tempwindow.location = data.resultObj;
                    $('span.check-child').removeClass('checked');
                    batchCheckWebPageCode = [];

                    $('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
                    calendarTable.ajax.reload();
                }

            }
        })
    })

    calendarTable = $('.searchesTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource: ctx + '/calendar/front/getMoreCalendar',//服务器请求
        fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams: function (aoData) {
            var datatime = $('.calendarTimeVal').val();
            aoData.push(
                {"name": "datetime", "value": datatime}
            );
        },

//		       服务器传过来的值
        "rowCallback": function (row, data, index) {
            //checkbox选择
            var checkCon = '<span data-webpagecode="' + data.webpageCode + '" class="check-box check-child"><i class="fa fa-check"></i></span>';
            $('td:eq(0)', row).html(checkCon);

            //摘要,长度超过150截取
            var summary = '';
            if (null != data.cusSummary) {
                if (data.cusSummary.length > 150) {
                    summary = data.cusSummary.substr(0, 150) + '...';
                } else {
                    summary = data.cusSummary;
                }
            } else {
                summary = '暂无摘要';
            }

            //title
            var titleCon = '<a href="' + ctx + '/latest/front/news/detail/' + data.webpageCode + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
            $('td:eq(2)', row).html(titleCon).addClass('titleRightClick');

//    	   相似相关、浏览量
            var sameNum = '(<span class="sameNum' + index + '"></span>)';
            var relevantNum = '(<span class="relevantNum' + index + '"></span>)';
            var browseNum = '<span class="browseNum' + index + '"></span>';
            $('td:eq(4)', row).html(sameNum);
            $('td:eq(5)', row).html(relevantNum);
            $('td:eq(7)', row).html(browseNum);

            //负面指数样式：0-40% 红色  41%-60% 灰色  61%-100% 绿色
            var negative = '';
            var negativeCon = '<span class="negativeNum' + index + '"></span>'
            $('td:eq(6)', row).html(negativeCon);


            //操作
            //var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span>';
            var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> <span><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
            $('td:eq(8)', row).html(operationCon).addClass('inewsOperation').attr('data-id', data.webpageCode);

        },

//		       服务器传过来的值
        columns: [//显示的列
            {data: 'webpageCode', "bSortable": false},
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
//             			判断发布时间是否为当前年份
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
            {data: 'title', "bSortable": false},
            {
                data: 'newsType', "bSortable": false,
                render: function (data, type, row) {
                    if (data.newsType != null && data.newsType != '') {
                        if (data.newsType.label != null && data.newsType.label != null) {
                            return data.newsType.label
                        } else {
                            return '-'
                        }
                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'statEntity', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        if (data.sameNum != null && data.sameNum != '') {
                            return data.sameNum
                        }
                        return '-'
                    } else {
                        return '-'
                    }
                }
            },
            {
                data: 'statEntity', "bSortable": false,
                render: function (data, type, row) {
                    if (data != null && data != '') {
                        if (data.relevantNum != null && data.relevantNum != '') {
                            return data.relevantNum
                        }
                        return '-'
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
                            return data.browseNum
                        }
                        return '-'
                    } else {
                        return '-'
                    }
                }
            },
            {data: 'webpageCode', "bSortable": false}
        ],

        "aaSorting": [[0, ""]],
    });

    $('.searchesTable').on('draw.dt', function () {

        $('.searchesTable').itemCheck({   //给每一条新闻增加单击的事件
            'itemFun': function ($this, statusItem) {
                if (statusItem) {
//					console.log($this[0].attributes[0].nodeValue);
                    batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
                } else {
                    for (var i = 0; batchCheckWebPageCode.length > i; i++) {
                        var webpageCodeItem = $this[0].attributes[0].nodeValue;
                        if (webpageCodeItem == batchCheckWebPageCode[i]) {
                            batchCheckWebPageCode.splice(i, 1);
                        }
                    }
                }
            }
        });

//		点击翻页页面自动移动到上方
        $('.paginate_button').each(function () {
            $(this).click(function () {
                $(this).scrollOffset({
                    'scrollPos': 115
                });
            })
        })

//		相似相关获取
        var textArr = calendarTable.column(2).nodes().data();
        tableItemWebPageCodeArr = [];
        if (textArr.length > 0) {
            var textArrCon = [];
            for (var count = 0; textArr.length > count; count++) {
                tableItemWebPageCodeArr.push(textArr[count].webpageCode);
            }
            //相似
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getSameNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.searchesTable tbody').find('[class*="sameNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			相关
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getRelevantNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.searchesTable tbody').find('[class*="relevantNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			负面指数
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getsentimentindex',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    console.log(data);
                    $('.searchesTable tbody').find('[class*="negativeNum"]').each(function (index) {
                        if (data[index].negative != null && data[index].negative != '') {
                            var colorStyle = ''
                            var negative=data[index].negative;
                            if(negative>40){
                                colorStyle = 'green'
                                $(this).text('-'+negative.toFixed(2));
                            }else{
                                colorStyle = 'red'
                                $(this).text((100-negative).toFixed(2));
                            }
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
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.searchesTable tbody').find('[class*="browseNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			操作-收藏
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getUserFavorites',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.searchesTable tbody').find('.inewsOperation').each(function (index) {
                        if (data[index] == true) {
                            $(this).find('i').eq(0).attr('class', 'fa fa-heart active');
                        } else {

                        }
                    })
                }
            });
//			操作-建稿

            $('.inewsOperation').each(function (index) {
                $(this).find('span').eq(1).releaseBuild({
                    'webpageCode': tableItemWebPageCodeArr[index],
                    'buildingCon': function (_$this) {
                        _$this.find('i').addClass('hide');
                        _$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
                    },
                    'buildedCon': function (_$this) {
                        _$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
                        $("[data-toggle='tooltip']").tooltip();
                        calendarTable.ajax.reload();
                    }
                })
            })
//			建、采
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getDraftType',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data, con) {
                    console.log(data);
                    $('.searchesTable tbody').find('.titleRightClick').each(function (index) {
                        if (data[index][0] == 1) {
                            $(this).find('a').css({'width': '90%'})
                            $(this).append('<span class="label-status label-jian">【建】</span>');
                        } else if (data[index][0] == 2) {
                            $(this).find('a').css({'width': '90%'})
                            $(this).append('<span class="label-status label-cai">【采】</span>');
                        } else {
                        }
                    })
                }
            });

        }


//		datatables翻页时查询页面中是否有选中的新闻
        for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {
            for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                    $('.searchesTable').find('.check-child').eq(i).addClass('checked');
                }
            }
        }

        /*鼠标划入悬停提示*/
        $("[data-toggle='tooltip']").tooltip();
        $("[data-toggle='popover']").popover({
            html: true,
            trigger: 'hover',
        });

//		列表展示方式中的操作的样式
        $('.searchesTable tbody').find('.inewsOperation').each(function () {
            $(this).find('i').each(function (index) {
                $(this).click(function () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        if (index == 0) {
                            $(this).attr('class', 'fa fa-heart-o');
                        }
                        if (index == 1) {
                            $(this).attr('class', 'fa fa-file-text-o');
                        }
                    } else {
                        if (index == 0) {
                            $(this).attr('class', 'fa fa-heart');
                        }
                        if (index == 1) {
                            $(this).attr('class', 'fa fa-file-text');
                        }
                        $(this).addClass('active')
                    }

//					操作-收藏与后台交互
                    if (index == 0) {
                        var webpageCode = $(this).parents('td.inewsOperation').attr('data-id');
                        $().judgeKeep({
                            'dataUrl': ctx + '/latest/front/collectingNews',
                            'dataParam': {'webpageCode': webpageCode, 'type': 6}
                        })
                    }

                })
            })
        });
    })
})