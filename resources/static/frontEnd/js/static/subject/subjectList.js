$(function(){

	$('#subjectCurrentTable').DataTable({
		  "aoColumns": [ 
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false },
        ],
      
      "aaSorting": [[0, ""]],
	});
	
	$('#subjectHistoryTable').DataTable({
		  "aoColumns": [ 
      { "bSortable": false },
      { "bSortable": false },
      { "bSortable": false },
      { "bSortable": false },
      ],
    
    "aaSorting": [[0, ""]],
	});
  
  $('.subjectDetailBtn').each(function(){
    $(this).click(function(){
      $('#page-content').loadPage('subject/subjectDetail.html');
    });
  });

  
});