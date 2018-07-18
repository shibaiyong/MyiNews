$(function(){
	/*点击侧边栏加载不同的页面*/
	var loadPageArr = [
		['','',''],
		['','','','user/user.html'],
		['latestNews/latestNews.html'],
		['newsTopic/topicManage.html'],
		[''],
		['newsEvent/eventManage.html',''],
		['']
	];

	$('.treeview').each(function(index, el) {
		$(this).click(function(){
			console.log(1);
		});
	});

	$('.sidebar-menu').find('.treeview-menu').each(function(position){
		$(this).find('li').each(function(index){
			$(this).click(function(){
				$('.content-wrapper').loadPage(loadPageArr[position][index]);
			});
		});
	});



});