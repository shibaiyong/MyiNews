//var ctx="/ns";
var picliSun = 0;
$(function(e) {
    /* 头部导航高亮 */
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.home'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	// 热点发现: 地区（多选）
	$().getSignleData({
		getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigRegion', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listRegion', //请求路径
		boxClassName: '.srceenMap',
		ulClassName: '#srceenMapPro',
		level: 1,
		multiSelect: true,
	})	
	// 热点发现: 分类（多选）
	$().getSignleData({
		getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigClassification', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listNewsClassification', //请求路径
		boxClassName: '.srceenClassification',
		ulClassName: '#srceenClassificationPro',
		level: 1,
		multiSelect: true,
	})
	// 首页-热点发现时间
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/getClusterFre',  //请求路径
		boxClassName:'.srceenClusterFre',
		ulClassName:'#srceenClusterFrePro',
		inter:false
	})

	//首页-新闻线索: 地区（多选）
	$().getData({
		getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigRegion', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listRegion', //请求路径
		boxClassName: '.threadSrceenMap',
		ulClassName: '#threadSrceenMapPro',
		level: 2,
		multiSelect: true,
	})
	// 首页-新闻线索分类（多选）
	$().getData({
		getAjaxUserConfigUrl: ctx + '/config/front/listUserConfigClassification', //请求路径(用户配置的数据)
		getAjaxUrl: ctx + '/common/dic/front/listNewsClassification', //请求路径
		boxClassName:'.threadSrceenClassification',
		ulClassName:'#threadSrceenClassificationPro',
		level: 2,
		multiSelect: true,
	})
//	首页-网站排行-新闻
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listWebs',  //请求路径
		boxClassName:'.srceenWeb',
		ulClassName:'#srceenWebPro',
		inter:false
	})
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listWebs',  //请求路径
		boxClassName:'.srceenWeb2',
		ulClassName:'#srceenWeb2Pro',
		inter:false
	})
//	首页-网站排行-点击榜
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listRankingType',  //请求路径
		boxClassName:'.srceenList1',
		ulClassName:'#srceenList1Pro',
		inter:false
	})
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listRankingType',  //请求路径
		boxClassName:'.srceenList2',
		ulClassName:'#srceenList2Pro',
		inter:false
	})
//	首页-网站排行-时间
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listRankingCycle',  //请求路径
		boxClassName:'.srceenListPeriod1',
		ulClassName:'#srceenListPeriod1Pro',
		inter:false
	})
	$().getSignleData({
		getAjaxUrl:ctx+'/common/dic/front/listRankingCycle',  //请求路径
		boxClassName:'.srceenListPeriod2',
		ulClassName:'#srceenListPeriod2Pro',
		inter:false
	})
	
	// 今日数据采集
	dataStatistics();
	
	headLinesData(); //媒体头条
	
	//点击新闻线索-地区刷新列表
	// $('#threadSrceenMapPro').click(function (event) {
	// 	var threadObj = {};
	// 	threadObj.classificationVal = $('.srceenClassification h2').attr('data-innerid');
	// 	threadObj.regions = $('.threadSrceenMap h2').attr('data-innerid');
	// 	var event = event || window.event;
	// 	var className = event.target.className;
	// 	if (className == 'multiSure') {
	// 		newsClue(threadObj);
	// 		return false;
	// 	}		
	// })
	// //点击新闻线索-分类刷新列表
	// $('#threadSrceenClassificationPro').click(function (event) {
	// 	var threadObj = {};
	// 	threadObj.classificationVal = $('.srceenClassification h2').attr('data-innerid');
	// 	threadObj.regions = $('.threadSrceenMap h2').attr('data-innerid');
	// 	var event = event || window.event;
	// 	var className = event.target.className;
	// 	if (className == 'multiSure') {
	// 		newsClue(threadObj);
	// 		return false;
	// 	}
	// })

	//新闻线索：地区(多选)、分类(多选)
	window.reloadData = function () {
		var threadObj = {};
		threadObj.classificationVal = $('.srceenClassification h2').attr('data-innerid');
		threadObj.regions = $('.threadSrceenMap h2').attr('data-innerid');
		newsClue(threadObj);
		return false;
	};
	// 热点发现(样式)
    $('.clusterScreen').find('.srceenMap').removeClass('hide');
    $('.clusterScreen').find('.srceenClassification').removeClass('hide');
    var screenIndex = 0;
    $('.clusterScreen').find('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 125 * screenIndex;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex;
		}
	})
	// 新闻线索(样式)
	$('.threadSrceenBox').find('.threadSrceenMap').removeClass('hide');
	$('.threadSrceenBox').find('.threadSrceenClassification').removeClass('hide');
	var threadScreenIndex = 0;
	$('.threadSrceenBox').find('.subpage').each(function () {
		if ($(this).hasClass('hide')) {
			return;
		} else {
			var mlLeft = 125 * threadScreenIndex;
			$(this).css({
					'marginLeft': mlLeft + 'px',
				})
				++threadScreenIndex;
		}
	})
	
	// 延时1000执行，待用户定制的参数渲染之后再执行此方法
	setTimeout(function () {
		getClusterData(clusterParam()); //热点发现
		//	新闻线索
		var threadObj = {};
		threadObj.classificationVal = $('.srceenClassification h2').attr('data-innerid');
		threadObj.regions = $('.threadSrceenMap h2').attr('data-innerid');
		newsClue(threadObj);
	}, 3000);
 	//	点击热点发现-地区刷新列表
	// $('#srceenMapPro').click(function (event) {
	// 	var event = event || window.event;
	// 	var className = event.target.className;
	// 	if (className == 'multiSure') {
	// 		getClusterData(clusterParam());
	// 		return false;
	// 	}
	// })
	// //点击热点发现-分类刷新列表
	// $('#srceenClassificationPro').click(function (event) { 
	// 	var event = event || window.event;
	// 	var className = event.target.className;
	// 	if (className == 'multiSure') {
	// 		getClusterData(clusterParam());
	// 		return false;
	// 	}
	// })
	//热点发现：地区(多选)、分类(多选)
	window.signleReloadData = function () {
		getClusterData(clusterParam());
		return false;
	};
	
