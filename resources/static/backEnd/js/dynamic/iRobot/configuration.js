var templateId = '';
var resultCode = '';
$(function(){
	$('[data-toggle="tooltip"]').tooltip();
	
//	列表配置
	addListLabel(); //	增加列表标签
	addField(); //	新增字段

	$('.extraction').extraction({ //代码提取
		inputDom:'.extractionInp',//查询的input
		htmlDom:'.extractionHtml',//查询内容放置的内容
	});
	
	$('.collectList').getInputSearchData({ //选择列表采集模板
		'ajaxUrl':ctx+'/crawl/back/findCrawlTemplate',
		'type':'0',
		'afterSelectFun':function(item){
			showAcquisition(item.id);
			$('.saveAsFormwork').attr('data-whatever',item.name);
		}
	});
	
	$('.collectionField').each(function(){ //采集字段-所属字段
		var $this = $(this);
		$(this).getInputSearchData({
			'ajaxUrl':ctx+'/crawl/back/getFields',
			'callback':function(sourcesData,process){
				var array = [];
    			for(var i = 0;sourcesData.length>i;i++){
    				
    				var arrayItem = {
    						'id':'',
    						'name':'',
    				}
    				arrayItem.id = i;
    				arrayItem.name = sourcesData[i];
    				
    				array.push(arrayItem);
    			}
    			 process(array);
    			 $('.typeahead').css({
             		'minWidth':$this.width()+24,
             	})
			}
		})
	})
	
//	解析数据类型
	$.ajax({
        url: ctx+'/common/dic/front/getParserType',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
	    			content = '';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
	    		
	    		$('.parseDataType').html(content);
	    		$('.parserListId').change(function(){
	    			if($('.collectResultShow').hasClass('active')){
	    				editShow($('.collectResultShow'));
	    			}
	    		})
	    		$('.parserDetailId').change(function(){
	    			if($('.collectResultDetail').hasClass('active')){
	    				$('.collectResultDetail').click();
	    			}
	    		})
	        }
        }
	})
	
	
	
	$('.saveFormwork').saveFormWork({//保存
		type:0,
	});
	
	$('.generatedCode').click(function(){
		$(this).createCode({//生成代码
			'paramData':getParam(0,1,1),
			'showDom':'.formworkCodeShow'
		})
	})
	
	$().saveAsFormWork();//另存为模板
	
	rightEidtShow();
	
//详情配置
	addClear();//	新增清除内容字段
	addAlternative();//	新增备选方案
	
	$('.collectListDetail').getInputSearchData({ //选择列表采集模板
		'ajaxUrl':ctx+'/crawl/back/findCrawlTemplate',
		'type':'1',
		'afterSelectFun':function(item){
			showAcquisitionDetail(item.id);
			$('.collectListDetail').attr('data-id',item.id);
			$('.saveAsFormworkDetail').attr('data-whatever',item.name);
		}
	});
	$('.extractionDetail').extraction({ //代码提取
		inputDom:'.extractionDetailInp',//查询的input
		htmlDom:'.extractionDetailHtml',//查询内容放置的内容
	});
	
	$('.saveFormworkDetail').saveFormWork({//详情页保存
		type:1,
	});
	
	$('.generatedCodeDetail').click(function(){
		$(this).createCode({//生成代码
			'paramData':getDetailParam(1,1,1),
			'showDom':'.formworkCodeDetailShow'
		})
	})
	
	rightEidtDetailShow();
})

//	增加列表标签
function addListLabel(){
	var inter;
	$('#addListLabel').bind('click',function(){
		inter = $('#addListLabel').attr('data-count');
		var content = '<div class="form-group"><label class="col-sm-2 control-label">步骤'+inter+'</label><label  class="col-sm-2 control-label p-left p-right">列表标签</label><div class="col-sm-8"><input type="text" class="form-control tags"  placeholder="" /></div></div>';
		$('.codeRange').append(content);
		$('#addListLabel').attr('data-count',++inter);
	})
}

