$(function(){
//	$('.table-operation-status a').each(function(index){
//		$(this).click(function(){
//			if($(this).hasClass('active')){
//				$(this).removeClass('active');
//				if(index == 2){
//					$(this).find('i').attr('class','fa fa-heart-o');
//				};
//				if(index == 3){
//					$(this).find('i').attr('class','fa fa-file-text-o');
//				}
//			}else{
//				$(this).addClass('active');
//				if(index == 2){
//					$(this).find('i').attr('class','fa fa-heart');
//				};
//				if(index == 3){
//					$(this).find('i').attr('class','fa fa-file-text');
//				}
//			}
//			
//		})
//	});
});


(function($){
	//批量收藏
	$.fn.batchCollect = function(options){
		
		var defaults = {
				dataUrl:'', //请求路径
				dataParam:{},  //传递参数
				callback:''
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		var successSun = 0,falseSun = 0;
		
			if(options.dataParam.webpageCodeList.length > 0){
				$this.addClass('active').css({
		            'cursor':'not-allowed',
		        }).find('i').attr('class','fa fa-heart');
				
				var userCenter = $('.userCenter');
				var imgtodrag = $this;
				if (imgtodrag) {
					var imgclone = imgtodrag.clone().offset({
						top: imgtodrag.offset().top,
						left: imgtodrag.offset().left
					}).css({
						'opacity': '0.5',
						'position': 'absolute',
						'height': '150px',
						'width': '150px',
						'z-index': '100'
					}).appendTo($('body')).animate({
						'top': userCenter.offset().top + 15,
						'left': userCenter.offset().left + 20,
						'width': 75,
						'height': 75
					}, 1000, 'easeInOutExpo');
					imgclone.animate({
						'width': 0,
						'height': 0
					}, function () {
						$(this).detach();
					});
				}
				
				$.ajax({
		            url : options.dataUrl,//这个就是请求地址对应sAjaxSource
		            data: options.dataParam,
		            type : 'get',
		            dataType : 'json',
		            async : true,
		            traditional: true,
		            success : function(data) {
		            	
		            	$this.removeClass('active').css({
		                    'cursor':'auto',
		                }).find('i').attr('class','fa fa-heart-o');
		            	
		            	if(data.result){
		            		var obj = data.resultObj;
		            		for(var key in obj){
		            			if(obj[key]){
		            				++successSun;
		            			}else{
		            				++falseSun;
		            			}
		            		}
		            		
		            		$().toastmessage('showToast', {
		            	    	text: successSun+'条 收藏成功，'+falseSun+'条 失败',
		            	   		sticky: false,
		            	        position : 'bottom-right',
		            	        type: 'success',
		            	        close : function () {
		            	        	successSun = 0;
		            	        	falseSun = 0;
		            	        }
		            		});
		            		
		            		if(typeof(options.callback) == 'function'){
		            			options.callback(data);
		            		}
		            	}
		            }
				});
			}
		
	};
//	批量建稿
	$.fn.batchBuild = function(options){
		var defaults = {
				dataUrl:'', //请求路径
				dataParam:{},  //传递参数
				callback:''
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		if(options.dataParam.webpageCodeList.length > 0){
			$this.addClass('active').html('<div style="color:#F44336" class="la-timer la-sm"><div></div></div>&nbsp;建稿中...');
			var tempwindow = window.open();
			$.ajax({
	            url : options.dataUrl,//这个就是请求地址对应sAjaxSource
	            data: options.dataParam,
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            traditional: true,
	            success : function(data) {
	            	console.log(data);
	            	if(data.result){
	            		$this.removeClass('active').html('<i class="fa fa-file-text-o"></i>&nbsp;建稿')
	            		
	            		$().toastmessage('showToast', {
	            	    	text: '建稿成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
	            		
	            		if(typeof(options.callback) == 'function'){
	            			options.callback(data,tempwindow);
	            		}else{
	            			tempwindow.location=data.resultObj;
	            		}
	            	}
	            }
			})
		}
		
	}
	
})(jQuery);