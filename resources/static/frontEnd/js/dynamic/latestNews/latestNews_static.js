//将表格定义成全局变量
var threadAjaxData1,
    thumbnailTable,
    sudokuTable,
    highlightList = [],
    customAddVal = [],
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode

$(function(){
	/*头部导航高亮*/
	
	
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.news'){
					$(this).addClass('active');
				}
			});
		}
	})
	

	footerPutBottom();
//	点击刷新，每60秒刷新
	refreshButton();
	if($('.searchWord').val() != ''){
		$('.customAddInput').val($('.searchWord').val());
	}
	
//	$('[data-toggle="tooltip"]').tooltip();
	
//	添加来源
	$('.addSources').typeahead({
        source: function (query, process) {
            //query是输入的值
        	$.ajax({
                url: ctx+'/common/dic/front/getWebSite',//这个就是请求地址对应sAjaxSource
                data:{'name':query},
                type : 'get',
                dataType : 'json',
                async : true,
                success : function(data) {
                	console.log(data);
                	if(data.result == true){
                		var sourcesData = data.resultObj;
                		if(sourcesData.length == '0'){
                			$('.noSources').removeClass('hide');
                			$('.typeahead').css({
                				'display':'none'
                			})
                			return;
                		}else{
                			var array = [];
                			for(var i = 0;sourcesData.length>i;i++){
                				
                				var arrayItem = {
                						'id':'',
                						'name':'',
                				}
                				arrayItem.id = sourcesData[i].innerid;
                				arrayItem.name = sourcesData[i].name;
                				
                				array.push(arrayItem);
                			}
                			$('.noSources').addClass('hide');
                			process(array);
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	var itemId = item.id;
        	$.ajax({
                url: ctx+'/custom/front/addUserWebsite',//这个就是请求地址对应sAjaxSource
                data:{'websiteId':itemId},
                type : 'get',
                dataType : 'json',
                async : true,
                success : function(data) {
                	if(data.result == true){
                		var obj = data.resultObj;
                		if(obj == 'success'){
                			$().toastmessage('showToast', {
                				//提示信息的内容
                		    	text: '添加来源成功！',
                		   		sticky: false,
                		        position : 'bottom-right',
                		        type: 'success',
                			});
                			$('.webSources').html('');
                			getWebSourcesData(ctx+'/custom/front/listUserWebsite');
                			
                		}else if(obj == 'fail'){
                			$().toastmessage('showToast', {
                		    	text: '添加来源失败！',
                		   		sticky: false, 
                		   		position : 'bottom-right',
                		        type: 'error',
                			});
                		}else if(obj == 'alreadyExist'){
                			$().toastmessage('showToast', {
                				//提示信息的内容
                		    	text: '已经添加过！',
                		   		sticky: false,
                		   		position : 'bottom-right',
                		        type: 'notice',
                			});
                		}else if(obj == 'upperLimit'){
                			$().toastmessage('showToast', {
                				//提示信息的内容
                		    	text: '添加条数到达上限！',
                		   		sticky: false,
                		   		position : 'bottom-right',
                		        type: 'notice',
                			});
                		}
                	}
                }
        	})
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
	$('.addSources').blur(function(){
		$('.noSources').addClass('hide');
	})
    
    var accordion = new Accordion($('#accordion'),false);
    
//    去掉来源
    $('.srceenTimeQuantum').removeClass('hide');
    $('.srceenMap').removeClass('hide');
    $('.srceenClassification').removeClass('hide');
    $('.screenSearch').removeClass('hide');
//    $('.srceenCustomTime').removeClass('hide');
    var screenIndex = 0;
	$('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			if($(this).prev().hasClass('srceenTimeQuantum')){
				if($(this).prev().hasClass('hide')){
					var mlLeft = 125 * screenIndex;
					$(this).css({
						'marginLeft': mlLeft +'px',
					})
				}else{
					var mlLeft = 125 * (screenIndex-1)+220;
					$(this).css({
						'marginLeft': mlLeft +'px',
					})
				}
			}else{
				var mlLeft = 125 * screenIndex;
				$(this).css({
					'marginLeft': mlLeft +'px',
				})
			}
			++screenIndex;
		}
	})


	//	地区
	var isUserable = sessionStorage.getItem('srceenMapUserable');
	if (isUserable == 'usable') {
		getArea();
	}else{
		$('.srceenMap').attr('disabled', true);
		$('.srceenMap').addClass('unclick').addClass('unareausable');
	}	
	
	//	分类
	$().getData({
		getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigClassification', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listNewsClassification', //请求路径
		boxClassName: '.srceenClassification',
		ulClassName: '#srceenClassificationPro',
		level: 2,
		multiSelect: true,
	})
	//	本地，本省，全国
	$().tenantConfigArea({
		getAjaxUrl: ctx + '/tenant/back/listTenantRegion', //请求路径
		isShow: true,
		callback: areaStatus,
	})
	
	//	时间段
	$().getData({
		boxClassName:'.srceenTimeQuantum',
		ulClassName:'#srceenTimeQuantumPro',
	})
	
	//	时间段
	selectTime();

	// 本地区
	$('.cityArea').click(function () {		
		if ($(this).hasClass('citySelected')) {
			$(this).removeClass('citySelected');
			sessionStorage.setItem('areaSelected', '');
			// 地区选项可用标识
			sessionStorage.setItem('srceenMapUserable', 'usable');	
			$('.srceenMap').removeAttr('disabled');
			$('.srceenMap').removeClass('unclick').removeClass('unareausable');
			$('.srceenMap').find('ul').empty();
			getArea();
		}else{
			$('.tenantArea').removeClass('citySelected').removeClass('provinceSelected').removeClass('countrySelected');
			$(this).addClass('citySelected');
			sessionStorage.setItem('areaSelected', 'citySelected');
			// 地区选项不可用标识
			sessionStorage.setItem('srceenMapUserable', 'unusable');
			$('.srceenMap').find('h2').attr('data-innerid', $(this).attr('data-innerid'));
			$('.srceenMap').find('h2').find('i').addClass('hide');
			$('.srceenMap').find('h2').text('地区');
			$('.srceenMap').attr('disabled', true);
			$('.srceenMap').addClass('unclick').addClass('unareausable');
		}
		if ($('.tableListCon').val() == '0') {
			threadAjaxData1.ajax.reload();
		} else if ($('.tableListCon').val() == '1') {
			thumbnailTable.ajax.reload();
		} else if ($('.tableListCon').val() == '2') {
			sudokuTable.ajax.reload();
		}
		return false;
	});
	// 本省
	$('.provinceArea').click(function () {
		if ($(this).hasClass('provinceSelected')) {
			$(this).removeClass('provinceSelected');
			sessionStorage.setItem('areaSelected', '');
			// 地区选项可用标识
			sessionStorage.setItem('srceenMapUserable', 'usable');
			$('.srceenMap').removeAttr('disabled');
			$('.srceenMap').removeClass('unclick').removeClass('unareausable');
			$('.srceenMap').find('ul').empty();
			getArea();
		} else {
			$('.tenantArea').removeClass('citySelected').removeClass('provinceSelected').removeClass('countrySelected');
			$(this).addClass('provinceSelected');
			sessionStorage.setItem('areaSelected', 'provinceSelected');
			// 地区选项不可用标识
			sessionStorage.setItem('srceenMapUserable', 'unusable');
			$('.srceenMap').find('h2').attr('data-innerid', $(this).attr('data-innerid'));
			$('.srceenMap').find('h2').find('i').addClass('hide');
			$('.srceenMap').find('h2').text('地区');
			$('.srceenMap').attr('disabled', true);
			$('.srceenMap').addClass('unclick').addClass('unareausable');
		}
		if ($('.tableListCon').val() == '0') {
			threadAjaxData1.ajax.reload();
		} else if ($('.tableListCon').val() == '1') {
			thumbnailTable.ajax.reload();
		} else if ($('.tableListCon').val() == '2') {
			sudokuTable.ajax.reload();
		}
		return false;
	});
	// 全国
	$('.country').click(function () {
		if ($(this).hasClass('countrySelected')) {
			$(this).removeClass('countrySelected');
			sessionStorage.setItem('areaSelected', '');
			// 地区选项可用标识
			sessionStorage.setItem('srceenMapUserable', 'usable');
			$('.srceenMap').removeAttr('disabled');
			$('.srceenMap').removeClass('unclick').removeClass('unareausable');
			$('.srceenMap').find('ul').empty();
			getArea();
		} else {
			$('.tenantArea').removeClass('citySelected').removeClass('provinceSelected').removeClass('countrySelected');
			$(this).addClass('countrySelected');
			sessionStorage.setItem('areaSelected', 'countrySelected');
			// 地区选项不可用标识
			sessionStorage.setItem('srceenMapUserable', 'unusable');
			$('.srceenMap').find('h2').attr('data-innerid', $(this).attr('data-innerid'));
			$('.srceenMap').find('h2').find('i').addClass('hide');
			$('.srceenMap').find('h2').text('地区');
			$('.srceenMap').attr('disabled', true);
			$('.srceenMap').addClass('unclick').addClass('unareausable');
		}
		if ($('.tableListCon').val() == '0') {
			threadAjaxData1.ajax.reload();
		} else if ($('.tableListCon').val() == '1') {
			thumbnailTable.ajax.reload();
		} else if ($('.tableListCon').val() == '2') {
			sudokuTable.ajax.reload();
		}
		return false;
	});

	// 处理本市，全省，全国的选中状态
	function areaStatus() {
		// 处理本地，本省和全国
		var areaSelected = sessionStorage.getItem('areaSelected');
		if ($('.cityArea').hasClass('areaActive')) {
			$('.cityArea').removeClass('hide');
			if (areaSelected != '' && areaSelected != 'undefined' && areaSelected == 'citySelected') {
				$('.cityArea').addClass('citySelected');
			}
		}
		if ($('.provinceArea').hasClass('areaActive')) {
			$('.provinceArea').removeClass('hide');
			if (areaSelected != '' && areaSelected != 'undefined' && areaSelected == 'provinceSelected') {
				$('.cityArea').addClass('areaSelected');
			}
		}
		if ($('.country').hasClass('areaActive')) {
			$('.country').removeClass('hide');
			if (areaSelected != '' && areaSelected != 'undefined' && areaSelected == 'countrySelected') {
				$('.cityArea').addClass('areaSelected');
			}
		}
	}
	// 获取地区
	function getArea() {
		$().getData({
			getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigRegion', //请求路径(用户配置的数据)
			getAjaxUrl: ctx + '/common/dic/front/listRegion', //请求路径
			boxClassName: '.srceenMap',
			ulClassName: '#srceenMapPro',
			level: 2,
			multiSelect: true,
		})
	}
//	 相似合并、展示条数的样式
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
		
	getWebSourcesData(ctx+'/custom/front/listUserWebsite');
	
//	切换列表、缩略图、九宫格的展示方式
	$('.dataConShowWays').each(function(index){
		$(this).click(function(){
			$('.changeStateBtn').removeClass('activeBg');
			$('.dataConShowWays').removeClass('active');
			$(this).addClass('active');
			batchCheckWebPageCode = [];
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
						'requestUrl': ctx + '/latest/front/pageLatestNewsCache',
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
						'requestUrl': ctx + '/latest/front/pageLatestNewsCache',
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
//					batchCheckWebPageCode = tableItemWebPageCodeArr;
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
				for(var xa = 0;tableItemWebPageCodeArr.length>xa;xa++){
					for(var j = 0;batchCheckWebPageCode.length>j;j++){
						if(tableItemWebPageCodeArr[xa] == batchCheckWebPageCode[j]){
							batchCheckWebPageCode.splice(j,1)
						}
					}
				}
			}
			
			console.log(batchCheckWebPageCode);
		}
	});
	

	
	// 延时1000执行，待用户定制的参数渲染之后再执行此方法
	setTimeout(function () {
		//表格进行数据传值
		threadAjaxData1 = $().threadAjaxData({
			'requestUrl': ctx + '/latest/front/pageLatestNewsCache',
			'getPassValue': getParamsTable
		});
	}, 2000);
	
//	批量收藏
	$('.table-operation-status a').eq(2).click(function(){
		$(this).batchCollect({
			dataUrl:ctx+'/latest/front/collectingAllNews', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':1},  //传递参数
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
					
					if($('.tableListCon').val() == '0'){
						threadAjaxData1.ajax.reload();
					}else if($('.tableListCon').val() == '1'){
						thumbnailTable.ajax.reload();
					}
				}
				
			}
		})
	})
	
//	获得ajax返回的获取
	$('.dataConBoxTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		console.log(json);
		$('.sortCountButton a').find('span').text(json.iTotalRecords);
		highlightList = json.highlightList
		
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
				
				console.log(batchCheckWebPageCode);
			}
		});
		
		
//		相似相关获取
		var textArr = threadAjaxData1.column(5).nodes().data();
		console.log(textArr);
		tableItemWebPageCodeArr = [];
		if(textArr.length > 0){
			var textArrCon =[];
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
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
					$('.dataConBoxTable tbody').find('[class*="negativeNum"]').each(function(index){
						if(data[index].negative != null && data[index].negative != ''){
							var colorStyle = ''
							// if(data[index].negative > 60){
							// 	colorStyle = 'red'
							// }else
							if(data[index].negative > 40){
								colorStyle = 'gray'
							}else{
								colorStyle = 'green'
							}
                            var negative=data[index].negative;
                            if(negative>40){
                                $(this).text('-'+negative.toFixed(2));
                            }else{
                                $(this).text((100-negative).toFixed(2));
                            }
							//$(this).text(data[index].negative);
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
						if(data[index].length > 0){
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
						}
						
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
					var $this = $(this);
//					操作-收藏与后台交互
					if(index == 0){
						var webpageCode = $this.parents('td.inewsOperation').attr('data-id');
						$().judgeKeep({
							'dataUrl':ctx+'/latest/front/collectingNews',
							'dataParam':{'webpageCode':webpageCode,'type':1},
							'callback':function(data){
								if(data.result){
									if($this.hasClass('active')){
										$this.removeClass('active');
										if(index == 0){
											$this.attr('class','fa fa-heart-o');
										}
										if(index == 1){
											$this.attr('class','fa fa-file-text-o');
										}
									}else{
										if(index == 0){
											$this.attr('class','fa fa-heart');
										}
										if(index == 1){
											$this.attr('class','fa fa-file-text');
										}
										$this.addClass('active')
									}
								}
							}
						})
					}
				})
			})
		});
	});
	
	$('.dataConThumbnailTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList
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
		if(thumbnailArr.length > 0){
			for(var count = 0;thumbnailArr.length>count;count++){
				tableItemWebPageCodeArr.push(thumbnailArr[count].webpageCode);
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
							$(this).find('a').eq(1).find('i').attr('class','fa fa-heart');
						}else{
							
						}
					})
				}
			});
