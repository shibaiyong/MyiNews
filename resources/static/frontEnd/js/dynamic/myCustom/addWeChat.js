$(function(){
//	将footer置底
	footerPutBottom();
	
//    搜索
	searchFamiliar();
	getWechatList();

})

//获取已添加的微信名称列表
function getWechatList(){
	$.ajax({
        url : ctx+'/custom/front/listWechat',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result){
        		var obj = data.resultObj;
        		if(obj.length > 0){

        			var contentwechat = '<h5>已添微信</h5>';
            		for(var i=0;i<obj.length;i++){
                        contentwechat += '<a href="javascript:;" data-biz="'+obj[i].biz+'" class="sourcesBox"><span class="contentWidth" data-biz="'+obj[i].biz+'">'+obj[i].wechat_name+'</span><span class="blodFont" data-biz="'+obj[i].biz+'">&#10005;</span></a>';
            		}
            		$('.hasAddWeb').html(contentwechat);

        		}else{
                    $('.hasAddWeb').html( '<h5>已添微信</h5>');
        			return;
        		}
        	}
        }
     })
}

//查看相似
function searchFamiliar(){
	$('.searchWechat').click(function(){
		var wechatNum = $('.wechatNum').val();
		if(wechatNum == ''){
			$('.numTip').html('<i class="fa fa-exclamation-circle red"></i> 请输入微信号');
		}else{
            $('.loading-zhe').show();
			$.ajax({
		        url : ctx+'/custom/front/familiarWechat',//这个就是请求地址对应sAjaxSource
		        data:{wechatID:wechatNum},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        success : function(data) {
                    $('.loading-zhe').hide();
		        	$('.numTip').html('');
		        	if(data.result){
		        		var obj = data.resultObj;
		        		if(obj.length>0){
		        			$('.noSearch').addClass('hide');//没有搜索结果的提示
		        			var content = '',alObj = [];
		        			
//			        		查找到的相似的任务与已有任务做对比
			        		$.ajax({
			        	        url : ctx+'/custom/front/listWechat',//这个就是请求地址对应sAjaxSource
			        	        type : 'get',
			        	        dataType : 'json',
			        	        async : true,
			        	        success : function(data) {
			        	        	if(data.result){
			        	        		
			        	        		alObj = data.resultObj;
			        	        		if(alObj.length>0){
			        	        			for(var i = 0;i<obj.length;i++){
							        			var inner = 0;
							        			for(var y = 0;y<alObj.length;y++){
							        				if(obj[i].biz == alObj[y].biz){
							        					++inner;
							        					
							        				}
							        			}
							        			
							        			if(inner!=0){
							        				content += '<tr><td>'+obj[i].wechat_name+'</td><td>'+obj[i].wechat_id+'</td><td>'+obj[i].biz+'</td><td class="shooseWechat active" data-name="'+obj[i].wechat_name+'" data-id="'+obj[i].wechat_id+'" data-biz="'+obj[i].biz+'"><span class="label label-default">已添加</span></td></tr>';
							        			}else{
							        				content += '<tr><td>'+obj[i].wechat_name+'</td><td>'+obj[i].wechat_id+'</td><td>'+obj[i].biz+'</td><td class="shooseWechat" data-name="'+obj[i].wechat_name+'" data-id="'+obj[i].wechat_id+'" data-biz="'+obj[i].biz+'"><span class="label label-default">添加</span></td></tr>';
							        			}
							        		}
			        	        		}else{
			        	        			for(var i = 0;i<obj.length;i++){
			        	        				content += '<tr><td>'+obj[i].wechat_name+'</td><td>'+obj[i].wechat_id+'</td><td>'+obj[i].biz+'</td><td class="shooseWechat" data-name="'+obj[i].wechat_name+'" data-id="'+obj[i].wechat_id+'" data-biz="'+obj[i].biz+'"><span class="label label-default">添加</span></td></tr>';
							        		}
			        	        			
			        	        		}
			        	        		
			        	        	}else{
			        	        		for(var i = 0;i<obj.length;i++){
			        	        			content += '<tr><td>'+obj[i].wechat_name+'</td><td>'+obj[i].wechat_id+'</td><td>'+obj[i].biz+'</td><td class="shooseWechat" data-name="'+obj[i].wechat_name+'" data-id="'+obj[i].wechat_id+'" data-biz="'+obj[i].biz+'"><span class="label label-default">添加</span></td></tr>';
			        	        		}
			        	        	}
			        	        	
					        		$('.familiarTable').find('table>tbody').html(content);
					        		
					        		$('.familiarTable').find('table').slideDown();
					        		
//					        		调用相似微信号
					        		chooseWechat();
			        	        }
			        		});
	
		        		}else{
		        			$('.familiarTable').find('table').slideUp();
		        			$('.determineBtn').addClass('hide');
		        		}
		        	}else{

                        setModalContent( data.errorMsg,'确定','取消');
		        		$('.familiarTable').find('table').slideUp();
	        			$('.determineBtn').addClass('hide');
		        	}
		        }
			})
		}
	})
}
//选择相似微信号
function chooseWechat(){
	$('.shooseWechat').click(function(){
		var _this = $(this);
		
		if(_this.hasClass('active')){
            setModalContent('该账号已添加过，请重新选择！','确定','取消');

		}else{
			_this.addClass('active');
			$('.familiarTable>table').attr('data-wechatname',_this.attr('data-name'))
				.attr('data-wechatid',_this.attr('data-id'))
				.attr('data-wechatbiz',_this.attr('data-biz'));
			
//			点击添加按钮，将选择的微信号保存
			conserveWechat();
			$('.wechatNum').val('');
			$('.familiarTable').find('table').slideUp();
		}
		
	})
}
//保存
function conserveWechat(){
		
		var wechatName = $('.familiarTable>table').attr('data-wechatname');
		var wechatID = $('.familiarTable>table').attr('data-wechatid');
		var biz = $('.familiarTable>table').attr('data-wechatbiz');
		
		if(wechatName == ''){
			$().toastmessage('showToast', {
            	text: '请选择微信号',
           		sticky: false,
                position : 'bottom-right',
                type: 'error',
        	});
		}else{
			$('.loading-zhe').show();
			$.ajax({
		        url : ctx+'/custom/front/addWechat',//这个就是请求地址对应sAjaxSource
		        data:{wechatID:wechatID,wechatName:wechatName,biz:biz},
		        type : 'get',
		        dataType : 'json',
		        async : true,
		        success : function(data) {
                    $('.loading-zhe').hide();
                    $('.hasAddWeb').append('<a href="javascript:;" data-biz="'+biz+'" class="sourcesBox"><span class="contentWidth" data-biz="'+biz+'">'+wechatName+'</span><span class="blodFont" data-biz="'+biz+'">&#10005;</span></a>');
		        	if(data.result){
		        		$().toastmessage('showToast', {
			            	text: '添加微信账号成功！',
			           		sticky: false,
			                position : 'bottom-right',
			                type: 'success',
			        	});
		        		
		        		$('.familiarTable>table').find('.shooseWechat').each(function(){
		        			if($(this).attr('data-biz') == biz){
		        				$(this).find('span').html('已添加');
		        			}
		        		})
//		        		将添加的信息放到右侧
		        		var content = '<div class="wechatItem" data-biz="'+biz+'"><div><div class="wechatItemLeft">';
		        		content += '<div class="wechatAccount wechatItemName"><span>微信名：</span>'+wechatName+'</div><div class="wechatAccount wechatItemNum"><span>微信号：</span>'+wechatID+'</div>';
						content += '</div><button type="button" class="close wechatItemBtn" data-biz="'+biz+'"><span aria-hidden="true">&times;</span></button>';
						content += '</div></div>';
						$('.alreadyCon').prepend(content);
						var $dom = $('.alreadyCon').find('.wechatItem').eq(0).find('.wechatItemBtn');
						$dom.click(function(){
            				$('#delModal').modal('show');
            				$('#delModal').attr('data-biz',$dom.attr('data-biz'));
            			})
		        	}else{
		        		$('.familiarTable>table').find('.shooseWechat').each(function(){
		        			if($(this).attr('data-biz') == biz){
		        				$(this).removeClass('active');
		        			}
		        		})
		        		$().toastmessage('showToast', {
			            	text: data.errorMsg,
			           		sticky: false,
			                position : 'bottom-right',
			                type: 'success',
			        	});
		        	}
		        }
			})
		}
}

