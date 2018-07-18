var table;
EnterPress();
$(function(){

	/*头部导航高亮*/
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(4)').addClass('active');
	
	table = $('.searchesTable').DataTable({
		serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/latest/front/getTopNewsView',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
    	'sPaginationType': "bootstrap",
		'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
			var time = $("#timeSelect").val();
			var queryStr = $("#queryStr").val();
			aoData.push(
					{"name":"showSimilar","value":true},
					{"name":"isTopNews","value":true},
					{"name":"time","value":time},
					{"name":"sort","value":"releaseDatetime"},
					{"name":"queryStr","value":queryStr}
				);
        },
        "rowCallback" : function(row, data, index) {
        	var title = '<a href="javascript:loadTopNews('+data.innerid+')"  class="beyondEllipsis">'+data.title+' </a>';
        	$('td:eq(0)', row).html(title);
        },
        columns: [//显示的列
                  { data: 'title', "bSortable": false },
                  { data: 'releaseDatetime', "bSortable": false,
                	  render:function(data, type, row){
                		  var releaseDatetime = new Date(data);
                      	  releaseDatetime = releaseDatetime.formatDate('MM-dd hh:mm');
                      	  return releaseDatetime;
                       }
                  },
                  { data: 'sourceCrawlLevelTwo', "bSortable": false },
                  
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
	$('#queryStr').limit_input_length();
	showSearchCon();
	footerPutBottom();
	pinterest();
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
/*点击搜索按钮，显示搜索结果*/
function showSearchCon () {
	$('.customAddBtn').click(function(){
		table.ajax.reload();
		$('.searchesCon').slideDown();
		$('.hotRankList').hide();
	});
}

/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}

function loadTopNews(id){
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
//	window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	var queryStr = $("#queryStr").val();
	if(null != queryStr && queryStr.length>0){
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id+'?queryStr='+queryStr);
	}else{
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	}
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