//	网站新闻排行1
	var screenIndex1 = 0;
    $('.hotRanking1').find('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 95 * screenIndex1;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex1;
		}
	})
	
	hotNewsRanking1(hotNewsRankingParams1()); //网站新闻排行1数据获取
	
    $('#srceenWebPro').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking1(hotNewsRankingParams1());
		return false;
	})
	$('#srceenList1Pro').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking1(hotNewsRankingParams1());
		return false;
	})
	$('#srceenListPeriod1').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking1(hotNewsRankingParams1());
		return false;
	})
	//	网站新闻排行2
	var screenIndex2 = 0;
    $('.hotRanking2').find('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 95 * screenIndex2;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex2;
		}
	})
	
	hotNewsRanking2(hotNewsRankingParams2());
    
    $('#srceenWeb2Pro').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking2(hotNewsRankingParams2());
		return false;
	})
	$('#srceenList2Pro').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking2(hotNewsRankingParams2());
		return false;
	})
	$('#srceenListPeriod1').click(function(){ //	点击热点发现-分类刷新列表
    	hotNewsRanking2(hotNewsRankingParams2());
		return false;
	})
	
//	新闻日历
	$(".homeHistoryTom .homeHistoryTomTable").mCustomScrollbar({/*历史上的明天-文字纵向滚动条*/
        axis:"y",
		setHeight:196,
		theme:"minimal-dark"
	});
    showCalendar(); /* 事件日历 */
    wordScroll(); /* 历史上的明天-文字滚动 */
    getHistoryToday(new Date()); /* 获取历史上的今天 */
    
//	生成二维码
	//设置 qrcode 参数
	var qrcode = new QRCode('qrcode', {
//	    width: 256,
//	    height: 256,
	    colorDark: '#000000',
	    colorLight: '#ffffff',
//	    correctLevel: QRCode.CorrectLevel.H
	});
	
	var txtUrl = '';
	$('.socialShare').addClass('hide');
	qrcode.makeCode('http://10.6.0.42:8080/ns/uec/wechat/gotoappnewsdetail/9fddb11f5b6a5e958bd91b8c0d434f3f');
	

});

//1366以下的屏展示内容
function dataStatistics() {
	if($('body').width() < 1900){
		$('#dataCount').removeClass('hide');
		
//	    今日采集数据统计
	    showDataCount();
	}
}

