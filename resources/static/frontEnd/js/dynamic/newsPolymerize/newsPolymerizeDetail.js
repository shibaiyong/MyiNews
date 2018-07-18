var innerid;
var queryStr;
var highlightList = [];
var table;

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

//多行文本溢出隐藏js实现

var overflowhidden = function(id, rows, str){
    var text = document.getElementById(id);
    var style = window.getComputedStyle ? window.getComputedStyle(text, "") : text.currentStyle;
    var lineHeight = style["line-height"];   //获取到line-height样式设置的值 必须要有
    console.log(lineHeight);
    var at = rows*parseInt(lineHeight);      //计算包含文本的div应该有的高度
    var tempstr = str;                       //获取到所有文本
    text.innerHTML = tempstr;                //将所有文本写入html中
    var len = tempstr.length;
    var i = 0;
    if(text.offsetHeight <= at){             //如果所有文本在写入html后文本没有溢出，那不需要做溢出处理

    }
    else {                                   //否则 一个一个字符添加写入 不断判断写入后是否溢出
        var temp = "";
        text.innerHTML = temp;
        while(text.offsetHeight <= at){
            temp = tempstr.substring(0, i+1);
            i++;
            text.innerHTML = temp;
        }
        var slen = temp.length;
        tempstr = temp.substring(0, slen-1);
        len = tempstr.length
        text.innerHTML = tempstr.substring(0, len-3) +"...";     //替换string后面三个字符
        text.height = at +"px";                                  //修改文本高度 为了让CSS样式overflow：hidden生效
    }
}

