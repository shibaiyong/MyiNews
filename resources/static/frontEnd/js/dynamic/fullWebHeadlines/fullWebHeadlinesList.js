var threadAjaxData1,
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
	tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function(){
	/* 头部导航高亮 */
    $().showHeader();
	footerPutBottom();
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
//	批量收藏
	$('.table-operation-status a').eq(2).click(function(){
		$(this).batchCollect({
			dataUrl:ctx+'/latest/front/collectingAllNews', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':4},  //传递参数
			callback:function(data){
				console.log(data);
	    		if(data.result){
	    			var obj = data.resultObj;
	    			for(var key in obj){
	        			if(obj[key]){
	        				for(var j = 0;tableItemWebPageCodeArr.length>j;j++){
	        					if(key == tableItemWebPageCodeArr[j]){
	        						$('.inewsOperation').eq(j).find('i:first').attr('class','fa fa-heart active');
	        						$('.dataConBoxTable').find('span.check-child').eq(j).removeClass('checked');
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
					
					threadAjaxData1.ajax.reload();
				}
				
			}
		})
	})
	
	//表格进行数据传值
	threadAjaxData1 = $().threadAjaxData({
		'requestUrl':ctx+'/latest/front/getTopNewsMore',
		'getPassValue':getParamsTable
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
		
//		点击翻页页面自动移动到上方
		$('.paginate_button').each(function(){
			$(this).click(function(){
				$(this).scrollOffset({
					'scrollPos':115
				});
			})
		})
		
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
			// $().adraticAjaxData({
			// 	'dataUrl':ctx+'/latest/front/getSameNewsNum',
			// 	'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
			// 	'callback':function(data){
			// 		$('.dataConBoxTable tbody').find('[class*="sameNum"]').each(function(index){
			// 			$(this).text(data[index]);
			// 		})
			// 	}
			// });
			
//			相关
// 			$().adraticAjaxData({
// 				'dataUrl':ctx+'/latest/front/getRelevantNewsNum',
// 				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
// 				'callback':function(data){
// 					$('.dataConBoxTable tbody').find('[class*="relevantNum"]').each(function(index){
// 						$(this).text(data[index]);
// 					})
// 				}
// 			});
			
//			负面指数
// 			$().adraticAjaxData({
// 				'dataUrl':ctx+'/latest/front/getsentimentindex',
// 				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
// 				'callback':function(data){
// 					console.log(data);
// 					$('.dataConBoxTable tbody').find('[class*="negativeNum"]').each(function(index){
// 						if(data[index].negative != null && data[index].negative != ''){
// 							var colorStyle = ''
// 							// if(data[index].negative > 60){
// 							// 	colorStyle = 'red'
// 							// }else
// 							if(data[index].negative > 40){
// 								colorStyle = 'gray'
// 							}else{
// 								colorStyle = 'green'
// 							}
//                             var negative=data[index].negative;
//                             if(negative>40){
//                                 $(this).text('-'+negative.toFixed(2));
//                             }else{
//                                 $(this).text((100-negative).toFixed(2));
//                             }
// 							//$(this).text(data[index].negative+'%');
// 							$(this).addClass(colorStyle);
// 						}else{
// 							$(this).text('-');
// 						}
//
// 					})
// 				}
// 			});
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
				console.log('ahahahahh');
				$(this).find('span').eq(1).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'releaseDatetime': releaseDateTimeArr[index],
					'buildingCon':function(_$this){
						_$this.find('i').addClass('hide');
        				_$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
        			},
        			'buildedCon':function(_$this){
//        				_$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
//        				$("[data-toggle='tooltip']").tooltip();
                        threadAjaxData1.ajax.reload();
        			}
				})
			})
//			建、采
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getDraftType',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data,con){
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
})

/**
 * 列表参数的获取
 */
function getParamsTable(aoData){
	
	var source = parseInt($('.source').val());
	console.log(source);
	aoData.push(
			{'name':'source','value':source}
	)
	return aoData;
}