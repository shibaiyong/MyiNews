//添加定制-保存
(function($){
    "use strict";
    var clickcout = 0;

    $.fn.addKeyWords = function(options){
    	var defaults = {
    		
    	}
    	var options = $.extend(defaults,options);
    	
    	$('.addKeyword').each(function(index){//如果点击添加按钮，则显示新增词组的输入框
    		addAlreadyKeyWords($('#addKeyWordInput'),$('#addKeyWordInput').attr('data-position'));
			$(this).click(function(){
				clickcout++;
				var margintop;
				if(clickcout == 1){
					margintop = 57;
				}else if(clickcout <= 4){
                    margintop = 57 + 49 * (clickcout-1);
                }else{
                    margintop = 57 + 49 * 3;
				}
                $(this).css('marginTop',margintop+'px');
				var count = parseInt($(this).siblings('input').val());
				var plug = count + 2;
				var content = '<div class="form-group  has-feedback"> <input type="text" class="form-control" data-position="'+plug+'" placeholder="请输入关键词组，并以逗号隔开"/><i class="fa fa-close form-control-remove"></i></div>';
				if(count < 4){
					$('.keywordsBox').append(content);
					$(this).siblings('input').attr('value',++count);
					
					keywordsDelete($('.keywordsBox').find('.has-feedback:last'));
					
					var $this = $('.has-feedback:last').find('input');
					var dataPos = $this.attr('data-position');
					
					addAlreadyKeyWords($this,$this.attr('data-position'));
					
				}
			});
            $('.addKeyword').click();
    	});

    	//添加的关键词组进行删除
    	function keywordsDelete(classDom){
    		classDom.find('i.form-control-remove').click(function(){
				var count = $(this).parents('.keywordsBox').siblings().find('input').val();
				$(this).parents('.keywordsBox').siblings().find('input').val(--count);
//    			删除这个input输入框
				$('.alreadyCon').find('[data-position-right="'+$(this).siblings('input').attr('data-position')+'"]').remove();
				$(this).parents('.has-feedback').remove();
			})
    	};
    	
    	function addAlreadyKeyWords(inputName,dataPos){//根据左侧关键词组有无内容，来控制右侧的显示
    		inputName.change(function(){
    			var inputWord = inputName.val();
    			if(inputWord == ''){
    				$('[data-position-right="'+dataPos+'"]').remove();
    			}else{
    				if($('[data-position-right="'+dataPos+'"]').length > 0){
    					$('[data-position-right="'+dataPos+'"]').find('.dictionaryWord span').text(inputWord);
    				}else{
    					if(dataPos == 1){
    						var keyWordCon = '<div data-position-right="'+dataPos+'"><h6 class="red">包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>';
    					}else{
    						var keyWordCon = '<div data-position-right="'+dataPos+'"><h6 class="red">或 包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>'
    					}
    					$('.alreadyCon').append(keyWordCon);
    				}
    			}
    		})
    	}

    };
//    获取来源、地区、分类、载体
    $.fn.getData = function(options){
    	var defaults = {
    		getAjaxUrl:'',//请求路径
    		showAll:true, //是否显示全部字段
    		level:2, //具有多级选项的属性，1 只显示一级 2 显示两级
    		callback:'', //数据传回来之后，进行的操作
    		againWrite:'', //直接对返回回来的值进行操作
    	}
    	var options = $.extend(defaults,options);
    	var $this = $(this);
    	$.ajax({
            url : options.getAjaxUrl,//这个就是请求地址对应sAjaxSource
            data:{level:options.level},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data){
            	console.log(data);
            	if(data.result == true){
            		if(options.againWrite == ''){
            			var obj = data.resultObj;
            			var content = '',
            				contentOne = [],
            				contentTwo = [];
            			(typeof options.showAll=='Boolean')?options.showAll:options.showAll=true;
            			if(options.showAll){
            				content += '<a href="javascript:void(0)" class="listLabelAll active" value=""><span>全部</span></a>';
            			}
            			
                		for(var i = 0;obj.length>i;i++){
                			if(obj[i].parentId == 0){
                				content += '<a href="javascript:void(0)" data-innerid="'+obj[i].innerid+'" data-value="'+i+'"><span>'+obj[i].name+'</span></a>';
                				contentOne.push({
                					innerid:obj[i].innerid,
                					name:obj[i].name,
                					parentId:obj[i].parentId,
                					dataVal:i
                				})
                			}else{
                				contentTwo.push({
                					innerid:obj[i].innerid,
                					name:obj[i].name,
                					parentId:obj[i].parentId
                				})
                			}
                		}
                		$this.append(content);
//                		判读是否存在二级，并进行相应的操作
                		if(contentTwo.length > 0){
                			var contentItem='',
                				inter = 0;
                			for(var i = 0;contentOne.length>i;i++){
                				inter = 0;
                				contentItem='';
                				for(var j = 0;contentTwo.length>j;j++){
                					if(contentOne[i].innerid == contentTwo[j].parentId){
                						if(inter == 0){
                							$this.find('a').eq(i+1).addClass('sortDown').append('<i class="fa fa-angle-left fold"></i>');
                							contentItem += '<div class="mapSortDown sortDownContent hide" data-once="true" data-sort-item="'+contentOne[i].dataVal+'">';
                						}
                						contentItem += '<a href="javascript:void(0)" data-innerid="'+contentTwo[j].innerid+'" data-value-link="'+contentOne[i].dataVal+'" data-value-item="'+contentOne[i].dataVal+j+'"><span>'+contentTwo[j].name+'</span></a>'
                						++inter;
                					}
                				}
                				if(inter > 0){
                					contentItem += '</div>';
                				}
                    			$this.after(contentItem);
                			}
                		}
                		
                		$this.moveRight();
                		
                		if(options.callback == ''){
                			
                		}else{
                			options.callback();
                		}
                		
            		}else{
            			options.againWrite(data);
            		}
            	}
            }
    	})
    };
    
//    将左侧选中的选项放到右侧
    $.fn.moveRight = function(options){
    	var defaults = {
    	}
    	var options = $.extend(defaults,options);
    	
    	var $this = $(this);
    	
    	if($this.siblings('.sortDownContent').length > 0){ //判断是否存在二级,存在二级
    		var count1 = 0;
    		$this.find('a').each(function(){
    			
    			$(this).find('span').click(function(){
    				
    				var $thisA = $(this).parents('a');
    				var itemVal1 = $thisA.clone().removeClass('active').removeClass('sortDown'),
    				
					 	posNum1 = $this.attr('data-position'),
					 	posItemDom1 = $('.alreadyCon').find('[data-position-right="'+posNum1+'"]'),
					 	posItemNum1 = posItemDom1.length,
					 	title1 = $this.parents('.form-group').find('label').text();
    					itemVal1.find('i').remove();
    					
        			if($thisA.hasClass('listLabelAll')){
        				
        				if($thisA.hasClass('active')){
        					
        				}else{
        					$thisA.addClass('active').siblings('a').removeClass('active');
        					$this.siblings('.sortDownContent').addClass('hide').find('a').removeClass('active');
        					$this.find('i').css({
        						'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
        					})
        					
        					if(posItemNum1 > 0){
    							posItemDom1.remove();
    						}
        				}
        				
        			}else{
        				if($thisA.hasClass('active')){
        					$thisA.removeClass('active');
        					
        					var dataCount = $thisA.attr('data-value');
    						posItemDom1.find('dd a').each(function(index){
    							if($(this).attr('data-value') == dataCount){
    								$(this).remove();
    							}
    						});
        					
        					if($thisA.hasClass('sortDown')){
        						
        						$this.siblings('[data-sort-item="'+$thisA.attr('data-value')+'"]').find('a').each(function(){
        							$(this).removeClass('active');
        						})
        						$this.siblings('[data-sort-item="'+$thisA.attr('data-value')+'"]').addClass('hide');
        						$thisA.find('i').css({
        							'-o-transition': 'transform .2s linear',
									'-moz-transition':' transform .2s linear',
									'-webkit-transition': 'transform .2s linear',
									'-ms-transition': 'transform .2s linear',
									'-ms-transform': 'rotate(0deg)',
									'-moz-transform': 'rotate(0deg)',
									'-webkit-transform': 'rotate(0deg)',
									'transform': 'rotate(0deg)'
        						})
        						
        						$('.alreadyCon').find('[data-position-right="'+$thisA.parents('.listLabel').attr('data-position')+'"]').find('dd a').each(function(){
        							if($(this).attr('data-value-link') == $thisA.attr('data-value')){
        								$(this).remove();
        							}
        						})
        						
        						
        					}
        					
        					count1 = 0;
    						var len = $this.find('a').length;
    						$this.find('a').each(function(){
    							if($(this).hasClass('active')){
    							}else{
    								++count1;
    							}



    						})
    						if(count1 == len){
    							$this.find('a.listLabelAll').addClass('active');
    							console.log($thisA.parents('.listLabel').attr('data-position'));
    							$('.alreadyCon').find('[data-position-right="'+$thisA.parents('.listLabel').attr('data-position')+'"]').remove();
    						}
        				}else{
        					$thisA.addClass('active').siblings('a.listLabelAll').removeClass('active');
        					if(posItemNum1 > 0){
    							$('.alreadyCon').find('[data-position-right="'+posNum1+'"]').find('dd').append(itemVal1);
    						}else{
    							var itemConDefault1 ='<div data-position-right="'+posNum1+'"><h6 class="red">'+title1+'</h6><span class="label contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
    							$('.alreadyCon').append(itemConDefault1);
    							$('.alreadyCon').find('[data-position-right="'+posNum1+'"]').find('dd').append(itemVal1);
    							$('[data-position-right="'+posNum1+'"]').contraryFlag();
    						}
        					
        				}
        			}
        		});
    			
//    			二级下拉
    			if($(this).hasClass('sortDown')){
    				var dataPosCon = $(this).parents('.listLabel').attr('data-position');
    				var dataValCon = $(this).attr('data-value');
					$(this).find('i').click(function(){
						if($(this).hasClass('fold')){
							$this.siblings('.sortDownContent').addClass('hide');
							$this.find('i').css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							})
							$this.siblings('[data-sort-item="'+$(this).parents('a').attr('data-value')+'"]').removeClass('hide');
							$(this).css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(-90deg)',
								'-moz-transform': 'rotate(-90deg)',
								'-webkit-transform': 'rotate(-90deg)',
								'transform': 'rotate(-90deg)'
							})
							$(this).removeClass('fold');
						}else{
							$this.siblings('[data-sort-item="'+$(this).parents('a').attr('data-value')+'"]').addClass('hide');
							$(this).css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							})
							$(this).addClass('fold');
						}
					})
					
					var _$this = $(this).attr('data-value');
					$this.siblings('[data-sort-item="'+$(this).attr('data-value')+'"]').find('a').each(function(){
						var jishu = 0
						$(this).click(function(){
							jishu = 0;
							if($(this).hasClass('active')){
								$(this).removeClass('active');
								var itemContent = $(this).attr('data-value-item');
								$('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd a').each(function(){
									if($(this).attr('data-value-item') == itemContent){
										$(this).remove();
									}
								})
								
								$this.siblings('[data-sort-item="'+_$this+'"]').find('a').each(function(){
									if($(this).hasClass('active')){
										++jishu;
									}
								})
								console.log('jishu:'+jishu);
								if(jishu>0){
								
								}else{
									$('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd').append('<a href="javascript:void(0)" data-value="'+_$this+'" class=""><span>经济</span></a>')
								}
								
							}else{
								$(this).addClass('active');
								$(this).parents('.sortDownContent').siblings('.listLabel').find('a.listLabelAll').removeClass('active');
								
								var yijiDom = $(this).parents('.sortDownContent').siblings('.listLabel').find('[data-value="'+$(this).attr('data-value-link')+'"]');
								if(yijiDom.hasClass('active')){
									
								}else{
									yijiDom.addClass('active');
								}
								
								var dom1 = $('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]');
								var domItem = $(this).clone().removeClass('active');
								if(dom1.length > 0){
									if(dom1.find('[data-value="'+dataValCon+'"]').length > 0){
										dom1.find('a[data-value="'+dataValCon+'"]').remove();
										dom1.find('dd').append(domItem);
									}else{
										dom1.find('dd').append(domItem);
									}
								}else{
									var title2 = $(this).parents('.form-group').find('label').text();
									var itemConDefault2 ='<div data-position-right="'+dataPosCon+'"><h6 class="red">'+title2+'</h6><span class="label contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
	    							$('.alreadyCon').append(itemConDefault2);
	    							$('.alreadyCon').find('[data-position-right="'+dataPosCon+'"]').find('dd').append(domItem);
	    							$('[data-position-right="'+dataPosCon+'"]').contraryFlag();
								}
							}
						})
					})
				}
    		})
    	}else{//不存在二级
    		$this.find('a').each(function(index){
    			$(this).click(function(){
    				
    				var itemVal = $(this).clone().removeClass('active'),
					 	posNum = $this.attr('data-position'),
					 	posItemDom = $('.alreadyCon').find('[data-position-right="'+posNum+'"]'),
					 	posItemNum = posItemDom.length,
					 	title = $this.parents('.form-group').find('label').text();
    				
    				if($(this).hasClass('listLabelAll')){
    					if($(this).hasClass('active')){
    						
    					}else{
    						$(this).addClass('active').siblings('a').removeClass('active');
    						if(posItemNum > 0){
    							posItemDom.remove();
    						}
    					}
    				}else{
    					if($(this).hasClass('active')){
    						$(this).removeClass('active');
    						var dataCount = $(this).attr('data-value');
    						posItemDom.find('dd a').each(function(index){
    							if($(this).attr('data-value') == dataCount){
    								$(this).remove();
    							}
    						});
    						var count = 0,
    							len = $this.find('a').length;
    						$this.find('a').each(function(){
    							if($(this).hasClass('active')){
    							}else{
    								++count;
    							}
    						})
    						if(count == len){
    							$this.find('a.listLabelAll').addClass('active');
    							$('.alreadyCon').find('[data-position-right="'+posNum+'"]').remove();
    						}
    					}else{
    						$(this).addClass('active').siblings('a.listLabelAll').removeClass('active');
    						
    						if(posItemNum > 0){
    							$('.alreadyCon').find('[data-position-right="'+posNum+'"]').find('dd').append(itemVal);
    						}else{
    							var itemConDefault ='<div data-position-right="'+posNum+'"><h6 class="red">'+title+'</h6><span class="label  contraryFlag" data-flag="0">反选</span><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>' ;
    							$('.alreadyCon').append(itemConDefault);
    							$('.alreadyCon').find('[data-position-right="'+posNum+'"]').find('dd').append(itemVal);
    							
    							$('[data-position-right="'+posNum+'"]').contraryFlag();
    						}
    					}
    					
    				}
    			});
    		})
    	}
    }
