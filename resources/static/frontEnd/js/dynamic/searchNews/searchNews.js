var table1;
var table2;
var searchType = "";
var searchWord = "";
EnterPress();
$(function() {
	/* 头部导航高亮 */
    $().showHeader();
    
	$('.fullWebConThumbnailTable').judgeImgLoadError();
    changeDataCon();

    /* 头部导航高亮 */
    /* $('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(6)').addClass('active'); */
    var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" +"<'row fullWebInterrelatedCopy'<'col-sm-12'>>"+ "<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
    var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
    var scrollCon = '';
    var pagingTypeCon = 'full_numbers';
    if ($('body').width() < 1200) {
        domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" +"<'row fullWebInterrelatedCopy'<'col-sm-12'>>"+ "<'row '<'col-sm-3 col-xs-4 table_bottom_left'i><'col-sm-9 col-xs-8 table_bottom_right'p>>";
        totalCount = "共计  _TOTAL_ 条";
    }
    if ($('body').width() < 768) {
        scrollCon = true;
        pagingTypeCon = "simple";
    }

    var displayLength = 20;

    searchType = $(".searchType").val();
    searchWord = $(".searchWord").val();
    
    //搜索框填入搜索词
    $(".form-control").val(searchWord);
    $(".search-input").val(searchWord);
    $('.homeSearchInput').click(function(){
    	$('.search-input').val($('.reSearchInput').val());
    	$('.search-icon').find('span:eq(1)').click();
    });
    //搜索框填入搜索词限制
    $('.reSearchInput').on('keydown keyup',function(){
        var reg = /\u0025/;
        var val = $(this).val();
        if(reg.test(val)){
            $(this).val('');
        }
    })
    table1 = $('.fullWebBoxTable').DataTable({
    	dom:domString,
        /*dom: domString,*/
        scrollX: scrollCon,
        serverSide: true,
       
        // 标示从服务器获取数据
        sAjaxSource: ctx + '/newsSearch/front/page/' + searchType + '/' + searchWord,
        // 服务器请求
        fnServerData: retrieveData,
        // 用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        'iDisplayLength' : displayLength,
        
        fnServerParams: function(aoData) {
        	
        },
        "rowCallback": function(row, data, index) {
        	var summary = "暂无摘要";
            if(null != data.summary){
        		if(data.summary.length>150){
        			summary = data.summary.substr(0,150)+'...';
        		}else{
        			summary = data.summary;
            	}
        	}
        	var title = titlehighlight(data.title);
            title = '<a href="' + data.newsUrl + '" target="_blank" data-toggle="popover" data-content="'+summary+'" >' + title + '</a>';
            $('td:eq(0)', row).html(title).addClass('titleRightClick');
            
            if (null != data.simNewsNum && "" != data.simNewsNum) {
                var simNews = '<a href="' + data.simNewsUrl + '" target="_blank">(' + data.simNewsNum + ')</a>';
                $('td:eq(3)', row).html(simNews);
            } else {
                $('td:eq(3)', row).html('(0)');
            }

            if ($('body').width() < 768) {
                $('.fullWebBoxTable').css({
                    'width': '800px'
                });
            }
        },
        columns: [ // 显示的列
        {
            data: 'title',
            "bSortable": false
        },
        {
            data: 'releaseTime',
            "bSortable": false
        },
        {
            data: 'sourceReport',
            "bSortable": false
        },
        {
            data: 'simNewsNum',
            "bSortable": false
        },
        ],
        "aaSorting": [[0, ""]],
        "columnDefs": [{
            "targets": ['_all'],
            "data": null,
            "defaultContent": "-"
        }]
    });
    $('.fullWebBoxTable').on('draw.dt',function() {
    	if($('.fullWebInterrelated').hasClass('copy')){
    		
    	}else{
    		var fullWebInterrelatedCopy=$('.fullWebInterrelated').clone().addClass('copy');
        	$('.fullWebInterrelated').remove();
        	$('.fullWebInterrelatedCopy').find('.col-sm-12').append(fullWebInterrelatedCopy);
    	}
    	$("[data-toggle='popover']").popover({
    		html:true,
    		trigger:'hover',
    	});
    	/*$("[data-toggle='popover']").popover('show');*/
    	
    	$('.paginate_button').click(function(){
    		scrollOffset($(".fullWebBoxTable").offset());
    	});
    });
    
    
    table2= $('.fullWebConThumbnailTable').DataTable({
    	dom:domString,
    	scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
        sAjaxSource: ctx + '/newsSearch/front/page/' + searchType + '/' + searchWord,
        // 服务器请求
        fnServerData: retrieveData,
        // 用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
    	'iDisplayLength' : 10,
		
		'bLengthChange': false,
		"rowCallback": function(row, data, index) {
        	
        	var summary = "暂无摘要";
            if(null != data.summary){
        		if(data.summary.length>150){
        			summary = data.summary.substr(0,150)+'...';
        		}else{
        			summary = data.summary;
            	}
        	}
            
            var title = "暂无标题";
            if(null != data.title){
            	title = data.title;
        	}
            var newsUrl = "www.baidu.com"
            if(null != data.newsUrl){
            	newsUrl = data.newsUrl;
        	}
            var releaseTime = "[-]";
            if(null != data.releaseTime){
            	releaseTime = data.releaseTime;
        	}
            var sourceReport = "[-]";
            if(null != data.sourceReport){
            	sourceReport = data.sourceReport;
        	}
            // 页面中存在多个ctx值 ，此处获取的不应该添加uec
            var newCtx = ctx;
            if (ctx.indexOf('uec') != -1) {
                newCtx = ctx.substr(0, ctx.lastIndexOf('/'));
            }
            var imgSource = newCtx + '/frontEnd/image/home/defaultImg.png';
            if(null != data.imgSource){               
            	imgSource = data.imgSource;
	        }
            
            var simNewsNum = 0;
            var simNewsUrl = "";
            var relativeNews = '<span>'+ simNewsNum +'</span>[相关新闻]'
            if(null != data.simNewsNum && data.simNewsNum > 0){
            	simNewsNum = data.simNewsNum;
            	simNewsUrl = data.simNewsUrl;
            	relativeNews = '<a href="'+ simNewsUrl +'" target="_blank">'+ simNewsNum +'[相关新闻]</a>';
        	}
            
            var content = '<div class="media"><a class="media-left" href="'+newsUrl+'" target="_blank"><img src="'+imgSource+'" alt="'+title+'" class="img-thumbnail"/></a><div class="media-body"><div class="mediaCon pull-left"><h6 class="media-heading"><a href="'+newsUrl+'" target="_blank">'+title+'</a></h6><p class="mediaConSummary m-bottom"><a href="'+newsUrl+'" target="_blank">'+summary+'</a></p></div><div class="mediaRight pull-right"><ul class="list-group ta-right"><li class="list-group-item"><span>'+ releaseTime +'</span>[发布时间]</li><li class="list-group-item"><span>'+ sourceReport +'</span>[发稿来源]</li><li class="list-group-item">'+relativeNews+'</li></ul></div></div></div>';
            $('td:eq(0)', row).html(content);
            if ($('body').width() < 768) {
                $('.fullWebBoxTable').css({
                    'width': '800px'
                });
            }
        },
        columns: [ // 显示的列
            {data: 'title',"bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
    });
    
    $('.fullWebConThumbnailTable').on('draw.dt',function() {
    	$('.paginate_button').click(function(){
    		scrollOffset($(".fullWebConThumbnailTable").offset());
    	});
    	$('.fullWebConThumbnailTable').judgeImgLoadError();
    });
});

/* 切换数据的展示形式 */
function changeDataCon() {

    $('.fullWebScreeTable').find('td.fullWebConShow').each(function(index) {
    	
        $(this).click(function() {
            if (index == 0) {
                $('.fullWebConList').removeClass('hide');
                $('.fullWebConThumbnail').addClass('hide');
            }else if(index == 1){
            	$('.fullWebConThumbnail').removeClass('hide');
                $('.fullWebConList').addClass('hide');
            }
            $('.fullWebScreeTable').find('td.fullWebConShow').each(function(){
            	$(this).removeClass('active');
            });
            $(this).addClass('active');
        });
    });
}

/*enter键进入*/
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			if($('.reSearchInput').is(":focus")==true){
				/*$('.wholeNetwork').find('a').click();*/
				searchWholeNetNews();
			}
		}
	});
}

