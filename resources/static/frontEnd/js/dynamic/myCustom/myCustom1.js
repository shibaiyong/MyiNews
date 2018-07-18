$(function(){
	/* 头部导航高亮 */
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
		if($(this).attr('data-mark') == 'nav.custom'){
			$(this).addClass('active');
		}
	});
	
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.custom'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	getCustomData();
	
//	添加定制旁边的加号
    $('.accordion .addMyCustom').find('div').click(function(){
    	if($('.accordion .addMyCustom').hasClass('open')){
    		return;
    	}else{
    		$('.accordion>li').removeClass('open').find('ul.submenu').slideUp().find('li').removeClass('active');
        	$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddMyCustom');
        	$('.accordion .addMyCustom').addClass('open');
    	}
    });
    
    footerPutBottom();
    
    var accordion = new Accordion($('#otheraccordion'),false);
    
});


//侧边栏点击事件
var Accordion = function(el, multiple) {
	this.el = el || {};
	this.multiple = multiple || false;
	var links = this.el.find('.link');
	links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
}

Accordion.prototype.dropdown = function(e) {
	var $el = e.data.el,$this = $(this),$next = $this.next();
	
	if($this.parent().hasClass('addMyCustom')){
		if($('.accordion>li.clueBox').length == 10){
    		 $().toastmessage('showToast', {
                 //提示信息的内容
                 text: '超过定制上限！',
                 //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                 sticky: false,
                 //显示的位置，默认为右上角
                 position : 'bottom-right',
                 //显示的状态。共notice, warning, error, success4种状态
                 type: 'error',
             });
    		 
    	}else{
    		$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddMyCustom');
    		$next.slideToggle();
			$this.parent().toggleClass('open');

			if (!e.data.multiple) {
				$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
			} else {
				$this.parent().siblings().removeClass('open');
			};
    	}
		$('#otheraccordion').find('li').removeClass('open');
	}else{
		if($this.parent().hasClass('reviewAnalysis')){
			
			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoReviewAnalysis');
			
			$('#myaccordion').find('.submenu').slideUp().parent().removeClass('open');
		}else if($this.parent().hasClass('addWeChat')){
//			判断是否添加过微信账号：添加过进入列表页，没有进入添加页
			$.ajax({
	            url : ctx+'/custom/front/checkStatus',
	            data:{type:1},
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            success : function(data,index) {
	            	console.log(data);
	            	if(data.result){//添加过定制
	            		var obj = data.resultObj;
	            		if(obj){
	            			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddBuffet');
	            		}else{
//	            			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomThread');
		            		$('#myCustomContent').loadPage(ctx+'/custom/front/gotoWeChat');
	            		}
	            		
	            	}else{//没有添加过定制
	            		
	            	}
	            }
			});
			
			
			$('#myaccordion').find('.submenu').slideUp().parent().removeClass('open');
		}else if($this.parent().hasClass('addMicroblogs')){
			
//			判断是否添加过微博账号：添加过进入列表页，没有进入添加页
			$.ajax({
	            url : ctx+'/custom/front/checkStatus',
	            data:{type:2},
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            success : function(data,index) {
	            	console.log(data);
	            	if(data.result){//添加过定制
	            		var obj = data.resultObj;
	            		if(obj){
	            			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddBuffet');
	            		}else{
//	            			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomThread');
		            		$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMicroblogs');
	            		}
	            		
	            	}else{//没有添加过定制
	            		
	            	}
	            }
			});
			$('#myaccordion').find('.submenu').slideUp().parent().removeClass('open');
		}else{
			$('#otheraccordion').find('li').removeClass('open');
		}
		
	}
	
	if($this.parent().hasClass('open')){
		$('.submenu').find('li').removeClass('active');
	}else{
		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
			$el.find('.submenu').find('li').removeClass('active');
		} else {
			$this.parent().siblings().removeClass('open');
		};
	}
}



//从后台数据库获得已经定制好的线索
function getCustomData(){
	$.ajax({
        url : ctx+'/custom/front/getMyCustomGroup',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var customLeftCon = '';
        		if(obj.length > 0){ //进行判断，是否存在定制好的线索，如果没有显示的是添加定制，如果有线索，显示的是最新的线索的线索
        			for(var i = 0;obj.length>i;i++){
            			customLeftCon = '';
            			customLeftCon += '<li class="clueBox"><i class="fa fa-trash-o"></i><div class="link" data-customGroup="'+obj[i].customGroup+'"><span>'+obj[i].name+'</span></div>';
            			customLeftCon += '<ul class="submenu"><li><a href="javascript:;">新闻</a></li><li class="hide"><a href="javascript:;">热点</a></li><li><a href="javascript:;">头条</a></li><li><a href="javascript:;">图片</a></li><li><a href="javascript:;">视频</a></li></ul></li>';
            			$('#myaccordion').prepend(customLeftCon);
            		}
            	    var accordion = new Accordion($('#myaccordion'),false); //左侧侧边栏
            	    
            	    $('#myaccordion .link').each(function(index){ //页面进来显示
            	    	$(this).click(function(){
            	    		if($(this).siblings('.submenu').find('li').length > 0){
            	    			$(this).siblings('.submenu').find('li:first').addClass('active');
                	    		$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomThread');
            	    		}
            	    	})
            	    })
            	    $('#myaccordion .link:first').click();
            	  
            	    $('.accordion').find('ul.submenu').each(function(){ //链接各个模块
            	    	$(this).find('li').each(function(index){
            	    		$(this).click(function(){
            	    			if(index == 0){
//            	    				$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomThread');
            	    				$('#myCustomContent').load(ctx+'/custom/front/gotoMyCustomThread');
            	    			}else if(index == 1){
            	    				$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomHotFind');
            	    			}else if(index == 2){
            	    				$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomHeader');
            	    			}else if(index == 3){
            	    				$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomPic');
            	    			}else if(index == 4){
            	    				$('#myCustomContent').loadPage(ctx+'/custom/front/gotoMyCustomVideo');
            	    			}
            	    			$(this).addClass('active').siblings().removeClass('active');
            	    		})
            	    	})
            	    });
            	    
            	    $('.accordion li').each(function(){
            	    	$(this).find('i.fa-trash-o').click(function(){ //删除整条线索
            	    		var $this = $(this);
                	    	var timeCode = $this.siblings('.link').attr('data-customgroup');
                	    	$('#deleteAll').modal();
                	    	$('.timeCode').val(timeCode);
                	    })
            	    })
        		}else{
        			var accordion = new Accordion($('#myaccordion'),false);
//        			$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddMyCustom');
        			$('.accordion .addMyCustom').find('.link').click();
        		}

        	    $('.determine').click(function(){ //模态框点击确定
    	    		$('#deleteAll').modal('hide');
    	    		$.ajax({
    	    	        url : ctx+'/custom/front/delete',//这个就是请求地址对应sAjaxSource
    	    	        data:{timeCode:$('.timeCode').val()},
    	    	        type : 'get',
    	    	        dataType : 'json',
    	    	        async : true,
    	    	        success : function(data) {
    	    	        	console.log(data);
    	    	        	if(data.result == true){
//    	    	        		$this.parents('li').remove();
    	    	        		window.location.reload();
    	    	        	}
    	    	        }
    	    		})
    	    	})
//    	    	模态框点击失败
    	    	$('.cancel').click(function(){
    	    		$('#deleteAll').modal('hide');
    	    	})
        	}
        }
	})
}

