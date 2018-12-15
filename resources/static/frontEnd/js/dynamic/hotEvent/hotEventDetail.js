var table;

/**
 * 时间对象的格式化，只要是时间对象，都可以调用该方法
 * @param format 传入值,日期格式，比如"yyyy-MM-dd hh:mm:ss"
 * @returns {String} 格式化之后的时间
 */

Date.prototype.formatDate = function(format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//多行文本溢出隐藏js实现

var overflowhidden = function(id, rows, str){
    var text = document.getElementById(id);
    var style = window.getComputedStyle ? window.getComputedStyle(text, "") : text.currentStyle;
    var lineHeight = style["line-height"];   //获取到line-height样式设置的值 必须要有
	console.log(lineHeight);
    var at = rows*parseInt(lineHeight);      //计算包含文本的div应该有的高度
    var tempstr = str;                       //获取到所有文本
    text.innerHTML = tempstr;                //将所有文本写入html中
    var len = tempstr.length;
    var i = 0;
    if(text.offsetHeight <= at){             //如果所有文本在写入html后文本没有溢出，那不需要做溢出处理

         }
        else {                                   //否则 一个一个字符添加写入 不断判断写入后是否溢出
            var temp = "";
             text.innerHTML = temp;
            while(text.offsetHeight <= at){
                temp = tempstr.substring(0, i+1);
                i++;
                text.innerHTML = temp;
             }
            var slen = temp.length;
            tempstr = temp.substring(0, slen-1);
            len = tempstr.length
            text.innerHTML = tempstr.substring(0, len-3) +"...";     //替换string后面三个字符
            text.height = at +"px";                                  //修改文本高度 为了让CSS样式overflow：hidden生效
         }
    }

$(function(){
	/* 头部导航高亮 */
//	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(6)').addClass('active');
	/* 头部导航高亮 */
    $().showHeader();
	$('.textVDContent').checkImg();
	
	$('.textVDContent').judgeImgLoadError();
	
	$('.textVDContent').each(function(){
		$(this).uec_inews_picture_group_news();	});
	
	var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
	var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
	var scrollCon = '';
	var pagingTypeCon = 'full_numbers';
	if($('body').width()<1200){
		domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3 col-xs-4'i><'col-sm-9 col-xs-8'p>>";
		totalCount = "共计  _TOTAL_ 条";
	}
	if($('body').width()<992){
		scrollCon = true;
		pagingTypeCon = "simple";
	}

	table = $('.hotEventPredictConTable').DataTable({
		dom:domString,
		oLanguage: { 
	    	"sInfo" : totalCount,
	    },
	    pagingType:   pagingTypeCon,
	    scrollX: scrollCon,
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/event/front/pageEventNews',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'iDisplayLength' : 10,

		fnServerParams : function ( aoData ) {

			var eventCode = $('#eventId').val().trim();
			var sourcesLevelOne = [];
			var source = $('.hotEventPredictConBtn').find('dd').find('.btn-group').find('.dropdown-toggle').find('a').find('span:first').attr('value');
			if('全部来源'!=source){
				sourcesLevelOne.push(source);
			}
			var reportType = [];
			var isTimeAxisNews;
			var isOriginal;
			$('.hotEventPredictConBtn').find('dd').children('button').each(function(index) {
				if($(this).hasClass('active')){
					var text = $(this).children('span:first').text().trim();
					if('评论报道'==text||'事实报道'==text){
						reportType.push($(this).children('span:first').attr('value').trim());
					}else if('核心报道'==text){
						isTimeAxisNews = true;
					}else if('原创报道'==text){
						isOriginal = true;
					}
				}
			});
			var showSimilar;
			if($('.hotEventPredictConBtn').find('dd').find('.merge').find('button').hasClass('active')){
				showSimilar = false;
			}else{
				showSimilar = true;
			}
			aoData.push(
					{"name":"eventCode","value":eventCode},
					{"name":"sourceCrawlLevelOne","value":sourcesLevelOne},
					{"name":"reportType","value":reportType},
					{"name":"isOriginal","value":isOriginal},
					{"name":"isTimeAxisNews","value":isTimeAxisNews},
					{"name":"showSimilar","value":showSimilar}
				);
        },
        "rowCallback" : function(row, data, index) {
                $('td:eq(1)', row).html(data.sourceCrawl);
		        var code = data.webpageCode;
				var releaseDatetime = data.releaseDatetime;
				if(releaseDatetime != null && releaseDatetime != ''){
                    code = code + '/' + releaseDatetime;
				}
                var title = '<a href="javascript:loadNewsDetail(\''+code+'\')"  class="beyondEllipsis" >'+data.title+' </a>';
                $('td:eq(2)', row).html(title);
                if($('body').width()<992){
                    $('.hotEventPredictConTable').css({
                        'width':'500px',
                    });
                    $('.hotEventPredictConTable').find('th').css({
                        'width':'200px',
                    });
                }

                if(null != data.similarNum && ""!=data.similarNum){
                    var similarNews = '(<a href="'+ctx+'/latest/front/similarNewsList/'+data.webpageCode+'" style="display:inline" target="_blank" class="relativeNews" >'+data.statEntity.sameNum+'</a>)';
                    $('td:eq(3)', row).html(similarNews);
                }else{
                    $('td:eq(3)', row).html('(<a class="relativeNews" style="display:inline">0</a>)');
                }


        },
        columns: [//显示的列
                  { data: 'releaseDatetime', "bSortable": false,
                	  render:function(data, type, row){
	            		if(null != data && "" != data){
	            			var datetime = new Date(data); 
	            			return datetime.formatDate('yyyy-MM-dd hh:mm');
	            		}
                	  }    
                  },
                  { data: 'sourceCrawl', "bSortable": false},
                  { data: 'title', "bSortable": false},
                  { data: 'statEntity.sameNum', "bSortable": false,
                	  render:function(data, type, row){
  	            		if(null == data && "" == data){
  	            			return "(0)";
  	            		}
                  	  } 
                  },
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ],
	});
	$('.hotEventPredictConTable').on('draw.dt',function() {
	//相似获取
		var textArr = table.column(3).nodes().data();
		
		tableItemWebPageCodeArr = [];
		if(textArr.length > 0){
			var textArrCon =[];
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
			}
			//相似
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getRelevantNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					console.log(data);
					$('.hotEventPredictConTable tbody').find('[class="relativeNews"]').each(function(index){
						$(this).text(data[index]);
					})
                    var scrolltop = localStorage.getItem('scrolltop');
                    if (scrolltop){
                        $(window).scrollTop(scrolltop);
                        localStorage.removeItem('scrolltop');
                    }
				}
			});
		}else {
            var scrolltop = localStorage.getItem('scrolltop');
            if (scrolltop){
                $(window).scrollTop(scrolltop);
                localStorage.removeItem('scrolltop');
            }
		}
	});
	
	
	/*链接进入-相关、相似、事件媒体*/
	/*$('.relativeNews').click(function(){
		$('#page-content').loadPage('relativeNews/relativeNews.html');
	});*/
	/*事件最新进展*/
	$('.hotEventPredictConBtn').find('dd').children('button').each(function(index) {
		$(this).click(function(){
			$(this).addClass('active').siblings('button').removeClass('active');
			table.ajax.reload();
		});
	});
	$('.hotEventPredictConBtn').find('dd').find('.btn-group').click(function(){
		if($(this).find('.dropdown-toggle').find('a').find('span:first').text()=='全部来源'){
			$(this).find('.dropdown-toggle').removeClass('active');
		}else{
			$(this).find('.dropdown-toggle').addClass('active');
		}
	});
	$('.hotEventPredictConBtn').find('dd').find('.merge').click(function(){
		if($(this).find('button').hasClass('active')){
			$(this).find('button').removeClass('active');
		}else{
			$(this).find('button').addClass('active');
		}
		table.ajax.reload();
	});

	if($('body').width()<1200){
		$('#reportCountDate').css({
			'height':'300'
		});
		$('#reportCountMedia').css({
			'height':'300'
		});
		/*$('#reportCountRegion').css({
			'height':'300'
		});*/
		$('#reportCountEmotion').css({
			'height':'300'
		});
		$('#commentWordCloud').css({
			'height':'250'
		});
	}

	$('[data-toggle="tooltip"]').tooltip();
	
	var eventCode = $('#eventId').val();
	
	/*为了发布会执行的代码  start*/
	
	if(eventCode == '104'){
		/*典型意见*/
		typicalOpinionCharts();
		/*事件报道统计——地域*/
		reportCountRegion();
		
	}else{
		$('.reportCountRegion').remove();
		$('.reportCountRegionBox').remove();
	}
		
	/*为了发布会执行的代码  end*/
		
	/*事件发展脉络图*/
	venationDiagram();
	/*评论词云*/
	commentWordCloud();
	/*echarts-事件时间轴*/
	eventTimeLine(eventCode);
	
	/*事件最新进展-button按钮*/
	changeBtnCon();
	/*事件最新进展*/
	/*countPucker();*/
	
	/*事件报道统计——情感*/
	sentimentAnalyzeData(eventCode);
	/*实体关系*/
	entityRelationData(eventCode);
	/*事件报道统计——日期*/
	reportCountDateData(eventCode);
	/*事件报道统计——媒体*/
	reportCountMediaData(eventCode);
	/*隐藏内容为空的区域*/
	hideEmptyArea();
	/*事件新闻分类统计*/
	getNewsAggs(eventCode);
	/*获取事件话题*/
	 getHotEventTopic(eventCode);
	//词条
	wiki();

    //获取最新报道
    fetchlatestNews('.latestReportContainer',ctx + '/event/front/getEventNewsLatest');
    //获取首发报道
    fetchfirstNews('.firstReportContainer',ctx + '/event/front/getEventNewsFirst');
});

