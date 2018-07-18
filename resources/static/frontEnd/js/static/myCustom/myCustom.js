$(function(){
    /*加载头部与尾部*/
    $('#header').loadPage('../common/header.html',1);
    $('#footer').loadPage('../common/footer.html');
    
	/*鼠标划入悬停提示*/
    $("[data-toggle='tooltip']").tooltip();

    /*线索定制-模态框*/
    $(".showThreadModal").click(function(){
    	modalShow('#threadModal', 'bounceInLeft');
    });
    $(".closeThreadModal").click(function(){
    	modalHide('#threadModal', '');
    });

    /*热点定制-模态框*/
    $(".showHotModal").click(function(){
    	modalShow('#hotModal', 'bounceInLeft');
    });
    $(".closeHotModal").click(function(){
    	modalHide('#hotModal', '');
    });

    /*事件定制-模态框*/
    $(".showEventModal").click(function(){
    	modalShow('#eventModal', 'bounceInLeft');
    });
    $(".closeEventModal").click(function(){
    	modalHide('#eventModal', '');
    });

    /*线索定制模态框-时间段*/
    timeSlice();
});


/**
 * 显示模态框方法
 * @param targetModel 模态框选择器，jquery选择器
 * @param animateName 弹出动作
 * @ callback 回调方法
 */
function modalShow(targetModel, animateName, callback){
    var animationIn = ["bounceIn","bounceInDown","bounceInLeft","bounceInRight","bounceInUp",
          "fadeIn", "fadeInDown", "fadeInLeft", "fadeInRight", "fadeOutUp",
        "fadeInDownBig", "fadeInLeftBig", "fadeOutRightBig", "fadeOutUpBig","flipInX","flipInY",
    "lightSpeedIn","rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight",
    "zoomIn","zoomInDown","zoomInLeft","zoomInRight","zoomInUp","slideInDown","slideInLeft",
    "slideInRight", "slideInUp","rollIn"];
    if(!animateName || animationIn.indexOf(animateName)==-1){
        console.log(animationIn.length);
        var intRandom =  Math.floor(Math.random()*animationIn.length);
        animateName = animationIn[intRandom];
    }
    console.log(targetModel + " " + animateName);
    $(targetModel).show().animateCss(animateName);
    //callback.call(this);
}
/**
 * 隐藏模态框方法
 * @param targetModel 模态框选择器，jquery选择器
 * @param animateName 隐藏动作
 * @ callback 回调方法
 */
function modalHide(targetModel, animateName, callback){
    var animationOut = ["bounceOut","bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp",
        "fadeOut", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "fadeOutUp",
         "fadeOutDownBig", "fadeOutLeftBig", "fadeOutRightBig", "fadeOutUpBig","flipOutX","flipOutY",
    "lightSpeedOut","rotateOut","rotateOutDownLeft","rotateOutDownRight","rotateOutUpLeft","rotateOutUpRight",
        "zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp",
        "zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp","slideOutDown","slideOutLeft",
        "slideOutRight", "slideOutUp","rollOut"];
    if(!animateName || animationOut.indexOf(animateName)==-1){
        console.log(animationOut.length);
        var intRandom =  Math.floor(Math.random()*animationOut.length);
        animateName = animationOut[intRandom];
    }
    $(targetModel).children().click(function(e){e.stopPropagation()});
    $(targetModel).animateCss(animateName);
    $(targetModel).delay(900).hide(1,function(){
        $(this).removeClass('animated ' + animateName);
    });
    //callback.call(this);
}    
function modalDataInit(info){
   	return false;
    //填充数据，对弹出模态框数据样式初始化或修改
}


/*线索定制模态框-时间段*/
function timeSlice(){
	/*模态框时间选择*/
	$('#begin_time').datetimepicker({
        format:'yyyy-mm-dd hh:ii',
        language:  'zh-CN',
        //weekStart: 1,
        //todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        //minView:2,
        forceParse: 0,
        //showMeridian: 1
    }).on("changeDate",function(ev){
        var transferdate=transferDate($("#begin_time").val());//转时间日期
        $('#end_time').datetimepicker('remove');
        $('#end_time').datetimepicker({
            format:'yyyy-mm-dd hh:ii',
            language:  'zh-CN',
            //minView:2,
            autoclose: 1,
            'startDate':transferdate
        }).on("changeDate",function(ev){
            var enddate=$("#end_time").val();
            setEndTime(enddate);
        });
    });
    $('#end_time').datetimepicker({
        format:'yyyy-mm-dd hh:ii',
        language:  'zh-CN',
        minView:2,
        autoclose: 1
    }).on("changeDate",function(ev){
        var enddate=$("#end_time").val();
        setEndTime(enddate);
    });
}