//删除右侧已经添加的账号
$('.hasAddWeb').on('click','.blodFont',function(){

    var biz = $(this).attr('data-biz');
    var $this = $(this).parent();
    console.log($this);
    setModalContent('是否删除这条微信记录吗？','是','否',function(){
        deteleWeChat1(biz,$this);
    });

})

function deteleWeChat1(biz,ele){
	$.ajax({
		url : ctx+'/custom/front/deleteWechat',//这个就是请求地址对应sAjaxSource
		data:{biz:biz},
		type : 'get',
		dataType : 'json',
		async : true,
		success : function(data) {
			if(data.result){
				$().toastmessage('showToast', {
					text: '删除微信账号成功！',
					sticky: false,
					position : 'bottom-right',
					type: 'success',
				});
				ele.remove();//前端页面也删除操这条微信。
			}else{
				$().toastmessage('showToast', {
					text: '删除微信账号失败！',
					sticky: false,
					position : 'bottom-right',
					type: 'error',
				});
			}
		}
	})
}

//封装的模态框方法
function setModalContent( content,confirm,cancel ,callback1,callback2){
    $('#deleteDialog').modal('show');
    $('#deleteDialog .modal-body p').text(content);
    $('#deleteDialog .modal-body .btn-red').text(confirm);
    $('#deleteDialog .modal-body .btn-default').text(cancel);
    $('.wechat').unbind();
    $('.wechat').click(function(){
        $('#deleteDialog').modal('hide');
        if(callback1){
            callback1()
        }else{
            return false;
        }
    })
}



//将微信号、微信名称清空
function clearInput(){
	$('.wechatName').val('');
	$('.wechatNum').val('');
}

//input框获得焦点，后面的提示内容去掉
function clearTip(){
	$('.wechatName').focus(function(){
		$('.nameTip').html('');
	})
	
	$('.wechatNum').focus(function(){
		$('.numTip').html('');
	})
}


//重置
function fnReset(){
	$('.reset').click(function(){
		$('.familiarTable').find('table').slideUp();
		$('.noSearch').addClass('hide');
		$('.determineBtn').addClass('hide');
		$('.wechatNum').val('');
	});
}


//添加下方的微信名称列表

var localstoredata=localStorage.contentWechat;
$('.hasAddWeb').append(localstoredata);



