// ctx ==== /ns/uec
getWebSourcesData(ctx+'/custom/front/listUserWebsite');
$('.addSources').typeahead({
    source: function (query, process) {
        //query是输入的值
        $.ajax({
            url: ctx+'/common/dic/front/getWebSite',//这个就是请求地址对应sAjaxSource。
            data:{'name':query},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
                if(data.result == true){
                    var sourcesData = data.resultObj;
                    if(sourcesData.length == '0'){
                        return;
                    }else{
                        var array = [];
                        for(var i = 0;sourcesData.length>i;i++){
                            var arrayItem = {
                                'id':'',
                                'name':'',
                            }
                            arrayItem.id = sourcesData[i].innerid;
                            arrayItem.name = sourcesData[i].name;
                            array.push(arrayItem);
                        }
                        process(array);
                    }
                    addTip()
                }
            }
        })
    },
    afterSelect: function (item) {
        var itemId = item.id;
        $.ajax({
            url: ctx+'/custom/front/addUserWebsite',//这个就是请求地址对应sAjaxSource
            data:{'websiteId':itemId},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
                if(data.result == true){
                    var obj = data.resultObj;
                    if(obj == 'success'){
                        $().toastmessage('showToast', {
                            //提示信息的内容
                            text: '添加来源成功！',
                            sticky: false,
                            position : 'top-center',
                            type: 'success',
                        });
                        getWebSourcesData(ctx+'/custom/front/listUserWebsite');
                        //更新网站和App列表
                        updateWebSourcesData(ctx + '/custom/front/listUserSiteByType');
                        updateAppSourcesData(ctx + '/custom/front/listUserSiteByType');
                    }else if(obj == 'fail'){
                        $().toastmessage('showToast', {
                            text: '添加来源失败！',
                            sticky: false,
                            position : 'top-center',
                            type: 'error',
                        });
                    }else if(obj == 'alreadyExist'){
                        $().toastmessage('showToast', {
                            //提示信息的内容
                            text: '已经添加过！',
                            sticky: false,
                            position : 'top-center',
                            type: 'notice',
                        });
                    }else if(obj == 'upperLimit'){
                        $().toastmessage('showToast', {
                            //提示信息的内容
                            text: '添加条数到达上限！',
                            sticky: false,
                            position : 'top-center',
                            type: 'notice'
                        });
                    }
                }
            }
        })
    },
    delay: 200,
    minLength:0,
    showHintOnFocus:true,
    autoSelect:false,
});
function getWebSourcesData(getAjaxUrl){
    $.ajax({
        url : getAjaxUrl,//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
            console.log(data);
            if(data.result == true){
                var obj = data.resultObj;
                var contentapp ='<h5>已添加APP</h5>';
                var contentweb ='<h5>已添加网站</h5>';

                for(var count = 0;obj.length>count;count++){
                    if( /app/i.test(obj[count].name)){
                        contentapp += '<a href="javascript:;" data-innerid="'+obj[count].innerid+'" class="sourcesBox"><span class="contentWidth" data-innerid="'+obj[count].innerid+'">'+obj[count].name+'</span><span class="blodFont">&#10005;</span></a>';
                    }else{
                        contentweb += '<a href="javascript:;" data-innerid="'+obj[count].innerid+'" class="sourcesBox"><span class="contentWidth" data-innerid="'+obj[count].innerid+'">'+obj[count].name+'</span><span class="blodFont">&#10005;</span></a>';
                    }
                }

                $('.hasAddWeb').html(contentweb);
                $('.hasAddApp').html(contentapp);
                //  侧边栏-来源删除的样式
                $('.blodFont').click(function(){
                    var innerid;
                    innerid = $(this).siblings('.contentWidth').attr('data-innerid');
                    $.ajax({
                        url : ctx+'/custom/front/deleteUserWebsite/'+innerid,//这个就是请求地址对应sAjaxSource
                        type : 'get',
                        dataType : 'json',
                        async : true,
                        success : function(data) {
                            if(data.result == true){
                                var obj = data.resultObj;
                                if(obj == '成功'){
                                    $().toastmessage('showToast', {
                                        //提示信息的内容
                                        text: '删除成功',
                                        //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                                        sticky: false,
                                        //显示的位置，默认为右上角
                                        position : 'top-center',
                                        //显示的状态。共notice, warning, error, success4种状态
                                        type: 'success',
                                    });
                                   //更新网站和App列表
                                   updateWebSourcesData(ctx + '/custom/front/listUserSiteByType');
                                   updateAppSourcesData(ctx + '/custom/front/listUserSiteByType');

                                    $('.sourcesBox').each(function(index){
                                        if($(this).attr('data-innerid') == innerid){
                                            $(this).remove();
                                        }
                                    })
                                }
                            }
                        }
                    });
                    return false;
                })
                //点击进行查询
                // $('.accordion').each(function(index){
                //     if(index == 1){
                //         $(this).find('li').click(function(){
                //             if($(this).hasClass('active')){
                //                 $(this).removeClass('active');
                //                 $('.changeState').addClass('activeBg');
                //             }else{
                //                 $(this).addClass('active').siblings().removeClass('active');
                //                 $('.accordion:first li').removeClass('active');
                //                 $('.changeState').removeClass('activeBg');
                //             }
                //             if($('.tableListCon').val() == 0){
                //                 threadAjaxData1.ajax.reload();
                //             }else if($('.tableListCon').val() == 1){
                //                 thumbnailTable.ajax.reload();
                //             }else if($('.tableListCon').val() == 2){
                //                 sudokuTable.ajax.reload();
                //             }
                //         })
                //     }
                // })
            }
        }
    })
}
function addTip(){

    $('.dropdown-menu .dropdown-item').mouseenter(function(){
        var title = $(this).text();
        $(this).attr('title',title);
    })
}

