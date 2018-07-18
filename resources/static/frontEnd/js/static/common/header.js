$(function(){
		$('.example-navbar-collapse').each(function() {
			$(this).find('li').each(function(index){
				if(index == 0){
					$(this).click(function() {
						/*链接-首页*/
						location.href = "../../../templates/frontEnd/home/home.html";
						removeHeaderActive(this);
					});
				}else if(index == 1){
					$(this).click(function(){
						/*链接-我的定制*/
						location.href = "../../../../../templates/frontEnd/myCustom/myCustom.html";
						removeHeaderActive(this);
					});
				}else if(index == 2){
					$(this).click(function(){
						/*链接-新闻线索*/
						location.href = "../../../templates/frontEnd/newsThread/newsThread1.html";
						removeHeaderActive(this);
					});
				}else if(index == 3){
					$(this).click(function(){
						/*链接-全网头条*/
						location.href = "../../../templates/frontEnd/fullWebHeadlines/fullWebHeadlines.html";
						removeHeaderActive(this);
					});
				}else if(index == 4){
					$(this).click(function(){
						/*链接-热点排行*/
						location.href = "../../../templates/frontEnd/hotNews/hotNewsRank.html";
						removeHeaderActive(this);
					});
				}else if(index == 5){
					$(this).click(function(){
						/*链接-自动聚类*/
						location.href = "../../../templates/frontEnd/newsPolymerize/newsPolymerize.html";
						removeHeaderActive(this);
					});
				}else if(index == 6){
					$(this).click(function(){
						/*链接-热点专题*/
						/*$('#page-content').loadPage('newsPredict/newsPredict.html');
						removeHeaderActive(this);*/
						location.href = "../../../templates/frontEnd/hotEvent/hotEvent.html";
						removeHeaderActive(this);
					});
				}else if(index == 7){
					$(this).click(function(){
						/*链接-新闻日历*/
						location.href = "../../../templates/frontEnd/newsCalendar/newsCalendar.html";
						removeHeaderActive(this);
					});
				}else if(index == 8){
					$(this).click(function(){
						/*链接-新闻库*/
						/*$('#page-content').loadPage('leaderDyn/leaderDyn.html');*/
						location.href = "../../../templates/frontEnd/latestNews1/latestNews.html";
						removeHeaderActive(this);
					});
				}
			});
		});

	$("[data-toggle='tooltip']").tooltip();
	/*链接进入全网搜索页*/
	linkFulWebPage();
	/*enter键进入*/
	EnterPress();
	logout();
	/*返回顶部*/
	backTop();
});

/*点击头部的链接，改变样式*/
function removeHeaderActive(addClassName){
	$('.example-navbar-collapse').each(function() {
		$(this).find('li').each(function(){
			$(this).removeClass('active');
		});
		$(addClassName).addClass('active');
	});
	
}

/*页面滚动显示新的导航条并固定*/
function scrollShowNav(){
	$(window).scroll(function(){
        height = $(window).scrollTop();
   	  	if(height > 200){
   	  	  	$('.navRollShow').slideDown('400');
   	  	}else{
   	  	  	$('.navRollShow').slideUp('fast');
   	  	};
	});
}
/*enter键进入*/
function EnterPress(e){
    var e=e||window.event;
    if (e.keyCode == 13) {
        $('form.headerSearch').find('.search-icon').click();
    } 
}
/*链接进入全网搜索页*/
function linkFulWebPage(){
	$('form.headerSearch').find('.search-icon').click(function(){
		/*if($(this).siblings('input').val() == ''){return false;}*/
		location.href = "../../../templates/frontEnd/latestNews1/fullWebSearch.html";
	});
}

/*点击退出，进入登录页*/
function logout(){
	$('.navbar-right').find('li').each(function(index) {
		$(this).click(function(){
			if(index == 0){
				location.href="../../../../resources/templates/backEnd/common/header.html";
			}else if(index == 1){
				/*location.href="../../../../resources/templates/frontEnd/user/user.html";*/
				location.href = "../../../templates/frontEnd/user/user.html";
			}else if(index == 2){

			}else if(index == 3){
				location.href="../../../../resources/templates/frontEnd/login/login.html";
			}
		});
	});
}

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