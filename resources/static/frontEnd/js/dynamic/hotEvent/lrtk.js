$(document).ready(function(){
	$('#list_mark b:first').addClass('active');
	$('.list1:first').css('display','block');
	autoroll();
	hookThumb();
})
var i=-1; //第i+1个tab开始
var offset = 3000; //轮换时间
var timer = null;
function autoroll(){
	n = $('#list_mark b').length-1;
	i++;
	if(i > n){
	i = 0;
	}
	slide(i);
	timer = window.setTimeout(autoroll, offset);
}

function slide(i){
	$('#list_mark b').eq(i).addClass('active').siblings().removeClass('active');
	$('.list1').eq(i).css('display','block').siblings('.list1').css('display','none');
}

function hookThumb(){    
	$('#list_mark b').hover(
	function(){
		if(timer){
			clearTimeout(timer);
			i = $(this).prevAll().length;
			slide(i); 
		}
	},function(){
		timer = window.setTimeout(autoroll, offset);  
		this.blur();            
		return false;
	}); 

	$('#list_mark div.list1').hover(
		function(){
			if(timer){
				clearTimeout(timer);
			}
		},function(){
			timer = window.setTimeout(autoroll, offset);  
			this.blur();            
			return false;
		}
	)
}