//媒体头条
function headLinesData(){
	var dataVal = {
			imgCon:[],
			listCon:[]
	}
	$.ajax({
        url : ctx+'/topNewsListV2',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
	       if(data.result){
	    	   var obj = data.resultObj;
	    	   
	    	   for(var i=0;i<obj.length;i++){
//	    		   获取图片的新闻信息
	    		   if(obj[i].picPath != null){
	    			   dataVal.imgCon.push({
	    				   'id':obj[i].newsId,'webpageCode':obj[i].webpageCode,'title':obj[i].title.replace(/\\"/g,"&quot;"),'sourceCrawl':obj[i].sourceCrawlDetail.website.displayName,'imgPath':obj[i].picPath
	    			   })
				   }
				   obj[i].releaseDetailTime = obj[i].releaseDatetime;
				   obj[i].releaseDatetime = new Date(obj[i].releaseDatetime).formatDate('yyyy-MM-dd');					   			   
//	    		   获取所有新闻的信息
	    		   dataVal.listCon.push({
	    			   'id': obj[i].newsId, 'webpageCode': obj[i].webpageCode, 'title': obj[i].title.replace(/\\"/g, "&quot;"), 'sourceCrawl': obj[i].sourceCrawlDetail.website.displayName, 'releaseDatetime': obj[i].releaseDatetime, 'cusSummary': obj[i].cusSummary, 'releaseDetailTime': obj[i].releaseDetailTime
	    		   })
	    	   }
	    	   
	    	   if(dataVal.imgCon.length == 0){ //判读是否有图片展示
	    		   showListCon(0);
	    	   }else{
	    		   
	    		   showSilders();
	    		   showListCon(1);
	    	   }
	       }
        },	   
        error : function(msg) {
        }
	});
	
	
//	轮播图展示
	function showSilders(){
		var imgContent = '<div class="succesny"><div class="control"><ul class="change"></ul></div><div class="thumbWrap"><div class="thumbCont" ><ul>';
		for(var i = 0;dataVal.imgCon.length>i;i++){
			var imgObj = dataVal.imgCon[i];
			imgContent += '<li ><div>';
			imgContent += '<img class="defaultImg" data-webpageCode="'+imgObj.webpageCode+'" src="'+context+'/frontEnd/image/home/default-white.png" url="'+ctx+'/latest/front/news/detail/'+imgObj.webpageCode+'"  bigImg="'+ctx+'/frontEnd/image/home/default-white.png"  alt="'+imgObj.title+'" text="'+imgObj.sourceCrawl+'"/>';
			imgContent += '</div></li>';
		}
		imgContent += '</ul></div></div></div>';
		
		$('.successlunbo').html(imgContent);
		
		for(var i = 0;dataVal.imgCon.length>i;i++){
		   var imgPath = dataVal.imgCon[i].imgPath,
		   		code = dataVal.imgCon[i].webpageCode;
		   
		   getImageUrl(imgPath,code,dataVal.imgCon.length);
	   }
	}
	
//	列表展示  status：有没有头条 0：没有头条  1：有头条
	function showListCon(status){
		var listContent = '';
		for(var j = 0;dataVal.listCon.length>j;j++){
			var listObj = dataVal.listCon[j];
			var releaseTime = listObj.releaseDetailTime;
            var releaseDatetime = listObj.releaseDatetime.replace(/-/g,'/');
			var time = new Date(releaseDatetime).getTime();
			var urlSuffix = listObj.webpageCode;
			// 处理releaseDatetime为null或'null'及''的情况
			if (releaseTime != 'null' && releaseTime != null || releaseTime != '') {
				urlSuffix = listObj.webpageCode + '/' + releaseTime;
			}
			listContent += '<li class="list-group-item"><span class="listMun"><i class="fa fa-angle-double-right"></i></span>';
			
			if(listObj.cusSummary == null){
				listContent += '<a href="' + ctx + '/latest/front/news/detail/' + urlSuffix + '" target="_blank"  class="listCon beyondEllipsis">';
			}else{
				if(listObj.cusSummary.length>300){
					listObj.cusSummary = listObj.cusSummary.substring(0, 150)+'...';
				}
				listContent += '<a href="' + ctx + '/latest/front/news/detail/' + urlSuffix + '" target="_blank" tabindex="0" data-content="' + listObj.cusSummary + '" data-container=".headLinesConHover"  data-placement="right" data-toggle="popover"  class="listCon beyondEllipsis">';
			}
			
	    	listContent += '<span  class="listSou">'+listObj.sourceCrawl+'</span> |&nbsp;';
			listContent += '<span >'+listObj.title+'</span></a>';
			listContent += '<span class="listTit">['+listObj.releaseDatetime+']&nbsp;</span></li>';
		}
		$('.headLinesCon ul').html(listContent);
		
		if(status == 0){
			var height = 391;
			$('.successlunbo').addClass('hide');
		}else{
			var height = 105
		}
		
		/*最新头条-文字滚动条*/
		$(".headLinesCon .list-group").mCustomScrollbar({
			setHeight:height,
			theme:"minimal-dark"
		});
		
		$("[data-toggle='popover']").popover({
	        trigger:'hover', //触发方式
	        html: true, // 为true的话，data-content里就能放html代码了
	        content:"",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
		});
	}
}
//轮播图只有一张图片
function showSildersOne(){
	var domImg = $('.thumbCont').find('li img');
	var imgInfor = {
			'imgUrl':domImg.attr('src'),
			'imgTitle':domImg.attr('alt'),
			'imgLink':domImg.attr('url'),
			'imgText':domImg.attr('text')
	}
	
	var content = '<div class="succesny"><div class="succescont"><div class="control"><ul class="change" >';
		content += '<li><div class="imgWrap"><a href="'+imgInfor.imgLink+'" title="'+imgInfor.imgTitle.replace(/\\"/g,"&quot;")+'"><img data-webpagecode="582048432746cd2149d26aec30295a03" class="" src="'+imgInfor.imgUrl+'" alt="'+imgInfor.imgTitle+'"></a></div><div class="opacity"></div><div class="textDesc"><div class="title"><a href="'+imgInfor.imgLink+'">'+imgInfor.imgTitle+'</a></div><div class="text">'+imgInfor.imgText+'</div></div></li>';
		content += '</ul></div></div></div></div>';
		
	$('.successlunbo').html(content);		
}
//获取图片服务器路径
function getImageUrl(imageUrl,code,lenSun){
	var imgUrl;
	
	$.ajax({
        url : inewsImageManager + imageUrl+'&width=640&height=360&minSize=100',//这个就是请求地址对应sAjaxSource
        data : {'code':code},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	++picliSun;
        	if(data.result == 'success'){
        		$('img[data-webpagecode="'+data.code+'"]').attr('src',data.value).attr('bigimg',data.value).removeClass('defaultImg');
        	}else{
        		$('img[data-webpagecode="'+data.code+'"]').parents('li').remove();
        	}
        	if(picliSun == lenSun){
        		var liLen = $('.thumbCont').find('li').length;
        		if(liLen == 1){
        			showSildersOne();
        		}else if(liLen == 0){
        			$('.successlunbo').addClass('hide');
        			$('.headLinesCon').find('.mCustomScrollbar').css('height','403px');
        		}else{
        			$('.succesny').olvSlides({
            			thumb: true,
            			thumbPage: true,
            			effect: 'fade'
            		});
        		}

        	}
        },
        error : function(msg) {
        }
	});
	return imgUrl;
}

//新闻线索
function newsClue(obj) {
    $.ajax({
        type: "get",
        async: true,
        url: ctx + "/newsClue",
        data: {
			classification: obj.classification,
			regions: obj.regions
        },
        dataType: "json",
        success: function(data) {
        	console.log(data);
        	if(data.result == true){
        		 var newsClueList = "";
        		var obj = data.resultObj;
        		if(obj.length == 0){
        			newsClueList = '<tr><td style="text-align:center" colspan="3">搜索结果为空！</td></tr>';
        		}else{
        			for(var i = 0;obj.length>i;i++){
						var releaseDatetime = obj[i].releaseDatetime;
        				var time = new Date(obj[i].releaseDatetime).formatDate('MM-dd hh:mm');
        				var cusSummary = obj[i].cusSummary;
        				newsClueList += '<tr>';
						newsClueList += '<td class="number">'+time+'</td>';						
						var urlSuffix = obj[i].webpageCode;
						// 处理releaseDatetime为null或'null'及''的情况
						if (releaseDatetime != 'null' && releaseDatetime != null || releaseDatetime != '') {
							urlSuffix = obj[i].webpageCode + '/' + releaseDatetime;
						}
						if(cusSummary != null){
							if(cusSummary.length>150){
	        					cusSummary = cusSummary.substring(0,150)+'...';
	        				}else{
	        					cusSummary = cusSummary;
	        				}
							newsClueList += '<td class="lTitle"><a href="' + ctx + '/latest/front/news/detail/' + urlSuffix + '" target="_blank" tabindex="0" data-toggle="popover" data-content="' + cusSummary + '">' + obj[i].title + '</a></td>';
						}else{
							newsClueList += '<td class="lTitle"><a href="' + ctx + '/latest/front/news/detail/' + urlSuffix + '" target="_blank">' + obj[i].title + '</a></td>';
						}
						
						if(obj[i].sourceCrawl == null){
							newsClueList += '<td class="lTotal">-</td>';
						}else{
							newsClueList += '<td class="lTotal"><a href="javascript:void(0)">'+obj[i].sourceCrawl+'</a></td>';
						}
						newsClueList += '</tr>';
        			}
        			
        		}
                $(".rank.newest").find("tbody.newsClue").html(newsClueList);
                
                $("[data-toggle='popover']").popover({
        	    	html:true,
        	    	trigger:'hover',
        	    });
        	}
        },
        error: function(errorMsg) {
            console.log("新闻线索请求数据失败!");
        }
    });
}

//热点发现
function getClusterData(clusterParam){
	$.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/clusterRanking",
        data: clusterParam,
        dataType: "json",
        success: function(data) {
        	console.log(data);
        	
        	if(data.result == true){
        		var clusterRankingList = '';
        		var obj = data.resultObj;
        		if(obj.length == 0){
        			clusterRankingList = '<tr><td style="text-align:center" colspan="3">搜索结果为空！</td></tr>';
        		}else{

        			for(var i = 0;i< obj.length && i <10;i++){
                        var allnewsnum = obj[i].allNewsNum;
                        if(!allnewsnum ||allnewsnum == 'null'){
                            allnewsnum =parseInt(Math.random()*20+80);
						}
                    	if(i < 3){
                    		clusterRankingList += '<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle linkClustering"><a href="'+ctx+'/cluster/front/detail/'+obj[i].clusterCode+'" target="_blank" tabindex="0" data-toggle="popover" data-original-title="" title="">'+obj[i].title+'</a></td><td style="text-align: center;width:80px;">'+allnewsnum+'</td><td class="lTotal" style="text-align: center;width:80px;font-size:14px;">'+obj[i].weight+'</td></tr>';
                    	}else{
                    		clusterRankingList += '<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle linkClustering"><a href="'+ctx+'/cluster/front/detail/'+obj[i].clusterCode+'" target="_blank" tabindex="0" data-toggle="popover" data-original-title="" title="">'+obj[i].title+'</a></td><td style="text-align: center;width:80px;">'+allnewsnum+'</td><td class="lTotal" style="text-align: center;width:80px;font-size:14px;">'+obj[i].weight+'</td></tr>';
                    	}
        			}
        		}
        		$('.rank_cont').find('tbody.clusterRanking').html(clusterRankingList);
        	}
        }
	})
}
//热点发现-参数
function clusterParam(){
	var regionsId = $('.srceenMap h2').attr('data-innerId');//	地区
	var classificationsId = $('.srceenClassification h2').attr('data-innerId');//	分类
	var paramVal = {
			regions:regionsId,
			classifications:classificationsId
	};
	return paramVal;
}

