var table;
EnterPress();
$(function(){
	/*头部导航高亮*/
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(5)').addClass('active');
	
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
    table = $('.searchesTable').DataTable({
    	scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/hot/front/pageHotNews',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
    	'sPaginationType': "bootstrap",
		'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
			var classifications = [];
			$('#HotRankClassification').find('a').each(function(index){
				classifications.push($(this).text().trim());
			});
			var rankingType = [];
			$('#HotSale').find('a').each(function(index){
				rankingType.push($(this).text().trim());
			});
			var time = $('#CustomTime').find('a').text().trim();
			var queryStr = [];
				$('#CustomAdd').find('a').each(function(index){
					queryStr.push($(this).text().trim());
				});
			if("最近一天" == time){
				time = "day";
			}else if("最近三天" == time){
				time = "threeDay";
			}else if("最近一周" == time){
				time = "week";
			}else if("最近一月" == time){
				time = "month";
			}else if("自定义时间" == time){
				time = $(".timeCustomCon").text().trim();
			}
			aoData.push(
					{"name":"classifications","value":classifications},
					{"name":"time","value":time},
					{"name":"queryStr","value":queryStr},
					{"name":"rankingType","value":rankingType}
				);
        },
        "rowCallback" : function(row, data, index) {
        	var title = '<a href="javascript:loadHotNewsDetail(\''+data.webpageCode+'\')"  class="beyondEllipsis" >'+data.title+' </a>';
        	$('td:eq(0)', row).html(title);
        	
        	if($('body').width()<768){
        		$('.searchesTable').css({
        			'width':'900px',
        		});
        	}
        },
        columns: [//显示的列
                  { data: 'title', "bSortable": false},
                  { data: 'crawlDatetime', "bSortable": false,
                	  render:function(data, type, row){
  	            		if(null != data && "" != data){
  	            			var datetime = new Date(data); 
  	            			return datetime.formatDate('yyyy-MM-dd hh:mm');
  	            		}
                       }  
                  },
                  { data: 'rankingTypeName', "bSortable": false,
                	 render:function(data, type, row){
	            		if('综合榜'==data){
	            			data = '微博';
	            		}
	            		
	            		return data;
                     }   
                  },
                  { data: 'rankingCycleName', "bSortable": false },
                  { data: 'sourceWebLevelTwo', "bSortable": false },
                  { data: 'rankingNum', "bSortable": false },
                  { data: 'clickingNum', "bSortable": false },
                  { data: 'commentNum', "bSortable": false },
                  { data: 'participateNum', "bSortable": false },
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ]
	});

    $('.searchesTable').on('draw.dt',function() {
    	$('.paginate_button').click(function(){
    		scrollOffset($(".searchesTable").offset());
    	});
    	
    	footerPutBottom();
    });
    
    $('.customAddInput').limit_input_length();
    
	showSearchCon();
	linkHotNewsDetail();
	/*自定义时间段*/
	timeCustom();

    /*热点排行-搜索*/
	hotRankScreen();


	/*热点检索-高级搜索*/
	advancedFilter();

	/*热点排行-自定义时间*/
	datatimePicker();
	
	loadHotRanking();
});

/*bootstrap与masonry结合实现瀑布流*/
function pinterest () {
	var $container = $('.masonry-container');
	$container.imagesLoaded( function () {
	  $container.masonry({
	        columnWidth: '.item',
	        itemSelector: '.item'
	  });   
	});
	$('a[data-toggle=tab]').each(function () {
		var $this = $(this);
		$this.on('shown.bs.tab', function () {
		    $container.imagesLoaded( function () {
		      	$container.masonry({
		        	columnWidth: '.item',
		       	 	itemSelector: '.item'
		      	});   
		    });  
		});
	});
}
/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}
/*点击搜索按钮，显示搜索结果*/
function showSearchCon () {
	$('.customAddBtn').click(function(){
		$('.searchesCon').slideDown();
		$('.hotRankList').hide();
		$('.dataTables_scrollBody').css({
			'height':'auto',
		});
	});
}

function linkHotNewsDetail(){
	$('.masonry-container').find('a').click(function(event) {
		$('#page-content').loadPage('hotNews/hotNewsDetail.html');
	});
}


