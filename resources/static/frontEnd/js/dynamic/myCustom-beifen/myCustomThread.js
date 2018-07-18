$(function(){
	$('.srceenSources').removeClass('hide');
	$('.srceenMap').removeClass('hide');
    $('.srceenClassification').removeClass('hide');
    $('.screenSearch').removeClass('hide');
    var screenIndex = 0;
	$('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			var mlLeft = 125 * screenIndex;
			$(this).css({
				'marginLeft': mlLeft +'px',
			})
			++screenIndex;
		}
	})
	
	var getPassValue = [];
	getPassValue.push(
			{'name':'sourcesLevelOne','value':''},
			{'name':'sourcesLevelTwo','value':''},
			{"name":"regions",'value':'110000'},
			{"name":"classifications","value":''}
	);
	//表格进行数据传值
	var threadAjaxData1 = threadAjaxData(ctx+'/latest/front/pageLatestNews',getPassValue);
	
	$('.dataConBoxTable').on('draw.dt',function() {
//		alert('更新表格');
		$("[data-toggle='tooltip']").tooltip();
		
	});
})

