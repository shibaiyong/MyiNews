$(function(){
	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html');
    $('#footer').loadPage('../common/footer.html');
	$('.relativeNewsTable').DataTable({
    	iDisplayLength : 20,
		"aoColumns": [ 
		  	{ "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	    ],
	    "aaSorting": [[0, ""]],
	});

	$("[data-toggle='popover']").popover({
		trigger:'hover', //触发方式
        //template: '', //你自定义的模板
       // title:"标题",设置 弹出框 的标题
        html: true, // 为true的话，data-content里就能放html代码了
        content:"And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging.",//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
        placement:'auto left',
	});

	$('.beyondEllipsis').click(function(){
		$('#page-content').loadPage('hotEvent/hotEventDetail.html');
	});
});