//获取最新、首发报道
function fetchlatestNews(ele,url){
    var eventIdCode = $('#eventId').val().trim();
    var options = {
        ele:ele,
        data:{
            eventCode:eventIdCode
        },
        callback:latestnewsProcess
    }
    var url = url;
    ajaxMethod(url,'get',options);
}
function fetchfirstNews(ele,url){
    var eventIdCode = $('#eventId').val().trim();
    var options = {
        ele:ele,
        data:{
            eventCode:eventIdCode
        },
        callback:firstnewsProcess
    }
    var url = url;
    ajaxMethod(url,'get',options);
}
function latestnewsProcess(res,ele){
    if(!res.result){
        $(ele).hide();
        return false;
    }
    var data = res.resultObj;
    var summary= data.summary;
    var time = data.releaseDatetime;
    var keywords = data.keyExpression;
    var keywordsDom='';
    var source = data.sourceCrawl;
    if(!summary||summary=='null'){
        summary='暂无摘要';
    }
    if(!time||time=='null'){
        time='无';
    }else{
        time = new Date(time).formatDate('yyyy-MM-dd hh:mm')
    }
    if(!keywords||keywords=='null'||keywords.length==0){
        keywordsDom='<span>无</span>';
    }else{
        for(var i = 0; i < keywords.length; i++){
            if( i<5){
                keywordsDom+= '<span>'+keywords[i].expression+'</span>'
            }
        }
    }
    if(!source||source=='null'){
        source = '无'
    }else{
        source = data.sourceCrawl;
    }
    var str='<div class="reportBox">'+
        '<div class="newstitle"><h4><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'/'+data.releaseDatetime+'">'+data.title+'</a></h4></div>'+
        '<div class="relativeReportCon">'+
        '<p class="latestReport" id="overflowLatest">'+summary+'</p>'+
        '<div class="keyInfo">'+
            '<ul>'+
                '<li>'+
                    '<div class="sourceCon"><span>来源:</span><span class="source">'+source+'</span></div>'+
                    '<div class="releaseTimeCon"><span>发布时间:</span><span class="releaseTime">'+time+'</span></div>'+
                '</li>'+
                '<li class="keyWords">'+
                    '<span>关键词:</span>'+ keywordsDom +
                '</li>'+
            '</ul>'+
        '</div>'+
    '</div>'+
        '</div>';
    $(ele).append(str);
    overflowhidden('overflowLatest',2,summary);
}
function firstnewsProcess(res,ele){
    if(!res.result){
        $(ele).hide();
        return false;
    }
    var data = res.resultObj;
    var summary=data.summary;
    var time = data.releaseDatetime;
    var keywords = data.keyExpression;
    var keywordsDom='';
    var source = data.sourceCrawl;
    if(!summary||summary=='null'){
        summary='暂无摘要';
    }
    if(!time||time=='null'){
        time='无';
    }else{
        time = new Date(time).formatDate('yyyy-MM-dd hh:mm')
    }
    if(!keywords||keywords=='null'||keywords.length==0){
        keywordsDom='<span>无</span>';
    }else{
        for(var i = 0; i < keywords.length; i++){
            if(i<5){
                keywordsDom+= '<span>'+keywords[i].expression+'</span>'
            }

        }
    }
    if(!source||source=='null'){
        source = '无'
    }else{
        source = data.sourceCrawl;
    }
    var str='<div class="reportBox">'+
        '<div class="newstitle"><h4><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'/'+data.releaseDatetime+'">'+data.title+'</a></h4></div>'+
        '<div class="relativeReportCon">'+
        '<p class="latestReport" id="overflowFirst">'+summary+'</p>'+
        '<div class="keyInfo">'+
        '<ul>'+
        '<li>'+
        '<div class="sourceCon"><span>来源:</span><span class="source">'+source+'</span></div>'+
        '<div class="releaseTimeCon"><span>发布时间:</span><span class="releaseTime">'+time+'</span></div>'+
        '</li>'+
        '<li class="keyWords">'+
        '<span>关键词:</span>'+ keywordsDom +
        '</li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';
    $(ele).append(str);
    overflowhidden('overflowFirst',2,summary);
}
/* 事件发展脉络图 */
function venationDiagram(){
	var count = 0;
	if(!$(".history").length){
		return;
	}
	var $warpEle = $(".history-date"),
		$targetA = $warpEle.find("h2 a"),
		parentH,
		eleTop = [];
	
	parentH = $warpEle.parent('.history').height();
	$warpEle.parent().css({"height":59});
	setTimeout(function(){
		
		$warpEle.find("ul").children(":not('h2:first')").each(function(idx){
			eleTop.push($(this).position().top);
			$(this).css({"margin-top":-eleTop[idx]}).children().hide();
		}).animate({"margin-top":0}, 1600).children().fadeIn();
		$warpEle.parent().animate({"height":parentH}, 2600,function(){
			$(this).css("height","auto");
		});

		$warpEle.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({"-webkit-animation-duration":"2s","-webkit-animation-delay":"0","-webkit-animation-timing-function":"ease","-webkit-animation-fill-mode":"both"}).end().children("h2").css({"position":"relative"});
		$warpEle.parent().removeAttr("style");
	}, 600);

	$targetA.click(function(){
		$(this).parent().css({"position":"relative"});
		$(this).parent().siblings().slideToggle();
		$warpEle.parent().removeAttr("style");
		if(count == 0){
			$(this).find('i').css({
				'-o-transition': 'transform .2s linear',
				'-moz-transition':' transform .2s linear',
				'-webkit-transition': 'transform .2s linear',
				'-ms-transition': 'transform .2s linear',
				'-ms-transform': 'rotate(90deg)',
				'-moz-transform': 'rotate(90deg)',
				'-webkit-transform': 'rotate(90deg)',
				'transform': 'rotate(90deg)'
			});
			count++;
		}else{
			$(this).find('i').css({
				'-o-transition': 'transform .2s linear',
				'-moz-transition':' transform .2s linear',
				'-webkit-transition': 'transform .2s linear',
				'-ms-transition': 'transform .2s linear',
				'-ms-transform': 'rotate(0deg)',
				'-moz-transform': 'rotate(0deg)',
				'-webkit-transform': 'rotate(0deg)',
				'transform': 'rotate(0deg)'
			});
			count--;
		}
		
		return false;
	});

	/*点击标题出现正文内容*/
	$('.textVD').slideUp('fast').addClass('hide1');
	$('.history-date').find('.contentVD').each(function(){
		$(this).find('.titleVD').mouseover(function(){
			if($(this).siblings('.textVD').hasClass('show1')){
				return false;
			}else{
				$('.history-date').find('.contentVD').each(function(){
					$(this).find('.textVD').slideUp('400').addClass('hide1').removeClass('show1');
				});
				$(this).siblings('.textVD').slideDown('400').addClass('show1').removeClass('hide1');
			}
		});
	});
};

