$(function(){

	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html');
    $('#footer').loadPage('../common/footer.html');

	/*$('.fullWebBoxTable').DataTable({
    	iDisplayLength : 20,
		"aoColumns": [ 
		  	{ "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	    ],
	    "aaSorting": [[0, ""]],
	});*/
	changeDataCon();
	/*$('.reSearch').find('button').click(function(){
		$('#page-content').loadPage('latestNews1/latestNews.html');
	});*/
});

/*切换数据的展示形式*/
function changeDataCon(){

	$('.fullWebScreeTable').find('td.fullWebConShow').each(function(index) {
		$(this).click(function(){
			if(index == 1){
				$('.fullWebConList').removeClass('hide');
				$('.fullWebConThumbnail').addClass('hide');
				
			}else{
				$('.fullWebConList').addClass('hide');
				$('.fullWebConThumbnail').removeClass('hide');
			}

			$(this).addClass('active');
			$(this).siblings().removeClass('active');
		});
	});
}