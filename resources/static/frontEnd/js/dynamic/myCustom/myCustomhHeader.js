var threadAjaxData1,
    thumbnailTable,
    sudokuTable,
    highlightList = [],
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function(){
	
	refreshButton();
	
	/*$('.srceenTimeQuantum').removeClass('hide');*/
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
        			content += '<li class=""><a class="ti" href="#" data-innerid="'+obj[i].labelId+'">'+obj[i].name+'</a></li>';
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
        		screenConditionHandler({
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
	
	
	
	//	切换列表、缩略图、九宫格的展示方式
	$('.dataConShowWays').each(function(index){
		$(this).click(function(){
			$('.changeStateBtn').removeClass('activeBg');
			$('.dataConShowWays').removeClass('active');
			batchCheckWebPageCode = [];
			$(this).addClass('active');
			if(index == 0){
				
				threadAjaxData1.ajax.reload();
				
				$('.dataShowTable').removeClass('hide');
				$('.dataConThumbnail').addClass('hide');
				$('.dataConSudoku').addClass('hide');
				
				$('.showBranches').each(function(index) {
			          $(this).removeAttr('style');
			          $(this).find('a').removeAttr('style');
			          $('.showBranches').each(function(){
			      		$(this).click(function(){
			      			$(this).addClass('active').siblings('.showBranches').removeClass('active');
			      			var displayLength = $(this).find('a').text();
			      			$('.tableListLength').val(displayLength);
			      			if($('.tableListCon').val() == 0){
			      				threadAjaxData1.ajax.reload();
			      				threadAjaxData1.page.len( displayLength ).draw();
			      			}
			      		})
			      	});
			    });
				$('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
				$('.tableListCon').val('0');
			}else if(index == 1){
				if($(this).attr('data-show') == 'true'){
					thumbnailTable = $().thumbnailAjaxData({
						'requestUrl':ctx+'/custom/front/getMyCustomHeaderKeys',
						'getPassValue':getParamsTable,
					})
					$(this).attr('data-show','false');
				}else{
					thumbnailTable.ajax.reload();
				}
				$('.dataShowTable').addClass('hide');
				$('.dataConThumbnail').removeClass('hide');
				$('.dataConSudoku').addClass('hide');
				
				$('.showBranches').each(function(){
					$(this).css({
			            'cursor':'not-allowed',
			            'background':'#fff'
			        });
			        $(this).find('a').css({
			            'color':'#ccc',
			            'cursor':'not-allowed',
			        });
			        $(this).unbind('click');
				})
				
				$('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
				$('.tableListCon').val('1');
			}else if(index == 2){
				
				
				if($(this).attr('data-show') == 'true'){
					sudokuTable = $().sudokuAjaxData({
						'requestUrl':ctx+'/custom/front/getMyCustomHeaderKeys',
						'getPassValue':getParamsTable,
					})
					$(this).attr('data-show','false');
				}else{
					sudokuTable.ajax.reload();
				}
				$('.dataShowTable').addClass('hide');
				$('.dataConThumbnail').addClass('hide');
				$('.dataConSudoku').removeClass('hide');
				
				$('.showBranches').each(function(){
					$(this).css({
			            'cursor':'not-allowed',
			            'background':'#fff'
			        });
			        $(this).find('a').css({
			            'color':'#ccc',
			            'cursor':'not-allowed',
			        });
			        $(this).unbind('click');
				})
				$('.table-operation-status').find('a:first').removeClass('active').removeAttr('style').find('.checked-all').removeClass('checked');
				$('.tableListCon').val('2');
			}
		})
	});
	
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
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':3},  //传递参数
			callback:function(data){
	    		if(data.result){
	    			var obj = data.resultObj;
	    			for(var key in obj){
	        			if(obj[key]){
	        				for(var j = 0;tableItemWebPageCodeArr.length>j;j++){
	        					if(key == tableItemWebPageCodeArr[j]){
	        						if($('.tableListCon').val() == '0'){
	        							$('.inewsOperation').eq(j).find('i:first').attr('class','fa fa-heart active');
	        							$('.dataConBoxTable').find('span.check-child').eq(j).removeClass('checked');
	        						}else if($('.tableListCon').val() == '1'){
	        							$('.mediaOperation').eq(j).find('a').eq(1).addClass('active').find('i').attr('class','fa fa-heart');
	        							$('.dataConThumbnailTable').find('span.check-child').eq(j).removeClass('checked');
	        						}
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
					$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
					if($('.tableListCon').val() == '0'){
						threadAjaxData1.ajax.reload();
					}else if($('.tableListCon').val() == '1'){
						thumbnailTable.ajax.reload();
					}
				}
				
			}
		})
	})
	
	
	//表格进行数据传值
	threadAjaxData1 = $().threadAjaxData({
		'requestUrl':ctx+'/custom/front/getMyCustomHeaderKeys',
		'getPassValue':getParamsTable
	});
	
//	获得ajax返回的获取
	$('.dataConBoxTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		$('.sortCountButton a').find('span').text(json.iTotalRecords);
		highlightList = json.highlightList;
    });
	$('.dataConBoxTable').on('draw.dt',function() {
		
		$('.dataConBoxTable').itemCheck({   //给每一条新闻增加单击的事件
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
//		相似相关获取
		var textArr = threadAjaxData1.column(5).nodes().data();
		tableItemWebPageCodeArr =[];
		var releaseDateTimeArr = [];	
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
				releaseDateTimeArr.push(textArr[count].releaseDatetime);
			}
			//相似
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getSameNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConBoxTable tbody').find('[class*="sameNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			相关
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getRelevantNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConBoxTable tbody').find('[class*="relevantNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			负面指数
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getsentimentindex',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					console.log(data);
					$('.dataConBoxTable tbody').find('[class*="negativeNum"]').each(function(index){
						if(data[index].negative != null && data[index].negative != ''){
							var colorStyle = ''
							if(data[index].negative > 60){
								colorStyle = 'red'
							}else if(data[index].negative > 40){
								colorStyle = 'gray'
							}else{
								colorStyle = 'green'
							}
							
							$(this).text(data[index].negative+'%');
							$(this).addClass(colorStyle);
						}else{
							$(this).text('-');
						}
					})
				}
			});
//		浏览量
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConBoxTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			操作-收藏
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getUserFavorites',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConBoxTable tbody').find('.inewsOperation').each(function(index){
						if(data[index] == true){
							$(this).find('i').eq(0).attr('class','fa fa-heart active');
						}else{
							
						}
					})
				}
			});
//			操作-建稿
			
			$('.inewsOperation').each(function(index){
				$(this).find('span').eq(1).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'releaseDatetime': releaseDateTimeArr[index],
					'buildingCon':function(_$this){
						_$this.find('i').addClass('hide');
        				_$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
        			},
        			'buildedCon':function(_$this){
        				_$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
        				$("[data-toggle='tooltip']").tooltip();
        				threadAjaxData1.ajax.reload();
        			}
				})
			})
