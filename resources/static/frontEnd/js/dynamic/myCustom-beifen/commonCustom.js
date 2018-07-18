
/**
 * 这个js文件中，包含添加关键词组，将选中的部分复制到右侧已添加的定制
 * 在我的定制中，热点、头条会有与通用不一致的选择条件，可以直接调用本文件中的函数
 * 
 */


//添加关键词组
function addKeyWords(className){
	
	className.find('.addKeyword').each(function(index){
		if($(this).attr('data-show') == 'false'){
			$(this).click(function(){
				var count = parseInt($(this).siblings('input').val());
				var plug = count + 2;
				var content = '<div class="form-group  has-feedback"> <input type="text" class="form-control" data-position="'+plug+'" placeholder="请输入关键词组，并以逗号隔开"/><span class="glyphicon glyphicon-remove form-control-feedback"></span></div>';
				if(count < 4){
					$(this).parents().siblings('.keywordsBox').append(content);
					$(this).siblings('input').attr('value',++count);
					keywordsDelete(className);
					
					var $this = className.find('.has-feedback:last').find('input');
					var dataPos = $this.attr('data-position');
					
					addAlreadyKeyWords(className,$this,dataPos);
					
				}else {}
			});
			$(this).attr('data-show','true');
		}
	});
}

//添加的关键词组进行删除
function keywordsDelete(className){
	className.find('.form-control-feedback').each(function(){
		$(this).click(function(){
			var count = $(this).parents('.keywordsBox').siblings().find('input').val();
			$(this).parents('.keywordsBox').siblings().find('input').val(--count);
			
//			删除右侧已经添加的选项
			var plug = $(this).siblings().attr('data-position');
			if(className.find('.alreadyCon').find('[data-position-item="'+plug+'"]').length>0){
				className.find('[data-position-item="'+plug+'"]').remove();
			}
			
//			删除这个input输入框
			$(this).parents('.has-feedback').remove();
		})
	})
}

//已定制-关键词组

/**
 * className:通用、线索等外部的class值
 * inputName：添加关键词组，这个input的class值
 * dataPos：在右侧已定制条件中，data-position-item的值
 */
function addAlreadyKeyWords(className,inputName,dataPos){
	inputName.change(function(){
		var inputWord = inputName.val();
		if(inputWord == ''){
			className.find('[data-position-item="'+dataPos+'"]').remove();
		}else{
			
			if(className.find('[data-position-item="'+dataPos+'"]').length > 0){
				className.find('[data-position-item="'+dataPos+'"]').find('.dictionaryWord span').text(inputWord);
			}else{
				if(dataPos == 1){
					var keyWordCon = '<div data-position-item="'+dataPos+'"><h6 class="red">包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>';
				}else{
					var keyWordCon = '<div data-position-item="'+dataPos+'"><h6 class="red">或 包含关键词组</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd><a href="javascript:void(0)" class="dictionaryWord"><span>'+inputWord+'</span></a></dd></dl></div></div>'
				}
				className.find('.alreadyCon').append(keyWordCon);
			}
		}
	})
}

//已定制条件
function addCustomCondition(className){
	
/**
 * 添加关键词组
 */
	var inputIdName = className.find('#addKeyWordInput');
	addAlreadyKeyWords(className,inputIdName,1);
	
/**
 * 来源
 */	
	addFirstAlready(className,'#source',6);
	
/**
 * 分类
 */	
	addSecondAlready(className,'#classification',7);
//	分类添加的二级
	var classNameItem1 = className.find('#classification').parent().find('.sortDownContent');
	addAlreadySort(className,classNameItem1,3,7);
	
/**
 * 地区
 */
	addSecondAlready(className,'#map',8);
//	地区添加的二级
	var classNameItem2 = className.find('#map').parent().find('.sortDownContent');
	addAlreadySort(className,classNameItem2,4,8);
}

//对没有二级操作的来源等添加到右侧
/**className:分类、地区、来源所在模块
 * moduleName:所在模块的class值，例如：'#map'
 * dataPos:所在模块添加到右侧以后data-position-item的值，例如：8
 */
