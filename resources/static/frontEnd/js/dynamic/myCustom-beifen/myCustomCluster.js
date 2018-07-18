$(function(){
	$("#begin_time").jeDate({
		skinCell:"jedatered",
		format: 'YYYY-MM-DD ',
		isinitVal:true,
		minDate:$.nowDate(-30),
		maxDate:$.nowDate(0),
	});
	
	
	$('.searchesTable').allCheck();
	
})

