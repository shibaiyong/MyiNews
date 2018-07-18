$(function(){

    /*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',6);
    $('#footer').loadPage('../common/footer.html');

	   /*事件查询-日期点击*/
    $('.searchesTable').DataTable({
   		iDisplayLength : 20,
      'sPaginationType': "bootstrap",
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	 });
    /*最新事件*/
    $('.hotEventTable').DataTable({
      "dom":  "<'row'<'col-sm-12'tr>>" +
              "<'row hotEventTablePagination'p>",
      'iDisplayLength' : 4,
      'sPaginationType':'simple',
      "aoColumns": [ 
        { "bSortable": false },
      ],
      "aaSorting": [[0, ""]],
   });

    /*历史跟踪*/
    $('.historyFollowTable').DataTable({
      "dom":  "<'row'<'col-sm-12'tr>>" +
              "<'row hotEventTablePagination'p>",
      'iDisplayLength' : 4,
      'sPaginationType':'simple',
      "aoColumns": [ 
        { "bSortable": false },
      ],
      "aaSorting": [[0, ""]],
   });

    /*历史同期事件*/
    $('.historyPeriodTable').DataTable({
      "dom":  "<'row'<'col-sm-12'tr>>" +
              "<'row hotEventTablePagination'p>",
      'iDisplayLength' : 4,
      'sPaginationType':'simple',
      "aoColumns": [ 
        { "bSortable": false },
      ],
      "aaSorting": [[0, ""]],
   });
    
  /*点击搜索按钮，显示搜索结果*/
  showSearchCon();
  /*自定义时间段*/
  timeCustom();
  /*热点检索-高级筛选*/
  advancedFilter();
  /*热点检索-自定义时间*/
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