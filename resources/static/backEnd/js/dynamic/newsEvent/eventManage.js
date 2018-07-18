var table;
$(function () {
    table = $('.eventManageTable').DataTable({
        "aaSorting": [[0, ""]],
        serverSide: true,//标示从服务器获取数据
        sAjaxSource: ctx + '/event/back/pageEvent',//服务器请求
        fnServerData: retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams: function (aoData) {
//        	var queryStr = [];
//        	if(){
//        		queryStr.push();
//        	}
//        	aoData.push(
//        			{"name":"queryStr","value":queryStr}
//        		);
        },
        "rowCallback": function (row, data, index) {
            var content;
            content = '<div class="dropdown">'
                + '<button type="button" class="btn dropdown-toggle" id="operatedropdown" data-toggle="dropdown">'
                + '操作<span class="caret"></span>'
                + '</button>'
                + '<ul class="dropdown-menu" role="menu" aria-labelledby="operatedropdown">'
                + '<li role="presentation" >'
                + '<a role="menuitem" href="javascript:toUpdate(\'' + data.eventCode + '\')">修改</a>'
                + '</li>'
                + '<li role="presentation" >'
                + '<a role="menuitem" href="javascript:deleteEvent(\'' + data.eventCode + '\')">删除</a>'
                + '</li>'
                + '</ul>'
                + '</div>'
            var checkBox = "<input type=\"checkbox\" data-event-code=\""+data.eventCode+"\" class=\"delete-list\"/>"
            $('td:eq(6)', row).html(content);
            $('td:eq(0)', row).html(checkBox);
            $('td:eq(2)', row).html(data.userRealName + "(" + data.username + ")");
        },
        columns: [//显示的列
            {data: 'checkbox', "bSortable": false},
            {data: 'eventName', "bSortable": false},
            {data: 'userRealName', "bSortable": false},
            {
                data: 'createDatetime', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var createTime = new Date(data);
                        var time = createTime.formatDate('yyyy-MM-dd hh:mm');
                        return time;
                    } else {
                        return '-';
                    }
                }
            },
            {
                data: 'occurDatetime', "bSortable": false,
                render: function (data, type, row) {
                    if (null != data && "" != data) {
                        var occurtime = new Date(data);
                        var time = occurtime.formatDate('yyyy-MM-dd hh:mm');
                        return time;
                    } else {
                        return '-';
                    }
                }
            },
            // {data: 'classificationName', "bSortable": false},
            // {
            //     data: 'level', "bSortable": false,
            //     render: function (data, type, row) {
            //         if (data == 1) {
            //             return "一般";
            //         } else if (data == 2) {
            //             return "较为重要";
            //         } else if (data == 3) {
            //             return "重要";
            //         } else if (data == 4) {
            //             return "非常重要";
            //         } else {
            //             return "未知";
            //         }
            //     }
            // },
            {data: 'description', "bSortable": false},
            {"bSortable": false},
        ],
        "columnDefs": [{
            "targets": ['_all'],
            "data": null,
            "defaultContent": "--"
        }]
    });

    $('#occurrenceTime').datetimepicker({
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss',
        language: 'zh-CN',
        //weekStart: 1,
        //todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
//        startView: 2,
//        minView:2,
        forceParse: 0,
    });

    $(".select2").select2();

    $('#addEventModal').on('hidden.bs.modal', function () {
        modalClose();
    })
    $('#deleteList').click(function () {
        deleteList();
    })
});

function deleteList() {
    if(confirm("确定要删除此项目吗？")){
        var ids = []
        $(".delete-list").each(function (index,dom) {
            if(dom.checked){
                var id = dom.getAttribute("data-event-code")
                ids.push(id)
            }
        })
        if(ids.length==0){
            return
        }
        // var param = {
        //     eventCodes:ids
        // }
        $.ajax({
            type: "POST",
            //提交的网址
            url: ctx + "/event/back/deleteEvents",
            //提交的数据
            data: JSON.stringify(ids),
            async: false,
            contentType:"application/json; charset=utf-8",
            //返回数据的格式
            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            beforeSend: function () {
            },
            //成功返回之后调用的函数
            success: function (data) {
                var msg = "";
                if (data.result) {
                    msg = data.resultObj;
                    alert(msg);
                    table.ajax.reload();
                } else {
                    msg = data.errorMsg;
                    alert(msg);
                }

            },
            error: function () {
                //请求出错处理
            }
        });
    }
}

function modalClose() {
    $("#addEventForm")[0].reset();
    $("#eventCode").val("");
    $("#addEventModal").modal('hide');
    $("input[name='keywords']").each(function (i) {
        $(this).prop("disabled", false);
    });
    // $("#classification").trigger("change");
}

