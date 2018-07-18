$(function(){
	/*头部导航高亮显示*/
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(4)').addClass('active');
	
	
	
	var webpageCode = $('#webpageCode').val();
	if($('body').width()<1200){
		$('#hotCWEcharts').css({
			'height':'250'
		});
		$('#commentCountCharts').css({
			'height':'300'
		});
		$('#cAEchartsMap').css({
			'height':'300'
		});
		$('#emotionAnalyzeEchart').css({
			'height':'300'
		});
	};
	$('.newsDetailText').checkImg();
	$('.newsDetailText').judgeImgLoadError();
	
	changeFontStyle();
	/*5日评论量*/
	commentCountChartsData(webpageCode);
	/*典型意见*/
	reportCountData(webpageCode);

	summarydotdotdot();
	
	$('.newsDetailText').uec_inews_picture_group_news();
	/*将底部致底*/
	footerPutBottom();
	//评论词云
	commentWordCloudData(webpageCode);
	//情感分析
	getBothSidesData();
	sentimentAnalyzeData(webpageCode);
	/*评论地区分布*/
	commentAreaData(webpageCode);
	
	/*去掉正文部分每一段前面的空格*/
	var reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
	$('.newsDetailText').find('p').each(function(){
		console.log($(this).html());
		var trimString = $(this).html();
		/*alert(trimString.match(reg));*/
		if(trimString.match(reg) == null || trimString.match(reg) == '<strong>,</strong>'){
			trimString = $.trim(trimString);
			$(this).html(trimString);
		}
		
	});

	var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
	var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
	if($('body').width()<1200){
		domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3 col-xs-4'i><'col-sm-9 col-xs-8'p>>";
		totalCount = "共计  _TOTAL_ 条";
	}
	var pagingTypeCon = 'full_numbers';
	if($('body').width()<992){
		pagingTypeCon = "simple";
	}
	$('.commentHotConTable1').DataTable({
		dom:domString,
		oLanguage: { 
	    	"sInfo" : totalCount,
	    },
	    pagingType:   pagingTypeCon,
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/hot/front/pageHotComment/'+webpageCode,//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'iDisplayLength' : 10,
		fnServerParams : function ( aoData ) {
        },
        "rowCallback" : function(row, data, index) {
        	
        	var username = data.userName;
        	if(null == username || ''== username.trim()){
        		username = data.ip;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('MM-dd hh:mm');
        	/*var content = '<dl class="dl-horizontal m-bottom"><dt class="ta-left"><h6><i class="fa fa-angle-double-right red"></i>&nbsp;'+username+'</h6></dt>'
			  	        + '<dd class="ta-right"><span>'+releaseDatetime+'</span><i class="fa fa-thumbs-o-up"></i><span>'+data.vote+'</span>'
			  	        + '</dd></dl><p>'+data.content+'</p>';*/
        	var content = '<dl class="dl-horizontal m-bottom"><dt><div></div></dt><dd><div class="WB_text" ><a href="javascript:void(0)">'+username+'：</a>'+data.content+'</div><p><span>'+releaseDatetime+'</span><em>|</em><i class="fa fa-thumbs-o-up"></i><span>'+data.vote+'</span></p></dd></dl>';
        	$('td:eq(0)', row).html(content);
        },
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
	
	$('.commentHotConTable2').DataTable({
		dom:domString,
		oLanguage: { 
	    	"sInfo" : totalCount,
	    },
	    pagingType:   pagingTypeCon,
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/hot/front/pageLatestComment/'+webpageCode,//服务器请求
    	fnServerData : retrieveDataHot,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'iDisplayLength' : 10,
		fnServerParams : function ( aoData ) {
        },
        "rowCallback" : function(row, data, index) {
        	var username = data.userName;
        	if(null == username || ''== username.trim()){
        		username = data.ip;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('MM-dd hh:mm');
        	/*var content = '<dl class="dl-horizontal m-bottom"><dt class="ta-left"><h6><i class="fa fa-angle-double-right red"></i>&nbsp;'+username+'</h6></dt>'
			  	        + '<dd class="ta-right"><i class="fa fa-calendar"></i><span>'+releaseDatetime+'</span><i class="fa fa-thumbs-up"></i><span>'+data.vote+'</span>'
			  	        + '</dd></dl><p>'+data.content+'</p>';*/
        	var content = '<dl class="dl-horizontal m-bottom"><dt><div></div></dt><dd><div class="WB_text" ><a href="javascript:void(0)">'+username+'：</a>'+data.content+'</div><p><span>'+releaseDatetime+'</span><em>|</em><i class="fa fa-thumbs-o-up"></i><span>'+data.vote+'</span></p></dd></dl>';
        	$('td:eq(0)', row).html(content);
        },
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
	
	/*替换正文，高亮显示*/
//	var newsDetailText = $("#newsContent").html();
	var queryStr = $("#queryStr").val();
	if(null != queryStr && '' != queryStr){
		var queryList = queryStr.split(',');
		if(queryList !=null && queryList.length >0){
			console.info(queryList.length);
			for (var i = 0; i < queryList.length; i++) {
				var word = queryList[i];
				highlight(word);
////				var newWord = '<span style=\"color:red\">'+word+'</span>';
////				newsDetailText = newsDetailText.replace(new RegExp(word,'g'),newWord);
			}
//			$("#newsContent").html(newsDetailText);
		}
	}
	
	/*隐藏内容为空的区域*/
	hideEmptyArea();
	//词条
	wiki();
});

/*评论地区分布数据*/
function commentAreaData(webpageCode){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/commentArea",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data || data.length == 0){
				/*隐藏内容为空的区域*/
				$(".reportCountBox").find(".reportCountArea").remove();
				hideEmptyArea();
			}else{
				cAEchartsMap(data);
			}
		},
		error : function(errorMsg) {
			console.log("评论区域图表请求数据失败啦!");
		}
	});
}

/*评论地区分布*/
function randomData() {
    return Math.round(Math.random()*500);
}
function cAEchartsMap(data){
	var cAEchartsMapWidth;
	if($('#commentCountCharts').width()==null || $('#commentCountCharts').width()==''){
		if($('#cAEchartsMap').width()==null || $('#cAEchartsMap').width()==''){
			if($('#emotionAnalyzeEchart').width()==null || $('#emotionAnalyzeEchart').width()==''){
				
			}else{
				cAEchartsMapWidth = $('#emotionAnalyzeEchart').width();
			}
		}else{
			cAEchartsMapWidth = $('#cAEchartsMap').width();
		}
	}else{
		cAEchartsMapWidth = $('#commentCountCharts').width();
	}
	$('#cAEchartsMap').css({
		'width':cAEchartsMapWidth,
	});
	if('body')
	var cAChart = echarts.init(document.getElementById('cAEchartsMap'));
	var cAChartOption = {
		tooltip : {
			trigger : 'item',
		/* axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
		} */
		},
		visualMap : {
			min : 0,
			max : 500,
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
			right:'3%',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					lang:[' ', '关闭', '刷新'],
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
						var table = '<div style="width:100%;height:100%;overflow-y:scroll;margin-top:20px;"><table class="table" style="width:100%;"><tbody>'
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
					show : true,
					title:'存为图片'
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
			data:data,
		} ]
	};
	cAChart.setOption(cAChartOption);
}
/*五日报道量*/
function commentCountChartsData(webpageCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/dayHoursCount",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.count.length == 0 || data.count==''){
				/*隐藏日期为空*/
				$('.reportCountDate').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$('#list_mark').find('.list1:eq(0)').css({
					'display':'block',
				});
			}else{
				commentCountCharts(data);
			}
			
		},
		error : function(errorMsg) {
			/*alert(0);*/
			console.log("五日报道量图表请求数据失败啦!");
		}
	});
}

