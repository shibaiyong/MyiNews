$(function(){
    //Enable iCheck plugin for checkboxes
    //iCheck for checkbox and radio inputs
    $('.mailbox-messages input[type="checkbox"]').iCheck({
       checkboxClass: 'icheckbox_flat-blue',
       radioClass: 'iradio_flat-blue'
    });
    //Enable check and uncheck all functionality
    $(".checkbox-toggle").click(function () {
        var clicks = $(this).data('clicks');
        if (clicks) {
         	//Uncheck all checkboxes
         	$(".mailbox-messages input[type='checkbox']").iCheck("uncheck");
         	$(".fa", this).removeClass("fa-check-square-o").addClass('fa-square-o');
        } else {
         	//Check all checkboxes
         	$(".mailbox-messages input[type='checkbox']").iCheck("check");
         	$(".fa", this).removeClass("fa-square-o").addClass('fa-check-square-o');
       	}
       	$(this).data("clicks", !clicks);
    });

    $('.userTable').DataTable({
   		iDisplayLength : 10,
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	    "aaSorting": [[0, ""]],
	});

	$('#multiselect').multiselect();
});