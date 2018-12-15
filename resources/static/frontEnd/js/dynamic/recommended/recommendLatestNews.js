var threadAjaxData1,
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function () {
    refreshButton();
    $('.table-operation').hide();
    $('.showBranches').each(function () {
        $(this).click(function () {
            $('.showBranches').removeClass('active');
            $(this).addClass('active');
            var displayLength = $(this).find('a').text();
            if ($('.tableListCon').val() == 0) {
                threadAjaxData1.ajax.reload();
                threadAjaxData1.page.len(displayLength).draw();
            }

        })
    });

    $('.changeState').each(function (index) {
        $(this).click(function () {
            if ($(this).hasClass('activeBg')) {
                $(this).removeClass('activeBg');
            } else {
                $(this).addClass('activeBg');
            }
            if (index == 0) {
                threadAjaxData1.ajax.reload();
            }
        })
    });

//	含图片与含视频切换
    $('.changeStateBtn').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.changeStateBtn').removeClass('active');
            $(this).addClass('active');
        }

        if ($('.tableListCon').val() == 0) {
            threadAjaxData1.ajax.reload();
        } else if ($('.tableListCon').val() == 1) {
            thumbnailTable.ajax.reload();
        } else if ($('.tableListCon').val() == 2) {
            sudokuTable.ajax.reload();
        }
    })

    //	机构来源获取与点击查询
    getSourcesData();

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
            dataParam: {'webpageCodeList': batchCheckWebPageCode, 'type': 1},  //传递参数
            callback: function (data) {
                if (data.result) {
                    var obj = data.resultObj;
                    for (var key in obj) {
                        if (obj[key]) {
                            for (var j = 0; tableItemWebPageCodeArr.length > j; j++) {
                                if (key == tableItemWebPageCodeArr[j]) {
                                    if ($('.tableListCon').val() == '0') {
                                        $('.inewsOperation').eq(j).find('i:first').attr('class', 'fa fa-heart active');
                                        $('.dataConBoxTable').find('span.check-child').eq(j).removeClass('checked');
                                    } else if ($('.tableListCon').val() == '1') {
                                        $('.mediaOperation').eq(j).find('a').eq(1).addClass('active').find('i').attr('class', 'fa fa-heart');
                                        $('.dataConThumbnailTable').find('span.check-child').eq(j).removeClass('checked');
                                    }
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

                    if ($('.tableListCon').val() == '0') {
                        threadAjaxData1.ajax.reload();
                    } else if ($('.tableListCon').val() == '1') {
                        thumbnailTable.ajax.reload();
                    }
                }

            }
        })
    })