/*5日评论量*/
function commentCountCharts(data){
	var cAChart = echarts.init(document.getElementById('commentCountCharts'));
	var cAEchartsOption = {
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
			
			right:'3%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true,
					title:'存为图片'
				}
			}
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '5%',
			top : '20%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			/*name : '日期',*/
			data : data.dayHour,
		} ],
		yAxis : [ {
			type : 'value',
			min : 0,
//			max : 2500,
//			interval : 500,
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '评论数(个)',
			type : 'bar',
			data : data.count,
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
	cAChart.setOption(cAEchartsOption);
}

//评论词云
function commentWordCloudData(webpageCode){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/wordCloud",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			console.log(data);
			if(null == data || data.length == 0){
				$(".hotCommentWordCon").remove();
				/*隐藏内容为空的区域*/
				hideEmptyArea();
			}else{
				commentWordCloud(data);
			}
		},
		error : function(errorMsg) {
			console.log("词云图表请求数据失败啦!");
		}
	});
}

/*热门评论词*/
function commentWordCloud(data){

	var hotCWChart = echarts.init(document.getElementById('hotCWEcharts'));
	var hotCWOption = {
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
	        data: data
	    }]
	};
	hotCWChart.setOption(hotCWOption);
};

/*情感分析取数据*/
function sentimentAnalyzeData(webpageCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/sentiment",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.neutralCount == 0 && data.positiveCount ==0 && data.negativeCount ==0){
				//隐藏图表
				$('.reportCountEmotion').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$('#list_mark').find('.list1:eq(0)').css({
					'display':'block',
				});
				hideEmptyArea();
			}else{
				emotionAnalyze(data);
			}
		},
		error : function(errorMsg) {
			console.log("情感分析图表请求数据失败啦!");
		}
	});
}

