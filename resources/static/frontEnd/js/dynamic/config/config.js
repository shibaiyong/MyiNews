(function($){
//  获取来源、地区、分类、载体
    $.fn.getData = function(options){
        var defaults = {
            getAjaxUrl:'',//请求路径
            showAll:true, //是否显示全部字段
            level:2, //具有多级选项的属性，1 只显示一级 2 显示两级
            callback:'', //数据传回来之后，进行的操作
            againWrite:'', //直接对返回回来的值进行操作
        }

        var options = $.extend(defaults,options);
        var $this = $(this);
        $.ajax({
            url : options.getAjaxUrl,//这个就是请求地址对应sAjaxSource
            data:{level:options.level},
            type : 'get',
            dataType : 'json',
            async : true,
            success:function(data){
                console.log(data);
                if(data.result == true){
                    if(options.againWrite == ''){
                        var obj = data.resultObj;
                        var content = '',
                            contentOne = [],
                            contentTwo = [];
                        (typeof options.showAll=='Boolean')?options.showAll:options.showAll=true;
                        if(options.showAll){
                            content += '<a href="javascript:void(0)" class="listLabelAll active" value=""><span>全部</span></a>';
                        }

                        for(var i = 0;obj.length>i;i++){
                            if(obj[i].parentId == 0){
                                content += '<a href="javascript:void(0)" data-innerid="'+obj[i].innerid+'" data-value="'+i+'"><span>'+obj[i].name+'</span></a>';
                                contentOne.push({
                                    innerid:obj[i].innerid,
                                    name:obj[i].name,
                                    parentId:obj[i].parentId,
                                    dataVal:i
                                })
                            }else{
                                contentTwo.push({
                                    innerid:obj[i].innerid,
                                    name:obj[i].name,
                                    parentId:obj[i].parentId
                                })
                            }
                        }
                        $this.append(content);
//                		判读是否存在二级，并进行相应的操作
                        if(contentTwo.length > 0){
                            var contentItem = '',
                                inter = 0;
                            for(var i = 0;contentOne.length>i;i++){
                                inter = 0;
                                contentItem = '';
                                for(var j = 0;contentTwo.length>j;j++){
                                    if(contentOne[i].innerid == contentTwo[j].parentId){
                                        if(inter == 0){
                                            $this.find('a').eq(i+1).addClass('sortDown').append('<i class="fa fa-angle-left fold"></i>');
                                            contentItem += '<div class="mapSortDown sortDownContent hide" data-once="true" data-sort-item="'+contentOne[i].dataVal+'">';
                                        }
                                        contentItem += '<a href="javascript:void(0)" data-innerid="'+contentTwo[j].innerid+'" data-value-link="'+contentOne[i].dataVal+'" data-value-item="'+contentOne[i].dataVal+j+'"><span>'+contentTwo[j].name+'</span></a>'
                                        ++inter;
                                    }
                                }
                                if(inter > 0){
                                    contentItem += '</div>';
                                }
                                $this.after(contentItem);
                            }
                        }
                        $this.moveRight();
                        if(options.callback == ''){

                        }else{
                            options.callback();
                        }

                    }else{
                        options.againWrite(data);
                    }
                }
            }
        })
    };

//    将左侧选中的选项放到右侧
    $.fn.moveRight = function(options){
        var defaults = {
        }
        var options = $.extend(defaults,options);

        var $this = $(this);

        if($this.siblings('.sortDownContent').length > 0){ //判断是否存在二级,存在二级
            var count1 = 0;
            $this.find('a').each(function(){

                $(this).find('span').click(function(){//大的分类下面的各个标签加上点击事件
                    $this.children('.active');
                    var $thisA = $(this).parents('a');
                    var dataCount = $thisA.attr('data-innerid');
                    if(dataCount){
                        var fronttwoBit = dataCount.slice(0,2);
                    }
                    var itemVal1 = $thisA.clone().removeClass('active').removeClass('sortDown'),//复制被选择的各个省份标签
                        posNum1 = $this.attr('data-position'),//左侧地区分类的展示位置
                        posItemDom1 = $('.alreadyCon').find('[data-position-right="'+posNum1+'"]'),//右侧被选内容的展示
                        posItemNum1 = posItemDom1.length,
                        title1 = $this.parents('.form-group').find('label').text();//地区、分类的标题
                    itemVal1.find('i').remove();//去除向右的的箭头

                    if($thisA.hasClass('listLabelAll')){

                        if($thisA.hasClass('active')){

                        }else{
                            $thisA.addClass('active').siblings('a').removeClass('active');
                            $this.siblings('.sortDownContent').addClass('hide').find('a').removeClass('active');
                            $this.find('i').css({//将向右旋转的箭头转回零度。
                                '-o-transition': 'transform .2s linear',
                                '-moz-transition':' transform .2s linear',
                                '-webkit-transition': 'transform .2s linear',
                                '-ms-transition': 'transform .2s linear',
                                '-ms-transform': 'rotate(0deg)',
                                '-moz-transform': 'rotate(0deg)',
                                '-webkit-transform': 'rotate(0deg)',
                                'transform': 'rotate(0deg)'
                            })

                            if(posItemNum1 > 0){
                                posItemDom1.remove();
                            }
                        }

                    }else{
                        if($thisA.hasClass('active')){
                            $thisA.removeClass('active');
                            $('.threeSortDownContent').hide();//省被取消的时候，县的下拉框也被隐藏。
                            var dataCount = $thisA.attr('data-value');
                            posItemDom1.find('dd a').each(function(index){
                                var childrenTwoBit = $(this).attr('data-innerid').slice(0,2);//省被取消的时候，右侧中的市和县都删除。
                                if($(this).attr('data-value') == dataCount || childrenTwoBit == fronttwoBit){
                                    $(this).remove();
                                }
                            });

                            if($thisA.hasClass('sortDown')){//若有二级分类,一级地区取消选中时，二级分类隐藏并隐藏

                                $this.siblings('[data-sort-item="'+$thisA.attr('data-value')+'"]').find('a').each(function(){
                                    $(this).removeClass('active');
                                })
                                $this.siblings('[data-sort-item="'+$thisA.attr('data-value')+'"]').addClass('hide');
                                $thisA.find('i').css({
                                    '-o-transition': 'transform .2s linear',
                                    '-moz-transition':' transform .2s linear',
                                    '-webkit-transition': 'transform .2s linear',
                                    '-ms-transition': 'transform .2s linear',
                                    '-ms-transform': 'rotate(0deg)',
                                    '-moz-transform': 'rotate(0deg)',
                                    '-webkit-transform': 'rotate(0deg)',
                                    'transform': 'rotate(0deg)'
                                })

                                $('.alreadyCon').find('[data-position-right="'+$thisA.parents('.listLabel').attr('data-position')+'"]').find('dd a').each(function(){
                                    if($(this).attr('data-value-link') == $thisA.attr('data-value')){
                                        $(this).remove();
                                    }
                                })
                            }
                            count1 = 0;
                            var len = $this.find('a').length;
                            $this.find('a').each(function(){
                                if($(this).hasClass('active')){
                                }else{
                                    ++count1;
                                }
                            })
                            console.log(count1)

                            if(count1 == len){
                                $this.find('a.listLabelAll').addClass('active');
                                console.log($thisA.parents('.listLabel').attr('data-position'));
                                $('.alreadyCon').find('[data-position-right="'+$thisA.parents('.listLabel').attr('data-position')+'"]').remove();
                            }
                        }else{
                            $thisA.addClass('active').siblings('a.listLabelAll').removeClass('active');
                            if(posItemNum1 > 0){
                                $('.alreadyCon').find('[data-position-right="'+posNum1+'"]').find('dd').append(itemVal1);
                            }else{
                                var itemConDefault1 ='<div data-position-right="'+posNum1+'"><h6 class="red">'+title1+'</h6><span class="label contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
                                $('.alreadyCon').append(itemConDefault1);
                                $('.alreadyCon').find('[data-position-right="'+posNum1+'"]').find('dd').append(itemVal1);
                                $('[data-position-right="'+posNum1+'"]').contraryFlag();
                            }

                        }
                    }
                });

//    			给一级分类添加二级下拉效果。加点击事件 $(this)===a  在 a.each 里面
                if($(this).hasClass('sortDown')){
                    var dataPosCon = $(this).parents('.listLabel').attr('data-position');
                    var dataValCon = $(this).attr('data-value');
                    $(this).find('i').click(function(){
                        if($(this).hasClass('fold')){
                            $this.siblings('.sortDownContent').addClass('hide');
                            $this.find('i').css({
                                '-o-transition': 'transform .2s linear',
                                '-moz-transition':' transform .2s linear',
                                '-webkit-transition': 'transform .2s linear',
                                '-ms-transition': 'transform .2s linear',
                                '-ms-transform': 'rotate(0deg)',
                                '-moz-transform': 'rotate(0deg)',
                                '-webkit-transform': 'rotate(0deg)',
                                'transform': 'rotate(0deg)'
                            })
                            $this.siblings('[data-sort-item="'+$(this).parents('a').attr('data-value')+'"]').removeClass('hide');
                            $(this).css({
                                '-o-transition': 'transform .2s linear',
                                '-moz-transition':' transform .2s linear',
                                '-webkit-transition': 'transform .2s linear',
                                '-ms-transition': 'transform .2s linear',
                                '-ms-transform': 'rotate(-90deg)',
                                '-moz-transform': 'rotate(-90deg)',
                                '-webkit-transform': 'rotate(-90deg)',
                                'transform': 'rotate(-90deg)'
                            })
                            $(this).removeClass('fold');
                        }else{//这里的 $this ===== #map  $(this) ====== i
                            $this.siblings('[data-sort-item="'+$(this).parents('a').attr('data-value')+'"]').addClass('hide');
                            $(this).css({
                                '-o-transition': 'transform .2s linear',
                                '-moz-transition':' transform .2s linear',
                                '-webkit-transition': 'transform .2s linear',
                                '-ms-transition': 'transform .2s linear',
                                '-ms-transform': 'rotate(0deg)',
                                '-moz-transform': 'rotate(0deg)',
                                '-webkit-transform': 'rotate(0deg)',
                                'transform': 'rotate(0deg)'
                            })
                            $(this).addClass('fold');
                        }
                    })
                    //$(this) ====== a   $this ======= #map
                    var _$this = $(this).attr('data-value');
                    $this.siblings('[data-sort-item="'+$(this).attr('data-value')+'"]').find('a').each(function(){
                        var jishu = 0
                        $(this).click(function(){
                            jishu = 0;
                            var innerid = $(this).attr('data-innerid');
                            if($(this).hasClass('active')){
                                $(this).removeClass('active');
                                //市取消选择时，三级筛选框移除;


                                var itemContent = $(this).attr('data-value-item');
                                $('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd a').each(function(){
                                    if($(this).attr('data-value-item') == itemContent || $(this).attr('data-parentId') == innerid){//添加了一个条件，用来删除市下面的县。
                                        $(this).remove();
                                    }
                                })

                                $this.siblings('[data-sort-item="'+_$this+'"]').find('a').each(function(){
                                    if($(this).hasClass('active')){
                                        ++jishu;
                                    }
                                })
                                if(jishu>0){

                                }else{
                                    //$('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd').append('<a href="javascript:void(0)" data-value="'+_$this+'" class=""><span>经济</span></a>')
                                }

                            }else{
                                $(this).addClass('active');
                                $(this).parents('.sortDownContent').siblings('.listLabel').find('a.listLabelAll').removeClass('active');
                                //一级的地区  如：山东，当临沂选中之后山东也被选中
                                var yijiDom = $(this).parents('.sortDownContent').siblings('.listLabel').find('[data-value="'+$(this).attr('data-value-link')+'"]');
                                if(yijiDom.hasClass('active')){

                                }else{
                                    yijiDom.addClass('active');//二级选了，一级也要选中
                                }

                                var dom1 = $('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]');
                                //$(this)   =====   二级下的地区被选中。
                                var domItem = $(this).clone().removeClass('active');
                                if(dom1.length > 0){
                                    if(dom1.find('[data-value="'+dataValCon+'"]').length > 0){
                                        dom1.find('a[data-value="'+dataValCon+'"]').remove();//再存二级的地区的时候，先删除他的父级
                                        dom1.find('dd').append(domItem);
                                    }else{
                                        dom1.find('dd').append(domItem);
                                    }
                                }else{
                                    var title2 = $(this).parents('.form-group').find('label').text();
                                    var itemConDefault2 ='<div data-position-right="'+dataPosCon+'"><h6 class="red">'+title2+'</h6><span class="label contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
                                    $('.alreadyCon').append(itemConDefault2);
                                    $('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd').append(domItem);
                                    $('[data-position-right="'+dataPosCon+'"]').contraryFlag();
                                }
                            }
                        })
                    })
                }
            })
        }else{//不存在二级
            $this.find('a').each(function(index){
                $(this).click(function(){
                    var itemVal = $(this).clone().removeClass('active');
                    posNum = $this.attr('data-position');
                    posItemDom = $('.alreadyCon').find('[data-position-right="'+posNum+'"]');
                    posItemNum = posItemDom.length;
                    title = $this.parents('.form-group').find('label').text();

                    if($(this).hasClass('listLabelAll')){
                        if($(this).hasClass('active')){

                        }else{
                            $(this).addClass('active').siblings('a').removeClass('active');
                            if(posItemNum > 0){
                                posItemDom.remove();
                            }
                        }
                    }else{
                        if($(this).hasClass('active')){
                            $(this).removeClass('active');
                            var dataCount = $(this).attr('data-value');
                            posItemDom.find('dd a').each(function(index){
                                if($(this).attr('data-value') == dataCount){
                                    $(this).remove();
                                }

                            });
                            var count = 0,
                                len = $this.find('a').length;
                            $this.find('a').each(function(){
                                if($(this).hasClass('active')){
                                }else{
                                    ++count;
                                }
                            })
                            console.log(count);
                            if(count == len){
                                $this.find('a.listLabelAll').addClass('active');
                                $('.alreadyCon').find('[data-position-right="'+posNum+'"]').remove();
                            }
                        }else{
                            $(this).addClass('active').siblings('a.listLabelAll').removeClass('active');

                            if(posItemNum > 0){
                                $('.alreadyCon').find('[data-position-right="'+posNum+'"]').find('dd').append(itemVal);
                            }else{
                                var itemConDefault ='<div data-position-right="'+posNum+'"><h6 class="red">'+title+'</h6><span class="label  contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
                                $('.alreadyCon').append(itemConDefault);
                                $('.alreadyCon').find('[data-position-right="'+posNum+'"]').find('dd').append(itemVal);
                                $('[data-position-right="'+posNum+'"]').contraryFlag();
                            }
                        }
                    }
                });
            })
        }
    };

    //获取全部已选中的县，回显;






    //给市下面的县添加点击事件
    $(document).on('click','.sortDownContent a',function(){
        var $this = $(this);
        var city = $(this).attr('data-innerid');
        var url = ctx+'/config/front/findCountyByCity';
        var options = {
            data: {
                city: city
            },
            callback: processFun,
            ele: $this
        }

        if($('.threeSortDownContent').attr('data-parentinnerid') == city){
            if(!$(this).hasClass('active')){
                $('.threeSortDownContent a').removeClass('active');
                $('.threeSortDownContent').remove();
            }
            return false;
        }else{
            $('.threeSortDownContent').remove();
            if($(this).hasClass('active')){
                ajaxMethod(url,'get',options)
            }
        }
    })

    function ajaxMethod(url, type, options){
        $.ajax({
            url:url,
            type:type,
            data:options.data,
            dataType:'json',
            async:false,//同步;
            success:function( res ){
                if(options.callback){
                    if(options.ele){
                        options.callback(res,options.ele);
                    }else{
                        options.callback(res);
                    }
                }else{
                    return;
                }
            }
        })
    }

    function processFun( res , ele ){
        var contentA = '';
        var data = res.resultObj;
        if(!data.length){
            return false;
        }
        var parentId = data[0].parentId;

        for(var i = 0; i < data.length; i++){
            contentA += '<a href = "javascript:;" data-innerid="'+data[i].innerid+'" data-parentId="'+data[i].parentId+'"><span>'+data[i].name+'</span></a>'
        }
        var threeContent = '<div class="mapSortDown threeSortDownContent" data-once="true" data-parentinnerid="'+parentId+'">'+ contentA + '</div>';

        $('.region .col-sm-10').append( threeContent );

        //将左侧选中的地区添加到右侧。当市被删除时，右侧下面的县也被删除的逻辑在上面。当省被删除时，下面的市和县都被删除包括选中的效果。
        $('.threeSortDownContent a').click(function () {
            var parentId = $(this).attr('data-parentId');
            var innerId = $(this).attr('data-innerid');
            var cloneEle = $(this).clone();
            var len = $('[data-position-right="8"]').length;
            var lens = $('[data-position-right="8"] dd a' ).length;
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $('.alreadyCon').find('[data-position-right="8"]').find('dd a').each(function(){
                    var data_innerId = $(this).attr('data-innerid');
                    if(data_innerId == innerId){
                        $(this).remove();
                    }
                })
            }else{
                $(this).addClass('active');
                if(len ){
                    if(lens){
                        $('.alreadyCon').find('[data-position-right="8"]').find('dd a').each(function(){
                            var data_innerId = $(this).attr('data-innerid');
                            if(data_innerId == parentId){
                                $(this).remove();
                                $('.alreadyCon').find('[data-position-right="8"]').find('dd').append(cloneEle);
                            }else{
                                $('.alreadyCon').find('[data-position-right="8"]').find('dd').append(cloneEle);
                            }
                        })
                    }else{
                        $('.alreadyCon').find('[data-position-right="8"]').find('dd').append(cloneEle);
                    }

                }else{
                    var itemConDefault ='<div data-position-right="8"><h6 class="red">'+title+'</h6><span class="label  contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
                    $('.alreadyCon').append(itemConDefault);
                    $('.alreadyCon').find('[data-position-right="8"]').find('dd').append(cloneEle);
                    $('[data-position-right="8"]').contraryFlag();
                }
            }
        })
        //三级县  回显数据
        var localCountry=JSON.parse(localStorage.smallCountry);
        $('.threeSortDownContent a').each(function(){
            var innerid = $(this).attr('data-innerid');
            if(!localCountry.length){
                return false;
            }
            for(var i= 0; i < localCountry.length; i++){
                if(innerid == localCountry[i].innerid){
                    $(this).click();
                    localCountry.splice(i,1);
                    localStorage.smallCountry = JSON.stringify(localCountry);
                    i--;
                }
            }
        })
    }

    //点击右侧的已选好的省、市、县。

    $(document).on('click','[data-position-right="8"] dd a',function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active')
        }else{
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    })

    //    反选
    $.fn.contraryFlag = function(options){
        var defaults = {
        }
        var options = $.extend(defaults,options);

        $(this).find('.contraryFlag').click(function(){
            var _$this = $(this);
            if(_$this.hasClass('active')){
                _$this.removeClass('active');
                _$this.attr('data-flag','0');
            }else{
                _$this.addClass('active');
                _$this.attr('data-flag','1');
            }
        })
    }
})(jQuery);

