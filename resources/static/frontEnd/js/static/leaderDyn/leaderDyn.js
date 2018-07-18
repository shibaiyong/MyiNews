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

	/*文字滚动*/
	$("div.wordScoll").find('.captionCon').myScroll({
		speed:40, //数值越大，速度越慢
		rowHeight:31 //li的高度
	});
});