/*echarts-事件时间轴*/
var timeLineOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
            textStyle: {
                color: "#fff"
            }
        },
    },
    grid: {
    	left : '3%',
		right : '5%',
		bottom : '25%',
		top : '8%',
        borderWidth: 0,
        textStyle: {
            color: "#fff"
        },
        containLabel : true
    },
    xAxis: [
        {
            type: 'category',
            axisLine: {show: true},
            axisTick: {show: false},
            axisLabel: {
                interval:'auto',
                formatter:function(value,index){
					var textStr = value.replace(' ','年\n');
					
					return textStr;
				}
            },
            splitArea: {show: false},
            data: []
        }
    ],
    yAxis: [{
        type: "value",
        splitLine: {
            show: false
        },
    }],
    dataZoom: [{
    	type:'slider',
        show: true,
        height: 30,
        right:'10%',
        left:'10%',
        start: 0,
        end: 100,
        xAxisIndex:[0],
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle:{
            color:"#d3dee5",
        },
        textStyle:{
            color:"#666"
        },
        borderColor:"#90979c"
    },
    {
        type: 'inside',
        start: 94,
        end: 100
    }],
    series: [
         {
         	name:'统计量',
            type: "bar",
            itemStyle: {
                normal: {
                    color: "#F44336",
                    barBorderRadius: 0,
                }
            },
            barMaxWidth:'20px',
            data: [],
        }
    ]
};
/*
 * 事件时间轴
 */
function eventTimeLine(eventCode){
	// 基于准备好的dom，初始化ECharts实例
	var timeLineChart = echarts.init(document.getElementById('timeLine'));
	// 使用刚指定的配置项和数据显示图表。
	timeLineChart.setOption(timeLineOption);
	timeLineChart.showLoading();
	var option = timeLineChart.getOption();
	$.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/event/front/timeaxis/"+eventCode,
        dataType: "json",
        // 返回数据形式为json
        success: function(result) {
            if (result.result) {
                option.xAxis[0].data = result.resultObj[0];
                option.series[0].data = result.resultObj[1];
                timeLineChart.setOption(option);
                timeLineChart.hideLoading();
            } else {
                console.log(result.errorMsg);
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            timeLineChart.hideLoading();
        }
    });
};

