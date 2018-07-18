var webpageCode = '';
var anaylsisUrl= '';
var orgUrl = '';//原文链接
$(function(){

	/*头部导航高亮*/
	webpageCode = $('.webpageCode').val();
	/* 头部导航高亮 */
    $().showHeader();


    /*将底部致底*/
	footerPutBottom();
	getNewsDetailVal();
	getSimilarConData();
	getInterrelatedConData();
	
	$('.sharingBtn').click(function(){
		$('#weixinModal').modal('show');
		$('#weixinModal').find('.modal-body').html('<div id="qrcode"></div>');
		//设置 qrcode 参数
		var qrcode = new QRCode('qrcode', {
		    width: 266,
		    height: 266,
		    colorDark: '#000000',
		    colorLight: '#ffffff',
		});
		
		//获得当前域名
		var txtUrl = window.location.host;
		qrcode.makeCode('http://'+txtUrl+'/data/wechat/gotoappnewsdetail/'+$('.webpageCode').val());
	})

});
// 免责声明
function closeDeclare(){
		$('.declare').addClass('hide');
}

/**
 * 获取新闻详情页中的数据
 */
function getNewsDetailVal(){
	var webpageCode = $('.webpageCode').val();
	var queryStr = $('.queryStr').val();
	var releaseDateTime = $('.releaseDateTime').val();
	var dataParam = {
			'webpageCode':webpageCode,
            'releaseDateTime':releaseDateTime
	};
	if(queryStr != ''){
		dataParam.queryStr=queryStr
	}

	$.ajax({
        url : ctx+'/latest/front/getNewsDetail',//这个就是请求地址对应sAjaxSource
        data:dataParam,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	if(data.result == true){
        		var obj = data.resultObj;
        		console.log(obj);
//        		taskId
        		$('.taskId').val(obj.taskId);
            	
//            	标题
            	if(obj.title != null && obj.title != ''){
            		document.title=obj.title+'_智慧新闻';
            		$('.newsDetailConTit h5').html(obj.title.replace(/\\"/g,"&quot;"));
            		
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
            		
//            		建、采
            		$().adraticAjaxData({
        				'dataUrl':ctx+'/latest/front/getDraftType',
        				'dataParam':{'webpageCode':obj.webpageCode},
        				'callback':function(data,con){
        					console.log(data[0][0]);
        					if(data[0][0] == 1){
        						
        						$('.newsDetailConTit h5').css({
        							'width':'70%'
        						}).after('<span class="label-status label-jian">【建】</span>');
        					}else if(data[0][0] == 2){
        						$('.newsDetailConTit h5').css({
        							'width':'70%'
        						}).after('<span class="label-status label-cai">【采】</span>');
        					}
        				}
        			});
            		
//            		建稿
            		$('.jiangao').releaseBuild({
            			'webpageCode':obj.webpageCode,
            			'buildingCon':function(_$this){
            				_$this.addClass('active');
            				_$this.html('<div style="color:#343434" class="la-timer la-sm"><div></div></div>&nbsp;建稿中...').attr('disabled',"true");
            			},
            			'buildedCon':function(_$this){
            				_$this.removeClass('active');
            				_$this.html("<i class='fa fa-file-text-o'></i>&nbsp;建稿").removeAttr("disabled");
            			}
            		})
            	}else{
            		$('.newsDetailConTit h5').html('-');
            	}

            	
//            	发布时间、来源、爬取来源等
            	var mainNews='';
            	
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
            		if(obj.sourceCrawlDetail.website != null && obj.sourceCrawlDetail.website != ''){
            			sourceCrawl = obj.sourceCrawlDetail.website.displayName;
            		}else{
            			sourceCrawl = '-';
            		}
            	}else{
            		sourceCrawl = ' - '
            	}
            	
            	mainNews+='<span class="gray">发布时间:</span><strong >'+releaseDatetime+'</strong>'
            	mainNews+='<span class="gray">来源:</span><em>'+sourceReport+'</em>'
            	mainNews+='<span class="gray" >采集来源:</span><em>'+sourceCrawl+'</em>'
            	mainNews+='<div class="changeFontStyle"><form class="form-inline"><div class="form-group"><label>字体：</label><select class="form-control"><option select="selected">中号</option><option>小号</option><option>大号</option></select></div></form></div>'
            	
            	$('.MainNews').eq(0).html(mainNews);
            	
            	var mainNews2='';
            	
            	var newsId;
            	if(obj.newsId != null && obj.newsId != ''){
            		newsId = obj.newsId
            	}else{
            		newsId = ' - '
            	}
            	
//            	浏览量
            	if(obj.statEntity != null && obj.statEntity != ''){
            		if(obj.statEntity.browseNum != null && obj.statEntity.browseNum != ''){
                		var browseNum = obj.statEntity.browseNum;
                	}else{
                		var browseNum = '-';
                	}
            	}else{
            		var browseNum = '-';
            	}
            	
            	
            	mainNews2+='<span class="gray">新&nbsp;闻&nbsp;ID：</span><strong>'+newsId+'</strong>'
    			mainNews2+='<span class="gray">本站浏览量:</span><em >'+browseNum+'</em>'
    			mainNews2+='<a href="'+obj.webpageUrl+'" target="_blank" class="linkOriginal"><i class="fa fa-chain-broken"></i> 原文链接</a>'
    			
    			$('.MainNews').eq(1).html(mainNews2);
            	
            	$('.newsDetailBottom').removeClass('hide');
            	$('.newsDetailBottom').find('.newsID').html('<span>新&nbsp;闻&nbsp;ID：</span><span>'+newsId+'</span>');
            	$('.textLink').html('<span class="pull-left">原文链接：</span><a class="pull-left" href="'+obj.webpageUrl+'" target="_blank" >'+obj.webpageUrl+'</a>')
            	
            	
//            	关键词
            	var keyWords;
            	var originalKeyWords;
            	if(obj.keywords != null && obj.keywords != ''){
            		
            		var originalCon = removeArrEmpty(obj.keywords.split(','));
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
            			customKeyWords += '<span class="label label-orange-bg">'+obj1[count].keyword+'</span>&nbsp;'
            		}
            		customKeyWords += '</div>'
            	}else{
            		customKeyWords = ''
            	}
            	
            	keyWords = originalKeyWords+customKeyWords;
            	if(keyWords == ''){
            		$('.newsDetailKeys').remove();
            	}else{
            		$('.newsDetailKeys').removeClass('hide');
                    $('.newsDetailConTitRight').removeClass('hide');
            		$('.newsDetailKeys').find('.keyWords').html(keyWords);
            	}
            	
            	
//            	摘要
            	var summaryCon;
            	if(obj.cusSummary != null && obj.cusSummary != ''){
            		$('.newsDetailSummary').removeClass('hide');
            		$('.summaryCon').html('<p><strong>【机器摘要】</strong>'+obj.cusSummary+'</p>');
            		
//            		摘要超出一定长度隐藏
            		summarydotdotdot();
            	}else{
            		$('.newsDetailSummary').remove();
            	}
            	
//            	正文
            	var content;
            	if(obj.content != null && obj.content != ''){
            		
            		$('#newsContent').html(obj.content);
            		
//            		去掉详情页中自带的class值
            		$('#newsContent').reContentClass();
            		
            		$('#newsContent').judgeImgLoadError();
            		$('#newsContent').checkImg();
            		
//            		组图
            		$('#newsContent').mosaic();
//            		视频
            		$('#newsContent').embedVideo();
//            		微博
            		$('#newsContent').weibo();
            		
            		
            		$('#main_content').contents().filter(function(){
            			return this.nodeType == 1
            		}).wrap('<div></div>')
            		
            		$('#newsContent').find('table').each(function(){
            			$(this).removeAttr('width');
            			$(this).removeAttr('WIDTH');
            			$(this).removeAttr('align');
            			$(this).removeAttr('style');
            			$(this).css({
            				'width':'100%'
            			});
            		});
            		
            		/*去掉正文部分每一段前面的空格*/
            		var reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
            		$('#newsContent').find('p').each(function(){
//            			console.log($(this).html());
            			var trimString = $(this).html();
            			/*alert(trimString.match(reg));*/
            			if(trimString.match(reg) == null || trimString.match(reg) == '<strong>,</strong>' || trimString.match(reg) == '<span>,</span>'){
            				trimString = $.trim(trimString);
            				$(this).html(trimString);
            			}
            		});
            		
//            		替换正文，高亮显示
            		if(obj.highlightList != null && obj.highlightList.length>0){
            			for(var i = 0;obj.highlightList.length>i;i++){
            				$('#newsContent').highlight( obj.highlightList[i] );
            			}
            		}
            		
            		changeFontStyle();
            		
            	}else{
            		
            	}
            	
            	
//            	评论分析
            	anaylsisUrl = obj.webpageUrl;
            	judgeUrl(anaylsisUrl);
            	

            	
//            	内容标签
            	if(obj.entityWords != null && obj.entityWords != ''){
            		
            		var obj2 = obj.entityWords;
            		var entityCon = {
            				'personLabel':'',
            				'institutionLabel':'',
            				'unitLabel':'',
            				'placeLabel':'',
            				'count':0
            		}
//            		人物标签
					if(obj2.personNameList != null && obj2.personNameList != ''){
						var content = '<div class="listLabel"><dl class="dl-horizontal m-bottom"><dt><a href="javascript:void(0)" class="set">人物标签</a></dt><dd>';

						for(var count = 0;obj2.personNameList.length>count;count++){
							content += '<a href="javascript:void(0)" class="dictionaryWord"><span>'+obj2.personNameList[count].word+'</span></a>';
						}
						content += '</dd></dl></div>';
						entityCon.personLabel = content;
					}else{
						var inter = entityCon.count;
						entityCon.count = ++inter;
					}
            		
//            		机构标签
            		if(obj2.orgNameList != null && obj2.orgNameList != ''){
            			var content = '<div class="listLabel"><dl class="dl-horizontal m-bottom"><dt><a href="javascript:void(0)" class="set">机构标签</a></dt><dd>';
            			
            			for(var count = 0;obj2.orgNameList.length>count;count++){
            				console.log(obj2.orgNameList[count].word);
            				content += '<a href="javascript:void(0)" class="dictionaryWord"><span>'+obj2.orgNameList[count].word+'</span></a>';
            			}
            			content += '</dd></dl></div>';
            			entityCon.institutionLabel = content;
            		}else{
            			var inter = entityCon.count;
            			entityCon.count = ++inter;
            		}
            		
//            		单位标签
            		if(obj2.companyNameList != null && obj2.companyNameList != ''){
            			var content = '<div class="listLabel"><dl class="dl-horizontal m-bottom"><dt><a href="javascript:void(0)" class="set">单位标签</a></dt><dd>';
            			
            			for(var count = 0;obj2.companyNameList.length>count;count++){
            				content += '<a href="javascript:void(0)" class="dictionaryWord"><span>'+obj2.companyNameList[count].word+'</span></a>';
            			}
            			content += '</dd></dl></div>';
            			entityCon.unitLabel = content
            		}else{
            			var inter = entityCon.count;
            			entityCon.count = ++inter;
            		}
            		
//            		地点标签
            		if(obj2.locationList != null && obj2.locationList != ''){
            			var content = '<div class="listLabel"><dl class="dl-horizontal m-bottom"><dt><a href="javascript:void(0)" class="set">地点标签</a></dt><dd>';
            			
            			for(var count = 0;obj2.locationList.length>count;count++){
            				content += '<a href="javascript:void(0)" class="dictionaryWord"><span>'+obj2.locationList[count].word+'</span></a>';
            			}
            			content += '</dd></dl></div>';
            			entityCon.placeLabel = content;
            		}else{
            			var inter = entityCon.count;
            			entityCon.count = ++inter;
            		}
            		
            		if(entityCon.count != 3){
            			var entityWords = '<div class="entityWord"><div class="box-header"><h2>内容标签</h2><h3></div><div class="listPer box p-right p-left"  id="entityWordsDiv" >'+entityCon.personLabel+entityCon.institutionLabel+entityCon.unitLabel+entityCon.placeLabel+'</div>';
            			$('.analyzeContent').append(entityWords);
            		}
            	}
            	
//            	属性标签
            	if(obj.newsType != null && obj.newsType != ''){
            		var attributeContent = '<div class="newsDetailLabel"><div class="box-header"><h2>属性标签<h3></h2></div><div class="listPer box p-right p-left attributeContent p-bottom"></div>';
            		$('.analyzeContent').append(attributeContent);
            		
            		var newsTypeContent = '<div class="listLabel">';
            		for(var count=0;obj.newsType.length>count;count++){
            			if(obj.newsType[count].label.name=='线索'){
                            newsTypeContent += '<a href="javascript:void(0)"><span>新闻线索</span></a>';
                        }else{
                            newsTypeContent += '<a href="javascript:void(0)"><span>'+obj.newsType[count].label.name+'</span></a>';
                        }
            			// newsTypeContent += '<a href="javascript:void(0)"><span>'+obj.newsType[count].label.name+'</span></a>';
            		}
            		newsTypeContent += '</div>';
            		
            		$('.attributeContent').append(newsTypeContent);
            	}
            	
            	if(obj.cusClassificationDetail != null && obj.cusClassificationDetail != ''){
            		var cusClassificationContent = '<div class="listLabel">';
            		for(var i = 0;obj.cusClassificationDetail.length>i;i++){
            			cusClassificationContent += '<a href="javascript:void(0)"><span>'+obj.cusClassificationDetail[i].label.name+'</span></a>';
            		}
            		
            		cusClassificationContent += '</div>';
            		
            		if($('.newsDetailLabel').length >0){
            			$('.attributeContent').append(cusClassificationContent);
            		}else{
            			var attributeContent = '<div class="newsDetailLabel"><div class="box-header"><h2>属性标签<h3></h2></div><div class="listPer box p-right p-left attributeContent"></div>';
                		$('.analyzeContent').append(attributeContent);
                		
                		$('.attributeContent').append(cusClassificationContent);
            		}
            	}
            	
//            	负面指数
//            	sentiment
            	if(obj.sentiment != null && obj.sentiment != ''){
            		if(obj.sentiment.negative != null && obj.sentiment.negative != ''){
            			if(obj.sentiment.negative<40){
                            var contrastVal = 100-obj.sentiment.negative;
						}
						if(obj.sentiment.negative>40){
                            var contrastVal=parseFloat('-'+(obj.sentiment.negative));
						}
            			//var contrastVal = obj.sentiment.negative;
                		var sentimentContent = '';
                		sentimentContent += '<div class="bothSides" >';
                		sentimentContent += '<div class="box-header">';
                		sentimentContent += '<h2>QG指数<h3></h2>';
                        sentimentContent += '</div>';
                        sentimentContent += '<span class="progress_number">'+contrastVal.toFixed(2)+'</span>';
                        sentimentContent+='<div class="qgIndex"><span></span></div>';
                        sentimentContent+='<div class="index"><span>负</span><span>中</span><span>正</span></div>';
                        // sentimentContent += '<div class="bothSidesData box p-right p-left">';
                        // sentimentContent += '<div class="row">';
                        // sentimentContent += '<div class="col-md-3 col-sm-3 col-xs-3 center">';
                        // sentimentContent += '<div class="bothSidesTit ">';
                        // sentimentContent += '<span>正</span>';
                        // sentimentContent += '</div>';
                        // sentimentContent += '</div>';
                        // sentimentContent += '<div class="col-md-6 col-sm-6 col-xs-6 p-right p-left">';
                        // sentimentContent += '<div class="progress_bar">';
        				// sentimentContent += '<div class="pro-bar" >';
        				// sentimentContent += '<small class="progress_bar_title" >';
        				// sentimentContent += '<span class="progress_number">'+contrastVal+'</span>';
                        // sentimentContent += '</small>';
        				// sentimentContent += '<span class="progress-bar-inner"  style="background-color: #F44336;" data-value="36" data-percentage-value="36"></span>';
        				// sentimentContent += '</div>';
        				// sentimentContent += '</div>';
        				// sentimentContent += '</div>';
        				// sentimentContent += '<div class="col-md-3 col-sm-3 col-xs-3 center">';
        				// sentimentContent += '<div class="bothSidesTit bothSidesF">';
        				// sentimentContent += '<span>负</span>';
        				// sentimentContent += '</div></div></div></div></div>';
        					sentimentContent+='</div>';
        				$('.analyzeContent').append(sentimentContent);
                        //判断正负面
                        var val=obj.sentiment.negative;
                        if(val<40){
                            var positive=170+(100-val)/100*180;
                            $('.qgIndex').children().css('left',positive);
                            $('.progress_number').css('margin-left',positive);
                        }
                        if(val>40){
                            var negative=180-val/100*180;
                            $('.qgIndex').children().css('left',negative);
                            $('.progress_number').css('margin-left',negative);
                        }
                      // getindexPosition();
        				//getBothSidesData();
            		}
            		
            	}

        	}
        	
//        	评论分析
        	fnAnalysis(obj.webpageUrl);
        	
        	//词条
    		wiki();
        }
		
	})
	
	
}

