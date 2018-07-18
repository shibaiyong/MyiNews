var table;
$(function(){
	table = $('.userTable').DataTable({
    	"aaSorting": [[0, ""]],
        serverSide: true,//标示从服务器获取数据
        sAjaxSource : ctx+'/acesslog/back/pageaccesslog',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        iDisplayLength : 20,
        fnServerParams : function ( aoData ) {
        	// $('#queryStr').val().trim();
        	var queryStr = $.trim($("#queryStr").val());
        	//alert(queryStr);
        	aoData.push(
        			{"name":"queryStr","value":queryStr}
        		);
        },
        columns: [//显示的列
            { data: 'name', "bSortable": false},
            { data: 'ip', "bSortable": false },
            { data: 'opDatetime', "bSortable": false,
            	render:function(data, type, row){
            		if(null != data && "" != data){
            			var createTime = new Date(data);
            			var time = createTime.formatDate('yyyy-MM-dd hh:mm:ss');
						return time;
            		}else{
            			return '-';
            		}
            	}
            },
            { data: 'optType', "bSortable": false },
            { data: 'module', "bSortable": false }
          
            /*{"bSortable": false},*/
        ],
	        "columnDefs": [ {
	            "targets": [ '_all' ],
	            "data": null,
	            "defaultContent": "--"
	        } ]
	});
	
	EnterPress();//回车事件
	
});

/**
 * 
 * @param sSource
 * @param aoData
 * @param fnCallback
 * @returns
 */
function retrieveData(sSource, aoData, fnCallback) {
	$.ajax({
    	url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
	       fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
        },
        error : function(msg) {
        }
    });
}

/*enter键进入*/
function EnterPress(){
	$(document).keydown(function(event){ 
		var e = event || window.event; 
		var k = e.keyCode || e.which; 
		if(k == 13){
			table.ajax.reload();
		}
	});
}
