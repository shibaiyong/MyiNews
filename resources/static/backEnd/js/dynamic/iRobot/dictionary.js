var dictionaryTable;
$(function(){
//	$('.dictionaryTable').DataTable({
//   		iDisplayLength : 10,
//	  	"aoColumns": [ 
//	  		{ "bSortable": false },
//	       	{ "bSortable": false },
//	       	{ "bSortable": false },
//	       	{ "bSortable": false },
//	       	{ "bSortable": false },
//	       	{ "bSortable": false },
//	       	{ "bSortable": false },
//	    ],
//	    "aaSorting": [[0, ""]],
//	});
	
//	载体
	carrierData();
//	地区
	$('.region').typeahead({
        source: function (query, process) {
            //query是输入的值
        	$.ajax({
                // url: ctx+'/common/dic/front/getRegion',//这个就是请求地址对应sAjaxSource
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
                         		'minWidth':$('.region').width()+24,
                         	})
                		}
                	}
                }
        	})
        },
        afterSelect: function (item) {
        	console.log(item);
        	// $('.region').attr('data-id',item.id).blur();
        	$('.region').attr('data-id',item.name).blur();
        	dictionaryTable.ajax.reload();
        },
        delay: 200,
        minLength:0,
        showHintOnFocus:true,
        autoSelect:false,
    });
	
//	表格
	getDicTable();
	
//	更新meta信息
	$('.updateMeta').click(function(){
		var $this = $(this);
		var loading = '<div class="loadingmask"><i class="fa fa-spinner fa-pulse"></i></div>';
		$this.css({
			'borderColor':'#f1f1f1'
		}).append(loading);
		
		$.ajax({
	        url: ctx+'/common/dic/front/flushAllMetaInfos',//这个就是请求地址对应sAjaxSource
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		$this.find('.loadingmask').remove();
	        	}
	        }
		})
	})
})

//获得载体
function carrierData(){
	$.ajax({
        url: ctx+'/common/dic/front/listCarrierRobot',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj,
	    			content = '';
        		content += '<option value="">全部</option>';
	    		for(var i = 0;obj.length>i;i++){
	    			content += '<option value="'+obj[i].innerid+'">'+obj[i].name+'</option>';
	    		}
	    		
	    		$('.carrier').html(content);
	    		
	    		$('.carrier').change(function(){
	    			dictionaryTable.ajax.reload();
	    		})
        	}
        }
	})
}
//字典表列表传值
function getDicTable(){
	
	dictionaryTable = $('.dictionaryTable').DataTable({
       serverSide: true,//标示从服务器获取数据
       sAjaxSource :ctx+'/dictionary/back/pageWebsite',//服务器请求
       fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
       fnServerParams : function ( aoData ) {
    	   var carrier = $('.carrier').val();
    	   var region = $('.region').attr('data-id');
    	   aoData.push(
    				{'name':'carrier','value':carrier},
    				{'name':'websiteName','value':region}
    		)
       },
//		       服务器传过来的值
       "rowCallback" : function(row, data, index) {
		   var content = '<a href="'+ctx+'/dictionary/back/dictionaryEdit/'+data.innerid+'" data-id="'+data.innerid+'" target="_blank" class="tableOperateItem edit">修改</a><a href="javascript:void(0)" data-id="'+data.innerid+'" class="tableOperateItem detele">删除</a>';
		   $('td:eq(7)', row).html(content).addClass('tableOperate');
       },
       
//		       服务器传过来的值
       columns: [//显示的列
	         {data: 'displayName', "bSortable": false,
	      	   render:function(data, type, row){
	           		if(null != data && "" != data){
						return data;
	           		}else{
	           			return '-';
	           		}
	             }
	         },
	         {data: 'url', "bSortable": false,
	        	   render:function(data, type, row){
		           		if(null != data && "" != data){
							return data;
		           		}else{
		           			return '-';
		           		}
		             }
	           },
	           {data: 'weight', "bSortable": false,
	        	   render:function(data, type, row){
		           		if(null != data && "" != data){
							return data;
		           		}else{
		           			return '-';
		           		}
		             }
	           },
           {data: 'carrier', "bSortable": false,
        	   render:function(data, type, row){
            		if(null != data && "" != data){
            			var carrier = data.label.name;
						return carrier;
            		}else{
            			return '-';
            		}
              }
           },
           {data: 'sourceOrg', "bSortable": false,
        	   render:function(data, type, row){
	           		if(null != data && "" != data){
	           			var sourceOrg = data.label.name;
							return sourceOrg;
	           		}else{
	           			return '-';
	           		}
	             }
           },
           {data: 'regionName', "bSortable": false,
        	   render:function(data, type, row){
	           		if(null != data && "" != data){
							return data;
	           		}else{
	           			return '-';
	           		}
	             }
           },
           {data: 'level', "bSortable": false,
               render:function(data, type, row){
                   if(null != data && "" != data){
                       return data;
                   }else{
                       return '-';
                   }
               }
           },
           {data: 'createTime', "bSortable": false,
        	   render:function(data, type, row){
            		if(null != data && "" != data){
            			var createDatetime = new Date(data);
            			var time = createDatetime.formatDate('yyyy-MM-dd hh:mm');
						return time;
            		}else{
            			return '-';
            		}
              }
           },
           {data: 'innerid', "bSortable": false}
       ],
       
       "aaSorting": [[0, ""]],
   });
	
	$('.dictionaryTable').on('draw.dt',function() {
		dicDelete();
	})
}

//列表中的删除
function dicDelete(){
	$('.detele').each(function(){
		var $this = $(this);
		$this.click(function(){
			$.ajax({
		        url: ctx+'/dictionary/back/deleteWebsite',//这个就是请求地址对应sAjaxSource
		        data:{'websiteId':$this.attr('data-id')},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result){
		        		
		        		$().toastmessage('showToast', {
		        	    	text: '删除成功！',
		        	   		sticky: false,
		        	        position : 'bottom-right',
		        	        type: 'success',
		        		});
		        		dictionaryTable.ajax.reload();
		        	}else{
		        		$().toastmessage('showToast', {
		        	    	text: '删除失败！',
		        	   		sticky: false,
		        	        position : 'bottom-right',
		        	        type: 'error',
		        		});
		        	}
		        }
			})
		})
	})
}