$(function(){
	/*头部导航高亮*/
	/* 头部导航高亮 */
    $().showHeader();
	var domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-4'i><'col-sm-8'p>>";
	var totalCount = "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条";
	if($('body').width()<1200){
		domString = "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>";
		totalCount = "共计  _TOTAL_ 条";
	}
	innerid = $('#clusterCode').val();
	queryStr = $("#queryStr").val();
	var scrollCon = '';
	if($('body').width()<768){
		scrollCon = true;
		pagingTypeCon = "simple";
	}
	table = $('.relativeReportTable').DataTable({
    	serverSide: true,//标示从服务器获取数据
    	sAjaxSource : ctx+'/cluster/front/relevant',//服务器请求
    	fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        'iDisplayLength' : 20,
		fnServerParams : function ( aoData ) {
			if(queryStr != ''){
				aoData.push(
					{"name":"clusterCode","value":innerid},
					{"name":"queryStr","value":queryStr}
				)
			}else{
				aoData.push(
						{"name":"clusterCode","value":innerid}
					)
			}
        },
        "rowCallback" : function(row, data, index) {
        	var summary = '';
        	if(null != data.nlpSummary){
        		if(data.nlpSummary.length>150){
	              summary = data.nlpSummary.substr(0,150)+'...';
	            }else{
	              summary = data.nlpSummary;
	            }
        	}else{
        		summary = '暂无摘要';
        	}
        	var title;
        	//时间戳判断空处理。
        	if(data.releaseDatetime==null||data.releaseDatetime=='null'){
                var timee = 1;//如果是空，仍然需要传一个值。否则404
			}else{
        		timee = data.releaseDatetime;
			}
        	title = '<a href="'+ctx+'/latest/front/news/detail/'+data.webpageCode+'/'+timee+'" data-id="'+data.webpageCode+'" target="_blank"  class="beyondEllipsis" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+summary+'">'+data.title+' </a>';
        	$('.relativeReportTable').removeAttr('style');
        	$('td:eq(0)', row).html(title);
        	$('td:eq(0)', row).addClass("titleRightClick");

        	if($('body').width()<768){
	        	$('.relativeReportTable').css({
	        		'width':'800px'
	        	});
        	}
        },
        columns: [//显示的列
              { data: 'title', "bSortable": false },
              { data: 'sourceCrawlDetail', "bSortable": false,
            	  render:function(data,type,row){
            		  if(data != null && data != ''){
            			  
            			  var name = data.website.displayName;
            			  return name;
            		  }else{
            			  return '-';
            		  }
            	  }
              },
              { data: 'sourceReport', "bSortable": false,
            	  render:function(data, type, row){
	             		if(null != data && "" != data){
	 						return data;
	             		}else{
	             			return '-';
	             		}
	               }
              },
              { data: 'releaseDatetime', "bSortable": false,
            	  render:function(data, type, row){
	             		if(null != data && "" != data){
	             			var releaseDatetime = new Date(data);
	             			var time = releaseDatetime.formatDate('MM-dd hh:mm');
	 						return time;
	             		}else{
	             			return '-';
	             		}
	               }
              }
          ],
      	"aaSorting": [[3, ""]],
	});
	$('.paginate_button').click(function(){
		scrollOffset($(".relativeReportTable").offset());
	});
//	获得ajax返回的获取
	$('.relativeReportTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList
    });
	$('.relativeReportTable').on('draw.dt',function() {
    	$('.paginate_button').click(function(){
    		scrollOffset($(".relativeReportTable").offset());
    	});
    	var textArr = table.column(0).nodes().data();
//		搜索词高亮显示
		var highTitleArr = [];
		if(highlightList != null){
			for(var log = 0;textArr.length>log;log++){
				highTitleArr.push({
					'webpageCode':textArr[log].webpageCode,
					'title':textArr[log].title
				})
			}
			for(var i = 0;highlightList.length>i;i++){
				for(var j = 0;highTitleArr.length>j;j++){
					highTitleArr[j].title = highTitleArr[j].title.replace(highlightList[i],'<span class="red">'+highlightList[i]+'</span>');
					$('.relativeReportTable').find('td.titleRightClick').find('a[data-id='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
    });
	
	/*报道量统计*/
	dayHoursCountData(innerid);
	/*媒体提及率*/
	reportCountMediaData(innerid);

	/*将底部致底*/
	footerPutBottom();
	
	titleAjaxData();
    //获取最新报道
    fetchlatestNews('.latestReportContainer',ctx + '/cluster/front/getClusterNewsLatest');
    //获取首发报道
    fetchfirstNews('.firstReportContainer',ctx + '/cluster/front/getClusterNewsFirst');

});
//获取最新、首发报道
function fetchlatestNews(ele,url){
    var clusterCode = $('#clusterCode').val().trim();
    var options = {
        ele:ele,
        data:{
            clusterCode:clusterCode
        },
        callback:latestnewsProcess
    }
    var url = url;
    ajaxMethod(url,'get',options);
}
function fetchfirstNews(ele,url){
    var clusterCode = $('#clusterCode').val().trim();
    var options = {
        ele:ele,
        data:{
            clusterCode:clusterCode
        },
        callback:firstnewsProcess
    }
    var url = url;
    ajaxMethod(url,'get',options);
}
function latestnewsProcess(res,ele){
    if(!res.result){
    	$(ele).hide();
    	return false;
	}
    var data = res.resultObj;
    var summary=data.cusSummary;
    var time = data.releaseDatetime;
    var keywords = data.cusKeyWords;
    var keywordsDom='';
    var source = data.sourceCrawlDetail;
    if(!summary||summary=='null'){
        summary='暂无摘要';
    }
    if(!time||time=='null'){
        time='无';
    }else{
        time = new Date(time).formatDate('yyyy-MM-dd hh:mm')
    }
    if(!keywords||keywords=='null'||keywords.length==0){
        keywordsDom='<span>无</span>';
    }else{
        for(var i = 0; i < keywords.length; i++){
            keywordsDom+= '<span>'+keywords[i].keyword+'</span>'
        }
    }
    if(!source||source=='null'){
        source = '无'
    }else{
        source = data.sourceCrawlDetail.currentWebsite.displayName;
    }
    var str='<div class="reportBox">'+
        '<div class="newstitle"><h4>'+data.title+'</h4></div>'+
        '<div class="relativeReportCon">'+
        '<p class="latestReport" id="overflowLatest">'+summary+'</p>'+
        '<div class="keyInfo">'+
        '<ul>'+
        '<li>'+
        '<div class="sourceCon"><span>来源:</span><span class="source">'+source+'</span></div>'+
        '<div class="releaseTimeCon"><span>发布时间:</span><span class="releaseTime">'+time+'</span></div>'+
        '</li>'+
        '<li class="keyWords">'+
        '<span>关键词:</span>'+ keywordsDom +
        '</li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';
    $(ele).append(str);
    overflowhidden('overflowLatest',2,summary);
}
function firstnewsProcess(res,ele){
    if(!res.result){
        $(ele).hide();
        return false;
    }
    var data = res.resultObj;
    var summary=data.cusSummary;
    var time = data.releaseDatetime;
    var keywords = data.cusKeyWords;
    console.log(keywords);
    var keywordsDom='';
    var source = data.sourceCrawlDetail;
    if(!summary||summary=='null'){
        summary='暂无摘要';
    }
    if(!time||time=='null'){
        time='无';
    }else{
        time = new Date(time).formatDate('yyyy-MM-dd hh:mm')
    }
    if(!keywords||keywords=='null'||keywords.length==0){
        keywordsDom='<span>无</span>';
    }else{
        for(var i = 0; i < keywords.length; i++){
            console.log(keywords[i])
            keywordsDom+= '<span>'+keywords[i].keyword+'</span>'
        }
    }
    if(!source||source=='null'){
        source = '无'
    }else{
        source = data.sourceCrawlDetail.currentWebsite.displayName;
    }
    var str='<div class="reportBox">'+
        '<div class="newstitle"><h4>'+data.title+'</h4></div>'+
        '<div class="relativeReportCon">'+
        '<p class="latestReport" id="overflowFirst">'+summary+'</p>'+
        '<div class="keyInfo">'+
        '<ul>'+
        '<li>'+
        '<div class="sourceCon"><span>来源:</span><span class="source">'+source+'</span></div>'+
        '<div class="releaseTimeCon"><span>发布时间:</span><span class="releaseTime">'+time+'</span></div>'+
        '</li>'+
        '<li class="keyWords">'+
        '<span>关键词:</span>'+ keywordsDom +
        '</li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';
    $(ele).append(str);
    overflowhidden('overflowFirst',2,summary);
}
// 免责声明
function closeDeclare(){
    $('.declare').addClass('hide');
}

//聚类新闻标题内容
function titleAjaxData(){
	var clusterCode = $('#clusterCode').val();
	var dataParam = {'clusterCode':clusterCode};
	if(queryStr != ''){
		dataParam.queryStr=queryStr;
	}
	$.ajax({
        url : ctx+'/cluster/front/getClusterDetail',//这个就是请求地址对应sAjaxSource
        data:dataParam,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var clusterCon = {
        				'title':obj.title,
        				'cusSummary':obj.webpage.cusSummary,
        				'time':'',
        				'source':'',
        				'keyWord':'',
        		}
        		
        		if(obj.webpage.sourceCrawlDetail != null && obj.webpage.sourceCrawlDetail != ''){
        			clusterCon.source = obj.webpage.sourceCrawlDetail.website.displayName
        		}else{
        			clusterCon.source = '-'
        		}
        		
        		$('.nucleusReportTitle span').html(obj.keywords);
        		$(document).attr("title",obj.keywords+'_iNews-智慧新闻');
        		
        		clusterCon.time = new Date(obj.webpage.releaseDatetime).formatDate('yyyy-MM-dd hh:mm');
        		
        		if(obj.webpage.cusKeyWords != null && obj.webpage.cusKeyWords != ''){
        			for(var i = 0;obj.webpage.cusKeyWords.length>i;i++){
            			clusterCon.keyWord += '<em>'+obj.webpage.cusKeyWords[i].keyword+'</em>';
            		}
        		}else{
        			clusterCon.keyWord = '-'
        		}
        		
        		var content = '';
        		content += '<div class="nucleusReportItem ">';
        		content += '<p class="itemTitle"><a target="_blank" href="'+ctx+'/latest/front/news/detail/'+obj.webpage.webpageCode+'">'+clusterCon.title+'</a></p>';
        		content += '<div class="itemDigest"><div class="summaryCon">';
        		content += '<p><span>[摘要]</span>'+clusterCon.cusSummary+'</p>';
        		content += '<p></p></div></div><div class="itemInfo">';
        		content += '<p>来源：<span>'+clusterCon.source+'</span>发布时间：<span>'+clusterCon.time+'</span>关键词：'+clusterCon.keyWord;								
        		content += '</p></div></div>';
        		
        		$('.nucleusReportBox').html(content);
        		if(obj.queryList != null && obj.queryList.length>0){
        			for(var i = 0;obj.queryList.length>i;i++){
            			$('.nucleusReportItem ').highlight( obj.queryList[i] );
            		}
        		}
        		
        		summarydotdotdot();
        	}
        },
        error : function(msg) {
        }
	});
}




/*dataTables点击下一页回到表格的顶部*/
function scrollOffset(scroll_offset) { 
	$("body,html").animate({ 
		scrollTop: scroll_offset.top - 100 
	}, 0); 
}
/*5日评论量*/
function commentCountCharts(){
	var cAChart = echarts.init(document.getElementById('commentCountCharts'));
	var cAEchartsOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		toolbox : {
			orient : 'horizontal',
			x : 'right',
			y : 'top',
			right:'35%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '5%',
			top : '11%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			/*name : '日期',*/
			data : ['01日', '02日', '03日', '04日', '05日'],
		} ],
		yAxis : [ {
			type : 'value',
			min : 0,
			max : 2500,
			interval : 500,
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '评论数(个)',
			type : 'bar',
			data : [10, 52, 200, 334, 390],
			barWidth : '30%',
			markPoint : {
				data : [ {
					type : 'max',
					name : '最大值'
				}, ]
			},
		} ]
	};
	cAChart.setOption(cAEchartsOption);
}