/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}
/* 切换数据的展示形式 */
function searchWholeNetNews() {
	searchType = "wholeNet";
    searchWord = $("#main-content").find(".form-control").val().trim();
    if(null != searchWord && searchWord !=""){
    	console.log('searchType:'+searchType);
    	console.log('searchWord:'+searchWord);
    	$(".searchType").attr("value",searchType);
        $(".searchWord").attr("value",searchWord);
        window.location.href=ctx + '/newsSearch/front/' + searchType + '/' + searchWord;
        table1.ajax.reload();
    }
}

/**
 * 获取查询所需参数，
 * @param arrayObj
 * @returns
 */
function getQueryParam(arrayObj){
	var searchType = $(".searchType").val();
    var searchWord = $(".searchWord").val();
	arrayObj.push();
	return arrayObj;
}

/**
 * 标题高亮显示
 */
function titlehighlight(title) {
	var queryStr =  $(".searchWord").val();
	if(null != queryStr && '' != queryStr && null != title && '' != title){
		var queryList = queryStr.split(/,|，|\|/);
		if(queryList !=null && queryList.length >0){
			console.info(queryList.length);
			for (var i = 0; i < queryList.length; i++) {
				var word = queryList[i];
				if(word == '*'){
                    title = title.replace(/\*/g, "<span style=\"color:red\">" + word + "</span>");
                }else{
                    var pattern = new RegExp(word, "mg");
                    title = title.replace(pattern, "<span style=\"color:red\">" + word + "</span>");
                }
			}
		}
	}
	return title;
}
