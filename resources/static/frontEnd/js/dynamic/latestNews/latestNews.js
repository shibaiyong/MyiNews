var table1;
var table2;
var table3;
EnterPress();
$(function(){
	/*头部导航高亮*/
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(10)').addClass('active');
	
	$('.search-wrapper').find('.search-icon').find('span').each(function(){
		$(this).removeClass('active');
	});
	$('.search-wrapper').find('.search-icon').find('span:eq(1)').addClass('active');
	var displayLength = 20;
	$('.showBranches').each(function(){
    	$(this).click(function(){
    		displayLength = $(this).text();
    		$('.showBranches').removeClass('active');
    		$(this).addClass('active');
    		table1.ajax.reload();
    		table1.page.len( displayLength ).draw()
    	});
    });
	
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
    table1 = $('.dataConBoxTable').DataTable({
    	scrollX: scrollCon,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/latest/front/pageLatestNews',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		'sPaginationType': "bootstrap",
        'iDisplayLength' : displayLength,
		fnServerParams : function ( aoData ) {
			aoData = getQueryParam(aoData);
        },
        "rowCallback" : function(row, data, index) {
        	var summary = '';
        	if(null != data.nlpSummary){
        		if(data.nlpSummary.length>150){
	              summary = data.nlpSummary.substr(0,150)+'...';
	            }else{
	              summary = data.nlpSummary;
	            }
        	}else{
        		summary = '暂无摘要';
        	}
        	var title = '<a href="javascript:loadTopNews('+data.innerid+')"  class="beyondEllipsis" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+summary+'">'+data.title+' </a>';
        	$('.linkLastNewsDataTable').removeAttr('style');
        	$('td:eq(1)', row).html(title);
        	$('td:eq(1)', row).addClass("titleRightClick");
        	
        	if(null != data.similarNum && ""!=data.similarNum){
        		var similarNews = '<a href="'+ctx+'/latest/front/similarNewsList/'+data.webpageCode+'" target="_blank" >('+data.similarNum+')</a>';
      		$('td:eq(4)', row).html(similarNews);
        	}else{
        		$('td:eq(4)', row).html('(0)');
        	}
        	
        	if(null != data.relevantNum && ""!=data.relevantNum){
          		var relevantNews = '<a href="'+ctx+'/latest/front/relevantNewsList/'+data.webpageCode+'" target="_blank">('+data.relevantNum+')</a>';
          		$('td:eq(5)', row).html(relevantNews);
        	}else{
        		$('td:eq(5)', row).html('(0)');
        	}
        	
        	if($('body').width()<768){
	        	$('.dataConBoxTable').css({
	        		'width':'800px'
	        	});
        	}
        },
        columns: [//显示的列
                  { data: 'releaseDatetimeStr', "bSortable": false},
//                  { data: 'cusClassification', "bSortable": false },
                  { data: 'title', "bSortable": false },
                  { data: 'sourceCrawlLevelTwo', "bSortable": false },
                  { data: 'sourceReport', "bSortable": false },
                  { 
                  	data: 'similarNum', "bSortable": false,
                  },
                  { 
                  	data: 'relevantNum', "bSortable": false,
                  
                  },
                  /*{ data: 'webpageCode', "bSortable": false },*/
                  { data: 'status', "bSortable": false, 
                	render:function(data, type, row){
                  		var content = '<span class="label label-danger">建</span> <span class="label label-warning">采</span>';
                  		return content;
                  	}
                  },
                  { 
                	data: 'innerid', "bSortable": false,
                	render:function(data, type, row){
                		var content = '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">收藏 <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="javascript:void(0);">收藏</a></li><li><a href="javascript:void(0);">建稿</a></li></ul></div>';
                		return content;
                	}
                   }
                  
              ],
      	"aaSorting": [[0, ""]],
      	"columnDefs": [ {
            "targets": [ '_all' ],
            "data": null,
            "defaultContent": "-"
        } ]
	});
    
    var scrollCon2 = '';
    if($('body').width()<768){
		scrollCon2 = true;
	}
    
    table2 = $('.dataConThumbnailTable').DataTable({
    	scrollX: scrollCon2,
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/latest/front/pageLatestNews',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
      'sPaginationType': "bootstrap",
		'iDisplayLength' : 10,
		fnServerParams : function ( aoData ) {
			aoData = getQueryParam(aoData);
        },
        "rowCallback" : function(row, data, index) {
        	var labels = "";
        	if(null != data.label && "" != data.label){
        		var labelArray = data.label.split(";");
        		for (var i = 0; i < labelArray.length; i++) {
					if(i == 0){
						labels += '<span><i class="fa fa-tags"></i></span><a><a>'+labelArray[i]+'</a>';
					}else{
						labels += '<a>'+labelArray[i]+'</a>';
					}
				}
        	}
        	var summary = ""; 
        	if(null != data.nlpSummary && "" != data.nlpSummary){
        		summary = data.nlpSummary;
        	}
        	var browseCount = 0;
        	if(null != data.browseCount && "" != data.browseCount){
        		browseCount = data.browseCount;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('yyyy-MM-dd hh:mm');
        	
        	var relevantNum = 0;
        	if(null != data.relevantNum && "" != data.relevantNum){
        		relevantNum = data.relevantNum;
        	}
        	
        	var sourceReport = '';
        	if(null != data.sourceReport){
        		sourceReport = data.sourceReport;
        	}
        	if(data.picPath == null){
        		if($('#session-debug').val() == 'true'){
        			data.picPath = '';
        		}else{
        			data.picPath = ctx+'/frontEnd/image/home/defaultImg.png';
        		}
	            
	          }
        	
        	var relevantNews='';
        	if(null != data.relevantNum && ""!=data.relevantNum){
          		relevantNews = ctx+'/latest/front/relevantNewsList/'+data.webpageCode;
        	}else{
        		relevantNews = 'javascript:void';
        	}
        	var content = '<div class="media"><a class="media-left" href="javascript:loadTopNews('+data.innerid+')"> <img src="'+data.picPath+'" alt="'+data.title+'"  /></a>'
        				+ '<div class="media-body"><div class="mediaCon pull-left"><h6 class="media-heading"><a href="javascript:loadTopNews('+data.innerid+')" >'+data.title+' </a></h6>'
        				
        				+ '<p class="mediaConSummary"><a href="javascript:loadTopNews('+data.innerid+')">'+summary+'</a></p><p class="mediaConBottom"><em>'+browseCount+'</em> <span>浏览量</span> <i>|</i> <em>0</em> <span>建稿量</span><i>|</i> <em>0</em> <span>采用量</span></p>'+'<p class="mediaConTag"> '+labels+'</p>'+'</div>'
        				+ '<div class="mediaRight pull-right"><ul class="list-group"><li class="list-group-item">'
        				+ '<span>'+releaseDatetime+'</span> [发布时间]</li>'
        				+ '<li class="list-group-item"><span >'+sourceReport+'</span> [发稿来源]</li>'
        				+ '<li class="list-group-item"><span>'+data.sourceCrawlLevelTwo+'</span> [爬取来源]</li>'
        				+ '<li class="list-group-item"><a href="'+relevantNews+'" target="_blank">'+relevantNum+' [相关新闻]</a></li></ul>'
        				+ '<p><button type="button" class="btn btn-red btn-sm"><i class="fa fa-share-square-o"></i>建稿</button>&nbsp;<button type="button" class="btn btn-red btn-sm"><i class="fa fa-star-o"></i>收藏</button></p></div></div></div>';
        	$('td:eq(0)', row).html(content);
        	$('.linkLastNewsDataTable').removeAttr('style');
        	if($('body').width()<768){
	        	$('.dataConThumbnailTable').css({
	        		'width':'800px'
	        	});
        	}
        },
        
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
    
    table3 = $('.dataConSudokuTable').DataTable({
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/latest/front/pageLatestNews',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
      'sPaginationType': "bootstrap",
		'iDisplayLength' : 12,
		fnServerParams : function ( aoData ) {
			aoData = getQueryParam(aoData);
        },
        "rowCallback" : function(row, data, index) {
        	var labels = "";
        	if(null != data.label && "" != data.label){
        		var labelArray = data.label.split(",");
        		for (var i = 0; i < labelArray.length; i++) {
					if(i = 0){
						labels += '<a>'+labelArray[i]+'</a>';
					}else{
						labels += '<em>|</em><a>'+labelArray[i]+'</a>';
					}
				}
        	}
        	var summary = ""; 
        	if(null != data.nlpSummary && "" != data.nlpSummary){
        		summary = data.nlpSummary;
        	}
        	var browseCount = 0;
        	if(null != data.nlpSummary && "" != data.nlpSummary){
        		browseCount = data.browseCount;
        	}
        	var releaseDatetime = new Date(data.releaseDatetime);
        	releaseDatetime = releaseDatetime.formatDate('yyyy-MM-dd hh:mm');
        	
        	
        	var relevantNum = 0;
        	if(null != data.relevantNum && "" != data.relevantNum){
        		relevantNum = data.relevantNum;
        	}
        	
        	var sourceReport = '';
        	if(null != data.sourceReport){
        		sourceReport = data.sourceReport;
        	}
        	var browseCount = 0;
        	if(null != data.browseCount){
        		browseCount = data.browseCount;
        	}
        	var similarNum = 0;
        	if(null != data.similarNum){
        		similarNum = data.similarNum;
        	}
          if(data.picPath == null){
        	  if($('#session-debug').val() == 'true'){
        		  data.picPath = '';
        	  }else{
        		  data.picPath = ctx+'/frontEnd/image/home/defaultImg.png';
        	  }
          }
           
        	var more = "<div class='sudokuShowCon'><ul class='list-group m-bottom' style='width:256px'><li class='list-group-item'>浏览量<a href='javascript:void' class='pull-right '>["+browseCount+"]</a></li><li class='list-group-item'>建稿量<a href='javascript:void' class='pull-right '>["+0+"]</a></li><li class='list-group-item'>采用量<a href='javascript:void' class='pull-right '>["+0+"]</a></li><li class='list-group-item'>相似新闻<a href='javascript:void' class='pull-right '>["+similarNum+"]</a></li></ul></div>";
        	var content = '<div class="thumbnail"><div class="sudokuImg"><a href="javascript:loadTopNews('+data.innerid+')"><img src="'+data.picPath+'" alt="'+data.title+'" /></a></div>'
						+ '<div class="caption"><dl class="dl-horizontal"><dt class="captionTitle"><a href="javascript:loadTopNews('+data.innerid+')" >'+data.title+' </a></dt></dl>'
						+ '<p class="sudokuTime">['+releaseDatetime+']</p><p class="clearfix"></p>'
						+ '<p class="sudokuSummary clearfix"><span>[摘要]</span><a href="javascript:loadTopNews('+data.innerid+')">'+summary+'</a></p>'
						/*+ '<p class="sudokuBtn"><button type="button" class="btn btn-red btn-sm"><i class="fa fa-share-square-o"></i>建稿</button>&nbsp;'
						+ '<button type="button" class="btn btn-red btn-sm"><i class="fa fa-star-o"></i>收藏</button></p>'*/
						+ '</div><div class="sudokuShowMore"><p class="clearfix m-bottom">'
						+ '<a>发稿来源：'+sourceReport+'&nbsp;&nbsp;</a>'
						+ '<a>爬取来源：'+data.sourceCrawlLevelTwo+'</a>'
						+ '<a href="javascript:void(0)" >'
						+ '<i class="fa fa-bars" tabindex="0" data-toggle="popover" data-placement="top" data-content="'+more+'"></i></a></p></div></div>';
        	$('td:eq(0)', row).html(content);
        	$('.linkLastNewsDataTable').removeAttr('style');
        },
        columns: [// 显示的列
            { data: 'innerid', "bSortable": false},
        ],
      	"aaSorting": [[0, ""]],
	});
//    $('.recentlyOneDay').click();
    
    $('.dataConBoxTable').on('draw.dt',function() {
    	$('.paginate_button').click(function(){
    		scrollOffset($(".dataConBox").offset());
    	});
        footerPutBottom();
        /*表格中的标题右击*/
        titleRclick();
        $("[data-toggle='popover']").popover({
    		html:true,
    		trigger:'hover',
    	});
    });
    $('.dataConThumbnailTable').on('draw.dt',function() {
    	/*缩略图详情省略*/
    	$(this).find('.mediaConSummary').each(function(){
    		if($(this).height()>=63){
    		    $(this).css({
    		        'height':63,
    		    });
    		    $(this).dotdotdot({
    		        wrap: 'letter'
    		     });
    		 }
    	});
    	$('.paginate_button').click(function(){
    		scrollOffset($(".dataConThumbnailTable").offset());
    	});
    	if($('body').width()<768){
    		$('.dataTables_scrollBody').css({
        		'height':'auto'
        	});
    	}
    	
    	$('.dataConThumbnailTable').judgeImgLoadError(ctx+'/frontEnd/image/home/defaultImg.png');

        footerPutBottom();
    });
    $('.dataConSudokuTable').on('draw.dt',function() {
        $(this).find('tbody').find('tr').addClass('col-md-3 p-right p-left');
        $("[data-toggle='tooltip']").tooltip();
        $("[data-toggle='popover']").popover({
    		html:true,
    		trigger:'hover',
    	});
        $('.paginate_button').click(function(){
    		scrollOffset($(".dataConSudokuTable").offset());
    	});
        var tableWidth = $('.dataConSudokuTable').width()/4-45;
		$('.dataConSudokuTable').find('dl.dl-horizontal dt.captionTitle').css('width',tableWidth);
        $(this).find($('.sudokuSummary')).each(function(){
        	if($(this).height()>110){
    			$(this).css({
    				'height':'110px'
    			});
    			$(this).each(function(){
    				$(this).dotdotdot({
    					wrap: 'letter'
    				});
    			});
    		}else{
                if($('body').width()>992){
                   $(this).css({
                        'height':'110px'
                    }); 
               }else{
                    $(this).css({
                        'height':'auto'
                    });
               }
    			
    		}
        });
        $('.dataConSudokuTable').judgeImgLoadError(ctx+'/frontEnd/image/home/defaultImg.png');
        footerPutBottom();
    });
//	function retrieveData(sSource, aoData, fnCallback) {
//	    $.ajax({
//	        url : sSource,//这个就是请求地址对应sAjaxSource
//	        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
//	        type : 'get',
//	        dataType : 'json',
//	        async : true,
//	        success : function(data) {
//		       fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
//	        },
//	        error : function(msg) {
//	        }
//	    });
//	}

	$("[data-toggle='tooltip']").tooltip();
	$("[data-toggle='popover']").popover({
		html:true,
		trigger:'hover',
		content:'<div class="sudokuShowCon"><ul class="list-group m-bottom" style="width:256px"><li class="list-group-item">浏览量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">建稿量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">采用量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">相似新闻<a href="javascript:void" class="pull-right ">[2]</a></li></ul></div>'
	});
	
	$('.dataSortWays').each(function(){
		$(this).find('a').css({
			'fontWeight':'normal',
		})
		$(this).click(function(){
			$('.dataSortWays').removeClass('active');
			$(this).addClass('active');
			$(this).find('a').css({
				'fontWeight':'normal',
			})
		});
	});
	
	$('.customAddInput').limit_input_length();
	
//	$('#screenSelected').stickUp();
	/*左侧侧边栏-滚动固定*/
	$("#main-content .siderLeftBox").stick_in_parent();
	/*右侧边悬浮框*/
    showSider();
    changeShowData();
    /*自定义时间段*/
    timeCustom();
    /*自定义时间实现*/
    datatimePicker();
    /*侧边栏折叠*/
    siderPucker();
    
    /*相似合并显示颜色*/
    screenTableClick();
    /*搜索处的高级筛选*/
    advancedFilter();
//    linkLatestNewsTable();
    /*每60秒刷新一次*/
    refreshButton();
    getNewsAggs();
    sourceData();
    /*获取二级分类*/
    getClassifiLevelTwo();
    defaultChoose();//默认选项
    
});

/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}
/*右侧边悬浮框*/
function showSider(){
	$('#sider').find('.siderBtn').click(function(){
		if ($(this).hasClass('show')) {
			var siderConWidth = -($(this).next().width() + 14);
			$(this).parents('#sider').animate({right:siderConWidth});
			$(this).removeClass('show');
		}else{
			$(this).parents('#sider').animate({right:0});
			$(this).addClass('show');
		}
	});
}
function judgeImgLoad(imgSrc,$this){
	var imgLoad=new Image();
	imgLoad.src=imgSrc;
	imgLoad.onload=function(){
		if($this.height()<120 && $this.width()<204){
			$this.css({
				'width':'100%',
				'max-height':'118px'
			});
			return;
		}else if($this.height()<120 && $this.width()>=204){
			$this.css({
				'width':'100%',
				'max-height':'118px'
			})
			return;
		}else if($this.width()<204 && $this.height()>=120){
			$this.css({
				'height':'100%'
			})
			return;
		}else {
			$this.css({
				'max-width':'195px',
				'height':'auto',
				'max-height':'118px'
			});
			return;
		}
	}
}
/*数据展示形式切换*/
function changeShowData(){
	$('#dataConShow').find('table.screenTable').find('td.dataConShowWays').each(function(index){
		$(this).click(function(){
			if(index == 1){
				$('#dataConShow').find('.dataConThumbnail').removeClass('hide');
				$('#dataConShow').find('.dataConSudoku').addClass('hide');
				$('#dataConShow').find('.dataConBox').addClass('hide');
				$('td.dataConShowWays').removeClass('active');
				$(this).addClass('active');
        $('.showBranches').each(function(index, el) {
          $(this).css({
            'cursor':'not-allowed',

          });
          $(this).find('a').css({
            'color':'#ccc',
            'cursor':'not-allowed',
          });
          $(this).unbind('click');
          if($('body').width()<768){
      		$('.dataTables_scrollBody').css({
          		'height':'auto'
          	});
      	}
          /*$('.dataConThumbnailTable').find('img').each(function(){
	          	judgeImgLoad($(this).attr('src'),$(this));
	      	});*/
        });
        /*缩略图详情省略*/
        $('.dataConThumbnailTable').find('.mediaConSummary').each(function(){
    		if($(this).height()>=63){
    		    $(this).css({
    		        'height':63,
    		    });
    		    $(this).dotdotdot({
    		        wrap: 'letter'
    		     });
    		 }
    	});
        footerPutBottom();
			}else if(index==2){
				$('#dataConShow').find('.dataConSudoku').removeClass('hide');
				$('#dataConShow').find('.dataConBox').addClass('hide');
				$('#dataConShow').find('.dataConThumbnail').addClass('hide');
				$('td.dataConShowWays').removeClass('active');
				$(this).addClass('active');
				var tableWidth = $('.dataConSudokuTable').width()/4-45;
				$('.dataConSudokuTable').find('dl.dl-horizontal dt.captionTitle').css('width',tableWidth);
				$('.sudokuSummary').dotdotdot({
					wrap: 'letter'
				});
        $('.showBranches').each(function(index, el) {
          $(this).css({
            'cursor':'not-allowed',
          });
          $(this).find('a').css({
            'color':'#ccc',
            'cursor':'not-allowed',
          });
          $(this).unbind('click');
        });
        footerPutBottom();
			}else if(index==0){
				$('#dataConShow').find('.dataConBox').removeClass('hide');
				$('#dataConShow').find('.dataConThumbnail').addClass('hide');
				$('#dataConShow').find('.dataConSudoku').addClass('hide');
				
				$('td.dataConShowWays').removeClass('active');
				$(this).addClass('active');
        $('.showBranches').each(function(index, el) {
          $(this).removeAttr('style');
          $(this).find('a').removeAttr('style');
        });
        showBranchesTable();
        $('.showBranches').each(function(){
        	$(this).click(function(){
        		displayLength = $(this).text();
        		$('.showBranches').removeClass('active');
        		$(this).addClass('active');
        		table1.ajax.reload();
        		table1.page.len( displayLength ).draw()
        	});
        });
        footerPutBottom();
			}
		});
	});
}

/*自定义时间实现*/
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
    var $this = $("#select3 dd:last");
    var copyThisC = $this.clone();
    copyThisC.find('a').text('自定义时间');
        
      if ($("#selectC").length > 0) {
          $("#selectC a").html('自定义时间');
      } else {
          $(".select-result dl").append(copyThisC.attr("id", "selectC"));

          $("#selectC").on("click", function () {
            $(this).remove();
            $("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
            $('.timeCustomCon').slideUp();
          });
          $(".select-no").hide();
      }
		reloadNewsList();
	});
}
/*自定义时间段-隐藏*/
function timeCustom(){
  	$('.timeCustomCon').css('display','none');
  	$('.timeCustom').click(function(event) {
  		$('.timeCustomCon').slideDown('fast', function() {});
  	});
  	$('.timeCustom').parents('dd').siblings('dd').click(function(){
  		$('.timeCustomCon').slideUp('fast');
  	});
}