/*情感分析*/
function emotionAnalyze(data){
	var emotionAnalyzeWidth;
	if($('#commentCountCharts').width()==null || $('#commentCountCharts').width()==''){
		if($('#cAEchartsMap').width()==null || $('#cAEchartsMap').width()==''){
			if($('#emotionAnalyzeEchart').width()==null || $('#emotionAnalyzeEchart').width()==''){
				
			}else{
				emotionAnalyzeWidth = $('#emotionAnalyzeEchart').width();
			}
		}else{
			emotionAnalyzeWidth = $('#cAEchartsMap').width();
		}
	}else{
		emotionAnalyzeWidth = $('#commentCountCharts').width();
	}
	
	
	$('#emotionAnalyzeEchart').css({
		'width':emotionAnalyzeWidth,
	});
	var eAChart = echarts.init(document.getElementById('emotionAnalyzeEchart'));
	var eAOption = {
		color : [ '#c23531', '#2f4554', '#61a0a8', ],
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		legend : {
			orient : 'vertical',
			x : 'right',
			top : '2%',
			data : [ '正面指数', '中性指数', '负面指数' ],
		},
		series : [ {
			name : '情感分析',
			type : 'pie',
			center:['50%','50%'],
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
				value :data.positiveCount,
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
	eAChart.setOption(eAOption);
}

/*典型意见取数据*/
function reportCountData(webpageCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/typicalOption",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.optionList == '' || data.optionList.length == 0 ){
				//隐藏图表
				hideTypicalOptionChart();
			}else{
				reportCount(data);
			}
			
		},
		error : function(errorMsg) {
			console.log("典型意见图标请求数据失败啦!");
		}
	});
}
/*典型意见*/
function reportCount(data){
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
			data : data.optionList,
		},
		series : [ {
			name : '典型意见',
			type : 'bar',
			data : data.countList,
			barMaxWidth:'20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'right',
//                    textStyle:{
//                    	color:'#333'
//                    }
                }
            },
		}, ]
	};
	rCChart.setOption(rCOption);
}

/*隐藏内容为空的区域*/
function hideTypicalOptionChart(){
	//	典型意见typicalOpinion
	var typicalOptionVal = $('.typicalOpinion').find('.box .p-right .p-left .p-bottom').text();
	typicalOptionVal = $.trim(typicalOptionVal);
	if(typicalOptionVal == ""){
		$('.typicalOpinion').html('');
	}
}
function newsDetailSummary(){
	if($('.summaryCon').height()>110){
		$('.summaryCon').css({
			'height':'110px',
			'overflow':'hidden'
		});
	}
	
}
/**
 * 换一换相关新闻
 */
