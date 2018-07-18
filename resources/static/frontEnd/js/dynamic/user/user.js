var collectTable,
	historyTable,
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode

$(function(){
    var ctx = $('#context').val()
    console.log(ctx)
//	导航内容实现
	$().showHeader();
	$('.userCenter').addClass('active');
	$(".userIcon").addClass('active');
	$(".navUserName").attr("href", "#").css({
		'cursor': 'default'
	});
	$(".userIcon").attr("href", "#").css({
		'cursor': 'default'
	});
	$(".userIcon").find("i").attr("data-toggle", "");

	changeSider();
	//初始化提示框
    $('[data-toggle="popover"]').popover();
	/*我的收藏*/
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		$('.keepTable>table').css({
    		'width':'600px'
    	});
	}
	useCon();
	$('.table-operation-status').find('a').eq(1).removeClass('hide').end().eq(4).removeClass('hide');
	


    var href = window.location.href;
    if (href.indexOf("skip=collect") != -1) {
        $('.userCenterSider').find('ul.nav>li').eq(1).click()
    }
});

function changeSider(){

	$('.userMain').removeClass('hide');

    //点击编辑按钮。出现输入框，保存，取消按钮
    $('.user-modify').click(function(){
        $('.user-btn-opt').show();
        $('.userCenterCon .form-control').removeClass('reset').attr('readonly',false);
    })
    //点击保存按钮
    $('.user-btn-opt .btn-danger').click(function(){
        saveUserInfo();
    })
    //点击取消按钮
    $('.user-btn-opt .btn-default').click(function(){
        $('.user-btn-opt').hide();
        $('.name-error,.email-error,.mobilePhone-error').hide();
        $('.userCenterCon .form-control').addClass('reset').attr('readonly','readonly');
        useCon();
    })

}
//用户中心
function useCon(){
	
	$.ajax({
        url : ctx+'/user/front/getUser',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
//        		用户名
        		$('.userName').text(obj.userName);
//        		姓名
        		$('.name').val(obj.name);
//        		联系方式
        		if(obj.mobilePhone == ''){
        			$('.mobilePhone').val('未填写');
        		}else{
        			$('.mobilePhone').val(obj.mobilePhone);
        		}
        		
//        		邮箱
        		if(obj.email == ''){
        			$('.email').val('未填写');
        		}else{
        			$('.email').val(obj.email);
        		}
        		
//        		注册时间
        		var createTime = new Date(obj.createTime);
        		createTime = createTime.formatDate('yyyy-MM-dd')
        		$('.createTime').text(createTime);
//        		租户
        		if( obj.tenantName == ''){
        			$('.tenantName').text('未填写');
        		}else{
        			$('.tenantName').text(obj.tenantName);
        		}
        		
//        		角色
        		if(obj.roleName == null){
        			$('.roleName').text('未填写');
        		}else{
        			$('.roleName').text(obj.roleName);
        		}
        		
//        		机构
        		if(obj.orgName == null){
        			$('.orgName').text('未填写');
        		}else{
        			$('.orgName').text(obj.orgName);
        		}
        	
//        		来源
        		var sourceOrgNames = obj.sourceOrgNames;
        		var orgContent = '';
        		if(sourceOrgNames.length > 0){
        			for(var i = 0;sourceOrgNames.length>i;i++){
        				orgContent += '<span>'+sourceOrgNames[i]+'</span>'
        				
        			}
        			$('.sourceOrgNames').html(orgContent);
        		}else{
        			$('.sourceOrgNames').html('全部');
        		}
        		
//        		地区
        		var regionNames = obj.regionNames;
        		var regionContent = '';
        		if(regionNames.length > 0){
        			for(var i = 0;regionNames.length>i;i++){
        				regionContent += '<span>'+regionNames[i]+'</span>'
        				
        			}
        			$('.regionNames').html(regionContent);
        		}else{
        			$('.regionNames').html('全部');
        		}
        		
//        		内容
        		var classifiNames = obj.classifiNames;
        		var classContent = '';
        		if(classifiNames.length > 0){
        			for(var i = 0;classifiNames.length>i;i++){
        				classContent += '<span>'+classifiNames[i]+'</span>'
        				
        			}
        			$('.classifiNames').html(classContent);
        		}else{
        			$('.classifiNames').html('全部');
        		}
//        		过期时间
        		if(obj.endTime == null){
        			$('.endTime').text('无');
        		}else{
        			var endTime =new Date(obj.endTime);
        			endTime = endTime.formatDate('yyyy-MM-dd');
        			$('.endTime').text(endTime);
        		}
        	}
        }
	})
}
//保存用户信息
//邮箱验证规则
// @之前必须有内容且只能是字母（大小写）、数字、下划线(_)、减号（-）、点（.）
// @和最后一个点（.）之间必须有内容且只能是字母（大小写）、数字、点（.）、减号（-），且两个点不能挨着
// 最后一个点（.）之后必须有内容且内容只能是字母（大小写）、数字且长度为大于等于2个字节，小于等于6个字节

function saveUserInfo(){
    var name = $('.name').val()||'';
    var email = $('.email').val()||'';
    var mobilePhone = $('.mobilePhone').val()||'';
    var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g;
    if(name==''){
    	$('.name-error').show();
    	return false;
	}else{
        $('.name-error').hide();
	}
    if(mobilePhone==''){
        $('.mobilePhone-error').show().find('p').text('联系方式不能为空!');
        return false;
    }else if(!(/^1[34578]\d{9}$/.test(mobilePhone))){
        $('.mobilePhone-error').show().find('p').text('联系方式格式不合法');
        return false;
    }else{
        $('.mobilePhone-error').hide();
    }
    if(email==''){
        $('.email-error').show().find('p').text('邮箱不能为空！');
        return false;
    }else if(!(emailReg.test(email))){
        $('.email-error').show().find('p').text('邮箱格式不合法');;
        return false;
    }else{
        $('.email-error').hide();
    }
   $.ajax({
       url:ctx+'/user/front/update',
       type:'post',
       dataType:'json',
       data:{
           'name':name,
           'email':email,
           'mobilePhone':mobilePhone,
       },
       success:function(res){
           if(res.result){
               $().toastmessage('showToast', {
                   //提示信息的内容
                   text: '修改用戶成功！',
                   sticky: false,
                   position : 'middle-center',
                   type: 'success',
			   });
			   window.location.href = ctx + '/gotouser';
           }else{
               $().toastmessage('showToast', {
                   //提示信息的内容
                   text: '修改用戶失敗！',
                   sticky: false,
                   position: 'middle-center',
                   type: 'error',
               });
           }
       }
   })
}





