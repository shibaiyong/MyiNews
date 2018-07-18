$(function(){
	$('.newsPredictConTable').DataTable({
    		iDisplayLength : 20,
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
});