//			操作-建稿
			
			$('.mediaOperation').each(function(index){
				$(this).find('a').eq(2).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
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
					console.log(data);
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
							'dataParam':{'webpageCode':webpageCode,'type':1}
						})
					}
				})
			})
		})
		
	});
	
	$('.dataConSudokuTable').on('draw.dt',function() {
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
	
// //	点击地区(多选)
// 	$('#srceenMapPro').click(function(event){		
// 		var event = event || window.event;
// 		var className = event.target.className;
// 		if (className == 'multiSure') {
// 			// 操作此按钮时刷新缓存
// 			sessionStorage.setItem('cache', '1');
// 			if ($('.tableListCon').val() == '0') {
// 				threadAjaxData1.ajax.reload();
// 			} else if ($('.tableListCon').val() == '1') {
// 				thumbnailTable.ajax.reload();
// 			} else if ($('.tableListCon').val() == '2') {
// 				sudokuTable.ajax.reload();
// 			}
// 			return false;
// 		}		
// 	})
// //	点击分类(多选)
// 	$('#srceenClassificationPro').click(function (event) {
// 		var event = event || window.event;
// 		var className = event.target.className;
// 		if (className == 'multiSure') {
// 			// 操作此按钮时刷新缓存
// 			sessionStorage.setItem('cache', '1');
// 			if ($('.tableListCon').val() == 0) {
// 				threadAjaxData1.ajax.reload();
// 			} else if ($('.tableListCon').val() == 1) {
// 				thumbnailTable.ajax.reload();
// 			} else if ($('.tableListCon').val() == 2) {
// 				sudokuTable.ajax.reload();
// 			}
// 			return false;
// 		}		
// 	})
	//	地区(多选)、分类(多选)
	window.reloadData = function () {
		// 操作此按钮时刷新缓存
		sessionStorage.setItem('cache', '1');
		if ($('.tableListCon').val() == '0') {
			threadAjaxData1.ajax.reload();
		} else if ($('.tableListCon').val() == '1') {
			thumbnailTable.ajax.reload();
		} else if ($('.tableListCon').val() == '2') {
			sudokuTable.ajax.reload();
		}
		return false;
	};
//	点击时间段刷新列表
	$('#srceenTimeQuantumPro').click(function(){
		var ds = $(this).prev('h2').text();
		if(ds == '自定义'){
			return;
		}else{
			// 操作此按钮时刷新缓存
			sessionStorage.setItem('cache', '1');
			if($('.tableListCon').val() == 0){
				threadAjaxData1.ajax.reload();
			}else if($('.tableListCon').val() == 1){
				thumbnailTable.ajax.reload();
			}else if($('.tableListCon').val() == 2){
				sudokuTable.ajax.reload();
			}
		}
		
		return false;
	})
//	iSearch点击查询
	$('.customAddBtn').customInputClickBtn({
		'refreshTable':function(){
			// 操作此按钮时刷新缓存
			sessionStorage.setItem('cache', '1');
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
			$('.typeahead').remove();
		}
	})
	
//	机构来源获取与点击查询
	getSourcesData();
	
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
	
})

