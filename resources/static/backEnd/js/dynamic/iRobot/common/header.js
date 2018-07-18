var ctx;
$(function(){
	ctx = $("#ctx").val();

	/**
	 * 时间对象的格式化，只要是时间对象，都可以调用该方法
	 * @param format 传入值,日期格式，比如"yyyy-MM-dd hh:mm:ss"
	 * @returns {String} 格式化之后的时间
	 */
	Date.prototype.formatDate = function(format) {
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
});

function retrieveData(sSource, aoData, fnCallback) {
    $.ajax({
        url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
	       fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
        },
        error : function(msg) {
        }
    });
}