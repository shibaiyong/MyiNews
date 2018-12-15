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
				level:3, //是否展示二级菜单
				inter:true, //是否显示全部字段
				getAjaxUserConfigUrl: '', //请求用户配置项
				multiSelect: false, //是否多选，默认为单选
				conditionValue: '',
				callback:'' //回调函数
		};
		var options = $.extend(defaults,options);
		if(options.getAjaxUrl == ''){
			screenConditionHandler({
				className:options.boxClassName,  
				idName:options.ulClassName,
				multiSelect: options.multiSelect,
				callback: options.callback,
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
								type: 'get',
								dataType: 'json',
								async: true,
								success: function (response) {
									var selectObj = response.resultObj || [];									
									conditionsHandler(options, obj, selectObj);
								}
							});
						} else {
							conditionsHandler(options, obj, []);
						}
		        	}		        	
		        },
		        error : function(msg) {
		        	
		        }
			});
		}
		
	};	

	//	enter点击进入
	$.fn.enterPress = function (options) {
		$(document).keydown(function (event) {
			var e = event || window.event;
			var k = e.keyCode || e.which;
			if (k == 13) {
				if ($('.customAddInput').is(":focus") == true) {
					if ($('.typeahead').css('display') == 'block') {
						$('.customAddInput').val($('.typeahead').find('li.active').text());
					}
					$('.customAddBtn').click();
				}
			}
		});
	};
	// 点击iSearch按钮
	$.fn.customInputClickBtn = function (options) {
		var defaults = {
			refreshTable: '', //需要刷新的表格
			callBack: '' //刷新的列表
		};
		var options = $.extend(defaults, options);
		var $this = $(this),
			customAddVal = [];

		$this.click(function () {
			if (typeof (options.refreshTable) == 'function') {
				options.refreshTable();
			}

			$('.customAddInput').typeahead('destroy');

			if (localStorage.getItem('isearch') == null) {
				customAddVal = [];
			} else {
				customAddVal = JSON.parse(localStorage.getItem('isearch'));
			}
			if (localStorage.pagecount) {
				localStorage.pagecount = Number(localStorage.pagecount) + 1;
			} else {
				localStorage.pagecount = 1;
			}
			//       输入的内容与localStorage里的内容做判重
			var inter = 0;
			for (var i = 0; customAddVal.length > i; i++) {
				if (customAddVal[i].name == $('.customAddInput').val()) {
					++inter;
				}
			}
			if (inter == 0) {
				customAddVal.unshift({
					'id': localStorage.pagecount,
					'name': $('.customAddInput').val()
				})
				localStorage.setItem("isearch", JSON.stringify(customAddVal));
			}
			$('.customAddInput').blur();


			$(".customAddInput").parseLocalArrayData({
				'dataSources': customAddVal,
				'afterSelect': function () {
					if (typeof (options.refreshTable) == 'function') {
						options.refreshTable();
					}
				}
			});

			if (typeof (options.callBack) == 'function') {
				options.callBack(customAddVal);
			}
		})

	};
	
})(jQuery);

