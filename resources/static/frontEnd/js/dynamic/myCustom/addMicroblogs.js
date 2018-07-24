$(function () {
//	将footer置底
    footerPutBottom();

    conserveWechat();

    getWeiboList();

})

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
                var obj = data.resultObj;
                if (obj.length > 0) {
                    var contentweibo = '<h5>已添微博</h5>';
                    for (var i = 0; i < obj.length; i++) {
                        contentweibo += '<a href="javascript:;" data-customGroup="' + obj[i].oid + '" class="sourcesBox"><span class="contentWidth" data-customGroup="' + obj[i].oid + '">' + obj[i].name + '</span><span class="blodFont" data-customGroup="' + obj[i].oid + '">&#10005;</span></a>';
                    }
                    $('.hasAddWeb').html(contentweibo);
                }
            } else {
                $().toastmessage('showToast', {
                    text: data.errorMsg,
                    sticky: false,
                    position: 'bottom-right',
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
                    position: 'bottom-right',
                    type: 'success',
                });
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
                    position: 'bottom-right',
                    type: 'error',
                });
            }
        }
    })
}

//保存
function conserveWechat() {
    $('.searchMicroblogs').click(function () {
        var oidServiceUrl = $('#oidServiceUrl').val();
        var weiboUrl = $('.microblogsNum').val();
        if (weiboUrl == '') {
            $('.numTip').html('<i class="fa fa-exclamation-circle red"></i> 请输入微博链接');
        } else {
            if (oidServiceUrl) {
                $.ajax({
                    url: oidServiceUrl,//这个就是请求地址对应sAjaxSource
                    data: {url: weiboUrl},
                    type: 'get',
                    dataType: 'json',
                    async: true,
                    success: function (data) {
                        data = typeof data == "string" ? JSON.parse(data) : data
                        if (data.success) {
                            addMicroblog(weiboUrl, data.oid, data.name)
                        } else {
                            addMicroblog(weiboUrl)
                        }
                    },
                    error: function (err) {
                        addMicroblog(weiboUrl)
                    }
                })
            } else {
                addMicroblog(weiboUrl)
            }
        }
    })
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
            console.log(data);
            $('.numTip').html('');
            if (data.result) {
                var obj = data.resultObj;
                $().toastmessage('showToast', {
                    text: '添加微博账号成功！',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success',
                });

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
                    position: 'bottom-right',
                    type: 'error',
                });
            }
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
console.log(localstoredata)
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
    })
}

