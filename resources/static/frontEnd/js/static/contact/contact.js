$(function(){
	alert(ctx);
    $('#footer').loadPage('../common/footer.html');
    
    $('#userName').blur(function(){
    	mandatory($(this));
    });
    
    $('#phoneNumber').blur(function(){
    	if($.trim($(this).val()) == ''){
    		$(this).prev().html('必填字段，请输入内容！');
    	}else{
    		if(isPhoneNumber($.trim($(this).val()))==false){
        		$(this).prev().html('手机号码格式不正确！');
        	}else{
        		$(this).prev().html('');
        	}
    	}
    	
    });
    
    $('#monad').blur(function(){
    	mandatory($(this));
    });

    $('#mailbox').blur(function(){
        if($.trim($(this).val())==''){
            return;
        }else{
            if(isEmailNumber($.trim($(this).val()))==false){
                $(this).prev().html('邮箱格式不正确！');
            }else{
                $(this).prev().html('');
            }
        }
        
    });

    $('button[type="submit"]').click(function(){

        if($.trim($('#userName').val())==''){
            $('#userName').prev().html('必填字段，请输入内容！');
        }

        if($.trim($('#phoneNumber').val())==''){
            $('#phoneNumber').prev().html('必填字段，请输入内容！');
        }else{
            if(isPhoneNumber($.trim($('#phoneNumber').val()))==false){
                $('#phoneNumber').prev().html('手机号码格式不正确！');
            }else{
                $('#phoneNumber').prev().html('');
            }
        }

        if($.trim($('#monad').val())==''){
            $('#monad').prev().html('必填字段，请输入内容！');
        }

        if($.trim($('#mailbox').val())!=''){
            if(isEmailNumber($.trim($('#mailbox').val()))==false){
                $('#mailbox').prev().html('邮箱格式不正确！');
            }else{
                $('#mailbox').prev().html('');
            }
        }
    });
});

/*验证是否为空*/
function mandatory($this){
	if($.trim($this.val()) == ''){
		$this.prev().html('必填字段，请输入内容！');
	}else{
		$this.prev().html('');
	}
}

/*验证手机号*/
function isPhoneNumber(phone){
	var pattern = /^1[34578]\d{9}$/; 
	return pattern.test(phone);
}

/*验证邮箱*/
function isEmailNumber(email){
    var pattern = /\w+[@]{1}\w+[.]\w+/; 
    return pattern.test(email);
}

function contactInfo(data){
	$.ajax({
		type : "post",
		url : ctx+'/contact/front/saveOrUpdate',
		data : data,
		async : true,
		success : function(data){
			
		},
		error : function(msg){
			
		}
	});
}
function btnClick(){
	$(".btn").click(function(){
alert("haha");
		var userName = $("#userName").val();
		var phoneNumber = $("#phoneNumber").val();
		var mailbox = $("#mailbox").val();
		var monad = $("#monad").val();
		var goal = $("#goal").val();
		var jsonStr = {
			userName : userName,
			cellphone : phoneNumber,
			email : mailbox,
			company : monad,
			comment : goal
		};
		
		var postdata = JSON.stringify(jsonStr);
		contactInfo(postdata);
	});
}