function addFirstAlready(className,moduleName,dataPos){
	//找到className下的moduleName
	var $thisName = className.find(moduleName);
	
	$thisName.find('a').each(function(){
		var sorcesItem;
		$(this).click(function(){
			if($(this).hasClass('listLabelAll')){
				className.find('[data-position-item="'+dataPos+'"]').remove();
			}else{
				if($(this).hasClass('active')){
					
					sorcesItem = $(this).clone().removeClass('active');
					if(className.find('[data-position-item="'+dataPos+'"]').length > 0){
						//判断是否是单选，将里面的内容清空
						if($(moduleName).attr('data-choose-style') == 'radio'){
							className.find('[data-position-item="'+dataPos+'"]').find('dd').html('');
						}
						className.find('[data-position-item="'+dataPos+'"]').find('dd').append(sorcesItem);
					}else{
						var title = $(moduleName).parent().siblings('label').text();
						var sourcesCon = '<div data-position-item="'+dataPos+'"><h6 class="red">'+title+'</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>';
						className.find('.alreadyCon').append(sourcesCon);
						className.find('[data-position-item="'+dataPos+'"]').find('dd').append(sorcesItem);
					}
				}else{
					var plug = $(this).attr('data-value');
					className.find('[data-position-item="'+dataPos+'"]').find('[data-value="'+plug+'"]').remove();
					if(className.find('[data-position-item="'+dataPos+'"] [data-value]').length == 0){
						className.find('[data-position-item="'+dataPos+'"]').remove();
					}
				}
			}
		})
	});
}

//对有二级的分类、地区，将其添加到右侧
/**className:分类、地区、来源所在模块
 * moduleName:所在模块的class值，例如：'#map'
 * dataPos:所在模块添加到右侧以后data-position-item的值，例如：8
 */
function addSecondAlready(className,moduleName,dataPos){
	//找到className下的moduleName
	var $thisName = className.find(moduleName);
	
	$thisName.find('a').each(function(){
		var sorcesItem;
		$(this).click(function(){
			if($(this).hasClass('listLabelAll')){
				className.find('[data-position-item="'+dataPos+'"]').remove();
				$thisName.siblings('.sortDownContent').addClass('hide').find('a').removeClass('active');
			}else{
				if($(this).hasClass('active')){
					sorcesItem = $(this).clone().removeClass('active');
					if(className.find('[data-position-item="'+dataPos+'"]').length > 0){
						className.find('[data-position-item="'+dataPos+'"]').find('dd').append(sorcesItem);
					}else{
						var title = $(moduleName).parent().siblings('label').text();
						var sourcesCon = '<div data-position-item="'+dataPos+'"><h6 class="red">'+title+'</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>';
						className.find('.alreadyCon').append(sourcesCon);
						className.find('[data-position-item="'+dataPos+'"]').find('dd').append(sorcesItem);
					}
					className.find('[data-position-item="'+dataPos+'"] [data-value]').find('i').addClass('hide');
				}else{
					var plug = $(this).attr('data-value');
					className.find('[data-position-item="'+dataPos+'"]').find('[data-value="'+plug+'"]').remove();
					if(className.find('[data-position-item="'+dataPos+'"] [data-value]').length == 0){
						className.find('[data-position-item="'+dataPos+'"]').remove();
					}
				}
			}
		})
	});
}

//分类添加的二级
//判断是否存在二级，对二级内容进行操作
/**
 * className:模块下的分类class值（sortDownContent）
 * posNum：当前分类一级的 data-value 的值
 * alreadyNum：在右侧已选模块中 data-position-item 的值
 */
function addAlreadySort(className,classNameItem,posNum,alreadyNum){
	classNameItem.each(function(){
		var dataVal = $(this).attr('data-sort-item');
		var sortDownItem;
		$(this).find('a').each(function(){
			$(this).click(function(){
				var dataText = className.find('[data-position="'+posNum+'"]').find('[data-value="'+dataVal+'"]').text();
				if($(this).hasClass('active')){
					sortDownItem = $(this).clone().removeClass('active');
					sortDownItemVal = '<span>'+dataText+' - '+sortDownItem.text()+'</span>';
					if(className.find('[data-position-item="'+alreadyNum+'"]').length >0){
						
						if(className.find('[data-position-item="'+alreadyNum+'"] [data-value="'+dataVal+'"]').length > 0){
							className.find('[data-position-item="'+alreadyNum+'"] [data-value="'+dataVal+'"]').addClass('hide');
						}
						
					}else{
						var title =$(this).parent('.sortDownContent').parent().siblings('label').text();
						var addContent = '<div data-position-item="'+alreadyNum+'"><h6 class="red">'+title+'</h6><div class="listLabel"><dl class="dl-horizontal m-bottom"><dd></dd></dl></div></div>'
						className.find('.alreadyCon').append(addContent);
					}
					
					className.find('[data-position-item="'+alreadyNum+'"]').find('dd').append(sortDownItem.html(sortDownItemVal));
					
					
				}else{
					var plug = $(this).attr('data-value-item');
					className.find('[data-position-item="'+alreadyNum+'"]').find('[data-value-item="'+plug+'"]').remove();
					
					if(className.find('[data-position-item="'+alreadyNum+'"] [data-value]').length == 0 && className.find('[data-position-item="'+alreadyNum+'"] [data-value-item]').length == 0){
						className.find('[data-position-item="'+alreadyNum+'"]').remove();
					}
					if(className.find('[data-position-item="'+alreadyNum+'"] [data-value-item]').length == 0){
						className.find('[data-position-item="'+alreadyNum+'"] [data-value="'+dataVal+'"]').removeClass('hide');
					}
				}
				
			})
		})
	})
}

