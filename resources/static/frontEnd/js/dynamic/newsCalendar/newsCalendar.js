$(function () {

	/*头部导航高亮*/
	
	
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.calendar'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	var eventLimitCount = 6;
	 if($('#calendar').width() <= 992){
		 eventLimitCount = 4;
	 }
        $('#calendar').fullCalendar({
          header: {
            right: 'prev,month,next ',
            center: 'title',
            left: 'prevYear,today,nextYear ' 
          },
          timeFormat: 'H:mm',
          eventLimit:true,
          views: {
              month: { 
                  titleFormat: 'YYYY年 MM月',
                  eventLimit : eventLimitCount
              }
          },
          eventLimitClick:function(cellInfo, jsEvent){
        	  
        	  var time = new Date(cellInfo.date._d).formatDate('yyyy-MM-dd');
        	  console.log(time);
        	  var dataUrl = ctx+'/calendar/front/goto/calender/list?datetime='+time;
        	  window.open(dataUrl);
          },
          
          monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          dayNamesShort: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          buttonText: {
            today: '年',
            month: '月',
            agendaWeek: '周',
            agendaDay: '日',
          },
          //Random default events
          events: function(start, end,timezone, callback) {
        	  $("#calendar").fullCalendar('removeEvents');//清空上次加载的日程
        	  
        	  var time = new Date($('#calendar').fullCalendar('getDate'));
    		  var timenow = time.formatDate("yyyy-MM").toString();
        	  
        		$.ajax({
  		        	type : "get",
  					url : ctx+"/calendar/front/getCalendar?datetime=" + timenow,
  					async:true,
  		            dataType: 'json',
  		            success: function(data) {
  		            	console.log(data);
  		                var datas = [];
  		                if(data.result){
  		                	var map = data.resultObj;
  		                	var newsList = map.news; //新闻列表
  		                	var subjectList = map.event; //专题列表
  		                	var date;
	  						var background = ['inherit','#75b1d4','#d2c707','#fca214','#f56954','#fec200'];//蓝、黄、橙、红
	  						var url;
	  						var title;
	  						var color;
	  						var newDate = new Date();
	  						newDate = newDate.formatDate('yyyy-MM-dd');
	  						var textColor;
	  						
	  						
	  						
	  						//新闻
	  						for (var i = 0; null!=newsList && i < newsList.length; i++) {
  	  							var news = newsList[i];
								var time = new Date(news.crawlDatetime);
								var releaseDatetime = '';
								date = time.formatDate('yyyy-MM-dd');
								// if (news.releaseDatetime != null && news.releaseDatetime != '') {
								//   releaseDatetime = '/' + news.releaseDatetime;
								// }
  	  							
  	  							if(date == newDate){
  	  								textColor='#ffffff'
  	  							}else{
  	  								textColor='#333333'
  	  							}
  	  							var year = new Date(news.releaseDatetime).formatDate('yyyy');
  	  							if("1000"==year){
  	  								if(null != news.releaseDatetimeStr&&'' != news.releaseDatetimeStr){
  	  									year = news.releaseDatetimeStr.split('-')[0];
  	  								}
  	  							}
								title =  "["+year+"]"+news.title;
								
								
  	  							url = ctx + '/latest/front/news/detail/' + news.webpageCode + releaseDatetime;
  	  							color = background[0];
  	  							datas.push({
  	  		                        title: title,
  	  		                        start: date ,// will be parsed
  	  		                        backgroundColor: color,
  	  		                        borderColor: color,
  	  		                        textColor:textColor,
  	  		                        url: url,
  	  		                	});
  	  						}
  		                	//专题
  		                	for (var i = 0; null!=subjectList && i < subjectList.length; i++) {
  	  							var subject = subjectList[i];
  	  							var time = new Date(subject.createDatetime);
  	  							date = time.formatDate('yyyy-MM-dd');
  	  							var year = new Date(news.occurDatetime).formatDate('yyyy');
  	  							title =  "["+year+"]"+subject.title;
  	  							url = ctx+'/event/front/gotoEventDetail/'+ subject.eventCode;
  	  							color = background[subject.level];
  	  							datas.push({
  	  		                        title: title,
  	  		                        start: date ,// will be parsed
  	  		                        backgroundColor: color,
  	  		                        borderColor: color,
  	  		                        url: url,
  	  		                	});
  	  						}
  		                	
  		                	
  		                }
  		               callback(datas); 
  		               //每一次重新加载触发的事件

	  		             $('.fc-event-container').each(function(){
	  		             	var textColor = $(this).find('a').css('color');
	  		             	var parentsDom;
	  		             	if(textColor == 'rgb(255, 255, 255)'){
	  		             		$(this).find('a.fc-event').find('a').css({
	  		             			'color':'#fff'
	  		             		});
	  		             	}
	  		             	
	  		             	$('.fc-day-grid-container').find('table').each(function(){
	  		             		
	  		             		$(this).find('thead>tr>td').each(function(index){
	  		             			if($(this).hasClass('fc-today')==true){
	  		             				parentsDom = $(this).parents('.fc-content-skeleton');
	  		             				parentsDom.find('.fc-more').each(function(position){
	  		             	        		if(position == index){
	  		             	        			$(this).css({
	  		             	        				'color':'#fff'
	  		             	        			})
	  		             	        		}
	  		             	        	});
	  		             			}
	  		             		});
	  		             	});
	  		             	
	  		             	$('.fc-title').each(function(){
	  		             		$(this).css({
	  		             			'display':'inline-block',
	  		             			'width':'100%',
	  		             			'overflow':'hidden',
	  		             		    'white-space': 'nowrap',
	  		             		    'text-overflow': 'ellipsis'
	  		             		})
	  		             	})
	  		             	
	  		             	
	  		             });
	  		             $("[data-toggle='popover']").popover({
	  		               'placement':'top'
	  		             });
	  		             
  		            }
  		        });
		        
        	  
		    },
        });
        
      });