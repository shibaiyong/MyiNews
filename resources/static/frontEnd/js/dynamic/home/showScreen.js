/**
* @file 大屏展示网页是首页的两侧会展示6张图，主要的6张图的展示代码
* @author 杨小璐
* 
*/

var FIRST = 0;
var FIRSTMEDIA = 0;
$(function(){
	if($('body').width() < 1900){
		return;		
	}else{
		$('body').css({
			'minWidth':'1900px'
		})
		$('.showScreen').removeClass('hide');
		
		var width = Math.ceil(($('body').width() - $('#main-content').width())/2)-296;
		$('.screenLeft').css({
			'left':width
		})
		$('.screenRight').css({
			'right':width
		})
		
//		载体介质
		screenPie('chartPie','/originalstat');
		
//		来源
		screenPie('chartPieSource','/sourcestat');
//		分类
		screenPie('chartPieClass','/classificationstat');
//		小时分布图
		showScreenLine();
//		热力分布
		showScreenMap();
//		热门事件
		hotEvent();
		
	//  今日已采集数据统计
	    getCount();
	    setInterval(getCount,30000);
	    
//	    今日已采集媒体统计
	    getMediaCount();
	    setInterval(getMediaCount,30000);
	}
})

	
//左侧饼图
function screenPie(id,ajaxUrl){
	var rich = {
	    black: {
	        align: 'center',
	        fontSize: 12,
	        padding: [3, 0],
	    },
	    blue: {
	        align: 'center',
	        fontSize: 12,
	        padding: [3,0,0,0],
	    },
	    hr: {
	        borderColor: '#999',
	        width: '100%',
	        borderWidth: 1,
	        height: 0,
	        lineHeight:10
	    }
	}
	
	var pieChart = echarts.init(document.getElementById(id));
	pieChart.showLoading();
	
	var option = {
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius: ['30%','50%'],
	            center: ['50%', '50%'],
	            hoverAnimation:false,
	            selectedOffset:5,
	            avoidLabelOverlap:false,//关闭避免标签重叠
	            label:{
	            	formatter: function(params, ticket, callback) {
	                    return '{black|' + params.name + '}\n{blue|' + params.value + '篇}\n{blue|'+params.percent+'%}';
	                },
	                rich: rich
	            },
	            data:[],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	$.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + ajaxUrl,
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	console.log(data);
            if (data.result) {
            	var obj = data.resultObj;
            	if(obj.length == 0){
            		return false;
            	}
            	for(var i = 0;i<obj.length;i++){
            		if(i == 0){
            			obj[i].label = {
            				normal:{
                    			show:true
                    		}
                		}
                		obj[i].labelLine = {
            				normal:{
                    			show:true,
//                    			length:3,
                    		}		
                		}
                		obj[i].itemStyle = {
            				normal:{
                    			opacity: 1
                    		}
                		}
            		}else{
            			obj[i].label = {
            				normal:{
                    			show:false
                    		}
                		}
                		obj[i].labelLine = {
            				normal:{
                    			show:false,
//                    			length:4
                    		}		
                		}
                		obj[i].itemStyle = {
            				normal:{
                    			opacity: 0.5
                    		}
                		}
            		}
            		
            		option.series[0].data.push(obj[i]);
            	}
            	pieChart.hideLoading();
            	pieChart.setOption(option);
            	var count = 0;
            	setInterval(function() {
            	    var r = count % option.series[0].data.length;
            	    option.series[0].data[r].selected = false;
            	    option.series[0].data[r].label.normal.show = false;
            	    option.series[0].data[r].labelLine.normal.show = false;
            	    option.series[0].data[r].itemStyle.normal.opacity = 0.6;
            	    count++;
            	    var s = count % option.series[0].data.length;
            	    option.series[0].data[s].selected = true;
            	    option.series[0].data[s].label.normal.show = true;
            	    option.series[0].data[s].labelLine.normal.show = true;
            	    option.series[0].data[s].itemStyle.normal.opacity = 1;
            	    pieChart.setOption(option, true);
            	}, 5000);
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            pieChart.hideLoading();
        }
    })
}


