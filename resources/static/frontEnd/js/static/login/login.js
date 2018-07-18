
$(function(){
	$(".btn").click(function(){
		is_hide();
	})
	var u = $("input[name=userName]");
	var p = $("input[name=password]");
	$('#submit').click(function(){
		if(u.val() == '' || p.val() =='')
		{
			$("#ts").html("用户名或密码不能为空~");
			is_show();
			return false;
		}else if(u.val() == 'admin' || p.val() =='admin'){
			location.href = '../../../../resources/templates/frontEnd/home/home.html';
		}else{
			var reg = /^[0-9A-Za-z]+$/;
			if(!reg.exec(u.val()))
			{
				$("#ts").html("用户名错误");
				is_show();
				return false;
			}
		}
	});

	$(".connect p").eq(0).animate({"left":"0%"}, 600);
	$(".connect p").eq(1).animate({"left":"0%"}, 400);


});

function is_hide(){ 
	$(".alert").animate({"top":"-40%"}, 300) 
}
function is_show(){ 
	$(".alert").show().animate({"top":"45%"}, 300) 
}
