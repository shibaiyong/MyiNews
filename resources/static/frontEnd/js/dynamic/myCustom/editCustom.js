(function($){
	"use strict";
    $.fn.addKeyWords = function(options){
    	var defaults = {
    		
    	}
    	var options = $.extend(defaults,options);
    	
    	$('.addKeyword').each(function(index){
    		addAlreadyKeyWords($('#addKeyWordInput'),$('#addKeyWordInput').attr('data-position'));
			$(this).click(function(){
				var count = parseInt($(this).siblings('input').val());
				var plug = count + 2;
				var content = '<div class="form-group  has-feedback"> <input type="text" class="form-control" data-position="'+plug+'" placeholder="请输入关键词组，并以逗号隔开"/><i class="fa fa-close form-control-remove"></i></div>';
				if(count < 4){
					$('.keywordsBox').append(content);
					$(this).siblings('input').attr('value',++count);
					
					keywordsDelete($('.keywordsBox').find('.has-feedback:last'));
					
					var $this = $('.has-feedback:last').find('input');
					var dataPos = $this.attr('data-position');
					
					addAlreadyKeyWords($this,$this.attr('data-position'));
					
				}
			});
    	});
    	
    	//添加的关键词组进行删除
    	function keywordsDelete(classDom){
    		classDom.find('i.form-control-remove').click(function(){
				var count = $(this).parents('.keywordsBox').siblings().find('input').val();
				$(this).parents('.keywordsBox').siblings().find('input').val(--count);
				
//    			删除这个input输入框
				$('.alreadyCon').find('[data-position-right="'+$(this).siblings('input').attr('data-position')+'"]').remove();
				$(this).parents('.has-feedback').remove();
			})
    	};
    	
    	function addAlreadyKeyWords(inputName,dataPos){
    		inputName.change(function(){
    			var inputWord = inputName.val();
    			if(inputWord == ''){
    				$('[data-position-right="'+dataPos+'"]').remove();
    			}else{
    				
    				if($('[data-position-right="'+dataPos+'"]').length > 0){
    					$('[data-position-right="'+dataPos+'"]').find('.dictionaryWord span').text(inputWord);
    				}else{
    					if(dataPos == 1){
    						var keyWordCon = '<div data-position-right="'+dataPos+'"><h6 class="red">包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>';
    					}else{
    						var keyWordCon = '<div data-position-right="'+dataPos+'"><h6 class="red">或 包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>'
    					}
    					$('.alreadyCon').append(keyWordCon);
    				}
    			}
    		})
    	}

    };
	
//  获取来源、地区、分类
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
            success : function(data) {
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
            		}else{
            			options.againWrite(data);
            		}
            	}
            }
    	})
    };
	
})(jQuery);
$(function(){
	
//	来源
	$('#source').getData({
		getAjaxUrl:ctx+'/common/dic/front/listSourceOrg',//请求路径
	})
//	分类
	$('#classification').getData({
		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',//请求路径
	})
//	地区
	$('#map').getData({
		getAjaxUrl:ctx+'/common/dic/front/listRegion',//请求路径
	})
	
	var timeCode = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			timeCode = $(this).find('.link').attr('data-customgroup');
		}
	})
	
	$.ajax({
        url : ctx+'/custom/front/toUpdate',//这个就是请求地址对应sAjaxSource
        data:{'timeCode':timeCode},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		
//        		定制名称
        		$('#addCustomName').val(obj.name);
        		
//        		关键词
        		
        	}
        }
	})
})