/**
 * 列表参数的获取
 */
function getParamsTable(aoData){
	
//	地区
	var regions = [];
	var regionsId = $('.srceenMap h2').attr('data-innerid');
	regions.push(regionsId);
//	分类
	var classifications = [];
	var classificationsId = $('.srceenClassification h2').attr('data-innerid');
	classifications.push(classificationsId);
	
//	机构来源
	var sourcesOrg = [];
	
	var plug ='';
	$('.accordion:first').find('.submenu li').each(function(index){
		if($(this).hasClass('active')){
			plug = $(this).find('a').attr('data-innerid');
		}
	})
	var sourcesOrgId = plug;
	
	sourcesOrg.push(sourcesOrgId);
	
//	爬取来源
	var sourcesCrawl = [];
	
	var plugCrawl = '';
	$('.webSources').find('.sourcesBox').each(function(){
		if($(this).hasClass('active')){
			plugCrawl = $(this).find('.link').attr('data-innerid');
		}
	})
	sourcesCrawl.push(plugCrawl);
	
//	是否相似
	var showSimilar = '';
	if($('.changeState').hasClass('activeBg')){
		showSimilar = new Boolean(false);
	}else{
		showSimilar = new Boolean(true);
	}
	
//	含图片、含视频
	var mediaStatus;
	$('.changeStateBtn').each(function(index){
		if($(this).hasClass('active')){
			if($(this).text() == '含图片'){
				mediaStatus = '2'
			}else{
				mediaStatus = '1'
			}
		}
	})
	
//	时间time 
	var startTime;
	var endTime;
	var timeQuantum = $.trim($('.srceenTimeQuantum').find('h2').attr('data-innerid'));
//	var timeCustom = $('#time-slice').val();
	var timeCustom = $.trim($('.srceenTimeQuantum').find('h2').text());
		
	
//	if(timeQuantum != ''){
//		
//		startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * timeQuantum)).toUTCString();
//		endTime = new Date().toUTCString();
//	}else{
//		if(timeCustom == ''){
//			startTime = '';
//			endTime = '';
//	    }else{
//		   startTime = new Date(timeCustom.substring(0,10).replace("-", "/").replace("-", "/")).toUTCString();
//		   endTime = new Date(new Date(timeCustom.substring(13).replace("-", "/").replace("-", "/")).getTime()+(1000 * 60 * 60 * 24)).toUTCString();
//	    }
//	}
	if(timeQuantum != ''){
		if(timeQuantum == '0'){
			startTime = new Date(timeCustom.substring(0,10)).toUTCString();
			endTime = new Date(new Date(timeCustom.substring(11)).getTime()+(1000 * 60 * 60 * 24)).toUTCString();
		}else{
			startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * timeQuantum)).toUTCString();
			endTime = new Date().toUTCString();
		}
	}else{
		startTime = '';
		endTime = '';
	}
	
	console.log('startTime:'+startTime);
	console.log('endTime:'+endTime);
	
	
