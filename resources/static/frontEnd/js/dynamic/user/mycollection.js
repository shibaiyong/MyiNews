var collectTable,
    historyTable,
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function() {

//	导航内容实现
    $().showHeader();
    $('.collection').addClass('active');
    $(".collection").find('a').attr("href", "#").css({
        'cursor': 'default'
    });
    $(".collection").find('a').find('i').attr('data-toggle','');

    footerPutBottom();
    //初始化提示框
    $('[data-toggle="popover"]').popover();

    /*我的收藏*/
    var scrollCon = '';
    if ($('body').width() < 768) {
        scrollCon = true;
        $('.keepTable>table').css({
            'width': '600px'
        });
    }

    $('.table-operation-status').find('a').eq(1).removeClass('hide').end().eq(4).removeClass('hide');

    selectTime();
    derivation();
    cancelCollectBatch();
    collectTableCon();
//	全选功能
    $('.table-operation-status').find('a').eq(0).allCheck({
        'allFun': function (status) {
            if (status) {
                console.log(status);
                if (batchCheckWebPageCode.length == 0) {
                    batchCheckWebPageCode = tableItemWebPageCodeArr;
                } else {
                    for (var i = 0; tableItemWebPageCodeArr.length > i; i++) {

                        var jishustatus = 0;

                        for (var j = 0; batchCheckWebPageCode.length > j; j++) {
                            if (tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]) {
                                ++jishustatus;
                            }
                        }

                        if (jishustatus == 0) {
                            //单选之后，再点击全选。则把除了单选的其余webpagecode添加到数组中
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
                            batchCheckWebPageCode.splice(tableItemWebPageCodeArr[i])
                        }
                    }
                }
            }
        }

    });

})
//收藏
function collectTableCon(){
    collectTable = $('.collectTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource :ctx+'/user/front/favorite/page',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams : function ( aoData ) {
            if($('#time-slice').val() == ''){
                aoData.push()
            }else{
                var startTime = new Date($('#time-slice').val().substring(0,10).replace("-", "/").replace("-", "/"));
                var endTime = new Date(new Date($('#time-slice').val().substring(13).replace("-", "/").replace("-", "/")).getTime()+(1000 * 60 * 60 * 24));

                aoData.push(
                    {'name':'startTime','value':startTime},
                    {'name':'endTime','value':endTime}
                )
            }
        },
//	       服务器传过来的值
        "rowCallback" : function(row, data, index) {

            var checkCon = '<span data-webpageCode="'+data.webpageCode+'" class="check-box check-child"><i class="fa fa-check"></i></span>';
            $('td:eq(0)', row).html(checkCon);

            //摘要,长度超过150截取
            var summary = '';
            var isearchVal = $('.customAddInput').val();
            if(null != data.cusSummary){
                if(data.cusSummary.length>150){
                    summary = data.cusSummary.substr(0,150)+'...';
                }else{
                    summary = data.cusSummary;
                }

                var titleCon = '<a href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'" target="_blank" class="beyondEllipsis" tabindex="0" data-id="'+data.webpageCode+'"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="'+summary+'">'+data.title+'</a>'
            }else{
                summary = '暂无摘要';
                var titleCon = '<a href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'" target="_blank" class="beyondEllipsis"  data-id="'+data.webpageCode+'">'+data.title+'</a>'
            }
            $('td:eq(2)', row).html(titleCon).addClass('titleRightClick');
            var sourceReportHtml='<span style="text-align: left;display: inline-block;">'+data.sourceReport+'</span>'

            $('td:eq(3)', row).html(sourceReportHtml);
            //操作
            var operationCon = '<span><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
            /*var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span>';*/
            $('td:eq(5)', row).html(operationCon).addClass('inewsOperation').attr('data-id',data.webpageCode);
        },

//	       服务器传过来的值
        columns: [//显示的列
            {data: 'webpageCode', "bSortable": false},
            {data: 'releaseDatetime', "bSortable": false,
                render:function(data, type, row){
                    if(null != data && "" != data){
                        var releaseDatetime = new Date(data);

                        //获取当前年
                        var nowDate = new Date();
                        var nowyear=nowDate.getFullYear();
                        var year = releaseDatetime.formatDate('yyyy');
                        var time = '';
//	             			判断发布时间是否为当前年份
                        if(year == nowyear){
                            time = releaseDatetime.formatDate('MM-dd hh:mm');
                        }else{
                            time = releaseDatetime.formatDate('yyyy-MM-dd');
                        }

                        return time;
                    }else{
                        return '-';
                    }
                }
            },
            { data: 'title', "bSortable": false},
            { data: 'sourceReport', "bSortable": false,
                render:function(data,type,row){
                    if(data != null && data != ''){
                        return data
                    }else{
                        return '-'
                    }
                }
            },
            { data: 'sourceCrawlDetail', "bSortable": false,
                render:function(data,type,row){
                    if(data != null && data != ''){
                        return data.website.displayName
                    }else{
                        return '-'
                    }
                }
            },

            {data: 'webpageCode', "bSortable": false},
        ],

        "aaSorting": [[0, ""]],
    });

    $('.collectTable').on('draw.dt',function() {

        $('.collectTable').itemCheck({   //给每一条新闻增加单击的事件
            'itemFun':function($this,statusItem){
                if(statusItem){
                    //					console.log($this[0].attributes[0].nodeValue);
                    batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
                }else{
                    for(var i = 0;batchCheckWebPageCode.length>i;i++){
                        var webpageCodeItem = $this[0].attributes[0].nodeValue;
                        if(webpageCodeItem == batchCheckWebPageCode[i]){
                            batchCheckWebPageCode.splice(i);
                        }
                    }
                }
            }
        });

//		点击翻页页面自动移动到上方
        $('.paginate_button').each(function(){
            $(this).click(function(){
                $(this).scrollOffset({
                    'scrollPos':115
                });

                $('.table-operation-status').find('a').eq(0).removeAttr('style').find('span').removeClass('checked');
            })
        });

        $("[data-toggle='tooltip']").tooltip();

        var textArr = collectTable.column(1).nodes().data();
        tableItemWebPageCodeArr = [];

        if(textArr.length > 0){
            var textArrCon =[];
            for(var count = 0;textArr.length>count;count++){
                tableItemWebPageCodeArr.push(textArr[count].webpageCode);
            }

//			操作-建稿

            $('.inewsOperation').each(function(index){
                $(this).find('span').eq(0).releaseBuild({
                    'webpageCode':tableItemWebPageCodeArr[index],
                    'buildingCon':function(_$this){
                        _$this.find('i').addClass('hide');
                        _$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
                    },
                    'buildedCon':function(_$this){
                        _$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
                        $("[data-toggle='tooltip']").tooltip();
                        collectTable.ajax.reload();
                    }
                })
            })

//			建、采
            $().adraticAjaxData({
                'dataUrl':ctx+'/latest/front/getDraftType',
                'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
                'callback':function(data,con){
                    $('.collectTable tbody').find('.titleRightClick').each(function(index){
                        if(data[index].length > 0){
                            if(data[index][0] == 1){
                                $(this).find('a').css({
                                    'width':'93%'
                                })
                                $(this).append('<span class="label-status label-jian">【建】</span>');
                            }else if(data[index][0] == 2){
                                $(this).find('a').css({
                                    'width':'93%'
                                })
                                $(this).append('<span class="label-status label-cai">【采】</span>');
                            }else{}
                        }

                    })
                }
            });
        }

        //		datatables翻页时查询页面中是否有选中的新闻
        for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
            for(var j = 0;batchCheckWebPageCode.length>j;j++){
                if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
                    $('.collectTable').find('.check-child').eq(i).addClass('checked');
                }
            }
        }
    })
}


