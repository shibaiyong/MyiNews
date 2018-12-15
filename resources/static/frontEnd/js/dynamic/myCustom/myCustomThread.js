var threadAjaxData1,
    thumbnailTable,
    sudokuTable,
    highlightList = [],
    appIdArray,
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = [],//当前页面中显示的列表的webpageCode
    ajaxUrl = '';
    realpage = 0;
    totalpage = 0;
$(function () {
    var loadSuccess = 0
    appIdArray = [];
    chooseSimilarityForFirst();
//	点击刷新，每60秒刷新
    refreshButton();
    $('#ico-heart').click(function () {
        window.location.href = ctx + '/gotouser?skip=collect'
    });
//跳转收藏
    $('.collectButton').click(function () {
        window.location.href = ctx + '/gotocollection'
    })
    /*$('.srceenTimeQuantum').removeClass('hide');*/
    $('.clusterSources').removeClass('hide');
    $('.clusterCarrier').removeClass('hide');
    $('.clusterMap').removeClass('hide');
    $('.clusterFenlei').removeClass('hide');
    $('.screenSearch').removeClass('hide');
    var screenIndex = 0;
    // $('.screenConditionBox .subpage').each(function () {
    //     if ($(this).hasClass('hide')) {
    //         return;
    //     } else {
    //         var mlLeft = 125 * screenIndex;
    //         $(this).css({
    //             'marginLeft': mlLeft + 'px',
    //         })
    //         ++screenIndex;
    //     }
    // })
    $('.screenConditionBox .subpage').each(function () {
        if ($(this).hasClass('hide')) {
            return;
        } else {
            if ($(this).prev().hasClass('srceenTimeQuantum')) {
                if ($(this).prev().hasClass('hide')) {
                    var mlLeft = 125 * screenIndex;
                    $(this).css({
                        'marginLeft': mlLeft + 'px',
                    })
                } else {
                    var mlLeft = 125 * (screenIndex - 1) + 220;
                    $(this).css({
                        'marginLeft': mlLeft + 'px',
                    })
                }
            } else {
                var mlLeft = 125 * screenIndex;
                $(this).css({
                    'marginLeft': mlLeft + 'px',
                })
            }
            ++screenIndex;
        }
    })

//	时间段
    $().getData({
        boxClassName: '.srceenTimeQuantum',
        ulClassName: '#srceenTimeQuantumPro',
    })

    var timeCode = localStorage.customgroup;
//     sourceAndcarrier(timeCode);
//     function sourceAndcarrier(timeCode) {
//         //	来源
//         $.ajax({
//             url: ctx + '/custom/front/listusersource',//这个就是请求地址对应sAjaxSource
//             data: {'timeCode': timeCode},
//             type: 'get',
//             dataType: 'json',
//             async: true,
//             success: function (data) {
//                 console.log(data);
//                 if (data.result == true) {
//                     var obj = data.resultObj;
//                     var content = '';

// //    			添加历史记录
//                     var historyCon = JSON.parse(localStorage.getItem('conditions'));
//                     var historyText = '';
//                     var historyId = '';
//                     for (var i = 0; i < historyCon.length; i++) {

//                         if (historyCon[i]['name'] == 'clusterSources') {
//                             historyText = historyCon[i]['value'];
//                             historyId = historyCon[i]['id']
//                         }
//                     }
//                     if (historyText == '') {
//                         content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
//                     } else {
//                         content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="' + historyId + '"><i class="fa fa-history historyIcon"></i><span class="historyFont">' + historyText + '</span></a></li>';//添加历史记录
//                     }
//                     if (obj.length >= 5) {
//                         content += '<li class=""><a class="ti" href="javascript:void(0);">全部来源</a></li>';
//                     } else {
//                         content += '<li class=""><a class="ti" href="javascript:void(0);">所有定制</a></li>';
//                     }
//                     for (var i = 0; obj.length > i; i++) {
//                         content += '<li class=""><a class="ti" href="#" data-innerid="' + obj[i].labelId + '">' + obj[i].name + '</a></li>';
//                     }
//                     var customType = localStorage.customType
//                     if (customType == "") {
//                         $('#clusterSourcesPro').append(content);
//                     } else {
//                         $('.clusterSources').each(function (a) {
//                             this.style.background = "#999999"
//                         })
//                         $('.clusterSources>h2>i').each(function () {
//                             this.style.display = 'none'
//                         })
//                     }
//                     screenConditionHandler({
//                         className: '.clusterSources',
//                         idName: '#clusterSourcesPro',
//                     });

//                     var prosmoreHeight = $('.clusterSources').find('li').length * 30 + 4;
//                     $('.clusterSources').find('.prosmore').css({
//                         'height': prosmoreHeight + 'px'
//                     })
//                 }
//             }
//         })
//         //	载体
//         $.ajax({
//             url: ctx + '/custom/front/listusercarrier',//这个就是请求地址对应sAjaxSource
//             data: {'timeCode': timeCode},
//             type: 'get',
//             dataType: 'json',
//             async: true,
//             success: function (data) {
//                 console.log(data);
//                 if (data.result == true) {
//                     var obj = data.resultObj;
//                     var content = '';
// //    			添加历史记录
//                     var historyCon = JSON.parse(localStorage.getItem('conditions'));
//                     var historyText = '';
//                     var historyId = '';
//                     for (var i = 0; i < historyCon.length; i++) {

//                         if (historyCon[i]['name'] == 'clusterCarrier') {
//                             historyText = historyCon[i]['value'];
//                             historyId = historyCon[i]['id']
//                         }
//                     }
//                     if (historyText == '') {
//                         content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
//                     } else {
//                         content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="' + historyId + '"><i class="fa fa-history historyIcon"></i><span class="historyFont">' + historyText + '</span></a></li>';//添加历史记录
//                     }
//                     content += '<li class=""><a class="ti" href="javascript:void(0);">全部载体</a></li>';
//                     for (var i = 0; obj.length > i; i++) {
//                         content += '<li class=""><a class="ti" href="#" data-innerid="' + obj[i].labelId + '">' + obj[i].name + '</a></li>';
//                     }
//                     var customType = localStorage.customType
//                     if (customType == "") {
//                         $('#clusterCarrierPro').append(content);
//                     } else {
//                         $('.clusterCarrier').each(function (a) {
//                             this.style.background = "#999999"
//                         })
//                         $('.clusterCarrier>h2').each(function () {
//                             if (customType == "web") {
//                                 this.innerHTML = "网页"
//                             }
//                             if (customType == "weChat") {
//                                 this.innerHTML = "微信"
//                             }
//                             if (customType == "weiBo") {
//                                 this.innerHTML = "微博"
//                             }
//                             if (customType == "app") {
//                                 this.innerHTML = "App"
//                             }
//                         })
//                         $('.clusterCarrier>h2>i').each(function () {
//                             this.style.display = 'none'
//                         })
//                     }
//                     screenConditionHandler({
//                         className: '.clusterCarrier',
//                         idName: '#clusterCarrierPro',
//                     });
//                     var prosmoreHeight = $('.clusterCarrier').find('li').length * 30 + 4;
//                     $('.clusterCarrier').find('.prosmore').css({
//                         'height': prosmoreHeight + 'px'
//                     })
//                 }
//             }
//         })
//     }



//	地区
    var innerid = localStorage.innerId;
    $().getData({
        getAjaxUserConfigUrl: '', //请求路径(用户配置的数据)
        getAjaxUrl: ctx + '/common/dic/front/listRegion', //请求路径
        boxClassName: '.clusterMap',
        ulClassName: '#clusterMapPro',
        level: 3,
        multiSelect: true,
        conditionValue: 'map',
        callback: function () {
            loadSuccess++
            if (loadSuccess == 2) {
                loadTable()
            }
        }
    })

    //	分类
    var innerid = localStorage.innerId;
    $().getData({
        // getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigClassification', //请求路径(用户配置的数据)
        getAjaxUserConfigUrl:'', //请求路径(用户配置的数据)
        getAjaxUrl: ctx + '/common/dic/front/listNewsClassification', //请求路径
        boxClassName: '.clusterFenlei',
        ulClassName: '#clusterFenleiPro',
        level: 2,
        multiSelect: true,
        conditionValue: 'classification',
        callback: function () {
            loadSuccess++
            if (loadSuccess == 2) {
                loadTable()
            }
        }
    })
        // 全部来源
	$().getSignleData({
		getAjaxUrl:ctx+'/custom/front/listusersourceNew?timeCode='+timeCode,  //请求路径
		boxClassName:'.clusterSources',
		ulClassName:'#clusterSourcesPro',
		level:1,
		inter:true,
		conditionValue: 'mediaAlone',
	})
    // 全部载体
	$().getSignleData({
		getAjaxUrl:ctx+'/config/front/listUserConfigCarrier',  //请求路径
		boxClassName:'.clusterCarrier',
		ulClassName:'#clusterCarrierPro',
		level:1,
		inter:true,
		conditionValue: 'carrierAlone',
	})


//	显示线索的标题
    var title = '';
    var dataCustomgroup = '';
    $('.accordion li').each(function () {
        if ($(this).hasClass('open')) {

            dataCustomgroup = $(this).find('.link').attr('data-customgroup');
            title = $(this).find('.link span').text();
            $('.recommend-title h4').text(title).attr('data-customgroup', dataCustomgroup);
        }
    })
    //	切换列表、缩略图、九宫格的展示方式
    $('.dataConShowWays').each(function (index) {
        $(this).click(function () {
            $('.changeStateBtn').removeClass('activeBg');
            $('.dataConShowWays').removeClass('active');
            batchCheckWebPageCode = [];
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
                    var innerid = localStorage.innerId;
                    if (innerid) { //网站 app 微博 微信
                        thumbnailTable = $().thumbnailAjaxData({
                            'requestUrl': ajaxUrl,
                            'getPassValue': getParamsTableForPage,
                        })
                    } else {
                        thumbnailTable = $().thumbnailAjaxData({
                            'requestUrl': ctx + '/custom/front/getMyCustomThread',
                            'getPassValue': getParamsTable,
                        })
                    }
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
                    var innerid = localStorage.innerId;
                    if (innerid) { //网站 app 微博 微信
                        sudokuTable = $().sudokuAjaxData({
                            'requestUrl': ajaxUrl,
                            'getPassValue': getParamsTableForPage,
                        })
                    } else {
                        sudokuTable = $().sudokuAjaxData({
                            'requestUrl': ctx + '/custom/front/getMyCustomThread',
                            'getPassValue': getParamsTable,
                        })
                    }

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
            dataParam: {'webpageCodeList': batchCheckWebPageCode, 'type': 2},  //传递参数
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
                    $('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
                    if ($('.tableListCon').val() == '0') {
                        threadAjaxData1.ajax.reload();
                    } else if ($('.tableListCon').val() == '1') {
                        thumbnailTable.ajax.reload();
                    }
                }

            }
        })
    })
    var innerid = localStorage.innerId;

//	获得ajax返回的获取
    $('.dataConBoxTable').on('xhr.dt', function (e, settings, json, xhr) {
        $('.sortCountButton a').find('span').text(json.iTotalRecords);
        highlightList = json.highlightList
        totalpage = json.iTotalRecords;

    });
    $('.dataConThumbnailTable').on('xhr.dt', function (e, settings, json, xhr) {
        $('.sortCountButton a').find('span').text(json.iTotalRecords);
        highlightList = json.highlightList
        totalpage = json.iTotalRecords;

    });
    $('.dataConSudokuTable').on('xhr.dt', function (e, settings, json, xhr) {
        $('.sortCountButton a').find('span').text(json.iTotalRecords);
        highlightList = json.highlightList
        totalpage = json.iTotalRecords;

    });

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

        //替换总页数
        var pagination = $('#DataTables_Table_0_info').text();
        if( totalpage > 10000){
            pagination = pagination.replace('10,000',totalpage)
            $('#DataTables_Table_0_info').text(pagination);
        }


//		相似相关获取
        var textArr = threadAjaxData1.column(5).nodes().data();
        tableItemWebPageCodeArr = [];
        var otherReleaseDateTimeArr = [];	
        if (textArr.length > 0) {
            for (var count = 0; textArr.length > count; count++) {
                tableItemWebPageCodeArr.push(textArr[count].webpageCode);
                otherReleaseDateTimeArr.push(textArr[count].releaseDatetime);
            }
            //相似
            // $().adraticAjaxData({
            //     'dataUrl': ctx + '/latest/front/getSameNewsNum',
            //     'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
            //     'callback': function (data) {
            //         $('.dataConBoxTable tbody').find('[class*="sameNum"]').each(function (index) {
            //             $(this).text(data[index]);
            //         })
            //     }
            // });

//			相关
//             $().adraticAjaxData({
//                 'dataUrl': ctx + '/latest/front/getRelevantNewsNum',
//                 'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
//                 'callback': function (data) {
//                     $('.dataConBoxTable tbody').find('[class*="relevantNum"]').each(function (index) {
//                         $(this).text(data[index]);
//                     })
//                 }
//             });

//			负面指数
//             $().adraticAjaxData({
//                 'dataUrl': ctx + '/latest/front/getsentimentindex',
//                 'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
//                 'callback': function (data) {
//                     console.log(data);
//                     $('.dataConBoxTable tbody').find('[class*="negativeNum"]').each(function (index) {
//                         if (data[index].negative != null && data[index].negative != '') {
//                             var colorStyle = ''
//                             // if(data[index].negative > 60){
//                             // 	colorStyle = 'red'
//                             // }else
//                             if (data[index].negative > 40) {
//                                 colorStyle = 'gray'
//                             } else {
//                                 colorStyle = 'green'
//                             }
//                             var negative = data[index].negative;
//                             if (negative > 40) {
//                                 $(this).text('-' + negative.toFixed(2));
//                             } else {
//                                 $(this).text((100 - negative).toFixed(2));
//                             }
//                             //$(this).text(data[index].negative);
//                             $(this).addClass(colorStyle);
//                         } else {
//                             $(this).text('-');
//                         }
//                     })
//                 }
//             });
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
                    'releaseDatetime': otherReleaseDateTimeArr[index],
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

//			datatables翻页时查询页面中是否有选中的新闻s
            for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {
                for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                    if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                        $('.dataConBoxTable').find('.check-child').eq(i).addClass('checked');
                    }
                }
            }
        }