//获得相似内容
function getSimilarConData(){
	var webpageCode = $('.webpageCode').val();
	console.log(webpageCode);
	$.ajax({
        url : ctx+'/latest/front/getSameNews',//这个就是请求地址对应sAjaxSource
        data:{'webpageCode':webpageCode},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		var count = 0;
        		if(obj.webpageShowList.length == '0'){
        			++count;
        		}else{
        			content += '<div class="similarNews similarItem"><ul class="relativeList">';
					for(var i = 0;obj.webpageShowList.length>i;i++){
						content += '<li><dl class="dl-horizontal"><dt><span>[新闻]</span></dt><dd class="titleRightClick">';
						content += '<a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.webpageShowList[i].webpageCode+'" data-id="'+obj.webpageShowList[i].newsId+'">'+obj.webpageShowList[i].title+'</a>';
						content += '</dd></dl></li>';
					}
					content += '</ul></div>';
        		}
        		
        		if(obj.imageShowList.length == '0'){
        			++count;
        		}else{
        			content += '<div class="similarImg similarItem"><ul class="relativeList">';
        			for(var i=0;obj.imageShowList.length>i;i++){
        				content += '<li><dl class="dl-horizontal"><dt><span>[图片]</span></dt><dd ><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.imageShowList[i].webpageCode+'" data-id="'+obj.imageShowList[i].newsId+'">'+obj.imageShowList[i].title+'</a></dd></dl></li>';
        			}
        			content += '</ul></div>'
        		}
        		
        		if(obj.vedioShowList.length == '0'){
        			++count;
        		}else{
        			content += '<div class="similarVideo similarItem" ><ul class="relativeList">';
        			for(var i = 0;obj.vedioShowList.length>i;i++){
        				content += '<li ><dl class="dl-horizontal"><dt><span>[视频]</span></dt><dd>';
        				content += '<a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.vedioShowList[i].webpageCode+'">'+obj.vedioShowList[i].title+'</a>';
						content += '</dd></dl></li>';
        			}
					content += '</ul></div>';			
        		}
        		if(count == 3){
        			$('.similarCon').remove();
        		}else{
        			$('.similarCon').removeClass('hide');
        			$('.similarConBox').html(content);
        			
        			$('.similarCon .similarConMore').click(function(){
        				window.open(ctx+'/latest/front/news/relevant/list/'+webpageCode+'/2');
        			})
        		}
        		
        	}
        }
	})
}