function save() {
    $('#submit').attr('disabled', true);
    var eventCode = $("#eventCode").val().trim();
    var name = $("#name").val().trim();
    var picPath = "";
    var keywords = "";
    var keywordList = $("input[name='keywords']").each(function (i) {
        var keyword = $(this).val().trim();
        if (null != keyword && "" != keyword) {
            if ("" == keywords) {
                keywords += keyword;
            } else {
                keywords += "|" + keyword;
            }
        }
    });
    var occurrenceTime = $("#occurrenceTime").val();
    // var classification = $("#classification").val();
    // var level = $("#level").val();
    // if ("" == classification || null == classification) {
    //     alert("事件类型不能为空");
    //     $('#submit').attr('disabled', false);
    //     return;
    // }

    var description = $("#description").val();
    if ("" == name || null == name) {
        alert("事件名称不能为空");
        $('#submit').attr('disabled', false);
        return;
    }
    if ("" == keywords || null == keywords) {
        alert("关键词组不能为空");
        $('#submit').attr('disabled', false);
        return;
    }
    if ("" == occurrenceTime || null == occurrenceTime) {
        alert("事件发生时间不能为空");
        $('#submit').attr('disabled', false);
        return;
    }

    var param;
    var fileObj = document.getElementById("image").files[0];
    if (null != fileObj && "" != fileObj) {
// 		if(fileObj.size>(20*1024*1024)){
// 			notice.failure('文件不能大于20M');
// 			return;
// 		}
        if (null != eventCode && "" != eventCode) {
            param = {"eventCode": eventCode};
        }
        $.ajaxFileUpload({
            url: ctx + "/event/back/uploadImage",
            type: 'POST',
            secureuri: false,
            async: false,
            fileElementId: 'image',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: param,
            dataType: 'text',
            success: function (data) {
                picPath = data;
                if (null != eventCode && "" != eventCode && undefined != eventCode) {
                    param = {
                        "isSystemCreate":0,
                        "eventCode": eventCode,
                        "eventName": name,
                        "keywords": keywords,
                        "description": description,
                        "picPath": picPath,
                        "occurrenceDate": occurrenceTime,
                        // "classification": classification,
                        // "level": level
                    };
                } else {
                    param = {
                        "isSystemCreate":0,
                        "eventName": name,
                        "keywords": keywords,
                        "description": description,
                        "picPath": picPath,
                        "occurrenceDate": occurrenceTime,
                        // "classification": classification,
                        // "level": level
                    };
                }
                $.ajax({
                    type: "POST",
                    //提交的网址
                    url: ctx + "/event/back/saveOrUpdate",
                    //提交的数据
                    data: param,
                    async: false,
                    //返回数据的格式
                    datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                    //在请求之前调用的函数
                    beforeSend: function () {
                    },
                    //成功返回之后调用的函数
                    success: function (data) {
                        var msg = "";
                        if (data.result) {
                            msg = data.resultObj;
                            modalClose();
                            alert(msg);
                            table.ajax.reload();
                        } else {
                            msg = data.errorMsg;
                            alert(msg);
                        }

                    },
                    error: function () {
                        //请求出错处理
                    }
                });
            }, error: function (data) {
                alert("上传图片失败");
            }
        });
    } else {
        if (null != eventCode && "" != eventCode && undefined != eventCode) {
            param = {
                "isSystemCreate":0,
                "eventCode": eventCode,
                "eventName": name,
                "keywords": keywords,
                "description": description,
                "picPath": picPath,
                "occurrenceDate": occurrenceTime,
                // "classification": classification,
                // "level": level
            };
        } else {
            param = {
                "isSystemCreate":0,
                "eventName": name,
                "keywords": keywords,
                "description": description,
                "picPath": picPath,
                "occurrenceDate": occurrenceTime,
                // "classification": classification,
                // "level": level
            };
        }

        $.ajax({
            type: "POST",
            //提交的网址
            url: ctx + "/event/back/saveOrUpdate",
            //提交的数据
            data: param,
            //返回数据的格式
            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
            async: false,
            //在请求之前调用的函数
            beforeSend: function () {
            },
            //成功返回之后调用的函数
            success: function (data) {
                var msg = "";
                if (data.result) {
                    msg = data.resultObj;
                    modalClose();
                    alert(msg);
                    table.ajax.reload();
                } else {
                    msg = data.errorMsg;
                    alert(msg);
                }

            },
            error: function () {
                //请求出错处理
            }
        });
    }
    $('#submit').attr('disabled', false);

}

function deleteEvent(id) {
    if (id != null && id != "" && confirm("确定要删除此项目吗？")) {
        $.ajax({
            type: "POST",
            //提交的网址
            url: ctx + "/event/back/delete/" + id,
            //提交的数据
            //返回数据的格式
            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            beforeSend: function () {
            },
            //成功返回之后调用的函数
            success: function (data) {
                var msg = '';
                if (data.result) {
                    msg += "删除成功";
                } else {
                    msg += "删除失败";
                }
                alert(msg);
                table.ajax.reload();
                $('body').css('overflow-y', 'auto');
            },
            error: function () {
                //请求出错处理
            }
        });
    }
}

function toUpdate(id) {
    $.ajax({
        type: "GET",
        //提交的网址
        url: ctx + "/event/back/findById/" + id,
        //提交的数据
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend: function () {
        },
        //成功返回之后调用的函数             
        success: function (data) {
            var msg = '';
            if (null != data) {
                $("#eventCode").val(data.eventCode);
                $("#name").val(data.eventName);
                $("#description").val(data.description);
                $('#occurrenceTime').datetimepicker('setDate', new Date(parseInt(data.occurDatetime)));
                // var classfis = data.classification;
                // $('#classification').val(classfis);
                // $("#level").val(data.level);
//         		$('#classification').val(["娱乐","政治"]);
                var otime = new Date(parseInt(data.occurDatetime + "")).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
                var keywordArray
                if (data.keywords) {
                    keywordArray = data.keywords.split('|');
                }
                $("input[name='keywords']").each(function (i) {
                    if (null != keywordArray[i] && "" != keywordArray[i]) {
                        $(this).val(keywordArray[i]);
                        $(this).prop("disabled", false);
                    } else {
                        $(this).prop("disabled", false);
                    }

                });
                $("#addEventModal").modal('show');

            } else {
                msg += "查询事件失败";
                alert(msg);
            }
        },
        error: function () {
            //请求出错处理
        }
    });
}