/*评论词云*/
function commentWordCloud(){
	var commentWCChart = echarts.init(document.getElementById('commentWordCloud'));
	var commentWCOption = {
		backgroundColor : '#f9f9f9',
	    tooltip: {},
	    series: [{
	        type: 'wordCloud',
	        gridSize: 20,
	        sizeRange: [12, 50],
	        textRotation : [ 0, 30, 90, -30 ],
	        textPadding : 10,
	        shape: 'square',
	        left: 'center',
	        top: 'center',
	        width: '95%',
	        height: '95%',
	        right: null,
        	bottom: null,
	        textStyle: {
	            normal: {
	                color: function() {
	                    return 'rgb(' + [
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160)
	                    ].join(',') + ')';
	                }
	            },
	        },
	        data: [{
	            name: '马拉宁',
	            value: 10000,
	            textStyle: {
	                normal: {
	                    color: 'black'
	                },
	                emphasis: {
	                    color: 'red'
	                }
	            }
	        }, {
	            name: '希腊',
	            value: 6181
	        }, {
	            name: '公寓',
	            value: 4386
	        }, {
	            name: '俄罗斯',
	            value: 4055
	        }, {
	            name: '使馆',
	            value: 2467
	        }, {
	            name: '身忙',
	            value: 2244
	        }, {
	            name: '土耳其',
	            value: 1898
	        }, {
	            name: '新华社',
	            value: 1484
	        }, {
	            name: '法新社',
	            value: 1112
	        }, {
	            name: '马骁',
	            value: 965
	        }, {
	            name: '广州',
	            value: 847
	        }, {
	            name: '深圳',
	            value: 582
	        }, {
	            name: '中国',
	            value: 555
	        }, {
	            name: '厦门',
	            value: 550
	        }, {
	            name: '美国',
	            value: 462
	        }, {
	            name: '中山纪念碑',
	            value: 366
	        }, {
	            name: '苏军',
	            value: 360
	        }, {
	            name: '红旗',
	            value: 282
	        }, {
	            name: '北京',
	            value: 273
	        }, {
	            name: '克里姆林宫',
	            value: 265
	        }, {
	            name: '苏联红军中心大楼',
	            value: 282
	        }, {
	            name: '权利',
	            value: 273
	        }, {
	            name: '俄罗斯亚历山德罗夫红旗歌舞团',
	            value: 265
	        }]
	    }]
	};
	commentWCChart.setOption(commentWCOption);
};

/*实体关系分析获取数据*/
function entityRelationData(eventCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/event/front/entityRelation",
		data: {
			eventCode : eventCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data.nodeList || data.nodeList.length == 0){
				$(".entityRelationDiv").html("");
				hideEmptyArea();
			}else{
				entityRelation(data);
			}
			
		},
		error : function(errorMsg) {
			console.log("实体关系分析图表请求数据失败啦!");
		}
	});
}

/*实体关系*/
function entityRelation(data){
	
	var entityRelationChart = echarts.init(document.getElementById('entityRelationPic'));
    //准备好数据
    //以下为节点数据，每一个{}里面为一个节点，category（该节点类别），name（关系连接的关键字，可以理解为键值中的键，可为数字）
    //value(节点的值，可以设置节点半径与该值的关系)，label（该字段是我用来显示该节点标签的，可以改名），大家也可以自己设置其他字段
    var graph = {};//数据
    graph.nodes = data.nodeList;
    //以下为连线关系数据，每一个{}里面为一个关系，source（起点，对应上面的name），target（终点，对应上面的name）
    //value(起点到终点的距离，值越大，权重越大，距离越短)
    graph.links = data.linkList;

    //categories为node节点分类，categoriesshort为显示图例，后者比前者短，可以使得图例中没有主干人物
    graph.categories = [{name:''}];
    /*graph.categoriesshort = [{name:'家人'},{name:'朋友'} ];*/

    // 设置关系图节点标记的大小
  /* graph.nodes.forEach(function (node) {
        node.symbolSize = node.value*3;
    });*/
    var entityRelationOption = {
        /*title: {
          text: '人际关系网络图',//标题
          subtext: '人物关系：乔布斯',//标题副标题
          top: 'top',//相对在y轴上的位置
          left: 'center'//相对在x轴上的位置
        },*/
        tooltip : {//提示框，鼠标悬浮交互时的信息提示
          trigger: 'item',//数据触发类型
          formatter: function(params){//触发之后返回的参数，这个函数是关键
//            if (params.data.category !=undefined) {//如果触发节点
//              return '人物:'+params.data.label;//返回标签
//            }else {//如果触发边
//              return '关系:'+params.data.label;
//            }
          },
        },
        //工具箱，每个图表最多仅有一个工具箱
        toolbox: {
        	show : true,
        	right:'3%',
        	feature : {//启用功能
          		//dataView数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
          		/*dataView: {show: true, readOnly: true},//后期修改数据
*/          		restore : {show: true},//restore，还原，复位原始图表
          		saveAsImage : {show: true,title:'存为图片'}//saveAsImage，保存图片
        	}
      	},
      	//全局颜色，图例、节点、边的颜色都是从这里取，按照之前划分的种类依序选取
      	color:['#f5960e','rgb(178,144,137)','rgb(97,160,168)','rgb(97,10,20)','rgb(160,10,100)'],
      //图例，每个图表最多仅有一个图例
      	/*legend: [{
        	x: 'left',//图例位置
        	//图例的名称，这里返回短名称，即不包含第一个，当然你也可以包含第一个，这样就可以在图例中选择主干人物
        	data: graph.categoriesshort.map(function (a) {
                return a.name;
            })
      	}],*/
      	//sereis的数据: 用于设置图表数据之用
      	series : [
        	{
         	 	name: '人际关系网络图',//系列名称
          		type: 'graph',//图表类型
          		layout: 'force',//echarts3的变化，force是力向图，circular是和弦图
          		draggable: true,//指示节点是否可以拖动
          		data: graph.nodes,//节点数据
          		links: graph.links,//边、联系数据
          		categories: graph.categories,//节点种类
          		focusNodeAdjacency:true,//当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点
          		roam: true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          		label: {//图形上的文本标签，可用于说明图形的一些数据信息
            		normal: {
              			show : true,//显示
              			position: 'right',//相对于节点标签的位置
              			//回调函数，你期望节点标签上显示什么
              			formatter: function(params){
                			return params.data.label;
              		},
            	}
          	},
        //节点的style
        itemStyle:{
            normal:{
              opacity:0.9,//设置透明度为0.8，为0时不绘制
            },
        },
        // 关系边的公用线条样式
        lineStyle: {
            normal: {
              show : true,
              color: 'target',//决定边的颜色是与起点相同还是与终点相同
              curveness: 0.3//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
            }
        },
        force: {
            edgeLength: [100,200],//线的长度，这个距离也会受 repulsion，支持设置成数组表达边长的范围
            repulsion: 100//节点之间的斥力因子。值越大则斥力越大
          }
        }
      ]
    };
	entityRelationChart.setOption(entityRelationOption);
}

/*事件报道统计——日期数据*/
function reportCountDateData(eventCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/event/front/fiveDaysReport",
		data: {
			eventCode : eventCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null != data.dateDay && data.dateDay.length > 0){
				reportCountDate(data);
			}else{
				//隐藏图表
				/*$(".reportCountBox").find(".reportCountDate").remove();
				hideEmptyArea();*/
				$('#list_mark').find('b.reportCountDate').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$(".reportCountBox").find(".reportCountDate").remove();
				$('.reportCountBox').find('.list1:eq(0)').css('display','block');
			}
			
		},
		error : function(errorMsg) {
			console.log("5日报道量统计图表请求数据失败啦!");
		}
	});
}

