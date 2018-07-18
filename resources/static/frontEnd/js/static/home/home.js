$(function(e){
	/*加载头部与尾部*/
	$('#header').loadPage('../common/header.html',0);
	$('#footer').loadPage('../common/footer.html');
	/*最新头条-轮播图*/
	$('.succesny').olvSlides({
		thumb: true,
		thumbPage: true,
		thumbDirection: "Y",
		effect: 'fade'
	});
	/*最新头条-文字滚动条*/
	$(".headLinesCon .list-group").mCustomScrollbar({
		setHeight:105,
		theme:"minimal-dark"
	});
	/*历史上的明天-文字纵向滚动条*/
	$(".homeHistoryTom .homeHistoryTomTable").mCustomScrollbar({
		setHeight:196,
		theme:"minimal-dark"
	});
	$("[data-toggle='tooltip']").tooltip();
	$("[data-toggle='popover']").popover({
        trigger:'hover', //触发方式
        html: true, // 为true的话，data-content里就能放html代码了
        content:"",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
	});
	/*控制全网头条中每一个li的宽度*/
	var successlunboWidth = $('.successlunbo').width();
    $('.successlunbo .change li').css({
        'width':successlunboWidth,
    });
	/*最新头条图片显示*/
	showHeadLinesImg();
	/*改变排行出的文字颜色*/
	changRed();
	/*事件日历*/
	showCalendar();
	/*网站新闻排行*/
	chooseOtherWeb();
	/*展示数据统计*/
	showDataCount();
	/*历史上的明天-文字滚动*/
	wordScroll();

	changeActive();

	/*全网头条没有图片*/
	headlinesnoneImg();

	if($('body').width()<1200){
		$('#collection').css({
			'height':'200'
		});
		$('#source').css({
			'height':'200'
		});
		$('#classification').css({
			'height':'200'
		});
		$('#original').css({
			'height':'200'
		});
	}

	footerPutBottom();
});

/*新闻头条显示轮播图*/
function showHeadLinesImg(){
	$('.hideImg').click(function(){
		$('.successlunbo').slideUp();
		$(this).addClass('hide');
		$('.showImg').removeClass('hide');
	});
	$('.showImg').click(function(){
		$('.successlunbo').slideDown();
		$(this).addClass('hide');
		$('.hideImg').removeClass('hide');
	});
}

/*全网头条没有图片*/
function headlinesnoneImg(){
	if($('.thumbCont ul').find('li').length == 0){
		$('.successlunbo').addClass('hide');

		$(".headLinesCon .list-group").css({
			'height':'300',
		});
	};
	if($('.thumbCont ul').find('li').length == 1){
		var $this = $('.thumbCont ul').find('li');

		var contentJson = {title:'',bigImg:'',url:'',text:''};
		contentJson.bigImg = $this.find('img').attr('bigImg');
		contentJson.title = $this.find('img').attr('alt');
		contentJson.url = $this.find('img').attr('url');
		contentJson.text = $this.find('img').attr('text');
		$('.succescont .control').css({
			'overflow': 'hidden',
			'position': 'relative',
			'display': 'block'
		});
		$('.succescont .control').find('ul.change').css({
			'position': 'relative',
			 'width': 813,
			 'left': 0,
		});
		var content = '';
		var contentIcon = '';
		content = '<li style="position: absolute; top: 0px; left: 0px; z-index: 0;"><div class="imgWrap"><a href="url" title="'+contentJson.title+'"><img src="'+contentJson.bigImg+'" alt="'+contentJson.title+'"></a></div><div class="opacity"></div><div class="textDesc"><div class="title"><a href="url" target="_blank">'+contentJson.title+'</a></div><div class="text">'+contentJson.text+'</div></div></li>';

		contentIcon = '<a href="#" hidefocus="true" class="ssprev"><span>Prev</span></a><a href="#" hidefocus="true" class="ssnext"><span>Next</span></a>';

		$('.succescont .control').find('ul.change').append(content);
		$('.succescont .control').find('ul.change').after(contentIcon);
	}
}
/*热点排行榜中的前3名显示红色*/
function changRed(){
	$('.rank_cont').each(function(){
		$(this).find('td.number').eq(0).find('em').attr('class',"red");
		$(this).find('td.number').eq(1).find('em').attr('class',"red");
		$(this).find('td.number').eq(2).find('em').attr('class',"red");
	});
}

/*热点事件，显示日历*/
function showCalendar(){
	var eventCanderW = '';
	if ($('body').width()>1200) {
		eventCanderW = 286;
	}else{
		eventCanderW = $('.homeHistoryTom').height();
	}
	$('#eventCander').calendar({
        width: eventCanderW,
        height: eventCanderW - 30,
		onSelected: function (view, date, data) {
			console.log('data:' + date.formatDate('yyyy-MM-dd'));
			var data = date.formatDate('yyyy-MM-dd');
			if(data == '2016-12-02'){
				$('.homeHistoryTomTable').find('tbody').text();
				var tableCon = '';
				tableCon = '<tr><td class="number">2015</td><td class="lTitle"><a href="javascript:void(0)" target="_blank"tabindex="0" data-toggle="popover">易烊千,朱婷,现身,维密秀,生日会</a></td><td >事件</td></tr>'
			}
        }  
	});

	$('#eventCander').css({
		'height':eventCanderW  +'px'
	});
}