//	切换列表、缩略图、九宫格的展示方式
    $('.dataConShowWays').each(function (index) {
        $(this).click(function () {
            $('.changeStateBtn').removeClass('activeBg');
            $('.dataConShowWays').removeClass('active');
            tableItemWebPageCodeArr = [];
            $(this).addClass('active');
            if (index == 0) {

                threadAjaxData1.ajax.reload();

                $('.dataShowTable').removeClass('hide');
                $('.dataConThumbnail').addClass('hide');
                $('.dataConSudoku').addClass('hide');

                $('.showBranches').each(function (index) {
                    $(this).removeAttr('style');
                    $(this).find('a').removeAttr('style');
                    $('.showBranches').each(function () {
                        $(this).click(function () {
                            $(this).addClass('active').siblings('.showBranches').removeClass('active');
                            var displayLength = $(this).find('a').text();
                            $('.tableListLength').val(displayLength);
                            if ($('.tableListCon').val() == 0) {
                                threadAjaxData1.ajax.reload();
                                threadAjaxData1.page.len(displayLength).draw();
                            }
                        })
                    });
                });
                $('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
                $('.tableListCon').val('0');
            } else if (index == 1) {
                if ($(this).attr('data-show') == 'true') {
                    thumbnailTable = $().thumbnailAjaxData({
                        'requestUrl': ctx + '/latest/front/pageLatestNews',
                        'getPassValue': getPassValue,
                    })
                    $(this).attr('data-show', 'false');
                } else {
                    thumbnailTable.ajax.reload();
                }
                $('.dataShowTable').addClass('hide');
                $('.dataConThumbnail').removeClass('hide');
                $('.dataConSudoku').addClass('hide');

                $('.showBranches').each(function () {
                    $(this).css({
                        'cursor': 'not-allowed',
                        'background': '#fff'
                    });
                    $(this).find('a').css({
                        'color': '#ccc',
                        'cursor': 'not-allowed',
                    });
                    $(this).unbind('click');
                })

                $('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
                $('.tableListCon').val('1');
            } else if (index == 2) {


                if ($(this).attr('data-show') == 'true') {
                    sudokuTable = $().sudokuAjaxData({
                        'requestUrl': ctx + '/latest/front/pageLatestNews',
                        'getPassValue': getPassValue,
                    })
                    $(this).attr('data-show', 'false');
                } else {
                    sudokuTable.ajax.reload();
                }
                $('.dataShowTable').addClass('hide');
                $('.dataConThumbnail').addClass('hide');
                $('.dataConSudoku').removeClass('hide');

                $('.showBranches').each(function () {
                    $(this).css({
                        'cursor': 'not-allowed',
                        'background': '#fff'
                    });
                    $(this).find('a').css({
                        'color': '#ccc',
                        'cursor': 'not-allowed',
                    });
                    $(this).unbind('click');
                })
                $('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
                $('.tableListCon').val('2');
            }
        })
    });


    //表格进行数据传值

    $('.dataConBoxTable').on('draw.dt', function () {

        $('.dataConBoxTable').itemCheck({   //给每一条新闻增加单击的事件
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

//		相关获取
        var textArr = threadAjaxData1.column(5).nodes().data();
        tableItemWebPageCodeArr = [];
        if (textArr.length > 0) {
            for (var count = 0; textArr.length > count; count++) {
                tableItemWebPageCodeArr.push(textArr[count].webpageCode);
            }
            //相似
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getSameNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConBoxTable tbody').find('[class*="sameNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			相关
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getRelevantNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConBoxTable tbody').find('[class*="relevantNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });
//		浏览量
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getBrowseNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConBoxTable tbody').find('[class*="browseNum"]').each(function (index) {
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
                    $('.dataConBoxTable tbody').find('[class*="negativeNum"]').each(function (index) {
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

//			操作-收藏
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getUserFavorites',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConBoxTable tbody').find('.inewsOperation').each(function (index) {
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
                        threadAjaxData1.ajax.reload();
                    }
                })
            })
//			建、采
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getDraftType',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data, con) {
                    console.log(data);
                    $('.dataConBoxTable tbody').find('.titleRightClick').each(function (index) {
                        if (data[index][0] == 1) {
                            $(this).find('a').css({
                                'width': '90%'
                            })
                            $(this).append('<span class="label-status label-jian">【建】</span>');
                        } else if (data[index][0] == 2) {
                            $(this).find('a').css({
                                'width': '90%'
                            })
                            $(this).append('<span class="label-status label-cai">【采】</span>');
                        } else {
                        }
                    })
                }
            });
//			datatables翻页时查询页面中是否有选中的新闻
            for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {
                for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                    if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                        $('.dataConBoxTable').find('.check-child').eq(i).addClass('checked');
                    }
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
        $('.dataConBoxTable tbody').find('.inewsOperation').each(function () {
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
                            'dataParam': {'webpageCode': webpageCode, 'type': 1}
                        })
                    }
                })
            })
        });
    });

    $('.dataConThumbnailTable').on('draw.dt', function () {
        /*缩略图详情省略*/
        $('.dataConThumbnailTable').find('.mediaConSummary').each(function () {
            if ($(this).height() >= 63) {
                $(this).css({
                    'height': 63,
                });
                $(this).dotdotdot({
                    wrap: 'letter'
                });
            }
        });


        $('.dataConThumbnailTable').itemCheck({   //给每一条新闻增加单击的事件
            'itemFun': function ($this, statusItem) {
                if (statusItem) {
//					console.log($this);
                    batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
                } else {
                    for (var i = 0; batchCheckWebPageCode.length > i; i++) {
                        var webpageCodeItem = $this[0].attributes[0].nodeValue;
                        if (webpageCodeItem == batchCheckWebPageCode[i]) {
                            batchCheckWebPageCode.splice(i);
                        }
                    }
                }
            }
        });

        var thumbnailArr = thumbnailTable.column(1).nodes().data();
        tableItemWebPageCodeArr = [];
        if (thumbnailArr.length > 0) {
            for (var count = 0; thumbnailArr.length > count; count++) {
                tableItemWebPageCodeArr.push(thumbnailArr[count].webpageCode);
            }

            //相似
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getSameNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConThumbnailTable tbody').find('[class*="sameNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			相关
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getRelevantNewsNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConThumbnailTable tbody').find('[class*="relevantNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });
//		浏览量
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getBrowseNum',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConThumbnailTable tbody').find('[class*="browseNum"]').each(function (index) {
                        $(this).text(data[index]);
                    })
                }
            });

//			操作-收藏
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getUserFavorites',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConThumbnailTable tbody').find('.mediaOperation').each(function (index) {
                        if (data[index] == true) {
                            $(this).find('a').eq(1).find('i').attr('class', 'fa fa-heart active');
                        } else {

                        }
                    })
                }
            });

