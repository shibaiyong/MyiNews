$(function(){
	/*头部导航高亮*/
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(10)').addClass('active');
	
	
	$('.newsDetailText').checkImg();
	
	$('.newsDetailText').judgeImgLoadError();
	
	/*改变字体大小*/
	changeFontStyle();
	
	summarydotdotdot();

	getBothSidesData();
    /*将底部致底*/
	footerPutBottom();
	
	$('.newsDetailText').uec_inews_picture_group_news();
	
	$('.newsDetailText').find('table').each(function(){
		$(this).removeAttr('width');
		$(this).removeAttr('WIDTH');
		$(this).removeAttr('align');
		$(this).removeAttr('style');
		$(this).css({
			'width':'100%'
		});
	});
	//隐藏内容为空的区域
	hideEmptyArea();
	if($('.newsDetailSummary').text() == ''){
		$('.newsDetailSummary').addClass('hide');
	};
	//词条
	wiki();
	
	/*去掉正文部分每一段前面的空格*/
	var reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
	$('.newsDetailText').find('p').each(function(){
		console.log($(this).html());
		var trimString = $(this).html();
		/*alert(trimString.match(reg));*/
		if(trimString.match(reg) == null || trimString.match(reg) == '<strong>,</strong>' || trimString.match(reg) == '<span>,</span>'){
			trimString = $.trim(trimString);
			$(this).html(trimString);
		}
		
	});
	/*替换正文，高亮显示*/
//	var newsDetailText = $("#newsContent").html();
	var queryStr = $("#queryStr").val();
	if(null != queryStr && '' != queryStr){
		var queryList = queryStr.split(',');
		if(queryList !=null && queryList.length >0){
			console.info(queryList.length);
			for (var i = 0; i < queryList.length; i++) {
				var word = queryList[i];
				highlight(word);
////				var newWord = '<span style=\"color:red\">'+word+'</span>';
////				newsDetailText = newsDetailText.replace(new RegExp(word,'g'),newWord);
			}
//			$("#newsContent").html(newsDetailText);
		}
	}

	
	$('.desc').mouseenter(function(){
		$(this).css({
			'height':'auto',
			'paddingBottom':'0px'
		})
		$(this).find('p').css({
			'height':'auto'
		})
	});
});

/**
 * 换一换相关新闻
 */
function changeRelative(){
	var relativeNum = $(".relativeNum").attr("value");
	var changeNum = $(".changeNum").attr("value");
	var webpageCode = $('#webpageCode').val();
	var data = {
			relativeNum : relativeNum,
			changeNum : changeNum,
			webpageCode:webpageCode,
		};
	var postdata = JSON.stringify(data);
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/latest/front/changeRelative",
		data: {
			relativeInfor:postdata
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			eventBasicList = data.eventBasicList;
			simArticleList = data.simArticleList;
			var eventHtml = "";
			$(".relativeTopic").find("ul").html("");
			if(null!= eventBasicList && eventBasicList.length > 0){
				for(var i = 0; i < eventBasicList.length;i++){
					event = eventBasicList[i];
					eventHtml += '<li><dl class="dl-horizontal"><dt><span>[专题]</span></dt><dd><a target="_blank" href="'+ctx+'/event/front/gotoEventDetail/'+event.innerid+'">'+event.eventName+'</a></dd></dl></li>';
				}
				$(".relativeTopic").find("ul").html(eventHtml);
			}
			var simHtml = "";
			$(".relativeNews").find("ul").html("");
			if(null!= simArticleList && simArticleList.length > 0){
				for(var i = 0; i < simArticleList.length;i++){
					simArticle = simArticleList[i];
					simHtml += '<li><dl class="dl-horizontal"><dt><span>[新闻]</span></dt><dd><a target="_blank" href="'+ctx+'/latest/front/gotoLatestNewsDetail/'+simArticle.innerid+'">'+simArticle.title+'</a></dd></dl></li>';
				}
				$(".relativeNews").find("ul").html(simHtml);
			}
			$(".changeNum").attr("value",++changeNum);
		},
		error : function(errorMsg) {
			console.log("获取相关新闻数据数据失败!");
		}
	});
}


function getBothSidesData(){
	
    var val=$('.progress_number').text();
    $('.bothSidesTit').eq(1).removeClass('bothSidesF');
    $('.bothSidesTit').eq(0).addClass('bothSidesF');
    if(val.replace('%','')>50){
        $('.bothSidesTit').eq(1).removeClass('bothSidesF');
        $('.bothSidesTit').eq(0).addClass('bothSidesF');
    }else{
        $('.bothSidesTit').eq(0).removeClass('bothSidesF');
        $('.bothSidesTit').eq(1).addClass('bothSidesF');
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



/*隐藏内容为空的区域*/
function hideEmptyArea(){
	//隐藏实体词区域
	var entityVal = $('.entityWord').find('.listPer.box.p-right.p-left').text();
	entityVal = $.trim(entityVal);
	if(entityVal == ""){
		$('.entityWord').html('');
	}
	//隐藏标签区域
	var labelVal = $('.newsDetailLabel').find('.listPer.box.p-right.p-left').text();
	labelVal = $.trim(labelVal);
	if(labelVal == ""){
		$('.newsDetailLabel').html('');
	}
	//隐藏相关内容区域
	var relativetVal = $('.newsDetailRelative').find('.box.p-left.p-right.p-top').text();
	relativetVal = $.trim(relativetVal);
	if(relativetVal == ""){
		$('.newsDetailRelative').html('');
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
				url : ctx+"/dictionary/front/getDictionary?names="+words,
			dataType : "json", //返回数据形式为json
			success : function(data) {
				if(null != data){
					var entityWords = $("#entityWordsDiv").html();
					for (var i = 0; i < data.length; i++) {
						var name = data[i].name;
						var pageId = data[i].id;
						var newWord = '<span class="modal_incident" onclick="dictionaryOpen('+pageId+',\''+data[i].type+'\')" >'+name+'</span>';
						entityWords = entityWords.replace(new RegExp(">"+name+"<", 'g'),">"+newWord+"<");
					}
					$("#entityWordsDiv").html(entityWords);
					
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
//					var converter = new showdown.Converter();
//					content = converter.makeHtml(content);
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