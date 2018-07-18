$(function(){
	$('.weiboConfigurationTable').DataTable({
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false }
        ],
      	"aaSorting": [[0, ""]],
	});
	
	$('.weixinConfigurationTable').DataTable({
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false },
	  		{ "bSortable": false }
        ],
      	"aaSorting": [[0, ""]],
	});
	
	$('[data-toggle="tooltip"]').tooltip();
	
	createTaskName();
	
//	启动
	startTask();
//	采集来源名称
	
	$('.collectSources').typeahead({
        source: function (query, process) {
            //query是输入的值
        	$.ajax({
                url: ctx+'/common/dic/front/getWebSite',//这个就是请求地址对应sAjaxSource
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
                         		'minWidth':$('.collectSources').width()+24,
                         	})
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	console.log(item);
        	$('.collectSources').attr('data-id',item.id).blur();
        	
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
//	地区
	$('.listRegion').typeahead({
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
                         		'minWidth':$('.listRegion').width()+24,
                         	})
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	console.log(item);
        	$('.listRegion').attr('data-id',item.id).blur();
        	
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
//	采集类型
	$('.collectType').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/getCrawlType',
		'callback':function(data){
			if(data.result){
        		var obj = data.resultObj,
        			content = '';
        		for(var i = 0;obj.length>i;i++){
        			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
        		}
        		
        		$('.collectType').html(content);
        		
//        		绑定change事件
        		$('.collectType').bind('change',function(){
        		})
        	}
		}
	})
	
//	采集频率
	$('.collectFrequency').getAjaxData({
		'ajaxUrl':ctx+'/crawl/back/getCrawlFrequency',
		'callback':function(data){
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
//	    		for(var i = 0;obj.length>i;i++){
//	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
//	    		}
				for(var key in obj){
					content += '<option value="'+obj[key]+'">'+obj[key]+'</option>'
				}
    		
	    		$('.collectFrequency').html(content);
        	}
		}
	})
	
//	解析数据类型
	$('.parseDataType').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/getParserType',
		'callback':function(data){
			if(data.result){
        		var obj = data.resultObj,
        			content = '';
        		for(var i = 0;obj.length>i;i++){
        			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
        		}
        		
        		$('.parseDataType').html(content);
        		
//        		绑定change事件
        		$('.parseDataType').bind('change',function(){
        		})
        	}
		}
	})
//	日期规则
	$('.dateRule').getAjaxData({
		'ajaxUrl':ctx+'/crawl/back/getDateformat',
		'callback':function(data){
			console.log(data);
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
	    		for(var key in obj){
	    			content += '<option value="'+obj[key]+'">'+obj[key]+'</option>';
	    		}
	    		
	    		$('.dateRule').html(content);
        	}
		}
	})
//	客户标签
	$('.clientLabel').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/listDataset',
		'callback':function(data){
			console.log(data);
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
    		
	    		$('.clientLabel').html(content);
	    		$('.clientLabel').selectpicker();
        	}
		}
	})
	
	//	内容分类
	$('.contentLabel').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/listNewsClassification',
		'ajaxParam':{level:2},
		'callback':function(data){
			console.log(data);
			if(data.result){
				var obj = data.resultObj,
	    			content = '',
	    			oneObj = [];
				
	    		for(var i = 0;obj.length>i;i++){
	    			if(obj[i].parentId == '0'){
	    				oneObj.push({
	    					'innerid':obj[i].innerid,
	    					'name':obj[i].name
	    				})
	    			}
	    		}
				
				if(oneObj.length>0){
					for(var i = 0;i<oneObj.length;i++){
						content += '<optgroup label="'+oneObj[i].name+'"><option value="'+oneObj[i].innerid+'">'+oneObj[i].name+'</option>';
						
						for(var y = 0;y<obj.length;y++){
							if(oneObj[i].innerid == obj[y].parentId){
								content += '<option value="'+obj[y].innerid+'">'+obj[y].name+'</option>';
							}
						}
						
						content += '</optgroup>';
					}
				}
	    		
	    		
    		
	    		$('.contentLabel').html(content);
	    		$('.contentLabel').selectpicker();
        	}
		}
	})
