$(function(){
	
	/**
	 * 页面刚刚进来的时候，进行的触发项
	 */
	setTimeout(function () { 
//        addAlready($('#home'));
        getSourcesData($('#home'),addAlready,$('#home'));
        $('#home').find('.conserve').bind('click',function(){
        	$(this).conserve({
        		modalName:'#home',
				ajaxUrl:ctx+'/custom/front/create',
			});
        })
    }, 100);
	
	/**
	 * 点击tab菜单上的名称，只有在第一次点击的时候才会触发这里的函数
	 */
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		alert('tab页切换');
		var activeTab = $(e.target).attr('aria-controls'),$active = $('#'+activeTab+''),$alreadyCon = $active.find('.alreadyCon');
		
		if($active.find('.contentBox').attr('data-once') == 'true'){
		  
			getSourcesData($active,addAlready,$active);
			$active.find('.contentBox').attr('data-once','false');
		  
			if($(e.target).text() == '热点'){
				// 聚类频率
				getAttrFirstData($active,ctx+'/common/dic/front/getClusterFre','#clusterFrequency',addFirst1);
				function addFirst1(){
					$('#clusterFrequency a').each(function(){
						if($(this).text() == '1小时'){
							$(this).addClass('active');
						}
						$(this).click(function(){
							$(this).addClass('active').siblings('a').removeClass('active');
						})
					})
					addFirstAlready($active,'#clusterFrequency',9);
				}
				// 聚类范围
				getAttrFirstData($active,ctx+'/common/dic/front/getClusterRange','#clusterRange',addFirst2);
				function addFirst2(){
					$('#clusterRange a').each(function(){
						if($(this).text() == '近4小时'){
							$(this).addClass('active');
						}
						$(this).click(function(){
							$(this).addClass('active').siblings('a').removeClass('active');
						})
					})
					addFirstAlready($active,'#clusterRange',10)
				}
				
			}
			
//			点击保存
			$active.find('.conserve').bind('click',function(){
				$(this).conserve({
					modalName:'#'+activeTab,
					ajaxUrl:ctx+'/custom/front/create',
				});
			})	
		}
		
		
		
	})
})

function addAlready(className){
	
	//每个选项中，点击高亮，点击全部只有全部高亮 --来源、分类、地区（多选）
	//使用data-choose-style="radio"，判读是否是单选
	className.find('.listLabel').each(function(){
		if($(this).attr('id') == 'clusterRange' || $(this).attr('id') == 'clusterFrequency'){
			
		}else{
			$(this).find('a').each(function(){
				$(this).click(function(){
					if($(this).hasClass('listLabelAll')){
						$(this).addClass('active').siblings().removeClass('active');
					}else{
						
						$(this).siblings('.listLabelAll').removeClass('active');
						if($(this).hasClass('active')){
							var count = $(this).siblings('input').val() - 1;
							$(this).removeClass('active').siblings('input').val(count);
							if(count == 0){
								$(this).siblings('.listLabelAll').addClass('active');
							}
						}else{
							var count = $(this).siblings('input').val();
							//判断是否是单选
							if($(this).parent().attr('data-choose-style') == 'radio'){
								$(this).siblings('input').val('1');
								$(this).addClass('active').siblings().removeClass('active');
							}else{
								$(this).addClass('active').siblings('input').val(++count);
							}
						}
					}
				})
			})
		}
	});
	
	
//	点击下拉按钮触发二级下拉菜单
	className.find('.sortDown').each(function(){
		$(this).click(function(){
			if($(this).hasClass('open')){
				$(this).removeClass('open');
			}else{
				$(this).addClass('open');
			}
		});
		$(this).find('i').click(function(){
			var $this = $(this).parent();
			var plug = $this.attr('data-value');
			className.find('[data-sort-item="'+plug+'"]').siblings('[data-sort-item]').addClass('hide');
			if(className.find('[data-sort-item="'+plug+'"]').hasClass('hide')){
				className.find('[data-sort-item="'+plug+'"]').removeClass('hide');
				$(this).removeClass().addClass('fa fa-angle-down');
			}else{
				className.find('[data-sort-item="'+plug+'"]').addClass('hide');
				$(this).removeClass().addClass('fa fa-angle-left');
			}
			return false;
		})
	})
	
	//二级中的点击高亮事件
	className.find('[data-sort-item]').find('a').each(function(){
		$(this).click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				$(this).addClass('active');
			}
		})
	})
	
	addKeyWords(className);
	addCustomCondition(className);
}

function changeTab(){
	var widget = $('.tabs-vertical');

	var tabs = widget.find('ul a'),
		content = widget.find('.tabs-content-placeholder > div');

	tabs.on('click', function (e) {

		e.preventDefault();

		// Get the data-index attribute, and show the matching content div

		var index = $(this).data('index');

		tabs.removeClass('tab-active');
		content.removeClass('tab-content-active');

		$(this).addClass('tab-active');
		content.eq(index).addClass('tab-content-active');

	});
}


