var getImgAjaxData1,
	customAddVal = [],
	highlightList = [],
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
    tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
	
$(function(){
	footerPutBottom();
	
	/*头部导航高亮*/
	
	
	$().showHeader({
		callback:function(){
			$('#example-navbar-collapse').find('ul.navbar-nav').find('li').each(function(){
				if($(this).attr('data-mark') == 'nav.image'){
					$(this).addClass('active');
				}
			});
		}
	})
	
	$('.srceenTimeQuantum').removeClass('hide');
	$('.srceenSources').removeClass('hide');
	$('.srceenMap').removeClass('hide');
	$('.srceenClassification').removeClass('hide');
	$('.screenSearch').removeClass('hide');
	var screenIndex = 0;
	$('.screenConditionBox .subpage').each(function(){
		if($(this).hasClass('hide')){
			return;
		}else{
			if($(this).prev().hasClass('srceenTimeQuantum')){
				if($(this).prev().hasClass('hide')){
					var mlLeft = 125 * screenIndex;
					$(this).css({
						'marginLeft': mlLeft +'px',
					})
				}else{
					var mlLeft = 125 * (screenIndex-1)+220;
					$(this).css({
						'marginLeft': mlLeft +'px',
					})
				}
			}else{
				var mlLeft = 125 * screenIndex;
				$(this).css({
					'marginLeft': mlLeft +'px',
				})
			}
			++screenIndex;
		}
	})
	
//	时间段
	$().getData({
		boxClassName:'.srceenTimeQuantum',
		ulClassName:'#srceenTimeQuantumPro',
	})
	selectTime();
//	来源
	$().getData({
		getAjaxUrl:ctx+'/config/front/listUserConfigCarrierAndSource',  //请求路径
		boxClassName:'.srceenSources',
		ulClassName:'#srceenSourcesPro',
	})
//	地区
	$().getData({
		getAjaxUrl:ctx+'/config/front/listUserConfigRegion',  //请求路径
		boxClassName:'.srceenMap',
		ulClassName:'#srceenMapPro',
	})
	
//	分类
	$().getData({
		getAjaxUrl:ctx+'/config/front/listUserConfigClassification',  //请求路径
		boxClassName:'.srceenClassification',
		ulClassName:'#srceenClassificationPro',
	})
	
//	全选功能
	$('.table-operation-status').find('a').eq(0).allCheck({
		'allFun':function(status){
			if(status){
				console.log(status);
				if(batchCheckWebPageCode.length == 0){
					for(var ca=0;tableItemWebPageCodeArr.length>ca;ca++){
						batchCheckWebPageCode.push(tableItemWebPageCodeArr[ca]);
					}
				}else{
					for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
						
						var jishustatus = 0;
						
						for(var j = 0;batchCheckWebPageCode.length>j;j++){
							if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
								++jishustatus;
							}
						}
						
						if(jishustatus == 0){
							batchCheckWebPageCode.push(tableItemWebPageCodeArr[i])
						}else{
							jishustatus = 0
						}
					}
				}
			}else{
				for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
					for(var j = 0;batchCheckWebPageCode.length>j;j++){
						if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
							batchCheckWebPageCode.splice(j,1)
						}
					}
				}
			}
		}
	});
//	批量收藏
	$('.table-operation-status a').eq(2).click(function(){
		$(this).batchCollect({
			dataUrl:ctx+'/latest/front/collectingAllNews', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':5},  //传递参数
			callback:function(data){
	    		if(data.result){
	    			var obj = data.resultObj;
	    			for(var key in obj){
	        			if(obj[key]){
	        				for(var j = 0;tableItemWebPageCodeArr.length>j;j++){
	        					if(key == tableItemWebPageCodeArr[j]){
	        						$('.imgConBoxTable').find('.collect').eq(j).addClass('active').find('i').attr('class','fa fa-heart');
	        						$('.imgConBoxTable').find('span.check-child').eq(j).removeClass('checked');
	        						$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
	        					}
	        				}
	        			}
	        		}
	    			batchCheckWebPageCode = [];
	    		}
			}
		})
	});
//	批量建稿
	$('.table-operation-status a').eq(3).click(function(){
		$(this).batchBuild({
			dataUrl:ctx+'/latest/front/draft/release/more', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode},  //传递参数
			callback:function(data,tempwindow){
				if(data.result){
					
					tempwindow.location=data.resultObj;
					$('span.check-child').removeClass('checked');
					batchCheckWebPageCode = [];
					
					getImgAjaxData1.ajax.reload();
				}
				
			}
		})
	})
	
	//表格进行数据传值
	getImgAjaxData1 = $().getImgAjaxData({
		'requestUrl':ctx+'/latest/front/pageLatestNews',
		'getPassValue':getParamsTable
	});
	
