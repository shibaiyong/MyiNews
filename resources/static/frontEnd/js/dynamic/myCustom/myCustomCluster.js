$(function(){
	
	$('.clusterSources').removeClass('hide');
	$('.clusterCarrier').removeClass('hide');
	$('.clusterMap').removeClass('hide');
    $('.clusterFenlei').removeClass('hide');
    $('.srceenTime').removeClass('hide');
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
	
	$("#screen_begin_time").jeDate({
		skinCell:"jedatered",
		format: 'YYYY-MM-DD ',
		isinitVal:true,
		minDate:$.nowDate(-30),
		maxDate:$.nowDate(0),
		choosefun:function(val) {
			tableCluster.ajax.reload();
		}
	});
	
	var timeCode = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			timeCode = $(this).find('.link').attr('data-customgroup');
		}
	})
	
//	来源
	$.ajax({
        url:ctx+'/custom/front/listusersource',//这个就是请求地址对应sAjaxSource
        data:{'timeCode':timeCode},
        type :'get',
        dataType:'json',
        async:true,
        success:function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		
//    			添加历史记录
    			var historyCon = JSON.parse(localStorage.getItem('conditions'));
    			var historyText = '';
    			var historyId = '';
    			for(var i=0;i<historyCon.length;i++){
					
    				if(historyCon[i]['name'] == 'clusterSources'){
    					historyText = historyCon[i]['value'];
    					historyId = historyCon[i]['id']
    				}
    			}
    			
    			if(historyText == ''){
    				content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
    			}else{
    				content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="'+historyId+'"><i class="fa fa-history historyIcon"></i><span class="historyFont">'+historyText+'</span></a></li>';//添加历史记录
    			}
        		
        		content += '<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>';
        		for(var i = 0;obj.length>i;i++){
        			content += '<li class=""><a class="ti" href="javascript:void(0)" data-innerid="'+obj[i].labelId+'">'+obj[i].name+'</a></li>';
        		}
        		$('#clusterSourcesPro').append(content);
        		$().screenConditionFun({
    				className:'.clusterSources',
    				idName:'#clusterSourcesPro',
    			});
        	}
        }
	})
	
//	载体
	$.ajax({
        url:ctx+'/custom/front/listusercarrier',//这个就是请求地址对应sAjaxSource
        data:{'timeCode':timeCode},
        type :'get',
        dataType:'json',
        async:true,
        success:function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		
//    			添加历史记录
    			var historyCon = JSON.parse(localStorage.getItem('conditions'));
    			var historyText = '';
    			var historyId = '';
    			for(var i=0;i<historyCon.length;i++){
					
    				if(historyCon[i]['name'] == 'clusterCarrier'){
    					historyText = historyCon[i]['value'];
    					historyId = historyCon[i]['id']
    				}
    			}
    			
    			if(historyText == ''){
    				content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
    			}else{
    				content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="'+historyId+'"><i class="fa fa-history historyIcon"></i><span class="historyFont">'+historyText+'</span></a></li>';//添加历史记录
    			}
    			
        		content += '<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>';
        		for(var i = 0;obj.length>i;i++){
        			content += '<li class=""><a class="ti" href="#" data-innerid="'+obj[i].labelId+'">'+obj[i].name+'</a></li>';
        		}
        		$('#clusterCarrierPro').append(content);
        		$().screenConditionFun({
    				className:'.clusterCarrier',
    				idName:'#clusterCarrierPro',
    			});
        		
        		var prosmoreHeight = $('.clusterCarrier').find('li').length * 30 +4;
            	$('.clusterCarrier').find('.prosmore').css({
            		'height':prosmoreHeight+'px'
            	})
        	}
        }
	})
	
