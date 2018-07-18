$(function(){
	/*头部导航高亮*/
	
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(5)').addClass('active');
	var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4'i><'col-sm-8'p>>";
	var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
	if($('body').width()<1200){
		domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>";
		totalCount = "共计  _TOTAL_ 条";
	}
	var innerid = $('#innerid').val();
	var queryStr = $("#queryStr").val();
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
	$('.relativeReportTable').DataTable({
		scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/cluster/front/gotoClusterRelevant/'+innerid,//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'sPaginationType': "bootstrap",
        'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
        },
        "rowCallback" : function(row, data, index) {
        	var summary = '';
        	if(null != data.nlpSummary){
        		if(data.nlpSummary.length>150){
	              summary = data.nlpSummary.substr(0,150)+'...';
	            }else{
	              summary = data.nlpSummary;
	            }
        	}else{
        		summary = '暂无摘要';
        	}
        	var title = titlehighlight(data.title);
        	title = '<a href="javascript:loadWebpageDetail('+data.innerid+')"  class="beyondEllipsis" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+summary+'">'+title+' </a>';
        	$('.relativeReportTable').removeAttr('style');
        	$('td:eq(0)', row).html(title);
        	$('td:eq(0)', row).addClass("titleRightClick");
        	
        	
        	if($('body').width()<768){
	        	$('.relativeReportTable').css({
	        		'width':'800px'
	        	});
        	}
        },
        columns: [//显示的列
                 
//                  { data: 'cusClassification', "bSortable": false },
                  { data: 'title', "bSortable": false },
                  { data: 'sourceCrawlLevelTwo', "bSortable": false },
                  { data: 'sourceReport', "bSortable": false },
                  { data: 'releaseDatetime', "bSortable": false,
                	  render:function(data, type, row){
    	            		if(null != data && "" != data){
    	            			var datetime = new Date(data); 
    	            			return datetime.formatDate('MM-dd hh:mm');
    	            		}
                         }
                  },
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ]
	});
	
	$('.paginate_button').click(function(){
		scrollOffset($(".relativeReportTable").offset());
	});
	$('.relativeReportTable').on('draw.dt',function() {
    	$('.paginate_button').click(function(){
    		scrollOffset($(".relativeReportTable").offset());
    	});
    });
	
	/*报道量统计*/
	dayHoursCountData(innerid);
	/*媒体提及率*/
	reportCountMediaData(innerid);

	/*替换正文，高亮显示*/
	summaryhighlight();
	
	summarydotdotdot();
	
	/*将底部致底*/
	footerPutBottom();
});


/**
 * 摘要高亮显示
 */
function summaryhighlight() {
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
		}
	}
}

/**
 * 标题高亮显示
 */
function titlehighlight(title) {
	var queryStr = $("#queryStr").val();
	if(null != queryStr && '' != queryStr && null != title && '' != title){
		var queryList = queryStr.split(',');
		if(queryList !=null && queryList.length >0){
			console.info(queryList.length);
			for (var j = 0; j < queryList.length; j++) {
				var word = queryList[j];
				    var pattern = new RegExp(word, "mg");
				    var pool = [];
				    var i = 0;
				    title = title.replace(/<[\/]{0,1}[a-z]+[^>]*>/img,
				    function() {
				        pool[pool.length] = arguments[0];
				        return "\x00"
				    }).replace(pattern, "<span style=\"color:red\">" + word + "</span>").replace(/\x00/mg,
				    function() {
				        return pool[i++]
				    })
			}
		}
	}
	return title;
}
/**
 * 高亮显示
 */
function highlight(word) {

    var str = $(".summaryCon").html();
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
    $(".summaryCon").html(str);
}

/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}
/*5日评论量*/
function commentCountCharts(){
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
			x : 'right',
			y : 'top',
			right:'35%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '5%',
			top : '11%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			/*name : '日期',*/
			data : ['01日', '02日', '03日', '04日', '05日'],
		} ],
		yAxis : [ {
			type : 'value',
			min : 0,
			max : 2500,
			interval : 500,
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '评论数(个)',
			type : 'bar',
			data : [10, 52, 200, 334, 390],
			barWidth : '30%',
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

/*五日报道量*/
function dayHoursCountData(innerid){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/cluster/front/dayHoursCount",
		data: {
			innerid : innerid
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			countReport(data);
		},
		error : function(errorMsg) {
			/*alert(0);*/
			console.log("五日报道量图表请求数据失败啦!");
		}
	});
}
/*五日报道量统计图*/
function countReport(data){
	var dateChart = echarts.init(document.getElementById('countReport'));
	var dateOption = {
			tooltip: {
		        trigger: 'axis',
		        formatter: "{a}<br/>{b} : {c}",
		        axisPointer : { // 坐标轴指示器，坐标轴触发有效
					type : 'none'
				},
		    },
		    toolbox : {
		    	show: true,
				feature : {
					magicType : {
						show : true,
						type : [ 'line', 'bar' ]
					},

					saveAsImage : {
						show:true,
						title:'存为图片'
					},
				}
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
		        data : data.dayHour,
				axisLabel:{
					formatter:function(value,index){
						var textStr = value.replace(' ','\n');
						
						return textStr;
					}
				},
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value}'
		        }
		    },
		    series: [{
		        name: '统计量(个)',
		        type: 'line',
		        data : data.count,
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
	dateChart.setOption(dateOption);
}
/*媒体提及率数据*/
function reportCountMediaData(innerid){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/cluster/front/mediaReportCount",
		data: {
			innerid : innerid
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			reportCountMedia(data);
		},
		error : function(errorMsg) {
			console.log("媒体提及率图表请求数据失败啦!");
		}
	});
}
/*媒体提及率*/
function reportCountMedia(data){
	var mediaChart = echarts.init(document.getElementById('mediaMention'));
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
			/*barWidth : '20px',*/
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
		var innerid = $('#innerid').val();//clusterid
		window.open(ctx+'/latest/front/mediaList/'+params.name+'/'+innerid);
		
	});
}

function loadWebpageDetail(id){
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	var queryStr = $("#queryStr").val();
	if(null != queryStr && queryStr.length>0){
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id+'?queryStr='+queryStr);
	}else{
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	}
}
/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.itemDigest .summaryCon').height()>260){
        $('.itemDigest .summaryCon').css({
            'height':260,
        });
        var $summaryCon = $('.itemDigest .summaryCon');
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
                        $('.itemDigest .summaryCon').attr('style','');
                    } else {
                    	$('.itemDigest .summaryCon').css({
                            'height':260,
                        });
                        createDots();
                    }
                    return false;
                }
            );
    }

    
}
