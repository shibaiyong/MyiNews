
//全局变量
var deleteId = ""
var ctx = $('#context').val();
var hotEventCode = '';
var imgSrc = '';
//页面dom绘制完成
$(function(){

    //获取页面要展示的数据
    getHotEventList();
    //点击编辑
    $(document).on('click', '.edit ', function () {
        hotEventCode = $(this).find('.eventTrack').attr('eventCode');
        //获取回显的数据
        getReturnData( hotEventCode );
        $('#edit').modal('show');
    })

    //删除
    $(document).on('click', '.delete', function () {
        hotEventCode = $(this).find('.eventTrack').attr('eventCode');
        setModalContent( '', '', '',deleteHotEvent );
    })

    //上传图片

    $('#chooseimg').change(function(){
        uploadImg('#uploadimg');
    })

    //提交编辑      页面表单提交
    $('#edit .btn-primary').click(function(){
        submitData();
    })
})

/*本页面调用的一些方法*/


//添加省略号方法
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
            // after: 'a.toggle',
            wrap: 'letter'
        });
    }
}



//获取页面要展示的数据
function getHotEventList(){
    $.ajax({
        url : ctx +"/hotEvent/list",//这个就是请求地址对应sAjaxSource
        data:'',
        type : 'get',
        dataType : 'json',
        success : function(res) {
            var item = res.resultObj.data;
            var str = '';
            if(res.result && !item){
                $('.hoteventscontainer').html('');
                $().toastmessage('showToast', {
                    text: res.resultObj.message,
                    sticky: false,
                    position : 'top-center',
                    type: 'success'
                });
                return false;
            }

            for( var index = 0; index < item.length; index++ ){
                var imgSrc = '';
                var description = '暂无描述';
                //对必要的字段，非空判断
                if( !item[index].picPath ){
                    imgSrc = ctx + '/frontEnd/image/home/defaultImg.png';
                } else if( item[index].picPath.indexOf('http') != -1 ){
                    imgSrc = item[index].picPath;
                }else{
                    imgSrc = ctx + '/frontEnd/image/home/defaultImg.png';
                }

                if( item[index].description ){
                    description = item[index].description
                }
                str += '<ul>'+
                        '<li class="title"><a target="_blank" href="'+ctx+'/event/front/detail/'+item[index].eventCode+'">'+item[index].eventName+'</a></li>'+
                        '<li class="time">'+new Date(item[index].createDate).formatDate('yyyy-MM-dd hh:mm:ss')+'</li>'+
                        '<li class="showimg"><a target="_blank" href="'+ctx+'/event/front/detail/'+item[index].eventCode+'"><img src="'+imgSrc+'"></a></li>'+
                        '<li class="description"><a target="_blank" href="'+ctx+'/event/front/detail/'+item[index].eventCode+'">'+description+'</a></li>'+
                        '<li class="opt">'+
                            '<div class="edit"><button class="btn eventTrack" eventCode="'+item[index].id+'"><img src='+ctx+'/frontEnd/image/myCustomize/edit.png'+'><span>编辑</span></button></div>'+
                            '<div class="delete"><button class="btn eventTrack" eventCode="'+item[index].id+'"><img src='+ctx+'/frontEnd/image/myCustomize/delete.png'+'><span>移除</span></button></div>'+
                        '</li>'+
                        '</ul>'
            }
            $('.hoteventscontainer').html( str );

            //执行添加省略号方法
            $('.description a').each( function(index,item){
                creatDot(item, 70)
            } )
        }
    })
}

//删除方法
function deleteHotEvent(){
    $('.loading-zhe').show();
    $.ajax({
        url : ctx +"/hotEvent/remove",//这个就是请求地址对应sAjaxSource
        data:{id:hotEventCode},
        type : 'get',
        dataType : 'json',
        success : function(res) {
            if(res.result){
                $('.loading-zhe').hide();
                showSuccessToast('删除成功');
                getHotEventList();
            }else{
                $('.loading-zhe').hide();
                showErrorToast('删除失败');
            }
        },
        error:function(){
            $('.loading-zhe').hide();
            showErrorToast('删除失败');
        }
    })
}

