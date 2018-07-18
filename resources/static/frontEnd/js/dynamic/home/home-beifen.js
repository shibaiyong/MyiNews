//var ctx="/ns";
$(function(e) {
    /* 头部导航高亮 */
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(0)').addClass('active');
	
//    热点发现
    $('.srceenMap').removeClass('hide');
    $('.srceenClassification').removeClass('hide');
    $('.srceenClusterFre').removeClass('hide');
    var screenIndex = 0;
	$('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 95 * screenIndex;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex;
		}
	})
	
	
	/*历史上的明天-文字纵向滚动条*/
	$(".homeHistoryTom .homeHistoryTomTable").mCustomScrollbar({
        axis:"y",
		setHeight:196,
		theme:"minimal-dark"
	});
	$("[data-toggle='tooltip']").tooltip();
	$("[data-toggle='popover']").popover({
        trigger:'hover', //触发方式
        html: true, // 为true的话，data-content里就能放html代码了
        content:"",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
	});
    $('.textDesc').find('.title').find('a').each(function(index, el) {
        $(this).css({
            'width': $('.imgWrap').width()-75
        });
    });
    
    /* 改变排行出的文字颜色 */
    changRed();
    /* 事件日历 */
    showCalendar();
    /* 网站新闻排行 */
    chooseOtherWeb();
    /* 展示数据统计 */
    showDataCount();
    /* 历史上的明天-文字滚动 */
    wordScroll();
    /* 获取历史上的今天 */
    getHistoryToday(new Date());


    /* 新闻线索 */
    var classifcation = $(".latestNewsContSort").find("li").find(".active").text();
    newsClue(classifcation);
    newsClueClick();
    /* 热点排行 1*/
    var webSource1 = $(".hotRanking1").find(".source").text();
	var classification1 = $(".hotRanking1").find(".classification").text();
	var cycle1 = $(".hotRanking1").find(".cycle").text();
	var type1 = $(".hotRanking1").find(".type").text();
	var jsonStr1 = {
			webSource : webSource1,
			classification : classification1,
			cycle : cycle1,
			type : type1,
	}
    var postdata1 = JSON.stringify(jsonStr1);
	hotNewsRanking1(postdata1);
    hotNewsRankingClick1();
    /* 热点排行2*/
    var webSource2 = $(".hotRanking2").find(".source").text();
    var classification2 = $(".hotRanking2").find(".classification").text();
    var cycle2 = $(".hotRanking2").find(".cycle").text();
    var type2 = $(".hotRanking2").find(".type").text();
	
    var jsonStr2 = {
			webSource : webSource2,
			classification : classification2,
			cycle : cycle2,
			type : type2,
	}
    var postdata2 = JSON.stringify(jsonStr2);
	hotNewsRanking2(postdata2);
    hotNewsRankingClick2();
    /* 聚类排行 */
	var classification = $(".clusterRanking").find(".classification").text();
	var cycle = $(".clusterRanking").find(".cycle").text();
	var taskType='cluster_task';
	var jsonStr = {
			classification : classification,
			cycle : cycle,
			taskType : taskType,
	}
    var postdata = JSON.stringify(jsonStr);
	// clusterRanking(postdata);
	// clusterRankingClick();
    	
    changeActive();
    
    if ($('body').width() < 1200) {
        $('#collection').css({
            'height': '200'
        });
        $('#source').css({
            'height': '200'
        });
        $('#classification').css({
            'height': '200'
        });
        $('#original').css({
            'height': '200'
        });
    }
    
    
    headLinesData();
    
    $('.HotEventConImg').each(function(){
    	$(this).find('img').judgeImgLoadError(ctx+'/frontEnd/image/home/defaultImg.png');
    })
    
});