window.onload=function(){
    // $('.alreadyCon').on('DOMNodeInserted',function(){
    //     var len = $('[data-position-right="8"]').length;
    //     if( len ){
    //         if(flagClick == 1){
                setTimeout(function(){
                    $('[data-position-right="8"] dd a').each(function () {
                       if($(this).attr('data-innerid') == localStorage.selcetedXian){
                           $(this).click();
                       }
                    });
                },3500)
        //     }
        // }

}

var PARAM = [];//导航保存的参数
$(function(){

//	导航内容实现
    $().showHeader();
    $('.myConfig').addClass('active');
    $(".myConfig").find('a').attr("href", "#").css({
        'cursor': 'default'
    });
    $(".myConfig").find('a').find('i').attr('data-toggle', '');

    var jzjishu = 0;
//inews2.1的功能调整。去掉了来源和载体的筛选。
//	来源
//     $('#source').getData({
//         getAjaxUrl: ctx + '/common/dic/front/listSourceOrgOnly',//请求路径
//         callback: function () {
//             ++jzjishu;
//         }
//     })
//	载体
//     $('#carrier').getData({
//         getAjaxUrl: ctx + '/common/dic/front/listcarrier',//请求路径
//         callback: function () {
//             ++jzjishu;
//         }
//     })
//	分类
    $('#classification').getData({
        getAjaxUrl: ctx + '/common/dic/front/listNewsClassification',//请求路径
        level:1,
        callback: function () {
            ++jzjishu;
        }
    })
//	地区
    $('#map').getData({
        getAjaxUrl: ctx + '/common/dic/front/listRegion',//请求路径
        level:2,
        callback: function () {
            ++jzjishu;
        }
    })
    //县的回显
    getselectcounty();
    var timer = setInterval(text,100);

    function text(){
        if(jzjishu == 2){
//			标签进行回显
            labelBack();
            clearInterval(timer);
        }
    }
//	标签保存
    saveLabel();

//  标签恢复默认值
    $(".reset").click(function(){
        $("#source").find('span').first().click();
        $("#classification").find('span').first().click();
        $("#map").find('span').first().click();
        $("#carrier").find('span').first().click();
    });

//  导航内容回显
    navBack();

//    导航保存
    saveNav();

//    模态框点击事件
    modelEvent();

//    导航重置
    resetNav();
    //县级标签回显


});
// useCon();
//标签--栏目
/**
 * desc：标签数据回显
 * author：xlyang
 */