// 将生成下拉列表部分的代码单独取出
function conditionsHandler(options, obj, selectObj) {
	// 先处理数据
	var firstList = [],
		secondList = [],
		threeList = [];
	var selectValue = '';
	var selectInnerId = '';
	// 一级选中状态，二级选中状态，三级选中状态
	if (selectObj.length > 0) {
		var tempObj = selectObj[0];
		if (tempObj.innerid != 0) {
			selectInnerId = tempObj.innerid;
		}
	}
	obj.forEach(function (item) {
		item.isSelected = false;
		if (item.innerid == selectInnerId) {
			selectValue = item.name;
			item.isSelected = true;
		}
		if (item.level == 1 || item.level == 0) {
			firstList.push(item);
		} else if (item.level == 2) {
			secondList.push(item);
		} else if (item.level == 3) {
			threeList.push(item);
		}
	});

	// 处理一级下没有二级的情形
	firstList.forEach(function (firstItem) {
		firstItem.hasChild = false;
		secondList.forEach(function (secontItem) {
			if (secontItem.parentId == firstItem.innerid) {
				firstItem.hasChild = true;
			}
		});
	});
	// 处理二级下没有三级的情形
	secondList.forEach(function (secontItem) {
		secontItem.hasChild = false;
		threeList.forEach(function (threeItem) {
			if (threeItem.parentId == secontItem.innerid) {
				secontItem.hasChild = true;
			}
		});
	});

	// 先清空ul，因为存在多次渲染的情况、
	$(options.ulClassName).empty();
	var conditionText = '全部';
	if (options.inter) {
		if (options.conditionValue == 'map') {
			conditionText = '全部地区';
		} else if (options.conditionValue == 'classification') {
			conditionText = '全部分类';
		} else if (options.conditionValue == 'mediaAlone') {
			conditionText = '全部来源';
		}	
		$(options.ulClassName).append('<li class=""><a class="ti" href="javascript:void(0);">' + conditionText + '</a></li>');
		$(options.ulClassName).prev().attr('data-conditionValue', options.conditionValue);
	}
		
	// 生成html下拉结构
	firstList.forEach(function (firstItem) {
		var regionSecondItem = [];
		var regionThreeItem = [];
		var textCon = '<li class="ti firstItem"><a data-innerid="' + firstItem.innerid + '" href="javascript:void(0);">';
		
		if (firstItem.isSelected) {
			// 选中状态：存在二级菜单
			if (firstItem.hasChild) {
				textCon = '<li class="ti firstItem"><a data-innerid="' + firstItem.innerid + '" href="javascript:void(0);">'
					+firstItem.name + '<i class="fa fa-caret-right"></i>';
			}else{
				textCon = '<li class="ti firstItem"><a data-innerid="' + firstItem.innerid + '" href="javascript:void(0);">'
					+firstItem.name + '<i class="fa fa-caret-right" style="visibility:hidden;"></i>';
			}			
		}else{
			// 选中状态：存在二级菜单
			if (firstItem.hasChild) {
				textCon = '<li class="ti firstItem"><a data-innerid="' + firstItem.innerid + '" href="javascript:void(0);">' +
					firstItem.name + '<i class="fa fa-caret-right"></i>';
			} else {
				textCon = '<li class="ti firstItem"><a data-innerid="' + firstItem.innerid + '" href="javascript:void(0);">' +
					firstItem.name + '<i class="fa fa-caret-right" style="visibility:hidden;"></i>';
			}
		}
		// 拼接二级数据
		var secondHTML = '';
		if (firstItem.hasChild) {
			secondHTML = '<div class="prosmore hide">';
			secondList.forEach(function (secontItem) {
				if (secontItem.parentId == firstItem.innerid) {
					if (secontItem.isSelected) {
						secondHTML += '<span><em class="secondMore"><a class="secondItem" href="javascript:void(0);" data-parentId="' + firstItem.innerid + '" data-innerid="' + secontItem.innerid + '">' + secontItem.name + '</a>';
					}else{
						secondHTML += '<span><em class="secondMore"><a class="secondItem" href="javascript:void(0);" data-parentId="' + firstItem.innerid + '" data-innerid="' + secontItem.innerid + '">' + secontItem.name + '</a>';
					}
					// 拼接三级数据
					var threeHTML = '';
					if (secontItem.hasChild) {
						threeHTML = '<div class="threeProsmore hide">';
						threeList.forEach(function (threeItem) {
							if (threeItem.parentId == secontItem.innerid) {
								if (threeItem.isSelected) {
									threeHTML += '<span><em><a class="threeItem" href="javascript:void(0);" data-parentId="' + secontItem.innerid + '" data-innerid="' + threeItem.innerid + '">' + threeItem.name + '</a></em></span>';
								} else {
									threeHTML += '<span><em><a class="threeItem" href="javascript:void(0);" data-parentId="' + secontItem.innerid + '" data-innerid="' + threeItem.innerid + '">' + threeItem.name + '</a></em></span>';
								}
							}
						});
						threeHTML += '</div>';
					}
					secondHTML += threeHTML + '</em></span>';
				}				
			});
			secondHTML += '</div>';
		}
		textCon += secondHTML + '</a></li>';
		$(options.ulClassName).append(textCon);
	});

	if (selectInnerId != '' && selectValue != '' && (options.boxClassName == '.srceenMap' || options.boxClassName =='.clusterMap')) {
		$(options.boxClassName).find('h2').attr('data-selectValue', selectValue);
		var textShow = selectValue + '<i class="fa fa-caret-down"></i>';
		$(options.boxClassName).find('h2').html(textShow);
		$(options.boxClassName).find('h2').attr('data-innerId', selectInnerId);
		// 鼠标hover效果
		$(options.boxClassName).find('h2').attr('data-content', selectValue);
	}else{
        $(options.boxClassName).find('h2').attr('data-selectValue', selectValue);
        $(options.boxClassName).find('h2').attr('data-innerId', selectInnerId);
	}

	// 重新渲染事件
	$(options.boxClassName).find('h2').popover({
		trigger: 'hover', //触发方式
		placement: 'top', //弹窗显示方向
		html: true, // 为true的话，data-content里就能放html代码了
		content: "", //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
	});

	var lilen = $(options.ulClassName).find('li').length;
	// 计算二级页的高度
	var prosmoreHeight = 0;
	if (lilen > 16) {
		// 判读能否整除，将不能整除的部门用li补全
		var yushu = lilen % 16;
		if (yushu != 0) {
			var yushuBox = '';
			for (var i = 0; i < (16 - yushu); i++) {
				yushuBox += '<li class="hide zhanwei"></li>';
			}
			$(options.ulClassName).append(yushuBox);
		}
		// 将第一页的之外的li隐藏
		$(options.ulClassName).find('li').each(function (index) {
			if (index > 15) {
				$(this).addClass('hide');
			}
		})

		//	将分页的样式填入
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
	} else {
		prosmoreHeight = $(options.ulClassName).find('li').length * 30 + 4;		
	}
	screenConditionHandler({
		className: options.boxClassName,
		idName: options.ulClassName,
		multiSelect: options.multiSelect,
		callback: options.callback,
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

//地区、来源、分类下拉事件取出来
function screenConditionHandler(options) {
	var $subblock = $(options.className),
		$head = $subblock.find('h2'),
		$ul = $(options.idName),
		$lis = $ul.find("li"),
		$three = $lis.find(".prosmore").find('.secondMore');
		inter = $head.attr('data-inter');

	$head.off("click").click(function (e) {
		inter = $head.attr('data-inter');
		e.stopPropagation();
		$('.prosul').css({
			'display': 'none'
		})
		if (inter == 'false') {
			$ul.show();
			$head.attr('data-inter', 'true');
		} else {
			$ul.hide();
			$head.attr('data-inter', 'false');
		}
		// inter=!inter;
	});	

	$ul.mouseleave(function () {
		$head.attr('data-inter', 'false');
		$ul.hide();
		// inter=!inter;
	});

	$ul.click(function (event) {
		event.stopPropagation();
	});

	$(document).click(function (event) {
        event.stopPropagation();
		$head.attr('data-inter', 'false');
		$ul.hide();
		// inter=!inter;
	});

	$lis.hover(function () {
		if (!$(this).hasClass('nochild')) {
			$(this).addClass("prosahover");
			$(this).find(".prosmore").removeClass('hide')
				.find('.backshi').addClass('hide')
				.end()
				.find('span.xianItem').addClass('hide')
				.end()
				.find('span.xianCon').removeClass('hide');
		}
	}, function () {
		if (!$(this).hasClass('nochild')) {
			if ($(this).hasClass("prosahover")) {
				$(this).removeClass("prosahover");
			}
			$(this).find(".prosmore").addClass('hide');
		}
	});
	// 三级
	$three.mouseover(function (e) {
		$three.find('.threeProsmore').addClass('hide');
		$(this).find('.threeProsmore').removeClass('hide');
	});

	$lis.find('a').off('click').click(function () {
		var conditionValue = $head.attr('data-conditionValue') || '';
		areaStatus($head, conditionValue);
		var text = $(this).text() + '<i class="fa fa-caret-down"></i>';
		$head.html(text);
	
		var conditionText = '全部';
		if (conditionValue == 'map') {
			conditionText = '全部地区';
		} else if (conditionValue == 'classification') {
			conditionText = '全部分类';
		} else if (conditionValue == 'mediaAlone') {
			conditionText = '全部来源';
		}
		if ($(this).text() == conditionText) {
			$head.attr('data-innerid', '');
			$head.attr('data-selectValue', conditionText);
			$head.attr('data-content', conditionText);
		} else {
			$head.attr('data-innerid', $(this).attr('data-innerid'));
			$head.attr('data-selectValue', $(this).text());
			$head.attr('data-content', $(this).text());			
		}
		$head.attr('data-inter', 'true');
		reloadData();
		$head.click();
	})

	$lis.find('.backshi').click(function () {
		$(this).addClass('hide').parents('.prosmore')
			.find('span.xianItem').addClass('hide')
			.end()
			.find('span.xianCon').removeClass('hide');
	})

	// 下拉列表中的分页操作
	$ul.find('.fenleiBox').find('a').off("click").click(function () {
		var aval = $.trim($(this).text());
		$ul.find('.fenleiBox').find('a').removeClass('active');
		$(this).addClass('active');

		if (aval == '1' || $(this).attr('aria-label') == 'Previous') {
			$ul.find('li').each(function (index) {
				if (index >= 1 && index < 16) {
					$(this).removeClass('hide');
				} else {
					$(this).addClass('hide');
				}
			})
			$ul.find('.fenleiBox').find('a').eq(1).addClass('active');
		} else if (aval == '2') {
			$ul.find('li').each(function (index) {
				if (16 <= index && index < 31) {
					$(this).removeClass('hide');
				} else {
					$(this).addClass('hide');
				}
			})
		} else if (aval == '3' || $(this).attr('aria-label') == 'Next') {
			$ul.find('li').each(function (index) {
				if (31 <= index && index < 46) {
					$(this).removeClass('hide');
				} else {
					$(this).addClass('hide');
				}
			})
			$ul.find('.fenleiBox').find('a').eq(3).addClass('active');
		}
		// 0表示是全部，第二页及后面的分页仍需要显示
		$ul.find('li').eq(0).removeClass('hide');
		// $ul.find('li').eq(1).removeClass('hide');
	})

	
	//		自定义时间
	$ul.find('.customTime').click(function () {
		//			alert(1);
		$('.srceenTimeQuantum').click();
	})
}

// 处理本市，全省，全国的选中状态
function areaStatus($head, conditionValue) {
	if (conditionValue == 'map') {
		var $areaSelected = $('.areaSelected');
		if ($areaSelected != '' && $areaSelected.length > 0) {
			$head.attr('data-innerid', '');
		}
		$('.table-operation-status .tenantArea').removeClass('areaSelected');	
	}
}
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
$(function(){
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
	
//	时间选择框关闭时触发的条件(统一由上面的事件进行管理)
	// $('#time-slice').on('hide.daterangepicker',function(ev, picker){
		
	// 	if($('#time-slice').val() == ''){
			
	// 	}else{
	// 		$('.srceenTimeQuantum').find('h2').attr('data-innerid','').html('全部 <i class="fa fa-caret-down"></i>');
			
	// 		if($('.tableListCon').val() == 0){
	// 			threadAjaxData1.ajax.reload();
	// 		}else if($('.tableListCon').val() == 1){
	// 			thumbnailTable.ajax.reload();
	// 		}else if($('.tableListCon').val() == 2){
	// 			sudokuTable.ajax.reload();
	// 		}
	// 	}
	// });
}
