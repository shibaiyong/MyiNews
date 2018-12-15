
$(function(){
    var retryCount='';
    //页面初始加载时，请求该用户session的登录次数
    sessionCount();
	$(".btn").click(function(){
		is_hide();
	});
	
//	获取验证码
	getVerification();
	
	var u = $("input[name=userName]");
	var p = $("input[name=password]");
	var d = $("input[name=debug]");
	var c = $("input[name=ccap]");


//点击登陆按钮
	$('#submit').click(function(){
		var _$this = $(this);
		var userName = u.val().trim();
		var password = p.val().trim();
		var debug = d.val().trim();
		var code = c.val().trim();
        $.cookie(userName, userName, {path:"/",expires: 7});
        if($('input.rememberpwd').attr('checked')==undefined){			
			$.cookie(userName+'pwdFlag', '0', {path: "/", expires: 7});
        	$.cookie('checkBox', '', { expires: -1, path: '/' });
        	$.cookie(userName+'password', '', { expires: -1, path: '/' });
        }else{
        	var pwd = sha256_digest($(".password").val());
			$.cookie(userName+'pwdFlag', '1', {path: "/", expires: 7});
        	$.cookie(userName+'password', pwd, {path: "/",expires: 7});
        	$.cookie("checkBox", $("input.rememberpwd").attr('checked'), {path:"/",expires: 7});
		}
		
		if(_$this.attr('data-once') == 'true'){			
			_$this.attr('data-once','false');				
			if(userName == ''){
				$('.err-tip').removeClass('hide').find('.err-title').html('用户名不能为空');
				_$this.attr('data-once','true');
			}else if(password ==''){
				$('.err-tip').removeClass('hide').find('.err-title').html('密码不能为空');
				_$this.attr('data-once','true');
			}else {
                if (retryCount>1){
                    if (code == ''){
                        $('.err-tip').removeClass('hide').find('.err-title').html('验证码不能为空');
                        _$this.attr('data-once', 'true');
                    } else {
                        $.ajax({
                            url: ctx + "/api/login/auth/checkcode",
                            data: {checkCode: code},
                            type: 'get',
                            dataType: 'json',
                            success: function (data) {
                                console.log(data);
                                if (data.result == true){
                                    var data = {
                                        "userName": userName,
                                        // "password": sha256_digest(password),
                                        "debug": debug
									};
									if ($.cookie(userName+"pwdFlag") == 0) {
										data.password = sha256_digest(password);
									} else if ($.cookie(userName+"pwdFlag") == 1) {
										password = $.cookie(userName+'password');
										if(sha256_digest(p.val().trim()) != password && password){
											data.password = sha256_digest(password);
										}else{
											data.password = password;
										}	
									}
                                    $.ajax({
                                        url: ctx + "/login",
                                        type: 'post',
                                        data: data,
                                        dataType: 'json',
                                        success: function (data) {
                                            console.log(data);
                                            if (!data.result) {
                                                retryCount = data.resultObj.retryCount;
                                                $('.err-tip').removeClass('hide').find('.err-title').html(data.errorMsg);
                                                _$this.attr('data-once', 'true');
                                            } else {											
                                                location.href = data.resultObj;

                                            }
                                        }
                                    });
                                }else{
                                	//验证失败
                                    $('.err-tip').removeClass('hide').find('.err-title').html(data.errorMsg);
                                    //刷新验证码
                                    var timestamp = new Date().getTime();
                                    $('.ccapimg').attr("src", ctx + '/api/login/auth/getcode' + '?' + timestamp);
                                    _$this.attr('data-once', 'true');
                                }
                            }
                        });
                    }
                } else {
					var data = {"userName": userName, "password": sha256_digest(password), "debug": debug};
					if ($.cookie(userName+"pwdFlag") == 0) {
						data.password = sha256_digest(password);
					} else if ($.cookie(userName+"pwdFlag") == 1) {
						password = $.cookie(userName+'password');
						if(sha256_digest(p.val().trim()) != password && password){
							data.password = sha256_digest(password);
						}else{
							data.password = password;
						}											
					}
                    $.ajax({
                        url: ctx + "/login",
                        type: 'post',
                        data: data,
                        dataType: 'json',
                        success: function (data) {
                            console.log(data);
                            if (!data.result) {
                                retryCount = data.resultObj.retryCount;
                                localStorage.userr=JSON.stringify(data.resultObj);
                                $('.err-tip').removeClass('hide').find('.err-title').html(data.errorMsg);
                                _$this.attr('data-once', 'true');
                                if (retryCount > 1) {
                                    $(".verification").removeClass('hide');
                                    $('.err-tip').removeClass('hide').find('.err-title').html(data.errorMsg);
                                    _$this.attr('data-once', 'true');
                                }
                            } else {
                                location.href = data.resultObj;
                            }
                        }
                    });
                }
            }
		}else{
			return;
		}
    });



	$(".connect p").eq(0).animate({"left":"0%"}, 600);
	$(".connect p").eq(1).animate({"left":"0%"}, 400);

	EnterPress();
	registerCookie();
	if($('body').width()<768){
		$('.connectBox .inewslogo').addClass('hide');
		$('.ueclogo').find('img:eq(1)').removeClass('sr-only');
	}else{
		$('.connectBox .inewslogo').removeClass('hide');
		$('.ueclogo').find('img:eq(1)').addClass('sr-only');
	}
	
	$('.loginForm').find('input').each(function(){
		
		/*if($(this).is(":focus")==true){
			
			$('[data-toggle="popover"]').popover('hide');
			$('.loginForm').find('input').each(function(){
				$(this).removeAttr('data-content');
			});
		}*/
		$(this).click(function(){
			$('[data-toggle="popover"]').popover('hide');
			$('.loginForm').find('input').each(function(){
				$(this).removeAttr('data-content');
			});
		});
	});
	
	loginLogo();


//跟换验证码图片
function getVerification(){
	$('.ccapimg').click(function(){
		var timestamp = new Date().getTime();  
        $(this).attr("src", ctx+'/api/login/auth/getcode' + '?'+ timestamp);  
	})
	
}

/*enter键进入*/
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			$('#submit').click();
		}
	});
}

