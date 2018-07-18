var reviewAnalysisTable;
var statusArr = [];
var statusTimeCode = -1;
$(function () {
//	提交
    fnSubmit();
//	表格的生成
    fnReviewAnalysisTable();
    $('.linkTips').html('');
    $('.linkTips').each(function (index, element) {
        element.style.background = '#fff'
    })
//	提交表单的输入框获得焦点提示信息消失
    $('.linkUrl').focus(function () {
        $('.linkTips').html('');
        $('.linkTips').each(function (index, element) {
            element.style.background = '#fff'
        })
    })

    fnDelAnalysis();
})

//提交
function fnSubmit() {
    $('.linkBtn').click(function () {
        var linkUrl = $('.linkUrl').val();
        if (linkUrl == '') {
            $('.linkTips').html('<i class="fa fa-exclamation-circle red"></i> 请输入文章链接');
            $('.linkTips').each(function (index, element) {
                element.style.background = '#F44336'
            })
        } else {
//			去请求添加文章的webpagecode
            $.ajax({
                url: ctx + '/latest/front/addNewsAnalysis',
                data: {'url': linkUrl},
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    if (data.result == true) {
                        var obj = data.resultObj;
                        if (obj.result == 'failed') {

                            if (obj.status == '1') {//不属于可分析网站范围内
                                $('.linkTips').html("此条连接为无效链接");
                                $('.linkTips').each(function (index, element) {
                                    element.style.background = '#F44336'
                                })
                            } else if (obj.status == '2') {//已定制超过三条任务
                                $('.linkTips').html(obj.reason);
                                $('.linkTips').each(function (index, element) {
                                    element.style.background = '#F44336'
                                })
                            } else if (obj.status == '3') {//已有相同分析任务
                                $('#confirmModal').modal('show');
                                $('#confirmModal').find('.confirmY').click(function () {
//	    		        			重新分析
                                    fnReAnalysis(linkUrl);
                                    $('#confirmModal').modal('hide');
                                    $('.linkUrl').val('');
                                })
                            }
                        } else {
                            $('.linkUrl').val('');
                            reviewAnalysisTable.ajax.reload();
                        }
                    }

                }
            })
        }
    })
}


//表格的生成
function fnReviewAnalysisTable() {

//	表格请求链接
    var ajaxSource = ctx + '/latest/front/pageNewsAnalysis';

    reviewAnalysisTable = $('.reviewAnalysisTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource: ajaxSource,//服务器请求
        fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        iDisplayLength: 10,//每页显示条数
        fnServerParams: function (aoData) {
        },
//	       服务器传过来的值
        "rowCallback": function (row, data, index) {
//	    	   序号
            $('td:eq(0)', row).html(index + 1);
//	    	   文章链接
            var url = '<a title="' + data.url + '" href="' + data.url + '" target="_blank" class="beyondEllipsis" >' + data.url + '</a>';
            $('td:eq(1)', row).html(url).addClass('titleRightClick');
//	    	   文章标题
            var title = '';
            if (data.name == null) {
                title = '-'
            } else {
                title = '<a class="beyondEllipsis title" >' + data.name + '</a>';
            }
            $('td:eq(2)', row).html(title).addClass('titleRightClick ');


            $('td:eq(4)', row).html('-').addClass('operation').attr('data-url', data.url).attr('data-code', data.code);

            $('td:eq(5)', row).html('<a class="delAnalysisBox" data-delurl="' + data.url + '"><i class="fa fa-trash"></i></a> <a class="refresh"><i class="fa fa-refresh"></i></a>').addClass('delAnalysis');
        },

//	       服务器传过来的值
        columns: [//显示的列
            {data: 'analysisStatus', "bSortable": false, 'width': '50px'},
            {data: 'url', "bSortable": false, 'width': '250px'},
            {
                data: 'name', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var name = new Date(data);
                        return name;
                    } else {
                        return '-';
                    }
                },
            },
            {
                data: 'createDatetime', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var createDatetime = new Date(data);

                        //获取当前年
                        var nowDate = new Date();
                        var nowyear = nowDate.getFullYear();
                        var year = createDatetime.formatDate('yyyy');
                        var time = '';
//	             			判断发布时间是否为当前年份
                        if (year == nowyear) {
                            time = createDatetime.formatDate('MM-dd hh:mm');
                        } else {
                            time = createDatetime.formatDate('yyyy-MM-dd');
                        }

                        return time;
                    } else {
                        return '-';
                    }
                },
                'width': '100px'
            },
            {data: 'analysisStatus', "bSortable": false, 'width': '160px'},
            {data: 'analysisStatus', "bSortable": false, 'width': '50px'}
        ],

        "aaSorting": [[0, ""]],
    });

    $('.reviewAnalysisTable').on('draw.dt', function () {
        var tableData = reviewAnalysisTable.column(0).nodes().data();
        console.log(tableData);
        statusArr = [];
        if (tableData.length > 0) {
            for (var i = 0; i < tableData.length; i++) {
                statusArr.push(tableData[i].url);
            }
            console.log(statusArr);

//			查看评论分析状态
            showStatus();


//			删除列表中的任务
            delAnalysis();
//			刷新列表任务
            refreshTable();
        }

    })

}