//新增字段
function addField(){
	var inter1;
	$('#addField').bind('click',function(){
		inter1 = $('#addField').attr('data-count');
		var content = '<div class="collectFieldItem"><div class="form-group"><label class="col-sm-2 control-label">字段'+inter1+'</label><label  class="col-sm-2 control-label p-left p-right">所属字段</label><div class="col-sm-8"><input autocomplete="off" data-provide="typeahead" type="text" class="form-control collectionField" placeholder="请输入所属字段的名称"/></div></div>';
			content += '<div class="form-group"><label class="col-sm-2 control-label"></label><label  class="col-sm-2 control-label p-left p-right">获取位置</label><div class="col-sm-8"><input type="text" class="form-control crawlPosition"  placeholder="每个选择器中间用&amp;&amp;隔开" /></div></div></div>';
		$('.collectField').append(content);
		$('#addField').attr('data-count',++inter1);
		
		$('.collectionField:last').getInputSearchData({
			'ajaxUrl':ctx+'/crawl/back/getFields',
			'callback':function(sourcesData,process){
				var array = [];
    			for(var i = 0;sourcesData.length>i;i++){
    				
    				var arrayItem = {
    						'id':'',
    						'name':'',
    				}
    				arrayItem.id = i;
    				arrayItem.name = sourcesData[i];
    				
    				array.push(arrayItem);
    			}
    			 process(array);
    			 $('.typeahead').css({
             		'minWidth':$('.collectionField:last').width()+24,
             	})
			}
		})
	})
}

//新增清除内容字段
function addClear(){
	$('#addClear').bind('click',function(){
		var content = '<div class="form-group"><input type="text" class="form-control addClearInput" placeholder="每个选择器中间用&amp;&amp;隔开"/></div>';
		
		$('.addClearContent').append(content);
	})
}

//新增备选方案
function addAlternative(){
	$('#addAlternative').bind('click',function(){
		var content = '<div class="form-group"><input type="text" class="form-control addAlternativeInput" placeholder="每个选择器中间用&amp;&amp;隔开"/></div>';
		$('.addAlternativeCon').append(content);
	})
}

//采集列表模板返回的数据展示
function showAcquisition(templateId){
	$.ajax({
        url: ctx+'/crawl/back/getCrawlTemplateCache',//这个就是请求地址对应sAjaxSource
        data:{'templateId':templateId},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
            	
//            	页面编码
            	var encoding = obj.encoding;
            	$('.encoding').find('option').each(function(){
            		if($(this).val == encoding){
            			$(this).attr('selected','selected');
            		}
            	})
            	
//            	采集位置
            	var collectionPositon = obj.collectionPositon;
            	if(collectionPositon != '' && collectionPositon != null){
            		$('.collectionPositon').val(collectionPositon);
            	}
            	
//            	列表标签
            	var tags = obj.tags;
            	var alreadylen = $('.tags').length;
            	if(tags != null && tags != '' && tags.length != 0){
            		
            		if(alreadylen < tags.length){
            			
            			var addlen = tags.length - alreadylen;
            			
            			for(var j = 0;addlen>j;j++){
                			$('#addListLabel').click();
                		}
            			
            		}else{
            			$('.tags').each(function(){
            				$(this).parents('.form-group').remove();
            			})
            			$('#addListLabel').attr('data-count','2');
            			for(var j = 0;tags.length>j;j++){
                			$('#addListLabel').click();
                		}
            			
            		}
            		for(var j = 0;tags.length>j;j++){
                		$('.tags').eq(j).val(tags[j]);
                	}	
            	}else{
            		$('.tags').each(function(){
        				$(this).parents('.form-group').remove();
        			})
        			$('#addListLabel').attr('data-count','2');
        			$('#addListLabel').click();
            	}
            	
            	
//            	采集字段
            	var collectionField = obj.collectionField;
            	
            	var alreadylen = $('.collectFieldItem').length;
            	if(collectionField != null && collectionField != '' && collectionField.length != 0){
            		
            		if(alreadylen < collectionField.length){
            			
            			var addlen = collectionField.length - alreadylen;
            			
            			for(var j = 0;addlen>j;j++){
                			$('#addField').click();
                		}
            			
            		}else{
            			$('.collectFieldItem').each(function(){
            				$(this).remove();
            			})
            			$('#addField').attr('data-count','1');
            			for(var j = 0;collectionField.length>j;j++){
                			$('#addField').click();
                		}
            			
            		}
            		for(var j = 0;collectionField.length>j;j++){
                		$('.collectionField').eq(j).val(collectionField[j].field);
                		$('.crawlPosition').eq(j).val(collectionField[j].crawlPosition);
                	}	
            	}else{
            		$('.collectFieldItem').each(function(){
        				$(this).remove();
        			})
        			$('#addField').attr('data-count','1');
            		for(var j = 0;j>3;j++){
            			$('#addField').click();
            		}
        			
            	}
        	}
        }
	})
};