/*侧边栏折叠*/
function siderPucker(){
	$('.userSider').find('ul.nav>li.navItem').each(function(index){
		$(this).click(function(event) {

			$(this).addClass('active');
			$(this).siblings('li').removeClass('active');
			if(index == 0){
				$('#screenSource').find('li').removeClass('active');
			}
			$(this).siblings('li').each(function(index, el) {
				if($(this).find('i').length>0){
					$(this).children('ul.submenu').slideUp();
					$(this).find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(90deg)',
						'-moz-transform': 'rotate(90deg)',
						'-webkit-transform': 'rotate(90deg)',
						'transform': 'rotate(90deg)'
					});
					$(this).find('i').addClass('fold');
				}
			});

			if($(this).find('i').length>0){
				if($(this).find('i').hasClass('fold')){
					$(this).children('ul.submenu').slideDown().find('li').click(function(event) {
						$(this).addClass('active');
						$(this).siblings('li').removeClass('active');
						return false;
					});
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
					$(this).find('i').removeClass('fold');
				}else{
					$(this).children('ul.submenu').slideUp().find('li').click(function(event) {
						$(this).addClass('active');
						$(this).siblings('li').removeClass('active');
						return false;
					});
					$(this).find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(90deg)',
						'-moz-transform': 'rotate(90deg)',
						'-webkit-transform': 'rotate(90deg)',
						'transform': 'rotate(90deg)'
					});
					$(this).find('i').addClass('fold');
				}
			}
		});

		$('#screenSource').click();
	});
}

