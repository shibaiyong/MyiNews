var context;

EnterPress();
$(function(){
    context = $('#context').val().trim();
	
	$("[data-toggle='tooltip']").tooltip();
	
	$('.search-input').limit_input_length();
	$(".editConfig a i[data-toggle='popover']").popover({
		trigger: 'hover', //触发方式
		placement: 'bottom', //弹窗显示方向
		html: true, // 为true的话，data-content里就能放html代码了
		content: "", //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
	});

	$(".editConfig a i[data-toggle='popover']").each(function () {
		$(".popover").popover("hide");
		$(this).on("mouseenter", function () {			
			$(this).popover("show");
		}).on("mouseleave", function () {
			$(".popover").popover("show");
			$(this).popover("hide");
		});;
	});

	$(".userDropDown").on("mouseenter", function () {
		var _this = this;
		$(_this).click();
		$(_this).addClass("hover");
	}).on("mouseleave", function () {
		var _this = this;
		$(_this).removeClass("hover");
	});
	$(".dropDownMenu").on("mouseleave", function () {
		var _this = this;
		$(_this).click();
		$(_this).removeClass("hover");
	});
	$(".userIcon").on("mouseenter", function () {
		var _this = this, parent = $(_this).parent();
		if(parent.hasClass("open")){
			parent.removeClass("open");
			parent.find(".userDropDown").attr("aria-expanded", "false");
		}
	});

	/*返回顶部*/
	backTop();
	
	smartickerW();
	
	$('.search-wrapper').find('.search-icon').find('span').each(function(){
		$(this).click(function(){
			var word = $('.search-input').val();
			if(word != null && word !=""){
				var searchType = $(this).text();
				/*链接进入搜索页*/
				searchNewsPage(searchType,word);
				$('.search-wrapper').find('.search-icon').find('span').removeClass('active');
				$(this).addClass('active');
			}else{
				$('.search-wrapper').find('.search-icon').find('span').removeClass('active');
				$(this).addClass('active');
			}
			return false;
		});
	});
	
	//websocket获取置顶新闻
	var ws;
	var curWwwPath = window.document.location.href;  		//当前请求路径    "http://localhost:8080/"
	var pathName =  window.document.location.pathname;   	//项目路径      "/"
	var localhostPath;										//请求地址	"http://localhost:8080"
	var pos = 0;
	if("/"==pathName||""==pathName){
		var localhostPath = curWwwPath.substring(0,curWwwPath.length-1);
	}else{
		pos = curWwwPath.indexOf(pathName);
		localhostPath = curWwwPath.substring(0,pos);
	}
	var wsPath = localhostPath;
//	console.log(wsPath);
	if(window.WebSocket){
		wsPath += context+"/websocket/h5";
		wsPath = wsPath.replace("http","ws");
		ws = new WebSocket(wsPath);
	}else{
		wsPath = context+"/websocket/sockjs";
		ws = new SockJS(wsPath);
	}
	
    ws.onopen = function () {
    	getStickTopVal();
    };
    ws.onmessage = function (event) {
    	if("stick"==event.data){
    		getStickTopVal();
    	}
    };
    ws.onclose = function (event) {
    };
    
    
    setLoalStorage();
    
    
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
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			if($('form.headerSearch').find('input').is(":focus")==true){
				$('.search-wrapper').find('.search-icon').find('span').each(function(){
					if($(this).hasClass('active')){
						$(this).click();
					}
				});
			}
			
		}
	});
}
/*链接进入搜索页*/
function searchNewsPage(searchType,word){
	if(searchType == "全网"){
		window.open(context + '/newsSearch/front/wholeNet/'+word);
	}else{
		window.open(context + '/latest/front/news/list?searchWord='+word);
	}
}


/*返回顶部*/
function backTop(){
	$(window).on('scroll',function(){
		$('#go-top').removeClass('hide');
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
		$('#go-top .uc-2vm-pop').removeClass('hide');
		$('#go-top .uc-2vm-pop').removeClass('dn');
	},function(){
		$('#go-top .uc-2vm-pop').addClass('hide');
		$('#go-top .uc-2vm-pop').addClass('dn');
	});
}

/**
 * 置顶新闻获取数据
 */
function getStickTopVal(){
	$.ajax({
        url : context+'/latest/front/listStickNews',//这个就是请求地址对应sAjaxSource
//        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.resultObj.length > 0){
        		var stickNews = data.resultObj;
        		var content = '<div class="smarticker2"><ul>';
        		
        		for(var count = 0;stickNews.length>count;count++){
            		var news = stickNews[count];
            		var time = new Date(news.releaseDatetime);
            		time=time.formatDate('MM-dd hh:mm');
            		if(news.title.length > 25){
            			news.title = news.title.substring(0,25)+'...';
            		}
            		if(news.sourceReport != null && news.sourceReport != ''){
            			content+='<li><a href="'+context+'/latest/front/news/detail/'+news.webpageCode+'" target="_blank" data-innerid="'+news.webpageCode+'"><span class="time">'+time+'</span>'+news.title+' <em>-- '+news.sourceReport+'</em></a></li>'
            		}else{
            			content+='<li><a href="'+context+'/latest/front/news/detail/'+news.webpageCode+'" target="_blank" data-innerid="'+news.webpageCode+'"><span class="time">'+time+'</span>'+news.title+'</a></li>'
            		}
            		
            	}
            	content+='</ul></div><div class="more"><a href="'+context+'/latest/front/stick/more" target="_blank">更多>></a></div>';
            	$('.smartickerBox').html(content);
        		
        		if(stickNews.length == 1){
//                	置顶新闻
                	var smartP = smartickerW();
                	$('.smartickerBox').css({
                		'width':smartP.wm,
                		'marginLeft':smartP.wml
                	})
            		$(".smarticker2").smarticker({
                		theme:2,
                		title:"推送新闻",
                		speed:0,
                		pausetime:0
                	});
        		}else if(stickNews.length > 1){
        			
                	
//                	置顶新闻
                	var smartP = smartickerW();
                	$('.smartickerBox').css({
                		'width':smartP.wm,
                		'marginLeft':smartP.wml
                	})
            		$(".smarticker2").smarticker({
                		theme:2,
                		title:"推送新闻",
                		speed:2e3,
                		pausetime:4e3
                	});
        		}
        	}
        	
        }
	})
}

function smartickerW(){
	var data = {
			wm:'',
			wml:''
	};
	var w = $('.header-top').width();
	var wl = $('.header-logo').width();
	var wr = $('.navbar-right').width();
	
	var wm = w - wl - wr - 140;
	var wml = wl + 70;
	
	data.wm = wm;
	data.wml = wml;
	
	return data;
}

//设置初始化的localStorage的变量
function setLoalStorage(){
//	localStorage.removeItem("conditions");
	if(localStorage.getItem('conditions') == null){
		var conditionCon = [{'name':'srceenSources','value':'','id':''},{'name':'srceenMap','value':'','id':''},{'name':'srceenClassification','value':'','id':''},{'name':'srceenTag','value':'','id':''},{'name':'srceenMedia','value':'','id':''},{'name':'clusterSources','value':'','id':''},{'name':'clusterMap','value':'','id':''},{'name':'clusterFenlei','value':'','id':''},{'name':'srceenTimeQuantum','value':'','id':''},{'name':'srceenTime','value':'','id':''},{'name':'clusterSources','value':'','id':''},{'name':'clusterMap','value':'','id':''},{'name':'clusterFenlei','value':'','id':''}];
		localStorage.setItem('conditions',JSON.stringify(conditionCon));
	}else{
		return;
	}
}