function nineslide()
{
	/* ��ʾ */
	function show(obj)
	{
		var imgobj = $(obj); // �����ͼƬ����
		var imgdiv = imgobj.parents('.wimg'); // ���ͼƬ����ĸ���
		var slidediv = imgdiv.next('.big_wimg'); // ���ͼƬ�ĻõƲ�

		imgdiv.slideToggle('slow', function(){ slidediv.slideToggle(); }); // չ��
		
		var imgpos = 0; // ��ǰ��ʾ��ͼƬ�±�
		var slideImg = new Array(); // ͼƬ����
		imgdiv.find('img').each(function(){
			var src = $(this).attr('src');
			slideImg.push(src);
			if (src == imgobj.attr('src')) imgpos = $(this).index();
			$('.big_imgbox ul').append('<li><img src="'+ slideImg[$(this).index()] +'" ></li>');
			$('.big_imgbox li').removeClass('show').eq(imgpos).addClass('show');
			$('.big_imgbox img').eq($(this).index()).click(function(){
				imgpos = $.inArray($(this).attr('src'), slideImg);
				$('.big_imgbox li').removeClass('show');
				$(this).parents('li').addClass('show');
				slidediv.find('#mainpic').attr('src', $(this).attr('src'));
				smallshow(imgpos);
				});
		});

		slidediv.find('#mainpic').attr('src', slideImg[imgpos]); // ��ʾ���ͼ
		slidediv.find('.big_wimg_link a').unbind('click').click(function(){
			switch ($(this).index())
			{
				case 0: // ����
					slidediv.slideToggle('slow', function(){ imgdiv.slideToggle(); });
					break;
				case 1: // �鿴��ͼ
					window.open(slideImg[imgpos] , '_blank');
					break;
			}	
		}); // �������𡢲鿴��ͼ��������ת��������ת
		
		var x = 1;
		var y = 1;
			slidediv.find('.n_img').unbind('click').click(function(){
				if(x == 1)
				{
					x = 0;
					if ((imgpos + 1) == slideImg.length) imgpos = 0;
					else imgpos = imgpos + 1;
		
					smallshow(imgpos);
					slidediv.find('.sul').append('<li><img src="' + slideImg[imgpos] + '" id="mainpic" ></li>');
					slidediv.find('.sul').stop().animate({'left':-440}, function(){
						slidediv.find('.sul').attr('style', '');
						slidediv.find('.sul').find('li').first().remove();
						x = 1;
					});
					$('.big_imgbox li').removeClass('show').eq(imgpos).addClass('show');
				}
		}); // ��һ��
		
		slidediv.find('.p_img').unbind('click').click(function(){
			if(y == 1)
				{
						y = 0;
						if (imgpos == 0) imgpos = slideImg.length - 1;
						else imgpos = imgpos - 1;
				
						smallshow(imgpos);
						slidediv.find('.sul').prepend('<li><img src="' + slideImg[imgpos] + '" id="mainpic" ></li>');
						slidediv.find('.sul').attr('style', 'left:-440px');
						slidediv.find('.sul').stop().animate({'left':0}, function(){
							slidediv.find('.sul').attr('style', '');
							slidediv.find('.sul').find('li').last().remove();
							y = 1;
						});
						$('.big_imgbox li').removeClass('show').eq(imgpos).addClass('show');
			}
		}); // ��һ��
		
		smallshow(imgpos);
		function smallshow(imgpos){
			$('.big_imgbox').find('img').each(function(){
				imgpost = $.inArray($(this).attr('src'), slideImg);
				if ( imgpost >= 9)
				{
					if(imgpos >= 9) $(this).parent('li').show();
					else $(this).parent('li').hide();
				} else {
						if(imgpos >= 9) $(this).parent('li').hide();
						else $(this).parent('li').show();
				}
			});
		}
	}
	
	/* ����ͼƬ��� */
	$('.wimg').find('img').click(function(){
		show(this);	
	});
	
	/* ��Ƶ���� */
	var url = ''; // ��������
	var videoarray = new Array(); // ��Ƶ����
		$('.weibo_baogao li').each(function(){
			var videoid = $(this).index(); // li �±�
			if($(this).find('embed').length>0){ // �ж�����embed��ǩ
				var info = $(this).find('p').html().substring($(this).find('p').html().indexOf('http://'),$(this).find('p').html().length);
				url = info.substring(0, info.indexOf(' ')); // ��������
				videoarray.push(url);
				var change = $(this).find('p').html().replace(url,'<a class="openvideo">'+videoarray[videoid]+'</a>');
				$(this).find('p').html(change); // �滻���ӱ�ǩ	
				$(this).find('embed').attr('src', videoarray[videoid]); // �޸���Ƶ��ǩsrc
			}else{
				url = '';
				videoarray.push(url);
			} 
		});
		
	$('.weibo_baogao li').find('.openvideo').unbind('click').click(function(){  // ������ӵ�����Ƶ	
		$(this).parents('.txtcon').children('.vedio').show('slow', 'swing');
	});
	$('.imgicon01').click(function(){ // ����
		$(this).parents('.txtcon').children('.vedio').hide('slow', 'swing');
	});	
		
}