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
})