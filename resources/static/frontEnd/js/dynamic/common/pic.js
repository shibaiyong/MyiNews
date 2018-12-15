$(function(){
	/*鼠标划入悬停提示*/
	$('[data-toggle="tooltip"]').tooltip();
	
//	$('.imgConBoxTable').DataTable({
//		'iDisplayLength' : 30,
//		'sPaginationType': "bootstrap",
//		'bLengthChange': false,
//	  	"aoColumns": [ 
//        	{ "bSortable": false },
//        ],
//      	"aaSorting": [[0, ""]],
//	});
	
});


(function($){
	"use strict";
	
	/**
	 * Description：图片库、我的定制-图片、为你推荐-图片中图片的展示方式
	 */
	$.fn.getImgAjaxData = function(options){
		
		var defaults = {
				requestUrl:'',  //请求路径
				getPassValue:'', //需要入的值
		};
		var options = $.extend(defaults,options);
		
		var tableImg = $('.imgConBoxTable').DataTable({
		       serverSide: true,//标示从服务器获取数据
		       sAjaxSource :options.requestUrl,//服务器请求
		       fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
		       iDisplayLength : 16,//每页显示条数
		       fnServerParams : function ( aoData ) {
//		       	给服务器传的值
		       		aoData = options.getPassValue(aoData);
		       },
		       
//		       服务器传过来的值
		       "rowCallback" : function(row, data, index) {
//		    	   数据库中返回的值进行处理，后台字段定好以后进行修改
		    	   
		    	   var isearchVal = $('.customAddInput').val();
		    	   
//		    	   图片
		    	   var picPath;
		    	   if(data.picPath != '' && data.picPath != null){
		    		   $('.imgConBoxTable').getImgUrl({
		    			   'imageUrl':data.picPath,
		    			   'code':data.webpageCode
		    		   });
		    	   }
                   var releaseDatetime = '';
                   if (data.releaseDatetime != null && data.releaseDatetime != 'null' && data.releaseDatetime != '') {
                       releaseDatetime = '/' + data.releaseDatetime;
                   }
		    	   
		    	   if(data.picPath == null){
		    		   var imgCon = '<div class="site-piclist_pic"><a href="'+ctx+'/latest/front/image/detail/'+data.webpageCode+ releaseDatetime +'" data-webpageCode="'+data.webpageCode+'" target="_blank"><img class="defaultImgOrange"  src="'+context+'/frontEnd/image/home/defaultImg.png"/></a></div>';
		    	   }else{
		    		   var imgCon = '<div class="site-piclist_pic"><a href="'+ctx+'/latest/front/image/detail/'+data.webpageCode+ releaseDatetime +'" data-webpageCode="'+data.webpageCode+'" target="_blank"><img class="defaultImg"  src="'+context+'/frontEnd/image/home/default-white.png"/></a></div>';
		    	   }
		    	   
//		    	   标题、来源
		    	   var browseCount,sourceCrawl;
		    	   if(data.browseCount != '' && data.browseCount != null){
		    		   browseCount = data.browseCount;
		    	   }else{
		    		   browseCount = '-';
		    	   }
		    	   
		    	   if(data.sourceCrawl != '' && data.sourceCrawl != null){
		    		   sourceCrawl = data.sourceCrawl;
		    	   }else{
		    		   sourceCrawl = '-';
		    	   }
		    	   
		    	   if(isearchVal != '' && isearchVal != undefined){
					   var linkUrl = ctx+'/latest/front/image/detail/'+data.webpageCode+ releaseDatetime +'?queryStr='+isearchVal;
				   }else{
					   var linkUrl = ctx+'/latest/front/image/detail/'+data.webpageCode+ releaseDatetime ;
				   }
		    	   
		    	   /*var title = '<div class="site-piclist_info"><p class="titleRightClick"><a href="'+linkUrl+'" target="_blank" data-id="'+data.webpageCode+'">'+data.title+'</a></p><p class="site-piclist-sources"><i class="fa fa-eye" data-toggle="tooltip" data-placement="top" title="浏览量"></i><span class="browseNum'+index+'">'+browseCount+'</span> | <span >'+sourceCrawl+'</span><span class="jiangao pull-right" data-id="'+data.webpageCode+'"><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span><span class="collect" data-id="'+data.webpageCode+'"><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span></p></div>';*/
		    	   var title = '<div class="site-piclist_info"><p class="titleRightClick"><a href="'+linkUrl+'" target="_blank" data-id="'+data.webpageCode+'">'+data.title+'</a></p><p class="site-piclist-sources"><i class="fa fa-eye" data-toggle="tooltip" data-placement="top" title="浏览量"></i><span class="browseNum'+index+'">'+browseCount+'</span> | <span class="sourceCrawl">'+sourceCrawl+'</span><span class="collect" data-id="'+data.webpageCode+'"><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span></p></div>';
//		    	时间
		    	   if(data.releaseDatetime != '' && data.releaseDatetime != null){
		    		   var releaseDatetime = new Date(data.releaseDatetime);
		    		   
		    			//获取当前年
            			var nowDate = new Date();
            			var nowyear=nowDate.getFullYear();
            			var year = releaseDatetime.formatDate('yyyy');
            			var time1 = '';
//            			判断发布时间是否为当前年份
            			if(year == nowyear){
            				time1 = releaseDatetime.formatDate('MM-dd hh:mm');
            			}else{
            				time1 = releaseDatetime.formatDate('yyyy-MM-dd');
            			}
		    		   
		        	   var time = '<div class="site-piclist_time"><p>'+time1+'</p></div>' ;
		    	   }else{
		    		   var time = '<div class="site-piclist_time"><p>-</p></div>' ;
		    	   }
		    	   
//		       选择框
		    	   var checkCon = '<div class="site-piclist_check"><span data-webpagecode="'+data.webpageCode+'"  class="check-child"><i class="fa fa-check"></i></span></div>';
		    	   
		    	   var tableCon = imgCon + title + time + checkCon;
		    	   
		    	   $('td:eq(0)', row).html(tableCon);
		    	   
		    	   $(row).attr('class','col-md-3 p-right p-left');
		       },
		       
//		       服务器传过来的值
		       columns: [//显示的列
		           {data: 'webpageCode', "bSortable": false},
		       ],
		       
		       "aaSorting": [[0, "desc"]],
		   });
		
		$('.imgConBoxTable').on('draw.dt',function() {
//			点击翻页页面自动移动到上方
			$('.paginate_button').each(function(){
				$(this).click(function(){
					$(this).scrollOffset({
						'scrollPos':115
					});
				})
			})
		})
		
		return tableImg;
	};
	
	/**
	 * 请求图片服务器
	 */
	$.fn.getImgUrl = function(options){
		var defaults = {
				imageUrl:'',  //请求路径
				code:'',
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		var newImgUrl;
		$.ajax({
	        url : inewsImageManager+options.imageUrl+'&width=640&height=360&fill=0xeeeeee',//这个就是请求地址对应sAjaxSource
	        data:{'code':options.code},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result == 'success'){
	        		newImgUrl = data.value;
	        		var code = data.code;
	        		$this.find('[data-webpageCode="'+code+'"]').find('img').attr('src','').attr('src',data.value).removeClass('defaultImg');
	        		
	        	}else{
	        		$this.find('[data-webpageCode="'+data.code+'"]').find('img').attr('src','').attr('src',context+'/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange');
	        	}
	        },
	        error : function(msg) {
	        }
		});
		
		return newImgUrl;
	}
	
})(jQuery);
