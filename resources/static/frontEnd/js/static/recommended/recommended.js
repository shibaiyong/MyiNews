$(function(){
	/* 头部导航高亮 */
	$('#example-navbar-collapse').find('ul.navbar-nav').find('li:eq(1)').addClass('active');
	
	$('.dataConBoxTable').DataTable({
		'iDisplayLength' : 30,
		'sPaginationType': "bootstrap",
		'bLengthChange': false,
	  	"aoColumns": [ 
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        	{ "bSortable": false },
        ],
      	"aaSorting": [[0, ""]],
	});
})