//	获得ajax返回的获取
	$('.imgConBoxTable').on('xhr.dt', function ( e, settings, json, xhr ) {
		highlightList = json.highlightList
    });
	
	getImgAjaxData1.on('draw.dt',function() {
		
		$('.imgConBoxTable').itemCheck({   //给每一条新闻增加单击的事件
			'itemFun':function($this,statusItem){
				if(statusItem){
//					console.log($this[0].attributes[0].nodeValue);
					batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
				}else{
					for(var i = 0;batchCheckWebPageCode.length>i;i++){
						var webpageCodeItem = $this[0].attributes[0].nodeValue;
						if(webpageCodeItem == batchCheckWebPageCode[i]){
							batchCheckWebPageCode.splice(i,1);
						}
					}
				}
			}
		});
		

		
//		浏览量获取
		var textArr = getImgAjaxData1.column(0).nodes().data();
		tableItemWebPageCodeArr = [];
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
			}
//			浏览量
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.imgConBoxTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			操作-收藏
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getUserFavorites',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.imgConBoxTable tbody').find('.collect').each(function(index){
						if(data[index] == true){
							$(this).addClass('active');
							$(this).find('i').attr('class','fa fa-heart');
						}else{
							
						}
					})
				}
			});
//			操作-建稿
			
			$('.jiangao').each(function(index){
				$(this).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'buildingCon':function(_$this){
						_$this.find('i').addClass('hide');
        				_$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
        			},
        			'buildedCon':function(_$this){
        				_$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
        				$("[data-toggle='tooltip']").tooltip();
        				getImgAjaxData1.ajax.reload();
        			}
				})
			});
//			建、采
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getDraftType',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data,con){
					$('.imgConBoxTable tbody').find('.titleRightClick').each(function(index){
						if(data[index].length > 0){
							if(data[index][0] == 1){
								$(this).find('a').css({
									'width':'87%'
								});
								$(this).append('<span class="label-status label-jian">【建】</span>');
							}else if(data[index][0] == 2){
								$(this).find('a').css({
									'width':'87%'
								});
								$(this).append('<span class="label-status label-cai">【采】</span>');
							}else{}
						}
						
					})
				}
			});
		}
		
//		datatables翻页时查询页面中是否有选中的新闻
		for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
			for(var j = 0;batchCheckWebPageCode.length>j;j++){
				if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
					$('.imgConBoxTable').find('.check-child').eq(i).addClass('checked');
				}
			}
		}
		
		
		collect();
		
//		设置图片的宽高
		var tableWidth = $('.imgConBoxTable').find('tbody tr').width()-16;
		var tableHeight = tableWidth / 16 * 9
		$('.imgConBoxTable').find('.site-piclist_pic').css({
			'width':tableWidth + 'px',
			'height':tableHeight + 'px',
			'lineHeight':tableHeight + 'px'
		});
		$('.imgConBoxTable').find('.site-piclist_info').css({
			'width':tableWidth + 'px',
		});
		$('.imgConBoxTable').find('.site-piclist_pic img').css({
			'maxHeight':tableHeight + 'px',
		});
		$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked');
		$("[data-toggle='tooltip']").tooltip();
//		鼠标划入图片放大
//		$(".site-piclist_pic").imgEnlarge();
		
		
		
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
					$('.imgConBoxTable').find('p.titleRightClick').find('a[data-id='+highTitleArr[j].webpageCode+']').html(highTitleArr[j].title)
				}
			}
		}
		
	});
	
	$('#srceenSourcesPro').click(function(){
		getImgAjaxData1.ajax.reload();
		return false;
	})
	$('#srceenMapPro').click(function(){
		getImgAjaxData1.ajax.reload();
		return false;
	})
	$('#srceenClassificationPro').click(function(){
		getImgAjaxData1.ajax.reload();
		return false;
	})
	$('#srceenTimeQuantumPro').click(function(){
		var ds = $(this).prev('h2').text();
		if(ds == '自定义'){
			return;
		}else{
			getImgAjaxData1.ajax.reload();
		}
		
		return false;
	})
	
	//	iSearch点击查询
	$('.customAddBtn').customInputClickBtn({
		'refreshTable':function(){
			getImgAjaxData1.ajax.reload();
		}
	});
	
	//	iSearch加载本地数据
	customAddVal = JSON.parse(localStorage.getItem('isearch'));
	$(".customAddInput").parseLocalArrayData({
		'dataSources':customAddVal,
		'afterSelect':function(){
			getImgAjaxData1.ajax.reload();
		}
	});
	
