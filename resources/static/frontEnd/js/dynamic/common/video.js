$(function(){
	
	
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

(function(){
	
	"use strict";
	
	/**
	 * Description：视频库
	 */
	$.fn.getVideoAjaxData = function(options){
		
		var defaults = {
				requestUrl:'',  //请求路径
				getPassValue:'', //需要入的值
		};
		var options = $.extend(defaults,options);
		
		var tableImg = $('.videoConBoxTable').DataTable({
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
		    	   
		    	   var isearchVal = $('.customAddInput').val();
		    	   
//		    	   第一张图片展示
		    	   var picPath;
		    	   if(data.videoPicPath != '' && data.videoPicPath != null){
		    		   $('.videoConBoxTable').getImgUrl({
		    			   'imageUrl':data.videoPicPath,
		    			   'code':data.webpageCode
		    		   });
		    	   }
		    	   
		    	   var linkUrl;
		    	   if(data.statEntity.mediaStatus != null && data.statEntity.mediaStatus != ''){
					   var mediaSta = data.statEntity.mediaStatus;
					   var releaseDatetime = '';
		    		   for(var i = 0;mediaSta.length>i;i++){
							if (data.releaseDatetime != null && data.releaseDatetime != 'null' && data.releaseDatetime != '') {
								releaseDatetime = '/' + data.releaseDatetime;
							}
		    			   if(mediaSta[i] == 6){
		    				   if(data.webpageUrl != null && data.webpageUrl != ''){
		    		    		   linkUrl = data.webpageUrl
		    		    	   }else{
		    		    		   
		    		    	   }
		    			   }else if(mediaSta[i] == 5){
		    				   if(isearchVal != '' && isearchVal != undefined){
		    					   linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode + releaseDatetime + '?queryStr=' + isearchVal;
		    				   }else{
		    					   linkUrl = ctx + '/latest/front/news/detail/' + data.webpageCode + releaseDatetime;
		    				   }
//		    				   linkUrl = ctx+'/latest/front/news/detail/'+data.webpageCode;
		    			   }
		    		   }
		    	   }
		    	   if(data.videoPicPath != '' && data.videoPicPath != null){
		    		   var picBox = '<div class="site-piclist_pic"><div class="site-piclist_pic_zhezhao"><a href="'+linkUrl+'" target="_blank"><img src="'+context+'/frontEnd/image/picGroupDetail/video.png"/></a></div><a href="'+linkUrl+'" target="_blank"><img data-webpagecode="'+data.webpageCode+'" class="defaultImg" src="'+context+'/frontEnd/image/home/default-white.png"/></a></div>';
		    	   }else{
		    		   var picBox = '<div class="site-piclist_pic"><div class="site-piclist_pic_zhezhao"><a href="'+linkUrl+'" target="_blank"><img src="'+context+'/frontEnd/image/picGroupDetail/video.png"/></a></div><a href="'+linkUrl+'" target="_blank"><img data-webpagecode="'+data.webpageCode+'" class="defaultImgOrange" src="'+context+'/frontEnd/image/home/defaultImg.png"/></a></div>';
		    	   }
		    	   
		    	   
//		    	   标题、来源
		    	   var sourceCrawl;
		    	   if(data.sourceCrawl != null && data.sourceCrawl !='' ){
		    		   sourceCrawl = data.sourceCrawl
		    		   
		    	   }else{
		    		   sourceCrawl = '-'
		    	   }
		    	   /*var title = '<div class="site-piclist_info"><p class="titleRightClick"><a href="'+linkUrl+'" data-webpageCode="'+data.webpageCode+'" target="_blank">'+data.title+'</a></p><p class="site-piclist-sources"><i class="fa fa-eye" data-toggle="tooltip" data-placement="top" title="浏览量"></i><span class="browseNum'+index+'">-</span> | <span>'+sourceCrawl+'</span><span class="jiangao pull-right" data-id="'+data.webpageCode+'"><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i></span><span class="collect pull-right" data-id="'+data.webpageCode+'"><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="收藏"></i></span></p></div>';*/
		    	   var title = '<div class="site-piclist_info"><p class="titleRightClick"><a href="'+linkUrl+'" data-webpageCode="'+data.webpageCode+'" target="_blank">'+data.title+'</a></p><p class="site-piclist-sources"><i class="fa fa-eye" data-toggle="tooltip" data-placement="top" title="浏览量"></i><span class="browseNum'+index+'">-</span> | <span>'+sourceCrawl+'</span><span class="collect pull-right" data-id="'+data.webpageCode+'"><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="收藏"></i></span></p></div>';
//		    	   时间
		    	   if(data.releaseDatetime != '' && data.releaseDatetime != null){
		    		   var releaseDatetime = new Date(data.releaseDatetime);
		    		   
		    		    //获取当前年
	           			var nowDate = new Date();
	           			var nowyear=nowDate.getFullYear();
	           			var year = releaseDatetime.formatDate('yyyy');
	           			var time1 = '';
	//           			判断发布时间是否为当前年份
	           			if(year == nowyear){
	           				time1 = releaseDatetime.formatDate('MM-dd hh:mm');
	           			}else{
	           				time1 = releaseDatetime.formatDate('yyyy-MM-dd');
	           			}
		    		   
		        	   var time = '<div class="site-piclist_time"><p>'+time1+'</p></div>' ;
		    	   }else{
		    		   var time = '<div class="site-piclist_time"><p>-</p></div>' ;
		    	   }
		    	   
//		    	   checkbox
		    	   var checkbox = '<div class="site-piclist_check"><span data-webpagecode="'+data.webpageCode+'" class="check-child"><i class="fa fa-check"></i></span></div>';
		      
		    	   var tableCon = picBox + title + time + checkbox;
		    	   
		    	   $('td:eq(0)', row).html(tableCon);
		    	   
		    	   $(row).attr('class','col-md-3 p-right p-left');
		       },
		       
//		       服务器传过来的值
		       columns: [//显示的列
		           {data: 'webpageCode', "bSortable": false},
		       ],
		       
		       "aaSorting": [[0, "desc"]],
		   });
		
		$('.videoConBoxTable').on('draw.dt',function() {
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
	        		$('[data-webpageCode="'+code+'"]').attr('src','').attr('src',data.value).removeClass('defaultImg');
	        		
	        	}else{
	        		newImgUrl = context+'/frontEnd/image/home/defaultImg.png';
	        		$('[data-webpageCode="'+code+'"]').attr('src','').attr('src',context+'/frontEnd/image/home/defaultImg.png').removeClass('defaultImg').addClass('defaultImgOrange');
	        	}
	        },
	        error : function(msg) {
	        }
		});
		
		return newImgUrl;
	}
	
})(jQuery);