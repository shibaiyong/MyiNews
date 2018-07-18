var websiteId = $('#websiteId').val(),
	flug = 0;
$(function(){
	
	$(".data").jeDate({
		  format:"YYYY-MM-DD hh:mm", //日期格式
		  isToday:true,
		  isinitVal:true,
	});
	
	$('section>.box').css({
		'minHeight':$('.content-wrapper').height()-50
	})
	
	//	地区
	$('.region').typeahead({
        source: function (query, process) {
            //query是输入的值
        	$.ajax({
                url: ctx+'/common/dic/front/getRegion',//这个就是请求地址对应sAjaxSource
                data:{'name':query},
                type : 'get',
                dataType : 'json',
                async : true,
                success : function(data) {
                	console.log(data);
                	
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
                			 $('.typeahead').css({
                         		'minWidth':$('.region').width()+24,
                         	})
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	console.log(item);
        	$('.region').attr('data-id',item.id).blur();
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
//	采集载体
	$('.carrier').getData({
		'ajaxUrl':ctx+'/common/dic/front/listCarrierRobot',
		'callback':function(){
			++flug;
		}
	})
//	来源机构
	$('.sources').getData({
		'ajaxUrl':ctx+'/common/dic/front/listSourceOrgRobot',
		'callback':function(){
			++flug;
		}
	})
	
//	判断是否传值来断定是修改还是新增
	if(websiteId == ''){
		
	}else{
		showData();
	}
	
	$('.sureBtn').click(function(){
		save();
	})
})

//修改-进行回显
function showData(){
	$.ajax({
        url: ctx+'/dictionary/back/editWebsite',//这个就是请求地址对应sAjaxSource
        data:{'websiteId':websiteId},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj[0];
//            	采集载体
            	if(obj.carrier != null && obj.carrier != ''){
            		$('.carrier').find('option').each(function(){
            			if($(this).val() == obj.carrier.label.labelId){
            				$(this).attr('selected','selected');
            			}
            		})
            	}
            	
//            	来源机构
            	if(obj.sourceOrg != null && obj.sourceOrg != ''){
            		$('.sources').find('option').each(function(){
            			if($(this).val() == obj.sourceOrg.label.labelId){
            				$(this).attr('selected','selected');
            			}
            		})
            	}
            	
//            	权重
            	if(obj.weight != null && obj.weight != ''){
            		$('.weight').val(obj.weight);
            	}
            	
//            	名称
            	if(obj.displayName != null && obj.displayName != ''){
            		$('.name').val(obj.displayName);
            	}
            	
//            	网址
            	if(obj.url != null && obj.url != ''){
            		$('.webUrl').val(obj.url);
            	}
            	
//            	地区
            	if(obj.regionName != null && obj.regionName != ''){
            		$('.region').val(obj.regionName).attr('data-id',obj.regionId);
            	}
            	
//            	创建日期
            	if(obj.createTime != null && obj.createTime != ''){
            			
            		var createTime = new Date(obj.createTime);
        			createTime = createTime.formatDate('yyyy-MM-dd hh:mm');
        			
        			$('.data').val(createTime);
            	}
        	}

        }
	})
}

function save(){
	var saveParam = {
			'innerid':$('#websiteId').val(),
			'weight':$('.weight').val(),
			'displayName':$('.name').val(),
			'url':$('.webUrl').val(),
			'createTime':'',
			'carrierId':$('.carrier').val(),
			'sourceOrgId':$('.sources').val(),
			'level':$('.level').val(),
			'regionId':$('.region').attr('data-id'),
	}
	if($('.data').val() != ''){
		var time = $('.data').val().replace(/-/g,'/');
		saveParam.createTime = new Date(time);
		console.log(saveParam.createTime);
	}else{
		saveParam.createTime = '';
	}
	
	if(saveParam.displayName != '' && saveParam.url != '' && saveParam.weight != '' && saveParam.createTime != ''){
		$.ajax({
	        url: ctx+'/dictionary/back/addOrUpdate',//这个就是请求地址对应sAjaxSource
	        // data:{websiteDicShow:saveParam},
	        data:saveParam,
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		$().toastmessage('showToast', {
	        	    	text: '保存成功！',
	        	   		sticky: false,
	        	        position : 'bottom-right',
	        	        type: 'success',
	        		});
	        	}else{
	        		$().toastmessage('showToast', {
	        	    	text: '保存失败！',
	        	   		sticky: false,
	        	        position : 'bottom-right',
	        	        type: 'error',
	        		});
	        	}
	        }
		})
	}else{
		if(saveParam.displayName == ''){
			$('.name').addClass('errorInp');
		}
		if(saveParam.url == ''){
			$('.webUrl').addClass('errorInp');
		}
		if(saveParam.weight == ''){
			$('.weight').addClass('errorInp');
		}
		if(saveParam.createTime == ''){
			$('.data').addClass('errorInp');
		}
		
		$().toastmessage('showToast', {
	    	text: '请将信息补充完整！',
	   		sticky: false,
	        position : 'bottom-right',
	        type: 'error',
		});
	}
	
}

(function(){
	"use strict";
	$.fn.getData = function(options){
		var defaults = {
				ajaxUrl:'',  //请求路径
				callback:''
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
		$.ajax({
	        url: options.ajaxUrl,//这个就是请求地址对应sAjaxSource
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		var obj = data.resultObj,
		    			content = '';
//	        		content += '<option value="">全部</option>';
		    		for(var i = 0;obj.length>i;i++){
		    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
		    		}
		    		$this.html(content);
//		    		是否加载成功
		    		$this.attr('data-show','true');
		    		if(typeof(options.callback) == 'function'){
		    			options.callback();
		    		}
	        	}
	        }
		})
	}
})(jQuery);