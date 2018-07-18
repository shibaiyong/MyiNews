$(function(){
	$('.topicTable').DataTable({
   		iDisplayLength : 10,
	  	"aoColumns": [ 
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

	$('button.addTopic').click(function(){
		$('.content-wrapper').loadPage('newsTopic/addTopic.html');
	});
});