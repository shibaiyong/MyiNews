var table;
$(function(){
	console.log('进入');	
    //Enable iCheck plugin for checkboxes
    //iCheck for checkbox and radio inputs
    $('.mailbox-messages input[type="checkbox"]').iCheck({
       checkboxClass: 'icheckbox_flat-blue',
       radioClass: 'iradio_flat-blue'
    });


    //Enable check and uncheck all functionality
    $(".checkbox-toggle").click(function(){
        var clicks = $(this).data('clicks');
        if(clicks){
         	//Uncheck all checkboxes
         	$(".mailbox-messages input[type='checkbox']").iCheck("uncheck");
         	$(".fa", this).removeClass("fa-check-square-o").addClass('fa-square-o');
        } else {
         	//Check all checkboxes
         	$(".mailbox-messages input[type='checkbox']").iCheck("check");
         	$(".fa", this).removeClass("fa-square-o").addClass('fa-check-square-o');
       	}
       	$(this).data("clicks", !clicks);
    });


    table = $('.userTable').DataTable({
    	"aaSorting": [[0, ""]],
        serverSide: true,//标示从服务器获取数据  //启用服务端分页（这是使用Ajax服务端的必须配置）
        sAjaxSource : ctx+'/user/back/pageUsers',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        iDisplayLength : 20,
        fnServerParams : function( aoData ){
        	var queryStr = $('#queryStr').val().trim();
        	aoData.push(
        			{"name":"queryStr","value":queryStr}
        		);
        },
        "rowCallback" : function(row, data, index) {
        	var content;
        	content='<div class="dropdown">'
				   +'<button type="button" class="btn dropdown-toggle" id="operatedropdown" data-toggle="dropdown">'
				   +'操作<span class="caret"></span>'
				   +'</button>'
				   +'<ul class="dropdown-menu" role="menu" aria-labelledby="operatedropdown">'
				   +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:toUpdate('+data.innerid+')">修改</a>'
				   +'</li>'
				   +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:toUpdatePwd('+data.innerid+')">修改密码</a>'
				   +'</li>'
				   +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:deleteUser('+data.innerid+')">删除</a>'
				   +'</li>'
				   +'</ul>'
				   +'</div>'
        	$('td:eq(4)', row).html(content);
        },
        columns: [//显示的列
            { data: 'innerid', "bSortable": false,
              render:function(data, type, row){
            		if(null != data && "" != data){
						return '<input type="checkbox" value="'+data+'" />';
            		}else{
            			return '<input type="checkbox" />';
            		}
              }
            },
            { data: 'userName', "bSortable": false },
            { data: 'name', "bSortable": false },
            { data: 'createTime', "bSortable": false,
              render:function(data, type, row){
            		if(null != data && "" != data){
            			var createTime = new Date(data);
            			var time = createTime.formatDate('yyyy-MM-dd hh:mm');
						return time;
            		}else{
            			return '-';
            		}
              }
            },
            {"bSortable": false},
        ],
	        "columnDefs": [ {
	            "targets": [ '_all' ],
	            "data": null,
	            "defaultContent": "--"
	        } ]
	});

    //
    // $(".mailbox-messages input[type='checkbox']").click(function(){
    //     $(this).attr("checked", true);
    //     console.log(666);
    // });


	$('#multiselect').multiselect();
	
	EnterPress();//回车事件
	
	$('#userModal').on('hidden.bs.modal', function () {
		  modelClose();
	})
});

/*
 * 添加用户
 */
function addUser(){
	
	var innerid = $('#innerid').val().trim();
	var userName = $('#userName').val().trim();
	var name = $('#name').val().trim();
	var email = $('#email').val().trim();
	var mobilePhone = $("#mobilePhone").val().trim();
	var onlineNum = $("#onlineNum").val();
	var effectiveTime = $("#effectiveTime").val();
	var tenantId = $("#tenant").val();
	var orgId = $("#org").val();
	var roleId = $("#role").val();
	var remark =  $('#userNote').val().trim();
	modelClose();
	if(null == innerid || '' == innerid || undefined == innerid){
		var data = {"userName":userName,"name":name,"email":email,"mobilePhone":mobilePhone,"onlineNum":onlineNum,"effectiveTime":effectiveTime,"tenantId":tenantId,"orgId":orgId,"roleId":roleId,"remark":remark};
	    $.ajax({
	        url : ctx+"/user/back/create",
	        data : data,
	        type : 'post',
	        dataType : 'json',
	        success : function(data) {
	        	if(data.result){
	        		alert(data.resultObj);
	        	}else{
	        		alert(data.errorMsg);
	        	}
	        	table.ajax.reload();
	        },
	        error : function(msg) {
	        }
	    });
	}else{
		var data = {"innerid":innerid,"name":name,"email":email,"mobilePhone":mobilePhone,"onlineNum":onlineNum,"effectiveTime":effectiveTime,"tenantId":tenantId,"orgId":orgId,"roleId":roleId,"remark":remark};
	    $.ajax({
	        url : ctx+"/user/back/update",
	        data : data,
	        type : 'post',
	        dataType : 'json',
	        success : function(data) {
	        	if(data.result){
	        		alert(data.resultObj);
	        	}else{
	        		alert(data.errorMsg);
	        	}
	        	table.ajax.reload();
	        },
	        error : function(msg) {
	        }
	    });
	}
	
}
/*
 * 删除用户
 */