/**
 * 获得来源、分类、地区的后台数据
 * @param className
 */
function getSourcesData(className,callback,cbparam){
	var jishu = 0;
//	来源
	getAttrFirstData(className,ctx+'/common/dic/front/listSourceOrg','#source',function(){++jishu});
	
//	分类
	getAttrSecondData(className,ctx+'/common/dic/front/listNewsClassification','#classification','classificationSortDown',function(){++jishu});
	
//	地区
	getAttrSecondData(className,ctx+'/common/dic/front/listRegion','#map','mapSortDown',function(){++jishu});
	
//	判断是否加载完，加载完执行回调函数
	function show(){
//		console.log(jishu);
		if(jishu == 3){
			callback(cbparam);
			clearInterval(time);
		}
	}
	var time = setInterval(show,100);
}
	
/**
 * 获取添加定制条件中，没有二级的的属性获取后台值
 * @param className  
 * @param getAjaxUrl  获取后台的路径
 * @param idName 从后台收到的数据添加的模块的ID名称
 * @param callback  回调函数
 */	
function getAttrFirstData(className,getAjaxUrl,idName,callback){
	$.ajax({
        url : getAjaxUrl,//这个就是请求地址对应sAjaxSource
//	        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	if(data.result == true){
        		var obj = data.resultObj;
        		var sourcesContent = '';
        		if(idName != '#clusterFrequency' && idName != '#clusterRange'){
        			sourcesContent = '<a href="javascript:void(0)" class="listLabelAll active" value=""><span>全部</span></a>';
        		}
            	for(var count =0;obj.length>count;count++){
            		sourcesContent += '<a href="javascript:void(0)" data-value="'+count+'" data-innerid="'+obj[count].innerid+'"><span>'+obj[count].name+'</span></a>'
            	}
            	className.find(idName).append(sourcesContent);
            	if(callback != undefined){
            		callback();
            	}
        	}
        	
//        	++jishu;
//        	console.log('来源'+jishu);
        }
	})
}

/**
 * 获取添加定制条件中，有二级的属性获取后台值
 * @param className
 * @param getAjaxUrl
 * @param idName
 * @param secondClassName 二级的class值
 * @param callback
 */
function getAttrSecondData(className,getAjaxUrl,idName,secondClassName,callback){
	$.ajax({
        url :getAjaxUrl,//这个就是请求地址对应sAjaxSource
//	        data:{'requestId':requestId,'startTime':startTime,'endTime':endTime},
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
//        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var classificationFirstCon = '<a href="javascript:void(0)" class="active listLabelAll" value=""><span>全部</span></a>';
            	for(var count =0 ;obj.length>count;count++){
            		if(obj[count].parentId == '0'){
            			var regionSecondItem = [];
            			var regionFirstName = obj[count].innerid;
            			for(var plug = 0;plug<obj.length;plug++){
            				if(regionFirstName == obj[plug].parentId){
            					regionSecondItem.push(obj[plug]);
            				}
            			}
            			
            			var textContent='';
            			if(regionSecondItem.length == 0){
            				classificationFirstCon += '<a href="javascript:void(0)" data-value="'+count+'" data-innerid="'+obj[count].innerid+'"><span>'+obj[count].name+'</span></a>';
            			}else{
            				classificationFirstCon += '<a href="javascript:void(0)" class="sortDown" data-value="'+count+'" data-innerid="'+obj[count].innerid+'"><span>'+obj[count].name+'</span><i class="fa fa-angle-left"></i></a>';
            				
            				var textContentItem = '<div class="'+secondClassName+' sortDownContent hide" data-sort-item="'+count+'">';
            				for(var num = 0 ;regionSecondItem.length>num;num++){
            					textContentItem += '<a href="javascript:void(0)" data-value-item="'+count+num+'" data-innerid="'+regionSecondItem[num].innerid+'"><span>'+regionSecondItem[num].name+'</span></a>'
            				}
            				textContentItem += '</div>';
            				className.find(idName).after(textContentItem);
            					
            			}
            		}
            	}
            	
            	className.find(idName).append(classificationFirstCon);
            	callback();
        	}
        	
//        	++jishu;
//        	console.log('地区'+jishu);
        }
	})
}