//媒体头条
function headLinesData(){
	var dataVal = {
			imgCon:[],
			listCon:[]
	}
	$.ajax({
        url : ctx+'/topNewsList',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
	       if(data.result){
	    	   var obj = data.resultObj;
	    	   
	    	   for(var i=0;i<obj.length;i++){
//	    		   获取图片的新闻信息
	    		   if(obj[i].picPath != null){
	    			   dataVal.imgCon.push({
	    				   'id':obj[i].newsId,'webpageCode':obj[i].webpageCode,'title':obj[i].title,'sourceReport':obj[i].sourceReport,'imgPath':obj[i].picPath
	    			   })
	    		   }
	    		   obj[i].releaseDatetime = new Date(obj[i].releaseDatetime).formatDate('yyyy-MM-dd');
//	    		   获取所有新闻的信息
	    		   dataVal.listCon.push({
	    			   'id':obj[i].newsId,'webpageCode':obj[i].webpageCode,'title':obj[i].title,'sourceReport':obj[i].sourceReport,'releaseDatetime':obj[i].releaseDatetime,'cusSummary':obj[i].cusSummary
	    		   })
	    	   }
	    	   
	    	   if(dataVal.imgCon.length == 0){ //判读是否有图片展示
	    		   showListCon();
	    	   }else{
	    		   for(var i = 0;dataVal.imgCon.length>i;i++){
	    			   var imgPath = dataVal.imgCon[i].imgPath
	    			   dataVal.imgCon[i].imgPath = getImageUrl(imgPath);
	    		   }
	    		   showSilders();
	    		   showListCon();
	    	   }
	       }
        },	   
        error : function(msg) {
        }
	});
	
	
//	轮播图展示
	function showSilders(){
		var imgContent = '<div class="succesny"><div class="control"><ul class="change"></ul></div><div class="thumbWrap"><div class="thumbCont" ><ul>';
		for(var i = 0;dataVal.imgCon.length>i;i++){
			var imgObj = dataVal.imgCon[i];
			imgContent += '<li><div>';
			imgContent += '<img src="'+imgObj.imgPath+'" url="'+ctx+'/latest/front/news/detail/'+imgObj.webpageCode+'"  bigImg="'+imgObj.imgPath+'"  alt="'+imgObj.title+'" text="'+imgObj.sourceReport+'"/>';
			imgContent += '</div></li>';
		}
		imgContent += '</ul></div></div></div>';
		
		$('.successlunbo').html(imgContent);
		$('.succesny').olvSlides({
			thumb: true,
			thumbPage: true,
			effect: 'fade'
		});
	}
//	列表展示
	function showListCon(){
		var listContent = '';
		for(var j = 0;dataVal.listCon.length>j;j++){
			var listObj = dataVal.listCon[j];
			listContent += '<li class="list-group-item"><span class="listMun"><i class="fa fa-angle-double-right"></i></span>';
			
			if(listObj.cusSummary == null){
				listContent += '<a href="'+ctx+'/latest/front/news/detail/'+listObj.webpageCode+'" target="_blank"  class="listCon beyondEllipsis">';
			}else{
				if(listObj.cusSummary.length>300){
					listObj.cusSummary = listObj.cusSummary.substring(0, 150)+'...';
				}
				listContent += '<a href="'+ctx+'/latest/front/news/detail/'+listObj.webpageCode+'" target="_blank" tabindex="0" data-content="'+listObj.cusSummary+'" data-container=".headLinesConHover"  data-placement="right" data-toggle="popover"  class="listCon beyondEllipsis">';
			}
			
	    	listContent += '<span  class="listSou">'+listObj.sourceReport+'</span> |&nbsp;';
			listContent += '<span >'+listObj.title+'</span></a>';
			listContent += '<span class="listTit">['+listObj.releaseDatetime+']&nbsp;</span></li>';
		}
		$('.headLinesCon ul').html(listContent);
		
		/*最新头条-文字滚动条*/
		$(".headLinesCon .list-group").mCustomScrollbar({
			setHeight:105,
			theme:"minimal-dark"
		});
		
		$("[data-toggle='popover']").popover({
	        trigger:'hover', //触发方式
	        html: true, // 为true的话，data-content里就能放html代码了
	        content:"",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
		});
	}
}
//获取图片服务器路径
function getImageUrl(imageUrl){
	var imgUrl;
	$.ajax({
        url : imageUrl+'&width=640&height=360&minSize=100',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : false,
        success : function(data) {
        	if(data.result == 'success'){
        		imgUrl = data.value;
        	}
        },
        error : function(msg) {
        }
	});
	return imgUrl;
}