function changeRelative(){
	var relativeNum = $(".relativeNum").attr("value");
	var changeNum = $(".changeNum").attr("value");
	var webpageCode = $('#webpageCode').val();
	var data = {
			relativeNum : relativeNum,
			changeNum : changeNum,
			webpageCode:webpageCode,
		};
	var postdata = JSON.stringify(data);
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/changeRelative",
		data: {
			relativeInfor:postdata
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			eventBasicList = data.eventBasicList;
			simArticleList = data.simArticleList;
			var eventHtml = "";
			$(".relativeTopic").find("ul").html("");
			if(null!= eventBasicList && eventBasicList.length > 0){
				for(var i = 0; i < eventBasicList.length;i++){
					event = eventBasicList[i];
					eventHtml += '<li><dl class="dl-horizontal"><dt><span>[专题]</span></dt><dd><a target="_blank" href="'+ctx+'/event/front/gotoEventDetail/'+event.innerid+'">'+event.eventName+'</a></dd></dl></li>';
				}
				$(".relativeTopic").find("ul").html(eventHtml);
			}
			var simHtml = "";
			$(".relativeNews").find("ul").html("");
			if(null!= simArticleList && simArticleList.length > 0){
				for(var i = 0; i < simArticleList.length;i++){
					simArticle = simArticleList[i];
					simHtml += '<li><dl class="dl-horizontal"><dt><span>[新闻]</span></dt><dd><a target="_blank" href="'+ctx+'/latest/front/gotoLatestNewsDetail/'+simArticle.innerid+'">'+simArticle.title+'</a></dd></dl></li>';
				}
				$(".relativeNews").find("ul").html(simHtml);
			}
			$(".changeNum").attr("value",++changeNum);
		},
		error : function(errorMsg) {
			console.log("获取相关新闻数据数据失败!");
		}
	});
}

/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.summaryCon').height()>90){
        $('.summaryCon').css({
            'height':90,
        });
        var $summaryCon = $('.summaryCon');
            $summaryCon.append( ' <a class="toggle" href="#"><span class="open">[展开]</span><span class="close1">[收起]</span></a>' );
            function createDots()
            {
                $summaryCon.dotdotdot({
                    after: 'a.toggle',
                    wrap: 'letter'
                });
            }
            function destroyDots() {
                $summaryCon.trigger( 'destroy' );
            }
            createDots();
            $summaryCon.on(
                'click',
                'a.toggle',
                function() {
                    $summaryCon.toggleClass( 'opened' );

                    if ( $summaryCon.hasClass( 'opened' ) ) {
                        destroyDots();
                        $('.summaryCon').attr('style','');
                    } else {
                    	$('.summaryCon').css({
                            'height':90,
                        });
                        createDots();
                        
                    }
                    return false;
                }
            );
    }
    
}


/*控制新闻的情感分析正负面效果变化*/
function getBothSidesData(){
	
    var val=$('.progress_number').text();
    $('.bothSidesTit').eq(1).removeClass('bothSidesF');
    $('.bothSidesTit').eq(0).addClass('bothSidesF');
    if(val.replace('%','')>50){
        $('.bothSidesTit').eq(1).removeClass('bothSidesF');
        $('.bothSidesTit').eq(0).addClass('bothSidesF');
    }else{
        $('.bothSidesTit').eq(0).removeClass('bothSidesF');
        $('.bothSidesTit').eq(1).addClass('bothSidesF');
    }
    $('.progress-bar-inner').css('width',val);
}

/*隐藏内容为空的区域*/
function hideEmptyArea(){
	//隐藏实体词区域
	var entityVal = $('.entityWord').find('.listPer.box.p-right.p-left').text();
	entityVal = $.trim(entityVal);
	if(entityVal == ""){
		$('.entityWord').html('');
	}
	//隐藏标签区域
	var labelVal = $('.newsDetailLabel').find('.listPer.box.p-right.p-left').text();
	labelVal = $.trim(labelVal);
	if(labelVal == ""){
		$('.newsDetailLabel').html('');
	}
	//隐藏相关内容区域
	var relativetVal = $('.newsDetailRelative').find('.box.p-left.p-right.p-top').text();
	relativetVal = $.trim(relativetVal);
	if(relativetVal == ""){
		$('.newsDetailRelative').html('');
	}

	//隐藏热点报道统计图表
	var reportCountEmotion = $(".reportCountBox").find(".reportCountEmotion").text();
	reportCountEmotion = $.trim(reportCountEmotion);
	var reportCountArea = $(".reportCountBox").find(".reportCountArea").text();
	reportCountArea = $.trim(reportCountArea);
	var reportCountDate = $(".reportCountBox").find(".reportCountDate").text();
	reportCountDate = $.trim(reportCountDate);
	if(reportCountEmotion == "" && reportCountArea == "" && reportCountDate == "" ){
		$('.reportCount').html("");
	}
	
	//隐藏热门评论词
	var hotCommentWord = $(".hotCommentWord").find(".relativeComment").text();
	hotCommentWord = $.trim(hotCommentWord);
	if(hotCommentWord == ""){
		$('.hotCommentWord').html("");
	}
	
}
function retrieveDataHot(sSource, aoData, fnCallback) {
    $.ajax({
        url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
	    	if(0==data.resultObj.iTotalRecords){
	    		$('.commentHot').addClass('hide');
	    		$('.hotCommentWord').addClass('hide');
	    		$('.reportCount').addClass('hide');
	    	}else{
	    		$('.commentHot').removeClass('hide');
	    	}
	       fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
        },
        error : function(msg) {
        }
    });
}

