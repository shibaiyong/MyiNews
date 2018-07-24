var table;

$(function(){
    //定义checkbox的样式
    $('.mailbox-messages input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });

    $('.mailbox-messages input[type="checkbox"]').click(function() {
        $(this).attr("checked", true);
    });

    $(".checkbox-toggle").click(function () {
        var clicks = $(this).data('clicks');
        if (clicks) {
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

    //模糊查询地区
    var flag = true;
    $('#tenantArea').on('compositionstart',function(){
        flag = false;
    })
    $('#tenantArea').on('compositionend',function(){
        flag = true;
    })
    $('#tenantArea').on('input',function(){
        $("#zybrbh").val('');
        setTimeout(function(){
            if(flag){
                var sc= $("#tenantArea").val();
                if (sc != '') {
                    var content="";
                    document.getElementById("brxmSelect").options.length=0;
                    $("#brxmDiv").css("display","block");
                    var zybrxmWidth = $('#tenantArea').width() + 20;
                    $("#brxmSelect").css("width",zybrxmWidth);
                    $.ajax({
                            url:ctx + "/common/dic/front/getRegionlevel",
                            type: "get",
                            dataType: "JSON",
                            data: {name:sc},
                            success: function(data){
                                console.log(data);
                                $("#brxmSelect").css("display","block");
                                var Data = data.resultObj;
                                if (Data == ''){
                                    if (sc == '全' || sc == '全部'){
                                        content += '<option value="999999">全部</option>';
                                    }else{
                                        content += '<option disabled="disabled">暂无相关地区 请重新输入</option>';
                                    }
                                } else{
                                    $.each(Data,function(index,Data){
                                        content += "<option value="+Data['innerid']+"> "+Data['name']+"</option>";
                                    });
                                }
                                document.getElementById("brxmSelect").innerHTML=content;

                            }
                        }
                    );
                }
            }
        },0)
    })

    table = $('.tenantTable').DataTable({
        "aaSorting": [[0, ""]],
        serverSide:true ,//标示从服务器获取数据  //启用服务端分页（这是使用Ajax服务端的必须配置）
        sAjaxSource : ctx+'/tenant/back/pageTenants',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        iDisplayLength : 20,
        fnServerParams : function(aoData){
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
                +'<a role="menuitem" href="javascript:toUpdate('+data.tenantId+')">修改</a>'
                +'</li>'
                +'<li role="presentation" >'
                +'<a role="menuitem" href="javascript:deleteTenant('+data.tenantId+')">删除</a>'
                +'</li>'
                +'</ul>'
                +'</div>'
            $('td:eq(5)', row).html(content);
        },
        columns: [
            { data: 'tenantId', "bSortable": false,
                render:function(data, type, row){
                    if(null != data && "" != data){
                        return '<input type="checkbox" value="'+data+'" />';
                    }else{
                        return '<input type="checkbox" />';
                    }
                }
            },
            { data: 'name', "bSortable": false },   //租户名称
            { data: 'tenantMark',"bSortable":false},  //租户标识
            { data: 'tenantSecret', "bSortable": false },  //密钥
            { data: 'createDatetime', "bSortable": false ,   //创建时间
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

    //$('#multiselect').multiselect();

    //回车事件
    EnterPress();

})
//选中
function checked(){
    var myselect=document.getElementById("brxmSelect");
    var index=myselect.selectedIndex ;
    $("#zybrbh").val(myselect.options[index].value);
    $("#tenantArea").val(myselect.options[index].text);
    $("#brxmDiv").css("display","none");
}

//添加租户
function addTenant(){
    var tenantId = $('#tenantId').val().trim();
    var tenantName = $('#tenantName').val().trim();
    var companyName = $('#companyName').val().trim();
    var tenantMark = $('#tenantMark').val().trim();
    var tenantSecret = $("#tenantSecret").val().trim();
    var tenantArea = $('#tenantArea').val().trim();
    var zybrbh = $("#zybrbh").val().trim();
    if(null == tenantId || '' == tenantId || undefined == tenantId){
        if(tenantName==""||tenantName==undefined){
            alert("租户名称不能为空！");
        }else if(companyName==""||companyName==undefined){
            alert("租户公司名称不能为空！");
        }else if(tenantMark==""||tenantMark==undefined){
            alert("租户系统标识不能为空！");
        }else if(tenantArea==""||tenantArea==undefined){
            alert("租户所属地区不能为空！");
        }else if(zybrbh==""||zybrbh==undefined){
            alert("请从下拉列表中选择所属地区！");
        }else{
            modelClose();
            var data = {"name": tenantName, "company": companyName, "tenantMark": tenantMark,"region":tenantArea,"regionId":zybrbh};
            $.ajax({
                url: ctx + "/tenant/back/create",
                data: data,
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data.result){
                        alert(data.resultObj);
                        table.ajax.reload();
                    } else {
                        alert(data.errorMsg);
                    }
                },
                error: function (msg) {
                }
            });
        }
    }else{
        if(tenantName==""||tenantName==undefined){
            alert("租户名称不能为空！");
        }else if(companyName==""||companyName==undefined){
            alert("租户公司名称不能为空！");
        }else if(tenantMark==""||tenantMark==undefined){
            alert("租户系统标识不能为空！");
        }else if(tenantArea==""||tenantArea==undefined){
            alert("租户所属地区不能为空！");
        }else if(zybrbh==""||zybrbh==undefined){
            alert("请从下拉列表中选择所属地区！");
        }else {
            modelClose();
            var data = {
                "tenantId": tenantId,
                "name": tenantName,
                "company": companyName,
                "tenantMark": tenantMark,
                "tenantSecret": tenantSecret,
                "region":tenantArea,
                "regionId":zybrbh
            };
            $.ajax({
                url: ctx + "/tenant/back/update",
                data: data,
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    console.log(data);
//                console.log(data.result);
                    if (data.result) {
                        alert(data.resultObj);
                        table.ajax.reload();
                    } else {
                        alert(data.errorMsg);
                    }

                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        }
    }

}
//单个删除租户
function deleteTenant(id){
    if(confirm("确定要删除此租户吗？")){
        if(id!=null&&id!=""){
            $.ajax({
                url:ctx+"/tenant/back/delete/"+id,
                type:'post',
                dataType:'json',
                success:function(data){
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
            })
        }
    }

}
//批量删除
function batchDelete(){
    var len = $("input[type=checkbox]:checked").length;
    if (len == 0){
        alert('请勾选要删除的用户')
    }else {
        if(confirm("确定要删除已勾选的租户？")){
            var checkedList = [];
            $('.mailbox-messages input[type="checkbox"]').each(function(){
                if($(this).is(":checked")){
                    checkedList.push($(this).attr("value"));
                }
            });
            console.log(checkedList);
            $.ajax({
                url : ctx+"/tenant/back/batchDelete",
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
                    //alert(msg.resultObj);
                }
            });
        }
    }

}

//修改租户信息
function toUpdate(id){
    $("#myModalLabel").html("修改租户");
    $(".modal-footer").find("button").eq(1).html("保存");

    $.ajax({
        type:"GET",
        url:ctx+"/tenant/back/getTenant/"+id,
        datatype: "json",
        beforeSend:function(){
        },
        success:function(data){
            console.log(data.result);
            var msg = '';
            if(data.result){
                data = data.resultObj;
                $("#tenantId").val(data.tenantId);
                $("#tenantName").val(data.name);
                //$("#tenantName").prop("disabled",true);
                $("#companyName").val(data.company);
                $('#tenantMark').val(data.tenantMark);
                $('#tenantSecret').val(data.tenantSecret);
                $('#tenantArea').val(data.region);
                $("#zybrbh").val(data.regionId);
                // listOrgs();
                $("#tenantModal").find("div .form-group").eq(3).removeClass("hide");
                $("#tenantModal").modal('show');
            }else{
                msg += "查询用户失败";
                alert(msg);
            }
        },
        error: function(){
        }
    });
}
//关闭模态框
function modelClose(){
    $("#tenantModelForm")[0].reset();
    $("#tenantId").val("");
    $("#tenantName").prop("disabled",false);
    $("#tenantModal").find("div .form-group").eq(3).addClass("hide");

    $("#myModalLabel").html("添加租户");
    $(".modal-footer").find("button").eq(1).html("添加");
    $("#brxmSelect").css("display","none");
    $("#tenantModal").modal('hide');
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

//修改密钥
function toUpdatePwd(id){
    $("#passwordModelForm")[0].reset();
    $("#pwd_innerid").val(id);
    $("#passwordModal").modal('show');
}

  //保存密钥
function savePassword(){
    $("#passwordModal").modal('hide');
    var innerid = $("#pwd_innerid").val().trim();
    var newPassword = $("#newPassword").val().trim();
    if(null==newPassword||''==newPassword||undefined==newPassword){
        alert('密码不能为空');
        return;
    }

    var data = {"tenantId":tenantId,"newPassword":sha256_digest(newPassword)};
    $.ajax({
        url : ctx+"/tenant/back/updatePassword",
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