//    我的定制-保存
    $.fn.conserve = function(options){
    	var defaults = {
    		modalName:'.alreadyCon',
    		ajaxUrl:'',	
    		data:{
    			'name': $.trim($('#addCustomName').val()),
				'keywords':'',
				'source':'',
				'carrier':'',
				'classification':'',
				'region':'',
				'timeCycle':6,
				'timeRange':78,
				'websites':'',
				'classifyFlag':'0',
				'sourceFlag':'0',
				'regionFlag':'0',
				'carrierFlag':'0'
    		},
    		callback:''
    	}
    	var options = $.extend(defaults,options);
    	var $this = $(this);
    	var $alreadyCon = $(options.modalName);
    	var customParam = options.data;
    	var inter = 0;
//		关键词组
		if($alreadyCon.find('[data-position-right="1"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-right="1"] .dictionaryWord').find('span').text() + '@';
		}else{
            ++inter;
        }
		if($alreadyCon.find('[data-position-right="2"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-right="2"] .dictionaryWord').find('span').text() + '@';
		}else{
			++inter;
		}
		if($alreadyCon.find('[data-position-right="3"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-right="3"] .dictionaryWord').find('span').text() + '@';
		}else{
			++inter;
		}
		if($alreadyCon.find('[data-position-right="4"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-right="4"] .dictionaryWord').find('span').text() + '@';
		}else{
			++inter;
		}
		if($alreadyCon.find('[data-position-right="5"]').length > 0){
			customParam.keywords += $alreadyCon.find('[data-position-right="5"] .dictionaryWord').find('span').text() + '@';
		}else{
			++inter;
		}
		var keyword=$('#addKeyWordInput').val();
		if(inter == 5&&!keyword){
			$('.keywordsBox .keywordPrompting').remove();
			$('.keywordsBox .text-muted').after('<p class="keywordPrompting red">关键词组不能为空！</p>');
			return false;
		}else{
			$('.keywordsBox .keywordPrompting').remove();
		}
//		来源
		if($alreadyCon.find('[data-position-right="6"]').length > 0){
			$alreadyCon.find('[data-position-right="6"]').find('dd a').each(function(){
				customParam.source += $(this).attr('data-innerid') + '@';
			})
			customParam.sourceFlag = $alreadyCon.find('[data-position-right="6"]').find('.contraryFlag').attr('data-flag');
		}
		
//		载体
		if($alreadyCon.find('[data-position-right="10"]').length > 0){
			$alreadyCon.find('[data-position-right="10"]').find('dd a').each(function(){
				customParam.carrier += $(this).attr('data-innerid') + '@';
			})
			customParam.carrierFlag = $alreadyCon.find('[data-position-right="10"]').find('.contraryFlag').attr('data-flag');
		}
		
//		分类
		if($alreadyCon.find('[data-position-right="7"]').length > 0){
			$alreadyCon.find('[data-position-right="7"]').find('dd a').each(function(){
				customParam.classification += $(this).attr('data-innerid') + '@';
			})
			customParam.classifyFlag = $alreadyCon.find('[data-position-right="7"]').find('.contraryFlag').attr('data-flag');
		}
//		地区
		if($alreadyCon.find('[data-position-right="8"]').length > 0){
			$alreadyCon.find('[data-position-right="8"]').find('dd a').each(function(){
				customParam.region += $(this).attr('data-innerid') + '@';
			})
			customParam.regionFlag = $alreadyCon.find('[data-position-right="8"]').find('.contraryFlag').attr('data-flag');
		}
		
//		时间段
		if($alreadyCon.find('[data-position-right="9"]').length > 0){
			var starttime = $alreadyCon.find('[data-position-right="9"]').find('.startTimeVal').text().replace(/-/g,'/');
			
			var inputEndText = $alreadyCon.find('[data-position-right="9"]').find('.endTimeVal').text();
			if(inputEndText == '至今'){
				var endtime = '2999/01/01';
			}else{
				var endtime = inputEndText.replace(/-/g,'/');
			}
//			var endtime = $alreadyCon.find('[data-position-right="9"]').find('.endTimeVal').text().replace(/-/g,'/');
			starttime = new Date(starttime);
			endtime = new Date(endtime);
			customParam.startDatetime = starttime;
			customParam.endDatetime = endtime;
		}
        console.log(customParam)
		$.ajax({
            url : options.ajaxUrl,//这个就是请求地址对应sAjaxSource
            data:options.data,
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data){
            	console.log(data.result);
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
            		
            		if(options.callback == undefined){
            			return
            		}else{
            			options.callback(data.resultObj);
            		}
            		
            	}else{
                    if('0' == data.errorCode){
                        $().toastmessage('showToast', {
                            //提示信息的内容
                            text: '定制数量超过最大数量,定制失败！',
                            //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                            sticky: false,
                            //显示的位置，默认为右上角
                            position : 'bottom-right',
                            //显示的状态。共notice, warning, error, success4种状态
                            type: 'error',
                        });
					}else {
                        $().toastmessage('showToast', {
                            //提示信息的内容
                            text: '定制失败！',
                            //是否固定，true：点击关闭按钮关闭，false：默认3秒钟后自动消失
                            sticky: false,
                            //显示的位置，默认为右上角
                            position : 'bottom-right',
                            //显示的状态。共notice, warning, error, success4种状态
                            type: 'error',
                        });
					}
            	}
            }
        })
    };
    //点击重置按钮
	$('.reset').click(function(){
        $('.conserve').attr('data-once','0');
		$('.alreadyCon').html('');
		$('.col-md-8 .form-horizontal .form-group').each(function(){
			$(this).find("a").eq(0).addClass('active').siblings().removeClass('active');
		})
        $('.col-md-8 .form-horizontal .form-group').each(function(){
        	$(this).find("#addCustomName").val('');
        })
	})
	//修改定制条件
    $.fn.editCustom = function(timeCode){
    	$.ajax({
            url : ctx+'/custom/front/toUpdate',//这个就是请求地址对应sAjaxSource
            data:{'timeCode':timeCode},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
            	console.log(data);
            	if(data.result == true){
            		var obj = data.resultObj;
//            		定制名称
            		$('#addCustomName').val(obj.name);
//            		关键词
            		var keyWords = obj.keywords;
            		keyWords = keyWords.split('@');
            		for(var i = 0;keyWords.length>i;i++){
            			if(keyWords[i] != ''){
            				if(i<1){
            					$('#addKeyWordInput').val(keyWords[i]);
            					$('#addKeyWordInput').change();
            				}else{
            					$('.keywordsBox').find('.has-feedback:last').find('input').val(keyWords[i]);
            					$('.keywordsBox').find('.has-feedback:last').find('input').change();
            				}
            			}
            		}
            		
//            		来源
            		var source = obj.source;
            		if(source != null){
            			source = source.split('@');
                		for(var j = 0;source.length>j;j++){
                			if(source[j] != ''){
                				$('#source').find('a').each(function(){
                        			if($(this).attr('data-innerid') == source[j]){
                        				$(this).click();
                        			}
                        		})
                			}
                		}
                		if(obj.sourceFlag == '1'){
                			$('[data-position-right="6"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.sourceFlag);
                		}else{
                			$('[data-position-right="6"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.sourceFlag);
                		}
            		}
//            		载体
            		var carrier = obj.carrier;
            		if(carrier != null){
            			carrier = carrier.split('@');
                		for(var j = 0;carrier.length>j;j++){
                			if(carrier[j] != ''){
                				$('#carrier').find('a').each(function(){
                        			if($(this).attr('data-innerid') == carrier[j]){
                        				$(this).click();
                        			}
                        		})
                			}
                		}
                		if(obj.carrierFlag == '1'){
                			$('[data-position-right="10"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.carrierFlag);
                		}else{
                			$('[data-position-right="10"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.carrierFlag);
                		}
            		}
            		
//            		分类
            		var classification = obj.classification;
            		if(classification != null){
            			classification = classification.split('@');
                		for(var count = 0;classification.length>count;count++){
                			if(classification[count] != ''){
                				$('#classification').find('a').each(function(){
                					if($(this).attr('data-innerid') == classification[count]){
                						$(this).find('span').click();
                					}
                				}) 
//                				先将二级页打开，否则查询不到
                				var jishu = 0;
                				$('#classification').siblings('.sortDownContent').each(function(){
                					$(this).removeClass('hide');
                					$(this).find('a').each(function(){
                						if($(this).attr('data-innerid') == classification[count]){
                							$(this).click();
                							++jishu;
                						}
                					})
                					
                					$(this).addClass('hide');

                				})
                			}
                		}
                		if(obj.classifyFlag == '1'){
                			$('[data-position-right="7"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.classifyFlag);
                		}else{
                			$('[data-position-right="7"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.classifyFlag);
                		}
            		}
            		
//            		地区
            		var region = obj.region;
            		if(region != null){
            			region = region.split('@');
                		for(var count1 = 0;region.length>count1;count1++){
                			if(region[count1] != ''){
                				$('#map').find('a').each(function(){
                					if($(this).attr('data-innerid') == region[count1]){
                						$(this).find('span').click();
                					}
                				}) 
//                				先将二级页打开，否则查询不到
                				var jishu1 = 0;
                				$('#map').siblings('.sortDownContent').each(function(){
                					$(this).removeClass('hide');
                					$(this).find('a').each(function(){
                						if($(this).attr('data-innerid') == region[count1]){
                							$(this).click();
                							++jishu1;
                						}
                					})
                					$(this).addClass('hide');
                				})
                			}
                		}
                		if(obj.regionFlag == '1'){
                			$('[data-position-right="8"]').find('.contraryFlag').addClass('active').attr('data-flag',obj.regionFlag);
                		}else{
                			$('[data-position-right="8"]').find('.contraryFlag').removeClass('active').attr('data-flag',obj.regionFlag);
                		}
            		}
            		
//            		开始时间、结束时间
            		if(obj.startDatetime != null){
            			var startT = new Date(obj.startDatetime).formatDate('yyyy-MM-dd');
            			$('#begin_time').val(startT);
            			if(obj.endDatetime == '' || obj.endDatetime == null){
            				$('#end_time').val('');
            			}else{
            				var endT = new Date(obj.endDatetime).formatDate('yyyy-MM-dd');
                    		$('#end_time').val(endT);
            			}
                		
            		}

            	}
            }
    	})
    	
    }
    
//    反选
    $.fn.contraryFlag = function(options){
    	var defaults = {
    	}
    	var options = $.extend(defaults,options);
    	
    	$(this).find('.contraryFlag').click(function(){
    		var _$this = $(this);
    		if(_$this.hasClass('active')){
    			_$this.removeClass('active');
    			_$this.attr('data-flag','0');
    		}else{
    			_$this.addClass('active');
    			_$this.attr('data-flag','1');
    		}
    	})
    }
    
})(jQuery);

$(function(){
//	alert($('.accordion.li').length());
	var nowTime = '';
		nowTime = new Date().formatDate('yyyy-MM-dd');
		
	var jzjishu = 0;
	
	var timeCode = '';
	$('.accordion li').each(function(){
		if($(this).hasClass('open')){
			timeCode = $(this).find('.link').attr('data-customgroup');
		}
	})
	
//	来源
	$('#source').getData({
		getAjaxUrl:ctx+'/common/dic/front/listSourceOrgOnly',//请求路径
		callback:function(){
			++jzjishu;
		}
	})
//	载体
	$('#carrier').getData({
		getAjaxUrl:ctx+'/common/dic/front/listcarrier',//请求路径
		callback:function(){
			++jzjishu;
		}
	})
//	分类
	$('#classification').getData({
		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',//请求路径
		callback:function(){
			++jzjishu;
		}
	})
//	地区
	$('#map').getData({
		getAjaxUrl:ctx+'/common/dic/front/listRegion',//请求路径
		callback:function(){
			++jzjishu;
		}
	})

//	关键词
	$().addKeyWords();

//	时间段
	
	var start = {
			skinCell:"jedatered",
		    format: 'YYYY-MM-DD ',
		    festival:false,
		    ishmsVal:false,
		    isToday:true,
		    isinitVal:true,
		    initAddVal:[-0],
		    maxDate: '', //最大日期
		    choosefun: function(elem,val){
		        end.minDate = val; //开始日选好后，重置结束日的最小日期
		        if($.trim(val) > nowTime){
		        	end.isToday = false;
		        }else{
		        	end.isToday = true;
		        }
		        if($('.alreadyCon').find('[data-position-right="9"]').length > 0){
		        	$('.alreadyCon').find('[data-position-right="9"]').find('a.startTimeVal>span').text(val);
		        }else{
		        	var endText;
		        	console.log($('#end_time').val());
		        	if($('#end_time').val() == ''){
		        		endText = '至今'
		        	}else{
		        		endText = $('#end_time').val();
		        	}
		        	var content = '<h6 class="red">时间段</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a class="startTimeVal" href="javascript:void(0)"><span>'+val+'</span></a> - <a class="endTimeVal" href="javascript:void(0)"><span>'+endText+'</span></a></dd></dl></div>';
		        	$('.alreadyCon').append('<div data-position-right="9">'+content+'</div>');
		        }
		    },
		    clearfun:function(elem, val) {
		    	end.minDate = '';
		    	end.isToday = true;
		    },
		};
		var end = {
			skinCell:"jedatered",	
		    format: 'YYYY-MM-DD ',
		    festival:false,
		    isToday:true,
		    isinitVal:false,
		    maxDate: '', //最大日期
		    choosefun: function(elem,val){
		        start.maxDate = val; //将结束日的初始值设定为开始日的最大日期
		        if($.trim(val) < nowTime){
		        	start.isToday = false;
		        }else{
		        	start.isToday = true;
		        }
		        
		        if($('.alreadyCon').find('[data-position-right="9"]').length > 0){
		        	$('.alreadyCon').find('[data-position-right="9"]').find('a.endTimeVal>span').text(val);
		        }else{
		        	var content = '<h6 class="red">时间段</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a class="startTimeVal" href="javascript:void(0)"><span>'+$('#begin_time').val()+'</span></a> - <a class="endTimeVal" href="javascript:void(0)"><span>'+val+'</span></a></dd></dl></div>';
		        	$('.alreadyCon').append('<div data-position-right="9">'+content+'</div>');
		        }
		    },
		    clearfun:function(elem, val) {
		    	start.maxDate = '';
		    	start.isToday = true;
		    	if($('.alreadyCon').find('[data-position-right="9"]').length > 0){
		        	$('.alreadyCon').find('[data-position-right="9"]').find('a.endTimeVal>span').text('至今');
		        }
		    },
		};
		
		
	$("#begin_time").jeDate(start);
	$("#end_time").jeDate(end);
	$("#end_time").blur(function(){
		if($("#end_time").val() == ''){
			if($('.alreadyCon').find('[data-position-right="9"]').length > 0){
	        	$('.alreadyCon').find('[data-position-right="9"]').find('a.endTimeVal>span').text('至今');
	        }
		}
	})

	//获取已添加的新闻线索名称和数量
	//	var localstoredata=localStorage.newsdata;
	var num = localStorage.len;
	var customNews = JSON.parse(localStorage.customNewsArray);
	var contentweb = getNewsHtml(customNews);
	$('.hasAddWeb').append(contentweb);


	var timeCode;//全局共享的变量

    //获取新闻线索的编辑信息

    $('.hasAddWeb').on('click','.contentWidth',function(){
        $('.next-step').css('display','none');
        $('.hiddenContainer').show();
    	timeCode = $(this).attr('data-customGroup');
        $().editCustom(timeCode);
        $(window).scrollTop(0);
		$('.conserve').attr('data-isedit','edited');
	})



	//点击保存按钮，根据条件判断是保存还是更新操作
    $('.conserve').click(function(e){
        if($('.conserve').attr('data-once') == '0'){
            if($('.conserve').attr('data-isedit') == 'noedited'){
                $().conserve({
                    ajaxUrl: ctx + '/custom/front/create',
                    callback: function (data) {
					//点击保存以后，刷新整个页面
                        window.location.reload();
                    }
                })
            }else{
                $().conserve({
                    ajaxUrl:ctx+'/custom/front/update?timeCode='+timeCode,
                    callback:function(data){
					//点击保存以后，刷新整个页面
                        window.location.reload();
                    }
                })
            }
            $('.conserve').attr('data-once','1');
        }else{
            return;
        }
    })

	//删除新闻线索
    var timeCode1;
    $('.hasAddWeb').on('click','.blodFont',function(){
    	var $this = $(this);
        timeCode1 = $(this).attr('data-customGroup');
        setModalContent('是否删除这条新闻线索','确定','取消',function(){
            deleteMethod(timeCode1,$this);
        });
        $('.conserve').attr('data-isedit','edited');
    })

	function deleteMethod(timeCode1,ele){
        $.ajax({
            url : ctx+'/custom/front/delete',//这个就是请求地址对应sAjaxSource
            data:{timeCode:timeCode1},
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
                if(data.result){
                    ele.parent().remove();
                    // 删除后更新本地缓存
                    var newsdataArray = JSON.parse(localStorage.customNewsArray);
                    var arr = newsdataArray.filter(function(item){
                    	return item.customGroup != timeCode1;
                    });
                    localStorage.customNewsArray = JSON.stringify(arr);
				}
            }
        })
	}

    $('.next-step').click(function(){
    	if($('#addKeyWordInput').val()){
            $('.hiddenContainer').show();
            $(this).css('display','none');
		}else{
            setModalContent('关键词组不能为空！','确定','取消')
    		return false;
		}
    })
    chooseSimilarityForFirst();
    function chooseSimilarityForFirst() {
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
//遍历匹配
        var username = "";
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == "username") {
                username = arr[1];
            }
        }
        var isFirst = localStorage.getItem(username + "firstentercustom")
        if (!isFirst) {
            localStorage.setItem(username + "firstentercustom", "1");
            $('.tipnum').tooltip('show');
            $('.tooltip,.tooltip-arrow').css('top','72px');
            $('.tooltip-arrow').css('top','10px');
        }
        $('.tipnum').tooltip('hide');
    }

    function setModalContent( content,confirm,cancel ,callback1,callback2){
        $('#deleteDialog').modal('show');
        $('#deleteDialog .modal-body p').text(content);
        $('#deleteDialog .modal-body .btn-red').text(confirm);
        $('#deleteDialog .modal-body .btn-default').text(cancel);
        $('.btn-red').click(function(){
        	$(this).unbind();
			$('#deleteDialog').modal('hide');
            if(callback1){
                callback1();
            }else{
                return false;
            }
        })
    }


});