//获得相关内容
function getInterrelatedConData(){
	var webpageCode = $('.webpageCode').val();
	console.log(webpageCode);
	$.ajax({
        url : ctx+'/latest/front/getRelevantNews',//这个就是请求地址对应sAjaxSource
        data:{'webpageCode':webpageCode},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		var count = 0;
        		
        		if(obj.eventList.length == '0'){
        			++count;
        		}else{
        			content += '<div class="interrelatedTopic interrelatedItem"><ul class="relativeList">';
        			for(var i = 0;obj.eventList.length>i;i++){
        				content += '<li><dl class="dl-horizontal"><dt><span>[专题]</span></dt><dd class="titleRightClick">';
        				content += '<a target="_blank" href="'+ctx+'/event/front/detail/'+obj.eventList[i].eventCode+'" data-id="'+obj.eventList[i].eventCode+'">'+obj.eventList[i].eventName+'</a>';
					  	content += '</dd></dl></li>';
        			}
        			content += '</ul></div>';
        		}
        		
        		if(obj.webpageShowList.length == '0'){
        			++count;
        		}else{
        			content += '<div class="interrelatedNews interrelatedItem"><ul class="relativeList">';
					for(var i = 0;obj.webpageShowList.length>i;i++){
						content += '<li><dl class="dl-horizontal"><dt><span>[新闻]</span></dt><dd class="titleRightClick">';
						content += '<a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.webpageShowList[i].webpageCode+'" data-id="'+obj.webpageShowList[i].newsId+'">'+obj.webpageShowList[i].title+'</a>';
						content += '</dd></dl></li>';
					}
					content += '</ul></div>';
        		}
        		
        		if(obj.imageShowList.length == '0'){
        			++count;
        		}else{
        			content+='<div class="interrelatedImg interrelatedItem"><ul class="relativeList">';
        			for(var i = 0;obj.imageShowList.length>i;i++){
        				var newImgUrl = getImgUrl(obj.imageShowList[i].picPath,'img'+i);
        				
        				content+='<li><dl class="dl-horizontal"><dt><span>[图片]</span></dt><dd>';
        				content+='<div class="interrelatedImgItem"><p class="interrelatedImgItemImg "><img class="defaultImg" data-index="img'+i+'" src="'+context+'/frontEnd/image/home/default-gray.png"/></p><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.imageShowList[i].webpageCode+'">'+obj.imageShowList[i].title+'</a></div>';
					  	content+='</dd></dl></li>';
        			}
					content+='</ul></div>';					
        		}
        		
        		if(obj.vedioShowList.length == '0'){
        			++count;
        		}else{
        			content+='<div class="interrelatedVideo interrelatedItem"><ul class="relativeList">';
        			for(var i = 0;obj.imageShowList.length>i;i++){
        				var newImgUrl = getImgUrl(obj.imageShowList[i].picPath,'video'+i);
        				content+='<li><dl class="dl-horizontal"><dt><span>[视频]</span></dt><dd>';
        				content+='<div class="interrelatedVideoItem"><p class="interrelatedVideoItemVideo"><img class="defaultImg" data-index="video'+i+'" src="'+context+'/frontEnd/image/home/default-gray.png"/></p><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.imageShowList[i].webpageCode+'">'+obj.imageShowList[i].title+'</a></div>';
					  	content+='</dd></dl></li>';
        			}
					content+='</ul></div>';	
        		}
        		
        		if(count == 4){
        			$('.interrelatedCon').remove();
        		}else{
        			$('.interrelatedCon').removeClass('hide');
        			$('.interrelatedConBox').html(content);
        			$('.interrelatedConBox').judgeImgLoadError();
        			
        			$('.interrelatedCon .interrelatedConMore').click(function(){
        				window.open(ctx+'/latest/front/news/relevant/list/'+webpageCode+'/1');
        			})
        		}
        	}
        }
	})
}

