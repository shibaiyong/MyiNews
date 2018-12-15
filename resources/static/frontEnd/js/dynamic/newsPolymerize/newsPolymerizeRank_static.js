var tableCluster,
	highlightList = [],
	customAddVal;
$(function(){
	footerPutBottom();
	
	/*头部导航高亮*/
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.cluster'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	$('.srceenMap').removeClass('hide');
	$('.srceenClassification').removeClass('hide');
	$('.srceenMediaAlone').removeClass('hide');
	$('.srceenTime').removeClass('hide');
	$('.screenSearch').removeClass('hide');
	
	var screenIndex = 0;
	$('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 125 * screenIndex;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex;
		}
	})
	//	地区
	$().getSignleData({
		getAjaxUserConfigUrl: ctx + '/tenant/back/listTenantRegion', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listRegion', //请求路径
		boxClassName: '.srceenMap',
		ulClassName: '#srceenMapPro',
		level: 1,
		multiSelect: true,
		conditionValue: 'map',
	});
//	分类
	$().getSignleData({
		getAjaxUserConfigUrl: '', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listNewsClassification', //请求路径
		boxClassName:'.srceenClassification',
		ulClassName:'#srceenClassificationPro',
		level:1,
		multiSelect: true,
		conditionValue: 'classification',
	})
//	热点发现中-微博微信
	$().getSignleData({
		getAjaxUrl:ctx+'/config/front/listUserConfigCarrier',  //请求路径
		boxClassName:'.srceenMediaAlone',
		ulClassName:'#srceenMediaAlonePro',
		level:1,
		inter:true,
		conditionValue: 'mediaAlone',
	})
	// 将样式调整放在回调函数中，防止用户在组件渲染未完成时进行操作
	function showScreenMap() {
		$('.srceenMap').find('h2').attr('data-innerid', '');
		$('.srceenMap').find('h2').html('全部地区<i class="fa fa-caret-down"></i>');
	}
	
	$("#screen_begin_time").jeDate({
		skinCell:"jedatered",
		format: 'YYYY-MM-DD ',
		isinitVal:true,
		maxDate:$.nowDate(),
		choosefun:function(val) {
			tableCluster.ajax.reload();
		}
	});
	
//	获得ajax返回的获取
	$('.searchesTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList
    });
	
	$('.searchesTable').on('draw.dt',function() {
//		加载24小时趋势图
		var textArr = tableCluster.column(2).nodes().data();
//
// 		var time = new Date(new Date($('#screen_begin_time').val().replace(/-/g,'/')).getTime()+(1000 * 60 * 60 * 24));
//
// 		for(var count = 0;textArr.length > count;count++){
// 			$().getTendencyData({
// 				'count':count,
// 				'modalName':'trend-polyline-charts'+count,
// 				'dataUrl':ctx+'/cluster/front/loadTrendMap',
// 				'dataParam':{
// 					'clusterCode':textArr[count].clusterCode,
// 					'time':time,
// 				}
// 			})
// 		}
		
//		浏览量
		var textArrCon =[];
// 		if(textArr.length > 0){
// 			var textArrCon =[];
// 			for(var count = 0;textArr.length>count;count++){
// 				textArrCon.push(textArr[count].clusterCode);
// 			}
// 			$().adraticAjaxData({
// 				'dataUrl':ctx+'/latest/front/getBrowseNum',
// 				'dataParam':{'webpageCode':textArrCon.join(',')},
// 				'callback':function(data){
// 					$('.searchesTable tbody').find('[class*="browseNum"]').each(function(index){
// 						$(this).text(data[index]);
// 					})
// 				}
// 			});
// 		}
		
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
		
//		搜索词高亮显示
		var highTitleArr = [];
		if(highlightList != null){
			for(var log = 0;textArr.length>log;log++){
				highTitleArr.push({
					'webpageCode':textArr[log].clusterCode,
					'title':textArr[log].title
				})
			}
			
			for(var i = 0;highlightList.length>i;i++){
				for(var j = 0;highTitleArr.length>j;j++){
					highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i],'<span class="red">'+highlightList[i]+'</span>');
					$('.searchesTable').find('td.titleRightClick').find('a[data-id='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
	})
	
	//	地区(多选)、分类(多选)
	window.signleReloadData = function () {
		tableCluster.ajax.reload();
		return false;
	};

//	点击标签刷新列表
	$('#srceenTagPro').click(function(){
		tableCluster.ajax.reload();
		return false;
	})
	//	iSearch点击查询
	$('.customAddBtn').customSignleInputClickBtn({
		'refreshTable':function(){
			tableCluster.ajax.reload();
		}
	});
//	iSearch加载本地数据
	customAddVal = JSON.parse(localStorage.getItem('isearch'));
	$(".customAddInput").parseLocalArrayData({
			'dataSources':customAddVal,
			'afterSelect':function(){
				tableCluster.ajax.reload();
			}
	});
	// 延时1000执行，待用户定制的参数渲染之后再执行此方法
	setTimeout(function() {
		tableCluster = $().clusterAjaxData({
			'requestUrl': ctx + '/cluster/front/pageclusternews',
			'getPassValue': getParamsTable
		});
	}, 1000);
})

/**
 * 列表传参
 * @returns {Array}
 */
function getParamsTable(aoData){
	
//	地区
	var regions = [];
	if($('#srceenMapPro').hasClass('hide')){
		var regionsId = '';
	}else{
		var regionsId = $('.srceenMap h2').attr('data-innerId');
	}
	// var $areaSelected = $('.areaSelected');
	// if ($areaSelected != '' && $areaSelected.length > 0) {
	// 	regionsId = $areaSelected.attr('data-innerid');
	// }
	regions.push(regionsId);
//	分类
	var classifications = [];
	if($('#srceenClassificationPro').hasClass('hide')){
		var classificationsId = '';
	}else{
		var classificationsId = $('.srceenClassification h2').attr('data-innerId');
	}
	classifications.push(classificationsId);
//	标签
	var labels = [];
	var labelsId = $('.srceenTag h2').attr('data-innerId');
	labels.push(labelsId);
	
	var carrier = [];
	if($('#srceenMediaAlonePro').hasClass('hide')){
		var carrierId = ''
	}else{
		var carrierId = $('.srceenMediaAlone h2').attr('data-innerId');
	}
	carrier.push(carrierId);
	
//	查询
	var queryStr = [];
	var queryStrVal = $.trim($('.customAddInput').val());
	queryStr.push(queryStrVal);
	
//	时间
	var startTime = '';
	var endTime = '';
	var todayTime = new Date();
	var inputTime = '';
	if (($('#screen_begin_time').val()||'') != '') {
		inputTime = new Date($('#screen_begin_time').val().replace(/-/g, '/'));
		if (todayTime.formatDate('yyyy/MM/dd') == inputTime.formatDate('yyyy/MM/dd')) {
			startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
			endTime = new Date();
		} else {
			startTime = inputTime;
			endTime = new Date(inputTime.getTime() + (1000 * 60 * 60 * 24));
		}
	}		
	
	//console.log(startTime);
	//console.log(endTime);
	
	aoData.push(
			{'name':'regions','value':regions},
			{'name':'classifications','value':classifications},
			{'name':'labels','value':labels},
			{'name':'queryStr','value':queryStr},
			{'name':'carrier','value':carrier},
			{'name':'createDatetime','value':startTime},
			{'name':'updateDatetime','value':endTime}
	)
	
	return aoData;
}

