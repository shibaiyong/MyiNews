$(function(){
	/* 头部导航高亮 */
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(2)').addClass('active');
	/*鼠标划入悬停提示*/
    $("[data-toggle='tooltip']").tooltip();
//    左侧侧边栏
    var accordion = new Accordion($('#accordion'),false);
    
//链接各个模块
    $('.accordion').find('ul.submenu').each(function(){
    	$(this).find('li').each(function(index){
    		$(this).click(function(){
    			if(index == 0){
    				$('#myCustomContent').loadPage(ctx+'/gotoMyCustomThread');
    			}else if(index == 1){
    				$('#myCustomContent').loadPage(ctx+'/gotoMyCustomCluster');
    			}else if(index == 2){
    				$('#myCustomContent').loadPage(ctx+'/gotoMyCustomHeader');
    			}else if(index == 3){
    				$('#myCustomContent').loadPage(ctx+'/gotoMyCustomPic');
    			}else if(index == 4){
    				$('#myCustomContent').loadPage(ctx+'/gotoMyCustomVideo');
    			}
    			
    			$(this).addClass('active').siblings().removeClass('active');
    		})
    	})
    })
    
    $('.accordion').find('.addMyCustom').click(function(){
//    	$('#myCustomContent').loadPage(ctx+'/gotoAddMyCustom');
    	$('#myCustomContent').loadPage(ctx+'/custom/front/gotoAddMyCustom');
    })
    
    $('.accordion li').find('i').click(function(){
    	$('#deleteAll').modal();
    })
});




