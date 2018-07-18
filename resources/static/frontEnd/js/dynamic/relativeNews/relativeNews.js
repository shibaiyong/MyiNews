$(function(){
	/*加载头部与尾部*/
    /*$('#header').loadPage('../common/header.html');
    $('#footer').loadPage('../common/footer.html');*/
    
	/* 头部导航高亮 */
	/*$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(6)').addClass('active');*/
	/* 头部导航高亮 */
    $().showHeader();
	var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4 col-xs-4'i><'col-sm-8 col-xs-8'p>>";
	var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
	var scrollCon = '';
	var pagingTypeCon = 'full_numbers';
	if($('body').width()<1200){
		domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row '<'col-sm-3 col-xs-4 table_bottom_left'i><'col-sm-9 col-xs-8 table_bottom_right'p>>";
		totalCount = "共计  _TOTAL_ 条";
	}
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
	var relativeType = $(".relativeType").val();
	var webpageCode = $(".webpageCode").val();
	var sourceCrawl = $(".sourceCrawl").val();
	var clusterid = $(".clusterid").val();
	var eventid = $(".eventid").val();
    $('.relativeNewsTable').DataTable({
    	dom:domString,
    	scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/latest/front/page/'+relativeType,//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
    	'sPaginationType': "bootstrap",
		'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
			aoData.push(
					{"name":"webpageCode","value":webpageCode},
					{"name":"sourceCrawl","value":sourceCrawl},
					{"name":"clusterCode","value":clusterid},
					{"name":"eventCode","value":eventid}
				);
        },
        "rowCallback" : function(row, data, index) {
        	var summary = '';
        	if(null != data.nlpSummary){
        		if(data.nlpSummary.length>150){
              summary = data.nlpSummary.substr(0,150)+'...';
            }else{
              summary = data.nlpSummary;
            	}
        	}
        	var title = '<a href="'+ctx+'/latest/front/news/detail/'+ data.webpageCode +'" target="_blank" class="beyondEllipsis" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+summary+'">'+data.title+' </a>';
        	$('.linkLastNewsDataTable').removeAttr('style');
        	$('td:eq(0)', row).html(title);
        	$('td:eq(0)', row).addClass("titleRightClick");
        	$('td:eq(1)', row).html(data.sourceCrawlDetail.website.displayName);
        	if(null != data.relevantNum && ""!=data.relevantNum){
          		var relevantNews = '<a href="'+ctx+'/latest/front/relevantNewsList/'+data.webpageCode+'" target="_blank">('+data.relevantNum+')</a>';
          		$('td:eq(5)', row).html(relevantNews);
        	}else{
        		$('td:eq(5)', row).html('(0)');
        	}
        	
        	if($('body').width()<768){
	        	$('.relativeNewsTable').css({
	        		'width':'800px'
	        	});
        	}
        },
        columns: [//显示的列
//                  { data: 'webpageCode', "bSortable": false},
                  { data: 'title', "bSortable": false},
                  { data: 'sourceCrawlLevelTwo', "bSortable": false},
                  { data: 'sourceReport', "bSortable": false},
                  { data: 'releaseDatetime', "bSortable": false,
                	  render:function(data, type, row){
	            		if(null != data && "" != data){
	            			var datetime = new Date(data); 
	            			return datetime.formatDate('yyyy-MM-dd');
	            		}
                	  }    
                  },
                  { data: 'relevantNum', "bSortable": false},
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ]
	});	
    
    $('.relativeNewsTable').on('draw.dt',function() {
        $("[data-toggle='popover']").popover({
    		html:true,
    		trigger:'hover',
    	});
        $('.paginate_button').click(function(){
    		scrollOffset($(".relativeNewsTable").offset());
    	});
        footerPutBottom();
    });
    /*相似相关新闻关键词数据*/
    if(webpageCode !=null && webpageCode != ''){
        
        keywords(relativeType,webpageCode);
        $("[data-toggle='popover']").popover({
    		html:true,
    		trigger:'hover',
    		content:'<div class="sudokuShowCon"><ul class="list-group m-bottom" style="width:256px"><li class="list-group-item">浏览量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">建稿量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">采用量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">相似新闻<a href="javascript:void" class="pull-right ">[2]</a></li></ul></div>'
    	});
        footerPutBottom();
    }

});
/*跳转新闻详情页*/
function loadTopNews(id){
	window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
}

/*相似相关新闻关键词数据*/
function keywords(relativeType,webpageCode){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/latest/front/keywords/"+relativeType+"/"+webpageCode,
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(null == data || data.length == 0){
				/*隐藏内容为空的区域*/
				$(".col-md-4").find(".relativeNewsKeys").html("");
			}else{
				var content = "";
				for(var i = 0 ; i < data.length;i++){
					content += '<a href="javascript:void(0)">'+data[i].keyword+'</a>';
				}
				$(".col-md-3").find(".relativeNewsKeys").find(".listLabel").html(content);
			}
		},
		error : function(errorMsg) {
			console.log("相似相关新闻关键词请求数据失败啦!");
		}
	});
}
/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}