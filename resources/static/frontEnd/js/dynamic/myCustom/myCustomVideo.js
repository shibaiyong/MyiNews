var getVideoAjaxData1,
	customAddVal = [],
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
	tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function(){
	/*头部导航高亮*/
	$('.clusterSources').removeClass('hide');
	$('.clusterCarrier').removeClass('hide');
	$('.clusterMap').removeClass('hide');
    $('.clusterFenlei').removeClass('hide');
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
	
//	时间段
	$().getData({
		boxClassName:'.srceenTimeQuantum',
		ulClassName:'#srceenTimeQuantumPro',
	})
	
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
        		screenConditionHandler({
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
        data:{'timeCode':timeCode,'level':3},
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
        		
        		screenConditionHandler({
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
        		screenConditionHandler({
    				className:'.clusterFenlei',
    				idName:'#clusterFenleiPro',
    			});
        	}
        }
	})
	
	refreshButton();
	
	$('.moreOperate').find('button.merge').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	})
	
	//	显示线索的标题
	var title = '';
	var dataCustomgroup = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			
			dataCustomgroup = $(this).find('.link').attr('data-customgroup');
			title = $(this).find('.link span').text();
			$('.recommend-title h4').text(title).attr('data-customgroup',dataCustomgroup);
		}
	})
	
	//	全选功能
	$('.table-operation-status').find('a').eq(0).allCheck({
		'allFun':function(status){
			if(status){
				console.log(status);
				if(batchCheckWebPageCode.length == 0){
					for(var ca=0;tableItemWebPageCodeArr.length>ca;ca++){
						batchCheckWebPageCode.push(tableItemWebPageCodeArr[ca]);
					}
				}else{
//					var len = batchCheckWebPageCode.length;
					for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
						
						var jishustatus = 0;
						
						for(var j = 0;batchCheckWebPageCode.length>j;j++){
							if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
								++jishustatus;
							}
						}
						
						if(jishustatus == 0){
							batchCheckWebPageCode.push(tableItemWebPageCodeArr[i])
						}else{
							jishustatus = 0
						}
					}
				}
			}else{
				for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
					for(var j = 0;batchCheckWebPageCode.length>j;j++){
						if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
							batchCheckWebPageCode.splice(j,1)
						}
					}
				}
			}
		}
	});
//	批量收藏
	$('.table-operation-status a').eq(2).click(function(){
		$(this).batchCollect({
			dataUrl:ctx+'/latest/front/collectingAllNews', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':7},  //传递参数
			callback:function(data){
	    		if(data.result){
	    			var obj = data.resultObj;
	    			for(var key in obj){
	        			if(obj[key]){
	        				for(var j = 0;tableItemWebPageCodeArr.length>j;j++){
	        					if(key == tableItemWebPageCodeArr[j]){
	        						$('.videoConBoxTable').find('.collect').eq(j).addClass('active').find('i').attr('class','fa fa-heart');
	        						$('.videoConBoxTable').find('span.check-child').eq(j).removeClass('checked');
	        						$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
	        					}
	        				}
	        			}
	        		}
	    			batchCheckWebPageCode = [];
	    		}
			}
		})
	});
//	批量建稿
	$('.table-operation-status a').eq(3).click(function(){
		$(this).batchBuild({
			dataUrl:ctx+'/latest/front/draft/release/more', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode},  //传递参数
			callback:function(data,tempwindow){
				if(data.result){
					
					tempwindow.location=data.resultObj;
					$('span.check-child').removeClass('checked');
					batchCheckWebPageCode = [];
					
					getVideoAjaxData1.ajax.reload();
				}
				
			}
		})
	});
	
	//表格进行数据传值
	getVideoAjaxData1 = $().getVideoAjaxData({
		'requestUrl':ctx+'/custom/front/getMyCustomVideo',
		'getPassValue':getParamsTable
	});
	
