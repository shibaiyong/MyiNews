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
(function($) {
	//采用jquery中的ajax-get方式载入页面
	/*$.fn.loadPage = function(loadPage){
		var $this = $(this);
		$.get("../"+loadPage,function(data){
			$this.html(data);
		});
	}*/

	//采用jquery中的ajax-get方式载入页面
	$.fn.extend({
		'loadPage':function(loadPage){
			if(isValid(loadPage))
				return this;
			var $this = $(this);
			return $.get("../"+loadPage,function(data){
				$this.html(data);
			});
		}
 		
	});
	
//	全选功能-批量
	$.fn.allCheck = function(options){
		var defaults = {
				allFun:'',//全选以后进行的操作
		};
		var options = $.extend(defaults,options);
		
		$('.checked-all').click(function(){
			var status;
    		if($(this).hasClass('checked')){
    			$(this).removeClass('checked').parents('a').css({
    				'color':'#333'
    			});
    			$('span.check-child').removeClass('checked');
    			status = false;
    		}else{
    			$(this).addClass('checked').parents('a').css({
    				'color':'#F44336'
    			});
    			$('span.check-child').addClass('checked');
    			status = true;
    		}
    		
    		if(typeof(options.allFun) == 'function'){
    			options.allFun(status);
    		}
    		
    	});
    	
	};
//	列表选择-单独
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
	
	//私有方法，检测参数是否合法
	function isValid(options) {
		return !options || (options && typeof options === "object") ? true : false;
	}
	
})(window.jQuery);	