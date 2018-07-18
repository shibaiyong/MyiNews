$(function(){

	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',8);
    $('#footer').loadPage('../common/footer.html');
    $('.linkLastNewsDataTable').removeAttr('style');
    $('.linkLastNewsDataTable').removeAttr('style');
    $('.dataConBoxTable').DataTable({
    		'iDisplayLength' : 8,
    		'sPaginationType': "bootstrap",
    		'bLengthChange': false,
    		"lengthMenu": [20, 40, 60],
		  	"aoColumns": [ 
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
	
	$('.dataConThumbnailTable').DataTable({
    		iDisplayLength : 20,
    		'sPaginationType': "bootstrap",
		  	"aoColumns": [ 
		  		{ "bSortable": false },
	        ],
	      	"aaSorting": [[0, ""]],
	});

	$('.dataConSudokuTable').DataTable({
    		iDisplayLength : 20,
    		'sPaginationType': "bootstrap",
		  	"aoColumns": [ 
		  		{ "bSortable": false },
	        ],
	      	"aaSorting": [[0, ""]],
	});

	$("[data-toggle='tooltip']").tooltip();

	$(".titleRightClick>a").popover({
		trigger:'hover', //触发方式
        //template: '', //你自定义的模板
       // title:"标题",设置 弹出框 的标题
        html: true, // 为true的话，data-content里就能放html代码了
        content:"",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
        placement:'auto left',
	});
	
	$("[data-toggle='popover']").popover({
		html:true,
		trigger:'hover',
		content:'<div class="sudokuShowConPopover"><ul class="list-group m-bottom" style="width:256px"><li class="list-group-item">浏览量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">建稿量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">采用量<a href="javascript:void" class="pull-right ">[2345]</a></li><li class="list-group-item">相似新闻<a href="javascript:void" class="pull-right ">[2]</a></li></ul></div>'
	});
	$("[data-toggle='popover']").popover('show')

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
    /*表格中的标题右击*/
    titleRclick();
    /*相似合并显示颜色*/
    screenTableClick();
    /*搜索处的高级筛选*/
    advancedFilter();
//    linkLatestNewsTable();
//    /*展示方式-点击高亮*/
	showBranchesTable();
});


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

/*数据展示形式切换*/
function changeShowData(){
	$('#dataConShow').find('table.screenTable').find('td.dataConShowWays').each(function(index){
		$(this).click(function(){
			if(index == 1){
				$('#dataConShow').find('.dataConThumbnail').removeClass('hide');
				$('#dataConShow').find('.dataConSudoku').addClass('hide');
				$('#dataConShow').find('.dataConBox').addClass('hide');
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
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
				mediaConSummarydotdotdot();
			}else if(index==2){
				$('#dataConShow').find('.dataConSudoku').removeClass('hide');
				$('#dataConShow').find('.dataConBox').addClass('hide');
				$('#dataConShow').find('.dataConThumbnail').addClass('hide');
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
				var tableWidth = $('.dataConSudokuTable').width()/4-45;
				$('.dataConSudokuTable').find('dl.dl-horizontal dt.captionTitle').css('width',tableWidth);
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

			}else if(index==0){
				$('#dataConShow').find('.dataConBox').removeClass('hide');
				$('#dataConShow').find('.dataConThumbnail').addClass('hide');
				$('#dataConShow').find('.dataConSudoku').addClass('hide');
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
				$('.showBranches').each(function(index, el) {
					$(this).removeAttr('style');
					$(this).find('a').removeAttr('style');
				});
				showBranchesTable();
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
						/*$(this).siblings('li').removeClass('active');*/
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
						/*$(this).siblings('li').removeClass('active');*/
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
	        data: [[{
	            text: "收藏",
	            func: function() {
	                alert('你点击的是收藏按钮');
	            }
	        }, {
	            text: "收藏1",
	            func: function() {
	                alert('你点击的是收藏按钮');
	            }
	        }]]
	    }, {
	        text: "推送",
	        func: function() {
	            alert('你点击的是推送按钮');
	        }
	    }],
	    [{
	        text: "打包下载",
	        func: function() {
	            alert('你点击的是打包下载');    
	        }
	    }]
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


function linkLatestNewsTable(){
	$('.linkLastNewsDataTable').loadPage('latestNews1/latestNewsLink.html');
}

/*缩略图详情省略*/
function mediaConSummarydotdotdot(){
	$('.mediaConSummary').each(function(){
		if($('.mediaConSummary').height()>=63){
			$(this).css({
				'height':63,
			});
			$(this).dotdotdot({
				wrap: 'letter'
			});
		}
	});
}

jQuery(function($) {
  	$(document).ready( function() {
    	$('#screenSelected').stickUp();
  	});
});