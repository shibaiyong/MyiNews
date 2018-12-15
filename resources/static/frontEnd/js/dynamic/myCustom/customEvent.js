var deleteId = ""
var ctx = $('#context').val();
var itemList = {}
var imgSrc = ""

function creatDot(ele, referenceHeight) {
    if ($(ele).height() <= referenceHeight) {
        $(ele).css({
            'height': '70px'
        });
    } else {
        $(ele).css({
            'height': '70px'
        });
        $(ele).dotdotdot({
            wrap: 'letter'
        });
    }
}

// $('#chooseimg').change(function () {
//     console.log('change');
//     uploadImg('#uploadimg');
// })

function uploadImg(id, url, data, sucssback, errback) {
    $('.loading-zhe').show();
    $(id).ajaxSubmit({
        url: ctx + "/hotEvent/uploadImage",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (res) {
            $('.loading-zhe').hide();
        },
        error: function (err) {
            $('.loading-zhe').hide();
            if (err) {
                imgSrc = err.responseText
                $().toastmessage('showToast', {
                    text: '图片上传成功',
                    sticky: false,
                    position: 'top-center',
                    type: 'success'
                });
            } else {
                $().toastmessage('showToast', {
                    text: '图片上传失败',
                    sticky: false,
                    position: 'top-center',
                    type: 'error'
                });
            }
        }
    });
}

$("#confirmDelete").click(function () {
    $('#confirmDialog').modal('hide');
    deleteEvent(deleteId)
})

function deleteEvent(deleteId) {
    $('.loading-zhe').show();
    if (!deleteId) {
        loadError("未知错误")
        return
    }
    var data = {eventCode: deleteId}
    $.ajax({
        type: "GET",
        //提交的网址
        url: ctx + "/eventCustom/front/delete",
        //提交的数据
        data: data,
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        async: true,
        //在请求之前调用的函数
        beforeSend: function () {
        },
        //成功返回之后调用的函数
        success: function (data) {
            try {
                data = typeof data == "string" ? JSON.parse(data) : data
                if (data.result) {
                    loadSuccess("删除成功")
                    loadList()
                } else {
                    loadError("删除失败")
                }
            } catch (error) {
                loadError("删除失败")
            }
            $('.loading-zhe').hide();
        },
        error: function () {
            loadError("删除失败")
            $('.loading-zhe').hide();
        }
    });
}

function showInput(data) {
    imgSrc = ""
    var startTime
    var endTime
    $("#chooseimg").val('');
    if (!data) {
        document.getElementById("dialogTitle").innerText = "添加事件"
        $("#eventitle").val("")
        $("#eventkeyword1").val("")
        // $("#eventkeyword2").val("")
        // $("#eventkeyword3").val("")
        $("#eventkeyword1").removeAttr("readonly")
        // $("#eventkeyword2").removeAttr("readonly")
        // $("#eventkeyword3").removeAttr("readonly")
        $("#eventdes").val("");
        var nowDate = new Date()
        var minDate = new Date(nowDate.getTime() - 1000 * 60 * 60 * 24 * 15)
        var maxDate = new Date(nowDate.getTime() + 1000 * 60 * 60 * 24 * 15)
        var month = ((nowDate.getMonth() - 2) + 12) % 12;
        var idStart = refreshDate(true)
        jeDate("#" + idStart, {
            minDate: minDate.getFullYear() + "-" + (minDate.getMonth() + 1) + "-" + minDate.getDate() + " 00:00:00",
            theme: {bgcolor: "#F44336", pnColor: "#FF6653"},
            format: "YYYY-MM-DD",
            onClose: true,
            festival: false,
            isinitVal: false,
            donefun: function (obj) {
                var timeDate = obj.date.length ? obj.date[0] : obj.date
                startTime = new Date(timeDate.YYYY, (timeDate.MM - 1), timeDate.DD, "00", "00", "00");
            }
        });
        var idEnd = refreshDate(false)
        jeDate("#" + idEnd, {
            theme: {bgcolor: "#F44336", pnColor: "#FF6653"},
            maxDate: maxDate.getFullYear() + "-" + (maxDate.getMonth() + 1) + "-" + maxDate.getDate() + " 00:00:00",
            format: "YYYY-MM-DD",
            onClose: true,
            festival: false,
            isinitVal: false,
            donefun: function (obj) {
                var timeDate = obj.date.length ? obj.date[0] : obj.date
                endTime = new Date(timeDate.YYYY, (timeDate.MM - 1), timeDate.DD, "23", "59", "59");
            }
        });
        $("#" + idStart).removeAttr("readonly")
        $("#" + idEnd).removeAttr("readonly")
    } else {
        document.getElementById("dialogTitle").innerText = "修改事件"
        startTime = new Date(data.startDatetime);
        endTime = new Date(data.endDatetime);
        $("#eventitle").val(data.eventName);
        $("#eventkeyword1").val(data.mustKeywords);
        $("#eventkeyword1").attr("readonly", "readonly")
        // $("#eventkeyword2").val(data.oneKeywords);
        // $("#eventkeyword2").attr("readonly", "readonly")
        // $("#eventkeyword3").val(data.noKeywords);
        // $("#eventkeyword3").attr("readonly", "readonly")
        $("#eventdes").val(data.description);
        var idStart = refreshDate(true)
        var idEnd = refreshDate(false)
        var start = startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + startTime.getDate();
        var end = endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate();
        $("#" + idStart).attr("readonly", "readonly")
        $("#" + idStart).attr("value", start)
        $("#" + idEnd).attr("readonly", "readonly")
        $("#" + idEnd).attr("value", end)
    }
    $('#edit').modal('show');
    $("#saveCustomEvent").unbind()
    $("#saveCustomEvent").click(function () {
        var title = $("#eventitle").val();
        var word1 = $("#eventkeyword1").val() ? $("#eventkeyword1").val() : "";
        // var word2 = $("#eventkeyword2").val() ? $("#eventkeyword2").val() : "";
        // var word3 = $("#eventkeyword3").val() ? $("#eventkeyword3").val() : "";
        var des = $("#eventdes").val();
        var fileObj = document.getElementById("chooseimg").files[0];
        if (!title) {
            loadError("标题不可为空")
            return
        }
        if (!word1) {
            loadError("关键词不能为空")
            return
        }
        if (!startTime) {
            loadError("起始时间不能为空")
            return
        }
        if (!endTime) {
            loadError("结束时间不能为空")
            return
        }
        if (title.length > 50) {
            loadError("标题过长，最长为50个字符")
            return
        }
        if (!des) {
            loadError("描述不能为空")
            return
        }
        if (des.length > 100) {
            loadError("描述过长，最长为100个字符")
            return
        }
        if(startTime.getTime()>endTime.getTime()){
            loadError("起始时间不能晚于结束时间")
            return
        }
        if (fileObj) {
            var name = fileObj.name
            var names = name.split(".")
            name = names.length && names.length < 2 ? "" : names[names.length - 1]
            if (name != "png" && name != "jpg" && name != "jpeg" && name != "bmp") {
                loadError("图片格式错误")
                return
            }
        }
        $('#edit').modal('hide');
        save({
            eventCode: data ? data.eventCode : "",
            eventName: title,
            startDatetime: startTime,
            endDatetime: endTime,
            mustKeywords: word1,
            oneKeywords: "",
            noKeywords: "",
            picPath: data ? data.picPath : "",
            description: des
        }, fileObj)
    })
}