/* 热点排行榜中的前3名显示红色 */
function changRed() {
    $('.rank_cont').each(function() {
        $(this).find('td.number').eq(0).find('em').attr('class', "red");
        $(this).find('td.number').eq(1).find('em').attr('class', "red");
        $(this).find('td.number').eq(2).find('em').attr('class', "red");
    });
}

/* 热点事件，显示日历 */
function showCalendar() {
    var eventCanderW = '';
    if ($('body').width() > 1200) {
        eventCanderW = 286;
    } else {
        eventCanderW = $('.homeHistoryTom').height();
    }
    $('#eventCander').calendar({
        width: eventCanderW,
        height: eventCanderW - 30,
        onSelected: function(view, date, data) {
            getHistoryToday(date);
        }
    });

    $('#eventCander').css({
        'height': eventCanderW + 'px'
    });
}

/* 热点排行——选择新闻网站 */
function chooseOtherWeb() {
	$('.otherWebBox').find('.otherwebTitle').each(function(index){
		$(this).click(function(){

			if($(this).next().hasClass('hide')){
				$(this).next().removeClass('hide');
				$(this).parents('.otherWebBox').siblings().children('.otherWebCon').addClass('hide');
			}else{
				$(this).next().addClass('hide');
			}
			$(this).parents('.otherWebBox').siblings().children('.otherwebTitle').removeClass('active');
			$(this).addClass('active');

            /*event.stopPropagation();*/
            return false;
		});
	});

	$('.otherWebCon').each(function(index) {
		$(this).find('a').each(function(index){
			$(this).click(function(){
				var aCont = $(this).text();
				/*$('.hotListContOther').find('li>span.otherWeb').text(aCont);*/
				$(this).parent('.otherWebCon').prev('.otherwebTitle').find('span.otherWeb').text(aCont);
				$(this).parent('.otherWebCon').addClass('hide');

                /*event.stopPropagation();*/
                return false;
			});
		});
	});

    /* 热点排行-选择时间 */
    $('.hotListContOther .otherWebTime').find('li').each(function() {
        $(this).click(function() {
            if ($(this).hasClass('act')) {
                return;
            } else {
                $(this).siblings('li').removeClass('act');
                $(this).addClass('act');
            }

            /*event.stopPropagation();*/
            return false;
        });
    });

    $(document).click(function(){
        $('.otherWebCon').each(function(){
            if($(this).hasClass('hide')){
                return;
            }else{
                $(this).addClass('hide');
            }
        });
        /*$('.otherWebCon').addClass('hide');*/
    });
    
}

/* 查看数据统计 */
function showDataCount() {
    var index = 1;
    $('#dataCount').find('.dataCountBtn').click(function() {

        if (index == 1) {
            $('.dataCountCon').slideDown('400');
            collectionChart();
            sourceChart();
            classificationChart();
            originalChart();
            $(this).find('a').text('单击隐藏今日采集数据统计');
            index--;
        } else {
            $('.dataCountCon').slideUp('400');
            collectionChart();
            sourceChart();
            classificationChart();
            originalChart();
            $(this).find('a').text('点击查看今日采集数据统计');
            index++;
        }
    });
}

/* 小时采集曲线图 */
var collectionOption = {
    tooltip: {
        trigger: 'axis',
        formatter: "{b}时 <br/>{a}: {c}"
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}'
        }
    },
    series: [{
        name: '新闻条数',
        type: 'line',
        data: [],
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            },
            {
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        }
    },
    ]
};

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

