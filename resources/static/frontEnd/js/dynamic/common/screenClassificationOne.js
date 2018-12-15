/**
 * 获取来源、地区、分类
 * @param getAjaxUrl  请求路径 例如：'/common/dic/front/listRegion'
 * @param boxClassName 地区、分类等的模块class值  例如：'.srceenMap'
 * @param ulClassName 当前模块ul的class值 例如：'#srceenMapPro'
 * inter  是否需要展示全部字段
 */
(function($){
	"use strict";
	
	$.fn.getSignleData = function (options) {
		var defaults = {
				getAjaxUrl:'',  //请求路径
				boxClassName:'',
				ulClassName:'',
				level: 1, //是否展示二级菜单
				inter: true, //是否显示全部字段
				getAjaxUserConfigUrl: '', //请求用户配置项
				multiSelect: false, //是否多选，默认为单选
				conditionValue: '',
				callback:'' //回调函数
		};
		var options = $.extend(defaults,options);
		if(options.getAjaxUrl == ''){
			$().screenSignleConditionFun({
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
						if (options.getAjaxUserConfigUrl != '' ) {
							// 获取用户定制的地区和分类数据
							$.ajax({
								url: options.getAjaxUserConfigUrl, //这个就是请求用户配置的数据
								type: 'get',
								dataType: 'json',
								async: true,
								success: function (response) {
									var selectObj = response.resultObj || [];									
									conditionsSignleHandler(options, obj, selectObj);
								}
							});
						}else{
							conditionsSignleHandler(options, obj, []);
						}	        			
		        	}		        	
		        },
		        error : function(msg) {
		        	
		        }
			});
		}
		
	};
	
	// 将生成下拉列表部分的代码单独取出
	function conditionsSignleHandler(options, obj, selectObj) {
		var selectValue = '';
		var selectInnerId = '';
		// 一级选中状态，二级选中状态，三级选中状态
		if (selectObj.length > 0) {
			var tempObj = selectObj[0];
			if (tempObj.innerid != 0) {
				selectInnerId = tempObj.innerid;
			}
		}
		obj.forEach(function (item, index) {
			item.isSelected = false;
			if (item.innerid == selectInnerId) {
				item.isSelected = true;
				selectValue = item.name;
			}
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
			} else if (options.conditionValue == 'carrierAlone'){
				conditionText = '全部载体';
			}
			$(options.ulClassName).append('<li class=""><a class="ti" href="javascript:void(0);">' + conditionText + '</a></li>');
			$(options.ulClassName).prev().attr('data-conditionValue', options.conditionValue);
		}
		var textCon = '';
		for (var count = 0; obj.length > count; count++) {						
			textCon = '<li class=""><a class="ti" data-innerid="' + obj[count].innerid + '" href="javascript:void(0);">' + obj[count].name + '</a></li>';			
			$(options.ulClassName).append(textCon);
		}

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
		} else {
			prosmoreHeight = $(options.ulClassName).find('li').length * 30 + 4;			
		}

		$().screenSignleConditionFun({
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

	//地区、来源、分类下拉事件
	$.fn.screenSignleConditionFun = function (options) {
		var defaults = {
			className:'',  
			idName:'',
			fun:'',
			multiSelect: false,
			callback: '',
		};
		var options = $.extend(defaults,options);		
		var $subblock = $(options.className),
			$head = $subblock.find('h2'),
			$ul = $(options.idName),
			$lis = $ul.find("li"),
			inter = $head.attr('data-inter');
				
		$head.off('click').click(function(e){
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
		
		$ul.mouseleave(function(){
			$head.attr('data-inter', 'false');
			$ul.hide();
		})
		
		$ul.click(function(event){
			event.stopPropagation();
		});
		
		$(document).click(function(){
			$head.attr('data-inter', 'false');
			$ul.hide();
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
			areaSignleStatus($head);
			var text = $(this).text() + '<i class="fa fa-caret-down"></i>';
			var innerid = $(this).attr('data-innerid');
			$head.html(text);
			
			var conditionValue = $head.attr('data-conditionValue') || '';
			var conditionText = '全部';
			if (conditionValue == 'map') {
				conditionText = '全部地区';
			} else if (conditionValue == 'classification') {
				conditionText = '全部分类';
			} else if (conditionValue == 'mediaAlone') {
				conditionText = '全部来源';
			}	else if (conditionValue == 'carrierAlone') {
				conditionText = '全部载体';
			}			
			// 选择全部
			if ($(this).text() == conditionText) {
				$head.attr('data-innerid','');
				$head.attr('data-content', conditionText);
			}else{
				// 单选的情况
				$head.attr('data-innerid', innerid);
				$head.attr('data-selectValue', $(this).text());
				$head.attr('data-content', $(this).text());	
							
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
			
			$head.attr('data-inter', 'true');
			signleReloadData();
			$head.click();
		})
		
		$lis.find('.backshi').click(function(){
			$(this).addClass('hide').parents('.prosmore')
				.find('span.xianItem').addClass('hide')
				.end()
				.find('span.xianCon').removeClass('hide');
		})
		
		// 下拉列表中的分页操作
		$ul.find('.fenleiBox').find('a').off("click").click(function () {
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
	$.fn.customSignleInputClickBtn = function (options) {
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
	String.prototype.gblen = function () {
		var len = 0;
		for (var i = 0; i < this.length; i++) {
			if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
				len += 2;
			} else {
				len++;
			}
		}
		return len;
	};

})(jQuery);

// 处理本市，全省，全国的选中状态
function areaSignleStatus($head) {
	var $areaSelected = $('.areaSelected');
	if ($areaSelected != '' && $areaSelected.length > 0) {
		$head.attr('data-innerid', '');
	}
	$('.table-operation-status .tenantArea').removeClass('areaSelected');
}

// 清空按钮
function clearSignleScreenMap(options) {
	var $subblock = $(options.className),
		$head = $subblock.find('h2'),
		$ul = $(options.idName);
	var multi = $head.attr('data-multi');
	if (multi) {
		var $liLists = $ul.find("li");
		var value = '';
		$.each($liLists, function (index, item) {
			value = $(this).find('a').text();
			if ($(this).find('a').find('i').length > 0) {
				$(this).find('a').html(value);
			}
		});
		$head.attr('data-selectValue', '');

		var conditionValue = $head.attr('data-conditionValue') || '';
		var conditionText = '全部';
		if (conditionValue == 'map') {
			conditionText = '全部地区';
		} else if (conditionValue == 'classification') {
			conditionText = '全部分类';
		} else if (conditionValue == 'mediaAlone') {
			conditionText = '全部来源';
		}else if (conditionValue == 'carrierAlone') {
			conditionText = '全部载体';
		}	
		$head.attr('data-content', conditionText);
		$head.attr('data-innerid', '');
		var textShow = conditionText + '<i class="fa fa-caret-down"></i>';
		$head.html(textShow);
	}
}

$(function(){
	$().enterPress();
});