//	内容分类
//	$('.contentLabel').getAjaxData({
//		'ajaxUrl':ctx+'/common/dic/front/listNewsClassification',
//		'ajaxParam':{level:1},
//		'callback':function(data){
//			console.log(data);
//			if(data.result){
//				var obj = data.resultObj,
//	    			content = '';
//				content += '<option value="">全部</option>';
//	    		for(var i = 0;obj.length>i;i++){
//	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
//	    		}
//    		
//	    		$('.contentLabel').html(content);
//        	}
//		}
//	})
//	所属地区
//	$('.listRegion').getAjaxData({
//		'ajaxUrl':ctx+'/common/dic/front/listRegion',
//		'ajaxParam':{level:2},
//		'callback':function(data){
//			console.log(data);
//			if(data.result){
//				var obj = data.resultObj,
//	    			content = '';
//	    		for(var i = 0;obj.length>i;i++){
//	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
//	    		}
//    		
//	    		$('.listRegion').html(content);
//        	}
//		}
//	})
	
//	所属行业
	$('.industry').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/getIndustry',
		'callback':function(data){
			console.log(data);
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
				content += '<option value="">全部</option>';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
    		
	    		$('.industry').html(content);
        	}
		}
	})
	
	//	新闻类型
	$('.newsType').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/listNewsType',
		'callback':function(data){
			console.log(data);
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
    		
	    		$('.newsType').html(content);
	    		$('.newsType').selectpicker();
        	}
		}
	})
	
	
	customFormwork();
});

//来源采集名称与采集类型填好信息以后采集任务名称自动生成
function createTaskName(){
	$('.collectSources').blur(function(){
		getCreateName();
	})
	
	$('.navigationPath').blur(function(){
		getCreateName();
	})
	
	function getCreateName(){
		var collectSourcesVal = $.trim($('.collectSources').attr('data-id'));
		var navigationPathVal = $.trim($('.navigationPath').val());
		$.ajax({
            url : ctx+'/crawl/back/generateTaskName',//这个就是请求地址对应sAjaxSource
            data: {webStieId:collectSourcesVal,navigation:navigationPathVal},
            type : 'get',
            dataType : 'json',
            async : true,
            traditional: true,
            success : function(data) {
            	console.log(data);
            	if(data.result){
            		var collectMissionVal = data.resultObj;
            		$('.collectMission').val(collectMissionVal);
            	}
            }
		})
	}
//	var createName = {
//		webStieId:'',
//		navigation:''
//	}
//	createName.prototype.getCreateName = function(){
//		console.log($(this));
//	}
};