//	获得ajax返回的获取
	$('.videoConBoxTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList
    });
	
	getVideoAjaxData1.on('draw.dt',function() {
		
		$('.videoConBoxTable').itemCheck({   //给每一条新闻增加单击的事件
			'itemFun':function($this,statusItem){
				if(statusItem){
//					console.log($this[0].attributes[0].nodeValue);
					batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
				}else{
					for(var i = 0;batchCheckWebPageCode.length>i;i++){
						var webpageCodeItem = $this[0].attributes[0].nodeValue;
						if(webpageCodeItem == batchCheckWebPageCode[i]){
							batchCheckWebPageCode.splice(i,1);
						}
					}
				}
			}
		});
		
//		浏览量获取
		var textArr = getVideoAjaxData1.column(0).nodes().data();
		tableItemWebPageCodeArr = [];
		var releaseDateTimeArr = [];
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
				releaseDateTimeArr.push(textArr[count].releaseDatetime);
			}
			console.log(tableItemWebPageCodeArr);
//			浏览量
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.videoConBoxTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			操作-收藏
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getUserFavorites',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					console.log(data);
					$('.videoConBoxTable tbody').find('.collect').each(function(index){
						if(data[index] == true){
							$(this).addClass('active');
							$(this).find('i').attr('class','fa fa-heart');
						}else{
							
						}
					})
				}
			});
//			操作-建稿
			
			$('.jiangao').each(function(index){
				$(this).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'releaseDatetime': releaseDateTimeArr[index],
					'buildingCon':function(_$this){
						_$this.find('i').addClass('hide');
        				_$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
        			},
        			'buildedCon':function(_$this){
        				_$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
        				$("[data-toggle='tooltip']").tooltip();
        				getVideoAjaxData1.ajax.reload();
        			}
				})
			});
//			建、采
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getDraftType',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data,con){
					$('.videoConBoxTable tbody').find('.titleRightClick').each(function(index){
						if(data[index].length > 0){
							if(data[index][0] == 1){
								$(this).find('a').css({
									'width':'87%'
								});
								$(this).append('<span class="label-status label-jian">【建】</span>');
							}else if(data[index][0] == 2){
								$(this).find('a').css({
									'width':'87%'
								});
								$(this).append('<span class="label-status label-cai">【采】</span>');
							}else{}
						}
					})
				}
			});
		}
		
//		datatables翻页时查询页面中是否有选中的新闻
		for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
			for(var j = 0;batchCheckWebPageCode.length>j;j++){
				if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
					$('.videoConBoxTable').find('.check-child').eq(i).addClass('checked');
				}
			}
		}
		
		collect();
		
		/*鼠标划入悬停提示*/
		$('[data-toggle="tooltip"]').tooltip();
		
//		设置图片的宽高
		var tableWidth = $('.videoConBoxTable').find('tbody tr').width()-16;
		var tableHeight = tableWidth / 16 * 9
		$('.videoConBoxTable').find('.site-piclist_pic').css({
			'width':tableWidth + 'px',
			'height':tableHeight + 'px',
			'lineHeight':tableHeight + 'px',
		});
		$('.videoConBoxTable').find('.site-piclist_pic>img').css({
			'maxHeight':tableHeight + 'px',
		});
		$('.videoConBoxTable').find('.site-piclist_info').css({
			'width':tableWidth + 'px',
		});
		$('.videoConBoxTable').find('.site-piclist_pic_zhezhao').css({
			'width':tableWidth + 'px',
			'height':tableHeight + 'px',
			'lineHeight':tableHeight + 'px',
		});
		
//		搜索词高亮显示
		var highTitleArr = [];
		if(highlightList != null){
			for(var log = 0;textArr.length>log;log++){
				highTitleArr.push({
					'webpageCode':textArr[log].webpageCode,
					'title':textArr[log].title
				})
			}
			
			for(var i = 0;highlightList.length>i;i++){
				for(var j = 0;highTitleArr.length>j;j++){
					highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i],'<span class="red">'+highlightList[i]+'</span>');
					$('.videoConBoxTable').find('p.titleRightClick').find('a[data-webpagecode='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
	})
	
