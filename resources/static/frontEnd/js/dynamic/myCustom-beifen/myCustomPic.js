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
			{"name":"regions",'value':'110000'},
			{"name":"classifications","value":''}
	);
	
	//表格进行数据传值
	var getImgAjaxData1 = getImgAjaxData(ctx+'/latest/front/pageLatestNews',getPassValue);
	
	getImgAjaxData1.on('draw.dt',function() {
//		设置图片的宽高
		var tableWidth = $('.imgConBoxTable').find('tbody tr').width()-16;
		var tableHeight = tableWidth / 16 * 9
		$('.imgConBoxTable').find('.site-piclist_pic').css({
			'width':tableWidth + 'px',
			'height':tableHeight + 'px',
		});
		$('.imgConBoxTable').find('.site-piclist_info').css({
			'width':tableWidth + 'px',
		});
		$('.imgConBoxTable').find('.site-piclist_pic>img').css({
			'maxHeight':tableHeight + 'px',
		});
		
		$('.imgConBoxTable').allCheck();
		
//		鼠标划入图片放大
//		$(".site-piclist_pic").imgEnlarge();
	});
})