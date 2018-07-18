$(function(){
	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',8);
    $('#footer').loadPage('../common/footer.html');

    $('#eventOccurrenceTime').datetimepicker({
		showSecond: true,
        dateFormat:'yy-mm-dd',
		timeFormat: 'HH:mm:ss',
        language:  'zh-CN',
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
	});

    $('.customBtn').find('button:eq(0)').click(function(event) {
    	 window.history.forward(); 
    });

    addActive();
    keywordsGroup();
});

/*添加active*/
function addActive(){
	$('.eventType').find('.listLabel a').each(function(){
		$(this).click(function(event) {
			$(this).addClass('active').siblings().removeClass('active');
		});
	});
	$('.evnetGrade').find('.listLabel a').each(function(){
		$(this).click(function(event) {
			$(this).addClass('active').siblings().removeClass('active');
		});
	});
}

/*记录关键词组的内容*/
function keywordsGroup(){
	var count = 1;
	var keywordsGroupString = '';
	$('.keywordsGroup').each(function(){
		$(this).find('input').blur(function(){
			var inputContent = $(this).val();
			if(inputContent == ''){
				if($(this).attr('data-countlist') == undefined){
					return false;
				}else{
					var dataContentList = $(this).attr('data-countlist');
					$('.threadModalRightBox').find('div').each(function(){
						if($(this).attr('data-count')==dataContentList){
							$(this).remove();
						}
					});
					$(this).removeAttr('data-countlist');
					if($('.threadModalRightBox').find('div').length==0){
						count=1;
					}
				}
			}else{
				if($(this).attr('data-countlist') == undefined){
				
					$(this).attr('data-countlist',count);
					keywordsGroupString = '';
					keywordsGroupString = '<div data-count="'+count+'"><h6 class="red">第&nbsp;<span>'+count+'</span>&nbsp;条线索</h6><p class="threadContentRight">'+inputContent+'</p></div>'
					$('.threadModalRightBox').append(keywordsGroupString);
					
					count++;

				}else{
					var dataContentList = $(this).attr('data-countlist');
					$('.threadModalRightBox').find('div').each(function(){
						if($(this).attr('data-count')==dataContentList){
							$(this).find('p.threadContentRight').text(inputContent);
						}
					});

				}
			}
			
			
		});
	});
}