//新闻详情配置
function showAcquisitionDetail(templateId){
	$.ajax({
        url: ctx+'/crawl/back/getCrawlTemplateCache',//这个就是请求地址对应sAjaxSource
        data:{'templateId':templateId},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
//        		采集位置
        		var collectionPositon = obj.collectionPositon;
            	if(collectionPositon != '' && collectionPositon != null){
            		$('.collectionPositonDetail').val(collectionPositon);
            	}
            	
//            	页面编码
            	var encoding = obj.encoding;
            	$('.encodingDetail').find('option').each(function(){
            		if($(this).val == encoding){
            			$(this).attr('selected','selected');
            		}
            	})
            	
            	var collectionField = obj.collectionField;
            	for(var i = 0;collectionField.length>i;i++){
            		var fieldName = collectionField[i].field;
            		
            		switch (fieldName)
            		{
	            		case 'title'://标题
	            			var titleContent = collectionField[i]
	            			$('.crawlPositionDetail').val(titleContent.crawlPosition);
	            			$('.defaultMsgDetail').val(titleContent.defaultMsg);
	            			if(titleContent.selectFlag){
	            				$('.titleSelectFlag').attr('checked','checked');
	            			}else{
	            				$('.titleSelectFlag').removeAttr('checked');
	            			}
	            		  	break;
	            		case 'content'://正文
	            			var content = collectionField[i];
	            			$('.mainConDetail').val(content.crawlPosition);
	            			if(content.addOptions != null && content.addOptions != '' && content.addOptions.length != 0){
	            				var alreadyLen = $('.addClearContent').find('.addClearInput').length;
	            				if(alreadyLen < content.addOptions.length){
	            					var addlen = content.addOptions.length - alreadyLen;
	            					for(var j = 0;addlen>j;j++){
		            					$('#addClear').click();
		            				}
	            				}else{
	            					var removelen = alreadyLen - content.addOptions.length;
	            					
	            					for(var j = 0;removelen>j;j++){
	            						$('.addClearContent').find('.form-group').eq(i).remove();
		            				}
	            				}
	            				
	            				$('.addClearContent').find('.addClearInput').each(function(index){
	            					var $this = $(this);
	            					$this.val(content.addOptions[index]);
	            				})
	            			}else{
	            				$('.addClearContent').html('');
	            			}
	            			
	            			break;
	            		case 'release_datetime'://发布时间
	            			var issueTime = collectionField[i];
	            			$('.issueTimeDetail').val(issueTime.crawlPosition);
	            			
	            			$('.originalTimeDetail').val(issueTime.defaultMsg);
	            			if(issueTime.selectFlag){
	            				$('.timeSelectFlag').attr('checked','checked');
	            			}else{
	            				$('.timeSelectFlag').removeAttr('checked');
	            			}
	            			
	            			break;
	            		case 'source_report'://发稿来源
	            			var sources = collectionField[i];
	            			$('.pressSourcesDetail').val(sources.crawlPosition);
	            			
	            			if(sources.addOptions != null && sources.addOptions != '' && sources.addOptions.length != 0){
	            				
	            				var alreadyLen = $('.addAlternativeCon').find('.addAlternativeInput').length;
	            				if(alreadyLen < sources.addOptions.length){
	            					var addlen = sources.addOptions.length - alreadyLen;
	            					for(var j = 0;addlen>j;j++){
	            						$('#addAlternative').click();
		            				}
	            				}else{
	            					var removelen = alreadyLen - sources.addOptions.length;
	            					
	            					for(var j = 0;removelen>j;j++){
	            						$('.addAlternativeCon').find('.form-group').eq(i).remove();
		            				}
	            				}
	            				
	            				$('.addAlternativeCon').find('.addAlternativeInput').each(function(index){
	            					var $this = $(this);
	            					$this.val(sources.addOptions[index]);
	            				})
	            			}else{
	            				$('.addAlternativeCon').html('');
	            			}
	            			
	            			break;
	            		case 'keywords'://关键词
	            			var keywords = collectionField[i];
	            			$('.keyWordsDetail').val(keywords.crawlPosition);
	            			break;
	            		case 'author'://作者
	            			var author = collectionField[i];
	            			$('.authorDetail').val(keywords.crawlPosition);
	            			break;
            		}
            	}
        	}
        }
	})
}
//新闻列表保存字段
/**
 * type:是列表还是详情 0列表  1详情
 * doType：保存还是另存为模板   1保存 2另存为模板
 * editFlag：编辑中间位置还是右侧json串  1中间  2右侧
 */
