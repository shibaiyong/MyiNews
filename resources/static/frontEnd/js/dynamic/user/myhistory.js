var collectTable,
	historyTable,
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function(){
	
	//	导航内容实现
	$().showHeader();
	$('.myHistory').addClass('active');
	// 处于当前页面时移除我的历史的页面交互效果且不可点击
	$('.myHistory').find("a").attr("href","#").find("i").attr("data-toggle","");

	footerPutBottom();

	/*我的收藏*/
	var scrollCon = '';
	if ($('body').width() < 768) {
		scrollCon = true;
		$('.keepTable>table').css({
			'width': '600px'
		});
	}
	
	historyTableCon();
});

//我的历史
function historyTableCon(){
//  我的历史
    historyTable = $('.historyTable').DataTable({
	       serverSide: true,//标示从服务器获取数据
	       sAjaxSource :ctx+'/user/front/history/page',//服务器请求
	       fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
	       fnServerParams : function ( aoData ) {
	    	   
	       },
//	       服务器传过来的值
	       "rowCallback" : function(row, data, index) {
	    	   
	    	   //摘要,长度超过150截取
	    	   var summary = '';
	    	   var isearchVal = $('.customAddInput').val();
		       if(null != data.cusSummary){
		    	   if(data.cusSummary.length>150){
		    		   summary = data.cusSummary.substr(0,150)+'...';
			       }else{
			           summary = data.cusSummary;
			       }
		    		   
		    	   var titleCon = '<a href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'/'+data.releaseDatetime+'" target="_blank" class="beyondEllipsis" tabindex="0" data-id="'+data.webpageCode+'"  data-toggle="popover" data-trigger="hover" data-placement="bottom" data-content="'+summary+'">'+data.title+'</a>'
	    	   }else{
		       		summary = '暂无摘要';
		       		var titleCon = '<a href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'/'+data.releaseDatetime+'" target="_blank" class="beyondEllipsis"  data-id="'+data.webpageCode+'">'+data.title+'</a>'
		       	}
				$('td:eq(2)', row).html(titleCon).addClass('titleRightClick');

				// 采集来源样式处理
				if (visualLength(data.sourceReport) > 140) {
					$('td:eq(3)', row).addClass("sourceLeft");
				} else {
					$('td:eq(3)', row).addClass("sourceCenter");
				}

				// 发稿来源样式处理
				var displayName = '';
				if (data.sourceCrawlDetail && data.sourceCrawlDetail.website) {
					displayName = data.sourceCrawlDetail.website.displayName;
				}
				if (visualLength(displayName) > 140) {
					$('td:eq(4)', row).addClass("sourceLeft");
				} else {
					$('td:eq(4)', row).addClass("sourceCenter");
				}
				
				//操作
				var operationCon = '<span><i class="fa fa-heart-o fa-lg" data-toggle="tooltip" data-placement="top" title="收藏"></i></span>'
							+'<span><i class="fa fa-file-text-o fa-lg" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
				$('td:eq(5)', row).html(operationCon).addClass('inewsOperation').attr('data-id', data.webpageCode);
				$('td:eq(5)', row).attr('data-time', data.releaseDatetime)
			},
	       
//	       服务器传过来的值
		   columns: [//显示的列
				// 浏览时间    
	            {data: 'opDatetime', "bSortable": false,
	        	   render:function(data, type, row){
	             		if(null != data && "" != data){
	             			var opDatetime = new Date(data);	             			
	             			//获取当前年
	             			var nowDate = new Date();
	             			var nowyear=nowDate.getFullYear();
	             			var year = opDatetime.formatDate('yyyy');
	             			var time = '';
//	             			判断发布时间是否为当前年份
	             			if(year == nowyear){
	             				time = opDatetime.formatDate('MM-dd hh:mm');
	             			}else{
	             				time = opDatetime.formatDate('yyyy-MM-dd');
	             			}	             			
	 						return time;
	             		}else{
	             			return '-';
	             		}
	               }
			   },
			   { // 发布时间
			   	data: 'releaseDatetime',
			   	"bSortable": false,
			   	render: function (data, type, row) {
			   		if (null != data && "" != data) {
			   			var releaseDatetime = new Date(data);
			   			//获取当前年
			   			var nowDate = new Date();
			   			var nowyear = nowDate.getFullYear();
			   			var year = releaseDatetime.formatDate('yyyy');
			   			var time = '';
			   			//	             			判断发布时间是否为当前年份
			   			if (year == nowyear) {
			   				time = releaseDatetime.formatDate('MM-dd hh:mm');
			   			} else {
			   				time = releaseDatetime.formatDate('yyyy-MM-dd');
			   			}
			   			return time;
			   		} else {
			   			return '-';
			   		}
			   	}
			   },
				// 标题    
	           { data: 'title', "bSortable": false},
	        	// 采集来源    
	           { data: 'sourceCrawl', "bSortable": false,
	        	   render:function(data,type,row){
	        		   if(data != null && data != ''){
						   if (data.length > 6) {
						   	$('td:eq(3)', row).addClass("sourceLeft");
						   } else {
						   	$('td:eq(3)', row).addClass("sourceCenter");
						   }
	        			   return data
	        		   }else{
	        			   return '-'
	        		   }
	        	   }
			   },
			   { // 发稿来源
			   	data: 'sourceReport',
			   	"bSortable": false,
			   	render: function (data, type, row) {
			   		if (data != null && data != '') {
			   			return data
			   		} else {
			   			return '-'
			   		}
			   	}
			   },
			   {
				data: 'newsId',
				"bSortable": false,
				render: function (data, type, row) {
					return ''
				}
			   }
	       ],
	       
	       "aaSorting": [[0, ""]],
	   });
    
    $('.historyTable').on('draw.dt',function() {
    	/*鼠标划入悬停提示*/
		$("[data-toggle='tooltip']").tooltip();
		$("[data-toggle='popover']").popover({
	    	html:true,
	    	trigger:'hover',
	    });
		
//		点击翻页页面自动移动到上方
		$('.paginate_button').each(function(){
			$(this).click(function(){
				$(this).scrollOffset({
					'scrollPos':115
				});
			})
		});
		// 收藏和建稿
		$('.inewsOperation').each(function (index) {
			var webpageCode = $(this).attr("data-id");
			var releaseDatetime = $(this).attr('data-time');

			$(this).find('span').eq(0).click(function (){
				// 如果已收藏则再次点击时取消收藏
				if ($(this).hasClass("judgeKeeped")) {
					$(this).removeClass("judgeKeeped");
					$(this).find("i").removeClass("fa-heart").addClass("fa-heart-o");
				}else{
					// 先获得收藏的对象，然后将其添加到body上
					var $collect = $(this).clone();
					$(this).find("i").removeClass("fa-heart-o").addClass("fa-heart");
					$(this).addClass("judgeKeeped");

					// 动画终点位置
					var destination = {
						top: $(".collection").offset().top,
						left: $(".collection").offset().left,
						height: $(".collection").height()
					};
					// 动画开始位置
					var nowStation = {
						top: $(this).offset().top,
						left: $(this).offset().left
					};

					$collect.find("i").removeClass("fa-heart-o").addClass("fa-heart");
					$collect.addClass("collectAnimate").css({
						'top': nowStation.top + 'px',
						'left': nowStation.left + 'px'
					});
					$('body').append($collect);
					// 开始动画
					$collect.animate({
						'top': destination.top + parseInt(destination.height / 2) + 'px',
						'left': destination.left + 'px',
						'opacity': '0.2'
					}, 1500, function () {
						$collect.remove();
					});
				}				
				// 统一执行收藏操作
				judgeKeep({
					'dataUrl': ctx + '/latest/front/collectingNews',
					'dataParam': {
						'webpageCode': webpageCode,
						'type': 2
					}
				});

			});
			// 建稿
			$(this).find('span').eq(1).releaseBuild({
				'webpageCode': webpageCode,
				'releaseDatetime': releaseDatetime,
				'buildingCon': function (_$this) {
					_$this.find('i').addClass('releaseBuild');
				},
				'buildedCon': function (_$this) {
					_$this.find('i').removeClass('releaseBuild');
					threadAjaxData1.ajax.reload();
				}
			});
		});
    });
}