/*五日报道量*/
function dayHoursCountData(innerid){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/cluster/front/dayHoursCount",
		data: {
			clusterCode : innerid
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			countReport(data);
		},
		error : function(errorMsg) {
			/*alert(0);*/
			console.log("五日报道量图表请求数据失败啦!");
		}
	});
}
/*五日报道量统计图*/
function countReport(data){
	var dateChart = echarts.init(document.getElementById('countReport'));
	var dateOption = {
			tooltip: {
		        trigger: 'axis',
		        formatter: "{a}<br/>{b} : {c}",
		        axisPointer : { // 坐标轴指示器，坐标轴触发有效
					type : 'none'
				},
		    },
		    toolbox : {
		    	show: true,
				feature : {
					magicType : {
						show : true,
						type : [ 'line', 'bar' ]
					},

					saveAsImage : {
						show:true,
						title:'存为图片'
					},
				}
			},
		    grid: {
		        left: '3%',
		        right: '10%',
		        bottom: '3%',
		        top: '20%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data : data.dayHour,
				axisLabel:{
					formatter:function(value,index){
						var textStr = value.replace(' ','\n');
						
						return textStr;
					}
				},
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value}'
		        }
		    },
		    series: [{
		        name: '统计量(个)',
		        type: 'line',
		        data : data.count,
		        markPoint: {
		            data: [{
		                type: 'max',
		                name: '最大值'
		            },
		            {
		                type: 'min',
		                name: '最小值'
		            }]
		        },
		        markLine: {
		            data: [{
		                type: 'average',
		                name: '平均值'
		            }]
		        }
		    },
		    ]
	};
	dateChart.setOption(dateOption);
}
/*媒体提及率数据*/
function reportCountMediaData(innerid){
	$.ajax({
		type : "get",
		async : true, //同步执行 
		url : ctx+"/cluster/front/mediaReportCount",
		data: {
			clusterCode : innerid
		},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			reportCountMedia(data);
		},
		error : function(errorMsg) {
			console.log("媒体提及率图表请求数据失败啦!");
		}
	});
}
/*媒体提及率*/
function reportCountMedia(data){
	var mediaChart = echarts.init(document.getElementById('mediaMention'));
	var mediaOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		grid : {
			left : '1%',
			right : '10%',
			bottom : '5%',
			top : '8%',
			containLabel : true
		},
		xAxis : {
			type : 'value',
			boundaryGap : [ 0, 0.01 ],
			position : 'top',
			name : ''
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            //rotate: 30
	            formatter: function(value, index){
	            	var valueStr = '';
	            	if(value.length>8){
	            		valueStr = value.substring(0,8)+'...';
	            	}else{
	            		valueStr = value;
	            	}
	            	
	            	return valueStr
	            },
	            textStyle:{
	            	fontFamily:'Microsoft Yahei'
	            }
	        },
			data : data.mediaReport
		},
		series : [ {
			name : '媒体提及率',
			type : 'bar',
			data : data.count,
			/*barWidth : '20px',*/
			barMaxWidth:'20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
		}, ]
	};
	mediaChart.setOption(mediaOption);
	mediaChart.on('click',function(params){
		console.log(params);
		var clusterCode = $('#clusterCode').val();//clusterid
		window.open(ctx+'/latest/front/mediaList/'+params.name+'/'+clusterCode);
		
	});
}

