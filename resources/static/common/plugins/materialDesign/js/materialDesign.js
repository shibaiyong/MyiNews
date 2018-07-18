$(function(){
	$('.htmleaf-content>ul').each(function(){
		$(this).find('li').click(function (e) {
			if ($(this).hasClass('slider')) {
				return;
			}

			/* Add the slider movement */
	        
			// what tab was pressed
			var whatTab = $(this).index();

			if(whatTab == '0'){
				return;
			}

			// Work out how far the slider needs to go
			var howFar = 79 * (whatTab-1)+65;

			$(this).siblings(".slider").css({
				left: howFar + "px"
			});
		});
	});
});