function refreshDate(isStart) {
    var num = Math.floor(Math.random() * 100)
    var id = isStart ? "eventtime" + num + "Start" : "eventtime" + num + "End"
    var htmlStart = " <input type=\"text\" class=\"form-control jeTime je-bg-red\" id=\"" + id + "\" placeholder=\"开始时间\"/>"
    var htmlEnd = " <input type=\"text\" class=\"form-control jeTime je-bg-red\" id=\"" + id + "\" placeholder=\"结束时间\"/>"
    if (isStart) {
        document.getElementById("startTime").innerHTML = ""
        document.getElementById("startTime").innerHTML = htmlStart
    } else {
        document.getElementById("endTime").innerHTML = ""
        document.getElementById("endTime").innerHTML = htmlEnd
    }
    return id
}

function saveEvent(data) {
    $('.loading-zhe').show();
    $.ajax({
        type: "POST",
        //提交的网址
        url: ctx + "/eventCustom/front/saveOrUpdate",
        //提交的数据
        data: data,
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        async: true,
        //成功返回之后调用的函数
        success: function (data) {
            loadSuccess("保存成功")
            loadList()
            $('.loading-zhe').hide();
        },
        error: function () {
            loadError("保存失败")
            $('.loading-zhe').hide();
        }
    });
}

function save(data, fileObj) {
    $('.loading-zhe').show();
    if (fileObj) {
        var param
        if (null != data.eventCode && "" != data.eventCode) {
            param = {"eventCode": data.eventCode};
        }
        var success = false
        $.ajaxFileUpload({
            url: ctx + "/hotEvent/uploadImage",
            type: 'POST',
            secureuri: false,
            async: true,
            fileElementId: 'chooseimg',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: param,
            dataType: 'text',
            success: function (data1) {
                success = true
                $('.loading-zhe').hide();
                var picPath = data1;
                var reg = new RegExp("^" + "http");
                if (typeof picPath == "string" && reg.test(picPath)) {
                    data.picPath = picPath;
                    saveEvent(data)
                } else {
                    loadError("图片上传失败")
                }
            },
            error: function (data) {
                if (!success) {
                    $('.loading-zhe').hide();
                    loadError("图片上传失败")
                }
            }
        });
    } else {
        saveEvent(data)
    }
}


