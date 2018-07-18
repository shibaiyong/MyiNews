$(function(){
	$('.eventManageTable').DataTable({
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

	$('#occurrenceTime').datetimepicker({
		format:'yyyy-mm-dd',
        language:  'zh-CN',
        //weekStart: 1,
        //todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView:2,
        forceParse: 0,
	});

	$(".select2").select2();
});