//	地区
	$.ajax({
        url:ctx+'/custom/front/listuserregion',//这个就是请求地址对应sAjaxSource
        data:{'timeCode':timeCode,'level':1},
        type :'get',
        dataType:'json',
        async:true,
        success:function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		
//    			添加历史记录
    			var historyCon = JSON.parse(localStorage.getItem('conditions'));
    			var historyText = '';
    			var historyId = '';
    			for(var i=0;i<historyCon.length;i++){
					
    				if(historyCon[i]['name'] == 'clusterMap'){
    					historyText = historyCon[i]['value'];
    					historyId = historyCon[i]['id']
    				}
    			}
    			
    			if(historyText == ''){
    				content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
    			}else{
    				content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="'+historyId+'"><i class="fa fa-history historyIcon"></i><span class="historyFont">'+historyText+'</span></a></li>';//添加历史记录
    			}
        		
        		content += '<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>';
        		$('#clusterMapPro').append(content);
        		for(var count = 0;obj.length>count;count++){
            		
            		if(obj[count].parentId == '0' ){
            			var regionSecondItem = [];
            			var regionFirstName = obj[count].innerid;
            			for(var plug = 0;plug<obj.length;plug++){
            				if(regionFirstName == obj[plug].parentId){
            					regionSecondItem.push(obj[plug]);
            				}
            			}
            			var textCon;
            			if(regionSecondItem.length == 0){
            				textCon ='<li class=""><a class="ti" data-innerid="'+obj[count].innerid+'" href="javascript:void(0);">'+ obj[count].name;
            			}else{
            				var secondItem='<div class="prosmore hide">';
            				secondItem += '<div class="backshi hide"><a href="javascript:void(0)"></a></div>';
            				
            				if(obj[count].innerid == '320000'){
            					for(var num = 0;num<regionSecondItem.length;num++){
	            					secondItem +='<span class="xianCon"><em><a href="javascript:void(0);"   data-innerid="'+regionSecondItem[num].innerid+'">'+regionSecondItem[num].name+'</a></em></span>';
	            					
	            					var regionThreeItem = [];
	            					for(var plugThree = 0;plugThree<obj.length;plugThree++){
			            				if(regionSecondItem[num].innerid == obj[plugThree].parentId){
			            					regionThreeItem.push(obj[plugThree]);
			            				}
			            			}
	            					
	            					if(regionThreeItem.length == 0){
	            						
	            					}else{
	            						for(var i= 0;i<regionThreeItem.length;i++){
	            							secondItem += '<span class="xianItem hide"><em><a href="javascript:void(0);" data-parentid="'+regionThreeItem[i].parentId+'"   data-innerid="'+regionThreeItem[i].innerid+'">'+regionThreeItem[i].name+'</a></em></span>'
	            						}
	            					}
	            					
	            				}
            				}else{
            					for(var num = 0;num<regionSecondItem.length;num++){
	            					secondItem +='<span><em><a href="javascript:void(0);"   data-innerid="'+regionSecondItem[num].innerid+'">'+regionSecondItem[num].name+'</a></em></span>';
	            				}
            				}
            				secondItem += '</div>';
            				textCon ='<li class=""><a class="ti" href="javascript:void(0);" data-innerid="'+obj[count].innerid+'">' + obj[count].name+'<i class="fa fa-caret-right"></i></a>'+secondItem+'</li>';
            			}
            			
            			$('#clusterMapPro').append(textCon);
            		}
        		}
        		
        		var lilen = $('#clusterMapPro').find('li').length;
            	if(lilen>16){
            		
//            		判读能否整除，将不能整除的部门用li补全
//            		alert(lilen);
            		var yushu = (lilen - 2)%14;
            		if(yushu == 0){
            			
            		}else{
            			var yushuBox = '';
            			for(var i = 0;i<(14-yushu);i++){
            				yushuBox += '<li class="hide zhanwei"></li>';
            			}
            			$('#clusterMapPro').append(yushuBox);
            		}
            		
//            		将第一页的之外的li隐藏
            		$('#clusterMapPro').find('li').each(function(index){
            			if(index > 15){
            				$(this).addClass('hide');
            			}
            		})
            		
//            		将分页的样式填入
            		var num = Math.ceil((lilen-2)/14);
            		var fenye = '<div class="fenleiBox"><nav aria-label="Page navigation"><div class="pagination pagination-sm">';
            		fenye += '<a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a>';
            		for(var i = 0;i<num;i++){
            			if(i == 0){
            				fenye += '<a href="#" class="active">'+(i+1)+'</a>';
            			}else{
            				fenye += '<a href="#">'+(i+1)+'</a>';
            			}
            		}
            		fenye += '<a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></div></nav></div>';
            		
            		$('#clusterMapPro').append(fenye);
            		
//            		计算二级页的高度
            		var prosmoreHeight = 17 * 30 +4;
            		
            	}else{
            		var prosmoreHeight = $('#clusterMapPro').find('li').length * 30 +4;
            	}
        		
        		$().screenConditionFun({
    				className:'.clusterMap',
    				idName:'#clusterMapPro',
    			});
        		
        		
        		
//        		var prosmoreHeight = $('.clusterMap').find('li').length * 30 +4;
            	$('.clusterMap').find('.prosmore').css({
            		'height':prosmoreHeight+'px'
            	})
        	}
        }
	})
	
	//	分类
	$.ajax({
        url:ctx+'/custom/front/listuserclassifications',//这个就是请求地址对应sAjaxSource
        data:{'timeCode':timeCode},
        type :'get',
        dataType:'json',
        async:true,
        success:function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
//    			添加历史记录
    			var historyCon = JSON.parse(localStorage.getItem('conditions'));
    			var historyText = '';
    			var historyId = '';
    			for(var i=0;i<historyCon.length;i++){
					
    				if(historyCon[i]['name'] == 'clusterFenlei'){
    					historyText = historyCon[i]['value'];
    					historyId = historyCon[i]['id']
    				}
    			}
    			
    			if(historyText == ''){
    				content += '<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>';//添加历史记录
    			}else{
    				content += '<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="'+historyId+'"><i class="fa fa-history historyIcon"></i><span class="historyFont">'+historyText+'</span></a></li>';//添加历史记录
    			}
        		
        		content += '<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>';
        		
        		$('#clusterFenleiPro').append(content);
        		
        		for(var count = 0;obj.length>count;count++){
            		
            		if(obj[count].parentId == '0' ){
            			var regionSecondItem = [];
            			var regionFirstName = obj[count].labelId;
            			for(var plug = 0;plug<obj.length;plug++){
            				if(regionFirstName == obj[plug].parentId){
            					regionSecondItem.push(obj[plug]);
            				}
            			}
            			var textCon;
            			if(regionSecondItem.length == 0){
            				textCon ='<li class=""><a class="ti" data-innerid="'+obj[count].labelId+'" href="javascript:void(0);">'+ obj[count].name;
            			}else{
            				var secondItem='<div class="prosmore hide">';
            				for(var num = 0;num<regionSecondItem.length;num++){
            					secondItem +='<span><em><a href="javascript:void(0);" data-innerid="'+regionSecondItem[num].labelId+'">'+regionSecondItem[num].name+'</a></em></span>'
            				}
            				secondItem += '</div>';
            				textCon ='<li class=""><a class="ti" href="javascript:void(0);" data-innerid="'+obj[count].labelId+'">' + obj[count].name+'<i class="fa fa-caret-right"></i></a>'+secondItem+'</li>';
            			}
            			$('#clusterFenleiPro').append(textCon);
            		}
        		}
        		
//        		$('#clusterFenleiPro').append(content);
        		$().screenConditionFun({
    				className:'.clusterFenlei',
    				idName:'#clusterFenleiPro',
    			});
        	}
        }
	})
	
