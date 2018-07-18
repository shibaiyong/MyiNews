$(function(){

	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',3);
    $('#footer').loadPage('../common/footer.html');

    $('.searchesTable').DataTable({
   		iDisplayLength : 20,
   		'sPaginationType': "bootstrap",
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	});

	/*bootstrap与masonry结合实现瀑布流*/
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
	
	
	
	showSearchCon();
	linkHotNewsDetail();
	/*自定义时间段*/
	timeCustom();


	/*热点排行-自定义时间*/
	datatimePicker();
});

/*点击搜索按钮，显示搜索结果*/
function showSearchCon () {
	$('.customAddBtn').click(function(){
		$('.searchesCon').slideDown();
		$('.hotRankList').hide();
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


/*热点检索-自定义时间*/
function datatimePicker(){
	$('.timeCustom').click(function(){
		$('button.dropdown-toggle').attr('aria-expanded','false');
		alert(1);
	});
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
        "ranges": {
         	'今天': [moment(), moment()],
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
	});
}
