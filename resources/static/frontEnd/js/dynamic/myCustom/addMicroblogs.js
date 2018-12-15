$(function () {
//	将footer置底
    footerPutBottom();

    conserveWechat();

    getWeiboList();

})
var adding = false
var contentweibo = ""

//获取已添加微博列表
function getWeiboList() {
    $.ajax({
        url: ctx + '/custom/front/listMicroblog',//这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result) {
                contentweibo = ""
                var obj = data.resultObj;
                if (obj.length > 0) {
                    contentweibo = '<h5>已添微博</h5>';
                    for (var i = 0; i < obj.length; i++) {
                        contentweibo += '<a href="javascript:;" data-customGroup="' + obj[i].oid + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + obj[i].oid + '">' + obj[i].name + '</span><span class="blodFont" data-customGroup="' + obj[i].oid + '">&#10005;</span></a>';
                    }
                    $('.hasAddWeb').html(contentweibo);
                    // 更新微博列表
                    updateWeiboList();
                }
            } else {
                $().toastmessage('showToast', {
                    text: data.errorMsg,
                    sticky: false,
                    position: 'middle-center',
                    type: 'error',
                });
            }
        }
    })
}


//删除右侧已经添加的账号
$('.hasAddWeb').on('click', '.blodFont', function () {
    var oid = $(this).attr('data-customGroup');
    var $this = $(this).parent();
    console.log($this);
    setModalContent('是否删除这条微博记录吗？', '是', '否', function () {
        deteleWeibo(oid, $this);
    });

})

function deteleWeibo(oid, ele) {
    $.ajax({
        url: ctx + '/custom/front/deleteMicroblog',//这个就是请求地址对应sAjaxSource
        data: {oid: oid},
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.result) {
                $().toastmessage('showToast', {
                    text: '删除微博账号成功！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'success',
                });                
                // 更新微博列表
                updateWeiboList();
                $('.wechatItem').each(function () {
                    if ($(this).attr('data-oid') == oid) {
                        $(this).remove();
                    }
                })
                ele.remove();
            } else {
                $().toastmessage('showToast', {
                    text: '删除微博账号失败！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error',
                });
            }
        }
    })
}


function updateWeiboList() {
    $.ajax({
        url: ctx + '/custom/front/listMicroblog', //这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.result) {
                var obj = data.resultObj;
                var content = '';
                var contentweibo = '';
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        weibodsList.push(obj[i].oid);
                        content += "<li class='mdynews' data-innerid=" + obj[i].oid + ">" + obj[i].name + "</li>"
                        contentweibo += '<a href="javascript:;" data-customGroup="' + obj[i].oid + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + obj[i].oid + '">' + obj[i].name + '</span><span class="blodFont" data-customGroup="' + obj[i].oid + '">&#10005;</span></a>';
                    }
                    $('.link').eq(4).find("i")[0].style.visibility = "visible"
                }else{
                    $('.link').eq(4).find("i")[0].style.visibility = "hidden";
                }
                localStorage.contentWeibo = contentweibo;

                setTimeout(function () {
                    $('.submenu').eq(4)[0].innerHTML = content;
                    $('.submenu').eq(4).find('li').click(function () {
                        $('.mdynews').css('border', 'none');
                        this.style.borderLeft = '5px #f44336 solid'
                        localStorage.customgroup = '';
                        var customType = "weiBo"
                        localStorage.customType = customType;
                        var innerId = $(this).attr('data-innerid');
                        localStorage.innerId = innerId;
                        $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                    })
                }, 100)
            } else {
                $('.link').eq(3).find("i").style.visibility = "hidden"
            }
        }
    })
}
//保存
function conserveWechat() {
    if (adding) {
        return
    }
    $('.searchMicroblogs').click(function () {
        getMicroblogOid();
    })
}

function getMicroblogOid() {
    var oidServiceUrl = $('#oidServiceUrl').val().replace(/\s/g, "");
    var weiboUrl = $('.microblogsNum').val();
    if (weiboUrl == '') {
        $('.numTip').html('<i class="fa fa-exclamation-circle red"></i> 请输入微博链接');
    } else if (weiboUrl.indexOf('http://') == -1 && weiboUrl.indexOf('https://') == -1) {
        $('.numTip').html('<i class="fa fa-exclamation-circle red"></i> 链接不合法，请重新输入！');
    } else {
        adding = true
        if (oidServiceUrl) {
            $('.searchMicroblogs').css({
                backgroundColor: 'rgb(153, 153, 153)',
                borderColor: 'rgb(153, 153, 153)'
            }).off('click');
            $.ajax({
                url: oidServiceUrl, //这个就是请求地址对应sAjaxSource
                data: {
                    url: weiboUrl
                },
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    data = typeof data == "string" ? JSON.parse(data) : data;
                    if (data.success) {
                        setModalContent('是否添加微博账号“' + data.name + '”到微博定制？', '确定', '取消', function () {
                            $('.loading-zhe').show();
                            addMicroblog(weiboUrl, data.oid, data.name)
                        });
                    } else {
                        setModalContent('是否添加该微博账号到微博定制？', '确定', '取消', function () {
                            $('.loading-zhe').show();
                            addMicroblog(weiboUrl)
                        });
                    }
                },
                error: function (err) {
                    setModalContent('是否添加该微博账号到微博定制？', '确定', '取消', function () {
                        $('.loading-zhe').show();
                        addMicroblog(weiboUrl);
                    });
                }
            })
        } else {
            setModalContent('是否添加该微博账号到微博定制”？', '确定', '取消', function () {
                $('.loading-zhe').show();
                addMicroblog(weiboUrl)
            });
        }
    }
}

