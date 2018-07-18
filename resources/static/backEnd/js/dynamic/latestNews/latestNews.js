var webpagecodeChecked = [];
var tableItemWebPageCodeArr = [];
$(function(){
	var dateFormat = "yyyy-MM-dd hh:mm:ss";
	var simpleDateFormat = "yyyy-MM-dd";
	console.log(2);
	var options = {
			'locale' : {
				format:'YYYY-MM-DD',
				applyLabel: '确定',
	            cancelLabel: '取消',
	            weekLabel: 'W',
	            customRangeLabel: '自定义',
	            daysOfWeek:[ '日', '一', '二', '三', '四', '五', '六' ],
	            monthNames:[ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
			},
			'endDate':moment(),
			'startDate':moment().subtract(7, 'days'),
			'opens':'left',
	        "ranges": {
	            '最近7天': [moment().subtract(6, 'days'), moment()],
	            '最近30天': [moment().subtract(29, 'days'), moment()],
	            '本月': [moment().startOf('month'), moment().endOf('month')],
	            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	        },
	        "alwaysShowCalendars": true,
	    };
		$('.time-slice').daterangepicker(options, function(start, end, label) {});
//		$('.time-slice').on('hide.daterangepicker',function(ev, picker){
//			table1.ajax.reload();
//			table2.ajax.reload();
//			reprintedRankingWeekEcharts();
//			copyrightRankingEcharts();
//			reprintedCopyrightCostLeft();
//		});
	
	Date.prototype.format = function(format) {
		/*
		 * eg:format="yyyy-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
			// millisecond
		}

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
							- RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
								? o[k]
								: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	
//	全选功能
	$('.checked-all').allCheck({
		'allFun':function(status){
			if(status){
				console.log(status);
//				if(webpagecodeChecked.length == 0){
//					webpagecodeChecked = tableItemWebPageCodeArr;
//				}else{
//					for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
//						
//						var jishustatus = 0;
//						
//						for(var j = 0;webpagecodeChecked.length>j;j++){
//							if(tableItemWebPageCodeArr[i] == webpagecodeChecked[j]){
//								++jishustatus;
//							}
//						}
//						
//						if(jishustatus == 0){
//							webpagecodeChecked.push(tableItemWebPageCodeArr[i])
//						}else{
//							jishustatus = 0
//						}
//					}
//				}
				webpagecodeChecked = [];
//				webpagecodeChecked.concat(tableItemWebPageCodeArr;
				for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
					webpagecodeChecked.push(tableItemWebPageCodeArr[i])
				}
				
			}else{
//				for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
//					for(var j = 0;webpagecodeChecked.length>j;j++){
//						if(tableItemWebPageCodeArr[i] == webpagecodeChecked[j]){
//							webpagecodeChecked.splice(tableItemWebPageCodeArr[i],1)
//						}
//					}
//				}
				webpagecodeChecked = [];
			}
			console.log(webpagecodeChecked);
		}
	});
	
	table = $('.latestNewsConTable').DataTable({
		"aaSorting": [[0, ""]],
        serverSide: true,//标示从服务器获取数据
        sAjaxSource : ctx+'/latestNews/back/pageWabPageNews',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams : function ( aoData ) {
        	var innerid = $('#innerid').val();
        	var title = $('#title').val();
//        	var sourcesLevelTwo = $('#sourcesLevelTwo').val();
        	var time = $('#time').val();
        	aoData.push(
        			{"name":"newsId","value":innerid },
        			{"name":"queryStr","value":title},
//        			{"name":"sourcesLevelTwo","value":sourcesLevelTwo},
        			{"name":"time","value":time}
       		);
        },
        "rowCallback" : function(row, data, index) {
        	var content;
        	content='<div class="dropdown">'
				   +'<button type="button" class="btn dropdown-toggle" id="operatedropdown" data-toggle="dropdown">'
				   +'操作<span class="caret"></span>'
				   +'</button>'
				   +'<ul class="dropdown-menu" role="menu" aria-labelledby="operatedropdown">'
				   +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:toUpdate(\''+data.webpageCode+'\')">修改</a>'
				   +'</li>'
				   +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:deleteNews(\''+data.webpageCode+'\')">删除</a>'
				   +'</li>'
				   +'</ul>'
				   +'</div>'
        	$('td:eq(5)', row).html(content);
            $('td:eq(2)', row).html("<a href='"+ctx+"/latest/front/news/detail/"+data.webpageCode+"' target='_blank'>"+data.title+"</a>");
        
            $('td:eq(0)', row).html('<span class="check-box check-child " data-webpagecode="'+data.webpageCode+'"><i class="fa fa-check"></i></span>')
        },
        columns: [//显示的列
                  {"bSortable": false },
            { data: 'releaseDatetime', "bSortable": false,
              render:function(data, type, row){
            		if(null != data && "" != data){
						var date = new Date(data);
						return date.format(dateFormat);
            		}else{
            			return "--";
            		}
              }
            },
//            { data: 'cusClassification', "bSortable": false },
            { data: 'title', "bSortable": false },
//            { data: 'label', "bSortable": false },
            { data: 'sourceCrawlDetail.website.displayName', "bSortable": false },
            { data: 'sourceReport', "bSortable": false },
            {"bSortable": false },
        ],
	        "columnDefs": [ {
	            "targets": [ '_all' ],
	            "data": null,
	            "defaultContent": "--"
	        } ]
	});
	
	$('.latestNewsConTable').on('draw.dt',function() {
//		webpagecodeChecked = [];
		$('.latestNewsConTable').itemCheck({   //给每一条新闻增加单击的事件
			'itemFun':function($this,statusItem){
				if(statusItem){
					console.log(statusItem);
					webpagecodeChecked.push($this.attr('data-webpagecode'));
				}else{
					for(var i = 0;webpagecodeChecked.length>i;i++){
						var webpageCodeItem = $this.attr('data-webpagecode');
						if(webpageCodeItem == webpagecodeChecked[i]){
							webpagecodeChecked.splice(i,1);
						}
					}
				}
				console.log(webpagecodeChecked)
			}
		});
		
		var textArr = table.column(1).nodes().data();
		
		tableItemWebPageCodeArr = [];
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
			}
		}
	})
	
	$('.allDelete').find('button').click(function(){
		if(webpagecodeChecked.length>0){
			var checkItem = webpagecodeChecked.join(',');
		}
		deleteNews(checkItem);
	})
	
});

function retrieveData(sSource, aoData, fnCallback) {
    $.ajax({
        url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	if(data.result){
        		fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
        	}
	       
        },
        error : function(msg) {
        }
    });
}

function toUpdate(id){
	
	$('.content-wrapper').load(ctx+'/findWebpageNewsById/'+id);
}

function deleteNews(id){
	$.ajax({
        url : ctx+"/deleteWebPageNews/"+id,//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        success : function(data) {
        	if(data.result){
//        		searchNews();
        		//fnCallback(data.resultObj);
        	}else{
        		alert(data.errorMsg);
        	}
        	table.ajax.reload();
        },
        error : function(msg) {
        }
    });
}
function searchNews(){
	table.ajax.reload();
}