function getselectcounty(){
    var url = ctx+'/config/front/listUserRegionCounty';
    var options = {
        data: {},
        callback: processCountry
    }

    ajaxMethod1(url,'get',options)
}
function processCountry(res){
    console.log(res);
    var data = res.resultObj;
    var contentA = '';
    if(res.resultObj && res.resultObj.length){
        // for(var i = 0; i < data.length; i++){
        //     contentA += '<a href = "javascript:;" data-innerid="'+data[i].innerid+'" data-parentId="'+data[i].parentId+'"><span>'+data[i].name+'</span></a>'
        // }
        // setTimeout(function(){
        //     $('[data-position-right="8"]').find('.listLabel dd').append(contentA);
        // },1000)
        localStorage.smallCountry = JSON.stringify(data);
    }else{
        var empty = [];
        localStorage.smallCountry = JSON.stringify(empty);
    }


}

function ajaxMethod1(url, type, options){
    $.ajax({
        url:url,
        type:type,
        data:options.data,
        dataType:'json',
        success:function( res ){
            if(options.callback){
                if(options.ele){
                    options.callback(res,options.ele);
                }else{
                    options.callback(res);
                }
            }else{
                return;
            }
        }
    })
}


var Uname,Uemail,Umobile;
function labelBack(){
    $.ajax({
        url : ctx+'/config/front/getUserConfigTags',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data){
            console.log(data);
            if(data.result){
                var obj = data.resultObj;
//        		地域
                var region = obj.region;
                if(region != null){
                    region = region.split(',');
                    //存取默认选中的县
                    localStorage.selcetedXian = region[0];
                    for(var count1 = 0;region.length>count1;count1++){
                        if(region[count1] != ''){
                            $('#map').find('a').each(function(){
                                if($(this).attr('data-innerid') == region[count1]){
                                    $(this).find('span').click();
                                }
                            })
//            				先将二级页打开，否则查询不到
                            var jishu1 = 0;
                            $('#map').siblings('.sortDownContent').each(function(){
                                $(this).removeClass('hide');
                                $(this).find('a').each(function(){
                                    var localCountry = JSON.parse(localStorage.smallCountry);
                                    //这个循环极其耗费时间
                                    for(var i= 0; i < localCountry.length; i++){
                                        if($(this).attr('data-innerid') == localCountry[i].parentId){
                                            $(this).click();
                                            $(this).addClass('active');
                                            break;
                                        }

                                    }
                                    if($(this).attr('data-innerid') == region[count1]){
                                        $(this).click();
                                        ++jishu1;
                                        $('.threeSortDownContent').remove();
                                    }
                                })
                                $('.threeSortDownContent').remove();
                                $(this).addClass('hide');
                            })
                        }
                    }
                    if(obj.regionFlag == '1'){
                        $('[data-position-right="8"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.regionFlag);
                    }else{
                        $('[data-position-right="8"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.regionFlag);
                    }
                }

//        		来源
                var source = obj.source;
                if(source != null){
                    source = source.split(',');
                    for(var j = 0;source.length>j;j++){
                        if(source[j] != ''){
                            $('#source').find('a').each(function(){
                                if($(this).attr('data-innerid') == source[j]){
                                    $(this).click();
                                }
                            })
                        }
                    }
                    if(obj.sourceFlag == '1'){
                        $('[data-position-right="6"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.sourceFlag);
                    }else{
                        $('[data-position-right="6"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.sourceFlag);
                    }
                }
//        		载体
                var carrier = obj.carrier;
                if(carrier != null){
                    carrier = carrier.split(',');
                    for(var j = 0;carrier.length>j;j++){
                        if(carrier[j] != ''){
                            $('#carrier').find('a').each(function(){
                                if($(this).attr('data-innerid') == carrier[j]){
                                    $(this).click();
                                }
                            })
                        }
                    }
                    if(obj.carrierFlag == '1'){
                        $('[data-position-right="10"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.carrierFlag);
                    }else{
                        $('[data-position-right="10"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.carrierFlag);
                    }
                }

//        		分类
                var classification = obj.classification;
                if(classification != null){
                    classification = classification.split(',');
                    for(var count = 0;classification.length>count;count++){
                        if(classification[count] != ''){
                            $('#classification').find('a').each(function(){
                                if($(this).attr('data-innerid') == classification[count]){
                                    $(this).find('span').click();
                                }
                            })
//            				先将二级页打开，否则查询不到
                            var jishu = 0;
                            $('#classification').siblings('.sortDownContent').each(function(){
                                $(this).removeClass('hide');
                                $(this).find('a').each(function(){
                                    if($(this).attr('data-innerid') == classification[count]){
                                        $(this).click();
                                        ++jishu;
                                    }
                                })
                                $(this).addClass('hide');

                            })
                        }
                    }
                    if(obj.classifyFlag == '1'){
                        $('[data-position-right="7"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.classifyFlag);
                    }else{
                        $('[data-position-right="7"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.classifyFlag);
                    }
                }
            }
        }
    })
}
// function useCon(){
//     $.ajax({
//         url : ctx+'/ns/user/front/getUser',//这个就是请求地址对应sAjaxSource
//         type : 'get',
//         dataType : 'json',
//         async : true,
//         success : function(data) {
//             console.log('hahahah')
//             console.log(data);
//             if(data.result) {
//                 var obj = data.resultObj;
//                 Uname=obj.name;
//                 Umobile=obj.mobilePhone;
//                 Uemail = obj.email;
//             }
//         }
//     })
// }
/**
 * desc:标签保存
 * author：xlyang
 */
function saveLabel(){
    //	标签保存
    var flagTip = 1;
    $('.conserve').click(function(){
//    	请求保存的参数
        var param = {
            region:'',
            source:'',
            carrier:'',
            classification:'',
            classifyFlag:'0',
            sourceFlag:'0',
            regionFlag:'0',
            carrierFlag:'0'
        }
        var $alreadyCon = $('.alreadyCon');
        var regionLen = $alreadyCon.find('[data-position-right="8"] dd a').length;
        var classificationLen = $alreadyCon.find('[data-position-right="7"] dd a').length;
//		地区
        if(regionLen > 0 && regionLen <= 20){
            var selectedBtn = '';
            $alreadyCon.find('[data-position-right="8"]').find('dd a').each(function(){
                if($(this).hasClass('active')){
                    flagTip = 0;
                    selectedBtn = $(this).attr('data-innerid');
                }else{
                    param.region += $(this).attr('data-innerid') + ',';
                }
            })
            param.region = selectedBtn + ',' + param.region;
            // param.regionFlag = $alreadyCon.find('[data-position-right="8"]').find('.contraryFlag').attr('data-flag');
        }else if(regionLen > 20){
            setModalContent('选择的地区数量,最大不能超过20个','确定');
            return false;
        }
        //		来源
        // if($alreadyCon.find('[data-position-right="6"]').length > 0){
        //     $alreadyCon.find('[data-position-right="6"]').find('dd a').each(function(){
        //         param.source += $(this).attr('data-innerid') + ',';
        //     })
        //     param.sourceFlag = $alreadyCon.find('[data-position-right="6"]').find('.contraryFlag').attr('data-flag');
        // }
//		载体
//         if($alreadyCon.find('[data-position-right="10"]').length > 0){
//             $alreadyCon.find('[data-position-right="10"]').find('dd a').each(function(){
//                 param.carrier += $(this).attr('data-innerid') + ',';
//             })
//             param.carrierFlag = $alreadyCon.find('[data-position-right="10"]').find('.contraryFlag').attr('data-flag');
//         }

//		分类
        if(classificationLen > 0 && classificationLen <= 5){
            $alreadyCon.find('[data-position-right="7"]').find('dd a').each(function(){
                param.classification += $(this).attr('data-innerid') + ',';
            })
            param.classifyFlag = $alreadyCon.find('[data-position-right="7"]').find('.contraryFlag').attr('data-flag');
        }else if(classificationLen > 5){
            setModalContent('选择的分类数量,最大不能超过5个','确定')
            return false;
        }
        var region=param.region.slice(0,param.region.length-1);
        var source=param.source.slice(0,param.source.length-1);
        var carrier=param.carrier.slice(0,param.carrier.length-1);
        var classification = param.classification.slice(0,param.classification.length-1);
        if(flagTip){
            if(!$('.region .listLabelAll').hasClass('active')) {
                setModalContent('请在已定制条件中选择默认地区', '确定');
                return false;
            }
        }
        console.log(region);
        // $.ajax({
        //     url:ctx+'/user/front/update',
        //     type:'post',
        //     dataType:'json',
        //     async:false,
        //     data:{
        //         'name':Uname,
        //         'email':Uemail,
        //         'mobilePhone':Umobile,
        //         'regions':region,
        //         'sourceOrgs':source,
        //         'carriers':carrier,
        //         'classifications':classification
        //     },
        //     success:function(res){
        //         console.log(res);
        //     }
        // })
        console.log(param)
        $.ajax({
            url : ctx+'/config/front/updateUserTags',//这个就是请求地址对应sAjaxSource
            data:param,
            type : 'get',
            dataType : 'json',
            async:false,
            success : function(data){
                console.log(data);
                if (data.result == true){
                    $().toastmessage('showToast', {
                        text: '标签保存成功！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'success',
                    });
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                }else{
                    $().toastmessage('showToast', {
                        text: '标签保存失败！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error',
                    });
                }
            }
        })
    })
}

//导航
/**
 * desc:导航修改回显,并进行导航栏目的初始化
 * author：xlyang
 */
//导航内容回显
function navBack(){
    $.ajax({
        url : ctx+'/config/front/listUserNav',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
            console.log(data)
            if(data.result){
                var obj = data.resultObj;
                var content = '';
                var precontent= '';
                // 进行数据过滤，将热点排行过滤掉(暂无移除此频道)
                obj = obj.filter(function (item, index) {
                    return item.paramName != 'nav.hot';
                });
//        		预览回显
                for(var i = 0;i<obj.length;i++){
                    if(obj[i].status == '0'){//0:选中状态
                        precontent += '<li class="item item'+(i+1)+'" data-index="'+i+'"><a href="javascript:;">'+obj[i].displayName+'</a></li>';
                    }else{
                        precontent += '<li class="item item'+(i+1)+'" style="display:none" data-index="'+i+'"><a href="javascript:;">'+obj[i].displayName+'</a></li>';
                    }
                }

                $('.preCon').html(precontent);

//        		栏目修改回显
                for(var i = 0;i<obj.length;i++){
                    if(obj[i].status == '0'){//0:选中状态
                        content += '<div class="item item'+(i+1)+'" data-index="'+i+'" data-paramname="'+obj[i].paramName+'" data-value="'+obj[i].value+'" data-displayname="'+obj[i].displayName+'"><div class="checkbox"><label class="active"><input type="checkbox" checked class="active" value="'+obj[i].displayName+'"/><span>'+obj[i].displayName+'</span></label></div></div>';
                    }else{
                        content += '<div class="item item'+(i+1)+'" data-index="'+i+'" data-paramname="'+obj[i].paramName+'" data-value="'+obj[i].value+'" data-displayname="'+obj[i].displayName+'"><div class="checkbox"><label><input type="checkbox" value="'+obj[i].displayName+'"/><span>'+obj[i].displayName+'</span></label></div></div>';
                    }
                }
                $('.configPage').html(content);


//        	    导航拖动初始化、对导航栏目位置，名称进项修改
                editNav();
            }
        }
    })
}

/**
 * desc:导航拖动初始化、修改导航栏目位置、修改栏目名称
 */
function editNav() {

//  导航栏目拖动初始化
    var dragTitle=$('.configPage').dad({
        'placeholder':'ok',
        'callback':function(obj){
//        	console.log(obj.attr('data-dad-position'));
            var index = obj.attr('data-index');
            var pos = obj.attr('data-dad-position');

            if(pos == 1){
                $('.preCon').prepend($('.preCon').find('li[data-index="'+index+'"]'));
            }else{
                var prev = $('.configPage').find('div[data-index="'+index+'"]').prev().attr('data-index');
                $('.preCon').find('li[data-index="'+prev+'"]').after($('.preCon').find('li[data-index="'+index+'"]'));
            }
        }
    });
    dragTitle.deactivate();

//  修改栏目位置
    $(".moveTitle").click(function(){
        if($('.modifyTitle').hasClass('active')){
            $('.modifyTitle').click();
        }

        if($(this).hasClass('active')){
            dragTitle.deactivate();
            $(this).removeClass('active');
//    		$(this).text('修改栏目位置');

            $('.configPage').find('.item').each(function(){
                $(this).find('input[type="checkbox"]').removeClass('hide');
                $(this).find('label').css({
                    'paddingLeft':'20px'
                });
                if($(this).find('label').hasClass('active')){
                    $(this).find('span').removeClass('dragOn');
                }else{
                    $(this).find('span').removeClass('dragOff');
                }
            })
        }else{
            $(this).addClass('active');
            dragTitle.activate();
//    		$(this).text('保存栏目位置');

            $('.configPage').find('.item').each(function(){
                $(this).find('input[type="checkbox"]').addClass('hide');
                $(this).find('label').css({
                    'paddingLeft':'0'
                });
                if($(this).find('label').hasClass('active')){
                    $(this).find('span').addClass('dragOn');
                }else{
                    $(this).find('span').addClass('dragOff');
                }
            })
        }


    });

//  修改栏目名称
    $(".modifyTitle").click(function(){
        if($('.moveTitle').hasClass('active')){
            $('.moveTitle').click();
        }

        if($(this).hasClass('active')){
            var num = 0;
            $("input[type='checkbox']").each(function(){
                var val = $(this).siblings('input').val();
                if(val == ''){
                    ++num;
                }
            })
            if(num>0){
                $('#saveTipModal').modal('show');
            }else{
                $("input[type='checkbox']").each(function(){
                    var name = $(this).siblings('input').val();
                    $(this).siblings('input').remove();
                    $(this).val(name).siblings('span').removeClass('hide').text(name);
                    $(this).parents('.item').attr('data-displayname',name);

//                    将修改的栏目内容进行预览
                    var pos = $(this).parents('div.item').attr('data-index');
                    $('.preCon').find('li[data-index="'+pos+'"]').find('a').text(name);


                });
                $(this).removeClass('active');
            }

//            $(this).text('修改栏目名称');
        }else{
            $("input[type='checkbox']").each(function(){
                var txt=$(this).val();
                $(this).siblings('span').addClass('hide');
                if($(this).hasClass('active')){
                    $(this).after('<input type="text" class="modTitle form-control" value='+txt+'>');
                }else{
                    $(this).after('<input type="text" class="modTitle form-control" value='+txt+'  disabled>');
                }

            });
            $(this).addClass('active');
//            $(this).text('保存栏目名称');
        }
    });

//    去除当前模块
    $('.item').each(function(){
        $(this).find('input[type="checkbox"]').click(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active').removeAttr('checked').parents('label').removeClass('active');
                $(this).next().attr('disabled','disabled');

                var pre =$(this).parents('div.item').attr('data-index');
                $('.preCon').find('li[data-index='+pre+']').fadeOut();
            }else{
                $(this).attr('checked','true').addClass('active').parents('label').addClass('active');
                $(this).next().removeAttr('disabled');

                var pre =$(this).parents('div.item').attr('data-index');
                $('.preCon').find('li[data-index='+pre+']').fadeIn();
            }
            return;
        })
    })
}
/**
 * desc:将导航修改的内容进行保存
 * author：xlyang
 * @returns
 */
//    导航保存

function saveNav() {
    $('.conserveTitle').click(function(){
        var sta = false;

        if($('.moveTitle').hasClass('active')){
            $('.moveTitle').click();
        }

        if($('.modifyTitle').hasClass('active')){
            var num = 0;
            $("input[type='checkbox']").each(function(){
                var val = $(this).siblings('input').val();
                if(val == ''){
                    ++num;
                }
            })
            if(num>0){
                sta = true;
            }else{}
            $('.modifyTitle').click();
        }

        if(sta){
            return;
        }else{

            PARAM = [];
            $('.configPage').find('.item').each(function(index){

                var item = {};
                item.paramName = $(this).attr('data-paramName');
                item.displayName = $(this).attr('data-displayName');
                item.value = $(this).attr('data-value');
                item.number = index+1;

                if($(this).find('input[type="checkbox"]').hasClass('active')){
                    item.status = 0;
                }else{
                    item.status = 1;
                }



//				PARAM.push(JSON.stringify(item));
                PARAM.push(item);
            })
            console.log(PARAM);
            if(PARAM[0].paramName == 'nav.home' && PARAM[0].status == '0'){

                var navparam = [];
                for(var i=0;i<PARAM.length;i++){
                    navparam.push(JSON.stringify(PARAM[i]))
                }

                // 额外加一个排行
                var navHot = {
                    paramName: "nav.hot",
                    displayName: "热点排行",
                    value: "/hot/front/list",
                    number: 999,
                    status: 0
                };
                navparam.push(JSON.stringify(navHot));

                $.ajax({
                    url: ctx+'/config/front/updateUserNav',//这个就是请求地址对应sAjaxSource
                    data: {'navValue':navparam},
                    type: 'get',
                    async: true,
                    traditional: true,
                    success: function(data) {
                        console.log(data);
                        if(data.result){
                            $().toastmessage('showToast', {
                                text: '重置导航成功！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'success',
                            });
                            setTimeout(function(){
                                window.location.reload();
                            },1000)
                        }else{
                            $().toastmessage('showToast', {
                                text: '重置导航失败！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'error',
                            });
                        }
                    }
                })

            }else{
                $('#saveModal').modal('show');

                $('#saveModal').on('shown.bs.modal', function () {
                    var $this = $(this);
                    $('.preCon').find('li').each(function(){
                        if(typeof($(this).attr('style')) == 'undefined'){
                            $this.find('.navname').text($(this).text());
                            return false;
                        }
                    })

                })
            }
        }

    })
}

/**
 * desc:模态框点击事件,导航保存时，如果第一个模块不是首页将弹出提示
 * author：xlyang
 * @returns
 */
function modelEvent() {

    $('.delN').click(function(){
        $('#saveModal').modal('hide');
    })

    $('.delY').click(function(){

        $('#saveModal').modal('hide');
        var navparam = [];
        for(var i=0;i<PARAM.length;i++){
            navparam.push(JSON.stringify(PARAM[i]))
        }
        $.ajax({
            url: ctx+'/config/front/updateUserNav',//这个就是请求地址对应sAjaxSource
            data: {'navValue':navparam},
            type: 'get',
            async: true,
            traditional: true,
            success: function(data) {
                console.log(data);
                if(data.result){
                    $().toastmessage('showToast', {
                        text: '重置导航成功！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'success',
                    });
                    window.location.reload();
                }else{
                    $().toastmessage('showToast', {
                        text: '重置导航失败！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error',
                    });
                }
            }
        })
    })
}


/**
 * desc:恢复默认值
 * author:xlyang
 * @returns
 */
function resetNav(){
    $('.resetTitle').click(function(){

        if($('.modifyTitle').hasClass('active')){
            $('.modifyTitle').click();
        }

        if($('.moveTitle').hasClass('active')){
            $('.moveTitle').click();
        }
        $.ajax({
            url: ctx+'/config/front/resetUserNav',//这个就是请求地址对应sAjaxSource
            type: 'get',
            dataType: 'json',
            async: true,
            success: function(data) {
                console.log(data);
                if(data.result){
                    var obj = data.resultObj;
                    // 进行数据过滤，将热点排行过滤掉(暂无移除此频道)
                    obj = obj.filter(function (item, index) {
                        return item.paramName != 'nav.hot';
                    });
//	        		栏目修改设置为默认值
                    $('.configPage').find('.item').each(function(index){
                        $(this).attr('data-index',index);
                        $(this).attr('data-paramname',obj[index].paramName);
                        $(this).attr('data-value',obj[index].value);
                        $(this).attr('data-displayname',obj[index].displayName);
                        $(this).attr('data-dad-id',index+1);

                        $(this).find('input[type="checkbox"]').prop('checked',true).addClass('active').val(obj[index].displayName);

                        $(this).find('label').addClass('active')
                            .find('span').text(obj[index].displayName);
                    })

//	        		预览设置为默认值
                    var content = '';
                    for(var i = 0;i<obj.length;i++){
                        if(obj[i].status == '0'){
                            content += '<li class="item" data-index="'+i+'"><a href="javascript:;">'+obj[i].displayName+'</a></li>';
                        }else{
                            content += '<li class="item" data-index="'+i+' hide"><a href="javascript:;">'+obj[i].displayName+'</a></li>';
                        }
                    }
                    $('.preCon').html(content);

                    $().toastmessage('showToast', {
                        text: '恢复默认值成功！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'success',
                    });
                }else{
                    $().toastmessage('showToast', {
                        text: '恢复默认值失败！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error',
                    });
                }
            }
        })
    })
}

//inews2.1添加的彈窗功能

function setModalContent( content,confirm,cancel ,callback1,callback2){
    $('#deleteDialog').modal('show');
    $('#deleteDialog .modal-body p').text(content);
    $('#deleteDialog .modal-body .btn-red').text(confirm);
    $('#deleteDialog .modal-body .btn-default').text(cancel);
    $('.maxNum').click(function(){
        $(this).unbind();
        $('#deleteDialog').modal('hide');
        if(callback1){
            callback1();
        }else{
            return false;
        }
    })
}