//			操作-收藏
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getUserFavorites',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data) {
                    $('.dataConThumbnailTable tbody').find('.mediaOperation').each(function (index) {
                        if (data[index] == true) {
                            $(this).find('a').eq(1).addClass('active');
                            $(this).find('a').eq(1).find('i').attr('class', 'fa fa-heart');
                        } else {

                        }
                    })
                }
            });

//			操作-建稿

            $('.mediaOperation').each(function (index) {
                $(this).find('a').eq(2).releaseBuild({
                    'webpageCode': tableItemWebPageCodeArr[index],
                    'buildingCon': function (_$this) {
                        _$this.html('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>&nbsp;建稿中...');
                    },
                    'buildedCon': function (_$this) {
                        _$this.html('<i class="fa fa-file-text"></i>建稿');
                        thumbnailTable.ajax.reload();
                    }
                })
            });

//			建、采
            $().adraticAjaxData({
                'dataUrl': ctx + '/latest/front/getDraftType',
                'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
                'callback': function (data, con) {
                    $('.dataConThumbnailTable tbody').find('.titleRightClick').each(function (index) {
                        if (data[index].length > 0) {
                            if (data[index][0] == 1) {
                                $(this).find('a').css({
                                    'width': '90%'
                                });
                                $(this).append('<span class="label-status label-jian">【建】</span>');
                            } else if (data[index][0] == 2) {
                                $(this).find('a').css({
                                    'width': '90%'
                                });
                                $(this).append('<span class="label-status label-cai">【采】</span>');
                            } else {
                            }
                        }

                    })
                }
            });


//			datatables翻页时查询页面中是否有选中的新闻
            for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {
                for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                    if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                        $('.dataConThumbnailTable').find('.check-child').eq(i).addClass('checked');
                    }
                }
            }
        }

        $('.dataConThumbnailTable tbody').find('p.mediaOperation').each(function () {
            $(this).find('a').each(function (index) {
                $(this).click(function () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        if (index == 1) {
                            $(this).find('i').attr('class', 'fa fa-heart-o');
                        }
                        if (index == 2) {
                            $(this).find('i').attr('class', 'fa fa-file-text-o');
                        }
                    } else {
                        $(this).addClass('active');
                        if (index == 1) {
                            $(this).find('i').attr('class', 'fa fa-heart');
                        }
                        if (index == 2) {
                            $(this).find('i').attr('class', 'fa fa-file-text');
                        }
                    }
//					操作-收藏与后台交互
                    if (index == 1) {
                        var webpageCode = $(this).parents('p.mediaOperation').attr('data-id');
                        $().judgeKeep({
                            'dataUrl': ctx + '/latest/front/collectingNews',
                            'dataParam': {'webpageCode': webpageCode, 'type': 1}
                        })
                    }
                })
            })
        })

    });

    $('.dataConSudokuTable').on('draw.dt', function () {
        $('.dataConSudokuTable').find('.sudokuSummary').each(function () {
            if ($(this).height() >= 132) {
                $(this).css({
                    'height': 132,
                });
                $(this).dotdotdot({
                    wrap: 'letter'
                });
            }
        });

    })

    //从推荐系统获取推荐新闻
    getRecommendNews(0);

})

