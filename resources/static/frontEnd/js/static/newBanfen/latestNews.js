$(function(){

	$('.latestNewsConTable').DataTable({
		  "aoColumns": [ 
        { "bSortable": true },
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
  
  $('.latestNewsConTableBtn').each(function(){
    $(this).click(function(){
      $('#page-content').loadPage('latestNews/latestNewsDetail.html');
    });
  });

  /*自定义时间段*/
  timeCustom();
});

