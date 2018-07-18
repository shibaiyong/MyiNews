$(function(){
    /*$('#footer').loadPage('../common/footer.html');*/
	
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
    footerPutBottomContact();
    btnClick();
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
	var webName = $('#webName').val();
	$.ajax({
		type : "post",
		url : webName+"/contact/saveOrUpdate",
		async : true,
		data : {
			userContact:data
		},
		dataType : "json", //返回数据形式为json
		success : function(data){
			contactSuccess();
			
		},
		error : function(msg){
			contactFailure();
		}
	});
}
function btnClick(){
	$(".btn").click(function(){

		var userName = $("#userName").val();
		var phoneNumber = $("#phoneNumber").val();
		var mailbox = $("#mailbox").val();
		var monad = $("#monad").val();
		var goal = $("#goal").val();
		var question = {
				goal:goal
		};
		/*alert(company);*/
		var jsonStr = {
			userName : userName,
			cellphone : phoneNumber,
			email : mailbox,
			company : monad,
			question : question
		};
		
		var postdata = JSON.stringify(jsonStr);
		if($.trim($('#userName').val())!=''&& $.trim($('#phoneNumber').val())!=''&& $.trim($('#monad').val())!='')
			contactInfo(postdata);
	});
}

/*将footer置于底部*/
function footerPutBottomContact(){
	var bodyHeight = $(window).height(); //body的高度
	var headerHeight = 0; //头部的高度
	var contentHeight = $('#main-content').height();  //整体内容的高度
	var footerHeight = $('#footer').height();  //底部的高度
	var DvalueH = $('body').height()-$('header').height()-55; 
	var addValueH = contentHeight + footerHeight;
	if(addValueH < DvalueH){
		var contentHeightNew = bodyHeight-headerHeight-footerHeight-55;
		$('#main-content').css({
			'height':contentHeightNew,
		});
	}else{
		return false;
	}
}


/*申请成功*/
function contactSuccess(){
	$('.contactContentApply').addClass('hide');
	$('.contactFailure').addClass('hide');
	$('.contactSuccess').removeClass('hide');
}
/*申请失败*/
function contactFailure(){
	$('.contactContentApply').addClass('hide');
	$('.contactSuccess').addClass('hide');
	$('.contactFailure').removeClass('hide');
	
	$('.contactFailure').find('a').click(function(){
		$('.contactContentApply').removeClass('hide');
		$('.contactSuccess').addClass('hide');
		$('.contactFailure').addClass('hide');
	});
}