//	查询iSearch
	var queryStr = [];
	var queryStrVal;
	if($('.searchWord').val() != ''){
		if($('.searchWord').attr('data-once') == 'true'){
			queryStrVal = $('.searchWord').val();
			$('.searchWord').attr('data-once','false');
		}else{
			queryStrVal = $.trim($('.customAddInput').val());
		}
	}else{
		queryStrVal = $.trim($('.customAddInput').val());
	}
	
	queryStr.push(queryStrVal);
	
	
	if(startTime != ''){
		aoData.push(
				{'name':'startTime','value':startTime},
				{'name':'endTime','value':endTime}
		)
	}
	var cache = sessionStorage.getItem('cache') || 0;
	if (cache == 1) {
		aoData.push({
			'name': 'cache',
			'value': cache
		})
	}else{
		aoData.push({
			'name': 'cache',
			'value': 0
		})
	}
	// 每次刷新完保存为已缓存状态
	sessionStorage.setItem('cache', '0');
	aoData.push(
			{'name':'regions','value':regions},
			{'name':'classifications','value':classifications},
			{'name':'sourcesOrg','value':sourcesOrg},
			{'name':'sourcesCrawl','value':sourcesCrawl},
			{'name':'showSimilar','value':showSimilar},
			{'name':'mediaStatus','value':mediaStatus},
			{'name':'queryStr','value':queryStr}
	)
	return aoData;
}