//查看评论分析状态
function showStatus() {
    if (statusTimeCode != -1) {
        clearTimeout(statusTimeCode);
    }
    if (statusArr.length > 0) {
        $.ajax({
            url: ctx + '/latest/front/newsAnalysisStatus',
            data: {'urls': statusArr},
            type: 'get',
            dataType: 'json',
            async: true,
            traditional: true,
            success: function (data) {
                console.log(data);
                if (data.result) {
                    var obj = data.resultObj;
                    if (obj.length > 0) {
                        for (var i = 0; i < obj.length; i++) {
//	        				分析状态：0正在分析，1分析完成，2分析异常，3暂未分析
                            if (obj[i].status == 0) {
                                var operationCon = '<button type="button" class="btn btn-default btn-xs analysising">正在分析</button>';

                                if (obj[i].time == 0) {//爬虫还未返回时间
                                    operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">分析时间 . . .</button>';
//	        						newUrls.push(obj[i].url);
                                } else {

                                    var expectTime = new Date(obj[i].time);
                                    // var expectTimeTen = new Date(obj[i].time+10*60*1000);
                                    // var expectTimeTew = new Date(obj[i].time+20*60*1000);
                                    // var expectTimeThi = new Date(obj[i].time+30*60*1000);
                                    var expectTimeTen = obj[i].time+10*60*1000;
                                    var expectTimeTew = obj[i].time+20*60*1000;
                                    var expectTimeThi = obj[i].time+30*60*1000;
                                    var nowTime = new Date();
                                    var now = nowTime.getTime();

                                    if (now < obj[i].time) {
                                        operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">' + expectTime.formatDate('MM-dd hh:mm') + '</button>'
                                    } else if(now > obj[i].time && now < expectTimeTen) {
                                        operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">' + new Date(expectTimeTen).formatDate('MM-dd hh:mm') + '</button>'
                                    } else if(now > expectTimeTen && now < expectTimeTew) {
                                        operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">' + new Date(expectTimeTew).formatDate('MM-dd hh:mm') + '</button>'
                                    } else if(now > expectTimeTew && now < expectTimeThi) {
                                        operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">' + new Date(expectTimeThi).formatDate('MM-dd hh:mm') + '</button>'
                                    } else {
                                        operationCon += '&nbsp;<button type="button" class="btn btn-danger btn-xs analysisTimeBtn">' + '请耐心等候' + '</button>'
                                    }
                                }

                                $('.reviewAnalysisTable tbody').find('[data-url="' + obj[i].url + '"]').html(operationCon);

                            } else if (obj[i].status == 1) {
                                if (obj[i].commentNum == '0') {
                                    var operationCon = '<button type="button" data-reurl="' + obj[i].url + '" class="btn btn-default btn-xs refreshAnalysis" data-click="false">重新分析</button>&nbsp;<button type="button" class="btn btn-danger btn-xs">暂无评论！</button>';

                                } else {
                                    var operationCon = '<button type="button" data-reurl="' + obj[i].url + '" class="btn btn-default btn-xs refreshAnalysis" data-click="false">重新分析</button>&nbsp;<button type="button" class="btn btn-danger btn-xs analysisResult">查看分析结果</button>';
                                }

                                $('.reviewAnalysisTable tbody').find('[data-url="' + obj[i].url + '"]').html(operationCon).attr('data-code', obj[i].webpageCode);


                                if (statusArr.length > 0) {
                                    for (var x = 0; x < statusArr.length; x++) {
                                        if (statusArr[x] == obj[i].url) {
                                            statusArr.splice(x, 1);
                                        }
                                    }
                                }


                            } else if (obj[i].status == 2) {
                                var operationCon = '<button type="button" data-reurl="' + obj[i].url + '" class="btn btn-default btn-xs refreshAnalysis" data-click="false">重新分析</button>&nbsp;<button type="button" class="btn btn-default btn-xs">分析异常</button>';
                                $('.reviewAnalysisTable tbody').find('[data-url="' + obj[i].url + '"]').html(operationCon);

                                if (statusArr.length > 0) {
                                    for (var x = 0; x < statusArr.length; x++) {
                                        if (statusArr[x] == obj[i].url) {
                                            statusArr.splice(x, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (statusArr.length > 0) {
                        statusTimeCode = setTimeout(showStatus, 60000);//每过60s请求一次
                    }

//	    			查看分析结果
                    $('.reviewAnalysisTable tbody').find('.analysisResult').click(function () {
                        var code = $(this).parents('td').attr('data-code');
                        window.open(ctx + '/latest/front/news/detail/' + code + '?comment=' + 1);
                    });
//	    			重新分析
                    fnRefreshAnalysis();
                }
            }
        });
    }

}

//分析时间
function fnAnalysisTime() {
//	console.log(urls);
    if (statusArr.length > 0) {
        var index = 0;
        $.ajax({
            url: ctx + '/latest/front/newsAnalysisTime',
            data: {'urls': statusArr},
            type: 'get',
            dataType: 'json',
            async: true,
            traditional: true,
            success: function (data) {
                console.log(data);
                if (data.result == true) {
                    var obj = data.resultObj;
//	        		获取当前时间
                    var nowTime = Date.parse(new Date());
                    for (var key in obj) {
                        if (obj[key][0] == '0') {//如果时间为0，还没有获得到当前时间
                            ++index;
                        } else if (obj[key][1] == '0') {
                            var num = obj[key][1];//查看当前评论是否为0
                            if (num == 0) {
                                $('.reviewAnalysisTable tbody').find('[data-url="' + key + '"]').html('<button type="button" data-click="false" data-reurl="' + key + '" class="btn btn-default btn-xs refreshAnalysis">重新分析</button>&nbsp;<button type="button" class="btn btn-danger btn-xs">暂无评论！</button>')
                            }
                            fnRefreshAnalysis();
                        } else {
                            var anaTime = obj[key][0];
                            if (nowTime > anaTime) {
                                $('.reviewAnalysisTable tbody').find('[data-url="' + key + '"]').find('.analysisTimeBtn').html('请耐心等待！');
                            } else {
                                var time = new Date(anaTime);
                                $('.reviewAnalysisTable tbody').find('[data-url="' + key + '"]').find('.analysisTimeBtn').html(time.formatDate('MM-dd hh:mm'));
                            }

                            var newsurls = statusArr.splice(statusArr.indexOf(key), 1);
                        }
                    }

                    if (index == 0) {
                        return;
                    } else {
                        if (statusArr.length > 0) {
                            setTimeout(fnAnalysisTime, 30000);
                        } else {
                            return;
                        }

                    }

                }

            }
        })
    } else {
        return;
    }

}

//重新分析
function fnRefreshAnalysis() {
    $('.refreshAnalysis').each(function () {
        if ($(this).attr('data-click') == 'false') {
            $(this).attr('data-click', 'true');
            $(this).click(function () {
                var _$this = $(this);
                var url = $(this).attr('data-reurl');
                $.ajax({
                    url: ctx + '/latest/front/newsAnalysisAgain',
                    data: {'url': url},
                    type: 'get',
                    dataType: 'json',
                    async: true,
                    success: function (data) {
                        console.log(data);
                        if (data.result == true) {
                            var obj = data.resultObj;

                            if (obj.result == 'failed') {
                                $().toastmessage('showToast', {
                                    //提示信息的内容
                                    text: obj.reason,
                                    //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                                    sticky: false,
                                    //显示的位置，默认为右上角
                                    position: 'bottom-right',
                                    //显示的状态。共notice, warning, error, success4种状态
                                    type: 'error',
                                });
                            } else {
                                _$this.text('正在分析').next('button').text('分析时间 . . .');
//			            		请求 分析的时间
                                statusArr.push(url);
                                statusTimeCode = setTimeout(showStatus, 60000);
                            }
                        }
                    }
                })
            })
        } else {
            return;
        }
    })
}

//重新分析--提交
function fnReAnalysis(url) {
    $.ajax({
        url: ctx + '/latest/front/newsAnalysisAgain',
        data: {'url': url},
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result == true) {
                var obj = data.resultObj;

                if (obj.result == 'failed') {
                    $().toastmessage('showToast', {
                        //提示信息的内容
                        text: obj.reason,
                        //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                        sticky: false,
                        //显示的位置，默认为右上角
                        position: 'bottom-right',
                        //显示的状态。共notice, warning, error, success4种状态
                        type: 'error',
                    });
                } else {
                    reviewAnalysisTable.ajax.reload();
                }
            }
        }
    })
}

//删除添加的评论
function delAnalysis() {

    $('.delAnalysis').each(function () {

        $(this).find('.delAnalysisBox').click(function () {
            var noMoreReminder = localStorage.noMoreReminder
            if (noMoreReminder == true || noMoreReminder == 'true') {
                postDeleteAnalysis();
            } else {
                var delUrl = $(this).attr('data-delurl');
                $('#delModal').modal('show').attr('data-delUrl', delUrl);
            }
        })
    })
}

//删除
function fnDelAnalysis() {
    $('#delModal').find('.delY').click(function () {
        $('#delModal').modal('hide');
        postDeleteAnalysis();
    })

    $('#delModal').find('.delN').click(function () {
        $('#delModal').modal('hide');
    })
    $('.noMoreReminder').click(function () {
        $('.noMoreReminder> i').each(function (index, element) {
            var className = element.className
            if (className == 'fa fa-square-o') {
                element.className = 'fa fa-check-square-o'
            } else {
                element.className = 'fa fa-square-o'
            }
        })
    })

}

function postDeleteAnalysis() {
    var noMoreReminder = localStorage.noMoreReminder
    if (!noMoreReminder || noMoreReminder == '' || noMoreReminder == false || noMoreReminder == 'false') {
        $('.noMoreReminder> i').each(function (index, element) {
            var className = element.className
            if (className == 'fa fa-check-square-o') {
                localStorage.noMoreReminder = 'true'
            }
        })
    }
    var delUrl = $('#delModal').attr('data-delUrl');
    $.ajax({
        url: ctx + '/latest/front/newsAnalysisDelete',
        data: {'url': delUrl},
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result) {
                var obj = data.resultObj;
                if (obj) {
                    reviewAnalysisTable.ajax.reload();
                } else {
                    $().toastmessage('showToast', {
                        text: '删除失败！',
                        sticky: false,
                        position: 'bottom-right',
                        type: 'error',
                    });
                }
            }
        }
    })
}


//刷新
function refreshTable() {
    $('.refresh').click(function () {
        reviewAnalysisTable.ajax.reload();
    })
}