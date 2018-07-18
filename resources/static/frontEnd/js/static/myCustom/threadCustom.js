$(function(){
	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',8);
    $('#footer').loadPage('../common/footer.html');

    $('#begin_time').datetimepicker({
        format:'yyyy-mm-dd hh:ii',
        language:  'zh-CN',
        //weekStart: 1,
        //todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        //minView:2,
        forceParse: 0,
        //showMeridian: 1
    }).on("changeDate",function(ev){
        var transferdate=transferDate($("#begin_time").val());//转时间日期
        $('#end_time').datetimepicker('remove');
        $('#end_time').datetimepicker({
            format:'yyyy-mm-dd hh:ii',
            language:  'zh-CN',
            //minView:2,
            autoclose: 1,
            'startDate':transferdate
        }).on("changeDate",function(ev){
            var enddate=$("#end_time").val();
            setEndTime(enddate);
        });
    });
    $('#end_time').datetimepicker({
        format:'yyyy-mm-dd hh:ii',
        language:  'zh-CN',
        minView:2,
        autoclose: 1
    }).on("changeDate",function(ev){
        var enddate=$("#end_time").val();
        setEndTime(enddate);
    });

    $('.customBtn').find('button:eq(0)').click(function(event) {
    	 window.history.forward(); 
    });

    addActive();
    showReclassify();
    keywordsGroup();
});

/*添加active*/
function addActive(){
	$('.sourceSort').find('.listLabel a').each(function(){
		$(this).click(function(event) {
			if($(this).hasClass('listLabelAll')){
				$(this).addClass('active').siblings('a').removeClass('active');
			}else{
				$('.sourceSort').find('.listLabel a.listLabelAll').removeClass('active');
				if($(this).hasClass('active')){
					$(this).removeClass('active');
				}else{
					$(this).addClass('active');
				}
			}
			
		});
	});
}

/*展示二级分类*/
function showReclassify(){
	$('.contentSort').find('.sortCon a').each(function(){
		$(this).click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				$(this).addClass('active');
			}
		});
	});
	$('.contentSort').find('.sortTitle a').each(function(index){
		$(this).click(function(event) {
			if($(this).hasClass('listLabelAll')){
				
				$('.sortTitle').find('a').each(function(index){
					if(index == 4){
						if($(this).hasClass('active')){
							$('.sortCon').slideUp();
							$(this).find('i').css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							});
						}
						$(this).removeClass('active');
						$('.sortCon').find('a').removeClass('active');
					}else{
						$(this).removeClass('active');
						$('.sortCon').find('a').removeClass('active');
					}
					
				});
				$(this).addClass('active').siblings('a').removeClass('active');
			}else{
				$('.contentSort').find('.listLabel a.listLabelAll').removeClass('active');
				if($(this).hasClass('active')){
					$(this).removeClass('active');
				}else{
					$(this).addClass('active');
				}
			}
			

			if(index==4){
				if($(this).hasClass('active')){
					$('.sortCon').slideDown();
					$(this).find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(-90deg)',
						'-moz-transform': 'rotate(-90deg)',
						'-webkit-transform': 'rotate(-90deg)',
						'transform': 'rotate(-90deg)'
					});
				}else{
					$('.sortCon').slideUp();
					$(this).find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(0deg)',
						'-moz-transform': 'rotate(0deg)',
						'-webkit-transform': 'rotate(0deg)',
						'transform': 'rotate(0deg)'
					});
				}
				
			}
		});
	})
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