//网站新闻排行1
function hotNewsRanking1(hotNewsRankingParams1) {
	$.ajax({
        type: "get",
        async: true,
        url: ctx + "/hotNewsRanking",
        data: hotNewsRankingParams1,
        dataType: "json",
        success: function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var hotRankingList = "";
        		if(obj.length == 0){
        			console.log("hotRanking---0---"+ obj.length);
        			hotRankingList = '<tr><td style="text-align:center" colspan="3">搜索结果为空！</td></tr>';
        		}else{
                    console.log("hotRanking---1---"+ obj.length);
        			for(var i = 0; i < obj.length; i++){
    	            	var news = obj[i];
    	                var webpageCode = news.webpageCode;
						var releaseDatetime = news.releaseDatetime;
						var urlSuffix = news.webpageCode;
						// 处理releaseDatetime为null或'null'及''的情况
						if (releaseDatetime != 'null' && releaseDatetime != null || releaseDatetime != '') {
							urlSuffix = webpageCode + '/' + releaseDatetime;
						}
//    	                根据选择的不同，显示的数据也不一致
    	                var participateNumStr;
    	                if($('.srceenWeb h2').attr('data-innerid') == '44'){
    	                	participateNumStr = news.participateNum;
    	                }else{
    	                	if($('.srceenList1 h2').attr('data-innerid') == '75'){
    	                		participateNumStr = news.clickingNum;
    	                	}else if($('.srceenList1 h2').attr('data-innerid') == '76'){
    	                		participateNumStr = news.participateNum;
    	                	}
    	                }
    	                if(participateNumStr == null){
    	                	participateNumStr = '-'
    	                }else{
    	                	if(participateNumStr > 10000){
        	                	participateNumStr = Math.floor(participateNumStr/10000) +'万';
        	                }
    	                }
//    	                标题
    	                var title = news.title;
    	                var summary = news.cusSummary;
    	                
    	                if(i < 3){
    	                	if(summary == null){
    	                		hotRankingList = hotRankingList + '<tr><td class="number"><em class="red">' + (i + 1) + '</em></td><td class="lTitle"><a href="' + ctx + '/hot/front/hot/detail/' + urlSuffix + '" target="_blank">' + title + '</a></td><td class="lTotal">[' + participateNumStr + ']</td></tr></tr>';
    	                	}else{
    	                		if(summary.length > 150){
    	    	                	summary = summary.substr(0,150)+' ...';
    	    	                }
    	                		hotRankingList = hotRankingList + '<tr><td class="number"><em class="red">' + (i + 1) + '</em></td><td class="lTitle"><a href="' + ctx + '/hot/front/hot/detail/' + urlSuffix + '" target="_blank"  tabindex="0" data-toggle="popover" data-placement="left" data-content="' + summary + '">' + title + '</a></td><td class="lTotal">[' + participateNumStr + ']</td></tr></tr>';
    	                	}
    	                }else{
    	                	if(summary == null){
    	                		hotRankingList = hotRankingList + '<tr><td class="number"><em class="hui">' + (i + 1) + '</em></td><td class="lTitle"><a href="' + ctx + '/hot/front/hot/detail/' + urlSuffix + '" target="_blank">' + title + '</a></td><td class="lTotal">[' + participateNumStr + ']</td></tr></tr>';
    	                	}else{
    	                		if(summary.length > 150){
    	    	                	summary = summary.substr(0,150)+' ...';
    	    	                }
    	                		hotRankingList = hotRankingList + '<tr><td class="number"><em class="hui">' + (i + 1) + '</em></td><td class="lTitle"><a href="' + ctx + '/hot/front/hot/detail/' + urlSuffix + '" target="_blank" tabindex="0" data-toggle="popover" data-placement="left" data-content="' + summary + '">' + title + '</a></td><td class="lTotal">[' + participateNumStr + ']</td></tr></tr>';
    	                	}
    	                }
    	            }
        		}
                $(".rank_cont.m-top").find('tbody.hotnewsRanking1').html(hotRankingList);
                $("[data-toggle='popover']").popover({
                    trigger: 'hover',
                    html: true,
                });
        	}
        },
        error: function(errorMsg) {
        	console.log("热点排行1请求数据失败啦!");
        }
	});
}
//网站新闻排行-参数
function hotNewsRankingParams1(){
	var webSource = $('.srceenWeb h2').attr('data-innerid');
	var type = $('.srceenList1 h2').attr('data-innerid');
	var cycle = $('.srceenListPeriod1 h2').attr('data-innerid');
	
	var hotNewsParams = {
		webSource:webSource,
		type:type,
		cycle:cycle,
	}
	
	return hotNewsParams;
}