function is_hide(){ 
	$(".alert").animate({"top":"-40%"}, 300) 
}
function is_show(){ 
	$(".alert").show().animate({"top":"45%"}, 300) 
}

function registerCookie(){
	$('input.rememberpwd').click(function(){
		if($(this).attr('checked')==undefined){
			$(this).attr('checked','checked');
		}else{
			$(this).removeAttr('checked');
		}
	});

	var user =  $.cookie("username");
	if(user){	
        $(".username").val($.cookie("username"));
	}
	if($.cookie(user+"password")){
		var cookiePass = $.cookie(user+"password");
		// var len = cookiePass.length - 64;
		// var realPass = cookiePass.substr( 32,len );
		$(".password").val(cookiePass);
	}
	if($.cookie("checkBox")){
		$('input.rememberpwd').attr('checked','checked');
	}
  
    // $("#submit").click(function () {
	// 	var username = $.trim($(".username").val());
    //     $.cookie(username, username, {path:"/",expires: 7});
    //     if($('input.rememberpwd').attr('checked')==undefined){
	// 		$.cookie('pwdFlag', '0', {path: "/", expires: 7});
    //     	$.cookie('checkBox', '', { expires: -1, path: '/' });
    //     	$.cookie(username+'password', '', { expires: -1, path: '/' });
    //     }else{
    //     	var password = sha256_digest($(".password").val());
	// 		$.cookie('pwdFlag', '1', {path: "/", expires: 7});
    //     	$.cookie(username+'password', password, {path: "/",expires: 7});
    //     	$.cookie("checkBox", $("input.rememberpwd").attr('checked'), {path:"/",expires: 7});
    //     }
    // })
}



function loginLogo(){
	var imgH = 0;var h;
	$('.loginLeft').find('img').each(function(){
		h = parseInt($(this).height()) + parseInt($(this).css('marginTop')) + parseInt($(this).css('marginBottom'))
		imgH = imgH + h;
	})
	
	
	var mt = parseInt((280 - imgH)/2);
	$('.loginLeft').css({
		'paddingTop':mt
	})
}

//请求用户session的登陆次数
function sessionCount(){
	$.ajax({
		url:ctx+"/frontEnd/getRetryCount",
		type:'get',
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data.result==true){
				retryCount = data.resultObj;
				if(retryCount > 1){
					$(".verification").removeClass('hide');
				}
			}else{
				console.log(data);
				$('.err-tip').removeClass('hide').find('.err-title').html(data.errorMsg);
			}
		}

	});
}


});

