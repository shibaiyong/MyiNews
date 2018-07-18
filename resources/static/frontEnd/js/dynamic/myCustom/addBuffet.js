var threadAjaxData1,
    thumbnailTable,
    sudokuTable,
    highlightList = [],
    batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = [], //当前页面中显示的列表的webpageCode
    ajaxUrl = '';
$(function(){
	
//	点击刷新，每60秒刷新
	refreshButton();
//	判断是否是微博微信展示不同的编辑页
	$('#otheraccordion').find('li').each(function(){
		var $this = $(this);
		if($this.hasClass('open')){
			if($this.hasClass('addWeChat')){
				$('.recommend-title-right').find('.editOther').click(function(){
					$('#myCustomContent').loadPage(ctx+'/custom/front/gotoWeChat');
				})
				
				ajaxUrl = ctx+'/custom/front/getMyCustomWechat';
			}else if($this.hasClass('addMicroblogs')){
				$('.recommend-title-right').find('.editOther').click(function(){
					$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMicroblogs');
				})
				
				ajaxUrl = ctx+'/custom/front/getMyCustomMicroblog';
			}
		}
	})
	
	$('.srceenSources').removeClass('hide');
	$('.srceenMap').removeClass('hide');
    $('.srceenClassification').removeClass('hide');
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
	
//	来源
	$().getData({
		getAjaxUrl:ctx+'/common/dic/front/listSourceOrgOnly',  //请求路径
		boxClassName:'.srceenSources',
		ulClassName:'#srceenSourcesPro',
	})
//	地区
	$().getData({
		getAjaxUrl:ctx+'/common/dic/front/listRegion',  //请求路径
		boxClassName:'.srceenMap',
		ulClassName:'#srceenMapPro',
	})
	
//	分类
	$().getData({
		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',  //请求路径
		boxClassName:'.srceenClassification',
		ulClassName:'#srceenClassificationPro',
	})
	
//	显示线索的标题
	var title = '';
	var dataCustomgroup = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			
			dataCustomgroup = $(this).find('.link').attr('data-customgroup');
			title = $.trim($(this).find('.link span').text().substring(0,2));
			
			$('.recommend-title h4').text('我关注的'+title+'文章').attr('data-customgroup',dataCustomgroup);
			$('.editOther').find('button').html('<i class="fa fa-plus"></i>&nbsp;添加'+title+'账号');
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
						'requestUrl':ajaxUrl,
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
						'requestUrl':ajaxUrl,
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
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':2},  //传递参数
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
		'requestUrl':ajaxUrl,
		'getPassValue':getParamsTable
	});
	

//	获得ajax返回的获取
	$('.dataConBoxTable').on('xhr.dt', function ( e, settings, json, xhr ) {
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
			}
		});
		
//		相似相关获取
		var textArr = threadAjaxData1.column(5).nodes().data();
		tableItemWebPageCodeArr =[];
		if(textArr.length > 0){
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
							'dataParam':{'webpageCode':webpageCode,'type':2}
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
							'dataParam':{'webpageCode':webpageCode,'type':2}
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
	
//	点击地区刷新列表
	$('#srceenMapPro').click(function(){
		
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
	$('#srceenClassificationPro').click(function(){
		
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
	
	$('#srceenSourcesPro').click(function(){
		
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
//		    	    	模态框点击失败
			$('.cancel').click(function(){
				$('#deleteAll').modal('hide');
			})
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
	var regionsId = $('.srceenMap h2').attr('data-innerid');
	regions.push(regionsId);
	
//	分类
	var classifications = [];
	var classificationsId = $('.srceenClassification h2').attr('data-innerid');
	classifications.push(classificationsId);
	
//	来源
	var sourcesOrg = [];
	var sourcesOrgId = $('.srceenSources h2').attr('data-innerid');
	sourcesOrg.push(sourcesOrgId);
	
	
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
	
//	查询iSearch
	var queryStr = [];
	var queryStrVal = $.trim($('.customAddInput').val());
	queryStr.push(queryStrVal);
	
	aoData.push(
		{'name':'regions','value':regions},
		{'name':'classifications','value':classifications},
		{'name':'sourcesOrg','value':sourcesOrg},
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
		if($(this).hasClass('fa-spin')){
			$(this).removeClass('fa-spin');
			clearInterval(init);
		}else{
			$(this).addClass('fa-spin');
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