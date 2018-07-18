$(function(){

	/*加载头部与尾部*/
    $('#header').loadPage('../common/header.html');
    $('#footer').loadPage('../common/footer.html');

	changeSider();

	/*我的收藏*/
	$('.keepTable>table').DataTable({
    	iDisplayLength : 20,
		"aoColumns": [ 
		  	{ "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	        { "bSortable": false },
	    ],
	    "aaSorting": [[0, ""]],
	});

	$('.keepTable input[type="checkbox"]').iCheck({
       	checkboxClass: 'icheckbox_flat-blue',
       	radioClass: 'iradio_flat-blue'
    });
    //Enable check and uncheck all functionality
    $(".checkbox-toggle").click(function () {
       	var clicks = $(this).data('clicks');
       	if (clicks) {
         	//Uncheck all checkboxes
         	$(".keepTable input[type='checkbox']").iCheck("uncheck");
         	$(this).removeClass("fa-check-square-o").addClass('fa-square-o');
       	} else {
         	//Check all checkboxes
         	$(".keepTable input[type='checkbox']").iCheck("check");
         	$(this).removeClass("fa-square-o").addClass('fa-check-square-o');
       	}
       	$(this).data("clicks", !clicks);
    });

    /*我的历史*/
    $('.historyTable>table').DataTable({
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
});

function changeSider(){
	$('.userSider').find('ul.nav>li').each(function(index){
		$(this).click(function(){
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			if(index == 0){
				$('.keepTable').removeClass('hide');
				$('.historyList').addClass('hide');
			}else if(index == 1){
				$('.keepTable').removeClass('hide');
				$('.historyList').addClass('hide');
			}else if(index == 2){
				$('.historyList').removeClass('hide');
				$('.keepTable').addClass('hide');
			}
		});
	});
}