function getImgUrl(imgUrl,code){
	var newImgUrl='';
	$.ajax({
        url :inewsImageManager+imgUrl +'&width=320&height=180&fill=0xffffff',//这个就是请求地址对应sAjaxSource
        data:{code:code},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == 'success'){
        		$('img[data-index="'+data.code+'"]').attr('src',data.value).removeClass('defaultImg');
        		newImgUrl = data.value;
        	}else{
        		$('img[data-index="'+data.code+'"]').attr('src',context+'/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange');
        	}
        },
        error : function(msg) {
        }
	});
	return newImgUrl;
}

function getBothSidesData(){
	
    var val=$('.progress_number').text();
    $('.bothSidesTit').eq(1).removeClass('bothSidesF');
    $('.bothSidesTit').eq(0).addClass('bothSidesF');
    if(val.replace('%','')<40){
        $('.bothSidesTit').eq(0).removeClass('bothSidesF').find('span').css({
        	'backgroundColor':'green'
        });
        $('.progress-bar-inner').css({
        	'backgroundColor':'green'
        })
        $('.bothSidesTit').eq(1).addClass('bothSidesF');
    }else if(val.replace('%','')<60){
        $('.bothSidesTit').eq(0).addClass('bothSidesF');
        $('.bothSidesTit').eq(1).addClass('bothSidesF');
        $('.progress-bar-inner').css({
        	'backgroundColor':'hsl(0, 0%, 88%)'
        })
    }else{
    	 $('.bothSidesTit').eq(1).removeClass('bothSidesF');
         $('.bothSidesTit').eq(0).addClass('bothSidesF');
    }
    $('.progress-bar-inner').css('width',val);
}

/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.summaryCon').height()>115){
        $('.summaryCon').css({
            'height':115,
        });
        var $summaryCon = $('.summaryCon');
            $summaryCon.append( ' <a class="toggle" href="#"><span class="open">[展开]</span><span class="close1">[收起]</span></a>' );
            function createDots()
            {
                $summaryCon.dotdotdot({
                    after: 'a.toggle',
                    wrap: 'letter'
                });
            }
            function destroyDots() {
                $summaryCon.trigger( 'destroy' );
            }
            createDots();
            $summaryCon.on(
                'click',
                'a.toggle',
                function() {
                    $summaryCon.toggleClass( 'opened' );

                    if ( $summaryCon.hasClass( 'opened' ) ) {
                        destroyDots();
                        $('.summaryCon').attr('style','');
                    } else {
                    	$('.summaryCon').css({
                            'height':115,
                        });
                        createDots();
                        
                    }
                    return false;
                }
            );
    }
    
}


/**
 * 高亮显示
 */
function highlight(word) {

    var str = $("#newsContent").html();
    var pattern = new RegExp(word, "mg");
    var pool = [];
    var i = 0;
    str = str.replace(/<[\/]{0,1}[a-z]+[^>]*>/img,
    function() {
        pool[pool.length] = arguments[0];
        return "\x00"
    }).replace(pattern, "<span style=\"color:red\">" + word + "</span>").replace(/\x00/mg,
    function() {
        return pool[i++]
    })
    $("#newsContent").html(str);
}

	
/*
 * 词条
 */