/*事件报道统计——日期*/
function reportCountDate(data){
	var dateChart = echarts.init(document.getElementById('reportCountDate'));
	var dateOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		toolbox : {
			orient : 'horizontal',
			x : 'right',
			y : 'top',
			right:'35%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},

				saveAsImage : {
					show : true
				},

				myTool1: {
	                show: true,
	                title: '返回',
	                icon: 'image://'+context+'/frontEnd/image/hotEventDetail/back.png',
	                onclick: function (){
	                    dateChart.setOption({
					    	xAxis: {
						        data : data.dateDay,
						        axisLabel: {
						            interval: 'auto',
						            margin:10
						        },
						    },
				            series: [{
				            	barWidth : '30%',
				                // 通过饼图表现单个柱子中的数据分布
				                data : data.dayCount,
				            }]
				        });
	                    dateChart.on('click',function(params){

                            if (params.componentType === 'markPoint') {
                                return;
                            }
                            else if (params.componentType === 'series') {
                                reportCountDetailedDate(params);
                            }
	                    });
	                }
	            },


			}
		},
		grid : {
			left : '3%',
			right : '5%',
			bottom : '5%',
			top : '21%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			data : data.dateDay,
		} ],
		yAxis : [ {
			type : 'value',
			/*min : 0,
			max : 2500,
			interval : 500,*/
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '报道量(个)',
			type : 'bar',
			data : data.dayCount,
			/*barWidth : '30%',*/
			barMaxWidth:'20px',
			barGap:'10px',
			markPoint : {
				data : [ {
					type : 'max',
					name : '最大值'
				}, ]
			},
		} ]
	};
	dateChart.setOption(dateOption);
	dateChart.on('click', function (params) {
        if (params.componentType === 'markPoint') {
            return;
        }
        else if (params.componentType === 'series') {
            reportCountDetailedDate(params);
        }
	});

	
	function reportCountDetailedDate(params){
		var name = JSON.stringify(params.name);
		name = name.replace(/"/g,'');
		if(name != '今日'){
			dateChart.setOption({
                tooltip : {
                    trigger : 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'none'
                    },
                    formatter : '{a}<br/>{b} : {c}',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
		    	xAxis: {
                    type : 'category',
			        data: ["1时","2时","3时",'4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时','24时'],
			        axisLabel: {
			            interval: 'auto',
			            margin:10
			        },
			    },
                yAxis : [ {
                    type : 'value',
                    axisLabel : {
                        formatter : '{value}'
                    },
                } ],
	            series: [{
                    name:'报道量(个)',
	            	type : 'bar',
	            	barWidth:'80%',
	                // 通过饼图表现单个柱子中的数据分布
	            	data: data.hourCount[name],
	            }]
	        });
	        dateChart.off('click');
		}else{
			dateChart.setOption({
                tooltip : {
                    trigger : 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'none'
                    },
                    formatter : '{a}<br/>{b} : {c}',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
		    	xAxis: {
                    type : 'category',
			        data: data.todayHours,
			        axisLabel: {
			            interval: 'auto',
			            margin:10
			        },
			    },
                yAxis : [ {
                    type : 'value',
                    axisLabel : {
                        formatter : '{value}'
                    },
                } ],
	            series: [{
                    name:'报道量(个)',
	            	type : 'bar',
	            	barWidth:'80%',
	                // 通过饼图表现单个柱子中的数据分布
	                data: data.hourCount[name],
	            }]
	        });
			dateChart.off('click');
		}
	}

}
/*事件报道统计——媒体数据*/
var mediaList = [];
function reportCountMediaData(eventCode){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/event/front/reportCountMedia",
		data: {
			eventCode : eventCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data.mediaReport || data.mediaReport.length == 0){
				//隐藏图表
				/*$(".reportCountBox").find(".reportCountMedia").remove();
				hideEmptyArea();*/
				
				$('#list_mark').find('b.reportCountMedia').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$(".reportCountBox").find(".reportCountMedia").remove();
				$('.reportCountBox').find('.list1:eq(0)').css('display','block');
				
			}else{
                if( data.idList && data.idList.length ){
                    mediaList = data.idList;
                }
				reportCountMedia(data);
			}
		},
		error : function(errorMsg) {
			console.log("媒体提及率统计图表请求数据失败啦!");
		}
	});
}

/*事件报道统计——媒体*/
function reportCountMedia(data){
	var reportCountMediaWidth;
	if($('#reportCountDate').width()==null || $('#reportCountDate').width()==''){
		if($('#reportCountMedia').width()==null || $('#reportCountMedia').width()==''){
			if($('#reportCountEmotion').width()==null || $('#reportCountEmotion').width()==''){
				
			}else{
				reportCountMediaWidth = $('#reportCountEmotion').width();
			}
		}else{
			reportCountMediaWidth = $('#reportCountMedia').width();
		}
	}else{
		reportCountMediaWidth = $('#reportCountDate').width();
	}
	$('#reportCountMedia').css({
		'width':reportCountMediaWidth,
	});
	var mediaChart = echarts.init(document.getElementById('reportCountMedia'));
	var mediaOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		grid : {
			left : '1%',
			right : '10%',
			bottom : '5%',
			top : '8%',
			containLabel : true
		},
		xAxis : {
			type : 'value',
			boundaryGap : [ 0, 0.01 ],
			position : 'top',
			name : ''
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            //rotate: 30
	            formatter: function(value, index){
	            	var valueStr = '';
	            	if(value.length>8){
	            		valueStr = value.substring(0,8)+'...';
	            	}else{
	            		valueStr = value;
	            	}
	            	return valueStr
	            },
	            textStyle:{
	            	fontFamily:'Microsoft Yahei'
	            }
	        },
			data : data.mediaReport
		},
		series : [ {
			name : '媒体提及率',
			type : 'bar',
			data : data.count,
			/*barWidth : '10px',*/
			barMaxWidth:'20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
		}, ]
	};
	mediaChart.setOption(mediaOption);
	mediaChart.on('click',function(params){
		var eventId = $('#eventId').val();//clusterid
        var dataIndex = params.dataIndex;
        var id = mediaList[dataIndex];
		window.open(ctx+'/latest/front/eventMediaList/'+id+'/'+eventId);
	});
}