/*自定义时间段*/
function timeCustom(){
  	$('.timeCustomCon').css('display','none');
  	$('.timeCustom').click(function(event) {
  		$('.timeCustomCon').slideDown('fast', function() {});
  	});
  	$('.timeCustom').parents('dd').siblings('dd').click(function(){
  		$('.timeCustomCon').slideUp('fast');
  	});

}
/*热点检索-高级筛选*/
function advancedFilter(){
	var count = 0;
	$('.advancedFilter').click(function(){
		if(count == 0){
			$('.advancedFilterCon').slideDown();
			count++;
			$(this).find('i').css({
				'-o-transition': 'transform .2s linear',
				'-moz-transition':' transform .2s linear',
				'-webkit-transition': 'transform .2s linear',
				'-ms-transition': 'transform .2s linear',
				'-ms-transform': 'rotate(180deg)',
				'-moz-transform': 'rotate(180deg)',
				'-webkit-transform': 'rotate(180deg)',
				'transform': 'rotate(180deg)'
			});
		}else{
			$('.advancedFilterCon').slideUp();
			count--;
			$(this).find('i').css({
				'-o-transition': 'transform .2s linear',
				'-moz-transition':' transform .2s linear',
				'-webkit-transition': 'transform .2s linear',
				'-ms-transition': 'transform .2s linear',
				'-ms-transform': 'rotate(0deg)',
				'-moz-transform': 'rotate(0deg)',
				'-webkit-transform': 'rotate(0deg)',
				'transform': 'rotate(0deg)'
			});
		}
		
	});
}

/*热点排行-搜索*/
function hotRankScreen(){
	$("#screenCondition dd").each(function(index) {
		$(this).click(function () {
			$(this).addClass("selected").siblings().removeClass("selected");
			loadHotRanking();
		});
	});
	$("#listType dd").each(function(index) {
		$(this).click(function () {
			$(this).addClass("selected").siblings().removeClass("selected");
			loadHotRanking();
		});
	});

	$("#screenConditionList dd").each(function(index) {
		$(this).click(function () {
			$(this).addClass("selected").siblings().removeClass("selected");
			loadHotRanking();
		});
	});
	
	$("#listPeriod dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
		} else if($(this).find('a').hasClass('hotTank-timeCustom')){
			$('.hotTank-timeCustomCon').find('button').click(function(){
				if($('#hotTank-TimeStart').val() == '' || $('#hotTank-TimeEnd').val() == ''){
					$(this).siblings('span').removeClass('hide');
					return false
				}else{
					$(this).siblings('span').addClass('hide');
				}
			});
		}else{
		}
		loadHotRanking();
	});
}