//			建、采
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getDraftType',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data,con){
					console.log(data);
					$('.dataConBoxTable tbody').find('.titleRightClick').each(function(index){
						if(data[index][0] == 1){
							$(this).find('a').css({
								'width':'90%'
							})
							$(this).append('<span class="label-status label-jian">【建】</span>');
						}else if(data[index][0] == 2){
							$(this).find('a').css({
								'width':'90%'
							})
							$(this).append('<span class="label-status label-cai">【采】</span>');
						}else{}
					})
				}
			});
			
//			datatables翻页时查询页面中是否有选中的新闻
			for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
				for(var j = 0;batchCheckWebPageCode.length>j;j++){
					if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
						$('.dataConBoxTable').find('.check-child').eq(i).addClass('checked');
					}
				}
			}
			
		}
		
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
					$('.dataConBoxTable').find('td.titleRightClick').find('a[data-id='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
		
		/*鼠标划入悬停提示*/
		$("[data-toggle='tooltip']").tooltip();
		$("[data-toggle='popover']").popover({
	    	html:true,
	    	trigger:'hover',
	    });
		
		
//		列表展示方式中的操作的样式
		$('.dataConBoxTable tbody').find('.inewsOperation').each(function(){
			$(this).find('i').each(function(index){
				$(this).click(function(){
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						if(index == 0){
							$(this).attr('class','fa fa-heart-o');
						}
						if(index == 1){
							$(this).attr('class','fa fa-file-text-o');
						}
					}else{
						if(index == 0){
							$(this).attr('class','fa fa-heart');
						}
						if(index == 1){
							$(this).attr('class','fa fa-file-text');
						}
						$(this).addClass('active')
					}
//					操作-收藏与后台交互
					if(index == 0){
						var webpageCode = $(this).parents('td.inewsOperation').attr('data-id');
						$().judgeKeep({
							'dataUrl':ctx+'/latest/front/collectingNews',
							'dataParam':{'webpageCode':webpageCode,'type':3}
						})
					}
				})
			})
		});
	});
	
	
