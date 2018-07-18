$(function(){

	/*加载头部与尾部*/
	$('#header').loadPage('../common/header.html');
	$('#footer').loadPage('../common/footer.html');

	$('.relativeReportTable').DataTable({
   		iDisplayLength : 20,
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	});
	/*报道量统计*/
	countReport();
	/*媒体提及率*/
	reportCountMedia();

	summarydotdotdot();

});

/*报道量统计*/
function countReport(){
	var dateChart = echarts.init(document.getElementById('countReport'));
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

				/*myTool1: {
	                show: true,
	                title: '返回',
	                icon: 'image://D:/GitLab/ns/src/main/resources/static/frontEnd/image/hotEventDetail/back.png',
	                onclick: function (){
	                    dateChart.setOption({
					    	xAxis: {
						        data : ['01日', '02日', '03日', '04日', '05日'],
						        axisLabel: {
						            interval: 'auto',
						            margin:10
						        },
						    },
				            series: [{
				            	barWidth : '30%',
				                // 通过饼图表现单个柱子中的数据分布
				                data : [10, 52, 200, 334, 390],
				            }]
				        });
	                }
	            },*/


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
			data : ['01日', '02日', '03日', '04日', '05日'],
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
/*媒体提及率*/
function reportCountMedia(){
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
			name : '%'
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
	        },
			data : [ '百度', '财新网', '新华网',
					'网易', '凤凰财经','新浪微博', '财经网',
					 '齐鲁网' ]
		},
		series : [ {
			name : '媒体提及率',
			type : 'bar',
			data : [ 1, 7, 18, 16, 55,61, 93,  127 ],
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


/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.itemDigest p').height()>150){
        $('.itemDigest p').css({
            'height':150,
        });
        var $summaryCon = $('.itemDigest p');
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
                    } else {
                        createDots();
                    }
                    return false;
                }
            );
    }

    
}