//网站新闻排行2
//
//
function hotNewsRanking2(hotNewsRankingParams2) {
// 	$.ajax({
//         type: "get",
//         async: true,
//         url: ctx + "/hotNewsRanking",
//         data: hotNewsRankingParams2,
//         dataType: "json",
//         success: function(data) {
//         	console.log(data);
//         	if(data.result == true){
//         		var obj = data.resultObj;
//         		var hotRankingList = "";
//         		if(obj.length == 0){
//         			hotRankingList = '<tr><td style="text-align:center" colspan="3">搜索结果为空！</td></tr>';
//         		}else{
//         			for(var i = 0; i < obj.length; i++){
//     	            	var news = obj[i];
//     	                var webpageCode = news.webpageCode;
//
// //    	                根据选择的不同，显示的数据也不一致
//     	                var participateNumStr;
//     	                if($('.srceenWeb2 h2').attr('data-innerid') == '44'){
//     	                	participateNumStr = news.participateNum;
//     	                }else{
//     	                	if($('.srceenList2 h2').attr('data-innerid') == '75'){
//     	                		participateNumStr = news.clickingNum;
//     	                	}else if($('.srceenList2 h2').attr('data-innerid') == '76'){
//     	                		participateNumStr = news.participateNum;
//     	                	}
//     	                }
//     	                if(participateNumStr == null){
//     	                	participateNumStr = '-'
//     	                }else{
//     	                	if(participateNumStr > 10000){
//         	                	participateNumStr = Math.floor(participateNumStr/10000) +'万';
//         	                }
//     	                }
// //    	                标题
//     	                var title = news.title;
//     	                var summary = news.cusSummary;
//
//     	                if(i < 3){
//     	                	if(summary == null){
//     	                		hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="'+ctx+'/hot/front/hot/detail/'+webpageCode+'" target="_blank">'+title+'</a></td><td class="lTotal">['+participateNumStr+']</td></tr></tr>';
//     	                	}else{
//     	                		if(summary.length > 150){
//     	    	                	summary = summary.substr(0,150)+' ...';
//     	    	                }
//     	                		hotRankingList = hotRankingList +'<tr><td class="number"><em class="red">'+(i+1)+'</em></td><td class="lTitle"><a href="'+ctx+'/hot/front/hot/detail/'+webpageCode+'" target="_blank"  tabindex="0" data-toggle="popover" data-content="'+summary+'">'+title+'</a></td><td class="lTotal">['+participateNumStr+']</td></tr></tr>';
//     	                	}
//     	                }else{
//     	                	if(summary == null){
//     	                		hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="'+ctx+'/hot/front/hot/detail/'+webpageCode+'" target="_blank">'+title+'</a></td><td class="lTotal">['+participateNumStr+']</td></tr></tr>';
//     	                	}else{
//     	                		if(summary.length > 150){
//     	    	                	summary = summary.substr(0,150)+' ...';
//     	    	                }
//     	                		hotRankingList = hotRankingList +'<tr><td class="number"><em class="hui">'+(i+1)+'</em></td><td class="lTitle"><a href="'+ctx+'/hot/front/hot/detail/'+webpageCode+'" target="_blank" tabindex="0" data-toggle="popover" data-content="'+summary+'">'+title+'</a></td><td class="lTotal">['+participateNumStr+']</td></tr></tr>';
//     	                	}
//     	                }
//     	            }
//         		}
//                 $(".rank_cont.m-top").find('tbody.hotnewsRanking2').html(hotRankingList);
//                 $("[data-toggle='popover']").popover({
//                     trigger: 'hover',
//                     html: true,
//                 });
//         	}
//         },
//         error: function(errorMsg) {
//         	console.log("热点排行2请求数据失败啦!");
//         }
// 	});
 }