// 更新左侧网站列表
function updateWebSourcesData(getAjaxUrl) {
    $.ajax({
        url: getAjaxUrl, //这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        data: {
            type: 1
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result == true) {
                var obj = data.resultObj;
                var contentapp = '';
                var contentweb = '';
                for (var i = 0; obj.length > i; i++) {
                    webIdsList.push(obj[i].innerid);
                    contentweb += "<li class='mdynews' data-innerid=" + obj[i].innerid + ">" + obj[i].name + "</li>"
                }
                if (contentweb != "") {
                    $('.link').eq(1).find("i")[0].style.visibility = "visible"
                }else{
                    $('.link').eq(1).find("i")[0].style.visibility = "hidden"
                }
            }
            setTimeout(function () {
                $('.submenu').eq(1).html(contentweb);
                $('.submenu').eq(1).find('li').click(function () {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px #f44336 solid'
                    localStorage.customgroup = '';
                    var innerId = $(this).attr('data-innerid');
                    localStorage.innerId = innerId;
                    var customType = "web"
                    localStorage.customType = customType;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                })
            }, 500)
        }
    })
}
// 更新左侧app列表
function updateAppSourcesData(getAjaxUrl) {
    $.ajax({
        url: getAjaxUrl, //这个就是请求地址对应sAjaxSource
        type: 'get',
        dataType: 'json',
        data: {
            type: 4
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.result == true) {
                var obj = data.resultObj;
                var contentapp = '';
                var contentweb = '';
                for (var i = 0; obj.length > i; i++) {
                    appIdsList.push(obj[i].innerid);
                    contentapp += "<li class='mdynews' data-innerid=" + obj[i].innerid + ">" + obj[i].name + "</li>"
                }

                if (contentapp != "") {
                    $('.link').eq(2).find("i")[0].style.visibility = "visible"
                }else{
                    $('.link').eq(2).find("i")[0].style.visibility = "hidden"
                }
            }
            setTimeout(function () {

                $('.submenu').eq(2).html(contentapp);

                $('.submenu').eq(2).find('li').click(function () {
                    $('.mdynews').css('border', 'none');
                    this.style.borderLeft = '5px #f44336 solid'
                    localStorage.customgroup = '';
                    var innerId = $(this).attr('data-innerid');
                    var customType = "app"
                    localStorage.customType = customType;
                    localStorage.innerId = innerId;
                    $('#myCustomContent').loadPage(ctx + '/custom/front/gotoMyCustomThread');
                })
            }, 500)
        }
    })
}