/*表格中的标题右击*/
function titleRclick(){
	$('.titleRightClick').each(function(index, el) {
		$(this).mousedown(function(e){
			if(e.which == 3){
				$('.titleRightClick>a').popover('hide');
			}
		});
	});
	var titleRclickData = [
	    [{
	        text: "收藏",
	        /*data: [[{
	            text: "收藏",
	            func: function() {
	                alert('你点击的是收藏按钮');
	            }
	        }, {
	            text: "收藏1",
	            func: function() {
	                alert('你点击的是收藏按钮');
	            }
	        }]]*/
	    }, {
	        text: "建稿",
	        func: function() {
	            console.log('你点击的是建稿按钮');
	        }
	    }],
	    /*[{
	        text: "打包下载",
	        func: function() {
	            alert('你点击的是打包下载');    
	        }
	    }]*/
	];
    $(".titleRightClick").each(function(index, el) {
    	$(this).smartMenu(titleRclickData);
    });
}

/*相似合并显示颜色*/
function screenTableClick(){
	$('.screenTableClick').each(function(index) {
		$(this).click(function(){
			if($(this).hasClass('activeOrange')){
				$(this).removeClass('activeOrange');
				$(this).css({
					'color':'#333'
				});
				
			}else{
				$(this).addClass('activeOrange');
			}
		});
	});
}