//网站新闻排行2-参数
function hotNewsRankingParams2(){
	var webSource = $('.srceenWeb2 h2').attr('data-innerid');
	var type = $('.srceenList2 h2').attr('data-innerid');
	var cycle = $('.srceenListPeriod2 h2').attr('data-innerid');
	
	var hotNewsParams = {
			webSource:webSource,
			type:type,
			cycle:cycle,
	}
	
	return hotNewsParams;
}

/* 热点事件，显示日历 */
function showCalendar() {
    //var eventCanderW = '';
    // if ($('body').width() > 1200) {
    //     eventCanderW = 286;
    // } else {
    //     eventCanderW = $('.homeHistoryTom').height();
    // }
	var date = new Date();
	$('#eventCander span').text(date.formatDate('yyyy-MM-dd'))
    getHistoryToday(date);
    // $('#eventCander').calendar({
    //     width: eventCanderW,
    //     height: eventCanderW - 30,
    //     onSelected: function(view, date, data) {
    //         getHistoryToday(date);
    //     }
    // });
    //
    // $('#eventCander').css({
    //     'height': eventCanderW + 'px'
    // });
}
/**
 * 获取历史上的今天
 * 
 * @param date
 */
function getHistoryToday(date) {
    var data = date.formatDate('yyyy-MM-dd');
    $.ajax({
        type: "get",
        url: ctx + "/getHistoryToday?datetime=" + data,
        async: true,
        dataType: 'json',
        success: function(data) {
            var datas = '';
            if (data.result) {
                var map = data.resultObj;
                var newsList = map.news; // 新闻列表
                var subjectList = map.event; // 专题列表
                var time;
                var url;
                var title;
                var type;
                // 新闻
                for (var i = 0; null != newsList && i < newsList.length; i++) {
                    var news = newsList[i];
//                    console.log(news);
					var releaseDatetime = news.releaseDatetime;
                    title = news.title;
					time = new Date(news.releaseDatetime).formatDate('yyyy');
					var urlSuffix = news.webpageCode;
					// 处理releaseDatetime为null或'null'及''的情况
					if (releaseDatetime != 'null' && releaseDatetime != null || releaseDatetime != '') {
						urlSuffix = news.webpageCode + '/' + releaseDatetime;
					}
                    url = ctx + '/latest/front/news/detail/' + urlSuffix;
                    type = "事件";
                    datas += '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="' + url + '" target="_blank" tabindex="0" data-content="'+title+'" data-container=".homeHistoryTomTableHover"  data-placement="left" data-toggle="popover">' + title + '</a></td><td >' + type + '</td></tr>';
                }
                // 专题
                for (var i = 0; null != subjectList && i < subjectList.length; i++) {
                    var subject = subjectList[i];
                    title = subject.title;
                    time = new Date(subject.occurDatetime).formatDate('yyyy');
                    url = ctx + '/event/front/gotoEventDetail/' + subject.eventCode;
                    type = "专题";
                    datas += '<tr><td class="number">' + time + '</td><td class="lTitle"><a href="' + url + '" target="_blank" tabindex="0" data-content="'+ title +'" data-container=".homeHistoryTomTableHover" data-placement="left" data-toggle="popover">' + title + '</a></td><td >' + type + '</td></tr>';
                }

            }
            $('.homeHistoryTomTable').find('tbody').html(datas);
        }
    });
}
/* 历史上的明天-文字滚动 */
function wordScroll() {
    $('.scrollBox').each(function() {
        var spanWidth = $(this).children('.scrollBoxCon').width();
        if (spanWidth > 100) {
            $(this).textScroll();
        }
    });
}