/**
 * 高亮显示
 */
function highlight(word) {

    var str = $("#newsContent").html();
    var pattern = new RegExp(word, "mg");
    var pool = [];
    var i = 0;
    str = str.replace(/<[\/]{0,1}[a-z]+[^>]*>/img,
    function() {
        pool[pool.length] = arguments[0];
        return "\x00"
    }).replace(pattern, "<span style=\"color:red\">" + word + "</span>").replace(/\x00/mg,
    function() {
        return pool[i++]
    })
    $("#newsContent").html(str);
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
				url : ctx+"/dictionary/front/getDictionary?names="+words,
			dataType : "json", //返回数据形式为json
			success : function(data) {
				if(null != data){
					var entityWords = $("#entityWordsDiv").html();
					for (var i = 0; i < data.length; i++) {
						var name = data[i].name;
						var pageId = data[i].id;
						var newWord = '<span class="modal_incident" onclick="dictionaryOpen('+pageId+',\''+data[i].type+'\')" >'+name+'</span>';
						entityWords = entityWords.replace(new RegExp(">"+name+"<", 'g'),">"+newWord+"<");
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
function dictionaryOpen(id,type){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/dictionary/front/getDictionaryById?pageId="+id+"&type="+type,
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null != data){
				var title = data.name;
				var content = "";
				var dic = data.detail;
				if("zgzy"==data.type){
					content = '<B>人物详情</B><div style="margin-top:10px;martin-bottom:10px"><div class="col-sm-3" style="height:190px;"><img src="'+dic.picPath+'"  style="width:150px;height:190px" /></div><div class="col-sm-9" style="height:190px;">'
							+'<p>'+dic.position+'</p>'
							+'<div class="col-sm-3">出生年月：</div><div class="col-sm-3">'+dic.birthday+'</div>'
			      			+'<div class="col-sm-3">性别：</div><div class="col-sm-3">'+dic.sex+'</div>'
			      			+'<div class="col-sm-3">籍贯：</div><div class="col-sm-3">'+dic.hometown+'</div>'
			      			+'<div class="col-sm-3">民族：</div><div class="col-sm-3">'+dic.nation+'</div>'
			      			+'<div class="col-sm-3">毕业院校：</div><div class="col-sm-3">'+dic.school+'</div>'
			      			+'<div class="col-sm-3">学位/学历：</div><div class="col-sm-3">'+dic.degree+'</div>'
							+'</div></div><B>主要经历</B><div style="clear:both;margin-top:10px">'+dic.resume+'</div>';
				}else if("wiki"==data.type){
					content = dic.dictionary.cleanText;
				}
				$("#dictionary_title").html(title);
				$("#dictionary_content").html(content);
				$("#dictionaryModal").modal('show');
			}
		},
		error : function(errorMsg) {
			
		}
	});
}

/*改变字体大小*/
function changeFontStyle(){
	$('.changeFontStyle').find('select').change(function(){
		if($(this).val() == '小号'){
			$('.newsDetailText').css({
				'fontSize':'14px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'28px',
				'marginTop':'10px',
			});
			
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'28px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'28px',
			});
		}else if($(this).val() == '中号'){
			$('.newsDetailText').css({
				'fontSize':'18px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'32px',
				'marginTop':'25px',
			});
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'32px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'32px',
			});
		}else if($(this).val() == '大号'){
			$('.newsDetailText').css({
				'fontSize':'20px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'40px',
				'marginTop':'25px',
			});
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'40px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'40px',
			});
			
		}
	});
}