$(function(){
	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',4);
    $('#footer').loadPage('../common/footer.html');
    
    $('.searchesTable').DataTable({
   		iDisplayLength : 20,
   		'sPaginationType': "bootstrap",
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
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
	$('.rankListCon').removeAttr('style');
	showSearchCon();
	/*自定义时间段*/
	timeCustom();

    /*热点排行-搜索*/
	hotRankScreen();


	/*热点检索-高级搜索*/
	advancedFilter();

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
		});
	});
	$("#listType dd").each(function(index) {
		$(this).click(function () {
			$(this).addClass("selected").siblings().removeClass("selected");
		});
	});

	$("#screenConditionList dd").each(function(index) {
		$(this).click(function () {
			$(this).addClass("selected").siblings().removeClass("selected");
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
		var $this = $("#customTime dd:last");
		var copyThisC = $this.clone();
		copyThisC.find('a').text('自定义时间');
				
			if ($("#CustomTime").length > 0) {
					$("#CustomTime a").html('自定义时间');
			} else {
					alert(0);
					$(".select-result dl").append(copyThisC.attr("id", "CustomTime"));

					$("#CustomTime").on("click", function () {
						$(this).remove();
						$("#customTime .select-all").addClass("selected").siblings().removeClass("selected");
						$('.timeCustomCon').slideUp();
					});
					$(".select-no").hide();
			}

	});
}