function visualLength(params) {
	$("#visualLength").text(params);	
	return $("#visualLength").width();
}
// 收藏操作
function judgeKeep(params) {
	$.ajax({
		url: params.dataUrl || '', //这个就是请求地址对应sAjaxSource
		data: params.dataParam,
		type: 'get',
		dataType: 'json',
		async: true,
		success: function (data) {
			//console.log(data);
			if (data.result && data.resultObj) {
				$().toastmessage('showToast', {
					inEffectDuration: 300,
					stayTime: 2000,
					text: '操作成功！',
					sticky: false,
					position: 'middle-center',
					type: 'success',
				});
			} else {
				$().toastmessage('showToast', {
					text: '数据异常，收藏失败！',
					sticky: false,
					position: 'middle-center',
					type: 'error',
				});
				//  收藏失败后移除收藏效果
				var $span = $(".inewsOperation[data-id=" + params.dataParam.webpageCode + "]").find("span").eq(0);
				$span.removeClass("judgeKeeped");
				$span.find("i").removeClass("fa-heart").addClass("fa-heart-o");				
			}
		},
		error: function(err) {
			$().toastmessage('showToast', {
				text: '数据异常，收藏失败！',
				sticky: false,
				position: 'middle-center',
				type: 'error',
			});
			//  收藏失败后移除收藏效果
			var $span = $(".inewsOperation[data-id=" + params.dataParam.webpageCode + "]").find("span").eq(0);
			$span.removeClass("judgeKeeped");
			$span.find("i").removeClass("fa-heart").addClass("fa-heart-o");
		}
	})
}