/**
 * 查询来源数据
 */

function getSourcesData(){		
	$.ajax({
        url : ctx+'/config/front/listUserConfigCarrierAndSource',//这个就是请求地址对应sAjaxSource
//        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	if(data.result == true){
        		var obj = data.resultObj;
        		
        		var content ='';
            	for(var count=0;obj.length>count;count++){
            		content += '<li><a href="#" data-innerid="'+obj[count].innerid+'">'+obj[count].name+'</a></li>'
            	}
            	$('#accordion .submenu').append(content);
            	
            	$('.accordion').each(function(index){
            		if(index==0){
            			var $this = $(this);
            			
            			$this.find('i.fold').click(function(){							
            				if($(this).hasClass('fold')){
            					$(this).attr('class','show fa fa-chevron-up')
                				$this.find('ul.submenu').css({
                					'display':'none'
                				})
            				}else{
            					$(this).attr('class','fold fa fa-chevron-down')
                				$this.find('ul.submenu').css({
                					'display':'block'
                				})
            				}
            				return false;
            			})
            			
            			$(this).find('li.open').click(function(){
            				$this.find('ul.submenu li').removeClass('active');
            				$('.webSources').find('li').removeClass('active');
							// 操作此按钮时刷新缓存
							sessionStorage.setItem('cache', '1');
							
            				if($('.tableListCon').val() == 0){
            					threadAjaxData1.ajax.reload();
            				}else if($('.tableListCon').val() == 1){
            					thumbnailTable.ajax.reload();
            				}else if($('.tableListCon').val() == 2){
            					sudokuTable.ajax.reload();
            				}
            				
            				return false;
            			})
            			$(this).find('ul.submenu li').click(function(){
            				if($(this).hasClass('active')){
            					$(this).removeClass('active');
            				}else{
            					$(this).addClass('active').siblings().removeClass('active');
                				$('.accordion').eq(1).find('li').removeClass('active');
            				}
            				// 操作此按钮时刷新缓存
            				sessionStorage.setItem('cache', '1');
            				if($('.tableListCon').val() == 0){
            					threadAjaxData1.ajax.reload();
            				}else if($('.tableListCon').val() == 1){
            					thumbnailTable.ajax.reload();
            				}else if($('.tableListCon').val() == 2){
            					sudokuTable.ajax.reload();
            				}
            				
            				return false;
            			})
            		}
            	})
        	}
        }
	})
}

