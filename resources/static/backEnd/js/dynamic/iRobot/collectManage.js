var collectTable,
	checkedDataIdArr=[],//选中的列表的id值
	tableAllDataId = [];//列表中本页的显示id值
$(function(){
	$(".menu1 ul li").menu();
	$(".menu2 ul li").menu();
	$(".menu3 ul li").menu();
	$(".menu4 ul li").menu();
	
	operateBatch();
	acquisitionType();
	
	$('.taskSources').typeahead({
        source: function (query, process) {
            //query是输入的值
        	$.ajax({
                url: ctx+'/common/dic/front/irobotwebs',//这个就是请求地址对应sAjaxSource
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
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	console.log(item);
        	$('.taskSources').attr('data-id',item.id);
        	collectTable.ajax.reload();
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
//	iSearch查询
	$('.customAddBtn').click(function(){
		var isearchVal = $.trim($('.customAddInput').val());
		if(isearchVal != ''){
			collectTable.ajax.reload();
		}
	})
	
//	全选
	$('.collectManageTable').allCheck({
		'allFun':function(status){
			console.log(status);
			if(status){
				if(checkedDataIdArr.length == 0){
					checkedDataIdArr = tableAllDataId;
				}else{
					for(var i = 0;tableAllDataId.length>i;i++){
						
						var jishustatus = 0;
						
						for(var j = 0;checkedDataIdArr.length>j;j++){
							if(tableAllDataId[i] == checkedDataIdArr[j]){
								++jishustatus;
							}
						}
						
						if(jishustatus == 0){
							checkedDataIdArr.push(tableAllDataId[i])
						}else{
							jishustatus = 0
						}
					}
				}
			}else{
				checkedDataIdArr = [];
			}
			console.log(checkedDataIdArr)
		}
	})
	
	collectTable = $('.collectManageTable').DataTable({
       serverSide: true,//标示从服务器获取数据
       sAjaxSource :ctx+'/crawl/back/pageCrawlTask',//服务器请求
       fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
       fnServerParams : function ( aoData ) {
//	       	给服务器传的值
	    	   aoData = getPassValue(aoData);
       },
//	       服务器传过来的值
       "rowCallback" : function(row, data, index) {
    	   var checkbox = '<span data-id="'+data.taskId+'" class="check-box check-child"><i class="fa fa-check"></i></span>';
    	   $('td:eq(0)', row).html(checkbox).addClass('checkColumn');
    	   
//    	   任务名称
    	   var titleLink = '',
    	   		title  = '';
    	   if(data.crawlCarrier != null && data.crawlCarrier != ''){
    		   var cData = data.crawlCarrier;
    		   if(cData == 6){
    			   titleLink = ctx+'/crawl/back/gotoCrawltask/'+data.taskId
    		   }
    	   }
    	   
    	   title = '<a href="'+titleLink+'" target="_blank">'+data.taskName+'</a>';
    	   $('td:eq(2)', row).html(title);
    	   
    	   $('td:eq(3)', row).addClass('linkBox');
    	   
//    	   操作
    	  var statusHtml = '';
    	  if(data.presentSituation != null && data.presentSituation != ''){
    		  var statusNum = data.presentSituation.crawlstatus;
    		  if(statusNum == 1){
    			  statusHtml = '<a href="javascript:void(0)" data-id="'+data.taskId+'" class="tableOperateItem start">启动</a>';
    		  }else if(statusNum == 0){
    			  statusHtml = '<a href="javascript:void(0)" data-id="'+data.taskId+'" class="tableOperateItem pause">暂停</a>';
    		  }else if(statusNum == 0){
    			  statusHtml = '<a href="javascript:void(0)" data-id="'+data.taskId+'" class="tableOperateItem pause">暂停</a>';
    		  }else{
    			  statusHtml = '-';
    		  }
    	  }
    	   
    	   var tableOperateCon = statusHtml + '<a href="javascript:void(0)" class="tableOperateItem detele">删除</a>';
    	   $('td:eq(8)', row).html(tableOperateCon).addClass('tableOperate');
       },
       
//	       服务器传过来的值
       columns: [//显示的列
           {data: 'taskId', "bSortable": false},
           {data: 'crawlCarrier', "bSortable": false,
        	   render:function(data, type, row){
            		if(null != data && "" != data){
            			if(data == 6){
            				return '网站';
            			}else if(data == 7){
            				return '微博'
            			}else if(data == 8){
            				return '微信'
            			}else if(data == 9){
            				return 'app'
            			}else{
            				return '-';
            			}
						
            		}else{
            			return '-';
            		}
              }
           },
           { data: 'taskName', "bSortable": false},
           { data: 'baseUrl', "bSortable": false},
           { data: 'createDatetime', "bSortable": false,
        	   render:function(data, type, row){
             		if(null != data && "" != data){
             			var createDatetime = new Date(data);
             			var time = createDatetime.formatDate('yyyy-MM-dd');
 						return time;
             		}else{
             			return '-';
             		}
               }
           },
           { data: 'presentSituation', "bSortable": false,
        	   render:function(data, type, row){
             		if(null != data && "" != data){
             			var latestRunTime = new Date(data.latestRunTime);
             			var time = latestRunTime.formatDate('yyyy-MM-dd');
 						return time;
             		}else{
             			return '-';
             		}
               }
           },
           { data: 'periodicTaskName', "bSortable": false,
        	   	render:function(data, type, row){
	           		if(null != data && "" != data){
							return data;
	           		}else{
	           			return '-';
	           		}
	             }
           },
           { data: 'presentSituation', "bSortable": false,
        	   render:function(data, type, row){
		       		if(null != data && "" != data){
		       			var status = data.crawlstatus,
		       				situationCon = '';
		       			
		       			if(status == 1){
		       				situationCon = '暂停';
		       			}else if(status == 0){
		       				situationCon = '采集中';
		       			}else if(status == 2){
		       				situationCon = '报警1'
		       			}else{
		       				situationCon = '-'
		       			}
						return situationCon;
		       		}else{
		       			return '-';
		       		}
		         }
           },
           { data: 'taskId',"bSortable": false},
       ],
       
       "aaSorting": [[0, ""]],
   });
	
	$('.collectManageTable').on('draw.dt',function() {
		
		$('.collectManageTable').itemCheck({
			'itemFun':function($this,statusItem){
				console.log(statusItem);
				var checkedItemId = $this[0].attributes[0].nodeValue
				if(statusItem){
					checkedDataIdArr.push(checkedItemId);
				}else{
					for(var i = 0;checkedDataIdArr.length>i;i++){
						if(checkedItemId == checkedDataIdArr[i]){
							checkedDataIdArr.splice(i);
						}
					}
				}
				
			}
		});
		
//		获得本页的所有id值
		tableAllDataId = [];
		var textArr = collectTable.column(0).nodes().data();
		
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableAllDataId.push(textArr[count].taskId);
			}
		}
		changePauseStart();
	})
	
})

//批量操作-启动、暂停、删除
function operateBatch(){
	$('.batchOperation').find('label').each(function(index){
		$(this).click(function(){
			if($(this).hasClass('active')){
				
			}else{
				$(this).addClass('active');
				$(this).find('i').attr('class','fa fa-spinner fa-pulse');
				
				if(index == 0){
					console.log(checkedDataIdArr);
					var $this = $(this);
					$.ajax({
				        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
				        data:{taskId:checkedDataIdArr,action:1},
				        type : 'get',
				        dataType : 'json',
				        async : true,
				        traditional: true,
				        success : function(data) {
				        	console.log(data);
				        	$this.removeClass('active');
				        	$this.find('i').attr('class','fa fa-play');
				        	if(data.result){
				        		var obj = data.resultObj;
				        		for(var key in obj){
				        			if(obj[key]){
				        				$('.checked-all').removeClass('checked');
				        				$('.checkColumn').find('span[data-id="'+key+'"]').removeClass('checked');
				        				$('.tableOperate').find('a[data-id="'+key+'"]').text('暂停').removeClass('start').addClass('pause');
				        			}
				        		}
				        	}
				        }
					})
				}else if(index == 1){
					var $this = $(this);
					$.ajax({
				        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
				        data:{taskId:checkedDataIdArr,action:0},
				        type : 'get',
				        dataType : 'json',
				        async : true,
				        traditional: true,
				        success : function(data) {
				        	console.log(data);
				        	$this.removeClass('active');
				        	$this.find('i').attr('class','fa fa-stop');
				        	if(data.result){
				        		var obj = data.resultObj;
				        		for(var key in obj){
				        			if(obj[key]){
				        				$('.checked-all').removeClass('checked');
				        				$('.checkColumn').find('span[data-id="'+key+'"]').removeClass('checked');
				        				$('.tableOperate').find('a[data-id="'+key+'"]').text('启动').removeClass('pause').addClass('start');
				        			}
				        		}
				        	}
				        }
					})
				}else if(index == 2){
					var $this = $(this);
					$.ajax({
				        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
				        data:{taskId:checkedDataIdArr,action:2},
				        type : 'get',
				        dataType : 'json',
				        async : true,
				        traditional: true,
				        success : function(data) {
				        	console.log(data);
				        	$('.checked-all').removeClass('checked');
				        	$this.removeClass('active');
				        	$this.find('i').attr('class','fa fa-trash-o');
				        	collectTable.ajax.reload();
				        }
					})
				}
			}
		})
	})
}

//列表中暂停、启动、删除
function changePauseStart(){
	$('.tableOperate').find('.tableOperateItem:eq(0)').click(function(){
		
		if($(this).hasClass('pause')){
			$(this).html('<i class="fa fa-spinner fa-pulse"></i>');
			var taskIdsData = [];
			taskIdsData.push($(this).attr('data-id'));
			$.ajax({
		        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
		        data:{taskId:taskIdsData,action:1},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        traditional: true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result){
		        		var obj = data.resultObj;
		        		for(var key in obj){
		        			if(obj[key]){
		        				$('.tableOperate').find('a[data-id="'+key+'"]').text('启动').removeClass('pause').addClass('start');
		        			}
		        		}
		        		
		        		$().toastmessage('showToast', {
	            	    	text: '暂停成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
		        		
		        		collectTable.ajax.reload();
		        	}else{
		        		$().toastmessage('showToast', {
	            	    	text: '暂停失败！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'error',
	            		});
		        	}
		        }
			})
		}else{
			$(this).html('<i class="fa fa-spinner fa-pulse"></i>');
			var taskIdsData = [];
			taskIdsData.push($(this).attr('data-id'));
			$.ajax({
		        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
		        data:{taskId:taskIdsData,action:0},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        traditional: true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result){
		        		var obj = data.resultObj;
		        		for(var key in obj){
		        			if(obj[key]){
		        				$('.tableOperate').find('a[data-id="'+key+'"]').text('暂停').removeClass('start').addClass('pause');
		        			}
		        		}
		        		
		        		$().toastmessage('showToast', {
	            	    	text: '启动成功！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'success',
	            		});
		        		
		        		collectTable.ajax.reload();
		        	}else{
		        		$().toastmessage('showToast', {
	            	    	text: '启动失败！',
	            	   		sticky: false,
	            	        position : 'bottom-right',
	            	        type: 'error',
	            		});
		        		$(this).text('暂停').removeClass('start').addClass('pause');
		        	}
		        }
			})
			
		}
	})
	
	$('.tableOperate').find('.tableOperateItem:eq(1)').click(function(){
		$(this).html('<i class="fa fa-spinner fa-pulse"></i>');
		var taskIdsData = [];
		taskIdsData.push($(this).attr('data-id'));
		$.ajax({
	        url : ctx+'/crawl/back/doOperation',//这个就是请求地址对应sAjaxSource
	        data:{taskId:taskIdsData,action:2},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        traditional: true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
//	        		$(this).html('删除');
	        		collectTable.ajax.reload();
	        	}
	        }
		})
	})
}

//采集类型、任务来源
function acquisitionType(){
	$.ajax({
        url : ctx+'/common/dic/front/getCrawlType',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        traditional: true,
        success : function(data) {
        	if(data.result){
        		var obj = data.resultObj,
        			content = '';
        		for(var i = 0;obj.length>i;i++){
        			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
        		}
        		
        		$('.acquisitionType').html(content);
        		
//        		绑定change事件
        		$('.acquisitionType').bind('change',function(){
        			collectTable.ajax.reload();
        		})
        	}
        }
	});
}

//表格中传的值
function getPassValue(aoData){
	
//	采集类型
	var newsType = [];
	newsType.push($('.acquisitionType').val());
	
//	任务来源
	var crawlSource = [];
	crawlSource.push($('.taskSources').attr('data-id'));
	
	var qstr = [];
	if($('.customAddInput').val() != ''){
		qstr.push($.trim($('.customAddInput').val()));
	}
	
	aoData.push(
			{'name':'newsType','value':newsType},
			{'name':'crawlSource','value':crawlSource},
			{'name':'qstr','value':qstr}
	)
	
	
	return aoData;
}