//	相似合并
	$('.merge').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
		
		getImgAjaxData1.ajax.reload();
	})
})

function getParamsTable(aoData){
//	机构来源
	var sourcesOrg = [];
	var sourcesOrgVal = $('.srceenSources h2').attr('data-innerId');
	sourcesOrg.push(sourcesOrgVal);
	
//	地区
	var regions = [];
	var regionsVal = $('.srceenMap h2').attr('data-innerId');
	regions.push(regionsVal);
	
//	分类
	var classifications = [];
	var classificationsVal = $('.srceenClassification h2').attr('data-innerId');
	classifications.push(classificationsVal);
	
//	相似合并
	var showSimilar = '';
	if($('.merge').hasClass('active')){
		showSimilar = new Boolean(false);
	}else{
		showSimilar = new Boolean(true);
	}
	
//	查询iSearch
	var queryStr = [];
	var queryStrVal = $.trim($('.customAddInput').val());
	queryStr.push(queryStrVal);
	
//	时间time 
	var startTime;
	var endTime;
	var timeQuantum = $.trim($('.srceenTimeQuantum').find('h2').attr('data-innerid'));
	var timeCustom = $.trim($('.srceenTimeQuantum').find('h2').text());
//	if(timeQuantum != ''){
//		startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * timeQuantum)).toUTCString();
//		endTime = new Date().toUTCString();
//	}
	if(timeQuantum != ''){
		if(timeQuantum == '0'){
			startTime = new Date(timeCustom.substring(0,10)).toUTCString();
			endTime = new Date(new Date(timeCustom.substring(11)).getTime()+(1000 * 60 * 60 * 24)).toUTCString();
		}else{
			startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * timeQuantum)).toUTCString();
			endTime = new Date().toUTCString();
		}
	}else{
		startTime = '';
		endTime = '';
	}
	
//	mediaStatus的值设置为3
	var mediaStatus=3;
	
	if(timeQuantum != ''){
		aoData.push(
				{'name':'startTime','value':startTime},
				{'name':'endTime','value':endTime}
		)
	}
	
	aoData.push(
			{'name':'sourcesOrg','value':sourcesOrg},
			{'name':'regions','value':regions},
			{'name':'classifications','value':classifications},
			{'name':'queryStr','value':queryStr},
			{'name':'showSimilar','value':showSimilar},
			{'name':'mediaStatus','value':mediaStatus}
	)
	
	return aoData;
}

//新闻收藏
function collect(){
	$('.collect').each(function(){
		$(this).click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).find('i').attr('class','fa fa-heart-o');
			}else{
				$(this).addClass('active');
				$(this).find('i').attr('class','fa fa-heart');
			}
			
			var webpageCode = $(this).attr('data-id');
			$().judgeKeep({
				'dataUrl':ctx+'/latest/front/collectingNews',
				'dataParam':{'webpageCode':webpageCode,'type':5}
			})
		})
	})
}

//自定义时间
function selectTime(){
	var options = {
		'locale' : {
			format:'YYYY-MM-DD',
			applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            weekLabel: 'W',
            customRangeLabel: '自定义',	
            daysOfWeek:[ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames:[ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
		},
//		ranges : {
//            '最近一天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
//            '最近三天': [moment().subtract('days', 2), moment()],
//            '最近一周': [moment().subtract('days', 6), moment()],
//            '最近30天': [moment().subtract('days', 29), moment()],
//        },
//		'autoUpdateInput':false,
		'opens':'right',
		'separator':'至 ',
      
       "alwaysShowCalendars": true,
       
    };
//	$('.srceenTimeQuantum').daterangepicker({autoUpdateInput:false});
	$('.srceenTimeQuantum').daterangepicker(options, function(start, end, label) {
		console.log(start.format('YYYY/MM/DD')+'-'+end.format('YYYY/MM/DD'));
        
	});
	
//	时间选择框关闭时触发的条件
	$('.srceenTimeQuantum').on('hide.daterangepicker',function(ev, picker){
		
		$('.srceenTimeQuantum').find('h2').html(picker.startDate.format('YYYY/MM/DD')+'-'+picker.endDate.format('YYYY/MM/DD')+'<i class="fa fa-caret-down"></i>');
		
		getImgAjaxData1.ajax.reload();
	});
}