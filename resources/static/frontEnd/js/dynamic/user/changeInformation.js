(function(){
	//获取来源、地区、分类
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
	        success : function(data) {
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
//	            		判读是否存在二级，并进行相应的操作
	            		if(contentTwo.length > 0){
	            			var contentItem = '',
	            				inter = 0;
	            			for(var i = 0;contentOne.length>i;i++){
	            				inter = 0;
	            				contentItem = '';
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
	
//	回显数据
	$.fn.echoData = function(options){
		var defaults = {
			getAjaxUrl:ctx+'/user/front/getUser',//请求路径
			callback:''
		}
		var options = $.extend(defaults,options);
		var $this = $(this);
		$.ajax({
	        url : options.getAjaxUrl,//这个就是请求地址对应sAjaxSource
	        data:{level:options.level},
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	console.log(data);
	        	if(data.result){
	        		var obj = data.resultObj;
//	        		用户名
	        		$('.userName').html(obj.userName);
//	        		姓名
	        		$('input.name').val(obj.name);
	        		
//	        		邮箱
	        		if(obj.email == null && obj.email == ''){
	        			$('input.email').val('请输入邮箱');
	        		}else{
	        			$('input.email').val(obj.email);
	        		}
	        		
//	        		手机
	        		if(obj.mobilePhone != null){
	        			$('input.mobilePhone').val(obj.mobilePhone);
	        		}else{
	        			
	        			$('input.mobilePhone').val('请输入手机号');
	        		}
	        		
//	        		来源
	        		if(obj.sourceOrgs.length > 0){
	        			for(var i = 0;obj.sourceOrgs.length>i;i++){
	        				
	        				$('#source').find('a').each(function(){
	        					if($(this).hasClass('listLabelAll')){
	        						$(this).removeClass('active');
	        					}
	        					if($(this).attr('data-innerid') == obj.sourceOrgs[i]){
	        						$(this).addClass('active');
	        					}
	        				})
	        			}
	        		}
	        		
//	        		地区
	        		if(obj.regions.length > 0){
	        			for(var i = 0;obj.regions.length>i;i++){
	        				
	        				$('#map').find('a').each(function(){
	        					if($(this).hasClass('listLabelAll')){
	        						$(this).removeClass('active');
	        					}
	        					if($(this).attr('data-innerid') == obj.regions[i]){
	        						$(this).addClass('active');
	        					}
	        				})
	        				
	        				$('#map').siblings('.sortDownContent').each(function(){
	        					var $this = $(this);
	        					$this.find('a').each(function(){
	        						if($(this).attr('data-innerid') == obj.regions[i]){
	        							$(this).addClass('active');
	        							$('#map').find('a').each(function(){
	        								if($(this).attr('data-value') == $this.attr('data-sort-item')){
	        									$(this).addClass('active');
	        								}
	        							})
	        						}
	        					})
	        				})
	        			}
	        		}
	        		
//	        		内容
	        		if(obj.classifications.length > 0){
	        			for(var i = 0;obj.classifications.length>i;i++){
	        				
	        				$('#classification').find('a').each(function(){
	        					if($(this).hasClass('listLabelAll')){
	        						$(this).removeClass('active');
	        					}
	        					if($(this).attr('data-innerid') == obj.classifications[i]){
	        						$(this).addClass('active');
	        					}
	        				})
	        				
	        				$('#classification').siblings('.sortDownContent').each(function(){
	        					var $this = $(this);
	        					$this.find('a').each(function(){
	        						if($(this).attr('data-innerid') == obj.classifications[i]){
	        							$(this).addClass('active');
	        							$('#classification').find('a').each(function(){
	        								if($(this).attr('data-value') == $this.attr('data-sort-item')){
	        									$(this).addClass('active');
	        								}
	        							})
	        						}
	        					})
	        				})
	        			}
	        		}
	        		
	        		if(typeof(options.callback) == 'function'){
	        			options.callback(data.resultObj);
	        		}
	        	}
	        }
		})
	}
})(jQuery);

$(function(){
	
	$().showHeader({});
	
	$('[data-toggle="popover"]').popover({
		html:true,
		placement:'right',
	});
	
	var sourcesData = [],
		mapData = [],
		classificationData = [],
		jiluCon = 0;

//	来源
	$('#source').getData({
		getAjaxUrl:ctx+'/common/dic/front/listSourceOrg',//请求路径
		callback:function(){
			++jiluCon;
			var jishu = 0;
			$('#source').find('a').each(function(index){
				$(this).find('span').click(function(){
					var $this = $(this).parents('a');
					if($this.hasClass('listLabelAll')){
						$this.addClass('active').siblings('a').removeClass('active');
						sourcesData = [];
					}else{
						$this.siblings('a.listLabelAll').removeClass('active');
						if($this.hasClass('active')){
							$this.removeClass('active');
							jishu = parseInt($this.siblings('input').val())-1;
							$this.siblings('input').val(jishu);
							if(jishu == 0){
								$this.siblings('a.listLabelAll').addClass('active');
							}
							for(var i = 0;sourcesData.length>i;i++){
								if(sourcesData[i] == $this.attr('data-innerid')){
									sourcesData.splice(i);
								}
							}
							
						}else{
							$this.addClass('active');
							jishu = parseInt($this.siblings('input').val())+1;
							$this.siblings('input').val(jishu);
							sourcesData.push($this.attr('data-innerid'));
						}
					}
				})
			})
			
			
		}
	});
	
	//	地区
	$('#map').getData({
		getAjaxUrl:ctx+'/common/dic/front/listRegion',//请求路径
		callback:function(){
			++jiluCon;
			var jishumap = 0;
			$('#map').find('a').each(function(){
				$(this).find('span').click(function(){
					var $this = $(this).parents('a');
					if($this.hasClass('listLabelAll')){
						$this.addClass('active').siblings('a').removeClass('active');
						$this.parents('div.listLabel').siblings('.sortDownContent').each(function(){
							$(this).find('a').removeClass('active');
						})
						mapData = [];
					}else{
						$this.siblings('a.listLabelAll').removeClass('active');
						if($this.hasClass('active')){
							$this.removeClass('active');
							$this.parents('div.listLabel').siblings('[data-sort-item="'+$this.attr('data-value')+'"]').find('a').removeClass('active');
							
							$('#map').find('a').each(function(){
								if($(this).hasClass('active')){
									++jishumap;
								}
							})
							if(jishumap == 0){
								$this.siblings('a.listLabelAll').addClass('active');
							}else{
								jishumap = 0;
							}
							
							for(var i = 0;mapData.length>i;i++){
								if(mapData[i] == $this.attr('data-innerid')){
									mapData.splice(i);
								}
							}
							
						}else{
							$this.addClass('active');
							mapData.push($this.attr('data-innerid'));
						}
					}
				})
				
				if($(this).hasClass('sortDown')){
					
					var $this = $(this),$thisP = $(this).parents('div.listLabel');
					
					$this.find('i').click(function(){
						if($(this).hasClass('fold')){
							$thisP.find('i').css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							}).end().siblings('.sortDownContent').addClass('hide');
							$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').removeClass('hide');
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
							$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').addClass('hide');
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
					
					$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').each(function(){
						var $thisItem= $(this).attr('data-sort-item');
						$(this).find('a').each(function(){
							$(this).click(function(){
								if($(this).hasClass('active')){
									$(this).removeClass('active');
									for(var i = 0;mapData.length>i;i++){
										if(mapData[i] == $(this).attr('data-innerid')){
											mapData.splice(i);
										}
									}
									
									$(this).parents('div.sortDownContent').find('a').each(function(){
										if($(this).hasClass('active')){
											++jishumap;
										}
									})
									
									if(jishumap == 0){
										mapData.push($thisP.find('a[data-value="'+$thisItem+'"]').attr('data-innerid'));
									}else{
										jishumap = 0;
									}
								}else{
									$(this).addClass('active');
									$thisP.find('a[data-value="'+$thisItem+'"]').addClass('active');
									$thisP.find('a.listLabelAll').removeClass('active');
									
									mapData.push($(this).attr('data-innerid'));
									for(var i = 0;mapData.length>i;i++){
										if(mapData[i] == $thisP.find('a[data-value="'+$thisItem+'"]').attr('data-innerid')){
											mapData.splice(i);
										}
									}
								}
							})
						})
					})
				}
			})
		}
	})
	
	//	分类
	$('#classification').getData({
		getAjaxUrl:ctx+'/common/dic/front/listNewsClassification',//请求路径
		callback:function(){
			++jiluCon;
			var jishumap = 0;
			$('#classification').find('a').each(function(){
				$(this).find('span').click(function(){
					var $this = $(this).parents('a');
					if($this.hasClass('listLabelAll')){
						$this.addClass('active').siblings('a').removeClass('active');
						$this.parents('div.listLabel').siblings('.sortDownContent').each(function(){
							$(this).find('a').removeClass('active');
						})
						classificationData = [];
					}else{
						$this.siblings('a.listLabelAll').removeClass('active');
						if($this.hasClass('active')){
							$this.removeClass('active');
							$this.parents('div.listLabel').siblings('[data-sort-item="'+$this.attr('data-value')+'"]').find('a').removeClass('active');
							
							$('#classification').find('a').each(function(){
								if($(this).hasClass('active')){
									++jishumap;
								}
							})
							if(jishumap == 0){
								$this.siblings('a.listLabelAll').addClass('active');
							}else{
								jishumap = 0;
							}
							
							for(var i = 0;classificationData.length>i;i++){
								if(classificationData[i] == $this.attr('data-innerid')){
									classificationData.splice(i);
								}
							}
							
						}else{
							$this.addClass('active');
							classificationData.push($this.attr('data-innerid'));
						}
					}
				})
				
				if($(this).hasClass('sortDown')){
					
					var $this = $(this),$thisP = $(this).parents('div.listLabel');
					
					$this.find('i').click(function(){
						if($(this).hasClass('fold')){
							$thisP.find('i').css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							}).end().siblings('.sortDownContent').addClass('hide');
							$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').removeClass('hide');
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
							$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').addClass('hide');
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
					
					$thisP.siblings('[data-sort-item="'+$this.attr('data-value')+'"]').each(function(){
						var $thisItem= $(this).attr('data-sort-item');
						$(this).find('a').each(function(){
							$(this).click(function(){
								if($(this).hasClass('active')){
									$(this).removeClass('active');
									for(var i = 0;classificationData.length>i;i++){
										if(classificationData[i] == $(this).attr('data-innerid')){
											classificationData.splice(i);
										}
									}
									
									$(this).parents('div.sortDownContent').find('a').each(function(){
										if($(this).hasClass('active')){
											++jishumap;
										}
									})
									
									if(jishumap == 0){
										classificationData.push($thisP.find('a[data-value="'+$thisItem+'"]').attr('data-innerid'));
									}else{
										jishumap = 0;
									}
								}else{
									$(this).addClass('active');
									$thisP.find('a[data-value="'+$thisItem+'"]').addClass('active');
									$thisP.find('a.listLabelAll').removeClass('active');
									
									classificationData.push($(this).attr('data-innerid'));
									for(var i = 0;classificationData.length>i;i++){
										if(classificationData[i] == $thisP.find('a[data-value="'+$thisItem+'"]').attr('data-innerid')){
											classificationData.splice(i);
										}
									}
								}
							})
						})
					})
				}
			})
		}
	})
	
	$('input.name').focus(function(){
		$(this).removeAttr('data-content');
	})
	
//	提交
	$('#remit').click(function(){
		console.log(mapData);
		console.log(classificationData);
		console.log(sourcesData);
		
		if($('.name').val() == ''){
			$('input.name').attr('data-content','<img src="'+ctx+'/frontEnd/image/login/iconwarn.png" /> 姓名不能为空！');
			$('input.name').popover('show');
		}else{
			var mobilePhoneVal = '';
			if($('.mobilePhone').val() != '请输入手机号'){
				mobilePhoneVal = $('.mobilePhone').val();
			}
			var dataPrama = {
					'name':$('.name').val(),
					'email':$('.email').val(),
					'mobilePhone':mobilePhoneVal,
					'sourceOrgs':sourcesData,
					'regions':mapData,
					'classifications':classificationData
			}
			
			$.ajax({
		        url : ctx+'/user/front/update',//这个就是请求地址对应sAjaxSource
		        data:dataPrama,
		        type : 'post',
		        dataType : 'json',
		        async : true,
		        traditional: true,
		        success : function(data) {
		        	console.log(data);
		        	if(data.result){
		        		$().toastmessage('showToast', {
            				//提示信息的内容
            		    	text: '修改信息成功！',
            		   		sticky: false,
            		        position : 'bottom-right',
            		        type: 'success',
            			});
		        		
		        		location.href=ctx+"/gotouser";
		        	}else{
		        		$().toastmessage('showToast', {
            				//提示信息的内容
            		    	text: '修改信息失败！',
            		   		sticky: false,
            		        position : 'bottom-right',
            		        type: 'error',
            			});
		        	}
		        		
		        }
			})
		}
		
	})
	
	var timer = setInterval(text,100);
	function text(){
//		console.log(jzjishu);
		if(jiluCon == 3){
			 $('.changepswbox').echoData({
				 'callback':function(data){
					 sourcesData = data.sourceOrgs;
					 mapData = data.regions;
					 classificationData = data.classifications;
				 }
			 });
			clearInterval(timer);
		}
	}
});