//	获得ajax返回的获取
	$('.dataConThumbnailTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList;
    });
	
	$('.dataConThumbnailTable').on('draw.dt',function() {
		
		
		/*缩略图详情省略*/
    	$('.dataConThumbnailTable').find('.mediaConSummary').each(function(){
    		if($(this).height()>=63){
    		    $(this).css({
    		        'height':63,
    		    });
    		    $(this).dotdotdot({
    		        wrap: 'letter'
    		     });
    		 }
    	});
    	
    	$('.dataConThumbnailTable').itemCheck({   //给每一条新闻增加单击的事件
			'itemFun':function($this,statusItem){
				if(statusItem){
//					console.log($this);
					batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
				}else{
					for(var i = 0;batchCheckWebPageCode.length>i;i++){
						var webpageCodeItem = $this[0].attributes[0].nodeValue;
						if(webpageCodeItem == batchCheckWebPageCode[i]){
							batchCheckWebPageCode.splice(i);
						}
					}
				}
			}
		});
		var thumbnailArr = thumbnailTable.column(1).nodes().data();
		tableItemWebPageCodeArr =[];
		var otherReleaseDateTimeArr = []; 
		if(thumbnailArr.length > 0){
			for(var count = 0;thumbnailArr.length>count;count++){
				tableItemWebPageCodeArr.push(thumbnailArr[count].webpageCode);
				otherReleaseDateTimeArr.push(thumbnailArr[count].releaseDatetime);
			}
			
			//相似
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getSameNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConThumbnailTable tbody').find('[class*="sameNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			相关
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getRelevantNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConThumbnailTable tbody').find('[class*="relevantNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
//		浏览量
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConThumbnailTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			操作-收藏
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getUserFavorites',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.dataConThumbnailTable tbody').find('.mediaOperation').each(function(index){
						if(data[index] == true){
							$(this).find('a').eq(1).addClass('active');
							$(this).find('a').eq(1).find('i').attr('class','fa fa-heart ');
						}else{
							
						}
					})
				}
			});
			
//			操作-建稿
			
			$('.mediaOperation').each(function(index){
				$(this).find('a').eq(2).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'releaseDatetime': otherReleaseDateTimeArr[index],
					'buildingCon':function(_$this){
						_$this.html('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>&nbsp;建稿中...');
        			},
        			'buildedCon':function(_$this){
        				_$this.html('<i class="fa fa-file-text"></i>建稿');
        				thumbnailTable.ajax.reload();
        			}
				})
			});
			
//			建、采
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getDraftType',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data,con){
					$('.dataConThumbnailTable tbody').find('.titleRightClick').each(function(index){
						if(data[index].length > 0){
							if(data[index][0] == 1){
								$(this).find('a').css({
									'width':'90%'
								});
								$(this).append('<span class="label-status label-jian">【建】</span>');
							}else if(data[index][0] == 2){
								$(this).find('a').css({
									'width':'90%'
								});
								$(this).append('<span class="label-status label-cai">【采】</span>');
							}else{}
						}
						
					})
				}
			});
			
			
//			datatables翻页时查询页面中是否有选中的新闻
			for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
				for(var j = 0;batchCheckWebPageCode.length>j;j++){
					if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
						$('.dataConThumbnailTable').find('.check-child').eq(i).addClass('checked');
					}
				}
			}
		}
		
		
//		搜索词高亮显示
		var highTitleArr = [];
		if(highlightList != null){
			for(var log = 0;thumbnailArr.length>log;log++){
				highTitleArr.push({
					'webpageCode':thumbnailArr[log].webpageCode,
					'title':thumbnailArr[log].title
				})
			}
			
			for(var i = 0;highlightList.length>i;i++){
				for(var j = 0;highTitleArr.length>j;j++){
					highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i],'<span class="red">'+highlightList[i]+'</span>');
					$('.dataConThumbnailTable').find('.titleRightClick').find('a[data-id='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
		
		$('.dataConThumbnailTable tbody').find('p.mediaOperation').each(function(){
			$(this).find('a').each(function(index){
				$(this).click(function(){
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						if(index == 1){
							$(this).find('i').attr('class','fa fa-heart-o');
						}
						if(index == 2){
							$(this).find('i').attr('class','fa fa-file-text-o');
						}
					}else{
						$(this).addClass('active');
						if(index == 1){
							$(this).find('i').attr('class','fa fa-heart');
						}
						if(index == 2){
							$(this).find('i').attr('class','fa fa-file-text');
						}
					}
//					操作-收藏与后台交互
					if(index == 1){
						var webpageCode = $(this).parents('p.mediaOperation').attr('data-id');
						$().judgeKeep({
							'dataUrl':ctx+'/latest/front/collectingNews',
							'dataParam':{'webpageCode':webpageCode,'type':3}
						})
					}
				})
			})
		})
		
	});
	
	$('.dataConSudokuTable').on('draw.dt',function() {
//		全选功能
		$('.dataConBoxTable').allCheck();
		
    	$('.dataConSudokuTable').find('.sudokuSummary').each(function(){
    		if($(this).height()>=132){
    		    $(this).css({
    		        'height':132,
    		    });
    		    $(this).dotdotdot({
    		        wrap: 'letter'
    		     });
    		 }
    	});
    	
	})
	
	//	含图片与含视频切换
	$('.changeStateBtn').click(function(){
		if($(this).hasClass('active')){
//			将时间变量赋值为最近24小时
			$('.dataShowTable').attr('data-once','false');
			$('.changeStateBtn').removeClass('active');
			$(this).removeClass('active');
		}else{
			$('.dataShowTable').attr('data-once','true');
			$('.changeStateBtn').removeClass('active');
			$(this).addClass('active');
		}
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
	})
	
