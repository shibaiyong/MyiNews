$(function(){
	/*加载头部页*/
	$('#header').loadPage(ctx+'/gotoHeader',6);
	/*加载底部页面*/
	$('#footer').loadPage(ctx+'/gotoFooter');

	$('.hotEventPredictConTable').DataTable({
   		iDisplayLength : 20,
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	});
	/*链接进入-相关、相似、事件媒体*/
	$('.relativeNews').click(function(){
		$('#page-content').loadPage('relativeNews/relativeNews.html');
	});
	/*事件最新进展*/
	$('.hotEventPredictConBtn').find('dd').children('button').each(function(index) {
		$(this).click(function(){
			$(this).addClass('active').siblings('button').removeClass('active');
			$(this).siblings('div.btn-group').find('button.dropdown-toggle').removeClass('active');
		});
	});
	$('.hotEventPredictConBtn').find('dd').find('.btn-group').click(function(){
		$(this).siblings('button').removeClass('active');
		$(this).find('.dropdown-toggle').addClass('active');
	});

	if($('body').width()<1200){
		$('#reportCountDate').css({
			'height':'300'
		});
		$('#reportCountMedia').css({
			'height':'300'
		});
		$('#reportCountRegion').css({
			'height':'300'
		});
		$('#reportCountEmotion').css({
			'height':'300'
		});
		$('#commentWordCloud').css({
			'height':'250'
		});
	}

	$('[data-toggle="tooltip"]').tooltip();

	/*事件发展脉络图*/
	venationDiagram();
	/*评论词云*/
	commentWordCloud();
	/*echarts-事件时间轴*/
	eventTimeLine();
	/*实体关系*/
	entityRelation();
	/*事件报道统计——日期*/
	reportCountDate();
	/*事件报道统计——媒体*/
	reportCountMedia();
	/*事件报道统计——地域*/
	reportCountRegion();
	/*事件报道统计——情感*/
	reportCountEmotion();
	/*事件最新进展-button按钮*/
	changeBtnCon();
	/*事件最新进展*/
	/*countPucker();*/

});


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
		$(this).find('.titleVD').click(function(){
			if($(this).siblings('.textVD').hasClass('hide1')){
				$(this).siblings('.textVD').slideDown('400').addClass('show1').removeClass('hide1');
			}else{
				$(this).siblings('.textVD').slideUp('400').addClass('hide1').removeClass('show1');
			}
		});
	});
};

/*echarts-事件时间轴*/
function eventTimeLine(){
	// 基于准备好的dom，初始化ECharts实例
	var timeLineChart = echarts.init(document.getElementById('timeLine'));
	// 指定图表的配置项和数据
	var xData = ['11.01','11.03','11.05','11.06','11.07','11.10','11.11','11.14','11.16','11.17',
	'11.18','11.20','11.23','11.24','11.26','11.28','11.29','11.30','11.31','12.01',
	'12.02','12.03','12.05','12.06','12.07','12.10','12.11','12.14','16','17',
	'12.18','12.20','12.23','12.24','12.26','12.28','12.29','12.30','12.31','10.01',
	'10.01','10.03','10.05','10.06','10.07','10.10','10.11','10.14','10.15','10.16','10.17',
	'10.18','10.20','10.23','10.24','10.26','10.28','10.29','10.30','10.31',];
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
	                interval:'auto'
	            },
	            splitArea: {show: false},
	            data: xData
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
	            data: [
	                103,169,216,181,251,191,174,67,62,43,103,36,29,38,25,191,17,46,62,43,10,36,29,38,29,19,17,45,60,43,103,33,62,38,29,115,148,45,209,23,16,36,29,38,29,15,48,45,60,43,36,33,292,10,29,15,48,45,62,34,
	            ],
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	timeLineChart.setOption(timeLineOption);
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

/*实体关系*/
function entityRelation(){
	var entityRelationChart = echarts.init(document.getElementById('entityRelationPic'));
    //准备好数据
    //以下为节点数据，每一个{}里面为一个节点，category（该节点类别），name（关系连接的关键字，可以理解为键值中的键，可为数字）
    //value(节点的值，可以设置节点半径与该值的关系)，label（该字段是我用来显示该节点标签的，可以改名），大家也可以自己设置其他字段
    var graph = {};//数据
    graph.nodes = [
        {category:0,name: 0, value :4,label: '普京'},
        {category:1, name: 1,value : 4,label: '俄罗斯'},
        {category:1, name: 2,value : 5,label: '卡尔洛夫'},
        {category:1, name: 3,value : 5,label: '土耳其'},
        {category:1, name: 4,value : 3,label: '联合国'},
        {category:2, name: 5,value : 5,label: '安卡拉'},
    ];
    //以下为连线关系数据，每一个{}里面为一个关系，source（起点，对应上面的name），target（终点，对应上面的name）
    //value(起点到终点的距离，值越大，权重越大，距离越短)
    graph.links = [
        {source : 0, target : 1, value : 5, },
        {source : 0, target : 2, value : 4, },
        {source : 0, target : 3, value : 3, },
        {source : 0, target : 5, value : 2, },
        {source : 0, target : 4, value : 1, },

        {source : 1, target : 2, value : 5, },
        {source : 1, target : 3, value : 4, },
        {source : 1, target : 4, value : 3, },

        {source : 2, target : 3, value : 5, },
        {source : 2, target : 3, value : 4, },
        {source : 2, target : 5, value : 3, },
        /*{source : 8, target : 1, value : 6, label: '竞争对手'},
        {source : 9, target : 1, value : 1, label: '爱将'},
        {source : 10, target : 1, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 11, target : 1, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 4, target : 3, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 7, target : 3, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 7, target : 4, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 7, target : 5, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 7, target : 6, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 8, target : 7, value : 6, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 8, target : 4, value : 1, label: {normal:{show:true,formatter: '不祥'}}},
        {source : 10, target : 7, value : 1, label: {normal:{show:true,formatter: '不祥'}}}*/
    ];

    //categories为node节点分类，categoriesshort为显示图例，后者比前者短，可以使得图例中没有主干人物
    graph.categories = [{name:'主干人物'},{name:'家人'},{name:'朋友'} ];
    graph.categoriesshort = [{name:'家人'},{name:'朋友'} ];

    // 设置关系图节点标记的大小
    graph.nodes.forEach(function (node) {
        node.symbolSize = node.value*3;
    });
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
            console.log(params);
            if (params.data.category !=undefined) {//如果触发节点
              return '人物:'+params.data.label;//返回标签
            }else {//如果触发边
              return '关系:'+params.data.label;
            }
          },
        },
        //工具箱，每个图表最多仅有一个工具箱
        toolbox: {
        	show : true,
        	feature : {//启用功能
          		//dataView数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
          		dataView: {show: true, readOnly: true},//后期修改数据
          		restore : {show: true},//restore，还原，复位原始图表
          		saveAsImage : {show: true}//saveAsImage，保存图片
        	}
      	},
      	//全局颜色，图例、节点、边的颜色都是从这里取，按照之前划分的种类依序选取
      	color:['rgb(194,53,49)','rgb(178,144,137)','rgb(97,160,168)'],
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
          		roam: false,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
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