function selectTime(){
    var options = {
        //"applyClass" : 'btn-sm btn-success',
        //"cancelClass" : 'btn-sm btn-default',
        'locale' : {
            format:'YYYY-MM-DD',
            applyLabel: '确定',
            cancelLabel: '取消',
            weekLabel: 'W',
            customRangeLabel: '自定义',
            daysOfWeek:[ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames:[ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
        },
//		'endDate':'2013-12-31',
//		'startDate':moment().subtract(7, 'days'),
        'autoUpdateInput':false,
        'opens':'left',
        'separator':'至 ',
        "ranges": {
            '今天':[moment(),moment()],
            '最近3天': [moment().subtract(2, 'days'), moment()],
            '最近7天': [moment().subtract(6, 'days'), moment()],
            '最近15天': [moment().subtract(14, 'days'), moment()],
            '最近30天': [moment().subtract(29, 'days'), moment()],
//            '本月': [moment().startOf('month'), moment().endOf('month')],
//            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "alwaysShowCalendars": true,

    };
    $('#time-slice').daterangepicker({autoUpdateInput:false});
    $('#time-slice').daterangepicker(options, function(start, end, label) {
        $('#beginTime').val(start.format('YYYY-MM-DD'));
        $('#endTime').val(end.format('YYYY-MM-DD'));
    });

//	时间选择框关闭时触发的条件
    $('#time-slice').on('hide.daterangepicker',function(ev, picker){
        collectTable.ajax.reload();
    });
}

//导出列表
function derivation(){
    $('.table-operation-status').find('a').eq(1).click(function(){
        var $this = $(this);
        if($(this).attr('data-once') == 'true'){
            if(!batchCheckWebPageCode.length){
                setModalContent('是否导出全部收藏新闻','是','否',function(){
                    $this.attr("data-once",'false');
                    if($('#time-slice').val() == ''){
                        var startTime = '';
                        var endTime = '';
                    }else{
                        var startTime = new Date($('#time-slice').val().substring(0,10).replace("-", "/").replace("-", "/")).toJSON();
                        var endTime = new Date(new Date($('#time-slice').val().substring(13).replace("-", "/").replace("-", "/")).getTime()+(1000 * 60 * 60 * 24)).toJSON();
                    }
                    location.href = ctx+'/user/front/favorite/download?'+ 'startTime='+startTime+'&endTime='+endTime+'&entityList='+batchCheckWebPageCode;
                    $this.attr("data-once",'true');
                    batchCheckWebPageCode = [];
                    $('.check-child').removeClass('checked');
                    $('.table-operation-status').find('a').eq(0).removeAttr('style').find('span').removeClass('checked');
                })
            }else{
                $this.attr("data-once",'false');
                if($('#time-slice').val() == ''){
                    var startTime = '';
                    var endTime = '';
                }else{
                    var startTime = new Date($('#time-slice').val().substring(0,10).replace("-", "/").replace("-", "/")).toJSON();
                    var endTime = new Date(new Date($('#time-slice').val().substring(13).replace("-", "/").replace("-", "/")).getTime()+(1000 * 60 * 60 * 24)).toJSON();
                }
                location.href = ctx+'/user/front/favorite/download?'+ 'startTime='+startTime+'&endTime='+endTime+'&entityList='+batchCheckWebPageCode;
                $this.attr("data-once",'true');
                batchCheckWebPageCode = [];
                $('.check-child').removeClass('checked');
                $('.table-operation-status').find('a').eq(0).removeAttr('style').find('span').removeClass('checked');
            }

        }else{

        }

    })
}
//批量取消收藏
function cancelCollectBatch(){
    $('.table-operation-status').find('a').eq(4).click(function(){
        var $this = $(this);

        if($(this).attr('data-once') == 'true'){
            $(this).attr('data-once','false').find('i').attr('class','fa fa-spinner fa-pulse');
            if(!batchCheckWebPageCode.length){
                setModalContent('是否永久取消全部的收藏，此操作不可恢复','确认','取消',function(){
                    $.ajax({
                        url : ctx+'/user/front/deleteCollectingNews',//这个就是请求地址对应sAjaxSource
                        data:{'webpageCodeList':batchCheckWebPageCode},
                        type : 'get',
                        dataType : 'json',
                        async : true,
                        traditional:true,
                        success : function(data) {
                            console.log(data);
                            if(data.resultObj == 'success'){
                                batchCheckWebPageCode = [];
                                collectTable.ajax.reload();
                                $('.table-operation-status').find('a').eq(0).removeAttr('style').find('span').removeClass('checked');
                                $this.attr('data-once','true').find('i').attr('class','fa fa-trash');
                                $().toastmessage('showToast', {
                                    //提示信息的内容
                                    text: '取消成功！',
                                    sticky: false,
                                    position: 'middle-center',
                                    type: 'success',
                                });
                            }
                        }
                    })
                },function(){
                    $this.attr('data-once','true').find('i').attr('class','fa fa-trash');
                })
            }else{
                $.ajax({
                    url : ctx+'/user/front/deleteCollectingNews',//这个就是请求地址对应sAjaxSource
                    data:{'webpageCodeList':batchCheckWebPageCode},
                    type : 'get',
                    dataType : 'json',
                    async : true,
                    traditional:true,
                    success : function(data) {
                        console.log(data);
                        if(data.resultObj == 'success'){
                            batchCheckWebPageCode = [];
                            collectTable.ajax.reload();
                            $('.table-operation-status').find('a').eq(0).removeAttr('style').find('span').removeClass('checked');
                            $this.attr('data-once','true').find('i').attr('class','fa fa-trash');
                            $().toastmessage('showToast', {
                                //提示信息的内容
                                text: '取消成功！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'success',
                            });
                        }
                    }
                })
            }
        }else{
            $().toastmessage('showToast', {
                //提示信息的内容
                text: '请选择内容！',
                sticky: false,
                position: 'middle-center',
                type: 'notice',
            });
        }

    })
}


function setModalContent( content,confirm,cancel ,callback1,callback2){
    $('#deleteDialog').modal('show');
    $('#deleteDialog .modal-body p').text(content);
    $('#deleteDialog .modal-body .btn-red').text(confirm);
    $('#deleteDialog .modal-body .btn-default').text(cancel);
    $('#deleteDialog .btn-red').click(function(){
        $(this).unbind();
        $('#deleteDialog').modal('hide');
        if(callback1){
            callback1();
        }
    })
    $('#deleteDialog .btn-default').click(function(){
        $(this).unbind();
        if(callback2){
            callback2();
        }
    })
}