var ctx = '';
$(function(){
	ctx = $('#ctx').val();
	var count =5;
	Countdown(count)
});
function Countdown(count) {
    if (count >= 1) {
    	
        $('.da-error-count-down').text(count);
        count -= 1;
        setTimeout(function() {
            Countdown(count);
        }, 1000);
    }else{
    	location.href=ctx+"/login";
    }
}