/*热点排行——选择新闻网站*/
function chooseOtherWeb(){
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

			event.stopPropagation();
		});
	});

	$('.otherWebCon').each(function(index) {
		$(this).find('a').each(function(index){
			$(this).click(function(){
				var aCont = $(this).text();
				/*$('.hotListContOther').find('li>span.otherWeb').text(aCont);*/
				$(this).parent('.otherWebCon').prev('.otherwebTitle').find('span.otherWeb').text(aCont);
				$(this).parent('.otherWebCon').addClass('hide');

				event.stopPropagation();
			});
		});
	});
	

	/*热点排行-选择时间*/
	$('.hotListContOther .otherWebTime').find('li').each(function(){
		$(this).click(function(){
			if($(this).hasClass('act')){
				return;
			}else{
				$(this).siblings('li').removeClass('act');
				$(this).addClass('act');
			}

			event.stopPropagation();
		});
	});

	$(document).click(function(){
	    $('.otherWebCon').addClass('hide');
	});
}

/*查看数据统计*/
function showDataCount(){
	var index = 1;
	$('#dataCount').find('.dataCountBtn').click(function() {
		
		if (index == 1) {
			$(this).next().slideDown('400');
			collectionChart();
		    sourceChart();
		    classificationChart();
		    originalChart();
		    $(this).find('a').text('点击隐藏今日采集数据统计');
		    index--;
		}else{
			$(this).next().slideUp('400');
			collectionChart();
		    sourceChart();
		    classificationChart();
		    originalChart();
		    $(this).find('a').text('点击查看今日采集数据统计');
		    index++;
		}
	});
}

/*小时采集曲线图*/
function collectionChart(){
	var myChartCollection = echarts.init(document.getElementById('collection'));
	var collectionOption = {
	    tooltip: {
	        trigger: 'axis'
	    },
	    grid : {
				left : '3%',
				right : '8%',
				bottom : '3%',
				top : '20%',
				containLabel : true
		},
	    xAxis:  {
	        type: 'category',
	        boundaryGap: false,
	        data: ['12:00','13:00','14:00','15:00','16:00','17:00','18:00']
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value}'
	        }
	    },
	    series: [
	        {
	            name:'采集量',
	            type:'line',
	            data:[2503, 3003, 3503, 3000, 1503, 2403, 2003],
	            markPoint: {
	                data: [
	                    {type: 'max', name: '最大值'},
	                    {type: 'min', name: '最小值'}
	                ]
	            },
	            markLine: {
	                data: [
	                    {type: 'average', name: '平均值'}
	                ]
	            }
	        },
	    ]
	};
	myChartCollection.setOption(collectionOption);
}

/*来源饼图*/
function sourceChart(){
	var myChartSource = echarts.init(document.getElementById('source'));
	var sourceOption = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    series: [
	        
	        {
	            name:'网站',
	            type:'pie',
	            radius: ['30%', '50%'],
	            center: ['50%', '50%'],
	            label : {
					normal : {
						show : true,
						formatter : "{b}",
						textStyle : {
							fontSize : 12
						}
					},
					emphasis : {
						show : true,
						textStyle : {
							fontSize : '14',
							fontWeight : 'normal'
						},

					}
				},
	            data:[
	                {value:335, name:'新浪'},
	                {value:310, name:'网易'},
	                {value:234, name:'凤凰'},
	                {value:135, name:'腾讯'},
	                {value:1048, name:'百度'},
	                {value:102, name:'其他'}
	            ]
	        }
	    ]
	};
	myChartSource.setOption(sourceOption);
}

/*分类饼图*/
function classificationChart(){
	var myChartClassification = echarts.init(document.getElementById('classification'));
	var classificationOption = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    series: [
	        
	        {
	            name:'分类',
	            type:'pie',
	            radius: ['30%', '50%'],
	            center: ['50%', '50%'],
	            label : {
					normal : {
						show : true,
						formatter : "{b}",
						textStyle : {
							fontSize : 12
						}
					},
					emphasis : {
						show : true,
						textStyle : {
							fontSize : '14',
							fontWeight : 'normal'
						},

					}
				},
	            data:[
	                {value:335, name:'政府组织'},
	                {value:310, name:'新闻门户'},
	                {value:234, name:'传统媒体'},
	                {value:135, name:'传统网站'},
	                {value:1048, name:'行业网站'},
	                {value:251, name:'国外媒体'},
	            ]
	        }
	    ]
	};
	myChartClassification.setOption(classificationOption);
}

/*原创/转载饼图*/
function originalChart(){
	var myChartOriginal = echarts.init(document.getElementById('original'));
	var originalOption = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    series: [
	        
	        {
	            name:'分类',
	            type:'pie',
	            radius: ['30%', '50%'],
	            center: ['50%', '50%'],
	            label : {
					normal : {
						show : true,
						formatter : "{b}",
						textStyle : {
							fontSize : 12
						}
					},
					emphasis : {
						show : true,
						textStyle : {
							fontSize : '14',
							fontWeight : 'normal'
						},

					}
				},
	            data:[
	                {value:335, name:'原创'},
	                {value:310, name:'转载'},
	            ]
	        }
	    ]
	};
	myChartOriginal.setOption(originalOption);
}

/*历史上的明天-文字滚动*/
function wordScroll(){
	$('.scrollBox').each(function(){
		var spanWidth = $(this).children('.scrollBoxCon').width();
		if(spanWidth > 100){
			$(this).textScroll();
		}
	});
}

/*新闻线索*/
function changeActive(){
	$('.latestNewsContSort').find('ul').children('li').click(function(event) {
		$(this).addClass('active');
		$(this).siblings('li').removeClass('active');
		if($(this).has('otherSort')){
			$(this).find('li').click(function(){
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
		if($(this).has('otherSort')){
			$(this).find('li').click(function(){
				$(this).addClass('active');
			});
		}
	});
}

