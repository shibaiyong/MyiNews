$(function(){
//	$('.searchesTable').DataTable({
//   		iDisplayLength : 20,
//   		'sPaginationType': "bootstrap",
//	  	"aoColumns": [ 
//	  		{ "bSortable": false },
//	       	{ "bSortable": false },
//	     	{ "bSortable": false },
//	       	{ "bSortable": true },
//	       	{ "bSortable": true },
//	       	{ "bSortable": true },
//	       	{ "bSortable": true },
//	       	{ "bSortable": true },
//	       	{ "bSortable": false },
//	      
//	    ],
//	     	"aaSorting": [[4, ""]],
//	});
	
});

(function($){
	"use strict";
	/**
	 * Description：热点发现中的表格
	 */
	$.fn.clusterAjaxData = function(options){
		var defaults = {
				requestUrl:'',  //请求路径
				getPassValue:'', //需要入的值
				callBack:''
		};
		var options = $.extend(defaults,options);
		
		var scrollCon = '';
		if($('body').width()<768){
			scrollCon = true;
		}
        var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
        var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
		var tableCluster = $('.searchesTable').DataTable({
            dom:domString,
            oLanguage: {
                "sZeroRecords" : "没有可以显示的数据",
                "sProcessing" : "正在获取数据，请稍后...",

                "sInfo" : totalCount
            },
			   scrollX: scrollCon,
		       serverSide: true,//标示从服务器获取数据
		       sAjaxSource :options.requestUrl,//服务器请求
		       fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
			    fnServerParams : function ( aoData ) {
//		       	给服务器传的值
		       		aoData = options.getPassValue(aoData);
		       },
		       
//		       服务器传过来的值
		       "rowCallback" : function(row, data, index) {
//		    	   排名
		    	   if(data.rankNum != 1 && data.rankNum != 2 && data.rankNum != 3){
		    		   var orderCon = '<em class="tableCompositor">'+data.rankNum+'</em>';
		    	   }else{
		    		   var orderCon = '<em class="tableCompositor redBack">'+data.rankNum+'</em>';
		    	   }
		    	   
		    	   $('td:eq(0)', row).html(orderCon);
		    	   
						 var isearchVal = $('.customAddInput').val();
						 var startTime = new Date( data.createDatetime).getTime();
		    	   //title
		    	   if(isearchVal != ''){
		    		   var titleCon = '<a href="' + ctx + '/cluster/front/detail/' + data.clusterCode + '?queryStr='+isearchVal+'&startTime='+startTime+'"  target="_blank"  class="beyondEllipsis"  data-id="' + data.clusterCode + '">' + data.title + '</a>'
		    	   }else{
		    		   var titleCon = '<a href="' + ctx + '/cluster/front/detail/' + data.clusterCode + '?startTime='+startTime+'" target="_blank"  class="beyondEllipsis"  data-id="' + data.clusterCode + '">' + data.title + '</a>'
		    	   }
		    	  
		    	   $('td:eq(2)', row).html(titleCon).addClass('titleRightClick');
		    	   
		    	   //currentTrend
		    	   
		    	   $('td:eq(4)', row).html('-').addClass('trend'+index);
		    	   
		    	   var negative = '';
		    	   var colorStyle = '';
		    	   if(data.sentiment != null && data.sentiment != ''){
		    		   negative = data.sentiment.negative * 100;
		    		   // if(data.sentiment.negative > 60){
		    			//    colorStyle = 'red';
		    		   // }else
		    		   	if(negative > 50){
		    			   colorStyle = 'green';
		    		   }else{
		    			   colorStyle = 'gray';
		    		   }

		    	   }else{
		    		   negative = '-';
						 }
						 
						//2018-3-23 QG指数显示修改
						// if(negative>40){
						// 		$('td:eq(6)', row).html(negative.toFixed(2)).addClass(colorStyle);
						// }else{
						// 		$('td:eq(6)', row).html(negative.toFixed(2)).addClass(colorStyle);
						// }
		    	  $('td:eq(6)', row).html(negative.toFixed(2)).addClass(colorStyle);
		    	   
//		    	   浏览量
// 		    	   var pageView = '<span class="browseNum'+index+'"></span>';
// 		    	   $('td:eq(7)', row).html(pageView);
		    		  
		    	   
//		    	   24小时趋势图
// 		    	   var tendencyChart = '<div id="trend-polyline-charts'+index+'" style="width:100%;height:50px"></div>';
// 		    	   $('td:eq(8)', row).html(tendencyChart);
		    	   
//		    	   我的定制中将下次更新时间返回
		    	   
		       },
		       
//		       服务器传过来的值
		       columns: [//显示的列
		           {data: 'clusterCode', "bSortable": false,'width':'46px'},
		           {data: 'createDatetime', "bSortable": false,
		        	   render:function(data, type, row){
		             		if(null != data && "" != data){
		             			var releaseDatetime = new Date(data);
		             			
		             			//获取当前年
		             			var nowDate = new Date();
		             			var nowyear=nowDate.getFullYear();
		             			var year = releaseDatetime.formatDate('yyyy');
		             			var time = '';
//		             			判断发布时间是否为当前年份
		             			if(year == nowyear){
		             				time = releaseDatetime.formatDate('MM-dd hh:mm');
		             			}else{
		             				time = releaseDatetime.formatDate('yyyy-MM-dd');
		             			}
		             			
		 						return time;
		             		}else{
		             			return '-';
		             		}
		               },
		               'width':'88px'
		           },
		           { data: 'title', "bSortable": false},
		           { data: 'weight', "bSortable": false,'width':'64px'},
		           { data: 'currentTrend', "bSortable": false,'width':'64px'},
		           { data: 'allNewsNum', "bSortable": false,'width':'64px'},
		           { data: 'sentiment', "bSortable": false,
		        	   render:function(data,type,row){
		        		   if(data != null && data != ''){
		        			   var negative = parseInt(data.negativeCount/(data.negativeCount+data.positiveCount+data.neutralCount) * 100);
		        			   return negative;
		        		   }else{
		        			   return '-';
		        		   }
		        	   },
		        	   'width':'64px'
		           },
		           { data: 'browseNum',"bSortable": false,
				   render:function(data,type,row){
		           		return '';
				   },
		        	   'width':'38px'
		           }
		           // { data: 'clusterCode',"bSortable": false,'width':'150px'}
		       ],
		       
		       "aaSorting": [[1, ""]],
		   });
		
		$('.searchesTable').on('draw.dt',function() {
			if($('body').width()<768){
	        	$('.searchesTable').css({
	        		'width':'1000px'
	        	});
        	}
//			点击翻页页面自动移动到上方
			$('.paginate_button').each(function(){
				$(this).click(function(){
					$(this).scrollOffset({
						'scrollPos':115
					});
				})
			})
		})
		
		return tableCluster;
	};
	
	/**
	 * 24小时趋势图
	 */
	
//	从后台获得趋势图的数据
// 	$.fn.getTendencyData = function(options){
// 		var defaults = {
// 				count:0,
// 				modalName:'',
// 				dataUrl:'',
// 				dataParam:{}
// 		};
// 		var options = $.extend(defaults,options);
//
// 		$.ajax({
//             url : options.dataUrl,//这个就是请求地址对应sAjaxSource
//             data:options.dataParam,
//             type : 'get',
//             dataType : 'json',
//             async : true,
//             success : function(data) {
//             	console.log(data);
//             	if(data.result == true){
//
//             		var obj = data.resultObj.trendMap;
//
//             		var tendencyDataItem = {
//                 			time:[],
//                 			data:[]
//                 	}
//
//             		for( var key in obj ){
//             			tendencyDataItem.time.push(key);
//             			tendencyDataItem.data.push(obj[key]);
//             		}
//             		$().showTrendChart({
//             			idName:options.modalName,
//             			chartTime:tendencyDataItem.time,
//             			chartData:tendencyDataItem.data
//             		})
//
//             		var treadName = 'trend' + options.count;
//
//             		var currentTrend = '';
//  		    	    if(data.resultObj.trendValue == 0){
//  		    		   currentTrend = '-';
//  		    	    }else if(data.resultObj.trendValue > 0){
//  		    		   currentTrend = data.resultObj.trendValue+'%&nbsp;<i class="colorUp fa fa-long-arrow-up"></i>';
//  		    	    }else{
//  		    		   currentTrend = data.resultObj.trendValue+'%&nbsp;<i class="colorDown fa fa-long-arrow-down"></i>';
//  		    	    }
//             		$('.'+treadName).html(currentTrend);
//             	}
//             }
// 		})
// 	};
	
//	展示24小时趋势图
	$.fn.showTrendChart = function(options){
		var defaults = {
				idName:'',
				chartTime:[],
				chartData:[]
		};
		var options = $.extend(defaults,options);
		var trendChart = echarts.init(document.getElementById(options.idName));
		
		 var option = {
			color:['#F44336'],
		    grid:{
		    	left:'5%',
		    	right:'5%',
		    	bottom:'0',
		    	top:'10%'
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        axisLine:{
		        	show:false,
		        },
		        axisLabel:{
		        	show:false,
		        },
		        splitLine:{
		        	show:false,
		        },
		        axisTick:{
		        	show:false,
		        },
		        data: options.chartTime
		    },
		    yAxis: {
		        type: 'value',
		        axisLine:{
		        	show:false,
		        },
		        axisLabel:{
		        	show:false,
		        },
		        splitLine:{
		        	show:false,
		        },
		        axisTick:{
		        	show:false,
		        }
		    },
		    series: [
		        {
		            name:'最高气温',
		            type:'line',
		            data:options.chartData,
		            label:{
		            	normal:{
		            		show:false
		            	}
		            }
		        },
		    ]
	    };
		 
		 trendChart.setOption(option);
	};
	
	/**
	 * 浏览量二次查询
	 */
	// $.fn.adraticAjaxData = function(options){
	// 	var defaults = {
	// 			modalName:'', //所在元素的className
	// 			dataUrl:'',  //请求路径
	// 			dataParam:{},  //传递参数
	// 			rowIndex:'', //定义是table第几行
	// 			columnIndex:'',//定义是table第几列
	// 			callback:''
	// 	};
	// 	var options = $.extend(defaults,options);
	//
	// 	$.ajax({
     //        url : options.dataUrl,//这个就是请求地址对应sAjaxSource
     //        data:options.dataParam,
     //        type : 'get',
     //        dataType : 'json',
     //        async : true,
     //        success : function(data,index) {
     //        	if(data.result == true){
     //
     //        		if(options.callback != ''){
     //        			options.callback(data.resultObj);
     //        		}else{
     //        			if(options.modalName != '' && options.modalName != 'null'){
     //            			$(options.modalName).html(data.resultObj);
     //            		}
     //        		}
     //        	}
     //        }
	// 	})
	// };
	
})(jQuery);








