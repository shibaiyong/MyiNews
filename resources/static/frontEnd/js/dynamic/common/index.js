var ctx,inewsImageManager;
$(function(){
//	inewsImageManager+"?path="
	ctx = $("#ctx").val();
	
	console.log(inewsImageManager)
	/*加载头部页*/
	$('#header').load(ctx+'/gotoHeader');
	/*默认加载页*/
	$('#page-content').load(ctx+'/gotoHome');
	/*加载底部页面*/
	$('#footer').load(ctx+'/gotoFooter');
	/*返回顶部-调用*/
	backTop();
});

/*返回顶部*/
function backTop(){
	$(window).on('scroll',function(){
		var st = $(document).scrollTop();
		if( st>0 ){
			if( $('#main-container').length != 0  ){
				var w = $(window).width(),mw = $('#main-container').width();
				if( (w-mw)/2 > 70 )
					$('#go-top').css({'left':(w-mw)/2+mw+20});
				else{
					$('#go-top').css({'left':'auto'});
				}
			}
			$('#go-top').fadeIn(function(){
				$(this).removeClass('dn');
			});
		}else{
			$('#go-top').fadeOut(function(){
				$(this).addClass('dn');
			});
		}	
	});
	$('#go-top .go').on('click',function(){
		$('html,body').animate({'scrollTop':0},500);
	});

	$('#go-top .uc-2vm').hover(function(){
		$('#go-top .uc-2vm-pop').removeClass('dn');
	},function(){
		$('#go-top .uc-2vm-pop').addClass('dn');
	});
}

/*更换页面整体的滚动条-body*/
/*还没有实现，出现问题*/
function changeScollBody(){
	$(window).on("load",function(){
    	$("body").mCustomScrollbar({
			theme:"minimal-dark"
		});
	});	
}