/* 来源饼图 */
var sourceOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '来源',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: "{b}",
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        data: [{
            value: 335,
            name: '新浪'
        },
        {
            value: 310,
            name: '网易'
        },
        {
            value: 234,
            name: '凤凰'
        },
        {
            value: 135,
            name: '腾讯'
        },
        {
            value: 1048,
            name: '百度'
        },
        {
            value: 251,
            name: '谷歌'
        },
        {
            value: 147,
            name: '中国新闻网'
        },
        {
            value: 102,
            name: '其他'
        }]
    }]
};
function sourceChart() {
    var myChartSource = echarts.init(document.getElementById('source'));
    myChartSource.setOption(sourceOption);
    myChartSource.showLoading();
    var option = myChartSource.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/sourcestat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
                option.series[0].data = data.resultObj;
                myChartSource.setOption(option);
                myChartSource.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartSource.hideLoading();
        }
    });
}
var colors = [];
colors = ['#8B0016','#B2001F','#c50023','#DF0029','#E54646','#EE7c6B','#F5A89A','#FCDAD5','#8E1E20','#B6292B','#C82E31','#E33539','#EB7153','#F19373','#F6B297','#FCD9C4','#945305','#BD6B09','#D0770B','#EC870E'];
function addclassificationColors(){
	var chooseColors = '';
	chooseColors = colors[parseInt(20*Math.random())];
	return chooseColors;
}
/* 分类饼图 */
var classificationOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '分类',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: "{b}",
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        data: [{
            value: 335,
            name: '政治'
        },
        {
            value: 310,
            name: '经济'
        },
        {
            value: 234,
            name: '文化'
        },
        {
            value: 135,
            name: '生活'
        },
        {
            value: 1048,
            name: '体育'
        },
        {
            value: 251,
            name: '娱乐'
        },
        {
            value: 147,
            name: '军事'
        },
        {
            value: 102,
            name: '其他'
        }]
    }]
};
function classificationChart() {
    var myChartClassification = echarts.init(document.getElementById('classification'));
    myChartClassification.setOption(classificationOption);
    myChartClassification.showLoading();
    var option = myChartClassification.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/classificationstat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
            	console.log(data.resultObj.length);
            	if(data.resultObj.length>11){
            		var addColorsCount = data.resultObj.length-11;
            		for(var i=0;i<addColorsCount;i++){
            			var addColors = addclassificationColors();
            			option.color.push(addColors);
            		}
            	}            	
                
            	option.series[0].data = data.resultObj;
                myChartClassification.setOption(option);
                myChartClassification.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartClassification.hideLoading();
        }
    });
}

/* 原创/转载饼图 */
var originalOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '原创/转载',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: "{b}",
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        data: [{
            value: 335,
            name: '原创'
        },
        {
            value: 310,
            name: '转载'
        },
        ]
    }]
};
function originalChart() {
    var myChartOriginal = echarts.init(document.getElementById('original'));
    myChartOriginal.setOption(originalOption);
    myChartOriginal.showLoading();
    var option = myChartOriginal.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/originalstat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
                option.series[0].data = data.resultObj;
                myChartOriginal.setOption(option);
                myChartOriginal.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartOriginal.hideLoading();
        }
    });
}

/* 历史上的明天-文字滚动 */
function wordScroll() {
    $('.scrollBox').each(function() {
        var spanWidth = $(this).children('.scrollBoxCon').width();
        if (spanWidth > 100) {
            $(this).textScroll();
        }
    });
}

function changeActive() {
    $('.latestNewsContSort').find('ul').children('li').click(function(event) {
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
        if ($(this).has('otherSort')) {
            $(this).find('li').click(function() {
                $(this).addClass('active');
            });
        }
    });

    $('.homeHotListSort').find('li').click(function(event) {
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
    });

    $('.homeWebRankSort').find('li').click(function(event) {
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
        if ($(this).has('otherSort')) {
            $(this).find('li').click(function() {
                $(this).addClass('active');
            });
        }
    });
}