function getParam(type,doType,editFlag){
	var listParam = {
			taskId:$('#taskId').val(),
			templateId:$('.collectList').attr('data-id'),
			type:type,
			templateJson:$('.formworkCodeShow').val(),
			collectionPositon:$('.collectionPositon').val(),//采集位置
			tags:[],//列表标签
			collectionField:[],//采集字段
			encoding:$('.encoding').val(),
			editFlag:editFlag,//
			doType:doType
	}
	
	$('.tags').each(function(){
		if($(this).val() != ''){
			listParam.tags.push($(this).val());
		}
	})
	$('.collectFieldItem').each(function(){
		var $this = $(this);
		var collectionFieldItemVal = {
				"crawlPosition":$this.find('.crawlPosition').val(),
				"field":$this.find('.collectionField').val()
		}
		listParam.collectionField.push(collectionFieldItemVal);
	})
	return listParam;
}

//新闻详情保存字段
/**
 * type:是列表还是详情 0列表  1详情
 * doType：保存还是另存为模板   1保存 2另存为模板
 * editFlag：编辑中间位置还是右侧json串  1中间  2右侧
 */
function getDetailParam(type,doType,editFlag){
	var detailParam = {
			taskId:$('#taskId').val(),
			templateId:$('.collectListDetail').attr('data-id'),
			type:type,
			templateJson:$('.formworkCodeDetailShow').val(),
			collectionPositon:$('.collectionPositonDetail').val(),//采集位置
			tags:[],//列表标签
			collectionField:[],//采集字段
			encoding:$('.encodingDetail').val(),
			editFlag:editFlag,//
			doType:doType
	}
	
//	标题
	var titleDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.crawlPositionDetail').val()),
		defaultMsg:$.trim($('.defaultMsgDetail').val()),
		field:"title",
		selectFlag:$(".titleSelectFlag").get(0).checked
	}
	
	detailParam.collectionField.push(titleDetail);
	
//	正文
	var contentDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.mainConDetail').val()),
		defaultMsg:$.trim($('.defaultMsgDetail').val()),
		field:"content",
		selectFlag:$(".titleSelectFlag").get(0).checked
	}
	
	var clearDom = $('.addClearContent').find('.addClearInput');
	if(clearDom.length>0){
		clearDom.each(function(){
			var $this = $(this);
			var $thisVal = $.trim($this.val());
			if($thisVal != ''){
				contentDetail.addOptions.push($thisVal);
			}
		})
	}
	detailParam.collectionField.push(contentDetail);
	
//	发布时间
	var releaseDatetimeDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.issueTimeDetail').val()),
		defaultMsg:$.trim($('.originalTimeDetail').val()),
		field:"release_datetime",
		selectFlag:$(".timeSelectFlag").get(0).checked
	}
	detailParam.collectionField.push(releaseDatetimeDetail);
	
//	发稿来源
	var sourceReportDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.pressSourcesDetail').val()),
		defaultMsg:$.trim($('.pressSourcesDefault').val()),
		field:"source_report",
		selectFlag:false
	}
	
	var addDom = $('.addAlternativeCon').find('.addAlternativeInput');
	if(addDom.length>0){
		addDom.each(function(){
			var $this = $(this);
			var $thisVal = $.trim($this.val());
			if($thisVal != ''){
				sourceReportDetail.addOptions.push($thisVal);
			}
		})
	}
	detailParam.collectionField.push(sourceReportDetail);
	
//	关键词
	var sourceReportDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.keyWordsDetail').val()),
		defaultMsg:'',
		field:"keywords",
		selectFlag:false
	}
	detailParam.collectionField.push(sourceReportDetail);
	
//	作者
	var sourceReportDetail = {
		addOptions:[],
		crawlPosition:$.trim($('.authorDetail').val()),
		defaultMsg:'',
		field:"author",
		selectFlag:false
	}
	detailParam.collectionField.push(sourceReportDetail);
	
	return detailParam;
}