function setModalContent(content, confirm, cancel, callback1, callback2) {
    $('#deleteDialog').modal('show');
    $('#deleteDialog .modal-body p').text(content);
    $('#deleteDialog .modal-body .btn-red').text(confirm);
    $('#deleteDialog .modal-body .btn-default').text(cancel);
    $('.btn-red').click(function () {
        $(this).unbind();
        $('#deleteDialog').modal('hide');
        if (callback1) {
            callback1();
        } else {
            return false;
        }
    })
}

$(function () {
    loadList();
})

function loadSuccess(text) {
    $().toastmessage('showToast', {
        text: text,
        sticky: false,
        position: 'top-center',
        type: 'success',
    });
}

function loadError(text) {
    $().toastmessage('showToast', {
        text: text,
        sticky: false,
        position: 'top-center',
        type: 'error',
    });
}

function loadList() {
    $('.loading-zhe').show();
    document.getElementById("hoteventscontainer").innerHTML = ""
    itemList = {}
    $.ajax({
        url: ctx + "/eventCustom/front/pageUserLatestEvent",//这个就是请求地址对应sAjaxSource
        // url: "http://localhost:3000" + "/getList",//这个就是请求地址对应sAjaxSource
        type: "get",
        dataType: 'json',
        async: true,
        error: function (a, b, c) {
            loadError("加载列表失败")
            $('.loading-zhe').hide();
        },
        success: function (res) {
            $('.loading-zhe').hide();
            res = typeof res == "string" ? JSON.parse(res) : res
            if (!res.result) {
                loadError("加载列表失败")
            }
            res.resultObj.aaData.forEach(function (data) {
                var time = new Date(data.createDatetime)
                time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
                var html = " <ul>\n" +
                    "        <li class=\"title\"><a target=\"_blank\" class='jumpDetails' data-id='" + data.eventCode + "'\">" + data.eventName + "</a></li>\n" +
                    "        <li class=\"time\">" + time + "</li>\n" +
                    "        <li class=\"showimg\"><a target=\"_blank\" class='jumpDetails' data-id='" + data.eventCode + "' \"><img  \n " +
                    "                src=\"" + (data.picPath ? data.picPath : ctx + "/frontEnd/image/home/defaultImg.png") + "\"></a></li>\n" +
                    "        <li class=\"description\"><a style='word-break:break-all;' target=\"_blank\"  class='jumpDetails'data-id='" + data.eventCode + "' \">" + (data.description ? data.description : "&nbsp") + "</a>\n" +
                    "        </li>\n" +
                    "        <li class=\"opt\">\n" +
                    "            <div class=\"editEvent\" data-id='" + data.eventCode + "'>\n" +
                    "                <button class=\"btn eventTrack\"><img src=\"" + ctx + "/frontEnd/image/myCustomize/edit.png\"><span>编辑</span>\n" +
                    "                </button>\n" +
                    "            </div>\n" +
                    "            <div class=\"deleteEvent\" data-id='" + data.eventCode + "'>\n" +
                    "                <button class=\"btn eventTrack\"><img src=\"" + ctx + "/frontEnd/image/myCustomize/delete.png\"><span>移除</span>\n" +
                    "                </button>\n" +
                    "            </div>\n" +
                    "        </li>\n" +
                    "    </ul>"
                $(".hoteventscontainer").append(html)
                itemList[data.eventCode] = data
            })
            $(".jumpDetails").click(function () {
                var selectId = $(this).attr('data-id');
                jumpDetail(selectId)

            })
            $(".editEvent").click(function () {
                var selectId = $(this).attr('data-id');
                showInput(itemList[selectId])
                $('#edit').modal('show');
            })
            $(".deleteEvent").click(function () {
                deleteId = $(this).attr('data-id');
                $('#confirmDialog').modal('show');
            })
            if (res.resultObj.aaData.length < 9) {
                var html = "\n" +
                    "    <ul class=\"add-box\" style='padding: 0px'>\n" +
                    "        <li class=\"add-img\">\n" +
                    "            <img src=\"" + ctx + "/frontEnd/image/myCustomize/add.png\">\n" +
                    "        </li>\n" +
                    "        <li class=\"title\">点击按钮，添加事件</li>\n" +
                    "        <li class=\"hint\">因资源消耗较大，最多可定制9个事件</li>\n" +
                    "    </ul>"
                $(".hoteventscontainer").append(html)
                $(".add-img").click(function () {
                    showInput()
                })
            }
            $('.description a').each(function (index, item) {
                creatDot(item, 70)
            })
        }
    })
}


function jumpDetail(id) {
    $('.loading-zhe').show();
    var data = {"eventCode": id}
    $.ajax({
        type: "GET",
        //提交的网址
        url: ctx + "/eventCustom/front/checkEventNews",
        //提交的数据
        data: data,
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        async: false,
        //成功返回之后调用的函数
        success: function (data) {
            $('.loading-zhe').hide();
            if (data.resultObj) {
                window.open(ctx + "/eventCustom/front/detail/" + id)
            } else {
                loadError("没有相关结果，请重新定制")
            }
        },
        error: function () {
            loadError("分析错误，请稍后尝试")
            $('.loading-zhe').hide();
        }
    });
}