/* 查看数据统计 */
function showDataCount() {
    var index = 1;
    $('#dataCount').find('.dataCountBtn').click(function() {

        if (index == 1) {
            $('.dataCountCon').slideDown('400');
            collectionChart();
            sourceChart();
            classificationChart();
            originalChart();
            $(this).find('a').text('单击隐藏今日采集数据统计');
            index--;
        } else {
            $('.dataCountCon').slideUp('400');
            collectionChart();
            sourceChart();
            classificationChart();
            originalChart();
            $(this).find('a').text('点击查看今日采集数据统计');
            index++;
        }
    });
}
/* 小时采集曲线图 */
var collectionOption = {
    tooltip: {
        trigger: 'axis',
        formatter: "{b}时 <br/>{a}: {c}"
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}'
        }
    },
    series: [{
        name: '新闻条数',
        type: 'line',
        data: [],
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            },
            {
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        }
    },
    ]
};
function collectionChart() {
    var myChartCollection = echarts.init(document.getElementById('collection'));
    myChartCollection.setOption(collectionOption);
    myChartCollection.showLoading();
    var option = myChartCollection.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/newstimestat",
        dataType: "json",
        // 返回数据形式为json
        success: function(result) {
            if (result.result) {
                option.xAxis[0].data = result.resultObj[0];
                option.series[0].data = result.resultObj[1];
                myChartCollection.setOption(option);
                myChartCollection.hideLoading();
            } else {
                console.log(result.errorMsg);
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartCollection.hideLoading();
        }
    });
}