//编辑采集模板代码与采集效果测试-列表
function rightEidtShow(){
	$('.rightEidtList').find('button').each(function(index){
		$(this).click(function(){
			var $this = $(this);
			
			if($(this).hasClass('editFormwork')){
//				编辑查看采集模板代码
				if($('.formworkCodeShow').val() != ''){
					
					$this.addClass('active').siblings().removeClass('active');
					
					$('.editFormworkCon').removeClass('hide');
					$('.collectResultShowCon').addClass('hide');
					var textBox = $('.editFormworkCon').find('.formworkCodeShow');
					textBox.removeAttr('disabled');
					$('.formworkConfiguration').addClass('notEdit');
					$('.formworkConfiguration').find('form input').attr('disabled','disabled');
					$('.formworkConfiguration').find('form select').attr('disabled','disabled');
					$('#addListLabel').unbind('click');
					$('#addField').unbind('click');
				}
				
			}else{
				editShow($this);
			}
				
		})
		
	})
}

//编辑采集模板代码与采集效果测试-详情
function rightEidtDetailShow(){
	$('.rightEidtDetail').find('button').each(function(index){
		$(this).click(function(){
			var $this = $(this);
			
			if($(this).hasClass('editFormworkDetail')){
//				编辑查看采集模板代码
				if($('.formworkCodeDetailShow').val() != ''){
					
					$this.addClass('active').siblings().removeClass('active');
					
					$('.editFormworkConDetail').removeClass('hide');
					$('.collectResultConDetail').addClass('hide');
					var textBox = $('.editFormworkConDetail').find('.formworkCodeDetailShow');
					textBox.removeAttr('disabled');
					$('.detailConfiguration').addClass('notEdit');
					$('.detailConfiguration').find('form input').attr('disabled','disabled');
					$('.detailConfiguration').find('form select').attr('disabled','disabled');
					$('#addClear').unbind('click');
					$('#addAlternative').unbind('click');
				}
				
			}else{
				var baseUrl = $('.extractionDetailInp').val();
				var templateJson = $('.formworkCodeDetailShow').val();
				var parserId = $('.parserDetailId').val();
				if(baseUrl != '' && templateJson != ''){
					
					$('.editFormworkConDetail').addClass('hide');
					$('.collectResultConDetail').removeClass('hide');
					
					var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
					$this.css({
						'borderColor':'#f1f1f1'
					}).append(loading);
					$this.addClass('active').siblings().removeClass('active');
					
					$.ajax({
				        url: ctx+'/crawl/back/templateCheck',//这个就是请求地址对应sAjaxSource
				        data:{baseUrl:baseUrl,templateJson:templateJson,parserId:parserId},
				        type : 'get',
				        dataType : 'json',
				        async : true,
				        success : function(data) {
				        	console.log(data);
				        	$this.removeAttr('style').find('.loadingmask').remove();
				        	if(data.result){
				        		var obj = data.resultObj;
				        		for(var i=0;obj.length>i;i++){
				        			var content = '<table class="table table-striped table-bordered collectResultDetailShowTable"><thead><tr><th style="width:27%"></th><th></th></tr></thead><tbody>';
					        		for(var key in obj[i]){
					        			content += '<tr><td>'+key+'</td><td>'+obj[i][key]+'</td></tr>'
					        		}
					        		content += '</tbody></table>';
                                    $('.collectResultConDetail').html("");
					        		$('.collectResultConDetail').append(content);
				        		}
				        	}
				        }
					})
				}else{
					$().toastmessage('showToast', {
            	    	text: '请将数据填写完整！',
            	   		sticky: false,
            	        position : 'bottom-right',
            	        type: 'error',
            		});
				}
			}
				
		})
		
	})
}