//弹出框要回显的数据
function getReturnData( hotEventCode ){
    $.ajax({
        url : ctx +"/hotEvent/findHotEvent",//这个就是请求地址对应sAjaxSource
        data:{id:hotEventCode},
        type : 'get',
        dataType : 'json',
        async:false,
        success : function(res) {
            // console.log(res);
            if(res.result){
                $('#eventitle').val( res.resultObj.data.eventName||'' );
                $('#eventkeyword1').val( res.resultObj.data.keywords||'' );
                $('#eventdes').val( res.resultObj.data.description||'' );
                $('#eventtimeStart').val( new Date(res.resultObj.data.occurDatetime).formatDate('yyyy-MM-dd') || '');
                $('#eventtimeEnd').val( new Date(res.resultObj.data.createDate).formatDate('yyyy-MM-dd') ||'' );
            }

        }
    })

}
//上传图片
function uploadImg( id, url, data, sucssback, errback ){
    $('.loading-zhe').show();
    $(id).ajaxSubmit({
            url: ctx + "/hotEvent/uploadImage",
            dataType: "json",
        contentType : false,
        processData : false,
            success: function (res) {
                if(!res.result){
                    $('.loading-zhe').hide();
                    showErrorToast('图片上传失败');
                }
            },
            error: function (err) {
              if(err){
                  imgSrc=err.responseText
                  $('.loading-zhe').hide();
                  showSuccessToast('图片上传成功');
              }else{
                  $('.loading-zhe').hide();
                  showErrorToast('图片上传失败');
              }
            }
          });
}


//编辑后提交数据
function submitData(){
   var eventName = $('#eventitle').val();
   var description = $('#eventdes').val();
    if(eventName == ''){
        showErrorToast('标题不能为空');
        return false;

    }else if( eventName.length > 50 ){
        showErrorToast('标题过长，最长为50个字符');
        return false;
    }
    if(description == ''){
        showErrorToast('描述不能为空');
        return false;
    }else if( description.length > 100 ){
        showErrorToast('描述过长，最长为100个字符');
        return false;
    }
    $('.loading-zhe').show();
    $.ajax({
        url : ctx +"/hotEvent/update",//这个就是请求地址对应sAjaxSource
        data:{
            eventName:eventName,
            description:description,
            id:hotEventCode,
            picPath:imgSrc
        },
        type : 'get',
        dataType : 'json',
        success : function(res) {
            if(res.result){
                $('#edit').modal('hide');
                $('.loading-zhe').hide();
                showSuccessToast('修改成功');
                getHotEventList();
            }else{
                $('.loading-zhe').hide();
                showErrorToast('修改失败');

            }
        },
        error:function(){
            $('.loading-zhe').hide();
            showErrorToast('修改失败');

        }
    })
}

function setModalContent(content, confirm, cancel, callback1, callback2) {
    $('#confirmDialog').modal('show');
    $('#confirmDialog .confirm').unbind();
    $('#confirmDialog .cancel').unbind();
    $('#confirmDialog .confirm').click(function () {

        $('#confirmDialog').modal('hide');
        if (callback1) {
            callback1();
        } else {
            return false;
        }
    })

    $('#confirmDialog .cancel').click(function () {

        $('#confirmDialog').modal('hide');
        if (callback2) {
            callback2();
        } else {
            return false;
        }
    })
}

function showErrorToast( errortext ){
    var err = $().toastmessage('showToast', {
        text: errortext,
        sticky: false,
        position : 'top-center',
        type: 'error'
    });
}

function showSuccessToast( successtext ){
    var suc = $().toastmessage('showToast', {
        text: successtext,
        sticky: false,
        position : 'top-center',
        type: 'success'
    });
}