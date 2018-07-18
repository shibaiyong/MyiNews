$(function(){
	var dateFormat = "yyyy-MM-dd hh:mm:ss";
	var simpleDateFormat = "yyyy-MM-dd";
	
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
	
	
	table = $('.sysDicConTable').DataTable({
		"aaSorting": [[0, ""]],
        serverSide: true,//标示从服务器获取数据
        sAjaxSource : ctx+'/sysDic/back/pageSysDic',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams : function ( aoData ) {
        	var innerid = $('#innerid').val();
        	var dataName = $('#dataName').val();
        	var dataValue = $('#dataValue').val();
        	//var time = $('#time').val();
        	aoData.push(
        			{"name":"innerid","value":innerid },
        			{"name":"dataName","value":dataName},
        			{"name":"dataValue","value":dataValue}
        			//{"name":"time","value":time}
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
				   +'<a role="menuitem" href="javascript:toUpdate('+data.innerid+')">修改</a>'
				   +'</li>'
				  /* +'<li role="presentation" >'
				   +'<a role="menuitem" href="javascript:deleteNews('+data.innerid+')">删除</a>'
				   +'</li>'*/
				   +'</ul>'
				   +'</div>'
        	$('td:eq(6)', row).html(content);
        },
        columns: [//显示的列
            
            { data: 'dataName', "bSortable": false },
            { data: 'dataValue', "bSortable": false },
            { data: 'description', "bSortable": false },
            { data: 'weight', "bSortable": false },
            { data: 'createTime', "bSortable": false,
                render:function(data, type, row){
              		if(null != data && "" != data){
  						var date = new Date(data);
  						return date.format(dateFormat);
              		}else{
              			return "--";
              		}
                }
              },
              { data: 'updateTime', "bSortable": false,
                  render:function(data, type, row){
                		if(null != data && "" != data){
    						var date = new Date(data);
    						return date.format(dateFormat);
                		}else{
                			return "--";
                		}
                  }
                },
            {"bSortable": false },
//            { 
//            	data: 'similarNewsSet', "bSortable": false,
//            	render:function(data, type, row){
//            		if(null == data || "" == data){
//            			return "(0)";
//            		}
//            		var n = data.split(",");
//            		return "("+n.length+")"
//            	}
//            },
//            { 
//            	data: 'relevantNewsSet', "bSortable": false,
//            	render:function(data, type, row){
//            		if(null == data || "" == data){
//            			return "(0)";
//            		}
//            		var n = data.split(",");
//            		return "("+n.length+")"
//            	}
//            },
        ],
	        "columnDefs": [ {
	            "targets": [ '_all' ],
	            "data": null,
	            "defaultContent": "--"
	        } ]
	});
	
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
	
});

function retrieveData(sSource, aoData, fnCallback) {
    $.ajax({
        url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'post',
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
	$('.content-wrapper').load(ctx+'/sysDic/back/findSysDicById/'+id);
}

/*function deleteNews(id){
	$.ajax({
        url : ctx+"/deleteWebPageNews/"+id,//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        success : function(data) {
        	if(data.result){
        		alert("删除新闻成功");
        		searchNews();
        		//fnCallback(data.resultObj);
        	}else{
        		alert(data.errorMsg);
        	}
        },
        error : function(msg) {
        }
    });
}*/
function searchSysDic(){
	$.ajax({
        url :ctx+'/sysDic/back/pageSysDic',//这个就是请求地址对应sAjaxSource
        type : 'post',
        dataType : 'json',
        success : function(data) {
        	if(data.result){
        		table.ajax.reload();
        	}else{
        		alert(data.errorMsg);
        	}
        },
        error : function(msg) {
        }
    });
}