//采集效果测试-请求数据
function editShow($this){
	var baseUrl = $('.extractionInp').val();
	var templateJson = $('.formworkCodeShow').val();
	var parserId = $('.parserListId').val();
	if(baseUrl != '' && templateJson != ''){
		
		$('.editFormworkCon').addClass('hide');
		$('.collectResultShowCon').removeClass('hide');
		
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$this.css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		$this.addClass('active').siblings().removeClass('active');
		
		$.ajax({
	        url: ctx+'/crawl/back/templateCheck',//这个就是请求地址对应sAjaxSource
	        data:{baseUrl:baseUrl,templateJson:templateJson,parserId:parserId},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	$this.removeAttr('style').find('.loadingmask').remove();
	        	if(data.result){
	        		var obj = data.resultObj;
	        		for(var i=0;obj.length>i;i++){
	        			
	        			var content = '<table class="table table-striped table-bordered collectResultShowTable"><thead><tr><th style="width:27%"></th><th></th></tr></thead><tbody>';
		        		for(var key in obj[i]){
		        			content += '<tr><td>'+key+'</td><td>'+obj[i][key]+'</td></tr>'
		        		}
		        		content += '</tbody></table>';
		        		
		        		$('.collectResultShowCon').html("");
		        		$('.collectResultShowCon').append(content);
	        		}
	        		
	        		
	        	}
	        }
		})
	}else{
		$().toastmessage('showToast', {
	    	text: '请将数据填写完整！',
	   		sticky: false,
	        position : 'bottom-right',
	        type: 'error',
		});
	}
}

(function(){
	"use strict";
	
//	input框，模糊查询
	$.fn.getInputSearchData = function(options){
		
		var defaults = {
				ajaxUrl:'',  //请求路径
				type:'',
				callback:'',
				afterSelectFun:''
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
		$(this).typeahead({
	        source: function (query, process) {
	        	if(options.type == ''){
	        		var dataparam = {'keys':query}
	        	}else{
	        		var dataparam = {'keys':query,'type':options.type}
	        	}
	            //query是输入的值
	        	$.ajax({
	                url: options.ajaxUrl,//这个就是请求地址对应sAjaxSource
	                data:dataparam,
	                type : 'get',
	                dataType : 'json',
	                async : true,
	                success : function(data) {
	                	console.log(data);
	                	if(typeof(options.callback) != 'function'){
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
		                				arrayItem.id = sourcesData[i].id;
		                				arrayItem.name = sourcesData[i].name;
		                				
		                				array.push(arrayItem);
		                			}
		                			 process(array);
		                			 $('.typeahead').css({
		                         		'minWidth':$this.width()+24,
		                         	})
		                		}
		                	}
	                	}else{
	                		if(data.result == true){
		                		var sourcesData = data.resultObj;
		                		options.callback(sourcesData,process);
	                		}
	                	}
	                	
	                }
	        	})
	        },
	        afterSelect: function (item) {
	        	console.log(item);
	        	$this.attr('data-id',item.id).blur();
	        	
	        	if(typeof(options.afterSelectFun) == 'function'){
	        		options.afterSelectFun(item);
	        	}
	        },
	        delay: 200,
	        minLength:0,
	        showHintOnFocus:true,
	        autoSelect:false,
	    });
	};
	