//小时采集
function showScreenLine() {
	var lineChart = echarts.init(document.getElementById('chartLineColl'));
	lineChart.showLoading();
	var option = {
			tooltip: {
		        trigger: 'axis',
		        formatter: "{b}时 <br/>{a}: {c}",
		        backgroundColor:'rgba(255,255,255,0.5)',
				textStyle:{
					color:'#333'
				},
				extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4)'
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
	         smooth: true,
		     symbol:'circle',
		     lineStyle: {
	            normal: {
	                width: 1
	            }
	         },
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
	        data: []
	    }, {
	    	name: '新闻条数',
	    	type: "effectScatter",
			symbolSize: 9,
			coordinateSystem: "cartesian2d",
			rippleEffect: {
				scale: 6,
				brushType: "stroke"
			},
			itemStyle: {
				normal: {
					color: "rgba(255, 47, 116, 1)"
				}
			},
			data: [{
				value: []
			}]
	    }]
	};
	
	$.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + '/newstimestat',
        dataType: "json",
        // 返回数据形式为json
        success: function(obj) {
        	if (obj.result) {
                option.xAxis.data = obj.resultObj[0];
                option.series[0].data = obj.resultObj[1];
                
                var xLin = obj.resultObj[0].length - 1;
                var yLin = obj.resultObj[1].length - 1;
                option.series[1].data[0].value.push(xLin);
                option.series[1].data[0].value.push(obj.resultObj[1][yLin]);
                lineChart.setOption(option);
                lineChart.hideLoading();
            } else {
                console.log(result.errorMsg);
            }
        }
	})
	
	lineChart.hideLoading();
	lineChart.setOption(option);
}

//热点分布
function showScreenMap() {
	var myChart = echarts.init(document.getElementById('chartMap'));

    var option = {
		tooltip: {
	        trigger : 'item',
	        formatter: "{b}{a}<br/>{c}篇",
			showDelay : 0,
			hideDelay : 0,
			enterable:true,
			extraCssText:'z-index:100',
			backgroundColor:'rgba(255,255,255,0.6)',
			textStyle:{
				color:'#333'
			},
			extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);text-align:center'
	    },
	    visualMap: {
	        min: 0,
	        max: 2500,
	        left: 'left',
	        top: 'bottom',
//	        text: ['',''],           // 文本，默认为数值文本
	        calculable: true,
	        itemHeight:30,
	        itemWidth:8,
	        orient:'horizontal',
	        show:false
	    },
	    series: [
	        {
	            name: '文章数',
	            type: 'map',
	            mapType: 'china',
	            roam: false,
	            label: {
	                normal: {
	                    show: false
	                },
	                emphasis: {
	                    show: true
	                }
	            },
	            itemStyle: {
                    emphasis: {// 也是选中样式
                        areaColor: '#F44336',
                        label: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                     }    
                   },
                data:[],
//	            data:[
//	                {name: '北京',value: 1993,
//	                	selected:true,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '天津',value: 1802,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '上海',value: 1489,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '重庆',value: 879,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}	
//	                },
//	                {name: '河北',value: 200,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '河南',value: 589,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '云南',value: 90,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '辽宁',value: 20,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '黑龙江',value: 100,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '湖南',value: 1189,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '安徽',value: 739,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '山东',value: 397,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//	                },
//	                {name: '新疆',value: 67,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	},
//	                	selected:false,
//	                	
//	                },
//	                {name: '江苏',value: 1589,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}	
//	                },
//	                {name: '浙江',value: 950,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}	
//	                },
//	                {name: '江西',value: 489,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}	
//	                },
//	                {name: '湖北',value: 910,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	} },
//	                {name: '广西',value: 109,
//		                	selected:false,
//		                	label:{
//		                		normal:{
//		                			show:false
//		                		}
//		                	} },
//	                {name: '甘肃',value: 345,
//			                	selected:false,
//			                	label:{
//			                		normal:{
//			                			show:false
//			                		}
//			                	} },
//	                {name: '山西',value: 580,
//				                	selected:false,
//				                	label:{
//				                		normal:{
//				                			show:false
//				                		}
//				                	} },
//	                {name: '内蒙古',value: 50,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '陕西',value: 89,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '吉林',value: 970,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '福建',value: 290,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '贵州',value: 420,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '广东',value: 240,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '青海',value: 217,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '西藏',value: 59,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '四川',value: 49,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '宁夏',value: 9,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '海南',value: 2,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '台湾',value: 190,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '香港',value: 310,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    },
//	                {name: '澳门',value: 270,
//	                	selected:false,
//	                	label:{
//	                		normal:{
//	                			show:false
//	                		}
//	                	}
//				    }
//	            ]
	        }
	    ]
	};
    
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + '/region',
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	console.log(data);
        	if(data.result){
        		if(data.resultObj.length == 0){
        			return;
        		}else{
        			$('.hotFound').removeClass('hide');
        			
        			var obj = data.resultObj;
            		var echartsParam = [];
            		for(var i = 0;i<obj.length;i++){
            			echartsParamItem = {
            				name: '',
            				value: 0,
    	                	selected:false,
    	                	label:{
    	                		normal:{
    	                			show:false
    	                		}
    	                	}
    				    };
            			
            			echartsParamItem.name = obj[i].name;
            			echartsParamItem.value = obj[i].value;
            			echartsParam.push(echartsParamItem);
            		}
            		option.series[0].data = echartsParam;
            		option.series[0].data[0].selected = true;
            		
            		myChart.setOption(option);
            		
            		var counts = option.series[0].data.length;
            	    var dataIndex = 0;
            		function autoHoverTip(){
            		    myChart.dispatchAction({
            				type: 'showTip',
            				seriesIndex: 0,
            				name: option.series[0].data[dataIndex].name,
            			});
            		    
            		    if(dataIndex == 0){
            		    	
            		    }else{
            		    	option.series[0].data[dataIndex-1].selected = false;
            		    }
            		   
            		    option.series[0].data[dataIndex].selected = true;
            		    
            		    myChart.setOption(option,true);
            		    
            			dataIndex = (dataIndex + 1) % counts;
            		}
            		
            	    setTimeout(function() {
            			autoHoverTip();
            	        tv = setInterval(autoHoverTip, 5000);
            	    }, 500);
            	}
        	}
        }
    })

    
}