//	点击地区刷新列表
	$('#clusterMapPro').click(function(){
		
		console.log($('.tableListCon').val());
		if($('.tableListCon').val() == '0'){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == '1'){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == '2'){
			sudokuTable.ajax.reload();
		}
		
		return false;
	})
	
//	点击分类刷新列表
	$('#clusterFenleiPro').click(function(){
		
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
		return false;
	})
	
//	点击来源刷新列表
	
	$('#clusterSourcesPro').click(function(){
		
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
		return false;
	})
	
	//	点击载体刷新列表
	$('#clusterCarrierPro').click(function(){
		
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
		return false;
	})
	
	//	点击时间段刷新列表
	$('#srceenTimeQuantumPro').click(function(){
		
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
		return false;
	})
	
//	 相似合并
	$('.changeState').click(function(){
		$('.dataShowTable').attr('data-once','true');
		if($(this).hasClass('activeBg')){
			$(this).removeClass('activeBg');
		}else{
			$(this).addClass('activeBg');
		}
		
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
	})
//	展示条数的样式
	$('.showBranches').each(function(){
		$(this).click(function(){
			$(this).addClass('active').siblings('.showBranches').removeClass('active');
			var displayLength = $(this).find('a').text();
			$('.tableListLength').val(displayLength);
			if($('.tableListCon').val() == 0){
				threadAjaxData1.ajax.reload();
				threadAjaxData1.page.len( displayLength ).draw();
			}
		})
	});
	
//	iSearch点击查询
	$('.customAddBtn').customInputClickBtn({
		'refreshTable':function(){
			if($('.tableListCon').val() == 0){
				threadAjaxData1.ajax.reload();
			}else if($('.tableListCon').val() == 1){
				thumbnailTable.ajax.reload();
			}else if($('.tableListCon').val() == 2){
				sudokuTable.ajax.reload();
			}
		},
		'callBack':function(customAddVal){
			$('.sortCountButton').removeClass('hide');
		}
	})
//	iSearch加载本地数据
	customAddVal = JSON.parse(localStorage.getItem('isearch'));
	$(".customAddInput").parseLocalArrayData({
		'dataSources':customAddVal,
		'afterSelect':function(){
			if($('.tableListCon').val() == 0){
				threadAjaxData1.ajax.reload();
			}else if($('.tableListCon').val() == 1){
				thumbnailTable.ajax.reload();
			}else if($('.tableListCon').val() == 2){
				sudokuTable.ajax.reload();
			}
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

/**
 * 列表参数的获取
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
	
//	是否相似
	var showSimilar = '';
	if($('.changeState').hasClass('activeBg')){
		showSimilar = new Boolean(false);
	}else{
		showSimilar = new Boolean(true);
	}
	
//	含图片、含视频
	var mediaStatus = '';
	$('.changeStateBtn').each(function(index){
		if($(this).hasClass('active')){
			if($(this).text() == '含图片'){
				mediaStatus = '2'
			}else{
				mediaStatus = '1'
			}
		}
	})
//	时间
	var startTime;
	var endTime;
	var timeQuantum = '';
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
	
	if(timeQuantum != ''){
		aoData.push(
				{'name':'startTime','value':startTime},
				{'name':'endTime','value':endTime}
		)
	}
	aoData.push(
		{'name':'regions','value':regions},
		{'name':'classifications','value':classifications},
		{'name':'sourcesOrg','value':sourcesOrg},
		{'name':'carrier','value':carrierOrg},
		{'name':'showSimilar','value':showSimilar},
		{'name':'mediaStatus','value':mediaStatus},
		{'name':'queryStr','value':queryStr},
		{'name':'timeCode','value':timeCode}
	)
	return aoData;
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
				if($('.tableListCon').val() == 0){
					threadAjaxData1.ajax.reload();
				}else if($('.tableListCon').val() == 1){
					thumbnailTable.ajax.reload();
				}else if($('.tableListCon').val() == 2){
					sudokuTable.ajax.reload();
				}
			},60000);
		}
		
	});
}