//	代码提取
	$.fn.extraction = function(options){
		var defaults = {
				inputDom:'',//查询的input
				htmlDom:'',//查询内容放置的内容
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
		$this.click(function(){
			var extractionVal = $.trim($(options.inputDom).val());
			
			if(extractionVal != ''){
				$.ajax({
	                url: ctx+'/crawl/back/getHtmlContent',//这个就是请求地址对应sAjaxSource
	                data:{'baseUrl':extractionVal},
	                type : 'get',
	                dataType : 'json',
	                async : true,
	                success : function(data) {
	                	console.log(data);
	                	if(data.result){
	                		$(options.htmlDom).text(data.resultObj)
	                	}
	                }
				})
			}
		})
	};
//	保存按钮
	$.fn.saveFormWork = function(options){
		var defaults = {
				type:'',//是列表还是详情保存 0列表 1详情
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
//		保存
		$this.click(function(){
			var writeDom = '';
			if(parseInt(options.type) == 0){
				writeDom = '.formworkConfiguration'
			}else{
				writeDom = '.detailConfiguration'
			}
			
			if($(writeDom).hasClass('notEdit')){
				if(parseInt(options.type) == 0){
					var paramData = getParam(0,1,2);
				}else{
					var paramData = getDetailParam(1,1,2);
				}
				
			}else{
				if(parseInt(options.type) == 0){
					var paramData = getParam(0,1,1);
				}else{
					var paramData = getDetailParam(1,1,1);
				}
			}
			
			$.ajax({
		        url: ctx+'/crawl/back/saveTemplate',//这个就是请求地址对应sAjaxSource
		        data:JSON.stringify(paramData),
		        type : 'post',
		        dataType : 'json',
		        contentType: 'application/json',
		        async : true,
//		        traditional:true,
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
		})
	};
	//另存为模板
	$.fn.saveAsFormWork = function(options){
		var defaults = {
				
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		var type = '';
		
//		另存为模板
		$('#saveAsFormworkModal').on('show.bs.modal', function (event) {
			console.log(event);
			var button = $(event.relatedTarget) // Button that triggered the modal
			var recipient = button.data('whatever');
			type = button.data('type');
			var modal = $(this);
			modal.find('.modal-body input#recipient-name').val(recipient)
		})
		
		$('#saveAsFormworkModal').find('.saveAsButton').click(function(){
			var modalName = $('#saveAsFormworkModal').find('.modal-body input#recipient-name').val();
			if(modalName != ''){
				
//				判断是否重名
				$.ajax({
			        url: ctx+'/crawl/back/preciseFindByName',//这个就是请求地址对应sAjaxSource
			        data:{templateName:modalName},
			        type : 'get',
			        dataType : 'json',
			        async : true,
			        success : function(data) {
			        	console.log(data);
			        	if(data.result){
			        		
			        		if(data.resultObj){
			        			$('#saveAsFormworkModal').modal('hide');
//				        		没有重名进行保存
			        			var writeDom = '';
			        			if(parseInt(options.type) == 0){
			        				writeDom = '.formworkConfiguration'
			        			}else{
			        				writeDom = '.detailConfiguration'
			        			}
			        			if($(writeDom).hasClass('notEdit')){
			        				if(parseInt(type) == 0){
			        					var paramData = getParam(0,2,2);
			        				}else{
			        					var paramData = getDetailParam(1,2,2);
			        				}
			        			}else{
			        				if(parseInt(type) == 0){
			        					var paramData = getParam(0,2,1);
			        				}else{
			        					var paramData = getDetailParam(1,2,1);
			        				}
			        				
			        			}
				        		paramData.templateName = modalName;
				        		$.ajax({
				        	        url: ctx+'/crawl/back/saveTemplate',//这个就是请求地址对应sAjaxSource
				        	        data:JSON.stringify(paramData),
				        	        type : 'post',
				        	        dataType : 'json',
				        	        contentType: 'application/json',
				        	        async : true,
				        	        success : function(data) {
				        	        	console.log(data);
				        	        	if(data.result){
				        	        		$().toastmessage('showToast', {
				                    	    	text: '另存为模板成功！',
				                    	   		sticky: false,
				                    	        position : 'bottom-right',
				                    	        type: 'success',
				                    		});
				        	        	}else{
				        	        		$().toastmessage('showToast', {
				                    	    	text: '另存为模板失败！',
				                    	   		sticky: false,
				                    	        position : 'bottom-right',
				                    	        type: 'error',
				                    		});
				        	        	}
				        	        }
				        		})
			        		}else{
			        			$().toastmessage('showToast', {
	                    	    	text: '模板名称已经存在！',
	                    	   		sticky: false,
	                    	        position : 'bottom-right',
	                    	        type: 'error',
	                    		});
			        		}

			        	}
			        }
				})
			}
		})
	};
	
//	生成代码
	$.fn.createCode = function(options){
		var defaults = {
				paramData:'', //生成代码需要的参数
				showDom:''
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
//		$this.click(function(){
			var param = '';
			console.log(typeof(options.paramData));
//			if(typeof(options.paramData) == 'object'){
//				param = options.paramData();
//				console.log(param);
//			}
			var getparam = {
					collectionPositon:options.paramData.collectionPositon,//采集位置
					tags:options.paramData.tags,//列表标签
					collectionField:options.paramData.collectionField,//采集字段
					editFlag:options.paramData.editFlag,
					encoding:options.paramData.encoding,
			}
//            var getparam = getParam(0,1,1);
			$.ajax({
		        url: ctx+'/crawl/back/getTemplateJson',//这个就是请求地址对应sAjaxSource
		        data:JSON.stringify(getparam),
		        type : 'post',
		        dataType : 'json',
		        contentType: 'application/json',
		        async : true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result){
		        		resultCode = data.resultObj;
//		        		$('.formworkCodeShow').html(JSON.stringify(JSON.parse(data.resultObj), null, 4) );
		        		$(options.showDom).html(JSON.stringify(JSON.parse(data.resultObj), null, 4));
		        		$().toastmessage('showToast', {
	            	    	text: '生成代码成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
		        	}
		        }
			})
//		})
	}
})(jQuery);