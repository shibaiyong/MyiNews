var table1;
var table2;
var table3;
var table4;
EnterPress();
$(function(){

	/*头部导航高亮*/
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.event'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
	   /*事件查询-日期点击*/
    table1 = $('.searchesTable').DataTable({
    	scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/event/front/pageEvent',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
    	'sPaginationType': "bootstrap",
		'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
//			var classifications = [];
//			$('#HotRankClassification').find('a').each(function(index){
//				classifications.push($(this).text().trim());
//			});
//			var time = $('#CustomTime').find('a').text().trim();
//			var queryStr = [];
//				$('#CustomAdd').find('a').each(function(index){
//					queryStr.push($(this).text().trim());
//				});
			
			
//			if("最近一天" == time){
//				time = "day";
//			}else if("最近三天" == time){
//				time = "threeDay";
//			}else if("最近一周" == time){
//				time = "week";
//			}else if("最近一月" == time){
//				time = "month";
//			}else if("自定义时间" == time){
//				time = $(".timeCustomCon").text().trim();
//			}
			
			var queryStr = [];
			queryStr.push($('.customAddInput').val().trim());
			
			aoData.push(
//					{"name":"classificationName","value":classifications},
//					{"name":"time","value":time},
					{"name":"queryStr","value":queryStr}
				);
        },
        "rowCallback" : function(row, data, index) {
        	var title = '<a href="javascript:loadEventDetail(\''+data.eventCode+'\');"  class="beyondEllipsis" >'+data.eventName+' </a>';
        	$('td:eq(0)', row).html(title);
        	if($('body').width()<768){
        		$('.searchesTable').css({
        			'width':'900px',
        		});
        	}
        },
        columns: [//显示的列
                  { data: 'eventName', "bSortable": false},
                  { data: 'classificationName', "bSortable": false},
                  { data: 'occurDatetime', "bSortable": false,
                	  render:function(data, type, row){
	            		if(null != data && "" != data){
	            			var datetime = new Date(data); 
	            			return datetime.formatDate('yyyy-MM-dd hh:mm');
	            		}
                	  }    
                  },
                  { data: 'newsNum', "bSortable": false },
                  { data: 'endDatetime', "bSortable": false,
                	  render:function(data, type, row){
  	            		if(null != data && "" != data){
  	            			var datetime = new Date(data); 
  	            			return datetime.formatDate('yyyy-MM-dd hh:mm');
  	            		}
                  	  }  
                  },
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ]
	 });
    /*最新事件*/
    var sPaginationTypeCon = 'simple';
    var iDisplayLengthCon;
    if($('body').width()>=992){
      iDisplayLengthCon = 4;
    }else if(768<$('body').width()<992){
      iDisplayLengthCon = 2;
    }
    if($('body').width()<=768){
      sPaginationTypeCon = 'simple_numbers';
    }
    table2 = $('.hotEventTable').DataTable({
    		"dom":  "<'row'<'col-sm-12'tr>><'row hotEventTablePagination'p>",
    		oLanguage:{
        		"oPaginate" : {
        			"sPrevious" : "<i class='fa fa-fw fa-angle-left fa-5x'></i>",
            		"sNext" : "<i class='fa fa-fw fa-angle-right fa-5x'></i>",
            	}
        	},
            sPaginationType:sPaginationTypeCon,
            serverSide: true,//标示从服务器获取数据
          	sAjaxSource : ctx+'/event/front/pageLatestEvent',//服务器请求
          	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
      		iDisplayLength : iDisplayLengthCon,
      		fnServerParams : function ( aoData ) {},
              "rowCallback" : function(row, data, index) {
            	var content = '<div class="hotEventConListBox"><h6 class="hotEventConListTit">'
            		     + '<a href="javascript:loadEventDetail(\''+data.eventCode+'\');" class="beyondEllipsis">'+data.eventName+'</a>'
						 + '</h6><div  class="thumbnail"><a href="javascript:loadEventDetail(\''+data.eventCode+'\');"><img data-eventCode="'+data.eventCode+'" class="defaultImg"  alt="" src="'+context+'/frontEnd/image/home/default-gray.png"  /></a>'
						 + '</div><p class="hotEventConListTime">'+new Date(data.occurDatetime).formatDate('yyyy-MM-dd hh:mm')+'</p>'
						 + '<p class="sudokuSummary clearfix"><a href="javascript:loadEventDetail(\''+data.eventCode+'\');"><span>[摘要]&nbsp;</span>'+data.description+'</a></p></div>'
              	$('td:eq(0)', row).html(content);
            	$(row).addClass('col-md-3 col-sm-6');
            	
            	getImgUrl(data.picPath,data.eventCode);
            	
              },
              columns: [//显示的列
                        { data: 'innerid', "bSortable": false},
                    ],
            	"aaSorting": [[0, ""]],
            	"columnDefs": [ {
                  "targets": [ '_all' ],
                  "data": null,
                  "defaultContent": "-"
              } ]
   });
    
//    table2.on('draw.dt',function() {
//        $(this).find('tbody').find('tr').addClass('col-md-3 col-ms-12 ');
//    });

    /*历史跟踪*/
    table3 = $('.historyFollowTable').DataTable({
    	"dom":  "<'row'<'col-sm-12'tr>><'row hotEventTablePagination'p>",
    	oLanguage:{
    		"oPaginate" : {
    			"sPrevious" : "<i class='fa fa-fw fa-angle-left fa-5x'></i>",
        		"sNext" : "<i class='fa fa-fw fa-angle-right fa-5x'></i>",
        	}
    	},
        sPaginationType:sPaginationTypeCon,
        serverSide: true,//标示从服务器获取数据
      	sAjaxSource : ctx+'/event/front/pageTracingEvent',//服务器请求
      	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
  		iDisplayLength : iDisplayLengthCon,
  		fnServerParams : function ( aoData ) {},
          "rowCallback" : function(row, data, index) {
        	var content = '<div class="hotEventConListBox"><h6 class="hotEventConListTit">'
        		     + '<a href="javascript:loadEventDetail(\''+data.eventCode+'\')" class="beyondEllipsis">'+data.eventName+'</a>'
					 + '</h6><div  class="thumbnail"><a href="javascript:loadEventDetail(\''+data.eventCode+'\')"><img data-eventCode="'+data.eventCode+'" class="defaultImg"  alt="" src="'+context+'/frontEnd/image/home/default-gray.png"   /></a>'
					 + '</div><p class="hotEventConListTime">'+new Date(data.occurDatetime).formatDate('yyyy-MM-dd hh:mm')+'</p>'
					 + '<p class="sudokuSummary clearfix"><a href="javascript:loadEventDetail(\''+data.eventCode+'\')"><span>[摘要]&nbsp;</span>'+data.description+'</a></p></div>'
          	$('td:eq(0)', row).html(content);
        	$(row).addClass('col-md-3 col-sm-6');
        	
        	getImgUrl(data.picPath,data.eventCode);
          },
          columns: [//显示的列
                    { data: 'innerid', "bSortable": false},
                ],
        	"aaSorting": [[0, ""]],
        	"columnDefs": [ {
              "targets": [ '_all' ],
              "data": null,
              "defaultContent": "-"
          } ]
   });
    

    /*历史同期事件*/
    table4 = $('.historyPeriodTable').DataTable({
    	"dom":  "<'row'<'col-sm-12'tr>><'row hotEventTablePagination'p>",
    	oLanguage:{
    		"oPaginate" : {
    			"sPrevious" : "<i class='fa fa-fw fa-angle-left fa-5x'></i>",
        		"sNext" : "<i class='fa fa-fw fa-angle-right fa-5x'></i>",
        	}
    	},
        sPaginationType:sPaginationTypeCon,
        serverSide: true,//标示从服务器获取数据
      	sAjaxSource : ctx+'/event/front/pageHistoryEvent',//服务器请求
      	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
  		iDisplayLength : iDisplayLengthCon,
  		fnServerParams : function ( aoData ) {},
          "rowCallback" : function(row, data, index) {
        	var content = '<div class="hotEventConListBox"><h6 class="hotEventConListTit">'
        		     + '<a href="javascript:loadEventDetail(\''+data.eventCode+'\')" class="beyondEllipsis">'+data.eventName+'</a>'
					 + '</h6><div  class="thumbnail"><a href="javascript:loadEventDetail(\''+data.eventCode+'\')"><img data-eventCode="'+data.eventCode+'" class="defaultImg"  alt="" src="'+context+'/frontEnd/image/home/default-gray.png"   /></a>'
					 + '</div><p class="hotEventConListTime">'+new Date(data.occurDatetime).formatDate('yyyy-MM-dd hh:mm')+'</p>'
					 + '<p class="sudokuSummary clearfix"><a href="javascript:loadEventDetail(\''+data.eventCode+'\')"><span>[摘要]&nbsp;</span>'+data.description+'</a></p></div>'
          	$('td:eq(0)', row).html(content);
        	$(row).addClass('col-md-3 col-sm-6');
        	getImgUrl(data.picPath,data.eventCode);
          },
          columns: [//显示的列
                    { data: 'innerid', "bSortable": false},
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
   $('.hotEventTable').on('draw.dt',function() {
	   $(this).find($('.sudokuSummary')).each(function(){
       	if($(this).height()>155){
   			$(this).css({
   				'height':'155px'
   			});
   			$(this).each(function(){
   				$(this).dotdotdot({
   					wrap: 'letter'
   				});
   			});
   		}else{
   			$(this).css({
   				'height':'155px'
   			});
   		}
       });
	   $('.hotEventCon').mouseenter(function(){
			  $(this).find('.pagination').fadeIn();
			  return false;
		  });
		  $('.hotEventCon').mouseleave(function(){
			  $(this).find('.pagination').fadeOut();
			  return false;
		  });
	   $('.hotEventTable').judgeImgLoadError(context+'/frontEnd/image/home/defaultImg.png');
	   $('.hotEventTable tbody').find('tr').each(function(){
		   
		   if($(this).attr('role')==undefined){
			   $('.hotEventCon').find('.pagination').remove();
		   }
	   });
   });
   $('.historyFollowTable').on('draw.dt',function() {
	   $(this).find($('.sudokuSummary')).each(function(){
       	if($(this).height()>155){
   			$(this).css({
   				'height':'155px'
   			});
   			$(this).each(function(){
   				$(this).dotdotdot({
   					wrap: 'letter'
   				});
   			});
   		}else{
   			$(this).css({
   				'height':'155px'
   			});
   		}
       });
	   $('.historyFollowCon').mouseenter(function(){
			  $(this).find('.pagination').fadeIn();
			  return false;
		  });
		  $('.historyFollowCon').mouseleave(function(){
			  $(this).find('.pagination').fadeOut();
			  return false;
		  });
	   $('.historyFollowTable').judgeImgLoadError(context+'/frontEnd/image/home/defaultImg.png');
	   $('.historyFollowTable tbody').find('tr').each(function(){
		   
		   if($(this).attr('role')==undefined){
			   $('.historyFollowCon').find('.pagination').remove();
		   }
	   });
   });
   $('.historyPeriodTable').on('draw.dt',function() {
	   $(this).find($('.sudokuSummary')).each(function(){
       	if($(this).height()>155){
   			$(this).css({
   				'height':'155px'
   			});
   			$(this).each(function(){
   				$(this).dotdotdot({
   					wrap: 'letter'
   				});
   			});
   		}else{
   			$(this).css({
   				'height':'155px'
   			});
   		}
       });
	   $('.historyPeriodCon').mouseenter(function(){
			  $(this).find('.pagination').fadeIn();
			  return false;
		  });
		  $('.historyPeriodCon').mouseleave(function(){
			  $(this).find('.pagination').fadeOut();
			  return false;
		  });
	   $('.historyPeriodTable').judgeImgLoadError(context+'/frontEnd/image/home/defaultImg.png');
	   $('.historyPeriodTable tbody').find('tr').each(function(){
		   
		   if($(this).attr('role')==undefined){
			   $('.historyPeriodCon').find('.pagination').remove();
		   }
	   });
   });
   
   $('.customAddInput').limit_input_length();
   
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
    $('.dataTables_scrollBody').css({
		'height':'auto',
	});
  });
}
/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
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

/**
 * 请求图片服务器
 */
function getImgUrl(imageUrl,code){
	var $this = $(this);
	
	$.ajax({
        url : inewsImageManager+imageUrl+'&width=320&height=180',//这个就是请求地址对应sAjaxSource
        data:{'code':code},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == 'success'){
        		newImgUrl = data.value;
        		var code = data.code;
        		$('img[data-eventcode="'+code+'"]').attr('src','').attr('src',data.value).removeClass('defaultImg');
        		
        	}else{
        		newImgUrl = ctx+'/frontEnd/image/home/defaultImg.png';
        	}
        },
        error : function(msg) {
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
            table1.ajax.reload();
            $("#customTime .select-all").addClass("selected").siblings().removeClass("selected");
            $('.timeCustomCon').slideUp();
          });
          $(".select-no").hide();
      }
      table1.ajax.reload();
  });
}

function loadEventDetail(id){
	window.open(ctx+"/event/front/detail/"+id);
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