/*事件报道统计——地域*/
function randomData() {
    return Math.round(Math.random()*500);
}
function reportCountRegion(){
	var reportCountRegionWidth;
	if($('#reportCountDate').width()==null || $('#reportCountDate').width()==''){
		if($('#reportCountMedia').width()==null || $('#reportCountMedia').width()==''){
			if($('#reportCountEmotion').width()==null || $('#reportCountEmotion').width()==''){
				
			}else{
				reportCountRegionWidth = $('#reportCountEmotion').width();
			}
		}else{
			reportCountRegionWidth = $('#reportCountMedia').width();
		}
	}else{
		reportCountRegionWidth = $('#reportCountDate').width();
	}
	
	$('#reportCountRegion').css({
		'width':reportCountRegionWidth,
	});
	var regionChart = echarts.init(document.getElementById('reportCountRegion'), 'macarons');

	var regionOption = {
		tooltip : {
			trigger : 'item',
		/* axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
		} */
		},
		visualMap : {
			min : 0,
			max : 5000,
			x : 'left',
			y : 'bottom',
			text : [ '高', '低' ], // 文本，默认为数值文本
			calculable : true,
			color : [ 'red', '#f5d47a' ],
			itemWidth:'10',
			itemHeight:'100',
		},
		toolbox : {
			show : true,
			orient : 'horizontal',
			x : 'right',
			y : 'top',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : true,
					buttonColor : '#F44336',
					optionToContent : function(opt) {
						var series = opt.series[0].data;
						for ( var i = 0; i < series.length; i++) {
							for ( var j = i; j < series.length; j++) {
								if (parseInt(series[i].value) < parseInt(series[j].value)) {
									var serVal = series[i];
									series[i] = series[j];
									series[j] = serVal;
								}
							}
						}
						var table = '<div style="width:100%;height:100%"><table class="table" style="width:100%;"><tbody>'
						/* + '<td>' + series[0].data[0].name + '</td>'
						+ '</tr>'; */
						for ( var i = 0, l = 8; i < l; i++) {
							table += '<tr>' + '<td>' + series[i].name + '：'
									+ series[i].value + '</td>' + '<td>'
									+ series[i + 9].name + '：'
									+ series[i + 9].value + '</td>'
									+ '<td>' + series[i + 18].name + '：'
									+ series[i + 18].value + '</td>'
									+ '<td>' + series[i + 26].name + '：'
									+ series[i + 26].value + '</td>'
									+ '</tr>';
						}
						table += '<tr>' + '<td>' + series[8].name + '：'
								+ series[8].value + '</td>' + '<td>'
								+ series[17].name + '：' + series[17].value
								+ '</td>' + '<td></td><td></td>'
								+ '</tr></tbody></table></div>';
						return table;
					}
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [
		{
			name : '评论',
			type : 'map',
			mapType : 'china',
			top : '12%',
			bottom : '11%',
			left : '3%',
			right : '3%',
			roam : false,
			itemStyle : {
				normal : {
					label : {
						show : false
					},
					areaStyle : {
						color : '#11EEEE'
					},
					color : 'rgba(255,0,255,0.8)'
				},
				emphasis : {
					label : {
						show : true
					}
				}
			},
			data:[
                {name: '北京',value: '4360' },
                {name: '天津',value: '674' },
                {name: '上海',value: '3791' },
                {name: '重庆',value: '1202' },
                {name: '河北',value: '125' },
                {name: '河南',value: '2437' },
                {name: '云南',value: '663' },
                {name: '辽宁',value: '1411' },
                {name: '黑龙江',value: '145' },
                {name: '湖南',value: '1283' },
                {name: '安徽',value: '1165' },
                {name: '山东',value: '4977' },
                {name: '新疆',value: '468' },
                {name: '江苏',value: '4872' },
                {name: '浙江',value: '3446' },
                {name: '江西',value: '569' },
                {name: '湖北',value: '1465' },
                {name: '广西',value: '898' },
                {name: '甘肃',value: '679' },
                {name: '山西',value: '623' },
                {name: '内蒙古',value: '631' },
                {name: '陕西',value: '1270' },
                {name: '吉林',value: '368' },
                {name: '福建',value: '1202' },
                {name: '贵州',value: '264' },
                {name: '广东',value: '4390' },
                {name: '青海',value: '197' },
                {name: '西藏',value: '129' },
                {name: '四川',value: '489' },
                {name: '宁夏',value: '162' },
                {name: '海南',value: '156' },
                {name: '台湾',value: '190' },
                {name: '香港',value: '205' },
                {name: '澳门',value: '589' }
            ],
		} ]
	};
	regionChart.setOption(regionOption);
}

/*情感分析取数据*/
function sentimentAnalyzeData(eventCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/event/front/sentiment",
		data: {
			eventCode : eventCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.neutralCount == 0 && data.positiveCount ==0 && data.negativeCount ==0){
				//隐藏图表
				/*$(".reportCountBox").find(".reportCountEmotion").remove();
				hideEmptyArea();*/
				
				
				
				if(eventId == '104'){
					reportCountEmotionDefault();
				}else{
					$('#list_mark').find('b.reportCountEmotion').remove();
					$('#list_mark').find('b:eq(0)').addClass('active');
					$(".reportCountBox").find(".reportCountEmotion").remove();
					$('.reportCountBox').find('.list1:eq(0)').css('display','block');
				}
			}else{
				reportCountEmotion(data);
			}
		},
		error : function(errorMsg) {
			console.log("情感分析图表请求数据失败啦!");
		}
	});
}

/*事件报道统计——情感*/
function reportCountEmotion(data){
	console.log(data.positiveCount);
	console.log(data.neutralCount);
	console.log(data.negativeCount);
	var reportCountEmotionWidth;
	if($('#reportCountDate').width()==null || $('#reportCountDate').width()==''){
		if($('#reportCountMedia').width()==null || $('#reportCountMedia').width()==''){
			if($('#reportCountEmotion').width()==null || $('#reportCountEmotion').width()==''){
				
			}else{
				reportCountEmotionWidth = $('#reportCountEmotion').width();
			}
		}else{
			reportCountEmotionWidth = $('#reportCountMedia').width();
		}
	}else{
		reportCountEmotionWidth = $('#reportCountDate').width();
	}
	$('#reportCountEmotion').css({
		'width':reportCountEmotionWidth,
	});
	var emotionChart = echarts.init(document.getElementById('reportCountEmotion'));
	var emotionOption = {
		color : [ '#c23531', '#2f4554', '#61a0a8', ],
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		legend : {
			orient : 'vertical',
			x : 'right',
			top : '3%',
			right:'3%',
			data : [ '正面指数', '中性指数', '负面指数' ],
		},
		series : [ {
			name : '情感分析',
			type : 'pie',
			center:['50%','60%'],
			radius : [ '30%', '45%' ],
			label : {
				normal : {
					show : true,
					formatter : "{d}%",
					textStyle : {
						fontSize : 14
					}
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					},
				}
			},
			labelLine : {
				normal : {
					show : true
				}
			},
			itemStyle : {
				normal : {
					areaStyle : {
						color : '#F44336'
					},
				},
			},
			data : [ {
				value : data.positiveCount,
				name : '正面指数'
			}, {
				value : data.neutralCount,
				name : '中性指数'
			}, {
				value : data.negativeCount,
				name : '负面指数'
			}, ]
		} ]
	};
	emotionChart.setOption(emotionOption);
}


