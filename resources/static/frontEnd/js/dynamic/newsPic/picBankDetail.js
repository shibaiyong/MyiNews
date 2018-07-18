$(function(){

	/* 头部导航高亮 */
    $().showHeader();
	footerPutBottom();
	//	相关图片新闻
	relativeImgNews();
//	lunbotu();
	getSlideData();
	
	$('.changeImg').click(function(){
		relativeImgNews();
	})
})

//图片的轮播图
function lunbotu(){
	var index=0;
    var length=$("#img img").length;
    var i=1;
    
    //关键函数：通过控制i ，来显示图片
    function showImg(i){
    	
        $("#img img").eq(i).stop(true,true).fadeIn(800).siblings("img").hide();
        $("#cbtn li").eq(i).addClass("hov").siblings().removeClass("hov");
        
        if($('#shade').length>0){
        	if($("#img img").eq(i).attr('data-title') == 'null'){
        		$('#shade').html('');
        	}else{
        		$('#shade').html('<p class="shadeText">'+$("#img img").eq(i).attr('data-title')+'</p>');
        	}
        }
        $('#img-title label').eq(0).html($("#img img").eq(i).attr('data-widthHeight'));
        $('#img-title label').eq(1).html($("#img img").eq(i).attr('data-mediaBytes')+'KB');
        $('#img-title label').eq(2).html($("#img img").eq(i).attr('data-imageForm'));
    }
    
    function slideNext(){
        if(index >= 0 && index < length-1) {
             ++index;
             showImg(index);
        }else{
			if(confirm("已经是最后一张,点击确定重新浏览！")){
				showImg(0);
				index=0;
				aniPx=(length-5)*142+'px'; //所有图片数 - 可见图片数 * 每张的距离 = 最后一张滚动到第一张的距离
				$("#cSlideUl ul").animate({ "left": 0+'px' },200);
				i=1;
			}
            return false;
        }
        if(i<0 || i>length-5) {return false;}						  
               $("#cSlideUl ul").animate({ "left": "-=142px" },200)
               i++;
    }
     
    function slideFront(){
       if(index >= 1 ) {
             --index;
             showImg(index);
        }
        if(i<2 || i>length+5) {return false;}
               $("#cSlideUl ul").animate({ "left": "+=142px" },200)
               i--;
    }	
//        $("#img img").eq(0).show();
    	showImg(0);
        $("#cbtn li").eq(0).addClass("hov");
        $("#cbtn tt").each(function(e){
            var str=(e+1)+"/"+length;
            $(this).html(str)
        })
    
        $(".picSildeRight,#next").click(function(){
               slideNext();
           })
        $(".picSildeLeft,#front").click(function(){
               slideFront();
           })
        $("#cbtn li").click(function(){
            index  =  $("#cbtn li").index(this);
            showImg(index);
        });	
		$("#next,#front").hover(function(){
			$(this).children("a").fadeIn();
		},function(){
			$(this).children("a").fadeOut();
		})
}

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
            	if(obj.sourceCrawlDetail != null && obj.sourceCrawlDetail != ''){
            		if(obj.sourceCrawlDetail.website.displayName != null && obj.sourceCrawlDetail.website.displayName != ''){
                		sourceCrawl = obj.sourceCrawlDetail.website.displayName
                	}else{
                		sourceCrawl = ' - '
                	}
            	}else{
            		sourceCrawl = ' - '
            	}
            	
            	
        		var mainCon = '';
        		mainCon += '<span class="gray">发布时间:</span>';
        		mainCon += '<strong>'+releaseDatetime+'</strong>';
        		mainCon += '<span class="gray">来源:</span>';
        		mainCon += '<em>'+sourceReport+'</em>';
        		mainCon += '<span class="gray">采集来源:</span>';
        		mainCon += '<em>'+sourceCrawl+'</em>';
        		mainCon += '<span class="gray">本站浏览量:</span>';
        		mainCon += '<em>'+obj.statEntity.browseNum+'</em>';
        		mainCon += '<a href="'+obj.webpageUrl+'" target="_blank" class="linkOriginal"><i class="fa fa-chain-broken"></i> 原文链接</a>';
        		
        		$('.MainNews').html(mainCon);
        		
        		$('.newsDetailConTitRight').removeClass('hide');
        		$('.collect').attr('data-id',obj.webpageCode);
        		collect();
        		
        		$().adraticAjaxData({
    				'dataUrl':ctx+'/latest/front/getUserFavorites',
    				'dataParam':{'webpageCode':obj.webpageCode},
    				'callback':function(data){
    					console.log(data);
						if(data[0] == true){
							$('.collect').addClass('active');
							$('.collect').find('i').attr('class','fa fa-heart')
						}else{
							
						}
    				}
    			});
        		
