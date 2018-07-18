$(function(){
    /*加载头部与尾部*/
    $('#header').loadPage('../common/header.html');
    $('#footer').loadPage('../common/footer.html');

	getBothSidesData();

	/*事件定制-模态框*/
    $(".Wikipedia").click(function(){
    	modalShow('#threadModal', 'bounceInLeft');
    });
    $(".closeThreadModal").click(function(){
    	modalHide('#threadModal', '');
    });

    /*摘要超出一定的长度，省略*/
    summarydotdotdot();

    $('.newsDetailText').uec_inews_picture_group_news();
    
});

function getBothSidesData(){
	var val=$('.progress_number').text();
	$('.bothSidesTit').eq(1).removeClass('bothSidesF');
	$('.bothSidesTit').eq(0).addClass('bothSidesF');
	/*if(val>50){
		$('.bothSidesTit').eq(1).removeClass('bothSidesF');
		$('.bothSidesTit').eq(0).addClass('bothSidesF');
	}else{
		$('.bothSidesTit').eq(0).removeClass('bothSidesF');
		$('.bothSidesTit').eq(1).addClass('bothSidesF');
	}*/
	$('.progress-bar-inner').css('width',val);
}


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



/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.summaryCon').height()>115){
        $('.summaryCon').css({
            'height':115,
        });
        var $summaryCon = $('.summaryCon');
            $summaryCon.append( ' <a class="toggle" href="#"><span class="open">[展开]</span><span class="close1">[收起]</span></a>' );
            function createDots()
            {
                $summaryCon.dotdotdot({
                    after: 'a.toggle',
                    wrap: 'letter'
                });
            }
            function destroyDots() {
                $summaryCon.trigger( 'destroy' );
            }
            createDots();
            $summaryCon.on(
                'click',
                'a.toggle',
                function() {
                    $summaryCon.toggleClass( 'opened' );

                    if ( $summaryCon.hasClass( 'opened' ) ) {
                        destroyDots();
                    } else {
                        createDots();
                    }
                    return false;
                }
            );
    }
    
}
function releaseBuild(id){
		  $.ajax({
		        url : ctx+"/latest/front/releaseBuild"+"?"+"innerIds="+id,//这个就是请求地址对应sAjaxSource
		        type : 'get',
		        dataType : 'json',
		        success : function(data) {
		        	if(data.result){
		        		alret("建稿成功");
		        	}else{
		        		alret("建稿失败");
		        	}
		        },
		        error : function(msg) {
		        }
		    });
}