function loadWebpageDetail(id){
//	$('#page-content').load(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	var queryStr = $("#queryStr").val();
	if(null != queryStr && queryStr.length>0){
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id+'?queryStr='+queryStr);
	}else{
		window.open(ctx+'/latest/front/gotoLatestNewsDetail/'+id);
	}
}
/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.itemDigest .summaryCon').height()>260){
        $('.itemDigest .summaryCon').css({
            'height':260,
        });
        var $summaryCon = $('.itemDigest .summaryCon');
            $summaryCon.append( ' <a class="toggle" href="#"><span class="open">[展开]</span><span class="close1">[收起]</span></a>' );
            function createDots()
            {
                $summaryCon.dotdotdot({
                    after: 'a.toggle',
                    wrap: 'letter'
                });
            }
            function destroyDots() {
                $summaryCon.trigger( 'destroy' );
            }
            createDots();
            $summaryCon.on(
                'click',
                'a.toggle',
                function() {
                    $summaryCon.toggleClass( 'opened' );

                    if ( $summaryCon.hasClass( 'opened' ) ) {
                        destroyDots();
                        $('.itemDigest .summaryCon').attr('style','');
                    } else {
                    	$('.itemDigest .summaryCon').css({
                            'height':260,
                        });
                        createDots();
                    }
                    return false;
                }
            );
    }

    
}

function ajaxMethod(url, type, options){
    $.ajax({
        url:url,
        type:type,
        data:options.data,
        dataType:'json',
        success:function( res ){
            if(options.callback){
                if(options.ele){
                    options.callback(res,options.ele);
                }else{
                    options.callback(res);
                }
            }else{
                return;
            }
        }
    })
}