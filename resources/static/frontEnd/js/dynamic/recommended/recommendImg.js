var getImgAjaxData1,
batchCheckWebPageCode = [], //被选择的新闻的webpageCode
tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode
$(function(){
	
	$('.merge').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			getImgAjaxData1.ajax.reload();
		}else{
			$(this).addClass('active');
			getImgAjaxData1.ajax.reload();
		}
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
					$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
					getImgAjaxData1.ajax.reload();
				}
				
			}
		})
	})
    //从推荐系统获取推荐新闻
    getRecommendNews(87);

	
	getSourcesData();
})

/**
 * 查询来源数据
 */

function getSourcesData(){
	$.ajax({
        url : ctx+'/common/dic/front/listSourceOrg',//这个就是请求地址对应sAjaxSource
//        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	if(data.result == true){
        		var obj = data.resultObj;
        		
        		var content ='';
        		content += '<li role="presentation" class="sourcesItem"><a role="menuitem" tabindex="-1" href="#" data-innerid="">全部</a></li>';
            	for(var count=0;obj.length>count;count++){
            		content += '<li role="presentation" class="sourcesItem"><a role="menuitem" tabindex="-1" href="#" data-innerid="'+obj[count].innerid+'">'+obj[count].name+'</a></li>'
            	}
            	$('#sourceSelect').append(content);
            	
            	$('.dropdown-menu .sourcesItem').each(function(){
            		$(this).click(function(){
            			$('#sourcesCon').html($(this).text()+'&nbsp;<span class="caret"></span>').attr('data-innerid',$(this).find('a').attr('data-innerid'));
            			getImgAjaxData1.ajax.reload();
            		})
            	})
        	}
        }
	})
}

function getPassValue(aoData){
	
//	机构来源
	var sourcesOrg = [];
	var sourcesOrgId = $('#sourcesCon').attr('data-innerid');
	sourcesOrg.push(sourcesOrgId);
	
//	是否相似
	var showSimilar = '';
	if($('.merge').hasClass('active')){
		showSimilar = new Boolean(false);
	}else{
		showSimilar = new Boolean(true);
	}
	
	aoData.push(
			{'name':'sourcesOrg','value':sourcesOrg},
			{'name':'showSimilar','value':showSimilar},
			{"name":"recommendType","value":87}
	);
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

/*每隔60秒刷险一次列表*/
function refreshButton(){
	var init;
	$('.refreshButton').click(function(){
		
		var _$this = $(this).find('i');
		if(_$this.hasClass('fa-spin')){
			_$this.removeClass('fa-spin');
			clearInterval(init);
		}else{
			_$this.addClass('fa-spin');
			init = setInterval(function(){
				getImgAjaxData1.ajax.reload();
			},60000);
		}
		
	});
}

/**
 * 从推荐系统获取推荐新闻
 */
function getRecommendNews(recommendType){
	$.ajax({
        url : ctx+'/recommend/front/get?recommendType='+recommendType,//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        success : function(data) {
        	if(data.result == true){
                //表格进行数据传值
                getImgAjaxData1 = $().getImgAjaxData({
                    'requestUrl':ctx+'/recommend/front/news/page',
                    'getPassValue':getPassValue
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
                    tableItemWebPageCodeArr =[];
					var releaseDateTimeArr = [];
                    if(textArr.length > 0){
                        for(var count = 0;textArr.length>count;count++){
							tableItemWebPageCodeArr.push(textArr[count].webpageCode);
							releaseDateTimeArr.push(textArr[count].releaseDatetime);
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

//			收藏
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
								'releaseDatetime': releaseDateTimeArr[index],
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
                                                'width':'85%'
                                            });
                                            $(this).append('<span class="label-status label-jian">【建】</span>');
                                        }else if(data[index][0] == 2){
                                            $(this).find('a').css({
                                                'width':'85%'
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


                    $("[data-toggle='tooltip']").tooltip();
//		鼠标划入图片放大
//		$(".site-piclist_pic").imgEnlarge();
                });
        	}
        }
	})
}