//        		建稿
        		$('.jiangao').releaseBuild({
        			'webpageCode':obj.webpageCode,
        			'buildingCon':function(_$this){
        				_$this.addClass('active');
        				_$this.html('<div style="color:#F44336" class="la-timer la-sm"><div></div></div>&nbsp;建稿中...').attr('disabled',"true");
        			},
        			'buildedCon':function(_$this){
        				_$this.removeClass('active');
        				_$this.html("<i class='fa fa-file-text-o'></i>&nbsp;建稿").removeAttr("disabled");
        			}
        		})
        		
//        		摘要
        		
        		if(obj.cusSummary != null && obj.cusSummary != ''){
        			$('#summaryContent').html('<p class="m-bottom"><strong>【机器摘要】</strong>'+obj.cusSummary+'</p><a href="javascript:void(0)" style="font-size:14px;color:#ff6600;float:right" class="seeNewsDetail">[查看新闻详情]</a>')
        			
        			$('#summaryContent p').each(function(){
        	    		if($(this).height()>=102){
        	    		    $(this).css({
        	    		        'height':102,
        	    		    });
        	    		    $(this).dotdotdot({
        	    		        wrap: 'letter'
        	    		     });
        	    		 }
        	    	});
        		}else{
        			$('#summaryContent').html('<a href="javascript:void(0)" style="font-size:14px;color:#ff6600;float:right" class="seeNewsDetail">[查看新闻详情]</a>');
        		}
        		
//        		正文
        		$('#newsContent').html('');
         		$('#newsContent').html(obj.content);
//        		去掉详情中自带的class值
        		$('#newsContent').reContentClass();
        		
        		/*显示正文*/
            	$('.seeNewsDetail').click(function(){
        			if($(this).text() == '[查看新闻详情]'){
        				$('#newsContent').removeClass('hide');
        				$(this).remove();
        				$('#newsContent').judgeImgLoadError();
        				$('#newsContent').checkImg();
        				
        				/*组图*/
        				$('#newsContent').mosaic();
//                		视频
                		$('#newsContent').embedVideo();
//                		微博
                		$('#newsContent').weibo();
        			}
        		})
        		

        		
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
            			customKeyWords += '<span class="label label-orange-bg">'+obj1[count].keyword+'</span>&nbsp;';
            		}
            		customKeyWords += '</div>'
            	}else{
            		customKeyWords = ''
            	}
            	
            	keyWords = originalKeyWords + customKeyWords;
            	$('.guanjianci dl').eq(0).find('dd').html(keyWords);
            	
            	
            	
//            	属性标签
            	var attributeCon = '';
            	
            	var attributeOneCon ='';
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
            			attributeTwoCon += '<span class="label label-orange-bg">'+attributeTwo[count2].label.name+'</span>&nbsp;';
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
            		var imgBtn = '<div id="front" title="上一张"><a href="javaScript:void(0)" class="pngFix"></a></div><div id="next" title="下一张"><a href="javaScript:void(0)" class="pngFix"></a></div>';
            		var shadeCon = '<div id="shade"><p class="shadeText"></p></div>';
            		
            		var allPageImgCon = '';
            		console.log(imgObj.length);
            		for(var con = 0;imgObj.length>con;con++){
            			var imgUrl = ''
            			if(imgObj[con].status == 0){
            				imgUrl = imgObj[con].mediaPath;
            			}else{
            				imgUrl = imgObj[con].mediaPathOriginal;
            			}
            			
//            			将轮播图处的图片先设置为默认图片，从图片服务器返回回来的图片在替换
            			imgContent = '<img class="defaultImg" data-index="'+con+'" src="'+context+'/frontEnd/image/home/default-gray.png" data-title="'+imgObj[con].description+'" data-mediaBytes="'+imgObj[con].mediaBytes+'" data-widthHeight="'+imgObj[con].width+' X '+imgObj[con].height+'" data-imageForm="'+imgObj[con].imageForm+'"/>';
            			allPageImgCon = '<li class="span3 defaultImg" data-index="'+con+'"><a href="'+context+'/frontEnd/image/home/default-gray.png"><img  src="'+context+'/frontEnd/image/home/default-gray.png"/></a></li>'
            			$('#img').append(imgContent);
            			$('#gallery').append(allPageImgCon);
            			
//                			向图片服务器请求原始图片
            			$.ajax({
            		        url : inewsImageManager+imgUrl,//这个就是请求地址对应sAjaxSource
            		        data : {'code':con},
            		        type : 'get',
            		        dataType : 'json',
            		        async : true,
            		        success : function(data) {
            		        	console.log(data);
            		        	if(data.result == 'success'){
//            		        		imgContent += '<img src="'+data.value+'" data-title="'+imgObj[con].description+'" data-mediaBytes="'+imgObj[con].mediaBytes+'" data-widthHeight="'+imgObj[con].width+' X '+imgObj[con].height+'" data-imageForm="'+imgObj[con].imageForm+'"/>';
//                        			allPageImgCon += '<li class="span3"><a href="'+data.value+'"><img  src="'+data.value+'"/></a></li>'
            		        		$('#img').find('img').each(function(){
            		        			if($(this).attr('data-index') == data.code){
            		        				$(this).attr('src',data.value).removeClass('defaultImg');
            		        			}
            		        		})
            		        		
            		        		$('#gallery').find('li').each(function(){
            		        			if($(this).attr('data-index') == data.code){
            		        				$(this).removeClass('defaultImg').find('a').attr('href',data.value).find('img').attr('src',data.value);
            		        			}
            		        		})
            		        	}
            		        },
            		        error : function(msg) {
            		        }
            			});
            			
            			
            			cSlideUlCon = '<li ><img class="defaultImg" data-index="'+con+'" src="'+context+'/frontEnd/image/home/default-white.png"/><tt></tt></li>';
            			$('#cSlideUl ul').append(cSlideUlCon);
            			
//                			图片服务器请求320*180的图片
            			$.ajax({
            		        url : inewsImageManager+imgUrl+'&width=320&height=180',//这个就是请求地址对应sAjaxSource
            		        data : {'code':con},
            		        type : 'get',
            		        dataType : 'json',
            		        async : true,
            		        success : function(data) {
            		        	console.log(data);
            		        	if(data.result == 'success'){
            		        		$('#cSlideUl').find('li').each(function(){
                		        		if($(this).find('img').attr('data-index') == data.code){
                		        			$(this).find('img').attr('src',data.value).removeClass('defaultImg');
                		        		}
                		        	})
            		        	}else{
            		        		$('#cSlideUl').find('li').each(function(){
                		        		if($(this).find('img').attr('data-index') == data.code){
                		        			$(this).remove();
                		        		}
                		        	})
            		        		$('#img').find('img').each(function(){
            		        			if($(this).attr('data-index') == data.code){
            		        				$(this).remove();
            		        			}
            		        		})
            		        	}
            		        	
            		        	
            		        },
            		        error : function(msg) {
            		        	console.log('请求失败');
            		        }
            			});
        			}

            		$('#img').append(imgBtn);
            		$('#img').after(shadeCon);
            		
            		
            		lunbotu();