function wiki(){
	var words = "";
	$(".dictionaryWord").each(function(){
		if("" == words){
			words += $(this).text();
		}else{
			words += ","+$(this).text();
		}
	 });
	if(""!=words.trim()){
		$.ajax({
			type : "get",
			async : true, //同步执行 
				url : ctx+"/lemma/checkDictionary?names="+words,
			dataType : "json", //返回数据形式为json
			success : function(data) {
				if(null != data){
					console.log(data);
					if(data.result){
						var obj = data.resultObj;
						
						var entityWords = $("#entityWordsDiv").html();
						//console.log(entityWords);
						for (var i = 0; i < obj.length; i++) {
							var name = obj[i].lemmaTitle;
							var pageId = obj[i].lemmaId;
							var newWord = '<a href="'+obj[i].url+'" target="_blank" class="dictionaryWord wikiWord"><span class="modal_incident">'+name+'</span></a>';
							//console.log(newWord);
							entityWords = entityWords.replace(new RegExp('<span>'+name+'</span>', 'g'),newWord);

						}

						$("#entityWordsDiv").html(entityWords);

                         $('.wikiWord').prev().remove();
                        // var a=$('.wikiWord').html();
                        //console.log(a);
					}
					
					
				}
				
			},
			error : function(errorMsg) {
				
			}
		});
	}
}

/*
 * 查询词条
 */
function dictionaryOpen(id,type){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/dictionary/front/getDictionaryById?pageId="+id+"&type="+type,
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null != data){
				var title = data.name;
				var content = "";
				var dic = data.detail;
				if("zgzy"==data.type){
					content = '<B>人物详情</B><div style="margin-top:10px;martin-bottom:10px"><div class="col-sm-3" style="height:190px;"><img src="'+dic.picPath+'"  style="width:150px;height:190px" /></div><div class="col-sm-9" style="height:190px;">'
							+'<p>'+dic.position+'</p>'
							+'<div class="col-sm-3">出生年月：</div><div class="col-sm-3">'+dic.birthday+'</div>'
			      			+'<div class="col-sm-3">性别：</div><div class="col-sm-3">'+dic.sex+'</div>'
			      			+'<div class="col-sm-3">籍贯：</div><div class="col-sm-3">'+dic.hometown+'</div>'
			      			+'<div class="col-sm-3">民族：</div><div class="col-sm-3">'+dic.nation+'</div>'
			      			+'<div class="col-sm-3">毕业院校：</div><div class="col-sm-3">'+dic.school+'</div>'
			      			+'<div class="col-sm-3">学位/学历：</div><div class="col-sm-3">'+dic.degree+'</div>'
							+'</div></div><B>主要经历</B><div style="clear:both;margin-top:10px">'+dic.resume+'</div>';
				}else if("wiki"==data.type){
					content = dic.dictionary.cleanText;
				}
				$("#dictionary_title").html(title);
				$("#dictionary_content").html(content);
				$("#dictionaryModal").modal('show');
			}
		},
		error : function(errorMsg) {
			
		}
	});
}

/*改变字体大小*/
function changeFontStyle(){
	$('.changeFontStyle').find('select').change(function(){
		if($(this).val() == '小号'){
			$('.newsDetailText').css({
				'fontSize':'14px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'28px',
				'marginTop':'10px',
			});
			
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'28px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'28px',
			});
		}else if($(this).val() == '中号'){
			$('.newsDetailText').css({
				'fontSize':'18px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'32px',
				'marginTop':'25px',
			});
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'32px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'32px',
			});
		}else if($(this).val() == '大号'){
			$('.newsDetailText').css({
				'fontSize':'20px'
			});
			$('.newsDetailText').find('p').css({
				'lineHeight':'40px',
				'marginTop':'25px',
			});
			$('.newsDetailText').find('.uec_inews_picture_group_description').css({
				'lineHeight':'40px',
			});
			$('.newsDetailText').find('.pic_content').css({
				'lineHeight':'40px',
			});
			
		}
	});
}


//新闻收藏
function collect(){
	$('.collect').each(function(){
		$(this).click(function(){
			var $this = $(this);
			var $thisCon = $this.html();
			$this.html('<div style="color:#F44336" class="la-timer la-sm"><div></div></div>&nbsp;收藏中...')
			
			var webpageCode = $(this).attr('data-id');
			$().judgeKeep({
				'dataUrl':ctx+'/latest/front/collectingNews',
				'dataParam':{'webpageCode':webpageCode,'type':1},
				'callback':function(data){
					$this.html($thisCon);
					if(data.result){
						if($this.hasClass('active')){
							$('.collect').removeClass('active');
							$('.collect').find('i').attr('class','fa fa-heart-o');
						}else{
							$('.collect').addClass('active');
							$('.collect').find('i').attr('class','fa fa-heart');
						}
					}
				}
			})
		})
	})
}


//微信分享二维码生成
function shareWx(){
	$('.socialShare').find('a.weixin').click(function(){
		
		//设置 qrcode 参数
		var qrcode = new QRCode('qrcode', {
//		    width: 256,
//		    height: 256,
		    colorDark: '#000000',
		    colorLight: '#ffffff',
//		    correctLevel: QRCode.CorrectLevel.H
		});
		
		//获得当前域名
		var txtUrl = window.location.host;
		$('.socialShare').addClass('hide');
		
		qrcode.makeCode('http://'+txtUrl+'/data/wechat/gotoappnewsdetail/'+$('.webpageCode').val());
	})
}

