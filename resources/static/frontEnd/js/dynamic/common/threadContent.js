(function ($) {
    "use strict";
    /**
     * Description：新闻库、新闻线索、为你推荐-线索、我的定制-线索中的列表
     */
    $.fn.threadAjaxData = function (options) {
        var defaults = {
            requestUrl: '',  //请求路径
            getPassValue: '', //需要入的值
        };
        var options = $.extend(defaults, options);
        var webpageCodes = [];
        var parame;
        var scrollCon = '';
        if ($('body').width() < 768) {
            scrollCon = true;
        }
        var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
        var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
        var scrollCon = '';
        var pagingTypeCon = 'full_numbers';

        var tableThread = $('.dataConBoxTable').DataTable({
            bRetrieve: true,
            dom: domString,
            oLanguage: {
                "sZeroRecords" : "没有可以显示的数据",
                "sProcessing" : "正在获取数据，请稍后...",

                "sInfo" : totalCount
            },
            scrollX: scrollCon,
            serverSide: true,//标示从服务器获取数据
            sAjaxSource: options.requestUrl,//服务器请求
            fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
            fnServerParams: function (aoData) {
//		       	给服务器传的值
                aoData = options.getPassValue(aoData);
                parame = aoData;
            },
//		       服务器传过来的值
            "rowCallback": function (row, data, index) {
                //console.log(data);
                webpageCodes.push(data.webpageCode);
                //摘要,长度超过150截取
                var summary = '';
                var isearchVal = $('.customAddInput').val();
                if (null != data.cusSummary) {
                    if (data.cusSummary.length > 150) {
                        summary = data.cusSummary.substr(0, 150) + '...';
                    } else {
                        summary = data.cusSummary;
                    }
//			    	   标题跳转详情，如果是视频跳转原文
                    var linkUrl;
                    if (isearchVal != '' && isearchVal != undefined) {
                        linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode +'/'+data.releaseDatetime+'?queryStr=' + isearchVal;
                    } else {
                        linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode+'/'+data.releaseDatetime;
                    }

                    //title
                    var titleCon = '<a href="' + linkUrl + '" target="_blank" class="beyondEllipsis" tabindex="0" data-id="' + data.webpageCode + '"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="' + summary + '">' + data.title + '</a>'
                } else {
                    summary = '暂无摘要';
                    //标题跳转详情，如果是视频跳转原文
                    var linkUrl;

                    if (isearchVal != '' && isearchVal != undefined) {
                        linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode +'/'+data.releaseDatetime+'?queryStr=' + isearchVal;
                    } else {
                        linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode+'/'+data.releaseDatetime;
                    }
                    //title
                    var titleCon = '<a href="' + linkUrl + '" target="_blank" class="beyondEllipsis"  data-id="' + data.webpageCode + '">' + data.title + '</a>'

                }
                if(data.title){
                    $('td:eq(1)', row).html(titleCon).addClass('titleRightClick');
                }


//		    	   相似相关、浏览量
                var sameNum = '<span class="sameNum' + index + '">'+data.relevantNewsNum+'</span>';
                var relevantNum = '<span class="relevantNum' + index + '">'+data.sameNewsNum+'</span>';

                $('td:eq(4)', row).html(sameNum + '/' + relevantNum);

                //负面指数样式：>40% 绿色   <40%红色
                //负面指数样式：>40% 绿色   <40%红色
                //负面指数样式：>40% 绿色   <40%红色
                var negative = (data.sentiment != null && data.sentiment != '')? data.sentiment: 0;
                //截取到小数点后两位
                negative = (negative * 100).toFixed(2);
                var colorStyle = "";
                if(negative > 50){
                    colorStyle = 'green';
                }else {
                    colorStyle = 'gray';
                }
                var negativeCon = '<span class="negativeNum ' +colorStyle+ '">'+ negative +'</span>';

                $('td:eq(5)', row).html(negativeCon);

                //操作
                var operationCon = '<span style="margin-right: 10px;"><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> <span><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
                $('td:eq(6)', row).html(operationCon).addClass('inewsOperation').attr('data-id', data.webpageCode);
            },

//		       服务器传过来的值
            columns: [//显示的列

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
//		             			判断发布时间是否为当前年份
                            if (year == nowyear) {
                                time = releaseDatetime.formatDate('MM-dd hh:mm');
                            } else {
                                time = releaseDatetime.formatDate('yyyy-MM-dd');
                            }


                            return time;
                        } else {
                            return '-';
                        }
                    },
                    'width': '97px'
                },
                {data: 'title', "bSortable": false, width:'200px'},
                {
                    data: 'sourceCrawl', "bSortable": false,
                    render: function (data, type, row) {
                        if (data != null && data != '') {
                            if (data!= null && data != '') {
                                if(data.search('凤凰网') != -1){
                                    return data.replace('_网页','APP_app');
                                }
                                return data;
                            }
                            return '-'
                        } else {
                            return '-'
                        }
                    },
                    'width': '126px'
                },
                {
                    data: 'sourceReport', "bSortable": false,
                    render: function (data, type, row) {
                        if (data != null && data != '') {
                            return data
                        } else {
                            return '-'
                        }
                    },
                    'width': '126px'
                },
                {
                    data: 'relevantNewsNum', "bSortable": false,
                    render: function (data, type, row) {
                        if (data != null && data != '') {

                            return data;
                        } else {
                            return '-';
                        }
                    },
                    'width': '88px'
                },


                {
                    data: 'sentiment', "bSortable": false,
                    render: function (data, type, row) {
                        if (data != null && data != '') {
                            var num = (data*100).toFixed(2);
                            return num;
                        } else {
                            return '-';
                        }
                    },
                    'width': '52px'
                },

                {data: 'webpageCode', "bSortable": false, 'width': '65px'}
            ],

            "aaSorting": [[0, ""]]
        });

        $('.dataConBoxTable').on('draw.dt', function () {
            if( parame && parame.length > 0){
                parame.splice(0, 1);
                var key = "";
                var iDisplayStart = -1;
                for (var item in parame) {
                    key = key + parame[item].value
                    if (parame[item].name == "iDisplayStart") {
                        iDisplayStart = parame[item].value
                    }
                }
                if (iDisplayStart == 0 || iDisplayStart == "0") {
                    var lastNewsListId = localStorage.getItem(key);
                    if (lastNewsListId) {
                        var index = -1;
                        for (var i = 0; i < webpageCodes.length; i++) {
                            if (webpageCodes[i] == lastNewsListId) {
                                index = i;
                            }
                        }
                        if (index == -1 && webpageCodes.length > 0) {
                            index = '更新了' + webpageCodes.length + '+条数据';
                            //                      showRefreshNum(index)
                        } else if (index > 0) {
                            index = '更新了' + index + '条数据';
                            //                      showRefreshNum(index)
                        }

                    }
                    if (webpageCodes && webpageCodes[0]) {
                        localStorage.setItem(key, webpageCodes[0]);
                    }
                }
                webpageCodes = [];
                if ($('body').width() < 768) {
                    $('.dataConBoxTable').css({
                        'width': '1000px'
                    });
                }
                //			点击翻页页面自动移动到上方
                $('.paginate_button').each(function () {
                    $(this).click(function () {
                        $(this).scrollOffset({
                            'scrollPos': 115
                        });
                    })
                })
            }
        })

        return tableThread;
    };

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

    /**
     * Description：新闻库、新闻线索、为你推荐-线索、我的定制-线索中的缩略图
     */
    $.fn.thumbnailAjaxData = function (options) {
        var defaults = {
            requestUrl: '',  //请求路径
            getPassValue: '',
        };
        var options = $.extend(defaults, options);

        var scrollCon = '';
        if ($('body').width() < 768) {
            scrollCon = true;
        }

//		向图片服务器请求320X180的图片
        var getImgUrl = function (picPath, code) {
            var getImgUrlData = '';
            $.ajax({
                url: inewsImageManager + picPath + '&width=320&height=180&fill=0xffffff',//这个就是请求地址对应sAjaxSource
                data: {'code': code},
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    // console.log(data);
                    if (data.result == 'success') {
//		        		getImgUrlData = data.value;
                        $('.media-left').each(function () {
                            if ($(this).find('img').attr('data-webpagecode') == data.code) {
                                $(this).find('img').attr('src', data.value).removeClass('defaultImg');
                            }
                        })
                    } else {
                        $('.media-left').each(function () {
                            if ($(this).find('img').attr('data-webpagecode') == data.code) {
                                $(this).find('img').attr('src', context + '/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange');
                            }
                        })
                    }
                },
                error: function (msg) {

                }
            });
            return getImgUrlData;
        };
        var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
        var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
        var scrollCon = '';
        var pagingTypeCon = 'full_numbers';
        var thumbnailTable = $('.dataConThumbnailTable').DataTable({
            dom:domString,
            oLanguage: {
                "sZeroRecords" : "没有可以显示的数据",
                "sProcessing" : "正在获取数据，请稍后...",
                "sInfo" : totalCount
            },
            scrollX: scrollCon,
            serverSide: true,//标示从服务器获取数据
            sAjaxSource: options.requestUrl,//服务器请求
            fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
            iDisplayLength: 28,//每页显示条数
            fnServerParams: function (aoData) {
//		       	给服务器传的值
                aoData = options.getPassValue(aoData);
            },

//		       服务器传过来的值
            "rowCallback": function (row, data, index) {
                //checkbox选择
                var checkCon = '<span data-webpageCode="' + data.webpageCode + '" class="check-box check-child"><i class="fa fa-check"></i></span>';
                $('td:eq(0)', row).html(checkCon);

                var content = '';
                var ajaxData = {
                    'time': '',
                    'picPath': '',
                    'cusSummary': '',
                }
//		    	   发布时间
                ajaxData.time = new Date(data.releaseDatetime).formatDate('yyyy-MM-dd hh:mm');

//		    	   摘要
                if (data.cusSummary == null) {
                    ajaxData.cusSummary = '暂无摘要'
                } else {
                    ajaxData.cusSummary = data.cusSummary
                }

                var linkUrl;
                // if (data.statEntity.mediaStatus != null && data.statEntity.mediaStatus != '') {
                //     var mediaSta = data.statEntity.mediaStatus;
                //     mediaSta = mediaSta.substring(1, mediaSta.length - 1).split(',');
                //     for (var i = 0; mediaSta.length > i; i++) {
                //         if (mediaSta[i] == 6) {
                //             if (data.webpageUrl != null && data.webpageUrl != '') {
                //                 linkUrl = data.webpageUrl
                //             } else {
                //
                //             }
                //             break;
                //         } else if (mediaSta[i] == 5) {
                //             linkUrl = ''
                //         } else if (mediaSta[i] == 0) {
                linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode;
                //         }
                //     }
                // }
                var dateTime = data.releaseDatetime;
                if(dateTime != '' && dateTime != null){
                    linkUrl = linkUrl + '/' + dateTime;
                }
                content += '<div class="media">';
                if (data.picPath == null) {
                    content += '<a class="media-left" href="' + linkUrl + '" target="_blank"> <img src="' + context + '/frontEnd/image/home/defaultImg.png"  class="img-thumbnail defaultImgOrange" data-webpageCode="' + data.webpageCode + '" /></a>';
                } else {
                    content += '<a class="media-left" href="' + linkUrl + '" target="_blank"> <img src="' + context + '/frontEnd/image/home/default-gray.png"  class="img-thumbnail defaultImg" data-webpageCode="' + data.webpageCode + '" /></a>';
                }

                content += '<div class="media-body"><div class="mediaCon pull-left">';

                content += '<h6 class="media-heading titleRightClick"><a href="' + linkUrl + '" target="_blank" data-id="' + data.webpageCode + '">' + data.title + '</a></h6>';
                content += '<p class="mediaConSummary">' + ajaxData.cusSummary + '</p>';
                content += '<p class="mediaConBottom">';
                content += '<em class="browseNum' + index + '"></em> <span>浏览量</span> <i>|</i> <em class="draftNum'+index+'"></em> <span>建稿量</span>';
                content += '</p><p class="mediaConTag">';

                if (data.newsType != null && data.newsType != '') {
                    if (data.newsType.length > 0) {
                        content += '<span><i class="fa fa-tags"></i></span>';
                        for (var i = 0; data.newsType.length > i; i++) {
                            if (i == data.newsType.length - 1) {
                                content += '<a href="javascript:void">' + data.newsType[i].label.name + '</a>';
                            } else {
                                content += '<a href="javascript:void">' + data.newsType[i].label.name + '</a><em>|</em>';
                            }
                        }
                    }
                }

//				   发稿来源
                var sourceReport = '';
                if (data.sourceReport != null && data.sourceReport != '') {
                    sourceReport = data.sourceReport;
                } else {
                    sourceReport = '-';
                }
//				   采集来源
                var sourceCrawl = '';
                if (data.sourceCrawl != null && data.sourceCrawl != '') {
                    sourceCrawl = data.sourceCrawl;
                } else {
                    sourceCrawl = '-';
                }

                content += '</p></div><div class="mediaRight pull-right"><ul class="list-group">';
                content += '<li class="list-group-item"><a href="javascript:void">' + ajaxData.time + '</a> [发布时间]</li>';
                content += '<li class="list-group-item"><a href="javascript:void">' + sourceReport + '</a> [发稿来源]</li>';
                content += '<li class="list-group-item"><a href="javascript:void">' + sourceCrawl + '</a> [采集来源]</li>';
                content += '<li class="list-group-item"><a href="javascript:void"><span class="sameNum' + index + '">'+data.sameNewsNum+'</span></a> [相似新闻]</li>';
                content += '<li class="list-group-item"><a href="javascript:void"><span class="relevantNum' + index + '">'+data.relevantNewsNum+'</span></a> [相关新闻]</li>';
                content += '</ul><p class="mediaOperation" data-id="' + data.webpageCode + '">';
                /*content += '<a class="btn  btn-sm"><i class="fa fa-print"></i>打印</a><a class="btn  btn-sm" href="javascript:void(0)"><i class="fa fa-heart-o"></i>收藏</a><a class="btn  btn-sm" href="javascript:void(0)"><i class="fa fa-file-text-o"></i>建稿</a></p></div></div></div>';*/
                //content += '<a class="btn  btn-sm"><i class="fa fa-print"></i>打印</a><a class="btn  btn-sm" href="javascript:void(0)"><i class="fa fa-heart-o"></i>收藏</a></p></div></div></div>';
                content += '<a class="btn  btn-sm" href="javascript:void(0)"><i class="fa fa-heart-o"></i>收藏</a></div></div></div>';
                $('td:eq(1)', row).html(content);

                //首张图片
                if (data.picPath != null && data.picPath != '' && data.picPath != undefined) {
                    getImgUrl(data.picPath, data.webpageCode);
                }

            },

//		       服务器传过来的值
            columns: [//显示的列
                {data: 'webpageCode', "bSortable": false, 'width': '25px'},
                {data: 'webpageCode', "bSortable": false}
            ],

            "aaSorting": [[0, ""]],
        });

        $('.dataConThumbnailTable').on('draw.dt', function () {
            if ($('body').width() < 768) {
                $('.dataConThumbnailTable').css({
                    'width': '1000px'
                });
            }
//			点击翻页页面自动移动到上方
            $('.paginate_button').each(function () {
                $(this).click(function () {
                    $(this).scrollOffset({
                        'scrollPos': 115
                    });
                })
            })
        })

        return thumbnailTable;
    };

    /**
     * Description：新闻库、新闻线索、为你推荐-线索、我的定制-线索中的九宫格
     */
    $.fn.sudokuAjaxData = function (options) {
        var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
        var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
        var scrollCon = '';
        var defaults = {
            requestUrl: '',  //请求路径
            getPassValue: '',
        };
        var options = $.extend(defaults, options);

//		向图片服务器请求200X200的图片
        var getImgUrl = function (picPath, code) {
            var getImgUrlData = '';
            $.ajax({
                url: inewsImageManager + picPath + '&width=320&height=180',//这个就是请求地址对应sAjaxSource
                data: {'code': code},
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    // console.log(data);
                    if (data.result == 'success') {
//		        		$('.sudokuImg').each(function(){
//		        			console.log($(this).find('img').attr('data-webpagecode'));
//		        			if($(this).find('img').attr('data-webpagecode') == data.code){
//		        				$(this).find('img').removeClass('defaultImg').attr('src',data.value)
//		        			}
//		        		})
                        $('img[data-webpagecode="' + data.code + '"]').attr('src', data.value).removeClass('defaultImg');

                    } else {
                        $('img[data-webpagecode="' + data.code + '"]').attr('src', context + '/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange');
                    }
                },
                error: function (msg) {
                }
            });

            return getImgUrlData;
        }

        var sudokuTable = $('.dataConSudokuTable').DataTable({
            dom:domString,
            oLanguage: {
                "sZeroRecords" : "没有可以显示的数据",
                "sProcessing" : "正在获取数据，请稍后...",

                "sInfo" : totalCount
            },
            serverSide: true,//标示从服务器获取数据
            sAjaxSource: options.requestUrl,//服务器请求
            fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
            iDisplayLength: 16,//每页显示条数
            fnServerParams: function (aoData) {
//		       	给服务器传的值
                aoData = options.getPassValue(aoData);
            },

//		       服务器传过来的值
            "rowCallback": function (row, data, index) {
                var content = '<div class="thumbnail">';
                var sudokuParams = {
                    'time': '',
                    'picPath': '',
                    'cusSummary': '',
                }

                //发布时间
                sudokuParams.time = new Date(data.releaseDatetime).formatDate('yyyy-MM-dd hh:mm');

                //摘要
                if (data.cusSummary == null) {
                    sudokuParams.cusSummary = '暂无摘要'
                } else {
                    sudokuParams.cusSummary = data.cusSummary
                }
//		    	   	发稿来源
                var sourceReport = '';
                if (data.sourceReport != null && data.sourceReport != '') {
                    sourceReport = data.sourceReport;
                } else {
                    sourceReport = '-';
                }
//		    	    采集来源
                var sourceCrawl = '';
                if (data.sourceCrawl != null && data.sourceCrawl != '') {
                    sourceCrawl = data.sourceCrawl;
                } else {
                    sourceCrawl = '-';
                }

                var linkUrl;
                // if (data.statEntity.mediaStatus != null && data.statEntity.mediaStatus != '') {
                //     var mediaSta = data.statEntity.mediaStatus;
                //     mediaSta = mediaSta.substring(1, mediaSta.length - 1).split(',');
                //     for (var i = 0; mediaSta.length > i; i++) {
                //         if (mediaSta[i] == 6) {
                //             if (data.webpageUrl != null && data.webpageUrl != '') {
                //                 linkUrl = data.webpageUrl
                //             } else {
                //
                //             }
                //             break;
                //         } else if (mediaSta[i] == 5) {
                //             linkUrl = ''
                //         } else if (mediaSta[i] == 0) {
                            linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode;
                //         }
                //     }
                // }
                var dateTime = data.releaseDatetime;
                if(dateTime != '' && dateTime != null){
                    linkUrl = linkUrl + '/' + dateTime;
                }
                if (data.picPath == null) {
                    content += '<div class="sudokuImg"><img class="defaultImgOrange" data-webpagecode="' + data.webpageCode + '" src="' + context + '/frontEnd/image/home/defaultImg.png"/></div>';
                } else {
                    content += '<div class="sudokuImg"><img class="defaultImg" data-webpagecode="' + data.webpageCode + '" src="' + context + '/frontEnd/image/home/default-white.png"/></div>';
                }


                content += '<div class="caption">';
                content += '<dl class="dl-horizontal"><dt class="captionTitle"><a href="' + linkUrl + '" target="_blank" data-id="' + data.webpageCode + '">' + data.title + '</a></dt></dl>';
                content += '<p class="sudokuTime">' + sudokuParams.time + '</p>';
                content += '<p class="sudokuSummary clearfix"><span>[摘要]</span>' + sudokuParams.cusSummary + '</p>';
                content += '<div class="site-piclist_check"><span class="check-child"><i class="fa fa-check"></i></span></div></div>';

                content += '<div class="sudokuShowMore"><p class="clearfix m-bottom">';
                content += '<a href="javascript:void(0)" >发稿来源：' + sourceReport + '</a>';
                content += '<a href="javascript:void(0)">采集来源：' + sourceCrawl + '</a>';
                content += '<a href="javascript:void(0)" ></a></p></div></div>';
                /*content += '<a href="javascript:void(0)" ><i class="fa fa-ellipsis-v fa-lg" tabindex="0" data-toggle="popover" data-placement="top"></i></a></p></div></div>';*/

                $('td:eq(0)', row).html(content);
                $(row).attr('class', 'col-md-3 p-right p-left');

                //首张图片
                if (data.picPath != null && data.picPath != '' && data.picPath != undefined) {
                    getImgUrl(data.picPath, data.webpageCode);
                }
            },

//		       服务器传过来的值
            columns: [//显示的列
                {data: 'webpageCode', "bSortable": false}
            ],

            "aaSorting": [[0, ""]],
        });

        $('.dataConSudokuTable').on('draw.dt', function () {
//			点击翻页页面自动移动到上方
            $('.paginate_button').each(function () {
                $(this).click(function () {
                    $(this).scrollOffset({
                        'scrollPos': 115
                    });
                })
            })
        })

        return sudokuTable;
    }


})(jQuery);