//		搜索词高亮显示
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
                    $('.dataConBoxTable').find('td.titleRightClick').find('a[data-id=' + highTitleArr[j].webpageCode + ']').html(highTitleArr[j].title)
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
                            var userCenter = $('.collectButton a');
                            var imgtodrag = $(this);
                            var imgclone = imgtodrag.clone();
                            imgclone.offset({
                                top: imgtodrag.offset().top,
                                left: imgtodrag.offset().left
                            }).css({
                                'opacity': '0.5',
                                'position': 'absolute',
                                'height': '150px',
                                'width': '150px',
                                'z-index': '100',
                                'color': 'red'
                            }).appendTo($('body')).animate({
                                'top': userCenter.offset().top + 15,
                                'left': userCenter.offset().left + 20,
                                'width': 0,
                                'height': 0
                            }, 1000, 'easeInOutExpo', function () {
                                imgclone.remove();
                            });

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
                            'dataParam': {'webpageCode': webpageCode, 'type': 2}
                        })
                    }
                })
            })
        });

    });

//	获得ajax返回的获取
    $('.dataConThumbnailTable').on('xhr.dt', function (e, settings, json, xhr) {
        highlightList = json.highlightList;
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
        //替换总页数
        var pagination = $('#DataTables_Table_1_info').text();
        if( totalpage > 10000){
            pagination = pagination.replace('10,000',totalpage)
            $('#DataTables_Table_1_info').text(pagination);
        }

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
        var releaseDateTimeArr = [];	
        if (thumbnailArr.length > 0) {
            for (var count = 0; thumbnailArr.length > count; count++) {
                tableItemWebPageCodeArr.push(thumbnailArr[count].webpageCode);
                releaseDateTimeArr.push(thumbnailArr[count].releaseDatetime);
            }

            //相似
            // $().adraticAjaxData({
            //     'dataUrl': ctx + '/latest/front/getSameNewsNum',
            //     'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
            //     'callback': function (data) {
            //         $('.dataConThumbnailTable tbody').find('[class*="sameNum"]').each(function (index) {
            //             $(this).text(data[index]);
            //         })
            //     }
            // });

//			相关
//             $().adraticAjaxData({
//                 'dataUrl': ctx + '/latest/front/getRelevantNewsNum',
//                 'dataParam': {'webpageCode': tableItemWebPageCodeArr.join(',')},
//                 'callback': function (data) {
//                     $('.dataConThumbnailTable tbody').find('[class*="relevantNum"]').each(function (index) {
//                         $(this).text(data[index]);
//                     })
//                 }
//             });
            // 浏览量
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
                            $(this).find('a').eq(1).addClass('active');
                            $(this).find('a').eq(1).find('i').attr('class', 'fa fa-heart');
                        } else {

                        }
                    })
                }
            });

            // 操作-建稿
            $('.mediaOperation').each(function (index) {
                $(this).find('a').eq(2).releaseBuild({
                    'webpageCode': tableItemWebPageCodeArr[index],
                    'releaseDatetime': releaseDateTimeArr[index],
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


//		搜索词高亮显示
        var highTitleArr = [];
        if (highlightList != null) {
            for (var log = 0; thumbnailArr.length > log; log++) {
                highTitleArr.push({
                    'webpageCode': thumbnailArr[log].webpageCode,
                    'title': thumbnailArr[log].title
                })
            }

            for (var i = 0; highlightList.length > i; i++) {
                for (var j = 0; highTitleArr.length > j; j++) {
                    highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i], '<span class="red">' + highlightList[i] + '</span>');
                    $('.dataConThumbnailTable').find('.titleRightClick').find('a[data-id=' + highTitleArr[j].webpageCode + ']').html(highTitleArr[j].title)
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
                            'dataParam': {'webpageCode': webpageCode, 'type': 2}
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

        //替换总页数
        var pagination = $('#DataTables_Table_2_info').text();
        if( totalpage > 10000){
            pagination = pagination.replace('10,000',totalpage)
            $('#DataTables_Table_2_info').text(pagination);
        }

    })

    //	含图片与含视频切换
    $('.changeStateBtn').click(function () {
        if ($(this).hasClass('active')) {
//			将时间变量赋值为最近24小时
            $('.dataShowTable').attr('data-once', 'false');
            $('.changeStateBtn').removeClass('active');
            $(this).removeClass('active');

        } else {
            $('.dataShowTable').attr('data-once', 'true');
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
        $('.dataConShowWays').eq(1).click();

    })


    // 地区多选,分类多选
    window.reloadData = function () {
        console.log($('.tableListCon').val());
        if ($('.tableListCon').val() == '0') {
            threadAjaxData1.ajax.reload();
        } else if ($('.tableListCon').val() == '1') {
            thumbnailTable.ajax.reload();
        } else if ($('.tableListCon').val() == '2') {
            sudokuTable.ajax.reload();
        }
        return false;
    };
    // 两套逻辑同时引入后，加以区分
    window.signleReloadData = function () {
        console.log($('.tableListCon').val());
        if ($('.tableListCon').val() == '0') {
            threadAjaxData1.ajax.reload();
        } else if ($('.tableListCon').val() == '1') {
            thumbnailTable.ajax.reload();
        } else if ($('.tableListCon').val() == '2') {
            sudokuTable.ajax.reload();
        }
        return false;
    };
     

    //	点击来源刷新列表
    $('#clusterSourcesPro').click(function () {
        // var customType = localStorage.customType
        // if (customType == "") {
        //     if ($('.tableListCon').val() == 0) {
        //         threadAjaxData1.ajax.reload();
        //     } else if ($('.tableListCon').val() == 1) {
        //         thumbnailTable.ajax.reload();
        //     } else if ($('.tableListCon').val() == 2) {
        //         sudokuTable.ajax.reload();
        //     }
        // }
        // return false;
    })

    //	点击载体刷新列表
    $('#clusterCarrierPro').click(function () {
        // if ($('.tableListCon').val() == 0) {
        //     threadAjaxData1.ajax.reload();
        // } else if ($('.tableListCon').val() == 1) {
        //     thumbnailTable.ajax.reload();
        // } else if ($('.tableListCon').val() == 2) {
        //     sudokuTable.ajax.reload();
        // }
        // return false;
    })

    // 点击时间段刷新列表
    $('#srceenTimeQuantumPro').click(function () {
        if ($('.tableListCon').val() == 0) {
            threadAjaxData1.ajax.reload();
        } else if ($('.tableListCon').val() == 1) {
            thumbnailTable.ajax.reload();
        } else if ($('.tableListCon').val() == 2) {
            sudokuTable.ajax.reload();
        }
        return false;
    })
    // 相似合并
    $('.changeState').click(function () {
        $('.dataShowTable').attr('data-once', 'true');
        if ($(this).hasClass('activeBg')) {
            $(this).removeClass('activeBg');
        } else {
            $(this).addClass('activeBg');
        }

        if ($('.tableListCon').val() == 0) {
            threadAjaxData1.ajax.reload();
        } else if ($('.tableListCon').val() == 1) {
            thumbnailTable.ajax.reload();
        } else if ($('.tableListCon').val() == 2) {
            sudokuTable.ajax.reload();
        }
    })
    // 展示条数的样式
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


    // iSearch点击查询
    $('.customAddBtn').customInputClickBtn({
        'refreshTable': function () {
            if ($('.tableListCon').val() == 0) {
                threadAjaxData1.ajax.reload();
            } else if ($('.tableListCon').val() == 1) {
                thumbnailTable.ajax.reload();
            } else if ($('.tableListCon').val() == 2) {
                sudokuTable.ajax.reload();
            }
        },
        'callBack': function (customAddVal) {
            $('.sortCountButton').removeClass('hide');
        }
    })

    // iSearch加载本地数据
    customAddVal = JSON.parse(localStorage.getItem('isearch'));
    $(".customAddInput").parseLocalArrayData({
        'dataSources': customAddVal,
        'afterSelect': function () {
            if ($('.tableListCon').val() == 0) {
                threadAjaxData1.ajax.reload();
            } else if ($('.tableListCon').val() == 1) {
                thumbnailTable.ajax.reload();
            } else if ($('.tableListCon').val() == 2) {
                sudokuTable.ajax.reload();
            }
        }
    });

    // 删除
    $('.deleteCustom').click(function () {
        $('#deleteAll').modal();
        $('.determine').click(function () { //模态框点击确定
            $('#deleteAll').modal('hide');
            $.ajax({
                url: ctx + '/custom/front/delete',//这个就是请求地址对应sAjaxSource
                data: {timeCode: timeCode},
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    console.log(data);
                    if (data.result == true) {
                        window.location.reload();
                    }
                }
            })
        })
//		    	    	模态框点击失败
        $('.cancel').click(function () {
            $('#deleteAll').modal('hide');
        })
    })

    // 编辑定制页
    $('.editCustom').click(function () {
        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoAddMyCustom');
    })
    $(".closeInput").click(function () {
        $(".customAddInput").val("");
        $(".closeInput")[0].style.visibility = "hidden"
    })
    document.getElementsByClassName("customAddInput")[0].oninput = function (ev) {
        var value = $(".customAddInput").val();
        console.log(value)
        if (value != "") {
            $(".closeInput")[0].style.visibility = "visible"
        } else {
            $(".closeInput")[0].style.visibility = "hidden"
        }
    }
    document.getElementsByClassName("customAddInput")[0].onfocus = function (ev) {
        var value = $(".customAddInput").val();
        console.log(value)
        if (value != "") {
            $(".closeInput")[0].style.visibility = "visible"
        } else {
            $(".closeInput")[0].style.visibility = "hidden"
        }
    }
})

/**
 * 列表参数的获取
 */
function getParamsTable(aoData) {
//	线索的timeCode
    var timeCode = localStorage.customgroup;
//	地区
    var regions = [];
    var regionsId = $('.clusterMap h2').attr('data-innerid');
    regions.push(regionsId);

//	分类
    var classifications = [];
    var classificationsId = $('.clusterFenlei h2').attr('data-innerid');
    classifications.push(classificationsId);

//	机构来源
    var sourcesOrg = [];
    var sourcesOrgId = $('.clusterSources h2').attr('data-innerid');
    sourcesOrg.push(sourcesOrgId);

//	载体
    var carrierOrg = [];
    var carrierOrgId = $('.clusterCarrier h2').attr('data-innerid');
    carrierOrg.push(carrierOrgId);

//	是否相似
    var showSimilar = '';
    if ($('.changeState').hasClass('activeBg')) {
        showSimilar = new Boolean(false);
    } else {
        showSimilar = new Boolean(true);
    }

//	含图片、含视频
    var mediaStatus = '';
    $('.changeStateBtn').each(function (index) {
        if ($(this).hasClass('active')) {
            if ($(this).text() == '含图片') {
                mediaStatus = '2'
            } else {
                mediaStatus = '1'
            }
        }
    })

//	时间
    var startTime;
    var endTime;
    var timeQuantum = '';


//	查询iSearch
    var queryStr = [];
    var queryStrVal = $.trim($('.customAddInput').val());
    queryStr.push(queryStrVal);

    if (timeQuantum != '') {
        aoData.push(
            {'name': 'startTime', 'value': startTime},
            {'name': 'endTime', 'value': endTime}
        )
    }
    aoData.push(
        {'name': 'regions', 'value': regions},
        {'name': 'classifications', 'value': classifications},
        {'name': 'sourcesOrg', 'value': sourcesOrg},
        {'name': 'carrier', 'value': carrierOrg},
        {'name': 'showSimilar', 'value': showSimilar},
        {'name': 'mediaStatus', 'value': mediaStatus},
        {'name': 'queryStr', 'value': queryStr},
        {'name': 'timeCode', 'value': timeCode}
    )


    return aoData;
}

function getParamsTableForPage(aoData) {
//	地区
    var regions = [];
    var regionsId = $('.clusterMap h2').attr('data-innerid');
    regions.push(regionsId);
//	分类
    var classifications = [];
    var classificationsId = $('.clusterFenlei h2').attr('data-innerid');
    classifications.push(classificationsId);
//
// //	机构来源
//     var sourcesOrg = [];
//
//     var plug = '';
//     if (localStorage.customType == "weChat") {
//         plug = localStorage.innerId
//     }
//     var sourcesOrgId = plug;
//
//     sourcesOrg.push(plug);
//
// //	爬取来源
//     var sourcesCrawl = [];
//     var plugCrawl = ""
//     if (localStorage.customType != "weChat") {
//         plugCrawl = localStorage.innerId
//     }
//     sourcesCrawl.push(plugCrawl);
    var innerId = localStorage.innerId
    var customType = localStorage.customType
    var sourcesOrg = [];
    var websiteIds = [];
    var sourceCode = [];
    if (innerId == "loadTotalListWeb") {
        sourcesOrg.push("");
        for (var i = 0; i < webIdsList.length; i++) {
            websiteIds.push(webIdsList[i]);
        }
    } else if (innerId == "loadTotalListApp") {
        sourcesOrg.push("");
        for (var i = 0; i < appIdsList.length; i++) {
            websiteIds.push(appIdsList[i]);
        }
    } else if (innerId == "loadTotalListWeChat") {
        sourcesOrg.push("");
        websiteIds.push("");
        for (var i = 0; i < wechatIdsList.length; i++) {
            sourceCode.push(wechatIdsList[i]);
        }
    } else if (innerId == "loadTotalListWeiBo") {
        sourcesOrg.push("");
        websiteIds.push("");
        for (var i = 0; i < weibodsList.length; i++) {
            sourceCode.push(weibodsList[i]);
        }
    } else if (localStorage.customType == "weChat" || localStorage.customType == "weiBo") {
        sourceCode.push(localStorage.innerId);
    } else {
        websiteIds.push(localStorage.innerId);

    }
    // 是否相似
    var showSimilar = '';
    if ($('.changeState').hasClass('activeBg')) {
        showSimilar = new Boolean(false);
    } else {
        showSimilar = new Boolean(true);
    }
    // 含图片、含视频
    var mediaStatus = '';
    $('.changeStateBtn').each(function (index) {
        if ($(this).hasClass('active')) {
            if ($(this).text() == '含图片') {
                mediaStatus = '2'
            } else {
                mediaStatus = '1'
            }
        }
    })

    var queryStr = [];
    var queryStrVal = $.trim($('.customAddInput').val());
    queryStr.push(queryStrVal);
    if (localStorage.customType == "weChat") {
        aoData.push(
            {'name': 'regions', 'value': regions},
            {'name': 'classifications', 'value': classifications},
            {'name': 'sourcesOrg', 'value': sourcesOrg},
            {'name': 'showSimilar', 'value': showSimilar},
            {'name': 'mediaStatus', 'value': mediaStatus},
            {'name': 'queryStr', 'value': queryStr},
            // {'name': 'websiteIds', 'value': websiteIds},
            {'name': 'timeCode', 'value': ""},
            {'name': 'websiteIds','value': sourceCode}
        )
    } else if (localStorage.customType == "weiBo") {
        aoData.push(
            {'name': 'regions', 'value': regions},
            {'name': 'classifications', 'value': classifications},
            {'name': 'sourcesOrg', 'value': sourcesOrg},
            {'name': 'showSimilar', 'value': showSimilar},
            {'name': 'mediaStatus', 'value': mediaStatus},
            {'name': 'queryStr', 'value': queryStr},
            {'name': 'timeCode', 'value': ""},
            {'name': 'websiteIds','value': sourceCode}
        )
    } else {
        aoData.push(
            {'name': 'regions', 'value': regions},
            {'name': 'classifications', 'value': classifications},
            {'name': 'sourcesOrg', 'value': sourcesOrg},
            {'name': 'websiteIds', 'value': websiteIds},
            {'name': 'showSimilar', 'value': showSimilar},
            {'name': 'mediaStatus', 'value': mediaStatus},
            {'name': 'queryStr', 'value': queryStr},
            {'name': 'isSticked', 'value': 0},
            {'name': 'showClue', 'value': false}
        )
    }


    return aoData;
}

/*每隔60秒刷险一次列表*/
function refreshButton() {
    var init;
    var flage1 = false
    var flage2 = false
    $('#ico-refresh').click(function () {
        if (flage1) {
            return
        }
        if ($(this).find('i').hasClass('rotateLong')) {
            $(this).find('i').removeClass('rotateLong');
        } else {
            $(this).find('i').addClass('rotateLong');
        }
        flage1 = true
        $('.refreshButton').click();
        setTimeout(function () {
            flage1 = false
        }, 1000)
    })
    $('.refreshButton').click(function () {
        if (flage2) {
            return
        }
        if ($(this).hasClass('fa-spin')) {
            $(this).removeClass('fa-spin');
            clearInterval(init);
        } else {
            $(this).addClass('fa-spin');
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
        flage2 = true
        $('#ico-refresh').click();
        setTimeout(function () {
            flage2 = false
        }, 1000)
    });
}

function showRefreshNum(num) {
    $("#refresh-dialog")[0].innerHTML = num;
    $("#refresh-dialog").show()
    var mousrFun = function () {
        setTimeout(function () {
            $("#refresh-dialog")[0].style.display = "none"
        }, 1000)
        document.removeEventListener("mousemove", mousrFun)
    }
    document.addEventListener("mousemove", mousrFun)
}

function chooseSimilarityForFirst() {
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    // 遍历匹配
    var username = "";
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == "username") {
            username = arr[1];
        }
    }
    var isFirst = localStorage.getItem(username + "chooseSimilarityForFirst")
    if (!isFirst) {
        localStorage.setItem(username + "chooseSimilarityForFirst", "1")
        $('#cannotSkipDialog').modal('show');
        $('#cannotSkipDialog .modal-body p').text('开启相似合并后将不显示相似新闻，取消合并后将再次显示，是否仍继续合并？');
        $('#cannotSkipDialog .modal-body .btn-red').text('确定');
        $('#cannotSkipDialog .modal-body .btn-default').text('取消');
        $(".confirm-myCustom").click(function () {

        })
        $(".cancel-myCustom").click(function () {
            $('.changeState').click();
        })
        $('.btn-red').click(function () {
            if (callback1) {
                callback1()
            } else {
                return false;
            }
        })
    }

}