/*事件报道统计——日期*/
function reportCountDate(){
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
	                icon: 'image://D:/GitLab/ns/src/main/resources/static/frontEnd/image/hotEventDetail/back.png',
	                onclick: function (){
	                    dateChart.setOption({
					    	xAxis: {
						        data : ['07日', '08日', '09日', '10日', '今日'],
						        axisLabel: {
						            interval: 'auto',
						            margin:10
						        },
						    },
				            series: [{
				            	barWidth : '30%',
				                // 通过饼图表现单个柱子中的数据分布
				                data : [0, 0, 0, 0, 0],
				            }]
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
			data : ['08日', '09日', '10日', '11日', '今日'],
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
			data : [0, 0, 0, 0, 0],
			barWidth : '30%',
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
		if(params.name == '01日'){
			dateChart.setOption({
		    	xAxis: {
			        data: ["1时","2时","3时",'4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时','24时'],
			        axisLabel: {
			            interval: 'auto',
			            margin:10
			        },
			    },
	            series: [{
	            	type : 'bar',
	            	barWidth:'80%',
	                // 通过饼图表现单个柱子中的数据分布
	                data: [5, 4, 3, 1, 2, 2,5, 2, 6, 4, 3, 4,5, 4, 3, 1, 2, 2,5, 2, 6, 4, 3, 4],
	            }]
	        });
		}
	});
}

/*事件报道统计——媒体*/
function reportCountMedia(){

	$('#reportCountMedia').css({
		'width':$('#reportCountDate').width(),
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
			name : '%'
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            //rotate: 30
	        },
			data : ['腾讯网','网易', '齐鲁网','21CN新闻网','新华网','人民网','中国新闻网','新浪' ]
		},
		series : [ {
			name : '媒体提及率',
			type : 'bar',
			data : [1, 1,2,15,19,50,59,81 ],
			barWidth : '20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
		}, ]
	};
	mediaChart.setOption(mediaOption);
}

/*事件报道统计——地域*/
function randomData() {
    return Math.round(Math.random()*500);
}
function reportCountRegion(){
	$('#reportCountRegion').css({
		'width':$('#reportCountDate').width(),
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
                {name: '北京',value: '0' },
                {name: '天津',value: '0' },
                {name: '上海',value: '0' },
                {name: '重庆',value: '0' },
                {name: '河北',value: '0' },
                {name: '河南',value: '0' },
                {name: '云南',value: '0' },
                {name: '辽宁',value: '0' },
                {name: '黑龙江',value: '0' },
                {name: '湖南',value: '0' },
                {name: '安徽',value: '0' },
                {name: '山东',value: '0' },
                {name: '新疆',value: '0' },
                {name: '江苏',value: '0' },
                {name: '浙江',value: '0' },
                {name: '江西',value: '0' },
                {name: '湖北',value: '0' },
                {name: '广西',value: '0' },
                {name: '甘肃',value: '0' },
                {name: '山西',value: '0' },
                {name: '内蒙古',value: '0' },
                {name: '陕西',value: '0' },
                {name: '吉林',value: '0' },
                {name: '福建',value: '0' },
                {name: '贵州',value: '0' },
                {name: '广东',value: '0' },
                {name: '青海',value: '0' },
                {name: '西藏',value: '0' },
                {name: '四川',value: '0' },
                {name: '宁夏',value: '0' },
                {name: '海南',value: '0' },
                {name: '台湾',value: '0' },
                {name: '香港',value: '0' },
                {name: '澳门',value: '0' }
            ],
		} ]
	};
	regionChart.setOption(regionOption);
}

/*事件报道统计——情感*/
function reportCountEmotion(){
	$('#reportCountEmotion').css({
		'width':$('#reportCountDate').width(),
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
				value : 20,
				name : '正面指数'
			}, {
				value : 50,
				name : '中性指数'
			}, {
				value : 30,
				name : '负面指数'
			}, ]
		} ]
	};
	emotionChart.setOption(emotionOption);
}


function changeBtnCon(){
	$('.btn-group').each(function(index, el) {
		$(this).find('ul.dropdown-menu>li').click(function(event) {
			$(this).parents('ul.dropdown-menu').siblings('button').html($(this).html()+' <span class="caret"></span>');
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

