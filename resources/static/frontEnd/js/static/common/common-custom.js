
/**
 *
 * 插件名：common.js
 * Author：xlYang
 */
(function(factory) {
  "use strict";
  if (typeof define === "function" && (define.amd || define.cmd)) {
    define(["jquery"], factory);
  } else {
    factory((typeof(jQuery) != "undefined") ? jQuery : window.Zepto);
  }
});
(function($) {
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
	
	$.ajaxSetup ({
        cache: false //关闭AJAX缓存
    });
	
	$.fn.extend({
		
		//采用jquery中的ajax-get方式载入页面
		'loadPage':function(loadPage,callback){
			if(isValid(loadPage))
				return this;
			var $this = $(this);
			return $.get(loadPage,function(data,response){
				$this.html(data);
				if(status == 'success'){
					if(callback == undefined){
						return false;
					}else{
						callback();
					}
				}
			});
		},
		
		//将新闻详情页中的img判断大小，居中正常显示
		'checkImg':function(){
			var $this = $(this);
			var imgArray = [];
			$this.find('img').each(function(){
				imgArray.push($(this).attr('src'));
			});
			 if(imgArray.length == 0){
				 return ;
			}else{
				$this.find('img').each(function(){
					var $this = $(this);
					if($this.parents('#uec_inews_picture_group_news').length>0){
						return;
					}else{
						$this.css({
							margin:'0 auto',
							display:'block'
						})
						if($this.siblings().length<2){
							$this.parent().css({
								textAlign:'center',
							});
						}
					}
				});
			}
			
			
		},
		/*文字无缝滚动*/
		'textScroll':function(){
			var p = $(this),
		        c = p.children(),
		        speed=3000;// 值越大，速度越小
		    var cw = c.width(),pw=p.width();
		    var t = (cw / 100) * speed;
		    var f = null, t1 = 0;
		    function ani(tm) {
		        counttime();
		        c.animate({ left: -cw }, tm, "linear", function () {
		            c.css({ left: pw });
		            clearInterval(f);
		            t1 = 0;
		            t=((cw+pw)/100)*speed;
		            ani(t);
		        });
		    }
		    function counttime() {
		        f = setInterval(function () {
		            t1 += 10;
		        }, 10);
		    }
		    p.on({
		        mouseenter: function () {
		            c.stop(false, false);
		            clearInterval(f);
		            // console.log(t1);
		        },
		        mouseleave: function () {
		            ani(t - t1);
		            // console.log(t1);
		        }
		    });
		    ani(t);
		},

		/*模态框更换方式*/
		'animateCss': function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
        },
        
        /*判断图片加载是否成功*/
        'judgeImgLoadError':function (defaultImgPath){
        	if($('#session-debug').val() == 'true'){
        		return
        	}else{
        		var imgSrc=[];
            	$(this).find('img').each(function(){
            		imgSrc.push($(this).attr('src'));
            		judgeImgLoad($(this).attr('src'),$(this),defaultImgPath);
            	});
        	}
        	
        },
        
        'limit_input_length':function(){
        	var $this = $(this);
        	$this.on('keyup keydown', function () {

                var str = $this.val();  
                var limitLen = 76;  
                var sign = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
                var flag = str.replace(/[\u4e00-\u9fa5]/g, '@@').length <= limitLen ? true : false;
                    var convertStr = str.replace(sign,'').replace(/[#^&<>+/%]/g,'').replace(/[\u4e00-\u9fa5]/g, '@@').substr(0, limitLen);
                    var len = convertStr.replace(/@@/g, '#').replace('@','').length;
                    var val = str.substring(0, len);  
                    $this.val(val);
            });
        	
        },
        
        
        
        'uec_inews_picture_group_news':function(){
        	var uec_inews_picture_group_content = '';
        	var uec_inews_picture_group_content_root='';
        	var $this = $(this);
            if($this.find('#uec_inews_picture_group_news').length>0){
            	$this.find("[id='uec_inews_picture_group_news']").each(function(index){
            		var picture_content_string = '';
                	var picture_content_string_json = "";
                	uec_inews_picture_group_content='';
                	picture_content_string = $(this).html();
                	picture_content_string_json =JSON.parse(picture_content_string.substring(picture_content_string.indexOf('{'),picture_content_string.lastIndexOf('}')+1).replace(/\"/g,"’").replace(/'/g, '"').replace(/’/g, "'"));
                	uec_inews_picture_group_content  += '<div class="uec_inews_picture_group_images"><a class="control'+index+' control prev"></a><a class="control'+index+' control next abs"></a><div class="slider'+index+'"><ul>';
                    if(picture_content_string_json.pics == undefined || picture_content_string_json.pics == '' || picture_content_string_json.pics == null){
                    	return;
                    }else{
                    	
                        for(var i = 0; i < picture_content_string_json.pics.length;i++){
                        	uec_inews_picture_group_content += '<li><a href=""><img src="'+picture_content_string_json.pics[i].url + '" alt="'+picture_content_string_json.pics[i].text+'" /></a></li>';
                        }
                    }
                    
                    if(picture_content_string_json.desc == undefined || picture_content_string_json.pics == '' || picture_content_string_json.pics == null){
                        uec_inews_picture_group_content += '</ul></div></div>';
                    }else{
                        uec_inews_picture_group_content += '</ul></div></div><div class="center uec_inews_picture_group_description">'+picture_content_string_json.desc+'</div>';
                    }
                    $(this).html(uec_inews_picture_group_content);
                    iNews_picture_group_js('.slider'+index,'.control'+index);
                    
            	});
            	

            }else if($this.find('#uec_inews_picture_group_weibo').length>0){
            		var picture_content_string = '';
            		var picture_content_string_json = "";
            		
            		picture_content_string = $this.find('#uec_inews_picture_group_weibo').html();
            		picture_content_string_json =JSON.parse(picture_content_string.substring(picture_content_string.indexOf('{'),picture_content_string.lastIndexOf('}')+1).replace(/\"/g,"’").replace(/'/g, '"').replace(/’/g, "'"));
            		
            		var imageArr = new Array();
                    
            		if (picture_content_string_json.pics == undefined || picture_content_string_json.pics == '' || picture_content_string_json.pics == null) {
                    }else{
                        for(var i =0;i<picture_content_string_json.pics.length;i++){
                            imageArr[i] = picture_content_string_json.pics[i].url;
                        }
                    };
                    
                    
                uec_inews_picture_group_content += '<div class="pic_mul"><div class="pic_content">'+picture_content_string_json.desc+'</div><ul class="clearfix pic_mul_ul">';
                if(picture_content_string_json.pics == undefined || picture_content_string_json.pics == '' || picture_content_string_json.pics == null){
                }else{
                    for(var i=0;i<picture_content_string_json.pics.length;i++){
                        uec_inews_picture_group_content += '<li class="unlog_pic"><span class="photoBox"><div class="loadingBox"><span class="loading"></span></div><img src="'+imageArr[i]+' " class="zoom" onclick="zoom_image($(this).parent(),\''+$this.attr('class')+'\')"/></span></li>'
                    }

                    uec_inews_picture_group_content += '</ul></div><div class="photoArea" style="display:none;"><p style="text-indent:0px"><img src="about:blank" class="minifier" onclick="zoom_image($(this).parent().parent(),\''+$this.attr('class')+'\')"></p><p class="toolBar gc"><span><a class="green" href="javascript:void(0)" onclick="zoom_image($(this).parent().parent().parent(),\''+$this.attr('class')+'\')">收起</a></span>|<span class="view"><a class="green" href="images/1326l.jpg" target="_blank">查看原图</a></span></p></div>';
                }
                $this.find('#uec_inews_picture_group_weibo').html(uec_inews_picture_group_content);
                
                if($this.find('.uec_inews_picture_group_weibo_root').length>0){
                	$this.find('.uec_inews_picture_group_weibo_root').each(function(index){
                		var picture_content_string_root = '';
                		var picture_content_string_json_root = "";
                		
                		picture_content_string_root = $(this).html();
                		
                		//console.log(picture_content_string_root.substring(picture_content_string_root.indexOf('{'),picture_content_string_root.lastIndexOf('}')+1).replace(/\"/g,"’").replace(/'/g, '"').replace(/’/g, "'"));
                		picture_content_string_json_root =JSON.parse(picture_content_string_root.substring(picture_content_string_root.indexOf('{'),picture_content_string_root.lastIndexOf('}')+1).replace(/\"/g,"’").replace(/'/g, '"').replace(/’/g, "'"));
                		
                		var imageArr = new Array();
                        
                		if (picture_content_string_json_root.pics == undefined || picture_content_string_json_root.pics == '' || picture_content_string_json_root.pics == null) {
                        }else{
                            for(var i =0;i<picture_content_string_json_root.pics.length;i++){
                                imageArr[i] = picture_content_string_json_root.pic[i].url;
                            }
                        };
                        
                        
                        uec_inews_picture_group_content_root += '<div class="pic_mul"><div class="pic_content">'+picture_content_string_json_root.desc+'</div><ul class="clearfix pic_mul_ul">';
	                    if(picture_content_string_json_root.pics == undefined || picture_content_string_json_root.pics == '' || picture_content_string_json_root.pics == null){
	                    }else{
	                        for(var i=0;i<picture_content_string_json_root.pics.length;i++){
	                        	uec_inews_picture_group_content_root += '<li class="unlog_pic"><span class="photoBox"><div class="loadingBox"><span class="loading"></span></div><img src="'+imageArr[i]+' " class="zoom" onclick="zoom_image_root($(this).parent(),\''+$this.attr('class')+'\')"/></span></li>'
	                        }
	
	                        uec_inews_picture_group_content_root += '</ul></div><div class="photoArea" style="display:none;"><p style="text-indent:0px"><img src="about:blank" class="minifier" onclick="zoom_image_root($(this).parent().parent(),\''+$this.attr('class')+'\')"></p><p class="toolBar gc"><span><a class="green" href="javascript:void(0)" onclick="zoom_image_root($(this).parent().parent().parent(),\''+$this.attr('class')+'\')">收起</a></span>|<span class="view"><a class="green" href="images/1326l.jpg" target="_blank">查看原图</a></span></p></div>';
	                    }
	                    $(this).html(uec_inews_picture_group_content_root);
	                    
	                    if (picture_content_string_json_root.pics == undefined || picture_content_string_json_root.pics == '' || picture_content_string_json_root.pics == null) {

	                    }else if($('body').width()<768){
	                    	$('.pic_mul_ul').css({
	                            'width': '270px'
	                        })
	                    }else{
	                        if(picture_content_string_json_root.pics.length == 4 || picture_content_string_json_root.pics.length == 7){
	                            $('.pic_mul_ul').css({
	                                'width': '620px'
	                            })

	                        }else{
	                            $('.pic_mul_ul').css({
	                                'width': '465px'
	                            })
	                        }
	                    };
                	});
                }
                var unlog_pic_icon = '';
                unlog_pic_icon += '<i class="unlog_pic_icon">长图</i>'
                var image = new Image();
                if(imageArr[0] == undefined){
                
                }else{
                	image.src=imageArr[0];
                	image.onload=function(){
                        for(var i=0;i<imageArr.length;i++){
                            var image1 = new Image();
                            image1.src = imageArr[i];
                            if (image1.height/image1.width>3) {
                                $('.pic_mul_ul').find('li.unlog_pic').eq(i).prepend(unlog_pic_icon);
                            };
                        }
                    }
                }
                
                if (picture_content_string_json.pics == undefined || picture_content_string_json.pics == '' || picture_content_string_json.pics == null) {

                }else if($('body').width()<768){
                	$('.pic_mul_ul').css({
                        'width': '270px'
                    })
                }else{
                    if(picture_content_string_json.pics.length == 4 || picture_content_string_json.pics.length == 7){
                        $('.pic_mul_ul').css({
                            'width': '620px'
                        })

                    }else{
                        $('.pic_mul_ul').css({
                            'width': '465px'
                        })
                    }
                };
                
                
                
                

            }
        },
        
//        鼠标划入图片放大
        'imgEnlarge':function(className){
        	$(this).hover(function(){
                $('body').append("<p id='pic'><img src='"+$(this).find('img').attr('src')+"' id='pic1'></p>");
                $(this).mousemove(function(e){
                    $("#pic").css({
                        "top":(e.pageY+10)+"px",
                        "left":(e.pageX+20)+"px"
                    }).fadeIn("fast");
                    // $("#pic").fadeIn("fast");
                });
            },function(){
                $("#pic").remove();
            });
        },
        
      //点击iSearch显示本地缓存
        'parseLocalArrayData':function(options){
        	var defaults = {
        			dataSources:'',
        			afterSelect:function(){},
    		};
    		var options = $.extend(defaults,options);
    		var objMap = {};
    	    $(this).typeahead({
    	        source: function (query, process) {
    	            var names = [];
    	            $.each(options.dataSources, function (index, ele) {
    	                objMap[ele.name] = ele.id;
    	                names.push(ele.name);
    	            });
    	            process(names);//调用处理函数，格式化
    	        },//数据源
    	        items: 10,//最多显示个数
    	        minLength:0,
    	        showHintOnFocus:true,
    	        autoSelect:false,
//    	        delay: 100,//延迟时间
    	        afterSelect:options.afterSelect
    	    });
        }
 		
	});
	
	/**
	 * 相似相关、浏览量二次查询
	 */
	$.fn.adraticAjaxData = function(options){
		var defaults = {
				modalName:'', //所在元素的className
				dataUrl:'',  //请求路径
				dataParam:{},  //传递参数
				rowIndex:'', //定义是table第几行
				columnIndex:'',//定义是table第几列
				callback:''
		};
		var options = $.extend(defaults,options);
		
		$.ajax({
            url : options.dataUrl,//这个就是请求地址对应sAjaxSource
            data:options.dataParam,
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data,index) {
            	if(data.result == true){
            		
            		if(options.callback != ''){
            			options.callback(data.resultObj);
            		}else{
            			if(options.modalName != '' && options.modalName != 'null'){
                			$(options.modalName).html(data.resultObj);
                		}
            		}
            	}
            }
		})
	};
	
//	收藏与取消收藏
	$.fn.judgeKeep = function(options){
		
		var defaults = {
				dataUrl:'',  //请求路径
				dataParam:{},  //传递参数
				callback:''
		};
		var options = $.extend(defaults,options);
		
		$.ajax({
            url : options.dataUrl,//这个就是请求地址对应sAjaxSource
            data:options.dataParam,
            type : 'get',
            dataType : 'json',
            async : true,
            success : function(data) {
            	//console.log(data);
            	if(data.result){
            		$().toastmessage('showToast', {
            	    	text: '操作成功！',
            	   		sticky: false,
            	        position : 'bottom-right',
            	        type: 'success',
            		});
            	}else{
            		$().toastmessage('showToast', {
            	    	text: '操作失败！',
            	   		sticky: false,
            	        position : 'bottom-right',
            	        type: 'error',
            		});
            	}
            	
            	if(typeof(options.callback) == 'function'){
            		options.callback(data);
            	}
            }
		})
	};
//	全选功能-批量
	$.fn.allCheck = function(options){
		var defaults = {
				allFun:'',//全选以后进行的操作
		};
		var options = $.extend(defaults,options);
		
		$('.checked-all').click(function(){
			var status;
    		if($(this).hasClass('checked')){
    			$(this).removeClass('checked').parents('a').css({
    				'color':'#333'
    			});
    			$('span.check-child').removeClass('checked');
    			status = false;
    		}else{
    			$(this).addClass('checked').parents('a').css({
    				'color':'#F44336'
    			});
    			$('span.check-child').addClass('checked');
    			status = true;
    		}
    		
    		if(typeof(options.allFun) == 'function'){
    			options.allFun(status);
    		}
    		
    	});
    	
	};
//	列表选择-单独
	$.fn.itemCheck = function(options){
		var defaults = {
				itemFun:'' //每个选完进行的操作
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		$this.find('span.check-child').each(function(){
    		var statusItem;
    		$(this).click(function(){
    			if($(this).hasClass('checked')){
    				$(this).removeClass('checked');
    				if($('.checked-all').hasClass('checked')){
    					$('.checked-all').removeClass('checked');
    					$('.checked-all').parents('a').css({
    						'color':'#333'
    					})
    				}else{}
    				
    				statusItem = false;
    			}else{
    				$(this).addClass('checked');
    				statusItem = true;
    			}
    			
    			if(typeof(options.itemFun) == 'function'){
        			options.itemFun($(this),statusItem);
        		}
    		})
    	})
	};
//	单个建稿
	$.fn.releaseBuild = function(options){
		var defaults = {
				webpageCode:'', //新闻的webpageCode
				buildingCon:'',//点击建稿时样式的改变
				buildedCon:'',//建稿结束之后执行的内容
		};
		
		var options = $.extend(defaults,options);
		var $this = $(this);

        $this.click(function () {
            $.ajax({
                url: ctx + "/latest/front/releaseBuildCheck", //处理页面的路径
                type: "GET", //提交方式
                dataType: "JSON", //返回数据的类型
                success: function (data) { //回调函数 ,成功时返回的数据存在形参data里
                    data = typeof data == "string" ? JSON.parse(data) : data;
                    if (data.result && data.resultObj) {
                        window.open(ctx + '/api/draft/release/view?webpageCode=' + options.webpageCode);
                    } else {
						// $this[0].firstChild.className = "fa fa-file-text-o";
                        $('#cannotSkipDialog').modal('show');
                        $('#cannotSkipDialog .modal-body p').text('目标地址不存在，无法创建稿件');
                        $('#cannotSkipDialog .modal-body .btn-red').text('确定');
                        $('#cannotSkipDialog .modal-body .btn-default').text('取消');
                        $(".confirm-myCustom").unbind();
                        $(".cancel-myCustom").unbind();
                        $('.btn-red').click(function () {
                            if (callback1) {
                                callback1()
                            } else {
                                return false;
                            }
                        })
                    }
                }
            });
        });
	};
	
//	返回顶部
	$.fn.scrollOffset = function(options){
		var defaults = {
				scrollPos:0,//滚动的位置
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		$("body,html").animate({ 
//			scrollTop: $this.offset().top - 100 
			scrollTop:options.scrollPos
		}, 0);
		 
	};
	
//	内嵌视频
	$.fn.embedVideo = function(options){
		var defaults = {};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
//		判断是否存在视频
		var mainDom = $this.find("[id*='uec_embedded_video']");
		if(mainDom.length>0){
//			var len = uec_embedded_video.length;
			
			for(var key in uec_embedded_video){
				// console.log(uec_embedded_video[key])
				if(key != 'length'){
					var obj = uec_embedded_video[key];
					var content = '';
					
					
					content += '<div class="uecEmbeddedVideo"><div class="embeddedVideoMain"><a href="'+obj.newsurl+'" target="_blank"><div class="embeddedVideoInner">';
					
					var picPath = '';
					if(obj.coverpic == '' || obj.coverpic == undefined){
						picPath = context + '/frontEnd/image/home/default-gray.png';
						content += '<img class="picCover defaultImg" src="'+picPath+'"/>';
					}else{
						picPath = obj.coverpic;
						content += '<img class="picCover " src="'+picPath+'"/>';
					}
					
					content += '</div><div class="embeddedVideoBtn"><i class="fa fa-play"></i></div></a></div></div>'		
					
					$('#'+key).html(content);
				}
			}
		}
	};
//	组图
	$.fn.mosaic = function(options){
		var defaults = {};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		var mainDom = $this.find("[id*='uec_img_group']");
		if(mainDom.length>0){
			
			if(typeof uec_inews_img_group != 'undefined'){
				for(var key in uec_inews_img_group){
					// console.log(uec_inews_img_group[key]);
					var obj = uec_inews_img_group[key];
					if(key != 'length'){
						var objPic = obj.pic;
						// console.log(objPic);
						var content = '';
						
						content += '<div class="mosaicMain"><a class="control prev"></a><a class="control next abs"></a>';
						content += '<div class="'+key+'"><ul>';
						
						for(var i=0;objPic.length>i;i++){
							if(typeof objPic[i].desc == 'undefined' ){
								content += '<li><a href=""><img src="'+objPic[i].url+'" /></a></li>';
							}else{
								content += '<li><a href=""><img src="'+objPic[i].url+'" alt="'+objPic[i].desc+'" /></a></li>'; 
							}
							          
						}
						
					    content += '</ul></div></div>';
					    $('#'+key).html(content);
					    
					    var newsDetailTextW = $('.newsDetailText').width()-50;
						var newsDetailTextH = newsDetailTextW/1.53;
						$('#'+key).each(function(){
							$(this).find('li').css({
								'lineHeight':newsDetailTextH + 'px'
							})
						});
					    $('.'+key).YuxiSlider({
					        width:100+'%', //容器宽度
					        height:newsDetailTextH, //容器高度
					        control:$('.'+key).siblings('a.control'), //绑定控制按钮
					        during:4000, //间隔4秒自动滑动
					        speed:800, //移动速度0.8秒
					        mousewheel:true, //是否开启鼠标滚轮控制
					        direkey:true //是否开启左右箭头方向控制
						});
					    
					    for(var i=0;objPic.length>i;i++){
							if(typeof objPic[i].desc == 'undefined' ){
								content += '<li><a href=""><img src="'+objPic[i].url+'" /></a></li>';
							}else{
								content += '<li><a href=""><img src="'+objPic[i].url+'" alt="'+objPic[i].desc+'" /></a></li>'; 
							}
							          
						}
					}
				}
			}else{
				return;
			}
			
		}
	};
//	微博
	$.fn.weibo = function(options){
		var defaults = {};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		var mainDom = $this.find("[id*='uec_img_smsg']");
		if(mainDom.length>0){
			var pics = uec_inews_img_smsg.uec_img_smsg.pic;
			var content = '<div class="weibo"><div class="wimg">';
			
			for(var i=0;pics.length>i;i++){
				content += '<img src="'+pics[i]+'"/>';
			}
			
			content += '</div><div class="big_wimg" style="display:none"><div class="wdiv"><ul class="sul"><li><img src="" id="mainpic" /></li></ul></div><div class="big_wimglst"><div class="big_imgbox"><ul></ul></div></div><div class="spc_10"></div></div><div class="clearfix"></div></div>';
			$('#uec_img_smsg').html(content);
			nineslide();
		}
	};
	
//	去掉新闻详情页中的class值
	$.fn.reContentClass = function(options){
		var defaults = {};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		var dom = $this.contents().filter(function(){
			return this.nodeType == 1;
		})
		.removeAttr('class')
	            			
		if(dom.children().length>0){
			dom.reContentClass();
		}	
	};
	
//	显示头部导航内容
	$.fn.showHeader = function(options){
		var defaults = {
				callback:''
		};
		var options = $.extend(defaults,options);
		var $this = $(this);
		
		$.ajax({
	        url : ctx+'/config/front/listUserNav',//这个就是请求地址对应sAjaxSource
	        type : 'get',
	        dataType : 'json',
	        async : true,
	        success : function(data) {
	        	// console.log(data);
	        	if(data.result){
	        		var obj = data.resultObj;
	        		var content = '';
	        		// 此处再取一次，由于是ajax请求，ctx是个全局变量，易被覆盖导致路径发生变化 
	        		ctx = $('#ctx').val();
	        		for(var i = 0;i<obj.length;i++){
	        			if(obj[i].status == '0'){//0:选中状态
	        				content += '<li class="top" data-mark="'+obj[i].paramName+'"><a href="'+ctx+obj[i].value+'">'+obj[i].displayName+'</a></li>';
	        			}else{
	        				content += '';
	        			}
	        		}
	        		
	        		$('.inewsHeaderNav').html(content);
	        		
	        		if(options.callback == ''){
	        			return;
	        		}else{
	        			options.callback();
	        		}
	        	}
	        }
	    })
	};

	
	//私有方法，检测参数是否合法
	function isValid(options) {
		return !options || (options && typeof options === "object") ? true : false;
	}
	
	function judgeImgLoad(imgSrc,$this,defaultImgPath){
		var imgLoad=new Image();
		imgLoad.src=imgSrc;
		imgLoad.onerror=function(){
			// console.log(imgLoad.src+'失败');
			
			if($this.attr('osrc') == undefined){
				if(defaultImgPath == undefined){
					$this.addClass('hide');
				}else{
					$this.attr('src',defaultImgPath);
				}
			}else{
				$this.attr('src',$this.attr('osrc'));
				var imgErrorLoad = new Image();
				imgErrorLoad.src=$this.attr('osrc');
				imgErrorLoad.onerror=function(){
					if(defaultImgPath == undefined){
						$this.addClass('hide');
					}else{
						$this.attr('src',defaultImgPath);
					}
					
				}
			}
			
		}
	}
	
	

	
	
})(window.jQuery);	

//为你推荐-左侧导航
var Accordion = function(el, multiple) {
	this.el = el || {};
	this.multiple = multiple || false;

	// Variables privadas
	var links = this.el.find('.link');
	// Evento
	links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
}

Accordion.prototype.dropdown = function(e) {
	var $el = e.data.el;
		$this = $(this),
		$next = $this.next();
	if($this.parent().hasClass('open')){
		return;
	}else{
		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		} else {
			$this.parent().siblings().removeClass('open');
		};
	}
	
}

//为你推荐-左侧导航  end

function retrieveData(sSource, aoData, fnCallback) {
    $.ajax({
        url : sSource,//这个就是请求地址对应sAjaxSource
        data : aoData,//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	// console.log(data);
        	if(data.result){
        		fnCallback(data.resultObj);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
        	}else{
        		if(data.errorCode==401){
//        			alert(data.errorMsg);
        			var param = data.resultObj;
        			var ip = param.ip;
        			var time = param.time;
        			location.href=ctx+"/kickout?ip="+ip+"&time="+time;
        		}
        	}
	       
        },
        error : function(msg) {
        }
    });
}

var ctx = '';
var picHandleFlag = '';
var inewsImageManager = '';
$(function(){
	inewsImageManager = $('#inewsImageManager').val()+'?path=';
	ctx = $('#ctx').val();
	picHandleFlag = $("#picHandleFlag").val();
	
})


/*将footer置于底部*/
function footerPutBottom(){
	var bodyHeight = $(window).height(); //body的高度
	var headerHeight = $('header').height(); //头部的高度
	var contentHeight = $('#main-content').height();  //整体内容的高度
	var footerHeight = $('#footer').height();  //底部的高度
	var DvalueH = $('body').height()-$('header').height()-70; 
	var addValueH = contentHeight + footerHeight;
	if(addValueH < DvalueH){
		var contentHeightNew = bodyHeight-headerHeight-footerHeight-70;
		$('#main-content').css({
			'height':contentHeightNew,
		});
	}else{
		return false;
	}
}

/*将图片放大*/
function zoom_image(obj,className) {
	var classNameString = '';
	classNameString = '.'+className;
	$(classNameString).each(function(){
		if (obj.hasClass('photoBox')) {
	        var load = obj.find('.loadingBox');
	        load.show();
	        var img =$(this).find('#uec_inews_picture_group_weibo').find('.photoArea').find('img');
	        if (img.attr('src') == 'about:blank') {
	        	img.attr('src', obj.find('img').attr('src'));
	            $(this).find('#uec_inews_picture_group_weibo').find('.pic_mul_ul').hide();
	            $(this).find('#uec_inews_picture_group_weibo').find('.photoArea').show();
	        } else {
	        	$(this).find('#uec_inews_picture_group_weibo').find('.pic_mul_ul').hide();
	        	$(this).find('#uec_inews_picture_group_weibo').find('.photoArea').show();
	        }
	    } else {
	        var img = $(this).find('#uec_inews_picture_group_weibo').find('.photoArea').find('img').attr('src','about:blank');
	        $(this).find('#uec_inews_picture_group_weibo').find('.photoArea').hide();

	        $(this).find('#uec_inews_picture_group_weibo').find('.pic_mul_ul').show();
	        $(this).find('#uec_inews_picture_group_weibo').find('.pic_mul_ul').find('.loadingBox').hide();
	    }
	});
    
}

function zoom_image_root(obj,className) {
	var classNameString = '';
	classNameString = '.'+className;
	$(classNameString).each(function(){
		if (obj.hasClass('photoBox')) {
	        var load = obj.find('.loadingBox');
	        load.show();
	        var img =$(this).find('.uec_inews_picture_group_weibo_root').find('.photoArea').find('img');
	        if (img.attr('src') == 'about:blank') {
	            img.attr('src', obj.find('img').attr('src'));
	            $(this).find('.uec_inews_picture_group_weibo_root').find('.pic_mul_ul').hide();
	            $(this).find('.uec_inews_picture_group_weibo_root').find('.photoArea').show();
	        } else {
	        	$(this).find('.uec_inews_picture_group_weibo_root').find('.pic_mul_ul').hide();
	        	$(this).find('.uec_inews_picture_group_weibo_root').find('.photoArea').show();
	        }
	    } else {
	        var img = $(this).find('.uec_inews_picture_group_weibo_root').find('.photoArea').find('img').attr('src','about:blank');
	        $(this).find('.uec_inews_picture_group_weibo_root').find('.photoArea').hide();

	        $(this).find('.uec_inews_picture_group_weibo_root').find('.pic_mul_ul').show();
	        $(this).find('.uec_inews_picture_group_weibo_root').find('.pic_mul_ul').find('.loadingBox').hide();
	    }
	});
    
}
/*新闻详情页-轮播图JS*/
function iNews_picture_group_js(idname,controlname){
	var newsDetailTextW = $('.newsDetailText').width()-50;
	var newsDetailTextH = newsDetailTextW/1.53;
	$('.uec_inews_picture_group_images').each(function(){
		$(this).find('li').css({
			'lineHeight':newsDetailTextH + 'px'
		})
	});
	$(idname).YuxiSlider({
    	width:newsDetailTextW, //容器宽度
    	height:newsDetailTextH, //容器高度
    	control:$(controlname), //绑定控制按钮
    	during:4000, //间隔4秒自动滑动
    	speed:800, //移动速度0.8秒
    	mousewheel:true, //是否开启鼠标滚轮控制
    	direkey:true //是否开启左右箭头方向控制
    });
}
  
//去除数组中的空内容
function removeArrEmpty(arrdata){
	if($.isArray(arrdata)){
		var newArr = [];
		var index = 0;
		for(var i=0;i<arrdata.length;i++){
			if(arrdata[i] != ''){
				newArr[index] = arrdata[i];
			}
		}
		
		return newArr;
	}
}

//模仿post请求
function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    
    return temp;
}