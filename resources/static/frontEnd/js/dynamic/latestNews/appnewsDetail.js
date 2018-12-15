var wxtitle = '',
wxdesc = '',
wximgUrl = '',
context = $('#context').val();

(function($) {
	/**
	 * 时间对象的格式化，只要是时间对象，都可以调用该方法
	 * @param format 传入值,日期格式，比如"yyyy-MM-dd hh:mm:ss"
	 * @returns {String} 格式化之后的时间
	 */
	Date.prototype.formatDate = function(format) {
		/*
		 * eg:format="yyyy-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
			// millisecond
		}

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
							- RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
								? o[k]
								: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
})(window.jQuery);


$(function(){
	//获得详情内容
	getDetail();
	
})
//获得详情
function getDetail(){
	var webpageCode = $('.webpageCode').val();
	var releaseDateTime = $('.releaseDateTime').val();
	var queryStr = $('.queryStr').val();
	var dataParam = {
			'webpageCode':webpageCode,
			'releaseDatetime':releaseDateTime
	};
	
	$.ajax({
        url : context+'/wechat/appnewsdetail',//这个就是请求地址对应sAjaxSource
        data:dataParam,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
//        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
//            	标题
            	if(obj.title != null && obj.title != ''){
            		document.title=obj.title+'_智慧新闻';
            		$('.newsDetailConTit h5').html(obj.title)
            	}
            	
            	
//            	发布时间
            	var releaseDatetime;
            	if(obj.releaseDatetime != null && obj.releaseDatetime != ''){
            		releaseDatetime = new Date(obj.releaseDatetime).formatDate('yyyy-MM-dd hh:mm');
            	}else{
            		releaseDatetime = ''
            	}
            	var mainNews='<span class="newsLogo">iNews智慧新闻</span><span class="newsTime">'+releaseDatetime+'</span><a href="'+obj.webpageUrl+'" class="linkOriginal pull-right" ><i class="fa fa-chain-broken"></i> 原文链接</a>';
            	$('.mainNews').html(mainNews);
            	
//            	正文
            	var content;
            	if(obj.content != null && obj.content != ''){
            		
            		$('#newsContent').html(obj.content);
            	}else{
            		
            	}
            	
            	wxtitle = obj.title;
            	wxdesc = obj.cusSummary;
            	wximgUrl = obj.taskId;
            	
            	
            	fnweixin(wxtitle,wxdesc);
            	
        	}
        }
	})
}

function fnweixin(wxtitle,wxdesc){
	//获得当前域名
	var txtUrl = window.location.host;
	
	var url = window.location.href.split('#')[0];
	if(url.indexOf('?')>-1){
		var addUrl = url.split('?')[1];
		var ajaxUrl = "http://"+txtUrl+"/data/wechat/gotoappnewsdetail/"+$('.webpageCode').val()+"?"+addUrl;
	}else{
		var ajaxUrl = "http://"+txtUrl+"/data/wechat/gotoappnewsdetail/"+$('.webpageCode').val();
	}
	
	ajaxUrl = encodeURIComponent(ajaxUrl);
	
	$.ajax({
        url : context+'/wechat/share',//这个就是请求地址对应sAjaxSource
        data:"url="+ajaxUrl,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {

    		var urlLink = data.appUrl;
    		
    		
//    		微信配置
    		wx.config({

    		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    		    appId: data.appId, // 必填，公众号的唯一标识

    		    timestamp: data.timestamp, // 必填，生成签名的时间戳

    		    nonceStr: data.nonceStr, // 必填，生成签名的随机串

    		    signature: data.signature,// 必填，签名，见附录1

    		    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideAllNonBaseMenuItem', 'showMenuItems'] // 分享到朋友圈、分享给朋友

    		});
    		
    		
    		
    		wx.ready(function () {
    			// 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: wxtitle, // 分享标题
                    desc: wxdesc, // 分享描述
                    link: urlLink,//分享点击之后的链接
                    imgUrl:wximgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    success: function () {
                        //成功之后的回调
//                    	console.log('分享成功！');
                    }
                });
                
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: wxtitle, // 分享标题
                    link: urlLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: wximgUrl, // 分享图标
                    success: function () {
//                    	console.log('分享成功！');
                    }
	            });
	              
	       });
    		
    	
        }
    })
}