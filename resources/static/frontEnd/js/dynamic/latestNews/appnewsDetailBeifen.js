$(function(){
	//获得详情内容
	getDetail();
	
	
})
function weixinSDK(){
	//获得当前域名
	var txtUrl = window.location.host;
	
	$.ajax({
        url : ctx+'/wechat/share',//这个就是请求地址对应sAjaxSource
        data:"url=http://"+txtUrl+"/wechat/gotoappnewsdetail/"+$('.webpageCode').val(),
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {

    		alert(JSON.stringify(data));
    		var urlLink = data.appUrl;
//    		微信配置
    		wx.config({

    		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    		    appId: data.appId, // 必填，公众号的唯一标识

    		    timestamp: data.timestamp, // 必填，生成签名的时间戳

    		    nonceStr: data.nonceStr, // 必填，生成签名的随机串

    		    signature: data.signature,// 必填，签名，见附录1

    		    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideAllNonBaseMenuItem', 'showMenuItems'] // 分享到朋友圈、分享给朋友

    		});
    		
    		
    		
    		wx.ready(function () {
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
	            wx.onMenuShareAppMessage({
	                title: "小心!现在一些共享产品可能是盯着押金去的", // 分享标题
	                desc: "女孩的祖父住在威斯康星州，当地时间10月11日他们家的房子在火灾中付之一炬，一位家庭成员在11月2日返回家中察看，发现两位男子跑进房内，上前询问才得知两人是在趁火打劫。 这件乔丹签名球衣是凯尔塞-斯切尔1995年在芝加哥的乔丹餐厅得到的，当年患有重病的她参加了星光儿童基金会组织的见面会，许多患病儿童都得到与乔丹见面的机", // 分享描述
	                link: urlLink,//分享点击之后的链接
	                imgUrl:'http://y1.ifengimg.com/news_spider/dci_2013/09/63252a140fd687c6f56c9dbe5556fc75.jpg', // 分享图标
	                type: 'link', // 分享类型,music、video或link，不填默认为link
	                success: function () {
	                    //成功之后的回调
	                	console.log('分享成功！');
	                }
	            });
	              
            });
    	
        }
    })
}
//获得详情
function getDetail(){
	var webpageCode = $('.webpageCode').val();
	var queryStr = $('.queryStr').val();
	var dataParam = {
			'webpageCode':webpageCode,
	};
	$.ajax({
        url : ctx+'/wechat/appnewsdetail',//这个就是请求地址对应sAjaxSource
        data:dataParam,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
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
            		releaseDatetime = ' - '
            	}
            	var mainNews='<span class="gray">发布时间:</span><strong >'+releaseDatetime+'</strong>';
            	$('.MainNews').html(mainNews);
            	
//            	正文
            	var content;
            	if(obj.content != null && obj.content != ''){
            		
            		$('#newsContent').html(obj.content);
            	}else{
            		
            	}
        	}
        }
	})
}