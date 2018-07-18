$(function(){
	/*时间区间*/
	$('#begin_time').datetimepicker({
        format:'yyyy-mm-dd',
        language:  'zh-CN',
        //weekStart: 1,
        //todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView:2,
        forceParse: 0,
        //showMeridian: 1
    }).on("changeDate",function(ev){
        var transferdate=transferDate($("#begin_time").val());//转时间日期
        $('#end_time').datetimepicker('remove');
        $('#end_time').datetimepicker({
            format:'yyyy-mm-dd',
            language:  'zh-CN',
            minView:2,
            autoclose: 1,
            'startDate':transferdate
        }).on("changeDate",function(ev){
            var enddate=$("#end_time").val();
            setEndTime(enddate);
        });
    });
    $('#end_time').datetimepicker({
        format:'yyyy-mm-dd',
        language:  'zh-CN',
        minView:2,
        autoclose: 1
    }).on("changeDate",function(ev){
        var enddate=$("#end_time").val();
        setEndTime(enddate);
    });


    $('.addTopicTable>table').DataTable({
   		iDisplayLength : 10,
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	       	{ "bSortable": false },
	    ],
	    "aaSorting": [[0, ""]],
	});
});

function setEndTime(enddate){
    $('#begin_time').datetimepicker('remove');
        $('#begin_time').datetimepicker({
            format:'yyyy-mm-dd hh:ii',
            language:  'zh-CN',
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            'endDate':transferDate(enddate)
    });
}
//将时间字符串转为date
function transferDate(data){
    var start_time=data;
    var newTime= start_time.replace(/-/g,"-");
    var transferdate = new Date(newTime);
    return transferdate;
}
function transferTime(str){
    var newstr=str.replace(/-/g,'-');
    var newdate=new Date(newstr);
    var time=newdate.getTime();
    return time;
}