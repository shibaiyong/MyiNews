$(function(){
	var taskId = $('#taskId').val();
	 $('[data-toggle="tooltip"]').tooltip();
	 
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
        		
//	        		绑定change事件
        		$('.collectType').bind('change',function(){
        		})
        	}
		}
	})
	
//		采集频率
	$('.collectFrequency').getAjaxData({
		'ajaxUrl':ctx+'/crawl/back/getCrawlFrequency',
		'callback':function(data){
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
//		    		for(var i = 0;obj.length>i;i++){
//		    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
//		    		}
				for(var key in obj){
					content += '<option value="'+obj[key]+'">'+obj[key]+'</option>'
				}
    		
	    		$('.collectFrequency').html(content);
        	}
		}
	})
	
//		解析数据类型
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
        		
//	        		绑定change事件
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
//		客户标签
	$('.clientLabel').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/listDataset',
		'callback':function(data){
			if(data.result){
				var obj = data.resultObj,
	    			content = '';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
    		
	    		$('.clientLabel').html(content);
	    		
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
//	    		for(var i = 0;obj.length>i;i++){
//	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
//	    		}
				
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
//	    		$('.contentLabel').selectpicker();
        	}
		}
	})
//		内容分类
//	$('.contentLabel').getAjaxData({
//		'ajaxUrl':ctx+'/common/dic/front/listNewsClassification',
//		'ajaxParam':{level:1},
//		'callback':function(data){
////			console.log(data);
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
//		所属地区
//	$('.listRegion').getAjaxData({
//		'ajaxUrl':ctx+'/common/dic/front/listRegion',
//		'ajaxParam':{level:2},
//		'callback':function(data){
////			console.log(data);
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
	
