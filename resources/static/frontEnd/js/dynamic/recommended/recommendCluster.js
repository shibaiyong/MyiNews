var tableCluster;
$(function(){
	$("#begin_time").jeDate({
		skinCell:"jedatered",
		format: 'YYYY-MM-DD ',
		isinitVal:true,
		minDate:$.nowDate(-30),
		maxDate:$.nowDate(0),
		choosefun:function(val) {
			tableCluster.ajax.reload();
		}
	});
	tableCluster = $().clusterAjaxData({
		'requestUrl':ctx+'/recommend/front/cluster/page',
		'getPassValue':getParamsTable
	});
	
	//从推荐系统获取推荐新闻
	getRecommendNews(2);
	
	$('.searchesTable').on('draw.dt',function() {
//		加载24小时趋势图
		var textArr = tableCluster.column(2).nodes().data();
		for(var count = 0;textArr.length > count;count++){
			$().getTendencyData({
				'modalName':'trend-polyline-charts'+count,
				'dataUrl':ctx+'/cluster/front/loadTrendMap',
				'dataParam':{
					'clusterCode':textArr[count].clusterCode,
					'createDatetime':textArr[count].createDatetime
//					'carrier':$('.srceenMediaAlone h2').attr('data-innerid'),
//					'region':$('.srceenMap h2').attr('data-innerid'),
//					'classification':$('.srceenClassification h2').attr('data-innerid'),
				}
			})
		}
		
//		浏览量
		var textArrCon =[];
		if(textArr.length > 0){
			var textArrCon =[];
			for(var count = 0;textArr.length>count;count++){
				textArrCon.push(textArr[count].clusterCode);
			}
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':textArrCon.join(',')},
				'callback':function(data){
					$('.searchesTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
		}
		
//		表格中的排序的前三个样式
//		$('.searchesTable tbody').find('tr').each(function(index){
//			if(index == 0){
//				$(this).find('em.tableCompositor').css({
//					'background':'#F44336'
//				})
//			}
//			if(index == 1){
//				$(this).find('em.tableCompositor').css({
//					'background':'#F44336'
//				})
//			}
//			if(index == 2){
//				$(this).find('em.tableCompositor').css({
//					'background':'#F44336'
//				})
//			}
//		})
	})
	
})


/**
 * 列表传参
 * @returns {Array}
 */
function getParamsTable(aoData){
	
	
//	时间
	var startTime;
	var endTime;
	var todayTime = new Date();
	var inputTime = new Date($('#begin_time').val().replace(/-/g,'/'));
	if(todayTime.formatDate('yyyy-MM-dd') == inputTime.formatDate('yyyy-MM-dd')){
		startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
		endTime = new Date();
	}else{
		startTime = inputTime;
		endTime = new Date(inputTime.getTime() + (1000 * 60 * 60 * 24));
	}
	
	console.log(startTime);
	console.log(endTime);
	
	aoData.push(
			{'name':'startTime','value':startTime},
			{'name':'endTime','value':endTime},
			{"name":"recommendType","value":2}
	)
	
	return aoData;
}

/**
 * 从推荐系统获取推荐新闻
 */
function getRecommendNews(recommendType){
	$.ajax({
        url : ctx+'/recommend/front/get?recommendType='+recommendType,//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        success : function(data) {
        	if(data.result == true){
        		tableCluster.ajax.reload();
        	}
        }
	})
}