//启动
function startTask(){
	$('.startTask').click(function(){
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$(this).css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		
		var paramdata = getParamData(1);
		
		if(paramdata.status == 4){
			$.ajax({
	            url :ctx+'/crawl/back/addOrUpdateCrawtask',//这个就是请求地址对应sAjaxSource
	            data: paramdata.startTaskData,
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            traditional: true,
	            success : function(data) {
	            	console.log(data);
	            	if(data.result){
	            		$().toastmessage('showToast', {
	            	    	text: '启动成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
	            		
	            		window.location.reload();
	            	}else{
	            		$('button.startTask').html('启动');
	            		$().toastmessage('showToast', {
	            	    	text: '启动失败！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'error',
	            		});
	            	}
	            }
			})
		}else{
			$('button.startTask').html('启动');
			$().toastmessage('showToast', {
    	    	text: '启动失败，请输入采集配置条件！',
    	   		sticky: false,
    	        position : 'bottom-right',
    	        type: 'error',
    		});
		}
	})
}
//自定义采集模板
function customFormwork(){
	
	$('.customFormwork').click(function(){
		
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$(this).css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		
		var paramdata = getParamData(0);
		
		if(paramdata.status == 4){
			$.ajax({
	            url :ctx+'/crawl/back/addOrUpdateCrawtask',//这个就是请求地址对应sAjaxSource
	            data: paramdata.startTaskData,
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            traditional: true,
	            success : function(data) {
	            	console.log(data);
	            	if(data.result){
	            		$('.customFormwork').html('自定义采集模板');
	            		var obj = data.resultObj;
	            		window.location.href = ctx+'/crawl/back/configuration/'+obj.taskId;
	            	}else{
	            		$('.customFormwork').html('自定义采集模板');
	            		$().toastmessage('showToast', {
	            	    	text: '启动失败！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'error',
	            		});
	            	}
	            }
			})
		}else{
			$('.customFormwork').html('自定义采集模板');
			$().toastmessage('showToast', {
    	    	text: '启动失败，请输入采集配置条件！',
    	   		sticky: false,
    	        position : 'bottom-right',
    	        type: 'error',
    		});
		}
	})
	
}
//保存需要的参数
function getParamData(doOperation){
	var startTaskVal = {
		taskName:'', //采集任务名称
		webStieId:'',//采集来源名称 int
        baseUrl:'',//采集链接地址
        newsCrawlType:'',//采集类型 int
		periodicTaskName:'',//采集频率
		weight:'',//采集 优先级 int
		parserType:'',//解析数据类型 int
		navigation:'',//分类导航路径
		format:'',//日期规则
		sleepTime:'',//单条采集时间间隔
		datasetList:'',//客户标签
		classification:'',//内容分类int
		region:'',//所属地区int
		industryType:'',//所属行业int
		isGetImg:'',//下载图片int
		isRenameImg:'',//图片重名名int
		newsType:'',
		doOperation:doOperation,//任务是否启用 1启用 0 不启用
	}
	
	var status=0;
	startTaskVal.taskName = $.trim($('.collectMission').val());
	if(startTaskVal.taskName == ''){
		$('.collectMission').addClass('errorInput');
	}else{
		++status;
	}
	
	startTaskVal.webStieId = $.trim($('.collectSources').attr('data-id'));
	if(startTaskVal.webStieId == ''){
		$('.collectSources').addClass('errorInput');
	}else{
		++status;
	}
	
//	采集链接地址
	startTaskVal.baseUrl = $.trim($('.linkAddress').val());
	if(startTaskVal.baseUrl == ''){
		$('.linkAddress').addClass('errorInput');
	}else{
		++status;
	}
	
//	采集类型
	startTaskVal.newsCrawlType = $('.collectType').val();
	
//	采集频率
	startTaskVal.periodicTaskName = $('.collectFrequency').val();
	
//	采集优先级
	startTaskVal.weight = $('.collectWeight').val();
	if(startTaskVal.weight == ''){
		$('.collectWeight').addClass('errorInput');
	}else{
		if(!isNaN(startTaskVal.weight)){
			++status;
			startTaskVal.weight = parseInt(startTaskVal.weight);
		}else{
			$('.collectWeight').addClass('errorInput');
		}
	}
	
//	解析数据类型
	startTaskVal.parserType = $('.parseDataType').val();
//	分类导航路径
	startTaskVal.navigation = $('.navigationPath').val();
//	日期规则
	startTaskVal.format = $('.dateRule').val();
//	单条采集时间间隔
	startTaskVal.sleepTime = $('.timeInterval').val();
//	客户标签
	startTaskVal.datasetList = $('.clientLabel').val();
	if(startTaskVal.datasetList != null){
		startTaskVal.datasetList = startTaskVal.datasetList.join(',');
	}else{
		startTaskVal.datasetList = '';
	}
	
//	内容分类
//	startTaskVal.classification = $('.contentLabel').val();
	startTaskVal.classification = $('.contentLabel').val();
	if(startTaskVal.classification != null){
		startTaskVal.classification = startTaskVal.classification.join(',');
	}else{
		startTaskVal.classification = '';
	}
	
//	所属地区
	startTaskVal.region = $('.listRegion').attr('data-id');
//	所属行业
	startTaskVal.industryType = $('.industry').val();
//	下载图片
	startTaskVal.isGetImg = $('input:radio[name="downloadPic"]:checked').val();
//	图片重命名
	startTaskVal.isRenameImg = $('input:radio[name="renamepic"]:checked').val();
	
//	新闻类型
	startTaskVal.newsType = $('.newsType').val();
	if(startTaskVal.newsType != null){
		startTaskVal.newsType = startTaskVal.newsType.join(',');
	}else{
		startTaskVal.newsType = '';
	}
	
	console.log(startTaskVal);
	var paramdata = {
			startTaskData:startTaskVal,
			status:status
	}
	return paramdata;
}
(function(){
	"use strict";
	$.fn.getAjaxData = function(options){
		
		var defaults = {
				ajaxUrl:'',  //请求路径
				ajaxParam:{}, //需要入的值
				callback:''
		};
		var options = $.extend(defaults,options);
		
		var $this = $(this);
		
		$.ajax({
            url : options.ajaxUrl,//这个就是请求地址对应sAjaxSource
            data: options.ajaxParam,
            type : 'get',
            dataType : 'json',
            async : true,
            traditional: true,
            success : function(data) {
            	if(typeof(options.callback) == 'function'){
            		options.callback(data);
            	}
            }
		})
		
	}
	
})(jQuery)