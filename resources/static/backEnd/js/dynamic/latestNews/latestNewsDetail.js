function updateNews(){
	var innerid = $('#innerid').val().trim();
	var cusClassification = $('#cusClassification').val();
	if(null != cusClassification){
		cusClassification = cusClassification.trim();
	}
	var title = $('#title').val();
	if(null != title){
		title = title.trim();
	}
	var keywords = $('#keywords').val();
	if(null != keywords){
		keywords = keywords.trim();
	}
	var picPath = $('#picPath').val();
	if(null != picPath){
		picPath = picPath.trim();
	}
	var webSummary = $('#webSummary').val();
	if(null != webSummary){
		webSummary = webSummary.trim();
	}
	var content = $('#tagContent').val();
	if(null != content){
		content = content.trim();
	}
	var noTagContent = $('#noTagContent').val();
	if(null != noTagContent){
		noTagContent = noTagContent.trim();
	}
	var param={"webpageCode":innerid,"cusClassification":cusClassification,"title":title,"keywords":keywords,"picPath":picPath,"webSummary":webSummary,"content":content,"noTagContent":noTagContent}
	if("" != $("#image").val()){
		$.ajaxFileUpload({
			url:ctx+"/imageUpload",
			type:'POST',
			secureuri: false,
			async:false,
			fileElementId:'image',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			dataType :'text',
			success :function (data){
				picPath = data;
				param={"webpageCode":innerid,"cusClassification":cusClassification,"title":title,"keywords":keywords,"picPath":picPath,"webSummary":webSummary,"content":content,"noTagContent":noTagContent}
				$.ajax({
					url : ctx+"/updateWabPageNews",//这个就是请求地址对应sAjaxSource
					type : 'post',
					dataType : 'json',
					data:param,
					success : function(data) {
						if(data.result){
							alert(data.resultObj);
							$('.content-wrapper').load(ctx+'/latestNews/back/gotoLatestManagement');
						}else{
							alert(data.errorMsg);
							$('.content-wrapper').load(ctx+'/latestNews/back/gotoLatestManagement');
						}
					},
					error : function(msg) {
					}
				});
			}
		});
	}else{
		$.ajax({
			url : ctx+"/updateWabPageNews",//这个就是请求地址对应sAjaxSource
			type : 'post',
			dataType : 'json',
			data:param,
			success : function(data) {
				if(data.result){
					alert(data.resultObj);
					$('.content-wrapper').load(ctx+'/latestNews/back/gotoLatestManagement');
				}else{
					alert(data.errorMsg);
					$('.content-wrapper').load(ctx+'/latestNews/back/gotoLatestManagement');
				}
			},
			error : function(msg) {
			}
		});
	}
}

function goback(){
	$('.content-wrapper').load(ctx+'/latestNews/back/gotoLatestManagement');
}