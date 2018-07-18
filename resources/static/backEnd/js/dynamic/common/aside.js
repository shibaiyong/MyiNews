$(function(){
	/*点击侧边栏加载不同的页面*/
	var loadPageArr = [
//	    [ctx+'/back/gotoCollectManage'],
		[ctx+'/acesslog/back/gotoUserAccess'],
		[ctx+'/user/back/gotoUserManage'],
		[ctx+'/event/back/gotoEventManagement'],
		[ctx+'/latestNews/back/gotoLatestManagement'],
		[ctx+'/sysDic/back/gotoSysDicManagement'],
        [ctx+'/tenant/back/gotoTenantManage'],
        [ctx+"/topNews/back/gotoTopNewsManagement"],
        [ctx+'/cluster/back/gotoHotDiscoverManage']
	];

	$('.content-wrapper').load(loadPageArr[0][0]);
	$('.sidebar-menu').find('.treeview').each(function(position){
		$(this).find('a').each(function(index){
			$(this).click(function(){
				$('.content-wrapper').load(loadPageArr[position][index]);
				$('.treeview').removeClass('active');
				$(this).parents('li.treeview').addClass('active');
			});
		});
	});

//	$('.irobotlink').click(function(){
//		window.open(ctx+'/crawl/back/manage');
//	})

});