function changeBtnCon(){
	$('.btn-group').each(function(index, el) {
		$(this).find('ul.dropdown-menu>li').click(function(event) {
			var scrollTop = $(window).scrollTop();
			localStorage.setItem('scrolltop',scrollTop);
			$(this).parents('ul.dropdown-menu').siblings('button').html($(this).html()+' <span class="caret"></span>');
			table.ajax.reload();
		});
	});
}

/*事件最新进展*/
function countPucker(){
	$('.hotEventPredictConTit').animate({
		'right': '-268px',
	}, 8000, 'easeInBack',function(){
		$('.hotEventPredictConTitP').animate({
			'right':'0px',
		},1000,'easeInOutBack');
	});
	
	$('.hotEventPredictConTitP').click(function(){
		
		$('.hotEventPredictConTitP').animate({
			'right':'-32px',
		},500,'easeInBack',function(){
			$('.hotEventPredictConTit').animate({
				'right': '0px',
			}, 2000, 'easeInOutBack');
		});
	});

	$('.hotEventPredictConTit').click(function(event) {
		$('.hotEventPredictConTit').animate({
			'right': '-268px',
		}, 2000, 'easeInBack',function(){
			$('.hotEventPredictConTitP').animate({
				'right':'0px',
			},500,'easeInOutBack');
		});
	});
}


function loadNewsDetail(id) {
    window.open(ctx + '/latest/front/news/detail/' + id);
}

/*
 * 事件时间轴
 */
function collectionChart() {
    var myChartCollection = echarts.init(document.getElementById('collection'));
    myChartCollection.setOption(collectionOption);
    myChartCollection.showLoading();
    var option = myChartCollection.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/newstimestat",
        dataType: "json",
        // 返回数据形式为json
        success: function(result) {
            if (result.result) {
                option.xAxis[0].data = result.resultObj[0];
                option.series[0].data = result.resultObj[1];
                myChartCollection.setOption(option);
                myChartCollection.hideLoading();
            } else {
                console.log(result.errorMsg);
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartCollection.hideLoading();
        }
    });
}
/*隐藏内容为空的区域*/
function hideEmptyArea(){
	//隐藏报道核心区域
	var entityVal = $('.reportNucleusDiv').find('.listPer.box.p-right.p-left').text();
	entityVal = $.trim(entityVal);
	if(entityVal == ""){
		$('.reportNucleusDiv').html('');
	}
 	var eventRelative = $('.entityRelationDiv').text();
 	eventRelative = $.trim(eventRelative);
 	if("" ==  eventRelative && "" ==  entityVal ){
 		$('.eventRelative').html('');
 	}
	//隐藏事件报道统计图表
	var reportCountEmotion = $(".reportCountBox").find(".reportCountEmotion").text();
	reportCountEmotion = $.trim(reportCountEmotion);
	var reportCountMedia = $(".reportCountBox").find(".reportCountMedia").text();
	reportCountMedia = $.trim(reportCountMedia);
	var reportCountDate = $(".reportCountBox").find(".reportCountDate").text();
	reportCountDate = $.trim(reportCountDate);
	if(reportCountEmotion == "" && reportCountMedia == "" && reportCountDate == "" ){
		$('.reportCount').html("");
	}
}
/*
 * 获取分类统计数
 */
function getNewsAggs(eventCode){
	var param = new Array();
	 $.ajax({
	        url : ctx+'/event/front/getNewsAggs',
	        data : {"eventCode":eventCode},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	if(data.result){
	        		var result = data.resultObj;
	        		for ( var key in result) {
						$('#'+key).text(result[key]);
					}
//	        		$("#queryResultNum").text(result.total);
//	        		if(null==result.新闻门户||''==result.新闻门户||undefined==result.新闻门户){
//	        			$("#新闻门户").text(0);
//	        		}else{
//	        			$("#新闻门户").text(result.新闻门户);
//	        		}
//	        		if(null==result.官方媒体||''==result.官方媒体||undefined==result.官方媒体){
//	        			$("#官方媒体").text(0);
//	        		}else{
//	        			$("#官方媒体").text(result.官方媒体);
//	        		}
//	        		if(null==result.行业网站||''==result.行业网站||undefined==result.行业网站){
//	        			$("#行业网站").text(0);
//	        		}else{
//	        			$("#行业网站").text(result.行业网站);
//	        		}
//	        		if(null==result.社交网站||''==result.社交网站||undefined==result.社交网站){
//	        			$("#社交网站").text(0);
//	        		}else{
//	        			$("#社交网站").text(result.社交网站);
//	        		}
//	        		if(null==result.政府组织||''==result.政府组织||undefined==result.政府组织){
//	        			$("#政府组织").text(0);
//	        		}else{
//	        			$("#政府组织").text(result.政府组织);
//	        		}
//	        		if(null==result.国外媒体||''==result.国外媒体||undefined==result.国外媒体){
//	        			$("#国外媒体").text(0);
//	        		}else{
//	        			$("#国外媒体").text(result.国外媒体);
//	        		}
//	        		if(null==result.新浪微博||''==result.新浪微博||undefined==result.新浪微博){
//	        			$("#新浪微博").text(0);
//	        		}else{
//	        			$("#新浪微博").text(result.新浪微博);
//	        		}
//	        		if(null==result.核心报道||''==result.核心报道||undefined==result.核心报道){
//	        			$("#核心报道").text(0);
//	        		}else{
//	        			$("#核心报道").text(result.核心报道);
//	        		}
//	        		if(null==result.事实报道||''==result.事实报道||undefined==result.事实报道){
//	        			$("#事实报道").text(0);
//	        		}else{
//	        			$("#事实报道").text(result.事实报道);
//	        		}
//	        		if(null==result.评论报道||''==result.评论报道||undefined==result.评论报道){
//	        			$("#评论报道").text(0);
//	        		}else{
//	        			$("#评论报道").text(result.评论报道);
//	        		}
//	        		if(null==result.原创报道||''==result.原创报道||undefined==result.原创报道){
//	        			$("#原创报道").text(0);
//	        		}else{
//	        			$("#原创报道").text(result.原创报道);
//	        		}
	        	}
	        },
	        error : function(msg) {
	        }
	    });
}
/*
 * 词条
 */
