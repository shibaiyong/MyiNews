$(function(){



	/* 头部导航高亮 */
    $().showHeader();
	

	relativeImgNews();
	getSlideData();
})

/**
 * 获取图片库详情页中的数据
 */

function getSlideData(){
	var webpageCode = $('.webpageCode').val();
	console.log(webpageCode);
	$.ajax({
        url : ctx+'/latest/front/getNewsDetail',//这个就是请求地址对应sAjaxSource
        data:{'webpageCode':webpageCode},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
//        		taskId
        		$('.taskId').val(obj.taskId)
//        		标题
        		$('.newsDetailConTit h5').html(obj.title);
        		
//        		发布时间、来源、爬取来源、浏览量
        		var releaseDatetime;
            	if(obj.releaseDatetime != null && obj.releaseDatetime != ''){
            		releaseDatetime = new Date(obj.releaseDatetime).formatDate('yyyy-MM-dd hh:mm');
            	}else{
            		releaseDatetime = ' - '
            	}
            	
            	var sourceReport;
            	if(obj.sourceReport != null && obj.sourceReport != ''){
            		sourceReport = obj.sourceReport
            	}else{
            		sourceReport = ' - '
            	}
            	
            	var sourceCrawl;
            	if(obj.sourceCrawl != null && obj.sourceCrawl != ''){
            		sourceCrawl = obj.sourceCrawl
            	}else{
            		sourceCrawl = ' - '
            	}
            	
        		var mainCon = '';
        		mainCon += '<span class="gray">发布时间:</span>';
        		mainCon += '<strong>'+releaseDatetime+'</strong>';
        		mainCon += '<span class="gray">来源:</span>';
        		mainCon += '<em>'+sourceReport+'</em>';
        		mainCon += '<span class="gray">爬取来源:</span>';
        		mainCon += '<em>'+sourceCrawl+'</em>';
        		mainCon += '<span class="gray">本站浏览量:</span>';
        		mainCon += '<em>'+obj.statEntity.browseNum+'</em>';
        		mainCon += '<a href="'+obj.webpageUrl+'" class="linkOriginal"><i class="fa fa-chain-broken"></i> 原文链接</a>';
        		$('.MainNews').html(mainCon);
        		
        		
//        		关键词
        		var keyWords;
        		
            	var originalKeyWords;
            	if(obj.keywords != null && obj.keywords != ''){
            		var originalCon = obj.keywords.split(',');
            		originalKeyWords = '<div class="originalKeyWords">';
            		for(var count = 0;originalCon.length>count;count++){
            			originalKeyWords += '<span class="label label-red-bg">'+originalCon[count]+'</span>&nbsp;';
                	}
            		originalKeyWords += '</div>';
            	}else{
            		originalKeyWords = ''
            	}
            	
            	var customKeyWords = '<div class="customKeyWords">';
            	if(obj.cusKeyWords != null && obj.cusKeyWords != ''){
            		var obj1 = obj.cusKeyWords;
            		for(var count = 0;obj1.length>count;count++){
            			customKeyWords += '<span class="label label-orange-bg"><b>'+obj1[count].keyword+'</b></span>'
            		}
            		customKeyWords += '</div>'
            	}else{
            		customKeyWords = ''
            	}
            	
            	keyWords = originalKeyWords + customKeyWords;
            	$('.guanjianci dl').eq(0).find('dd').html(keyWords);
            	
//            	属性标签
            	var attributeCon;
            	
            	var attributeOneCon;
            	if(obj.newsType != null && obj.newsType != ''){
            		
            		var attributeOne = obj.newsType;
            		attributeOneCon = '<div class="originalKeyWords">';
            		for(var count1 = 0;attributeOne.length>count1;count1++){
            			attributeOneCon += '<span class="label label-red-bg">'+attributeOne[count1].label.name+'</span>&nbsp;'
            		}
            		attributeOneCon += '</div>';
            	}
            	
            	var attributeTwoCon = '';
            	if(obj.cusClassificationDetail != null && obj.cusClassificationDetail != ''){
            		var attributeTwo = obj.cusClassificationDetail;
            		attributeTwoCon = '<div class="customKeyWords">';
            		for(var count2 = 0;attributeTwo.length>count2;count2++){
            			attributeTwoCon += '<span class="label label-orange-bg">'+attributeTwo[count2].label+'</span>';
            		}
            	}
            	
            	attributeCon = attributeOneCon + attributeTwoCon;
            	$('.guanjianci dl').eq(1).find('dd').html(attributeCon);
            	
//            	新闻ID
            	if(obj.newsId != '' && obj.newsId != null){
            		$('.guanjianci dl').eq(2).find('dd').html('<span>'+obj.newsId+'</span>');
            	}
            	
//            	新闻图片
            	
            	var imgContent = '';
            	var cSlideUlCon = '';
            	if(obj.newsMedia != null && obj.newsMedia != ''){
            		var imgObj = obj.newsMedia;
            		for(var con = 0;imgObj.length>con;con++){
            			
//            			向图片服务器请求500*500的图片
//            			$.ajax({
//            		        url : imgObj[con].mediaPath+'&width=500&height=500',//这个就是请求地址对应sAjaxSource
//            		        type : 'get',
//            		        dataType : 'json',
//            		        async : false,
//            		        success : function(data) {
//            		        	if(data.result == 'success'){
//            		        		imgContent += '<li><a href=""><img src="'+imgObj[con]+'" alt="'+imgObj[con].description+'" /></a></li>';
//            		        	}
//            		        },
//            		        error : function(msg) {
//            		        }
//            			});
            			imgContent += '<li><a href=""><img src="'+imgObj[con].mediaPathOriginal+'" alt="'+imgObj[con].description+'" /></a></li>';
            		}
            		$('.slider ul').html(imgContent);
            		
            		lubotu();
            		
            	}
            	
        	}
        	
        }
	})
}
//相关图片新闻
function relativeImgNews(){
	var webpageCode1 = $('.webpageCode').val();
	var start = $('.start').val();
	$.ajax({
        url : ctx+'/latest/front/getImageRelevantNews/',//这个就是请求地址对应sAjaxSource
        data:{'webpageCode':webpageCode1,'start':start},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        	}
        },
        error : function(msg) {
        }
	});
}

//执行轮播图、修改轮播图样式
function lubotu(){
	var sliderVariable = {
			'imgHeight' : '500',
			'boxHeight' :'600',
	};
	
	if($('body').width() > 1366){
		sliderVariable.imgHeight = 600;
		sliderVariable.boxHeight = 700;
	}
	
	$(".slider").YuxiSlider({
	    width:1180, //容器宽度
	    height:sliderVariable.boxHeight, //容器高度
	    control:$('.control'), //绑定控制按钮
	    during:4000, //间隔4秒自动滑动
	    speed:800, //移动速度0.8秒
	    mousewheel:true, //是否开启鼠标滚轮控制
	    direkey:true //是否开启左右箭头方向控制
	});
//	修改轮播图的样式
	$('.desc').css({
		'width':'97%',
		'top':sliderVariable.imgHeight + 'px',
		'right':'0px',
		'left':'inherit'
	}).find('.title').css({
		'float':'right',
		'width':'95%',
		'paddingRight':'3em',
	}).siblings('.num').css({
		'left':'0px',
		'color':'#333',
		'paddingTop':'20px'
	});
	$('.desc .title').find('a').css({
		'color':'#666',
		'fontSize':'16px',
		'lineHeight':'30px'
	})
	$('.bg').css({
		'background':'none',
		'top':sliderVariable.imgHeight + 'px',
		'bottom':'inherit'
	})
}