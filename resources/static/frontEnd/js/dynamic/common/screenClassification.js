/**
 * 获取来源、地区、分类
 * @param getAjaxUrl  请求路径 例如：'/common/dic/front/listRegion'
 * @param boxClassName 地区、分类等的模块class值  例如：'.srceenMap'
 * @param ulClassName 当前模块ul的class值 例如：'#srceenMapPro'
 * inter  是否需要展示全部字段
 */
(function($){
	"use strict";
	
	$.fn.getData = function(options){
		var defaults = {
				getAjaxUrl:'',  //请求路径
				boxClassName:'',
				ulClassName:'',
				level:2, //是否展示二级菜单
				inter:true, //是否显示全部字段
				getAjaxUserConfigUrl: '', //请求用户配置项
				multiSelect: false, //是否多选，默认为单选
				callback:'' //回调函数
		};
		var options = $.extend(defaults,options);
		if(options.getAjaxUrl == ''){
			$().screenConditionFun({
				className:options.boxClassName,  
				idName:options.ulClassName,
				multiSelect: options.multiSelect,
			});
		}else{
			$.ajax({
		        url : options.getAjaxUrl,//这个就是请求地址对应sAjaxSource
		        data:{'level':options.level},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result == true){
		        		var obj = data.resultObj;
//	        			添加历史记录
	        			var historyCon = JSON.parse(localStorage.getItem('conditions'));
	        			var historyText = '';
	        			var historyId = '';
	        			for(var i=0;i<historyCon.length;i++){
	    					
	        				if(historyCon[i]['name'] == options.boxClassName.substring('1')){
	        					historyText = historyCon[i]['value'];
	        					historyId = historyCon[i]['id']
	        				}
	        			}
	        			
	        			if(historyText == ''){
	        				$(options.ulClassName).append('<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>');//添加历史记录
	        			}else{
	        				$(options.ulClassName).append('<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="'+historyId+'"><i class="fa fa-history historyIcon"></i><span class="historyFont">'+historyText+'</span></a></li>');//添加历史记录
	        			}

		        		if(options.inter == false){

		        		}else{
		        			$(options.ulClassName).append('<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>');

		        		}
		        		
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
//		            			var fenye= '<div class="fenleiBox"><nav aria-label="Page navigation"><div class="pagination pagination-sm"><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a><a href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></div></nav></div>';
		            			$(options.ulClassName).append(textCon);
		            			
		            		}
		        		}
		            	
		            	
		            	var lilen = $(options.ulClassName).find('li').length;
		            	if(lilen>16){
		            		
//		            		判读能否整除，将不能整除的部门用li补全
//		            		alert(lilen);
		            		var yushu = (lilen - 2)%14;
		            		if(yushu == 0){
		            			
		            		}else{
		            			var yushuBox = '';
		            			for(var i = 0;i<(14-yushu);i++){
		            				yushuBox += '<li class="hide zhanwei"></li>';
		            			}
		            			$(options.ulClassName).append(yushuBox);
		            		}
		            		
//		            		将第一页的之外的li隐藏
		            		$(options.ulClassName).find('li').each(function(index){
		            			if(index > 15){
		            				$(this).addClass('hide');
		            			}
		            		})
		            		
//		            		将分页的样式填入
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
		            		
		            		$(options.ulClassName).append(fenye);
		            		
//		            		计算二级页的高度
		            		var prosmoreHeight = 17 * 30 +4;
		            		
		            	}else{
		            		var prosmoreHeight = $(options.ulClassName).find('li').length * 30 +4;
		            	}
		            	
		            	$().screenConditionFun({
		    				className:options.boxClassName,  
		    				idName:options.ulClassName,
		    			});
		            	
		            	$(options.ulClassName).find('.prosmore').css({
		            		'height':prosmoreHeight+'px'
		            	})
		            	
		            	
		            	
		            	
		            	$('#srceenListPro').find('li').each(function(){
							if($(this).find('a').attr('data-innerid') == '77'){
								$(this).remove();
							}
						})
						
						
						if(typeof(options.callback) == 'function'){
							options.callback(obj);
						}
		        		
		        	}
		        	
		        },
		        error : function(msg) {
		        	
		        }
			});
		}
		
	};
	
	//地区、来源、分类下拉事件
	$.fn.screenConditionFun = function(options){
		var defaults = {
			className:'',  
			idName:'',
			fun:'',//回调函数
		};
		var options = $.extend(defaults,options);
		
		var $subblock = $(options.className), $head=$subblock.find('h2'), $ul = $(options.idName), $lis = $ul.find("li"), inter=$head.attr('data-inter');
		
		$head.click(function(e){
			e.stopPropagation();
			$('.prosul').css({
				'display':'none'
			})
			if(inter == false){
				$ul.hide();
			}else{
				$ul.show();
			}
			inter=!inter;
		});
		
		$ul.mouseleave(function(){
			$ul.hide();
			inter=!inter;
		})
		
		$ul.click(function(event){
			event.stopPropagation();
		});
		
		$(document).click(function(){
			$ul.hide();
			inter=!inter;
		});

		$lis.hover(function(){
			if(!$(this).hasClass('nochild')){
				$(this).addClass("prosahover");
				$(this).find(".prosmore").removeClass('hide')
					.find('.backshi').addClass('hide')
					.end()
					.find('span.xianItem').addClass('hide')
					.end()
					.find('span.xianCon').removeClass('hide');
				
			}
			
		},function(){
			if(!$(this).hasClass('nochild')){
				if($(this).hasClass("prosahover")){
					$(this).removeClass("prosahover");
				}
				$(this).find(".prosmore").addClass('hide');
			}
		});
		
		$lis.find('a').click(function(){
			var text = $(this).text() + '<i class="fa fa-caret-down"></i>';
			var innerid = $(this).attr('data-innerid');
			$head.html(text);

			if($(this).text() == '全部'){
				$head.attr('data-innerid','');
				$head.click();
			}else{
				$head.attr('data-innerid',innerid);

//				将选择的东西记录到localstorage中
				var localName = $subblock.attr('data-localname');
				var searchConditions = JSON.parse(localStorage.getItem('conditions'));
				for(var i=0;i<searchConditions.length;i++){

					if(searchConditions[i]['name'] == localName){
						searchConditions[i]['value'] = $(this).text();
						searchConditions[i]['id'] = innerid;
					}
				}
				localStorage.setItem('conditions',JSON.stringify(searchConditions));
//				将选择的东西记录到localstorage中 end

//				将选项放到history中
				$ul.find('.historyBox').removeClass('hide');
				$ul.find('.historyFont').html($(this).text()).parents('a').attr('data-innerid',innerid);

				if($(this).parents('span').hasClass('xianCon')){
					var $dom = $(this).parents('.prosmore');

					$dom.find('.backshi').removeClass('hide').html('< '+$(this).html());
					$dom.find('span.xianCon').addClass('hide');
					$dom.find('span.xianItem').each(function(){
						var $this = $(this);
						if($(this).find('a').attr('data-parentid') == innerid){
							$this.removeClass('hide');
						}
					})

				}else{
					$head.click();
				}
			}
//			$head.click();
			inter=!inter;
		})
		
		$lis.find('.backshi').click(function(){
			$(this).addClass('hide').parents('.prosmore')
				.find('span.xianItem').addClass('hide')
				.end()
				.find('span.xianCon').removeClass('hide');
		})
		
//		下拉列表中的分页操作
		$ul.find('.fenleiBox').find('a').click(function(){
			var aval = $(this).text();
			$ul.find('.fenleiBox').find('a').removeClass('active');
			$(this).addClass('active');
			
			if(aval == '1' || $(this).attr('aria-label') == 'Previous'){
				$ul.find('li').each(function(index){
					if(index > 1 && index < 16){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
				$ul.find('.fenleiBox').find('a').eq(1).addClass('active');
			}else if(aval == '2'){
				$ul.find('li').each(function(index){
					if( 16 <= index && index < 30){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
			}else if(aval == '3' || $(this).attr('aria-label') == 'Next'){
				$ul.find('li').each(function(index){
					if( 30 <= index && index < 44){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
				$ul.find('.fenleiBox').find('a').eq(3).addClass('active');
			}
			$ul.find('li').eq(0).removeClass('hide');
			$ul.find('li').eq(1).removeClass('hide');
		})
		
//		自定义时间
		$ul.find('.customTime').click(function(){
//			alert(1);
			$('.srceenTimeQuantum').click();
		})
	};
	
//	enter点击进入
	$.fn.enterPress = function(options){
		$(document).keydown(function(event){ 
			var e = event || window.event; 
			var k = e.keyCode || e.which; 
			if(k == 13){
				if($('.customAddInput').is(":focus")==true){
					if($('.typeahead').css('display') == 'block'){
						$('.typeahead').find('li').each(function(){
							if($(this).hasClass('active')){
								$('.customAddInput').val($('.typeahead').find('li.active').text());
							}
						})
						
					}
					$('.customAddBtn').click();
				}
			}
		});
	};
	
//	点击iSearch按钮
	$.fn.customInputClickBtn = function(options){
		var defaults = {
			refreshTable:'',//需要刷新的表格
			callBack:'' //刷新的列表
		};
		var options = $.extend(defaults,options);
		var $this = $(this),
			customAddVal= [];
		
		$this.click(function(){
			if(typeof(options.refreshTable) == 'function'){
				options.refreshTable();
			}
			
			$('.customAddInput').typeahead('destroy');
			
			if(localStorage.getItem('isearch') == null){
				customAddVal = [];
			}else{
				customAddVal = JSON.parse(localStorage.getItem('isearch'));
			}
			if (localStorage.pagecount){
			    localStorage.pagecount=Number(localStorage.pagecount) +1;
			}else{
			    localStorage.pagecount=1;
			}
//			输入的内容与localStorage里的内容做判重
			var inter = 0;
			for(var i = 0;customAddVal.length>i;i++){
				if(customAddVal[i].name == $('.customAddInput').val()){
					++inter;
				}
			}
			if(inter == 0){
				customAddVal.unshift(
						 {'id':localStorage.pagecount,'name':$('.customAddInput').val()}
				)
				localStorage.setItem("isearch",JSON.stringify(customAddVal));
			}
			$('.customAddInput').blur();
			
			
			$(".customAddInput").parseLocalArrayData({
				'dataSources':customAddVal,
				'afterSelect':function(){
					if(typeof(options.refreshTable) == 'function'){
						options.refreshTable();
					}
				}
			});
			
			if(typeof(options.callBack) == 'function'){
				options.callBack(customAddVal);
			}
		})
		
	};
	
})(jQuery);

$(function(){
//	时间段
//	$().getData({
//		boxClassName:'.srceenTimeQuantum',
//		ulClassName:'#srceenTimeQuantumPro',
//	})
////	来源
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listSourceOrg',  //请求路径
//		boxClassName:'.srceenSources',
//		ulClassName:'#srceenSourcesPro',
//	})
////	地区
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRegion',  //请求路径
//		boxClassName:'.srceenMap',
//		ulClassName:'#srceenMapPro',
//	})
//	
////	分类
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',  //请求路径
//		boxClassName:'.srceenClassification',
//		ulClassName:'#srceenClassificationPro',
//	})
////	标签
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listNewsLabel',  //请求路径
//		boxClassName:'.srceenTag',
//		ulClassName:'#srceenTagPro',
//	})
////	榜单
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingType',  //请求路径
//		boxClassName:'.srceenList',
//		ulClassName:'#srceenListPro',
//		inter:false
//	})
////	榜单周期
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingCycle',  //请求路径
//		boxClassName:'.srceenListPeriod',
//		ulClassName:'#srceenListPeriodPro',
//	})
////	筛选条数
//	$().getData({
//		boxClassName:'.srceenBranches',
//		ulClassName:'#srceenBranchesPro',
//	})
////	首页-热点发现时间
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/getClusterFre',  //请求路径
//		boxClassName:'.srceenClusterFre',
//		ulClassName:'#srceenClusterFrePro',
//		inter:false
//	})
////	首页-新闻线索分类
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',  //请求路径
//		boxClassName:'.threadSrceenClassification',
//		ulClassName:'#threadSrceenClassificationPro',
//	})
////	首页-网站排行-新闻
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listWebs',  //请求路径
//		boxClassName:'.srceenWeb',
//		ulClassName:'#srceenWebPro',
//		inter:false
//	})
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listWebs',  //请求路径
//		boxClassName:'.srceenWeb2',
//		ulClassName:'#srceenWeb2Pro',
//		inter:false
//	})
////	首页-网站排行-点击榜
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingType',  //请求路径
//		boxClassName:'.srceenList1',
//		ulClassName:'#srceenList1Pro',
//		inter:false
//	})
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingType',  //请求路径
//		boxClassName:'.srceenList2',
//		ulClassName:'#srceenList2Pro',
//		inter:false
//	})
////	首页-网站排行-时间
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingCycle',  //请求路径
//		boxClassName:'.srceenListPeriod1',
//		ulClassName:'#srceenListPeriod1Pro',
//		inter:false
//	})
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listRankingCycle',  //请求路径
//		boxClassName:'.srceenListPeriod2',
//		ulClassName:'#srceenListPeriod2Pro',
//		inter:false
//	})
	
	$().enterPress();
	

});

//时间段，自定义时间
function selectTimeDY(){
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
		'autoUpdateInput':false,
		'opens':'left',
		'separator':'至 ',
      
       "alwaysShowCalendars": true,
       
    };
	$('.srceenTimeQuantum').daterangepicker({autoUpdateInput:false});
	$('.srceenTimeQuantum').daterangepicker(options, function(start, end, label) {
		$('#beginTime').val(start.format('YYYY-MM-DD'));
        $('#endTime').val(end.format('YYYY-MM-DD'));
        
	});
	
//	时间选择框关闭时触发的条件
	$('#time-slice').on('hide.daterangepicker',function(ev, picker){
		
		if($('#time-slice').val() == ''){
			
		}else{
			$('.srceenTimeQuantum').find('h2').attr('data-innerid','').html('全部 <i class="fa fa-caret-down"></i>');
			
			if($('.tableListCon').val() == 0){
				threadAjaxData1.ajax.reload();
			}else if($('.tableListCon').val() == 1){
				thumbnailTable.ajax.reload();
			}else if($('.tableListCon').val() == 2){
				sudokuTable.ajax.reload();
			}
		}
	});
}
