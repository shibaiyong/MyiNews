/**
 *
 * 插件名：common.js
 * Author：xlYang
 */
(function(factory) {
  "use strict";
  if (typeof define === "function" && (define.amd || define.cmd)) {
    define(["jquery"], factory);
  } else {
    factory((typeof(jQuery) != "undefined") ? jQuery : window.Zepto);
  }
});

(function($){
	
	/**
	 * 时间对象的格式化，只要是时间对象，都可以调用该方法
	 * @param format 传入值,日期格式，比如"yyyy-MM-dd hh:mm:ss"
	 * @returns {String} 格式化之后的时间
	 */
	Date.prototype.formatDate = function(format) {
		/*
		 * eg:format="yyyy-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
			// millisecond
		}

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
							- RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
								? o[k]
								: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	
	$.ajaxSetup ({
        cache: false //关闭AJAX缓存
    });
	
	/**
	 * 对表格的全选
	 */
	$.fn.allCheck = function(options){
		var defaults = {
				allFun:'',//全选以后进行的操作
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		$this.find('.checked-all').click(function(){
			var status;
    		if($(this).hasClass('checked')){
    			$(this).removeClass('checked').parents('a').css({
    				'color':'#333'
    			});
    			$this.find('span.check-child').removeClass('checked');
    			status = false;
    		}else{
    			$(this).addClass('checked').parents('a').css({
    				'color':'#F44336'
    			});
    			$this.find('span.check-child').addClass('checked');
    			status = true;
    		}
    		
    		if(typeof(options.allFun) == 'function'){
    			options.allFun(status);
    		}
    	});
	};
	
	/**
	 * 列表中的选择按钮-单独选择
	 */
	$.fn.itemCheck = function(options){
		var defaults = {
				itemFun:'' //每个选完进行的操作
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		$this.find('span.check-child').each(function(){
    		var statusItem;
    		$(this).click(function(){
    			if($(this).hasClass('checked')){
    				$(this).removeClass('checked');
    				if($('.checked-all').hasClass('checked')){
    					$('.checked-all').removeClass('checked');
    					$('.checked-all').parents('a').css({
    						'color':'#333'
    					})
    				}else{}
    				
    				statusItem = false;
    			}else{
    				$(this).addClass('checked');
    				statusItem = true;
    			}
    			
    			if(typeof(options.itemFun) == 'function'){
        			options.itemFun($(this),statusItem);
        		}
    		})
    	})
	};
	
	
	
})(jQuery);