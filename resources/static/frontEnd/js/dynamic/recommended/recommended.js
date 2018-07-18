$(function(){
	footerPutBottom();
	/* 头部导航高亮 */
	
	
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.recommend'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	/*鼠标划入悬停提示*/
	$('[data-toggle="popover"]').popover();
	
	$('#accordion').find('li').each(function(index){
		$(this).click(function(){
			if(index == 0){
				$('#recommendContent').loadPage(ctx+'/recommend/front/thread');
			}else if(index == 1){
				$('#recommendContent').loadPage(ctx+'/recommend/front/cluster');
			}else if(index == 2){
				$('#recommendContent').loadPage(ctx+'/recommend/front/img');
			}else if(index == 3){
				$('#recommendContent').loadPage(ctx+'/recommend/front/video');
			}else if(index == 4){
				$('#recommendContent').loadPage(ctx+'/recommend/front/news');
			}
		})
	})
	
	

	var accordion = new Accordion($('#accordion'),true);

})
function calendar(){
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
                eventLimit : 6
            }
        },
        eventRender : function(event,element) {  
            console.log(element.text());
             var html =  '<a tabindex="0"  data-toggle="popover" data-trigger="hover"  data-content="'+element.text()+'">'+element.text()+'</a>';  
             element.html(html);  
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
        events: [
          {
            title: '18:30 聂树斌案',
            start: '2017-06-02',
            backgroundColor:'#75b1d4',
            borderColor:'#75b1d4'
          },
          {
            title: '11:30 内蒙古赤峰煤矿爆炸案',
            start: '2016-06-03',
            backgroundColor:'#75b1d4',
            borderColor:'#75b1d4'
          },
          {
            id: 999,
            title: '19:00 中关村二小学生欺凌事件',
            start: '2017-06-08',
            backgroundColor:'#75b1d4',
            borderColor:'#75b1d4'
          },
          {
            id: 999,
            title: '18:40 2016年最大雾霾',
            start: '2017-06-16',
            backgroundColor:'#f56954',
            borderColor:'#f56954'
          },
          {
            title: '20:00 俄罗斯驻土耳其大使遇刺事件',
            start: '2017-06-19',
            backgroundColor:'#f56954',
            borderColor:'#f56954'
          },
          {
            title: '20:20 柏林卡车冲撞事件',
            start: '2017-06-19',
            backgroundColor:'#f56954',
            borderColor:'#f56954'
          },
          {
            title: '11:00 俄罗斯军用飞机坠毁事件',
            start: '2017-06-25',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '“美－新自由贸易协定”（美国、新加坡）开始实施',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '“世界艺术馆在线”艺术网站零时正式上线',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '“中朝友好年”正式开始',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '《居住证暂行条例》开始实施 各项标准更明确',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '《中华人民共和国营业税暂行条例》等施行',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },          {
            title: '哈尔滨一仓库发生大火 救援人员5死14伤',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },{
            title: '支付码验证漏洞7',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '支付宝密码验证漏洞支付宝密码验证漏洞支付宝密码验证漏洞8',
            start: '2017-06-10',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },
          {
            title: '支付宝密码验证漏洞支付宝密码验证漏洞支付宝密码验证漏洞8',
            start: '2017-06-14',
            backgroundColor:'#fca214',
            borderColor:'#fca214'
          },        ],
      });
}