function wiki(){
	var words = "";
	$(".dictionaryWord").each(function(){
		if("" == words){
			words += $(this).text();
		}else{
			words += ","+$(this).text();
		}
	 });
	if(""!=words.trim()){
		$.ajax({
			type : "get",
			async : true, //同步执行 
				url : ctx+"/lemma/checkDictionary?names="+words,
			dataType : "json", //返回数据形式为json
			success : function(data) {

				if(null != data){
					var entityWords = $("#entityWordsDiv").html();
					var dataobj = data.resultObj;

                    for (var i = 0; i < dataobj.length; i++) {
						var name = dataobj[i].lemmaTitle;
						var url = dataobj[i].url;

						var newWord = '<span class="modal_incident" onclick="dictionaryOpen(\''+url+'\')" >'+name+'</span>';

						entityWords = entityWords.replace(new RegExp("<span>"+name+"</span>", 'g'),newWord);
					}
					$("#entityWordsDiv").html(entityWords);
					
				}
				
			},
			error : function(errorMsg) {
				
			}
		});
	}
}

/*
 * 查询词条
 */
function dictionaryOpen(id){
    window.open(id);
}	
	function getHotEventTopic(eventCode){
		
		$.ajax({
			url : ctx+'/event/front/getHotEventTopic',
	        data : {
	        	"eventCode":eventCode,
	        	"taskType":"event_basic"
	        	},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	var clusterRankingList = "";
	       	 
	        	$(".hotTopicBox").find('ul.relativeList').html("");
	        	if(data.result){
	        		var rankList = data.resultObj;
	        		if(null == rankList || ''==rankList){
	        			$('.hotTopicBox').html(clusterRankingList);
	        			return;
	        		}
	        		var clusterList;
	        		if(rankList!=null){
	        			clusterList = rankList;
	        		}
	                for(var i = 0; i < clusterList.length && i <3; i++){
	                	var cluster = clusterList[i];
	                	var title = cluster.title;
	                	var clusterCode = cluster.clusterCode;
                        var time = cluster.createDatetime;
                        var startTime = new Date(time).getTime();
	                	clusterRankingList = clusterRankingList + '<li ><dl class="dl-horizontal"><dt><img src="'+context+'/frontEnd/image/eventDetail/hot1.png'+'"></dt><dd><a href="'+ctx+'/cluster/front/detail/'+clusterCode+'?startTime='+startTime+'" target="_blank" tabindex="0" data-toggle="popover" data-original-title="" title="">'+title+'</a></dd></dl></li>';
	                }
	        	}
	            if(clusterRankingList == ""){
	            	$(".hotTopicBox").find('ul.relativeList').html("<tr><td>搜索结果为空</td></tr>");
	            }else{
	            	$(".hotTopicBox").find('ul.relativeList').html(clusterRankingList);
	            }
	            $("[data-toggle='popover']").popover({
	                trigger: 'hover',
	                // 触发方式
	                html: true,
	                // 为true的话，data-content里就能放html代码了
	                content: "",
	                // 这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
	            });
	        	
	        },
	        error:function(msg){
	        	
	        },
			
		});
	
}
	
	
function typicalOpinionCharts(){
	$('.typicalOpinion').removeClass('hide');
	var rCChart = echarts.init(document.getElementById('reportCountCharts'));
	var rCOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		grid : {
			left : '0%',
			right : '10%',
			bottom : '5%',
			top : '5%',
			containLabel : true
		},
		xAxis : {
			type : 'value',
			boundaryGap : [ 0, 0.01 ],
			position : 'top',
			name : ''
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            formatter: function(value, index){
	            	var valueStr = '';
	            	if(value.length>8){
	            		valueStr = value.substring(0,8)+'...';
	            	}else{
	            		valueStr = value;
	            	}
	            	return valueStr
	            },
	            textStyle:{
	            	fontFamily:'Microsoft Yahei'
	            }
	        },
			data : ['他们对他娘说','黑恶势力保护伞','杜志浩脱下裤子','又是官商勾结','借问天下人：除了张文峰审判长','儿子不知道的是','【给亲生母亲拍“毛片”】','你们走了','还有谁能做到','顶着你的','身为法官的我当然第一时间拿手机','聊城中院“于欢案”审判长张文峰发微博：“如果我的母亲被凌辱拿屌甩脸”','高利贷是不合法的','我们做不到','银行不会借钱给你'],
		},
		series : [ {
			name : '典型意见',
			type : 'bar',
			data : ['529','780','934','1610','1711','2310','2610','3098','3411','3548','4413','4527','5077','5082','5301'],
			barMaxWidth:'20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
		}, ]
	};
	rCChart.setOption(rCOption);
}

function reportCountEmotionDefault(){
	
	
	var reportCountEmotionWidthDefault;
	if($('#reportCountDate').width()==null || $('#reportCountDate').width()==''){
		if($('#reportCountMedia').width()==null || $('#reportCountMedia').width()==''){
			if($('#reportCountEmotion').width()==null || $('#reportCountEmotion').width()==''){
				
			}else{
				reportCountEmotionWidthDefault = $('#reportCountEmotion').width();
			}
		}else{
			reportCountEmotionWidthDefault = $('#reportCountMedia').width();
		}
	}else{
		reportCountEmotionWidthDefault = $('#reportCountDate').width();
	}
	$('#reportCountEmotion').css({
		'width':reportCountEmotionWidthDefault,
	});
	var emotionChart = echarts.init(document.getElementById('reportCountEmotion'));
	var emotionOption = {
		color : [ '#c23531', '#2f4554', '#61a0a8', ],
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		legend : {
			orient : 'vertical',
			x : 'right',
			top : '3%',
			right:'3%',
			data : [ '正面指数', '中性指数', '负面指数' ],
		},
		series : [ {
			name : '情感分析',
			type : 'pie',
			center:['50%','60%'],
			radius : [ '30%', '45%' ],
			label : {
				normal : {
					show : true,
					formatter : "{d}%",
					textStyle : {
						fontSize : 14
					}
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					},
				}
			},
			labelLine : {
				normal : {
					show : true
				}
			},
			itemStyle : {
				normal : {
					areaStyle : {
						color : '#F44336'
					},
				},
			},
			data : [ {
				value : 280,
				name : '正面指数'
			}, {
				value : 164,
				name : '中性指数'
			}, {
				value : 660,
				name : '负面指数'
			}, ]
		} ]
	};
	emotionChart.setOption(emotionOption);
}


function ajaxMethod(url, type, options){
    $.ajax({
        url:url,
        type:type,
        data:options.data,
        dataType:'json',
        success:function( res ){
            if(options.callback){
                if(options.ele){
                    options.callback(res,options.ele);
                }else{
                    options.callback(res);
                }
            }else{
                return;
            }
        }
    })
}