function deleteUser(id){
	if(id != null && id != "" && confirm("确定要删除此用户吗？")){
	    $.ajax({
	        url : ctx+"/user/back/delete/"+id,
	        type : 'post',
	        dataType : 'json',
	        success : function(data) {
	        	if(data.result){
	        		alert(data.resultObj);
	        	}else{
	        		alert(data.errorMsg);
	        	}
	        	table.ajax.reload();
	        },
	        error : function(msg) {
	        }
	    });
	}
}

//批量删除
function batchDelete(){
    var len = $("input[type=checkbox]:checked").length;
    if (len == 0){
    	alert('请勾选要删除的用户')
	} else {
        if(confirm("确定要删除已勾选的用户？")){
            var checkedList = [];
            $('.mailbox-messages input[type="checkbox"]').each(function(){
                if ($(this).is(":checked")){
                    checkedList.push($(this).attr("value"));
                }
            });
            // console.log(checkedList);
            $.ajax({
                url : ctx+"/user/back/deleteUsers",
                data :JSON.stringify(checkedList),
                type : 'post',
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success : function(data) {
                    if(data.result){
                        alert(data.resultObj);
                    }else{
                        alert(data.errorMsg);
                    }
                    table.ajax.reload();
                },
                error:function(msg){
                    alert(msg.resultObj);
                }
            });
        }
	}
}

/*
 * 修改密码
 */
function toUpdatePwd(id){
	$("#passwordModelForm")[0].reset();
	$("#pwd_innerid").val(id);
	$("#passwordModal").modal('show');
}
/*
 * 保存密码
 */
function savePassword(){
	$("#passwordModal").modal('hide');
	var innerid = $("#pwd_innerid").val().trim();
//	var oldPassword = $("#oldPassword").val().trim();
	var newPassword = $("#newPassword").val().trim();
//	var newPassword2 = $("#newPassword2").val().trim();
//	if(null==oldPassword||''==oldPassword||undefined==oldPassword||null==newPassword||''==newPassword||undefined==newPassword||null==newPassword2||''==newPassword2||undefined==newPassword2){
	if(null==newPassword||''==newPassword||undefined==newPassword){
		alert('密码不能为空');
		return;
	}
//	if(newPassword!=newPassword2){
//		alert('两次输入的密码不一致');
//		return;
//	}
//	var data = {"innerid":innerid,"oldPassword":oldPassword,"newPassword":newPassword};
	var data = {"innerid":innerid,"newPassword":sha256_digest(newPassword)};
	$.ajax({
        url : ctx+"/user/back/updatePassword",
        type : 'post',
        dataType : 'json',
        data : data,
        success : function(data) {
        	if(data.result){
        		alert(data.resultObj);
        	}else{
        		alert(data.errorMsg);
        	}
        },
        error : function(msg) {
        }
    });
}

/*
 * 修改用户
 */
function toUpdate(id){
	$.ajax({
        type:"GET",
        //提交的网址
        url:ctx+"/user/back/getUser/"+id,
        //提交的数据
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){
        },
        //成功返回之后调用的函数             
        success:function(data){
        	var msg = '';
        	if(data.result){

        		data = data.resultObj;
        		$("#innerid").val(data.innerid);
        		$("#userName").val(data.userName);
        		$("#userName").prop("disabled",true);
        		$("#name").val(data.name);
        		$('#email').val(data.email);
        		$('#mobilePhone').val(data.mobilePhone);
        		$("#onlineNum").val(data.onlineNum);
        		$("#effectiveTime").val(data.effectiveTime);
        		$("#tenant").val(data.tenantId);
        		$('#userNote').val(data.remark);
                listOrgs();
        		$("#org").val(data.orgId);
        		$("#role").val(data.roleId);
        		$("#userModal").modal('show');
        	}else{
        		msg += "查询用户失败";
        		alert(msg);
        	}
        }   ,
        error: function(){
            //请求出错处理
        }         
     });
}

function modelClose(){
	
	$("#userModelForm")[0].reset();
	$("#innerid").val("");
//	console.log($("#userModelForm"));
	$("#userName").prop("disabled",false);
	$("#userModal").modal('hide');
}

/*enter键进入*/
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			table.ajax.reload();
		}
	});
}

function listOrgs(){
	var tenantId = $('#tenant').val();
	if(tenantId != undefined && tenantId != null && tenantId != ''){
		$.ajax({
	        url : ctx+"/user/back/org/tenant/"+tenantId,
	        type : 'get',
	        dataType : 'json',
	        success : function(data) {
	        	if(data.result){
	        		var orgs = data.resultObj;
	        		var content = '';
	        		for (var int = 0; int < orgs.length; int++) {
						var org = orgs[int];
						content += '<option value="'+org.orgId+'">'+org.orgName+'</option>';
						
					}
	        		$('#org').html(content);
	        	}else{
	        		alert(data.errorMsg);
	        	}
	        },
	        error : function(msg) {
	        }
	    });
	}
}