/**
 * 跳转到新闻详情
 * 
 * @param id
 */
function loadTopNews(id) {
    // $('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
    window.open(ctx + '/latest/front/gotoLatestNewsDetail/' + id);
}

/**
 * 跳转到热点详情
 * 
 * @param id
 */
function loadHotNews(id) {
    // $('#page-content').load(ctx+'/hot/front/gotoHotNewsDetail/'+id);
    window.open(ctx + '/hot/front/gotoHotNewsDetail/' + id);

}
/**
 * 跳转到事件详情
 * @param id
 */
function loadEventDetail(id){
	window.open(ctx+"/event/front/gotoEventDetail/"+id);
}

/**
 * 获取历史上的今天
 * 
 * @param date
 */
function getHistoryToday(date) {
    var data = date.formatDate('yyyy-MM-dd');
    $.ajax({
        type: "get",
        url: ctx + "/getHistoryToday?datetime=" + data,
        async: true,
        dataType: 'json',
        success: function(data) {
            var datas = '';
            if (data.result) {
                var map = data.resultObj;
                var newsList = map.news; // 新闻列表
                var subjectList = map.event; // 专题列表
                var time;
                var url;
                var title;
                var type;
                // 新闻
                for (var i = 0; null != newsList && i < newsList.length; i++) {
                    var news = newsList[i];
                    title = news.title;
                    time = new Date(news.releaseDatetime).formatDate('yyyy');
                    url = ctx + '/latest/front/gotoLatestNewsDetail/' + news.innerid;
                    type = "事件";
                    datas += '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="' + url + '" target="_blank" tabindex="0" data-content="'+title+'" data-container=".homeHistoryTomTableHover"  data-placement="left" data-toggle="popover">' + title + '</a></td><td >' + type + '</td></tr>';
                }
                // 专题
                for (var i = 0; null != subjectList && i < subjectList.length; i++) {
                    var subject = subjectList[i];
                    title = subject.title;
                    time = new Date(subject.occurDatetime).formatDate('yyyy');
                    url = ctx + '/event/front/gotoEventDetail/' + subject.innerid;
                    type = "专题";
                    datas += '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="' + url + '" target="_blank" tabindex="0" data-content="'+ title +'" data-container=".homeHistoryTomTableHover" data-placement="left" data-toggle="popover">' + title + '</a></td><td >' + type + '</td></tr>';
                }

            }
            $('.homeHistoryTomTable').find('tbody').html(datas);
        }
    });
}
/*新闻线索*/
function newsClue(classification) {
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/newsClue",
        data: {
            classification: classification
        },
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	
            var newsClueList = "";
            //$("#newsClueTable").find('tbody').html("");
            $(".rank.newest").find("tbody.newsClue").html("");
            for (var i = 0; i < data.length; i++) {
                var news = data[i];
                var innerid = news.innerid;
                var time = news.releaseDatetimeStr;
                var title = news.title;
                var summary = news.nlpSummary;
                if(summary.length > 200){
                	summary = summary.substr(0,200)+' ...';
                }
                var source = news.sourceCrawlLevelTwo;
                //newsClueList = newsClueList + '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="javascript:loadTopNews(' + innerid + ')" target="_blank" tabindex="0" data-toggle="popover" data-content="' + summary + '" data-original-title="" title="">' + title + '时间・奋斗・人类――聆听习近平主席2017年新年贺词</a></td><td class="lTotal">'+source+'</td>'
                newsClueList = newsClueList + '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="latest/front/gotoLatestNewsDetail/' + innerid + '" target="_blank" tabindex="0" data-toggle="popover" data-content="' + summary + '" data-original-title="" title="">' + title + '</a></td><td class="lTotal">'+source+'</td>'
            }
            //$("#newsClueTable").find("tbody").html(newsClueList);
            $(".rank.newest").find("tbody.newsClue").html(newsClueList);
            if(newsClueList == ""){
            	 $(".rank.newest").find("tbody.newsClue").html("<tr><td><tr><td>搜索结果为空</td></tr></td></tr>");
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
        error: function(errorMsg) {
            console.log("新闻线索请求数据失败!");
        }
    });
}
/*新闻线索检索*/
function newsClueClick(){
	$(".latestNewsContSort").find("li").not(".otherSort").each(function(){
		$(this).click(function(){
			var text = $(this).text();
			console.log(text);
			newsClue(text);
		})
	})
}
/*热点排行榜1*/
function hotNewsRanking1(data) {
	  $.ajax({
	        type: "get",
	        async: true,
	        // 同步执行
	        url: ctx + "/hotNewsRanking",
	        data: {
	        	hotNewsInfo: data
	        },
	        dataType: "json",
	        // 返回数据形式为json
	        success: function(data) {
	        	var hotRankingList = "";
	        	$(".rank_cont.m-top").find('tbody.hotnewsRanking1').html("");
	            
	            for(var i = 0; i < data.length; i++){
	            	var news = data[i];
	                var webpageCode = news.webpageCode;
	                var participateNumStr = news.participateNumStr;
	                var title = news.title;
	                var summary = news.nlpSummary;
	                if(summary.length > 200){
	                	summary = summary.substr(0,200)+' ...';
	                }
	                if(i < 3){
	                	//hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="javascript:loadHotNews('+webpageCode+')" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                	hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="hot/front/gotoHotNewsDetail/'+webpageCode+'" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                }else{
	                	//hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="javascript:loadHotNews('+webpageCode+')" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                	hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="hot/front/gotoHotNewsDetail/'+webpageCode+'" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                }
	            }
	            
	            if(hotRankingList == ""){
	            	$(".rank_cont.m-top").find('tbody.hotnewsRanking1').html("<tr><td>搜索结果为空</td></tr>");
	            }else{
	            	$(".rank_cont.m-top").find('tbody.hotnewsRanking1').html(hotRankingList);
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
	        error: function(errorMsg) {
	            console.log("热点排行1请求数据失败啦!");
	        }
	    });
}
/*热点排行榜1点击事件*/
function hotNewsRankingClick1(){

	$('.hotRanking1').find('.otherWebCon').each(function(index) {
		$(this).find('a').each(function(index){
			$(this).click(function(){
				var webSource = $(".hotRanking1").find(".source").text();
				var classification = $(".hotRanking1").find(".classification").text();
				var cycle = $(".hotRanking1").find(".cycle").text();
				var type = $(".hotRanking1").find(".type").text();
				var jsonStr = {
						webSource : webSource,
						classification : classification,
						cycle : cycle,
						type : type,
				}
			    var postdata = JSON.stringify(jsonStr);
				hotNewsRanking1(postdata);
			});
		});
	});
}

/*热点排行榜2*/
function hotNewsRanking2(data) {
	
	  $.ajax({
	        type: "get",
	        async: true,
	        // 同步执行
	        url: ctx + "/hotNewsRanking",
	        data: {
	        	hotNewsInfo: data
	        },
	        dataType: "json",
	        // 返回数据形式为json
	        success: function(data) {
	        	var hotRankingList = "";
	        	
	        	$(".rank_cont.m-top").find('tbody.hotnewsRanking2').html("");
	            for(var i = 0; i < data.length; i++){
	            	var news = data[i];
	                var webpageCode = news.webpageCode;
	                var participateNumStr = news.participateNumStr;
	                var title = news.title;
	                var summary = news.nlpSummary;
	                if(summary.length > 200){
	                	summary = summary.substr(0,200)+' ...';
	                }
	                if(i < 3){
	                	//hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="javascript:loadHotNews('+webpageCode+')" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                	hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="hot/front/gotoHotNewsDetail/'+webpageCode+'" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                }else{
	                	//hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="javascript:loadHotNews('+webpageCode+')" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                	hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="hot/front/gotoHotNewsDetail/'+webpageCode+'" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+participateNumStr+'</td></tr></tr>';
	                }
	            }
	            
	            if(hotRankingList == ""){
	            	$(".rank_cont.m-top").find('tbody.hotnewsRanking2').html("<tr><td>搜索结果为空</td></tr>");
	            }else{
	            	$(".rank_cont.m-top").find('tbody.hotnewsRanking2').html(hotRankingList);
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
	        error: function(errorMsg) {
	            console.log("热点排行2请求数据失败啦!");
	        }
	    });
}
/*热点排行榜2点击事件*/
function hotNewsRankingClick2(){
	$('.hotRanking2').find('.otherWebCon').each(function(index) {
		$(this).find('a').each(function(index){
			$(this).click(function(){
				var webSource = $(".hotRanking2").find(".source").text();
				var classification = $(".hotRanking2").find(".classification").text();
				var cycle = $(".hotRanking2").find(".cycle").text();
				var type = $(".hotRanking2").find(".type").text();
				var jsonStr = {
						webSource : webSource,
						classification : classification,
						cycle : cycle,
						type : type,
				}
			    var postdata = JSON.stringify(jsonStr);
				hotNewsRanking2(postdata);
			});
		});
	});
}

//热点发现
function clusterRanking(data){
	$.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/clusterRanking",
        data: {
        	clusterInfo: data
        },
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	var clusterRankingList = "";
        	 
        	$(".rank_cont").find('tbody.clusterRanking').html("");
        	if(data.result){
        		var rankList = data.resultObj;
        		if(null == rankList || ''==rankList){
        			$('#rank_cont').html(content);
        			return;
        		}
        		/*var clusterList;
        		if(rankList!=null){
        			var rank = rankList[0];
        			clusterList = rank.clusterList;
        		}*/
                for(var i = 0; i < rankList.length && i <10; i++){
                	var cluster = rankList[i];
                	var title = cluster.title;
                	var innerid = cluster.clusterCode;
                	var weight = cluster.weight;
                	if(i < 3){
                		clusterRankingList = clusterRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle linkClustering"><a href="cluster/front/detail/'+innerid+'" target="_blank" tabindex="0" data-toggle="popover" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+weight+'</td></tr>';
                	}else{
                		clusterRankingList = clusterRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle linkClustering"><a href="cluster/front/detail/'+innerid+'" target="_blank" tabindex="0" data-toggle="popover" data-original-title="" title="">'+title+'</a></td><td class="lTotal">'+weight+'</td></tr>';
                	}
                }
        	}

           
            if(clusterRankingList == ""){
            	$(".rank_cont").find('tbody.clusterRanking').html("<tr><td>搜索结果为空</td></tr>");
            }else{
            	$(".rank_cont").find('tbody.clusterRanking').html(clusterRankingList);
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
        error: function(errorMsg) {
            console.log("聚类排行请求数据失败啦!");
        }
    });
}

/*聚类排行点击事件*/
function clusterRankingClick(){
	$('.otherWebCon').each(function(index) {
		$(this).find('a').each(function(index){
			$(this).click(function(){
				var classification = $(".clusterRanking").find(".classification").text();
				var cycle = $(".clusterRanking").find(".cycle").text();
				var taskType='cluster_task';
				var jsonStr = {
						classification : classification,
						cycle : cycle,
						taskType : taskType,
				}
			    var postdata = JSON.stringify(jsonStr);
				clusterRanking(postdata);
			});
		});
	});
}

function is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
    	alert('true');
        return true;  
    } else {  
    	alert('false');
        return false;  
    }  
}