//	显示热点的标题
	var title = '';
	var dataCustomgroup = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			
			dataCustomgroup = $(this).find('.link').attr('data-customgroup');
			title = $(this).find('.link span').text();
			$('.recommend-title h4').text(title).attr('data-customgroup',dataCustomgroup);
		}
	})
	
	tableCluster = $().clusterAjaxData({
		// 'requestUrl':ctx+'/cluster/front/pageclusternews',
		'requestUrl':ctx+'/custom/front/getMyCustomHotFind',
		'getPassValue':getParamsTable
	});
	
//	获得ajax返回的获取
	$('.searchesTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		if(json.aaData.length != 0){
			if(json.aaData[0].updateDatetime != null && json.aaData[0].updateDatetime != ''){
				var time = new Date(json.aaData[0].updateDatetime);
				$('.nextUpdateTime span').text(time.formatDate('yyyy-MM-dd hh:mm'));
			}else{
				$('.nextUpdateTime').addClass('hide');
			}
		}
    });

	$('.searchesTable').on('draw.dt',function() {
//		加载24小时趋势图
		var textArr = tableCluster.column(2).nodes().data();
//		var time = new Date($('#screen_begin_time').val().replace(/-/g,'/'));
		
		var time = new Date(new Date($('#screen_begin_time').val().replace(/-/g,'/')).getTime()+(1000 * 60 * 60 * 24));
		for(var count = 0;textArr.length > count;count++){
			$().getTendencyData({
				'modalName':'trend-polyline-charts'+count,
				'dataUrl':ctx+'/cluster/front/loadTrendMap',
				'dataParam':{
					'clusterCode':textArr[count].clusterCode,
					'time':time
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
	
	//	点击地区刷新列表
	$('#clusterMapPro').click(function(){
		
		tableCluster.ajax.reload();
		return false;
	})
	
//	点击分类刷新列表
	$('#clusterFenleiPro').click(function(){
		
		tableCluster.ajax.reload();
		return false;
	})
	
//	点击来源刷新列表
	
	$('#clusterSourcesPro').click(function(){
		
		tableCluster.ajax.reload();
		return false;
	})
	
//	点击载体刷新列表
	
	$('#clusterCarrierPro').click(function(){
		
		tableCluster.ajax.reload();
		return false;
	})
	
	//	删除
	$('.deleteCustom').click(function(){
		$('#deleteAll').modal();
	})
	
	 $('.determine').click(function(){ //模态框点击确定
		$('#deleteAll').modal('hide');
		$.ajax({
	        url : ctx+'/custom/front/delete',//这个就是请求地址对应sAjaxSource
	        data:{timeCode:timeCode},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result == true){
	        		window.location.reload();
	        	}
	        }
		})
	})
//    	    	模态框点击失败
	$('.cancel').click(function(){
		$('#deleteAll').modal('hide');
	})
	
	//	编辑定制页
	$('.editCustom').click(function(){
		$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddMyCustom');
	})
})

/**
 * 列表传参
 * @returns {Array}
 */
function getParamsTable(aoData){
//	线索的timeCode
	var timeCode = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			timeCode = $(this).find('.link').attr('data-customgroup');
		}
	})
	
//	地区
	var regions = [];
	var regionsId = $('.clusterMap h2').attr('data-innerid');
	regions.push(regionsId);
	
//	分类
	var classifications = [];
	var classificationsId = $('.clusterFenlei h2').attr('data-innerid');
	classifications.push(classificationsId);
	
//	机构来源
	var sourcesOrg = [];
	var sourcesOrgId = $('.clusterSources h2').attr('data-innerid');
	sourcesOrg.push(sourcesOrgId);
	
//	载体
	var carrierOrg = [];
	var carrierOrgId = $('.clusterCarrier h2').attr('data-innerid');
	carrierOrg.push(carrierOrgId);
	
//	时间
	var startTime;
	var endTime;
	var todayTime = new Date();
	var inputTime = new Date($('#screen_begin_time').val().replace(/-/g,'/'));
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
			{'name':'regions','value':regions},
			{'name':'classifications','value':classifications},
			{'name':'sourcesOrg','value':sourcesOrg},
			{'name':'carrier','value':carrierOrg},
			{'name':'startTime','value':startTime},
			{'name':'endTime','value':endTime},
			{'name':'timeCode','value':timeCode}
	)
	
	return aoData;
}