/* 来源饼图 */
var sourceOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '来源',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: function(val){
                	var newStr = '';
                	if(val.name.length > 2){
                		newStr = val.name.slice(0,2)+'\n'+val.name.slice(2);
                	}else{
                		newStr = val.name;
                	}
                	return newStr;
                },
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        labelLine:{
            normal:{
                show:true,
                smooth:true
            }
            
        },
        data: []
    }]
};
function sourceChart() {
    var myChartSource = echarts.init(document.getElementById('source'));
    myChartSource.setOption(sourceOption);
    myChartSource.showLoading();
    var option = myChartSource.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/sourcestat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
                option.series[0].data = data.resultObj;
                myChartSource.setOption(option);
                myChartSource.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartSource.hideLoading();
        }
    });
}
var colors = [];
colors = ['#8B0016','#B2001F','#c50023','#DF0029','#E54646','#EE7c6B','#F5A89A','#FCDAD5','#8E1E20','#B6292B','#C82E31','#E33539','#EB7153','#F19373','#F6B297','#FCD9C4','#945305','#BD6B09','#D0770B','#EC870E'];
function addclassificationColors(){
	var chooseColors = '';
	chooseColors = colors[parseInt(20*Math.random())];
	return chooseColors;
}
/* 分类饼图 */
var classificationOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '分类',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: "{b}",
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        labelLine:{
            normal:{
                show:true,
                smooth:true
            }
        },
        startAngle:0,
        data: [{
            value: 335,
            name: '政治'
        },
        {
            value: 310,
            name: '经济'
        },
        {
            value: 234,
            name: '文化'
        },
        {
            value: 135,
            name: '生活'
        },
        {
            value: 1048,
            name: '体育'
        },
        {
            value: 251,
            name: '娱乐'
        },
        {
            value: 147,
            name: '军事'
        },
        {
            value: 102,
            name: '其他'
        }]
    }]
};
function classificationChart() {
    var myChartClassification = echarts.init(document.getElementById('classification'));
    myChartClassification.setOption(classificationOption);
    myChartClassification.showLoading();
    var option = myChartClassification.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/classificationstat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
            	console.log(data.resultObj.length);
            	if(data.resultObj.length>11){
            		var addColorsCount = data.resultObj.length-11;
            		for(var i=0;i<addColorsCount;i++){
            			var addColors = addclassificationColors();
            			option.color.push(addColors);
            		}
            	}            	
                
            	option.series[0].data = data.resultObj;
                myChartClassification.setOption(option);
                myChartClassification.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartClassification.hideLoading();
        }
    });
}

/* 载体介质饼图 */
var originalOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [

    {
        name: '转载介质',
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                show: true,
                formatter: "{b}",
                textStyle: {
                    fontSize: 12
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal'
                },

            }
        },
        data: [{
            value: 335,
            name: '原创'
        },
        {
            value: 310,
            name: '转载'
        },
        ]
    }]
};
function originalChart() {
    var myChartOriginal = echarts.init(document.getElementById('original'));
    myChartOriginal.setOption(originalOption);
    myChartOriginal.showLoading();
    var option = myChartOriginal.getOption();
    $.ajax({
        type: "get",
        async: true,
        // 同步执行
        url: ctx + "/originalstat",
        dataType: "json",
        // 返回数据形式为json
        success: function(data) {
            if (data.result) {
                option.series[0].data = data.resultObj;
                myChartOriginal.setOption(option);
                myChartOriginal.hideLoading();
            }
        },
        error: function(errorMsg) {
            console.log("图表请求数据失败啦!");
            myChartOriginal.hideLoading();
        }
    });
}

/**
 * 跳转到事件详情
 * @param id
 */
function loadEventDetail(id){
	window.open(ctx+"/event/front/detail/"+id);
}
