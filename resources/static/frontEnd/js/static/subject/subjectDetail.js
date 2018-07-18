$(function(){
	/*bootstrap与masonry结合实现瀑布流*/
	var $container = $('.masonry-container');
	$container.imagesLoaded( function () {
	  $container.masonry({
	        columnWidth: '.item',
	        itemSelector: '.item'
	  });   
	});
	$('a[data-toggle=tab]').each(function () {
		var $this = $(this);
		$this.on('shown.bs.tab', function () {
		    $container.imagesLoaded( function () {
		      	$container.masonry({
		        	columnWidth: '.item',
		       	 	itemSelector: '.item'
		      	});   
		    });  
		});
	});
	/*点击返回按钮*/
	$('.btn-back').click(function(event) {
		$('#page-content').loadPage('subject/subjectList.html');
	});

	/*文字滚动*/
	$("div.wordScoll").find('.captionCon').myScroll({
		speed:40, //数值越大，速度越慢
		rowHeight:32 //li的高度
	});	

	/*setTimeout(function(){
		$('#btn-mm').addClass('active');
		alert(1);
	},1000);*/
	

});

function addActive(){
	$('#btn-mm').addClass('active');
	$('#btn-mm').siblings().removeClass('active');
}