//判断当前新闻是否可以评论分析
function judgeUrl(url){
	$.ajax({
        url :ctx+'/latest/front/newsUrlCheck',
        data:{'url':url},
        type : 'get',
        dataType : 'json',
        async : true,
        traditional: true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		if(data.resultObj){
        			$('.analysisBox').removeClass('hide');
//        			获取当前评论分析状态
        			getAnalysisStatus();
        		}else{

        			return;
        		}
        	}
        }
     })
}
//获得当前评论分析的状态
function getAnalysisStatus(){
	
	var codes = [];
	var _$this = $(this);
	codes.push($('.webpageCode').val());
	
	$.ajax({
        url :ctx+'/latest/front/newsAnalysisStatusByWebpageCodes',
        data:{'webpageCodeList':codes},
        type : 'get',
        dataType : 'json',
        async : true,
        traditional: true,
        success : function(data) {
        	console.log(data);
        	
        	if(data.result){
        		var obj = data.resultObj;
        		if(obj.length>0){
        			for(var i = 0;i<obj.length;i++){
//        				分析状态：0正在分析，1分析完成，2分析异常，3暂未分析
        				if(obj[i].status == 0){
        					var analysisHtml = '<button type="button" class="btn btn-red analysisBtn" data-status="analysising">正在分析...</button>';
        					$('.analysisCon').html(analysisHtml);
        					if(obj[i].time == 0){//爬虫还未返回时间
        						analysisHtml = '<button type="button" class="btn btn-red analysisBtn" data-status="analysising">正在分析...</button>';
        						$('.analysisCon').html(analysisHtml);
        						setTimeout(getAnalysisStatus,30000);
        					}else{
        						var expectTime = new Date(obj[i].time);
        						var nowTime = new Date();
        						
        						if(nowTime > obj[i].time){
    	                			analysisHtml += '请耐心等待！';
    	            			}else{
    	            				analysisHtml += '预计 '+expectTime.formatDate('MM-dd hh:mm')+' 分析完成！';
    	            			}
        						
        						$('.analysisCon').html(analysisHtml);
        					}
        					
        				}else if(obj[i].status == 1){
        					var analysisHtml = '<button type="button" class="btn btn-red analysisBtn" data-status="analysised">重新分析</button>';
            				if($('.comment').val() == '0'){
            					analysisHtml += '<button type="button" class="btn btn-red analysisResult">查看评论分析结果</button>';
            					$('.analysisCon').html(analysisHtml);
            					showAnalysisResult();
            				}else{
            					$('.analysisCon').html(analysisHtml);
            					var time = new Date(obj[i].time);
            					$('.analysisDetail').find('p.time').removeClass('hide').find('span').html(time.formatDate('MM-dd hh:mm'));
//            					$('.analysisDetail').find('p.num').removeClass('hide').find('span').html(obj[i].commentNum);
//                            	热门评论、最新评论
                            	showCommentTable($('.webpageCode').val());
            				}
        				}else if(obj[i].status == 2){
        					var analysisHtml = '<button type="button" class="btn btn-red analysisBtn" data-status="analysised">重新分析</button>&nbsp;<button type="button" class="btn btn-red" data-status="">分析异常</button>';
            				$('.analysisCon').html(analysisHtml);
        				}else if(obj[i].status == 3){
        					var analysisHtml = '<button type="button" class="btn btn-red analysisBtn" data-status="analysis">评论分析</button>';
            				$('.analysisCon').html(analysisHtml);
        				}
        			}
        			
        		}
        		
//        		进行评论分析
        		fnAnalysis(anaylsisUrl);
        	}
        	
        }
	})
	
//	获取评论分析时间
	showAnalysisTime();
}

//进行评论分析
function fnAnalysis(url){
	
	var analysisStatus = $('.analysisBtn').attr('data-status');
	var dataUrl = '';
	if(analysisStatus == 'analysis'){
		dataUrl = ctx+'/latest/front/addNewsAnalysis';
	}else if(analysisStatus == 'analysised'){
		dataUrl = ctx+'/latest/front/newsAnalysisAgain';
	}else{
		dataUrl = ctx+'/latest/front/newsAnalysisAgain';
	}
	
	$('.analysisBtn').click(function(){
		
		var _$this = $(this);
		$.ajax({
            url :dataUrl,
            data:{'url':url},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
            	console.log(data);
            	if(data.result == true){
            		var obj = data.resultObj;
            		if(obj.result == 'failed'){
            			$().toastmessage('showToast', {
		                	text: obj.reason,
		               		sticky: false,
		                    position : 'bottom-right',
		                    type: 'error',
		            	});
	            	}else{
	            		_$this.html('正在分析...');
	            		
//	            		获取分析时间
	            		getAnalysisStatus(url);
	            	}
            	}
            }
		})
	})
}


//查看评论分析结果
function showAnalysisResult(){
	$('.analysisResult').click(function(){
		
//    	热门评论、最新评论
    	showCommentTable($('.webpageCode').val());
    	$(this).addClass('hide');
	})
}

//查看评论分析时间
function showAnalysisTime(){
	if(orgUrl != ''){
		$.ajax({
	        url :ctx+'/latest/front/newsAnalysisCreateTime',
	        data:{'url':orgUrl},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        traditional: true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		var obj = data.resultObj;
	        		for(var key in obj){
	        			if(obj[key] == 0){
	        				$('.analysisDetail').find('.time').addClass('hide')
	        			}else{
	        				var anatime = new Date(obj[key]);
		        			$('.analysisDetail').find('.time').removeClass('hide').find('span').html(anatime.formatDate('MM-dd hh:mm'));
	        			}
	        			
	        		}
	        	}else{
	        		$('.analysisDetail').find('.time').addClass('hide')
	        	}
	        }
		})
	}
	
}

/**
 * 热门评论量table的获取值
 * 当获得的值的条数为0时，热门评论、典型意见、网络评论统计是不显示的
 * @param sSource
 * @param aoData
 * @param fnCallback
 */
function retrieveDataHot(sSource, aoData, fnCallback) {
	$.ajax({
	  url : sSource,//这个就是请求地址对应sAjaxSource
	  data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
	  type : 'get',
	  dataType : 'json',
	  async : true,
	  success : function(data) {
	  	if(0==data.resultObj.iTotalRecords){
	  		$('.newsDetailComment').addClass('hide');
	  	}else{
	  		$('.newsDetailComment').removeClass('hide');
	  		
	  		hotCommentWords(); //热门评论词
	  		reportCountData($('.webpageCode').val()); ///*典型意见*/
	  		webCommentCount(); //网络评论统计
	  	}
	     fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
	  },
	  error : function(msg) {
	  }
	});
}