//		所属行业
	$('.industry').getAjaxData({
		'ajaxUrl':ctx+'/common/dic/front/getIndustry',
		'callback':function(data){
//			console.log(data);
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
//	    		$('.newsType').selectpicker();
        	}
		}
	})
	
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
	
	 
//	 获得详情内容
	 $.ajax({
	        url : ctx+'/crawl/back/getCrawltask',//这个就是请求地址对应sAjaxSource
	        data:{taskId:taskId},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        traditional: true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		var obj = data.resultObj;
	        		
//	        		采集任务名称
	        		var taskName = obj.taskName;
	        		$('.collectMission').html(taskName);
	        		
//	        		采集来源名称
	        		var taskSource = obj.dicWebsiteDetail;
	        		if(null != taskSource){
                        console.log(taskSource.name);
                        $('.collectSources').val(taskSource.name).attr('data-id',taskSource.innerid);
					}

	        		
//	        		采集链接地址
	        		var baseUrl = obj.baseUrl;
	        		$('.linkAddress').val(baseUrl);
	        		
//	        		采集类型
	        		var crawlType = obj.crawlType;
	        		$('.collectType').find('option').each(function(){
	        			if($(this).val() == crawlType){
	        				$(this).attr('selected','selected')
	        			}
	        		})
	        		
//	        		采集频率
	        		var periodicTaskName = obj.periodicTaskName;
	        		$('.collectFrequency').find('option').each(function(){
	        			if($(this).val() == periodicTaskName){
	        				$(this).attr('selected','selected')
	        			}
	        		})
	        		
//	        		采集优先级
	        		var weight = obj.weight;
	        		$('.collectWeight').val(weight);
	        		
//	        		解析数据类型
	        		var parserType = obj.parserType;
	        		$('.parseDataType').find('option').each(function(){
	        			if($(this).val() == parserType){
	        				$(this).attr('selected','selected')
	        			}
	        		})
	        		
//	        		分类导航路径
	        		if(obj.navigation != null && obj.navigation != ''){
	        			var navigation = obj.navigation;
	        		}else{
	        			var navigation = '';
	        		}
	        		$('.navigationPath').val(navigation);
	        		
//	        		日期规格
	        		var format = obj.format;
//	        		$('.dateRule').val(format);
	        		$('.dateRule').find('option').each(function(){
	        			if($(this).val() == format){
	        				$(this).attr('selected','selected')
	        			}
	        		})
	        		
//	        		单条采集时间间隔
	        		var sleepTime = obj.sleepTime;
	        		$('.timeInterval').val(sleepTime);
	        		
//	        		客户标签
	        		if(obj.datasetList != null && obj.datasetList != ''){
	        			var datasetList = obj.datasetList.split(',');
		        		for(var i = 0;datasetList.length>i;i++){
		        			$('.clientLabel').find('option').each(function(){
			        			if($(this).val() == datasetList[i]){
			        				$(this).attr('selected','selected')
			        			}
			        		})
		        		}
	        		}
	        		$('.clientLabel').selectpicker();
	        		
//	        		内容分类
	        		if(obj.classification != null && obj.classification != ''){
	        			var datasetList = obj.classification.split(',');
		        		for(var i = 0;datasetList.length>i;i++){
		        			$('.contentLabel').find('option').each(function(){
			        			if($(this).val() == datasetList[i]){
			        				$(this).attr('selected','selected')
			        			}
			        		})
		        		}
	        		}
                    $('.contentLabel').selectpicker();
//	        		新闻类型
	        		if(obj.newsType != null && obj.newsType != ''){
	        			var newsType = obj.newsType.split(',');
		        		for(var i = 0;newsType.length>i;i++){
		        			$('.newsType').find('option').each(function(){
			        			if($(this).val() == newsType[i]){
			        				$(this).attr('selected','selected')
			        			}
			        		})
		        		}
	        		}
                    $('.newsType').selectpicker();
//	        		var classification = obj.classification;
//	        		$('.contentLabel').find('option').each(function(){
//	        			if($(this).val() == classification){
//	        				$(this).attr('selected','selected')
//	        			}
//	        		})
	        		
//	        		所属地区
	        		var region = obj.region;
//	        		$('.listRegion').find('option').each(function(){
//	        			if($(this).val() == region){
//	        				$(this).attr('selected','selected')
//	        			}
//	        		})
	        		$('.listRegion').attr('data-id',region);
	        		$.ajax({
	                    url: ctx+'/common/dic/front/findRegionById',//这个就是请求地址对应sAjaxSource
	                    data:{'regionId':region},
	                    type : 'get',
	                    dataType : 'json',
	                    async : true,
	                    success : function(data) {
	                    	console.log(data);
	                    	if(data.result){
	                    		var obj = data.resultObj;
	                    		$('.listRegion').val(obj.name);
	                    	}
	                    }
	        		})
	        		
	        		
//	        		所属行业
	        		var industryType = obj.industryType;
	        		$('.industry').find('option').each(function(){
	        			if($(this).val() == industryType){
	        				$(this).attr('selected','selected')
	        			}
	        		})
	        		
//	        		下载图片
	        		var isGetImg = obj.isGetImg;
        			$('input[name="downloadPic"]').each(function(){
        				if($(this).val() == 1){
        					$(this).attr('checked','checked');
        				}
        			})
        			
        			
	        		
//	        		图片重命名
	        		var isRenameImg = obj.isRenameImg;
        			$('input[name="renamepic"]').each(function(){
        				if($(this).val() == 1){
        					$(this).attr('checked','checked');
        				}
        			})
        			
//        			metaInfoKey
        			var metaInfoKey = obj.metaInfoKey;
        			$('.metaInfoKey input').val(metaInfoKey);
        			//taskId
                    var taskId = obj.taskId;
                    $('.taskId input').val(taskId);

//        			采集任务状态信息
        			var statusInformation = obj.presentSituation;
        			var collectStatus;
        			if(statusInformation.crawlstatus == 0){
        				collectStatus = '采集中';
        				$('.bottomBtn').find('button.pause').removeClass('hide');
                        $('.taskDetailShow').attr('disabled','disabled');
        			}else if(statusInformation.crawlstatus == 1){
        				collectStatus = '暂停';
        				$('.bottomBtn').find('button.start').removeClass('hide');
        			}else if(statusInformation.crawlstatus == 2){
        				collectStatus = '报警1'
        			}
//        			最新执行时间
        			var latestRunTime = new Date(statusInformation.latestRunTime);
        			latestRunTime = latestRunTime.formatDate('MM-dd hh:mm');
//        			最新采集时间
        			var latestCrawlTime = new Date(statusInformation.latestCrawlTime);
        			latestCrawlTime = latestCrawlTime.formatDate('MM-dd hh:mm');
        			
        			var detailTableConVal = '<tr><td>'+collectStatus+'</td><td>'+latestRunTime+'</td><td>'+latestCrawlTime+'</td><td>'+statusInformation.crawlNumToday+'</td><td>'+statusInformation.crawlNum+'</td></tr>';
        			$('.detailTableCon').html(detailTableConVal);
	        	}
	        }
	 })
	 
	 startTask();
	 pauseTask();
	 createTaskName();
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
            		$('.collectMission').html(collectMissionVal);
            	}
            }
		})
	}
};
//启动
function startTask(){
	
	var startTaskVal = {
			taskId:$('#taskId').val(),
			taskName:'', //采集任务名称
			webStieId:'',//采集来源名称 int
       		baseUrl:'',//采集链接地址
			CrawlType:'',//采集类型 int
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
			metaInfoKey:'',//metaInfoKey
			newsType:'',//新闻类型
			doOperation:0,
			
	}
	
	$('.startTask').click(function(){
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$(this).css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		
		
		var status=0;
		startTaskVal.taskName = $.trim($('.collectMission').text());
		if(startTaskVal.taskName == ''){
			$('.collectMission').addClass('errorInput');
		}else{
			++status;
		}
		
		if($('.collectSources').val() == ''){
			startTaskVal.webStieId = ''
		}else{
			startTaskVal.webStieId = $.trim($('.collectSources').attr('data-id'));
		}
		if(startTaskVal.webStieId == ''){
			$('.collectSources').addClass('errorInput');
		}else{
			++status;
		}
		
//		采集链接地址
		startTaskVal.baseUrl = $.trim($('.linkAddress').val());
		if(startTaskVal.baseUrl == ''){
			$('.linkAddress').addClass('errorInput');
		}else{
			++status;
		}
		
//		采集类型
		startTaskVal.CrawlType = $('.collectType').val();
		
//		采集频率
		startTaskVal.periodicTaskName = $('.collectFrequency').val();
		
//		采集优先级
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
		
//		解析数据类型
		startTaskVal.parserType = $('.parseDataType').val();
//		分类导航路径
		startTaskVal.navigation = $('.navigationPath').val();
//		日期规则
		startTaskVal.format = $('.dateRule').val();
//		单条采集时间间隔
		startTaskVal.sleepTime = $('.timeInterval').val();
//		客户标签
		startTaskVal.datasetList = $('.clientLabel').val();
		if(startTaskVal.datasetList != null){
			startTaskVal.datasetList = startTaskVal.datasetList.join(',');
		}else{
			startTaskVal.datasetList = '';
		}
		
//		内容分类
//		startTaskVal.classification = $('.contentLabel').val();
		startTaskVal.classification = $('.contentLabel').val();
		if(startTaskVal.classification != null){
			startTaskVal.classification = startTaskVal.classification.join(',');
		}else{
			startTaskVal.classification = '';
		}
//		所属地区
		if($('.listRegion').val() == ''){
			startTaskVal.region = '';
			$('.listRegion').attr('data-id','');
		}else{
			startTaskVal.region = $('.listRegion').attr('data-id');
		}
		
//		所属行业
		startTaskVal.industryType = $('.industry').val();
//		下载图片
		startTaskVal.isGetImg = $('input:radio[name="downloadPic"]:checked').val();
//		图片重命名
		startTaskVal.isRenameImg = $('input:radio[name="renamepic"]:checked').val();
//		metaInfoKey
		startTaskVal.metaInfoKey = $('.metaInfoKey input').val();
//		新闻类型
		startTaskVal.newsType = $('.newsType').val();
		if(startTaskVal.newsType != null){
			startTaskVal.newsType = startTaskVal.newsType.join(',');
		}else{
			startTaskVal.newsType = '';
		}
		console.log(startTaskVal);
		
		if(status == 4){
			$.ajax({
	            url :ctx+'/crawl/back/addOrUpdateCrawtask',//这个就是请求地址对应sAjaxSource
	            data: startTaskVal,
	            type : 'get',
	            dataType : 'json',
	            async : true,
	            traditional: true,
	            success : function(data) {
	            	console.log(data);
	            	if(data.result){
	            		$('.bottomBtn').find('button.startTask').html('启动').addClass('hide');
	            		$('.bottomBtn').find('button.pause').removeClass('hide');
	            		
	            		$('.taskDetailShow').attr('disabled','disabled');
	            		
	            		$().toastmessage('showToast', {
	            	    	text: '启动成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
	            		
	            		window.location.reload();
	            	}else{
	            		$('.bottomBtn').find('button.startTask').html('启动');
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
			$('.bottomBtn').find('button.startTask').html('启动');
			$().toastmessage('showToast', {
    	    	text: '启动失败，请输入采集配置条件！',
    	   		sticky: false,
    	        position : 'bottom-right',
    	        type: 'error',
    		});
		}
	})
}

//暂停采集任务
function pauseTask(){
	
	var taskId = $('#taskId').val();
	
	$('.pause').click(function(){
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$(this).css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		
		$.ajax({
	        url :ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
	        data: {'taskId':taskId,'action':1},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        traditional: true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		$('.bottomBtn').find('button.pause').html('暂停').addClass('hide');
	        		$('.bottomBtn').find('button.startTask').html('启动').removeClass('hide');
	        		$('.taskDetailShow').removeAttr('disabled');
	    			$().toastmessage('showToast', {
	        	    	text: '暂停成功！',
	        	   		sticky: false,
	        	        position : 'bottom-right',
	        	        type: 'success',
	        		});
	    			window.location.reload();
	        	}else{
	        		$('.bottomBtn').find('button.pause').html('暂停');
	    			$().toastmessage('showToast', {
	        	    	text: '暂停失败，请重新操作！',
	        	   		sticky: false,
	        	        position : 'bottom-right',
	        	        type: 'error',
	        		});
	        	}
	        }
		})
	})
	
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