//热门事件
function hotEvent(){
	
	var dataParam = {'iDisplayStart':0,'iDisplayLength':10,'carrier':7};
	
	$.ajax({
        type: "get",
        async: true,
        data:dataParam,
        // 同步执行
        url: ctx+'/cluster/front/pageclusternews',
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	if(data.result){
        		var obj = data.resultObj.aaData;
        		console.log(obj.aaData);
        		var content = '';
        		if(obj.length == 0){
        			return;
        		}else{
        			$('.eventMain').parents('.col-md-12').removeClass('hide');
        			var len = obj.length>6 ? 6 : obj.length;
        			for(var i = 0;i<len;i++){
            			content += '<li><p>'+obj[i].title+'</p></li>';
            		}
            		$('.waterfall').append(content);
            		var aa = $('.waterfall');
            		aa.masonry({
            			columnWidth: 5
            		});
        		}
        		
        	}
        }
    })
}

/**
 * desc:今日已采集总数数据获取
 * author：xlyang
 */
function getCount() {
	
	$.ajax({
		url: ctx + '/totlalNum',
        type: "get",
        async: true,
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
        		var oldNum = parseInt(number_format($('.count:first').text()));
        		var newsNum = obj.todayNum;
        		if(FIRST == 0){
        			$('.count').text(format_number(newsNum));
        			++FIRST;
        		}else{
        			var number = newsNum - oldNum;
            		if(number == 0){
            			
            		}else{
            			$('.count').animateNumber({
              		      number: number,
              		      numberStep: function(now, tween) {
              		    	  var floored_number = Math.floor(now),
              		          target = $(tween.elem);
              		    	  target.text(format_number(floored_number + oldNum));
              		    	
              		      }
              		    },10000)
            		}
        		}
        	}
        }
	})
	
}


/**
 * desc:今日已采集媒体总数数据获取
 * author：xlyang
 */
function getMediaCount() {
	
	$.ajax({
		url: ctx + '/mediaStat',
        type: "get",
        async: true,
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
        		var oldNum = parseInt(number_format($('.countMedia:first').text()));
        		var newsNum = obj.mediaStat;
        		if(FIRSTMEDIA == 0){
        			$('.countMedia').text(format_number(newsNum));
        			++FIRSTMEDIA;
        		}else{
        			var number = newsNum - oldNum;
            		if(number == 0){
            			
            		}else{
            			$('.countMedia').animateNumber({
              		      number: number,
              		      numberStep: function(now, tween) {
              		    	  var floored_number = Math.floor(now),
              		          target = $(tween.elem);
              		    	  target.text(format_number(floored_number + oldNum));
              		      }
              		    },10000)
            		}
        		}
        	}
        }
	})
}

/**
 * desc:将数字每三位一节用","分开
 * author：xlyang
 * @param n：需要转换的数字
 * @returns
 */
function format_number(n){  
   var b=parseInt(n).toString();  
   var len=b.length;  
   if(len<=3){return b;}  
   var r=len%3;  
   return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");  
 }

/**
 * desc:将每三位用","隔开的数字转化为数字串
 * author:xlyang
 * @param n
 */
function number_format(n){
	var a = n.split(",");
	var b = '';
	for(var i = 0;i<a.length;i++){
		b+=a[i];
	}
	return parseInt(b);
}