//热门评论、最新评论
function showCommentTable(webpageCode){
	
	$('.commentHotConTable1').DataTable({
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/hot/front/pageHotComment/'+webpageCode,//服务器请求
    	fnServerData : retrieveDataHot,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'iDisplayLength' : 10,
		fnServerParams : function ( aoData ) {
        },
        "rowCallback" : function(row, data, index) {
        	
        	var username = data.userName;
        	if(null == username || ''== username.trim()){
        		username = data.ip;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('MM-dd hh:mm');
        	var content = '<dl class="dl-horizontal m-bottom"><dt><div></div></dt><dd><div class="WB_text" ><a href="javascript:void(0)">'+username+'：</a>'+data.content+'</div><p><span>'+releaseDatetime+'</span><em>|</em><i class="fa fa-thumbs-o-up"></i><span>'+data.vote+'</span></p></dd></dl>';
        	$('td:eq(0)', row).html(content);
        },
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
	
	$('.commentHotConTable2').DataTable({
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/hot/front/pageLatestComment/'+webpageCode,//服务器请求
    	fnServerData : retrieveDataHot,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'iDisplayLength' : 10,
		fnServerParams : function ( aoData ) {
        },
        "rowCallback" : function(row, data, index) {
        	var username = data.userName;
        	if(null == username || ''== username.trim()){
        		username = data.ip;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('MM-dd hh:mm');
        	var content = '<dl class="dl-horizontal m-bottom"><dt><div></div></dt><dd><div class="WB_text" ><a href="javascript:void(0)">'+username+'：</a>'+data.content+'</div><p><span>'+releaseDatetime+'</span><em>|</em><i class="fa fa-thumbs-o-up"></i><span>'+data.vote+'</span></p></dd></dl>';
        	$('td:eq(0)', row).html(content);
        },
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
}

//热门评论词
function hotCommentWords(){
	var webpageCode = $('.webpageCode').val();
	var countSun = 0;
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/gethotcommententity",
		data: {'webpageCode': webpageCode},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			console.log(data);
			if(data.result == true){
				var obj = data.resultObj;
				var content = '';
				var count = 0;
//				相关人物
//				if(obj.personNameList == null){
//					++count;
//				}else{
//					if(obj.personNameList.length == '0'){
//						++count;
//					}else{
//						content += '<div class="listLabel" ><dl class="dl-horizontal m-bottom" ><dt><a href="javascript:void(0)" class="set">相关人物</a></dt><dd>';
//						
//						for(var i=0;obj.personNameList.length>i;i++){
//							content += '<a href="javascript:void(0)"><span>'+obj.personNameList[i].word+'</span></a>&nbsp;';	
//						}
//						content += '</dd></dl></div>';
//					}
//				}
				
//				相关机构
				if(obj.orgNameList == null){
					++count;
				}else{
					if(obj.orgNameList.length == '0'){
						++count;
					}else{
						content += '<div class="listLabel" ><dl class="dl-horizontal m-bottom" ><dt><a href="javascript:void(0)" class="set">相关机构</a></dt><dd>';
						
						for(var i=0;obj.orgNameList.length>i;i++){
							content += '<a href="javascript:void(0)"><span>'+obj.orgNameList[i].word+'</span></a>&nbsp;';	
						}
						content += '</dd></dl></div>';
					}
				}
				
				
//				相关单位
				if(obj.companyNameList == null){
					++count;
				}else{
					if(obj.companyNameList.length == '0'){
						++count;
					}else{
						content += '<div class="listLabel" ><dl class="dl-horizontal m-bottom" ><dt><a href="javascript:void(0)" class="set">相关单位</a></dt><dd>';
						
						for(var i=0;obj.companyNameList.length>i;i++){
							content += '<a href="javascript:void(0)"><span>'+obj.companyNameList[i].word+'</span></a>&nbsp;';	
						}
						content += '</dd></dl></div>';
					}
				}
				
				
//				相关地点
				if(obj.locationList == null){
					++count;
				}else{
					if(obj.locationList.length == '0'){
						++count;
					}else{
						content += '<div class="listLabel" ><dl class="dl-horizontal m-bottom" ><dt><a href="javascript:void(0)" class="set">相关地点</a></dt><dd>';
						
						for(var i=0;obj.locationList.length>i;i++){
							content += '<a href="javascript:void(0)"><span>'+obj.locationList[i].word+'</span></a>&nbsp;';	
						}
						content += '</dd></dl></div>';
					}
				}
				
				if(count == 3){
					++countSun;
					$('.hotCommentWord').addClass('hide');
				}else{
					$('.relativeComment').removeClass('hide');
					//$('.relativeComment .listPer').html(content);
				}
				
			}
		}
	});
	
//	词云
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/wordCloud",
		data: {'webpageCode': webpageCode},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data || data.length == 0){
				$(".hotCommentWordCon").remove();
				++countSun;
			}else{
				commentWordCloud(data);
			}
		},
		error : function(errorMsg) {
			console.log("词云图表请求数据失败啦!");
		}
	});
	
	if(countSun == 2){
		$('.hotCommentWord').addClass('hide');
	}else{
		$('.hotCommentWord').removeClass('hide');
	}
	
}

/*热门评论词*/
function commentWordCloud(data){

	var hotCWChart = echarts.init(document.getElementById('hotCWEcharts'));
	var hotCWOption = {
		backgroundColor : '#f9f9f9',
	    tooltip: {},
	    series: [{
	        type: 'wordCloud',
	        gridSize: 20,
	        sizeRange: [12, 50],
	        textRotation : [ 0, 30, 90, -30 ],
	        textPadding : 10,
	        shape: 'square',
	        left: 'center',
	        top: 'center',
	        width: '95%',
	        height: '95%',
	        right: null,
        	bottom: null,
	        textStyle: {
	            normal: {
	                color: function() {
	                    return 'rgb(' + [
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160)
	                    ].join(',') + ')';
	                }
	            },
	        },
	        data: data
	    }]
	};
	hotCWChart.setOption(hotCWOption);
};


/*典型意见取数据*/
function reportCountData(webpageCode){
	
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/typicalOption",
		data: {
			webpageCode : webpageCode
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.optionList == '' || data.optionList.length == 0 ){
				$('.typicalOpinion').addClass('hide');
			}else{
				$('.typicalOpinion').removeClass('hide');
				reportCount(data);
			}
			
		},
		error : function(errorMsg) {
			console.log("典型意见图标请求数据失败啦!");
		}
	});
}
/*典型意见*/
function reportCount(data){
	var rCChart = echarts.init(document.getElementById('reportCountCharts'));
	var rCOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		grid : {
			left : '0%',
			right : '10%',
			bottom : '5%',
			top : '5%',
			containLabel : true
		},
		xAxis : {
			type : 'value',
			boundaryGap : [ 0, 0.01 ],
			position : 'top',
			name : ''
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            formatter: function(value, index){
	            	var valueStr = '';
	            	if(value.length>8){
	            		valueStr = value.substring(0,8)+'...';
	            	}else{
	            		valueStr = value;
	            	}
	            	return valueStr
	            },
	            textStyle:{
	            	fontFamily:'Microsoft Yahei'
	            }
	        },
			data : data.optionList,
		},
		series : [ {
			name : '典型意见',
			type : 'bar',
			data : data.countList,
			barMaxWidth:'20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'right',
                }
            },
		}, ]
	};
	rCChart.setOption(rCOption);
}


//网络评论统计
function webCommentCount(){
	var webpageCode = $('.webpageCode').val();
//	日期
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/dayHoursCount",
		data: {'webpageCode': webpageCode},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.count.length == 0 || data.count==''){
				/*隐藏日期为空*/
				$('.reportCountDate').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$('#list_mark').find('.list1:eq(0)').css({
					'display':'block',
				});
			}else{
				$('.reportCount').removeClass('hide');
				$('#commentCountCharts').css({
					'width':$('.reportCountBox').width(),
				});
				commentCountCharts(data);
			}
			
		},
		error : function(errorMsg) {
			/*alert(0);*/
			console.log("五日报道量图表请求数据失败啦!");
		}
	});
	
//	地域
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/commentArea",
		data: {webpageCode : webpageCode},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data || data.length == 0){
				/*隐藏内容为空的区域*/
				$(".reportCountBox").find(".reportCountArea").remove();
			}else{
				$('.reportCount').removeClass('hide');
				$('#cAEchartsMap').css({
					'width':$('.reportCountBox').width(),
				});
				cAEchartsMap(data);
			}
		},
		error : function(errorMsg) {
			console.log("评论区域图表请求数据失败啦!");
		}
	});
	