function addMicroblog(url, oid, name) {
    var param = {
        url: url
    }
    if (oid && name) {
        param.oid = oid
        param.name = name
    }
    $.ajax({
        url: ctx + '/custom/front/addMicroblog',//这个就是请求地址对应sAjaxSource
        data: param,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function (data) {
            $('.searchMicroblogs').css({
                backgroundColor: '#F44336',
                borderColor: '#F44336'
            });
            $('.searchMicroblogs').click(function () {
                getMicroblogOid();
            });
            if (data.result) {
                $('.loading-zhe').hide();
                adding = false;               
                // console.log(data);
                $('.numTip').html('');
                var name = data.resultObj.name
                var oid = data.resultObj.oid
                var selectweibo = localStorage.contentWeibo;
                contentweibo = '<h5>已添微博</h5>' + selectweibo;
                contentweibo += '<a href="javascript:;" data-customGroup="' + oid + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + oid + '">' + name + '</span><span class="blodFont" data-customGroup="' + oid + '">&#10005;</span></a>';
                $('.hasAddWeb').html(contentweibo);

                var content = $('.submenu').eq(4)[0].innerHTML
                content += "<li class='mdynews' data-innerid=" + oid + ">" + name + "</li>"
                $('.submenu').eq(4)[0].innerHTML = content;
                $('.submenu').eq(4).find('li').click(function () {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px #f44336 solid'
                    localStorage.customgroup = '';
                    var customType = "weiBo"
                    localStorage.customType = customType;
                    var innerId = $(this).attr('data-innerid');
                    localStorage.innerId = innerId;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                });

                var obj = data.resultObj;
                adding = false
                $().toastmessage('showToast', {
                    text: '添加微博账号成功！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'success',
                });
                // 更新微博列表
                updateWeiboList();
                $('.microblogsNum').val('');

//			        		将添加的信息放到右侧
                var content = '';
                content += '<div class="wechatItem" data-oid="' + obj.oid + '"><div><div class="wechatItemLeft">';
                content += '<div class="wechatAccount wechatItemName"><span>微博名：</span>' + obj.name + '</div></div><button type="button" class="close wechatItemBtn" data-oid="' + obj.oid + '"><span aria-hidden="true">&times;</span></button>';
                content += '</div></div>';
                $('.alreadyCon').prepend(content);

                var $dom = $('.alreadyCon').find('.wechatItem').eq(0).find('.wechatItemBtn');
//						deteleWeibo($dom,$dom.attr('data-oid'));

                $dom.click(function () {
                    $('#delModal').modal('show');
                    $('#delModal').attr('data-oid', $dom.attr('data-oid'));
                })

            } else {
                var err = data.errorMsg;
                $().toastmessage('showToast', {
                    text: err,
                    sticky: false,
                    position: 'middle-center',
                    type: 'error',
                });
                $('.loading-zhe').hide();
                adding = false;
            }
        },
        error:function(data){
            var err = data.errorMsg;
            $().toastmessage('showToast', {
                text: err,
                sticky: false,
                position: 'middle-center',
                type: 'error',
            });
            document.getElementById("loading").style.display = "none"
            adding = false;

        }
    })

}

//重置
function fnReset() {
    $('.reset').click(function () {
        $('.microblogsNum').val('');
    });
}

//获取已添加的微博列表

var localstoredata = localStorage.contentWeibo;
$('.hasAddWeb').append(localstoredata);


//封装的模态框方法
function setModalContent(content, confirm, cancel, callback1, callback2) {
    $('#deleteDialog').modal('show');
    $('#deleteDialog .modal-body p').text(content);
    $('#deleteDialog .modal-body .btn-red').text(confirm);
    $('#deleteDialog .modal-body .btn-default').text(cancel);
    $('.microblog').unbind();
    $('.microblog').click(function () {
        if (callback1) {
            callback1()
        } else {
            return false;
        }
    });
    $('.blog-cancle').unbind();
    $('.blog-cancle').click(function () {
        $('.searchMicroblogs').css({
            backgroundColor: '#F44336',
            borderColor: '#F44336'
        });
        $('.searchMicroblogs').click(function () {
             getMicroblogOid();
        });
        $('.loading-zhe').hide();
    })
}

