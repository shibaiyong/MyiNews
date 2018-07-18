$(function(){
    //Enable iCheck plugin for checkboxes
    //iCheck for checkbox and radio inputs

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

	//$('#multiselect').multiselect();
});