//	情感
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/hot/front/sentiment",
		data: {'webpageCode': webpageCode},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.neutralCount == 0 && data.positiveCount ==0 && data.negativeCount ==0){
				//隐藏图表
				$('.reportCountEmotion').remove();
				$('#list_mark').find('b:eq(0)').addClass('active');
				$('#list_mark').find('.list1:eq(0)').css({
					'display':'block',
				});
			}else{
				$('.reportCount').removeClass('hide');
				
				$('#emotionAnalyzeEchart').css({
					'width':$('.reportCountBox').width(),
				});
				
				emotionAnalyze(data);
			}
		},
		error : function(errorMsg) {
			console.log("情感分析图表请求数据失败啦!");
		}
	});
}

/*网络评论统计-日期*/
function commentCountCharts(data){
	var cAChart = echarts.init(document.getElementById('commentCountCharts'));
	var cAEchartsOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		toolbox : {
			orient : 'horizontal',
			
			right:'3%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true,
					title:'存为图片'
				}
			}
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '5%',
			top : '20%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			/*name : '日期',*/
			data : data.dayHour,
		} ],
		yAxis : [ {
			type : 'value',
			min : 0,
//			max : 2500,
//			interval : 500,
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '评论数(个)',
			type : 'bar',
			data : data.count,
			/*barWidth : '30%',*/
			barMaxWidth:'20px',
			barGap:'10px',
			markPoint : {
				data : [ {
					type : 'max',
					name : '最大值'
				}, ]
			},
		} ]
	};
	cAChart.setOption(cAEchartsOption);
}

/*网络评论统计-地域*/
function randomData() {
    return Math.round(Math.random()*500);
}
function cAEchartsMap(data){
	var cAEchartsMapWidth;
	if($('#commentCountCharts').width()==null || $('#commentCountCharts').width()==''){
		if($('#cAEchartsMap').width()==null || $('#cAEchartsMap').width()==''){
			if($('#emotionAnalyzeEchart').width()==null || $('#emotionAnalyzeEchart').width()==''){
				
			}else{
				cAEchartsMapWidth = $('#emotionAnalyzeEchart').width();
			}
		}else{
			cAEchartsMapWidth = $('#cAEchartsMap').width();
		}
	}else{
		cAEchartsMapWidth = $('#commentCountCharts').width();
	}
	$('#cAEchartsMap').css({
		'width':cAEchartsMapWidth,
	});
	var cAChart = echarts.init(document.getElementById('cAEchartsMap'));
	var cAChartOption = {
		tooltip : {
			trigger : 'item',
		},
		visualMap : {
			min : 0,
			max : 500,
			x : 'left',
			y : 'bottom',
			text : [ '高', '低' ], // 文本，默认为数值文本
			calculable : true,
			color : [ 'red', '#f5d47a' ],
			itemWidth:'10',
			itemHeight:'100',
		},
		toolbox : {
			show : true,
			orient : 'horizontal',
			right:'3%',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					lang:[' ', '关闭', '刷新'],
					readOnly : true,
					buttonColor : '#F44336',
					optionToContent : function(opt) {
						var series = opt.series[0].data;
						for ( var i = 0; i < series.length; i++) {
							for ( var j = i; j < series.length; j++) {
								if (parseInt(series[i].value) < parseInt(series[j].value)) {
									var serVal = series[i];
									series[i] = series[j];
									series[j] = serVal;
								}
							}
						}
						var table = '<div style="width:100%;height:100%;overflow-y:scroll;margin-top:20px;"><table class="table" style="width:100%;"><tbody>'
						for ( var i = 0, l = 8; i < l; i++) {
							table += '<tr>' + '<td>' + series[i].name + '：'
									+ series[i].value + '</td>' + '<td>'
									+ series[i + 9].name + '：'
									+ series[i + 9].value + '</td>'
									+ '<td>' + series[i + 18].name + '：'
									+ series[i + 18].value + '</td>'
									+ '<td>' + series[i + 26].name + '：'
									+ series[i + 26].value + '</td>'
									+ '</tr>';
						}
						table += '<tr>' + '<td>' + series[8].name + '：'
								+ series[8].value + '</td>' + '<td>'
								+ series[17].name + '：' + series[17].value
								+ '</td>' + '<td></td><td></td>'
								+ '</tr></tbody></table></div>';
						return table;
					}
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true,
					title:'存为图片'
				}
			}
		},
		series : [
		{
			name : '评论',
			type : 'map',
			mapType : 'china',
			top : '12%',
			bottom : '11%',
			left : '3%',
			right : '3%',
			roam : false,
			itemStyle : {
				normal : {
					label : {
						show : false
					},
					areaStyle : {
						color : '#11EEEE'
					},
					color : 'rgba(255,0,255,0.8)'
				},
				emphasis : {
					label : {
						show : true
					}
				}
			},
			data:data,
		} ]
	};
	cAChart.setOption(cAChartOption);
}

/*网络评论统计-情感*/
function emotionAnalyze(data){
	var emotionAnalyzeWidth;
	if($('#commentCountCharts').width()==null || $('#commentCountCharts').width()==''){
		if($('#cAEchartsMap').width()==null || $('#cAEchartsMap').width()==''){
			if($('#emotionAnalyzeEchart').width()==null || $('#emotionAnalyzeEchart').width()==''){
				
			}else{
				emotionAnalyzeWidth = $('#list_mark').width();
			}
		}else{
			emotionAnalyzeWidth = $('#cAEchartsMap').width();
		}
	}else{
		emotionAnalyzeWidth = $('#commentCountCharts').width();
	}
	
	$('#emotionAnalyzeEchart').css({
		'width':emotionAnalyzeWidth,
	});
	var eAChart = echarts.init(document.getElementById('emotionAnalyzeEchart'));
	var eAOption = {
		color : [ '#c23531', '#2f4554', '#61a0a8', ],
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		legend : {
			orient : 'vertical',
			x : 'right',
			top : '2%',
			data : [ '正面指数', '中性指数', '负面指数' ],
		},
		series : [ {
			name : '情感分析',
			type : 'pie',
			center:['50%','50%'],
			radius : [ '30%', '45%' ],
			label : {
				normal : {
					show : true,
					formatter : "{d}%",
					textStyle : {
						fontSize : 14
					}
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					},
				}
			},
			labelLine : {
				normal : {
					show : true
				}
			},
			itemStyle : {
				normal : {
					areaStyle : {
						color : '#F44336'
					},
				},
			},
			data : [ {
				value :data.positiveCount,
				name : '正面指数'
			}, {
				value : data.neutralCount,
				name : '中性指数'
			}, {
				value : data.negativeCount,
				name : '负面指数'
			}, ]
		} ]
	};
	eAChart.setOption(eAOption);
}