function showSimilar(){
	var showSimilar = $('#showSimilar').val();
	if(showSimilar=='true'){
		$('#showSimilar').val(false);
	}else{
		$('#showSimilar').val(true);
	}
	reloadNewsList();
}
function showClue(){
	var showClue = $('#showClue').val();
	if(showClue=='true'){
		$('#showClue').val(false);
	}else{
		$('#showClue').val(true);
	}
	reloadNewsList();
}
/*展示方式-点击高亮*/
function showBranchesTable(){
  $('.showBranches').each(function(){
    $(this).click(function(){
      $('.showBranches').removeClass('active');
      $(this).addClass('active');
    });
  });
}
/*搜索处的高级筛选*/
function advancedFilter(){
	var count = 0;
	$('.advancedFilter').click(function(){
		
		
		if(count == 0){
			$('.advancedFilterCon').slideUp();
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
			$('.advancedFilterCon').slideDown();
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


function linkLatestNewsTable(){
	$('.linkLastNewsDataTable').loadPage('latestNews1/latestNewsLink.html');
}

/**
 * 排序
 */
function sortWay(sort){
	$("#sortWay").val(sort);
	reloadNewsList();
}

/**
 * 重新加载新闻列表
 */

function reloadNewsList(){
//	console.log($('.select-result').find('dd').length);
	if($('.select-result').find('dd').length==1){
		$('.dataCountTableCon').addClass('hide');
	}else{
		$('.dataCountTableCon').removeClass('hide');
	}
	if($('input#searchWord').val()=='' || $('input#searchWord').val()==null){
		
	}else{
		var searchWord = $('input#searchWord').val();
		$('input#searchWord').val('')
		var searchWordContent = '<dd class="selected" id="selectD"><a href="javascript:void(0);">'+ searchWord +'</a></dd>';
		$('.select-result').find('.dl-horizontal').append(searchWordContent);
		$("#selectD a").on("click", function () {
			$(this).remove();
			//刷新列表
			reloadNewsList();
		});
	}
	table1.ajax.reload();
	table2.ajax.reload();
	table3.ajax.reload();
	
	getNewsAggs();
}

/**
 * 查询一级来源新闻数
 */
function getNewsAggs(){
	var param = new Array();
	 $.ajax({
	        url : ctx+'/latest/front/getNewsAggs',//这个就是请求地址对应sAjaxSource
	        data : getQueryParam(param),//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	if(data.result){
	        		var result = data.resultObj;
	        		$("#queryResultNum").text(result.total);
	        		if(null==result.新闻门户||''==result.新闻门户||undefined==result.新闻门户){
	        			$("#新闻门户").text(0);
	        		}else{
	        			$("#新闻门户").text(result.新闻门户);
	        		}
	        		if(null==result.官方媒体||''==result.官方媒体||undefined==result.官方媒体){
	        			$("#官方媒体").text(0);
	        		}else{
	        			$("#官方媒体").text(result.官方媒体);
	        		}
	        		if(null==result.行业网站||''==result.行业网站||undefined==result.行业网站){
	        			$("#行业网站").text(0);
	        		}else{
	        			$("#行业网站").text(result.行业网站);
	        		}
	        		if(null==result.社交网站||''==result.社交网站||undefined==result.社交网站){
	        			$("#社交网站").text(0);
	        		}else{
	        			$("#社交网站").text(result.社交网站);
	        		}
	        		if(null==result.政府组织||''==result.政府组织||undefined==result.政府组织){
	        			$("#政府组织").text(0);
	        		}else{
	        			$("#政府组织").text(result.政府组织);
	        		}
	        		if(null==result.国外媒体||''==result.国外媒体||undefined==result.国外媒体){
	        			$("#国外媒体").text(0);
	        		}else{
	        			$("#国外媒体").text(result.国外媒体);
	        		}
	        		if(null==result.新浪微博||''==result.新浪微博||undefined==result.新浪微博){
	        			$("#新浪微博").text(0);
	        		}else{
	        			$("#新浪微博").text(result.新浪微博);
	        		}
	        	}
	        },
	        error : function(msg) {
	        }
	    });
}

/**
 * 获取查询所需参数，
 * @param arrayObj
 * @returns
 */
function getQueryParam(arrayObj){
	var classifications = [];
		$('#selectF').find('a').each(function(index){
			classifications.push($(this).text().trim());
		});
	var regions = [];
		$('#selectA').find('a').each(function(index){
			regions.push($(this).text().trim());
		});
	var sources = [];
		$('#selectE').find('a').each(function(index){
			sources.push($(this).text().trim());
		});
	var sourcesTwo = [];
		$('#CheckCity').find('a').each(function(index){
			sourcesTwo.push($(this).text().trim());
		});
	var labels = [];
		$('#selectB').find('a').each(function(index){
			labels.push($(this).text().trim());
		});
	var time = $('#selectC').find('a').text().trim();
	var queryStr = [];
		$('#selectD').find('a').each(function(index){
			queryStr.push($(this).text().trim());
		});
	var sort = $("#sortWay").val().trim();
	if(null == sort || '' ==  sort || undefined == sort){
		sort="default";
	}
	if('default'==sort && $('#selectD').find('a').length == 0){
		sort = 'time';
	}
	var showSimilar = $("#showSimilar").val().trim();
	var showClue = $("#showClue").val().trim();
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
	arrayObj.push(
			{"name":"classifications","value":classifications},
			{"name":"regions","value":regions},
			{"name":"sourcesLevelOne","value":sources},
			{"name":"sourcesLevelTwo","value":sourcesTwo},
			{"name":"labels","value":labels},
			{"name":"time","value":time},
			{"name":"queryStr","value":queryStr},
			{"name":"sort","value":sort},
			{"name":"showSimilar","value":showSimilar},
			{"name":"showClue","value":showClue}
		);
	return arrayObj;
}

function loadTopNews(id){
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	var queryStr = [];
	$('#selectD').find('a').each(function(index){
		queryStr.push($(this).text().trim());
	});
	if(null != queryStr && queryStr.length>0){
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id+'?queryStr='+queryStr);
	}else{
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	}
	

}

function loadNewsDetail(id,querywordsList){
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id+'?querywordsList='+querywordsList);
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

/*每隔60秒刷险一次列表*/
function refreshButton(){
	var init;
	$('.refreshButton').click(function(){
		if($(this).hasClass('fa-spin')){
			$(this).removeClass('fa-spin');
			clearInterval(init);
		}else{
			$(this).addClass('fa-spin');
			init = setInterval('reloadNewsList()',60000);
		}
		
	});
}

jQuery(function($) {
  	$(document).ready( function() {
    	$('#screenSelected').stickUp();
  	});
});

//来源的数据传入
function sourceData(){
	$.ajax({
        url : ctx+"/latest/front/getCitySource",
        type : 'GET',
        dataType : 'json',
        success : function(data) {
        	$$.module.address.source.hotel = data.resultObj[0];
        	$$.module.address.source.hotel_hotData = eval('(' +data.resultObj[1]+')');
        },
        error : function() {
        }
	});
}
/*
 * 获取二级分类
 */
function getClassifiLevelTwo(){
	$.ajax({
        url : ctx+"/latest/front/getClassifiLevelTwo",
        type : 'get',
        dataType : 'json',
        async : false,
        success : function(data) {
	       if(data.result){
	    	   classificationArr = data.resultObj;
	       }
        },
        error : function(msg) {
        }
    });
}

//默认选项
function defaultChoose(){
	var clueId = $('#clueId').val();
    if('' == clueId || null == clueId || undefined == clueId){
    	$('.recentlyOneDay').click();
    }else{
    	$.ajax({
	        url : ctx+'/latest/front/clue/findClueById/'+clueId,
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	if(data.result){
	        		var clue = data.resultObj;
	        		if(null == clue){
	        			return;
	        		}
	        		$('.select-no').hide();
	        		var startDatetime = clue.startDatetime;
	        		var endDatetime = clue.endDatetime;
	        		if(null != startDatetime && null != endDatetime){
	        			var startTime = new Date(startDatetime);
	        			startTime = startTime.formatDate('yyyy-MM-dd');
	        			var endTime = new Date(endDatetime);
	        			endTime = endTime.formatDate('yyyy-MM-dd');
	        			$('.timeCustom').data('daterangepicker').setStartDate(startTime);
	        			$('.timeCustom').data('daterangepicker').setEndDate(endTime);
	        			$('.timeCustom').parent().addClass("selected");
	        			$('.timeCustomCon').html(startTime+' 至 '+endTime).show();
	        			$('.select-result .dl-horizontal').append('<dd class="selected" id="selectC"><a href="javascript:void(0);" class="timeCustom">自定义时间</a></dd>');
	        			$("#selectC").on("click", function () {
	    					$(this).remove();
	    					reloadNewsList();
	    					$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
	    					 $(".timeSelected ").val("全部");
	    					 $('.timeCustomCon').slideUp();
	    					$('#TimeStart').val('');
	    					$('#TimeEnd').val('');
	    				});
	        		}
	        		var keywords = clue.keywords;
	        		if(null != keywords && '' != keywords && undefined != keywords ){
	        			var keywordsHtml = '';
	        			var keywordsList = keywords.split('|');
	        			for (var i = 0; i < keywordsList.length; i++) {
							var keywords = keywordsList[i];
							keywordsHtml += '<a href="javascript:void(0);">'+keywords+'</a>';
						}
	        			$('.select-result .dl-horizontal').append('<dd class="selected" id="selectD">'+keywordsHtml+'</dd>')
	        			$("#selectD a").on("click", function () {
	        				$(this).remove();
	        				//刷新列表
	        				reloadNewsList();
	        				$('.customAddBtn').siblings('input').val('');
	        			});
	        		}
	        		
	        		//来源
	        		var sources = clue.source;
	        		if(null != sources && '' != sources && undefined != sources ){
	        			var sourceList = sources.split(',');
	        			for (var i = 0; i < sourceList.length; i++) {
							var source = sourceList[i];
							$("[dataname='"+source+"']").click();
						}
	        		}
	        		//分类
	        		var classifis = clue.classification;
	        		if(null != classifis && '' != classifis && undefined != classifis ){
	        			var classList = classifis.split(',');
	        			for (var i = 0; i < classList.length; i++) {
							var classifi = classList[i];
							if($("[dataname='"+classifi+"']").length==0){
								$("[dataname='经济']").click();
							}
							$("[dataname='"+classifi+"']").click();
//							console.log(classifi+":"+$("[dataname='"+classifi+"']").length);
						}
	        		}
	        	}
	        	
	        	//刷新列表
				reloadNewsList();
	        },
	        error : function(msg) {
	        }
	    });
    }
}