/**
 * 查询来源数据
 */

function getSourcesData() {
    $.ajax({
        url: ctx + '/common/dic/front/listSourceOrg',//这个就是请求地址对应sAjaxSource
//        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.result == true) {
                var obj = data.resultObj;

                var content = '';
                content += '<li role="presentation" class="sourcesItem"><a role="menuitem" tabindex="-1" href="#" data-innerid="">全部</a></li>';
                for (var count = 0; obj.length > count; count++) {
                    content += '<li role="presentation" class="sourcesItem"><a role="menuitem" tabindex="-1" href="#" data-innerid="' + obj[count].innerid + '">' + obj[count].name + '</a></li>'
                }
                $('#sourceSelect').append(content);

                $('.dropdown-menu .sourcesItem').each(function () {
                    $(this).click(function () {
                        $('#sourcesCon').html($(this).text() + '<span class="caret"></span>').attr('data-innerid', $(this).find('a').attr('data-innerid'));
                        threadAjaxData1.ajax.reload();
                    })
                })
            }
        }
    })
}


function getPassValue(aoData) {

//	机构来源
    var sourcesOrg = [];
    var sourcesOrgId = $('.sourcechooseButton .dropdown').find('a').attr('data-innerid');
    sourcesOrg.push(sourcesOrgId);


//	是否相似
    var showSimilar = '';
    if ($('.changeState').hasClass('activeBg')) {
        showSimilar = new Boolean(false);
    } else {
        showSimilar = new Boolean(true);
    }

//	含图片、含视频
    var mediaStatus;
    $('.changeStateBtn').each(function (index) {
        if ($(this).hasClass('active')) {
            if ($(this).text() == '含图片') {
                mediaStatus = '2'
            } else {
                mediaStatus = '1'
            }
        }
    })

//	时间time 
//	var startTime;
//	var endTime;
//	if(regions[0] == '' && classifications[0] == '' && sourcesOrg[0] == '' && sourcesCrawl[0] == ''){
//		startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)).toUTCString();
//		endTime = new Date().toUTCString();
//	}else{
//		startTime = null;
//		endTime = null;
//	}

    aoData.push(
        {'name': 'sourcesOrg', 'value': sourcesOrg},
        {'name': 'showSimilar', 'value': showSimilar},
        {'name': 'mediaStatus', 'value': mediaStatus},
        {"name": "recommendType", "value": 0}
    );
    return aoData;
}

/*每隔60秒刷险一次列表*/
function refreshButton() {
    var init;
    $('.refreshButton').click(function () {

        var _$this = $(this).find('i');
        if (_$this.hasClass('fa-spin')) {
            _$this.removeClass('fa-spin');
            clearInterval(init);
        } else {
            _$this.addClass('fa-spin');
            init = setInterval(function () {
                if ($('.tableListCon').val() == 0) {
                    threadAjaxData1.ajax.reload();
                } else if ($('.tableListCon').val() == 1) {
                    thumbnailTable.ajax.reload();
                } else if ($('.tableListCon').val() == 2) {
                    sudokuTable.ajax.reload();
                }
            }, 60000);
        }

    });
}

/**
 * 从推荐系统获取推荐新闻
 */
function getRecommendNews(recommendType) {
    $.ajax({
        url: ctx + '/recommend/front/get?recommendType=' + recommendType,//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data.result == true) {
                if ($('.tableListCon').val() == 0) {
                    threadAjaxData1 = $().threadAjaxData({
                        'requestUrl': ctx + '/recommend/front/news/page',
                        'getPassValue': getPassValue
                    });
                } else if ($('.tableListCon').val() == 1) {
                    thumbnailTable.ajax.reload();
                } else if ($('.tableListCon').val() == 2) {
                    sudokuTable.ajax.reload();
                }
            }
        }
    })
}