//添加定制-保存
(function($) {
    "use strict";
//    我的定制-保存
    $.fn.conserve = function(options){
    	var defaults = {
    		modalName:'',
    		ajaxUrl:'',	
    		data:{
    			'name': $.trim($(options.modalName).find('#addCustomName').val()),
				'keywords':'',
				'source':'',
				'classification':'',
				'region':'',
				'timeCycle':6,
				'timeRange':78,
				'websites':''
    		},
    	}
    	var options = $.extend(defaults,options);
    	var $this = $(this);
    	var $alreadyCon = $(options.modalName);
    	var customParam = options.data;
//		关键词组
		if($alreadyCon.find('[data-position-item="1"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-item="1"] .dictionaryWord').find('span').text() + '@';
		}
		if($alreadyCon.find('[data-position-item="2"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-item="2"] .dictionaryWord').find('span').text() + '@';
		}
		if($alreadyCon.find('[data-position-item="3"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-item="3"] .dictionaryWord').find('span').text() + '@';
		}
		if($alreadyCon.find('[data-position-item="4"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-item="4"] .dictionaryWord').find('span').text() + '@';
		}
		if($alreadyCon.find('[data-position-item="5"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-item="5"] .dictionaryWord').find('span').text() + '@';
		}
//		来源
		if($alreadyCon.find('[data-position-item="6"]').length > 0){
			$alreadyCon.find('[data-position-item="6"]').find('dd a').each(function(){
				customParam.source += $(this).attr('data-innerid') + '@';
			})
		}
//		分类
		if($alreadyCon.find('[data-position-item="7"]').length > 0){
			$alreadyCon.find('[data-position-item="7"]').find('dd a').each(function(){
				customParam.classification += $(this).attr('data-innerid') + '@';
			})
		}
//		地区
		if($alreadyCon.find('[data-position-item="8"]').length > 0){
			$alreadyCon.find('[data-position-item="8"]').find('dd a').each(function(){
				customParam.region += $(this).attr('data-innerid') + '@';
			})
		}
//		聚类频率
		if($alreadyCon.find('[data-position-item="9"]').length > 0){
			$alreadyCon.find('[data-position-item="9"]').find('dd a').each(function(){
				customParam.timeCycle += $(this).attr('data-innerid');
			})
		}
		
//		聚类范围
		if($alreadyCon.find('[data-position-item="10"]').length > 0){
			$alreadyCon.find('[data-position-item="10"]').find('dd a').each(function(){
				customParam.timeRange += $(this).attr('data-innerid');
			})
		}
    	
		$.ajax({
            url : options.ajaxUrl,//这个就是请求地址对应sAjaxSource
            data:options.data,
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
            	if(data.result == true){
            		$().toastmessage('showToast', {
            			//提示信息的内容
            	    	text: '定制成功！',
            			//是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
            	   		sticky: false,
            			//显示的位置，默认为右上角
            	        position : 'bottom-right',
            			//显示的状态。共notice, warning, error, success4种状态
            	        type: 'success',
            		});
            		
            		var timeCode = data.resultObj;
            		console.log('创建成功'+timeCode);
            		
            		$().customizeEdit({
            			'dataUrl':ctx+'/custom/front/tagEcho',
            			'dataParams':{
            				'type':1,
            				'timeCode':timeCode
            			}
            		})
            		
            		
            	}
            }
        })
    };
    
//    我的定制-回显
    $.fn.customizeEdit = function(options){
    	var defaults = {
    			dataUrl:'',
    			dataParams:{},
    	};
    	var options = $.extend(defaults,options);
    	
    	$.ajax({
            url : options.dataUrl,//这个就是请求地址对应sAjaxSource
            data:options.dataParams,
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
            	console.log(data);
            	if(data.result == true){
            		var obj = data.resultObj;
            		var sideContent = '<li class="open"><i class="fa fa-trash-o"></i><div class="link" data-customGroup="'+obj.customGroup+'">'+obj.name+'</div><ul class="submenu" style="display:block"><li><a href="#">线索</a></li><li><a href="#">热点</a></li><li><a href="#">头条</a></li><li><a href="#">图片</a></li><li><a href="#">视频</a></li></ul></li>'
            		$('#accordion').prepend(sideContent);
            		$('#accordion').find('.addMyCustom').removeClass('open');
            		$('.tablist li:eq('+(options.dataParams.type-1)+') a').tab('show');
            		
            		var echoData = {
            				'source':[],
            				'classification':[],
            				'region':[]
            		}
            		echoData.source = obj.source === null ? [] : obj.source.split('@');
            		echoData.classification = obj.classification === null ? [] : obj.classification.split('@');
            		echoData.region = obj.region === null ? [] : obj.region.split('@');

            		for(var count1 = 0;echoData.source.length>count1;count1++){
    					var innerid = echoData.source[count1];
    					
            			$('#source a').each(function(){
            				if($(this).attr('data-innerid') == innerid){
            					$(this).addClass('active').siblings('.listLabelAll').removeClass('active');
            				}
            			})
					}            		
            		
            		for(var count2 = 0;echoData.classification.length>count2;count2++){
            			var innerid = echoData.classification[count2];
            			$('#classification a').each(function(){
            				if($(this).attr('data-innerid') == innerid){
            					$(this).addClass('active');
            				}
            			})
            		}
            		for(var count3 = 0;echoData.classification.length>count3;count3++){
            			var innerid = echoData.classification[count3];
            			$('.classificationSortDown a').each(function(){
            				if($(this).attr('data-innerid') == innerid){
            					$(this).addClass('active');
            				}
            			})
            		}
            		
            		for(var count4 = 0;echoData.region.length>count4;count4++){
            			var innerid = echoData.region[count4];
            			$('#map a').each(function(){
            				if($(this).attr('data-innerid') == innerid){
            					$(this).addClass('active');
            				}
            			})
            		}
            		for(var count5 = 0;echoData.region.length>count5;count5++){
            			var innerid = echoData.region[count5];
            			$('.mapSortDown a').each(function(){
            				if($(this).attr('data-innerid') == innerid){
            					$(this).addClass('active');
            				}
            			})
            		}
            	}
            	
            }
    	})
    }
    
})(jQuery);