//            		全屏显示图片
            		$('.fangpigpic').click(function(){
            			$('#gallery img').fsgallery();
            			$('#gallery img:eq(0)').click();
            		})
            		
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
        url : ctx+'/latest/front/getImageRelevantNews',//这个就是请求地址对应sAjaxSource
        data:{'webpageCode':webpageCode1,'start':start},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		$('.interrelatedImgCon').html('');
        		$('.start').val(obj.start);
        		if(obj.imageShowList == null || obj.imageShowList.length == 0){
        			$('.interrelated_newspic').addClass('hide');
        		}else{
        			$('.interrelated_newspic').removeClass('hide');
        			for(var i = 0;obj.imageShowList.length>i;i++){
//            			时间
            			var time = new Date(obj.imageShowList[i].releaseDatetime).formatDate('MM-dd hh:mm');
            			
            			$.ajax({
            		        url :inewsImageManager + obj.imageShowList[i].picPath+'&width=320&height=180',//这个就是请求地址对应sAjaxSource
            		        data:{code:obj.imageShowList[i].webpageCode},
            		        type : 'get',
            		        dataType : 'json',
            		        async : true,
            		        success : function(data) {
            		        	console.log(data);
            		        	if(data.result == 'success'){
            		        		$('.interrelatedImgCon').find('img[data-webpagecode="'+data.code+'"]').attr('src',data.value).removeClass('defaultImg')
            		        	}else{
            		        		$('.interrelatedImgCon').find('img[data-webpagecode="'+data.code+'"]').attr('src',context+'/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange')
            		        	}
            		        },
            		        error : function(msg) {
            		        }
            			});
            			
            			content += '<li><div class="site-piclist_pic">';
    					content += '<img class="defaultImg" data-webpageCode="'+obj.imageShowList[i].webpageCode+'" src="'+context+'/frontEnd/image/home/default-gray.png"/>';
    					content += '</div><div class="site-piclist_info">';
    					content += '<p><a target="_blank" href="'+ctx+'/latest/front/image/detail/'+obj.imageShowList[i].webpageCode+'" data-id="'+obj.imageShowList[i].webpageCode+'">'+obj.imageShowList[i].title+'</a></p>';
    					content += '</div><div class="site-piclist_time"><p>'+time+'</p></div></li>';
            		}
        			
        			$('.interrelatedImgCon').html(content);
        		}
        	}
        },
        error : function(msg) {
        }
	});
}

//新闻收藏
function collect(){
	$('.collect').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).find('i').attr('class','fa fa-heart-o');
		}else{
			$(this).addClass('active');
			$(this).find('i').attr('class','fa fa-heart');
		}
		
		var webpageCode = $(this).attr('data-id');
		console.log();
		$().judgeKeep({
			'dataUrl':ctx+'/latest/front/collectingNews',
			'dataParam':{'webpageCode':webpageCode,'type':5}
		})
	})
}

