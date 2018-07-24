var table;
var listData;
Date.prototype.toString = function () {
    return this.getFullYear()
        + "-" + (this.getMonth() > 8 ? (this.getMonth() + 1) : "0" + (this.getMonth() + 1))
        + "-" + (this.getDate() > 9 ? this.getDate() : "0" + this.getDate())
        + " " + (this.getHours() > 9 ? this.getHours() : "0" + this.getHours())
        + ":" + (this.getMinutes() > 9 ? this.getMinutes() : "0" + this.getMinutes())
        + ":" + (this.getSeconds() > 9 ? this.getSeconds() : "0" + this.getSeconds());
}
$(function () {

    loadTableList()

    $('#occurrenceTime').datetimepicker({
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss',
        language: 'zh-CN',
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
    });

    $('#addEventModal').on('hidden.bs.modal', function () {
        modalClose();
    })
});

function rendererList(listData) {
    if(!listData||listData.length==0){
        return
    }
    var html = ""
    for (var i = 0; i < listData.length; i++) {
        var time = new Date(listData[i].createDatetime).toString()
        html += "<div class=\"list-item\">\n" +
            "            <div style=\"width: 13%\">" + (i + 1) + "</div>\n" +
            "            <div style=\"width: 40%;cursor: pointer\" class='specialUrl' data-group-index='" + i + "'>" + listData[i].eventName + "</div>\n" +
            "            <div style=\"width: 18%\">" + time + "</div>\n" +
            "            <div style=\"width: 25%\">\n" +
            "                <span class=\"handle-special deleteSpecial\" data-group-index='" + i + "'>删除专题</span>\n" +
            "                <span class=\"handle-special updateSpecial\" data-group-index='" + i + "'>修改专题</span>\n" +
            "            </div>\n" +
            "        </div>"
    }
    document.getElementById("specialList").innerHTML = html
    $('.deleteSpecial').click(function (event) {
        var index = this.getAttribute("data-group-index")
        deleteEvent(listData[index].eventCode)
    });
    $('.updateSpecial').click(function (event) {
        var index = this.getAttribute("data-group-index")
        toUpdate(listData[index])
    }); //http://localhost:8080/ns/uec/event/front/detail/85e3ca93db47692ef88aa5259802cc2c
    $('.specialUrl').click(function (event) {
        var index = this.getAttribute("data-group-index")
        open(ctx + "/event/front/detail/"+listData[index].eventCode)
    });
}

function modalClose() {
    $("#addEventForm")[0].reset();
    $("#eventCode").val("");
    $("#addEventModal").modal('hide');
    $("input[name='keywords']").each(function (i) {
        $(this).prop("disabled", false);
    });
    $("#classification").trigger("change");
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
    // if(""==classification||null==classification){
    //     alert("事件类型不能为空");
    //     $('#submit').attr('disabled',false);
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
                        "eventCode": eventCode,
                        "eventName": name,
                        "keywords": keywords,
                        "description": description,
                        "picPath": picPath,
                        "isSystemCreate":1,
                        "occurrenceDate": occurrenceTime,
                        // "classification": classification,
                        // "level": level
                    };
                } else {
                    param = {
                        "isSystemCreate":1,
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
                            loadTableList()
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
                "isSystemCreate":1,
                "eventCode": eventCode,
                "eventName": name,
                "keywords": keywords,
                "description": description,
                "picPath": picPath,
                "occurrenceDate": occurrenceTime,
                // "level": level
            };
        } else {
            param = {
                "isSystemCreate":1,
                "eventName": name,
                "keywords": keywords,
                "description": description,
                "picPath": picPath,
                "occurrenceDate": occurrenceTime,
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
                    loadTableList()
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
                loadTableList()
                $('body').css('overflow-y', 'auto');
            },
            error: function () {
                //请求出错处理
            }
        });
    }
}

function loadTableList() {
    var parames = {
        iDisplayLength: 100,
        isSystemCreate: 1,
    }
    table = $.ajax({
        type: "GET",
        //提交的网址
        url: ctx + '/event/front/pageUserLatestEvent',
        //参数
        data: parames,
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        async: false,
        //在请求之前调用的函数
        beforeSend: function () {
        },
        //成功返回之后调用的函数
        success: function (data) {
            data = typeof  data == 'string' ? JSON.parse(data) : data;
            var msg = "";
            if (data.result) {
                listData = data.resultObj.aaData
                rendererList(data.resultObj.aaData)
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

function toUpdate(data) {
    $("#eventCode").val(data.eventCode);
    $("#name").val(data.eventName);
    $("#description").val(data.description);
    $('#occurrenceTime').datetimepicker('setDate', new Date(parseInt(data.occurDatetime)));
    var classfis = data.classification;
    // $('#classification').val(classfis);
    // $("#level").val(data.level);
    // var otime = new Date(parseInt(data.occurDatetime + "")).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
    var keywordArray = data.keywords.split('|');
    $("input[name='keywords']").each(function (i) {
        if (null != keywordArray[i] && "" != keywordArray[i]) {
            $(this).val(keywordArray[i]);
            $(this).prop("disabled", false);
        } else {
            $(this).prop("disabled", false);
        }

    });
    $("#addEventModal").modal('show');
}
