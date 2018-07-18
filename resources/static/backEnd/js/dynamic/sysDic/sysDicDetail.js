function updateNews(){
	var innerid = $('#innerid').val().trim();
	var dataName = $('#dataName').val();
	if(null != dataName){
		dataName = dataName.trim();
	}
	var dataValue = $('#dataValue').val();
	if(null != dataValue){
		dataValue = dataValue.trim();
	}
	var description = $('#description').val();
	if(null != description){
		description = description.trim();
	}
	var weight = $('#weight').val();
	if(null != weight){
		weight = weight.trim();
	}
	var param={"innerid":innerid,"dataName":dataName,"dataValue":dataValue,"description":description,"weight":weight}
	$.ajax({
		url : ctx+"/sysDic/back/updateSysDic",//这个就是请求地址对应sAjaxSource
		type : 'post',
		dataType : 'json',
		data:param,
		success : function(data) {
			if(data.result){
				alert(data.resultObj);
				$('.content-wrapper').load(ctx+'/sysDic/back/gotoSysDicManagement');
				}else{
				alert(data.errorMsg);
				$('.content-wrapper').load(ctx+'/sysDic/back/gotoSysDicManagement');
				}
		},
		error : function(msg) {
		}
	});
}

function goback(){
	$('.content-wrapper').load(ctx+'/sysDic/back/gotoSysDicManagement');
}