function getParamsTableForWechatOrWeibo(aoData) {
    // 线索的timeCode
    var timeCode = '';
    $('.accordion li').each(function () {
        if ($(this).hasClass('open')) {
            timeCode = $(this).find('.link').attr('data-customgroup');
        }
    })
    // 地区
    var regions = [];
    var regionsId = $('.srceenMap h2').attr('data-innerid');
    regions.push(regionsId);

    // 分类
    var classifications = [];
    var classificationsId = $('.srceenClassification h2').attr('data-innerid');
    classifications.push(classificationsId);

    // 来源
    var sourcesOrg = [];
    var sourcesOrgId = $('.srceenSources h2').attr('data-innerid');
    sourcesOrg.push(sourcesOrgId);

    // 是否相似
    var showSimilar = '';
    if ($('.changeState').hasClass('activeBg')) {
        showSimilar = new Boolean(false);
    } else {
        showSimilar = new Boolean(true);
    }

    // 含图片、含视频
    var mediaStatus = '';
    $('.changeStateBtn').each(function (index) {
        if ($(this).hasClass('active')) {
            if ($(this).text() == '含图片') {
                mediaStatus = '2'
            } else {
                mediaStatus = '1'
            }
        }
    })

    // 查询iSearch
    var queryStr = [];
    var queryStrVal = $.trim($('.customAddInput').val());
    queryStr.push(queryStrVal);
    aoData.push(
        {'name': 'regions', 'value': regions},
        {'name': 'classifications', 'value': classifications},
        {'name': 'sourcesOrg', 'value': sourcesOrg},
        {'name': 'showSimilar', 'value': showSimilar},
        {'name': 'mediaStatus', 'value': mediaStatus},
        {'name': 'queryStr', 'value': queryStr},
        {'name': 'timeCode', 'value': timeCode}
    )
    return aoData;
}

function loadTable() {
    var innerid = localStorage.innerId;
    if (!innerid) {
        //表格进行数据传值建
        threadAjaxData1 = $().threadAjaxData({
            'requestUrl': ctx + '/custom/front/getMyCustomThread',
            'getPassValue': getParamsTable
        });
    } else {
        ///getMyCustomSiteAndApp
        var newsType = localStorage.customType;
        if (newsType == "weChat") {
            ajaxUrl = ctx + '/custom/front/getMyCustomWechat';
        } else if (newsType == "weiBo") {
            ajaxUrl = ctx + '/custom/front/getMyCustomMicroblog';
        } else {
            ajaxUrl = ctx + '/custom/front/getMyCustomSiteAndApp';
        }
        threadAjaxData1 = $().threadAjaxData({
            'requestUrl': ajaxUrl,
            'getPassValue': getParamsTableForPage
        });
    }
}