/**
 * 来源下方的数据
 */
function getWebSourcesData(getAjaxUrl){
	$.ajax({
        url : getAjaxUrl,//这个就是请求地址对应sAjaxSource
//        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content ='';
            	
            	for(var count = 0;obj.length>count;count++){
            		content += '<li class="sourcesBox"><div class="link" data-innerid="'+obj[count].innerid+'">'+obj[count].name+'<span class="deleteSources">×</span> </div></li>';
            	}
//            	
            	$('.webSources').append(content);
            	
            //  侧边栏-来源删除的样式
            	$('.sourcesBox').each(function(){
            		var $this = $(this);
            		var timerEnter;
            		$this.mouseenter(function(){
            			timerEnter = setInterval(function(){
        					$this.find('span.deleteSources').animate({
                				'right':'0px'
                			})
            			},1000);
            		});
            		$this.mouseleave(function(){
            			clearInterval(timerEnter);
            			$this.find('span.deleteSources').animate({
            				'right':'-25px'
            			})
            		})
            	});
            	
            	$('.deleteSources').click(function(){
            		var innerid;
            		innerid = $(this).parent().attr('data-innerid');
            		
            		$.ajax({
				        url : ctx+'/custom/front/deleteUserWebsite/'+innerid,//这个就是请求地址对应sAjaxSource
//				        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
				        type : 'get',
				        dataType : 'json',
				        async : true,
				        success : function(data) {
				        	if(data.result == true){
				        		var obj = data.resultObj;
				        		
				        		if(obj == '成功'){
				        			$().toastmessage('showToast', {
				        				//提示信息的内容
				        		    	text: '删除成功',
				        				//是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
				        		   		sticky: false,
				        				//显示的位置，默认为右上角
				        		        position : 'bottom-right',
				        				//显示的状态。共notice, warning, error, success4种状态
				        		        type: 'success',
				        			});

    				        		$('.webSources .link').each(function(index){
        	            				if($(this).attr('data-innerid') == innerid){
        	            					$(this).parent('li').remove();
        	            				}
        	            			})
    				        	}
				        	}
				        }
					});
            		
            		/*$('#deletaSources').modal();
            		
            		$('#deletaSources').on('shown.bs.modal', function () {
            			$('.certainBtn').click(function(){
                			
                		});
        			})*/
            		
            		return false;
            	})
            	
            	//点击进行查询
            	$('.accordion').each(function(index){
    				if(index == 1){
    					$(this).find('li').click(function(){
    						if($(this).hasClass('active')){
    							$(this).removeClass('active');
    							$('.changeState').addClass('activeBg');
    						}else{
    							$(this).addClass('active').siblings().removeClass('active');
        						$('.accordion:first li').removeClass('active');
        						$('.changeState').removeClass('activeBg');
    						}
    						if($('.tableListCon').val() == 0){
    							threadAjaxData1.ajax.reload();
    						}else if($('.tableListCon').val() == 1){
    							thumbnailTable.ajax.reload();
    						}else if($('.tableListCon').val() == 2){
    							sudokuTable.ajax.reload();
    						}
    					})
    				}
    			})
        	}
        	
        }
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

//自定义时间
function selectTime(){
	var options = {
		'locale' : {
			format:'YYYY-MM-DD',
			applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            weekLabel: 'W',
            customRangeLabel: '自定义',	
            daysOfWeek:[ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames:[ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
		},
//		ranges : {
//            '最近一天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
//            '最近三天': [moment().subtract('days', 2), moment()],
//            '最近一周': [moment().subtract('days', 6), moment()],
//            '最近30天': [moment().subtract('days', 29), moment()],
//        },
//		'autoUpdateInput':false,
		'opens':'right',
		'separator':'至 ',
      
       "alwaysShowCalendars": true,
       
    };
//	$('.srceenTimeQuantum').daterangepicker({autoUpdateInput:false});
	$('.srceenTimeQuantum').daterangepicker(options, function(start, end, label) {
		console.log(start.format('YYYY/MM/DD')+'-'+end.format('YYYY/MM/DD'));
        
	});
	
//	时间选择框关闭时触发的条件
	$('.srceenTimeQuantum').on('hide.daterangepicker',function(ev, picker){
		
		$('.srceenTimeQuantum').find('h2').html(picker.startDate.format('YYYY/MM/DD')+'-'+picker.endDate.format('YYYY/MM/DD')+'<i class="fa fa-caret-down"></i>');
		// 操作此按钮时刷新缓存
		sessionStorage.setItem('cache', '1');
		if($('.tableListCon').val() == 0){
			threadAjaxData1.ajax.reload();
		}else if($('.tableListCon').val() == 1){
			thumbnailTable.ajax.reload();
		}else if($('.tableListCon').val() == 2){
			sudokuTable.ajax.reload();
		}
	});
}