//	点击地区刷新列表
	$('#clusterMapPro').click(function(){
		
		getVideoAjaxData1.ajax.reload();
		return false;
	})
	
//	点击分类刷新列表
	$('#clusterFenleiPro').click(function(){
		
		getVideoAjaxData1.ajax.reload();
		return false;
	})
	//	点击时间段刷新列表
	$('#srceenTimeQuantumPro').click(function(){
		
		getVideoAjaxData1.ajax.reload();
		return false;
	})
//	点击来源刷新列表
	
	$('#clusterSourcesPro').click(function(){
		
		getVideoAjaxData1.ajax.reload();
		return false;
	})
	
	//	点击载体刷新列表
	$('#clusterCarrierPro').click(function(){
		
		getVideoAjaxData1.ajax.reload();
		return false;
	})
	
	//	iSearch点击查询
	$('.customAddBtn').customInputClickBtn({
		'refreshTable':function(){
			getVideoAjaxData1.ajax.reload();
		}
	});
//	 相似合并
	$('.merge').click(function(){
		
		getVideoAjaxData1.ajax.reload();
	})
	//	iSearch加载本地数据
	customAddVal = JSON.parse(localStorage.getItem('isearch'));
	$(".customAddInput").parseLocalArrayData({
		'dataSources':customAddVal,
		'afterSelect':function(){
			getVideoAjaxData1.ajax.reload();
		}
	});
	
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
	
//	是否相似
	var showSimilar = '';
	if($('.merge').hasClass('active')){
		showSimilar = new Boolean(false);
	}else{
		showSimilar = new Boolean(true);
	}
//	时间
	var startTime;
	var endTime;
	var timeQuantum = "";
	/*var timeQuantum = $.trim($('.srceenTimeQuantum').find('h2').attr('data-innerid'));*/
	
	/*if(timeQuantum != ''){
		startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * timeQuantum)).toUTCString();
		endTime = new Date().toUTCString();
	}
	
	console.log('startTime:'+startTime);
	console.log('endTime:'+endTime);*/
//	查询iSearch
	var queryStr = [];
	var queryStrVal = $.trim($('.customAddInput').val());
	queryStr.push(queryStrVal);
	
//	mediaStatus的值设置为3
	var mediaStatus=1;
	
	if(timeQuantum != ''){
		aoData.push(
				{'name':'startTime','value':startTime},
				{'name':'endTime','value':endTime}
		)
	}
	aoData.push(
		{'name':'sourcesOrg','value':sourcesOrg},
		{'name':'carrier','value':carrierOrg},
		{'name':'regions','value':regions},
		{'name':'classifications','value':classifications},
		{'name':'queryStr','value':queryStr},
		{'name':'mediaStatus','value':mediaStatus},
		{'name':'timeCode','value':timeCode},
		{'name':'showSimilar','value':showSimilar}
	)
	
	return aoData;
}

//新闻收藏
function collect(){
	$('.collect').each(function(){
		$(this).click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).find('i').attr('class','fa fa-heart-o');
			}else{
				$(this).addClass('active');
				$(this).find('i').attr('class','fa fa-heart');
			}
			
			var webpageCode = $(this).attr('data-id');
			$().judgeKeep({
				'dataUrl':ctx+'/latest/front/collectingNews',
				'dataParam':{'webpageCode':webpageCode,'type':7},
			})
		})
	})
}

/*每隔60秒刷险一次列表*/
function refreshButton(){
	var init;
	$('.refreshButton').click(function(){
		var _$this = $(this).find('i');
		if(_$this.hasClass('fa-spin')){
			_$this.removeClass('fa-spin');
			clearInterval(init);
		}else{
			_$this.addClass('fa-spin');
			init = setInterval(function(){
				getVideoAjaxData1.ajax.reload();
			},60000);
		}
		
	});
}