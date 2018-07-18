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
				inter: true, //是否显示全部字段
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
						var obj = data.resultObj || [];						
						if (options.getAjaxUserConfigUrl != '' && options.multiSelect) {
							// 获取用户定制的地区和分类数据
							$.ajax({
								url: options.getAjaxUserConfigUrl, //这个就是请求用户配置的数据
								data: {
									'level': options.level
								},
								type: 'get',
								dataType: 'json',
								async: true,
								success: function (response) {
									var selectObj = response.resultObj || [];
									obj.forEach(function (item, index) {
										item.isSelected = false;
										for (var k = 0; k < selectObj.length; k++) {
											if (item.innerid == selectObj[k].innerid) {
												item.isSelected = true;
											}
										}
									});
									conditionsHandler(options, obj);
								}
							});
						}else{
							conditionsHandler(options, obj);
						}	        			
		        	}		        	
		        },
		        error : function(msg) {
		        	
		        }
			});
		}
		
	};
	
	// 将生成下拉列表部分的代码单独取出
	function conditionsHandler(options, obj) {
		// 添加历史记录（历史记录暂时移除）
		// var historyCon = JSON.parse(localStorage.getItem('conditions'));
		// var historyText = '';
		// var historyId = '';
		// for (var i = 0; i < historyCon.length; i++) {
		// 	if (historyCon[i]['name'] == options.boxClassName.substring('1')) {
		// 		historyText = historyCon[i]['value'];
		// 		historyId = historyCon[i]['id']
		// 	}
		// }

		// if (historyText == '') {
		// 	$(options.ulClassName).append('<li class="hide historyBox"><a class="ti" href="javascript:void(0);"><i class="fa fa-history historyIcon"></i><span class="historyFont"></span></a></li>'); //添加历史记录
		// } else {
		// 	$(options.ulClassName).append('<li class="historyBox"><a class="ti" href="javascript:void(0);" data-innerid="' + historyId + '"><i class="fa fa-history historyIcon"></i><span class="historyFont">' + historyText + '</span></a></li>'); //添加历史记录
		// }

		if (options.inter) {
			$(options.ulClassName).append('<li class=""><a class="ti" href="javascript:void(0);">全部</a></li>');
		}
		// 将选中项的内容存起来
		var selectValues = [], selectinnerIds = [];
		for (var count = 0; obj.length > count; count++) {
			if (!obj[count].isSelected) {
				obj[count].isSelected = false;
			}
			if (obj[count].parentId == '0') {
				var regionSecondItem = [];
				var regionFirstName = obj[count].innerid;
				for (var plug = 0; plug < obj.length; plug++) {
					if (regionFirstName == obj[plug].parentId) {
						regionSecondItem.push(obj[plug]);
					}
				}
				var textCon;				
				if (regionSecondItem.length == 0) {
					textCon = '<li class=""><a class="ti" data-innerid="' + obj[count].innerid + '" href="javascript:void(0);">' + obj[count].name ;
					// 给省份选中状态加勾选效果
					if (obj[count].isSelected) {
						textCon += '<i class="glyphicon glyphicon-ok"></i>';
						selectValues.push(obj[count].name);
						selectinnerIds.push(obj[count].innerid);
					}
					textCon += '</a></li>';
				} else {
					var secondItem = '<div class="prosmore hide">';
					secondItem += '<div class="backshi hide"><a href="javascript:void(0)"></a></div>';
					if (obj[count].innerid == '320000') {
						for (var num = 0; num < regionSecondItem.length; num++) {
							secondItem += '<span class="xianCon"><em><a href="javascript:void(0);"   data-innerid="' + regionSecondItem[num].innerid + '">' + regionSecondItem[num].name + '</a></em></span>';
							var regionThreeItem = [];
							for (var plugThree = 0; plugThree < obj.length; plugThree++) {
								if (regionSecondItem[num].innerid == obj[plugThree].parentId) {
									regionThreeItem.push(obj[plugThree]);
								}
							}
							if (regionThreeItem.length == 0) {

							} else {
								for (var i = 0; i < regionThreeItem.length; i++) {
									secondItem += '<span class="xianItem hide"><em><a href="javascript:void(0);" data-parentid="' + regionThreeItem[i].parentId + '"   data-innerid="' + regionThreeItem[i].innerid + '">' + regionThreeItem[i].name + '</a></em></span>';
									// 此此处理二级内容选中的情况
								}
							}
						}
					} else {
						for (var num = 0; num < regionSecondItem.length; num++) {
							secondItem += '<span><em><a href="javascript:void(0);"   data-innerid="' + regionSecondItem[num].innerid + '">' + regionSecondItem[num].name + '</a></em></span>';
							// 此此处理二级内容选中的情况
						}
					}
					secondItem += '</div>';
					textCon = '<li class=""><a class="ti" href="javascript:void(0);" data-innerid="' + obj[count].innerid + '">' + obj[count].name + '<i class="fa fa-caret-right"></i></a>' + secondItem + '</li>';
				}
				//	var fenye= '<div class="fenleiBox"><nav aria-label="Page navigation"><div class="pagination pagination-sm"><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a><a href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></div></nav></div>';
				$(options.ulClassName).append(textCon);
			}
		}
		// 如果是多选，将多选标识置为true，默认为false
		if(options.multiSelect){
			$(options.boxClassName).find('h2').attr('data-multi', true);
			
		}
		// 将选中的内容保存起来
		if (selectinnerIds.length > 0) {
			$(options.boxClassName).find('h2').attr('data-selectValue', selectValues.join('、'));
			var textShow = selectValues.join('、') + '<i class="fa fa-caret-down"></i>';
			$(options.boxClassName).find('h2').html(textShow);
			$(options.boxClassName).find('h2').attr('data-innerId', selectinnerIds.join(','));
			// 将默认的选中项保存起来，以备取消操作的时候使用
			$(options.boxClassName).find('h2').attr('data-old', selectinnerIds.join(','));

			// 鼠标hover效果
			$(options.boxClassName).find('h2').attr('data-content', selectValues.join('、'));
			// 重新渲染事件
			$(options.boxClassName).find('h2').popover({
				trigger: 'hover', //触发方式
				placement: 'top', //弹窗显示方向
				html: true, // 为true的话，data-content里就能放html代码了
				content: "", //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
			});
		}

		

		var lilen = $(options.ulClassName).find('li').length;
		// 计算二级页的高度
		var prosmoreHeight = 0;
		// 分页：每页16条数据
		if (lilen > 16) {
			// 判读能否整除，将不能整除的部门用li补全(空白li占位)
			// alert(lilen);
			var yushu = lilen % 16;
			if (yushu == 0) {

			} else {
				var yushuBox = '';
				for (var i = 0; i < (16 - yushu); i++) {
					yushuBox += '<li class="hide zhanwei"></li>';
				}
				$(options.ulClassName).append(yushuBox);
			}

			//将第一页的之外的li隐藏(每页16条数据)
			$(options.ulClassName).find('li').each(function (index) {
				if (index > 15) {
					$(this).addClass('hide');
				}
			})

			//将分页的样式填入
			var num = Math.ceil(lilen / 16);
			var fenye = '<div class="fenleiBox"><nav aria-label="Page navigation"><div class="pagination pagination-sm">';
			fenye += '<a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a>';
			for (var i = 0; i < num; i++) {
				if (i == 0) {
					fenye += '<a href="#" class="active">' + (i + 1) + '</a>';
				} else {
					fenye += '<a href="#">' + (i + 1) + '</a>';
				}
			}
			fenye += '<a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></div></nav></div>';
			$(options.ulClassName).append(fenye);
			prosmoreHeight = 16 * 30 + 4;

			// 将多选确定按钮加入
			if(options.multiSelect){
				var multiButton = '<div class="multiButton"><div class="multiSure">确定</div><div class="multiCancel">取消</div></div>';
				$(options.ulClassName).append(multiButton);
				prosmoreHeight = 17 * 30 + 4;
			} 						
		} else {
			prosmoreHeight = $(options.ulClassName).find('li').length * 30 + 4;
			if (options.multiSelect) {
				// 加一个空白隐藏的标签
				$(options.ulClassName).append('<div class="fenleiBox" style="display:none;"><nav aria-label="Page navigation"><div class="pagination pagination-sm"></div></nav></div>');
				var multiButton = '<div class="multiButton"><div class="multiSure">确定</div><div class="multiCancel">取消</div></div>';
				$(options.ulClassName).append(multiButton);
				prosmoreHeight = $(options.ulClassName).find('li').length * 30 + 4 + 30;
			}
		}

		$().screenConditionFun({
			className: options.boxClassName,
			idName: options.ulClassName,
			multiSelect: options.multiSelect,
		});
		$(options.ulClassName).find('.prosmore').css({
			'height': prosmoreHeight + 'px'
		})
		$('#srceenListPro').find('li').each(function () {
			if ($(this).find('a').attr('data-innerid') == '77') {
				$(this).remove();
			}
		})
		if (typeof (options.callback) == 'function') {
			options.callback(obj);
		}
	}

	//地区、来源、分类下拉事件
	$.fn.screenConditionFun = function(options){
		var defaults = {
			className:'',  
			idName:'',
			fun:'',
			multiSelect: false,
		};
		var options = $.extend(defaults,options);		
		var $subblock = $(options.className),
			$head = $subblock.find('h2'),
			$ul = $(options.idName),
			$lis = $ul.find("li"),
			$multiCancel = $ul.find('.multiButton').find('.multiCancel'),
			inter = $head.attr('data-inter');
				
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
			var multi = $head.attr('data-multi');
			var text = $(this).text() + '<i class="fa fa-caret-down"></i>';
			var innerid = $(this).attr('data-innerid');
			// 单选的情况
			if (!multi) {
				$head.html(text);
			}		
			if($(this).text() == '全部'){
				$head.attr('data-innerid','');
				// 多选选择全部时将data-selectValue的内容置为空, 同时将所有选项处于选中状态
				if (multi) {
					$head.attr('data-selectValue', '');
					// 添加一个标识，特殊处理选择全部的情形
					$head.attr('data-selectAll', true);
					// 同时将所有一级选项及二级分类处于选中状态
					var listLi = $(this).parent().siblings();
					// 删除最后两项元素
					var $liLists = listLi.slice(0, listLi.length - 2);
					var value = '';
					$.each($liLists, function (index, item) {
						value = $(this).find('a').text() + '<i class="glyphicon glyphicon-ok"></i>';
						$(this).find('a').html(value);
					});
					var textShow = '全部' + '<i class="fa fa-caret-down"></i>';
					$head.attr('data-content', '全部');
					$head.html(textShow);
				}						
			}else{
				// 单选的情况
				if (!multi) {
					$head.attr('data-innerid', innerid);
				}else{					
					// 添加选中的参数
					var inneridList = [];
					if ($head.attr('data-innerid').length>0) {
						var inners = $head.attr('data-innerid');
						inneridList = inners.split(',');
					}
					var listLi = $(this).parent().siblings();
					var $liLists = listLi.slice(0, listLi.length - 2);
					var listObj = {};
					// 生成key与value的对象组备用
					$.each($liLists, function (index, item) {
						listObj[$(this).find('a').attr('data-innerid')] = $(this).find('a').text();
					});
					// 生成的对象组中未包含自身，需单独加入
					listObj[$(this).attr('data-innerid')] = $(this).text();
					// 如果之前已选择全部，此时inneridList应该是含所有的内容
					if ($head.attr('data-selectAll')) {
						for (var key in listObj) {
							// 过滤掉全部对应的key值 
							if( typeof(key) != 'undefined' && key != 'undefined'){
								inneridList.push(key);
							}
						}
					}
					// 将原数组克隆保存
					var selectInnerIds = inneridList.concat();
					var selectValues = [];
					// 处理多选情况下的选中情况
					if (selectInnerIds.indexOf(innerid) != -1) {
						selectInnerIds.removeItem(innerid);						
						// 同时将选中的状态移除
						$(this).html(listObj[innerid]);
					}else{
						selectInnerIds.push(innerid);
						// 同时将选中状态添加上
						$(this).html(listObj[innerid] + '<i class="glyphicon glyphicon-ok"></i>');
					}
					// 全部都没有的情况
					if (selectInnerIds.length>0) {
						$head.attr('data-innerid', selectInnerIds.join(','));
					}else{
						$head.attr('data-innerid', '');
					}
					
					// 处理多选情况下的文字显示情况					
					selectInnerIds.forEach(function (item) {
						selectValues.push(listObj[item]);
					})					
					if (selectValues.length >0) {
						$head.attr('data-selectValue', selectValues.join('、'));
						var textShow = selectValues.join('、') + '<i class="fa fa-caret-down"></i>';
						$head.html(textShow);						
					}else{
						// 特殊情形：选择了全部之后，再点击选单个元素
						$head.attr('data-selectValue', '');
						var textShow = '地区' + '<i class="fa fa-caret-down"></i>';
						$head.html(textShow);
					}
					if (selectValues.length >6) {
						selectValues = selectValues.slice(0, 5);
						selectValues.push('...');
					}
					$head.attr('data-content', selectValues.join('、'));					
				}
								
//				将选择的东西记录到localstorage中
				// var localName = $subblock.attr('data-localname');
				// var searchConditions = JSON.parse(localStorage.getItem('conditions'));
				// for(var i=0;i<searchConditions.length;i++){
						
				// 	if(searchConditions[i]['name'] == localName){
				// 		searchConditions[i]['value'] = $(this).text();
				// 		searchConditions[i]['id'] = innerid;
				// 	}
				// }
				// localStorage.setItem('conditions',JSON.stringify(searchConditions));
//				将选择的东西记录到localstorage中 end
				
//				将选项放到history中
				// $ul.find('.historyBox').removeClass('hide');
				// $ul.find('.historyFont').html($(this).text()).parents('a').attr('data-innerid',innerid);
				
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
					// 此操作用于隐藏列表
					// $head.click();
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
		
		// 下拉列表中的分页操作
		$ul.find('.fenleiBox').find('a').click(function(){
			var aval = $(this).text();
			$ul.find('.fenleiBox').find('a').removeClass('active');
			$(this).addClass('active');
			// 每页16条，首页要除去全部
			if(aval == '1' || $(this).attr('aria-label') == 'Previous'){
				$ul.find('li').each(function(index){
					if(index >= 1 && index < 16){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
				$ul.find('.fenleiBox').find('a').eq(1).addClass('active');
			}else if(aval == '2'){
				$ul.find('li').each(function(index){
					if( 16 <= index && index < 31){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
			}else if(aval == '3' || $(this).attr('aria-label') == 'Next'){
				$ul.find('li').each(function(index){
					if( 31 <= index && index < 46){
						$(this).removeClass('hide');
					}else{
						$(this).addClass('hide');
					}
				})
				$ul.find('.fenleiBox').find('a').eq(3).addClass('active');
			}
			// 0表示是全部，第二页及后面的分页仍需要显示
			$ul.find('li').eq(0).removeClass('hide');
			// $ul.find('li').eq(1).removeClass('hide');
		})

		// 取消操作
		$multiCancel.click(function(event) {			
			var multi = $head.attr('data-multi');
			if (multi) {
				var listLi = $(this).parent().siblings();
				var $liLists = listLi.slice(0, listLi.length - 1);
				var listObj = {};
				// 默认选中的参数
				var defaultInnerIds = [];
				var defaultValues = [];
				if ($head.attr('data-old').length > 0) {
					var inners = $head.attr('data-old');
					defaultInnerIds = inners.split(',');
				}
				// 生成key与value的对象组备用
				var innerid = '', value = '';
				$.each($liLists, function (index, item) {
					innerid = $(this).find('a').attr('data-innerid');
					value = $(this).find('a').text();
					if (defaultInnerIds.indexOf(innerid) != -1) {
						defaultValues.push(value);
						$(this).find('a').html(value + '<i class="glyphicon glyphicon-ok"></i>');
					}else{
						$(this).find('a').html(value);
					}
				});
				// 回显
				if (defaultValues.length >0) {
					$head.attr('data-innerid', defaultInnerIds.join(','));
					$head.attr('data-selectValue', defaultValues.join('、'));
					var textShow = defaultValues.join('、') + '<i class="fa fa-caret-down"></i>';
					$head.html(textShow);
				}else{
					$head.attr('data-selectValue', '');
					var textShow = '地区' + '<i class="fa fa-caret-down"></i>';
					$head.html(textShow);
				}
				
				
			}
			
		});
	};
//	enter点击进入
	$.fn.enterPress = function(options){
		$(document).keydown(function(event){ 
			var e = event || window.event; 
			var k = e.keyCode || e.which; 
			if(k == 13){
				if($('.customAddInput').is(":focus")==true){
					if($('.typeahead').css('display') == 'block'){
						$('.customAddInput').val($('.typeahead').find('li.active').text());
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
	
	Array.prototype.indexOf = function (val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.removeItem = function (val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};


})(jQuery);

$(function(){
	
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
//		level:1
//	})
//	
////	分类
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',  //请求路径
//		boxClassName:'.srceenClassification',
//		ulClassName:'#srceenClassificationPro',
//		level:1
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
//	
////	热点发现中-微博微信
//	$().getData({
//		getAjaxUrl:ctx+'/common/dic/front/listcarrier',  //请求路径
//		boxClassName:'.srceenMediaAlone',
//		ulClassName:'#srceenMediaAlonePro',
//		level:1,
//		inter:false
//	})
	
	$().enterPress();
});