/*热点检索-自定义时间*/
function datatimePicker(){
	var options = {
		'locale' : {
			format:'YYYY-MM-DD',
			applyLabel: '确定',
            cancelLabel: '取消',
            weekLabel: 'W',
            customRangeLabel: '自定义',
            daysOfWeek:[ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames:[ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
		},
		'opens':'center',
        "ranges": {
         	/*'今天': [moment(), moment()],*/
            '最近7天': [moment().subtract(6, 'days'), moment()],
            '最近30天': [moment().subtract(29, 'days'), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "alwaysShowCalendars": true,
    };
	$('.timeCustom').daterangepicker(options, function(start, end, label) { 
		var customCon = start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD');
		$('.timeCustomCon').text(customCon);
		var $this = $("#customTime dd:last");
		var copyThisC = $this.clone();
		copyThisC.find('a').text('自定义时间');
		if ($("#CustomTime").length > 0) {
			$("#CustomTime a").html('自定义时间');
		} else {
			$(".select-result dl").append(copyThisC.attr("id", "CustomTime"));
			$("#CustomTime").on("click", function () {
				$(this).remove();
				$("#customTime .select-all").addClass("selected").siblings().removeClass("selected");
				$('.timeCustomCon').slideUp();
			});
			$(".select-no").hide();
		}
		
		reloadHotNewsList();
	});
}

function loadHotNewsDetail(webpageCode){
//	$('#page-content').load(ctx+'/hot/front/gotoHotNewsDetail/'+webpageCode);
//	window.open(ctx+'/hot/front/gotoHotNewsDetail/'+webpageCode);
	var queryStr = [];
	$('#CustomAdd').find('a').each(function(index){
		queryStr.push($(this).text().trim());
	});
	if(null != queryStr && queryStr.length>0){
		window.open(ctx+'/hot/front/gotoHotNewsDetail/'+webpageCode+'?queryStr='+queryStr);
	}else{
		window.open(ctx+'/hot/front/gotoHotNewsDetail/'+webpageCode);
	}
}

/**
 * 重新加载热点新闻列表
 */
function reloadHotNewsList(){
	table.ajax.reload();
}

function loadHotRanking(){
	var classifications;
	var rankingType;
	var rankingCycle;
	var listSize;
	var classification = $('#listType').find('.selected').find('a').text().trim();
	if('综合' != classification){
		classifications = classification;
	}
	rankingType = $('#screenConditionList').find('.selected').find('a').text().trim();
	rankingCycle = $('#listPeriod').find('.selected').find('a').text().trim();
	listSize = $('#screenCondition').find('.selected').find('a').text().trim().replace(/[^0-9]/ig, "");
	var data = {'classifications':classifications,'rankingType':rankingType,'rankingCycle':rankingCycle,'listSize':listSize};
	$.ajax({
        url : ctx+'/hot/front/loadHotRanking',
        data : data,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	var content = '';
        	if(data.result){
        		var rankList = data.resultObj;
        		if(null == rankList || ''==rankList){
        			$('.rankList').html(content);
        			return;
        		}
        		content += '<div class="row masonry-container"  >';
        		for (var i = 0; i < rankList.length; i++) {
        			var rank = rankList[i];
        			var image = rank.image;
        			var name = rank.name;
        			var hotList = rank.hotList;
        			
        			content += '<div class="col-md-4 col-sm-6 item p-left"><div class="thumbnail p-all"><div class="caption p-all"><div class="captionTitle clearfix ">';
        		    if('iNews'==image){
        		    	content += '<img src="'+ctx+'/frontEnd/image/hotNewsRank/iNews.png"/>';
        		    }else{
        		    	content += '<img src="'+ctx+image+'"/>';
        		    }
        		    
        		    content += '</div><div class="captionCon"><ul class="list-group-style">';
		            for (var j = 0; j < hotList.length; j++) {
		            	var hotNews = hotList[j];
		            	var color;
		            	var count;
		            	var rankingNum = hotNews.rankingNum;
		            	if('点击榜'==rankingType){
	        		    	count = hotNews.clickingNum;
	        		    }else if('跟帖榜'==rankingType){
	        		    	count = hotNews.participateNum;
	        		    }
		            	if('iNews'==image){
		            		count = hotNews.heatNum;
		            		if(null == count){
		            			count = 0;
		            		}
		            		rankingNum = j+1;
		            	}
		            	if('新浪微博'==name){
		            		count = hotNews.participateNum;
		            	}
		            	if(null==count || ''==count || undefined == count){
		            		count = '-';
		            	}else if(count/10000>=1){
		            		count = Math.round(count/10000)+"万";
		            	}else{
		            		count = Math.round(count);
		            	}
		            	if(3>=rankingNum){
		            		color = 'red';
		            	}else{
		            		color = 'hui';
		            	}
		            	content += '<li class="list-style-item"><em class="'+color+'">'+rankingNum+'</em><a href="javascript:loadHotNewsDetail(\''+hotNews.webpageCode+'\')" class="beyondEllipsis">'+hotNews.title
		            			+ '</a><span class="pull-right listTil listTilNew">['+count+']</span></li>';
					}  	
        		    content += '</ul></div></div></div></div>';         
				}
        		content += '</div>';
        	}
        	$('.rankListCon').removeAttr('style');
        	$('.rankList').html(content);
        	if($('body').width()>800){
        		pinterest ();
        	}
        	
        },
        error : function(msg) {
        	console.log(msg.errorMsg);
        }
        
        
    });
}

/*enter键进入*/
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			if($('.customAdd').find('input').is(":focus")==true){
				$('.customAddBtn').click();
			}
		}
	});
}
