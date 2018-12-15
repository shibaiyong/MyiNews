$(function(){
	footerPutBottom();
	
	$().showHeader({});
	
	$('[data-toggle="popover"]').popover({
		html:true,
		placement:'right',
	});
	
	var formerpsw = $('#formerpsw');
	var newpsw = $('#newpsw');
	var validatepsw = $('#validatepsw');
	 
	var formerpswFlag = 1;
    var ctx = $('#context').val();
	
	$('#formerpsw').blur(function(){
		if(formerpsw.val().trim() == '' || formerpsw.val().trim() == 'undefined' || formerpsw.val().trim() == null){
			$('#formerpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 原密码不能为空！');
			$('#formerpsw').popover('show');
		}else{
			var password = formerpsw.val().trim();
			var data = {"password":sha256_digest(password)};
			$.ajax({
		        url : ctx+"/user/front/validatePwd",
		        type : 'GET',
		        data:data,
		        dataType : 'json',
		        success : function(data) {
		        	if(!data.result){
		        		formerpswFlag = 0;
		        		$('#formerpsw').removeAttr('data-content');
		        		$('#formerpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> '+data.errorMsg+'');
		    			$('#formerpsw').popover('show');
		        	}else{
		        		formerpswFlag = 1;
		        		$('#formerpsw').removeAttr('data-content');
		    			$('#formerpsw').popover('hide');
		        	}
		        },
		        error : function(msg) {
		        }
		    });
			
			
			
		}
		
	});
	
	$('#newpsw').blur(function(){
		if(newpsw.val().trim() == '' || newpsw.val().trim() == 'undefined' || newpsw.val().trim() == null){
			$('#newpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 新密码不能为空！');
			$('#newpsw').popover('show');
		}else{
			$('#newpsw').removeAttr('data-content');
			$('#newpsw').popover('hide');
		}
	});
	
	$('#validatepsw').blur(function(){
		if(validatepsw.val().trim() == '' || validatepsw.val().trim() == 'undefined' || validatepsw.val().trim() == null){
			$('#validatepsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 确认密码不能为空！');
			$('#validatepsw').popover('show');
		}else if(newpsw.val().trim() !== validatepsw.val().trim()){
			$('#validatepsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 两次密码不一致,请重新输入！');
			$('#validatepsw').popover('show');
		}else{
			$('#validatepsw').removeAttr('data-content');
			$('#validatepsw').popover('hide');
		}
	});
	
	$('#remit').click(function(){
		if(formerpsw.val().trim() == '' || formerpsw.val().trim() == 'undefined' || formerpsw.val().trim() == null){
			$('#formerpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 原密码不能为空！');
			$('#formerpsw').popover('show');
			return false
		}else if(newpsw.val().trim() == '' || newpsw.val().trim() == 'undefined' || newpsw.val().trim() == null){
			$('#newpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 新密码不能为空！');
			$('#newpsw').popover('show');
			return false
		}else if(validatepsw.val().trim() == '' || validatepsw.val().trim() == 'undefined' || validatepsw.val().trim() == null){
			$('#validatepsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 确认密码不能为空！');
			$('#validatepsw').popover('show');
			return false
		}else if(newpsw.val().trim() != validatepsw.val().trim()){
			$('#validatepsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 两次密码不一致,请重新输入！');
			$('#validatepsw').popover('show');
			return false
		}else if(formerpswFlag == 0){
			$('#formerpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> 原密码不正确！');
			$('#formerpsw').popover('show');
			return false
		}else{
			var oldPwd = formerpsw.val().trim();
			var newPwd = newpsw.val().trim();
			var valudateNewPwd = validatepsw.val().trim();
			
			var data = {"oldPassword":sha256_digest(oldPwd),"newPassword":sha256_digest(newPwd),"valudateNewPwd":sha256_digest(valudateNewPwd)};
			$.ajax({
		        url : ctx+"/user/front/updatePassword",
		        type : 'post',
		        data:data,
		        dataType : 'json',
		        success : function(data) {
		        	if(data.result){
		        		var msg = data.errorMsg;
		        		alert(msg);
		        		location.href = data.resultObj;
		        	}else{
		        		var msg = data.errorMsg;
		        		alert(data.errorMsg);
		        		$('#formerpsw').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png"> '+data.errorMsg+'');
		    			$('#formerpsw').popover('show');
		        	}
		        },
		        error : function(msg) {
		        }
		    });
		}
	});
	
});