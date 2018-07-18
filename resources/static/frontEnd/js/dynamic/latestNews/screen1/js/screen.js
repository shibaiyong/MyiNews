$(function(){
	$('#select1').siblings('dl').append('<dd ><a href="javascript:void(0);">湖南</a></dd><dd ><a href="javascript:void(0);">广东</a></dd><dd ><a href="javascript:void(0);">海南</a></dd><dd ><a href="javascript:void(0);">四川</a></dd><dd ><a href="javascript:void(0);">贵州</a></dd><dd ><a href="javascript:void(0);">云南</a></dd><dd ><a href="javascript:void(0);">陕西</a></dd><dd ><a href="javascript:void(0);">甘肃</a></dd><dd ><a href="javascript:void(0);">青海</a></dd><dd ><a href="javascript:void(0);">台湾</a></dd><dd ><a href="javascript:void(0);">广西</a></dd><dd ><a href="javascript:void(0);">西藏</a></dd><dd ><a href="javascript:void(0);">新疆</a></dd><dd ><a href="javascript:void(0);">香港</a></dd><dd ><a href="javascript:void(0);">澳门</a></dd><dd ><a href="javascript:void(0);">内蒙古</a></dd><dd ><a href="javascript:void(0);">黑龙江</a></dd><dd ><a href="javascript:void(0);">宁夏回族</a></dd><dd class="regionOtherRet"><a href="javascript:void(0);">收起&nbsp;<i class="fa fa-angle-double-up"></i></a></dd>');

	$("#select1 dd").each(function(index) {

		$(this).click(function () {
			if($(this).hasClass('selected')){return false};

			if ($(this).hasClass("select-all")) {
				$("#selectA").remove();
				$(this).addClass("selected").siblings().removeClass("selected");
				$("#select1").siblings('dl').find('dd').removeClass('selected');
			} else if($(this).hasClass('regionOther')){
				$(this).parents('dl').siblings('dl').slideDown();
			}else{
				$("#select1 dd.select-all").removeClass('selected');
				$(this).addClass("selected").find('a').attr('data-count',index);
				$(this).siblings().removeClass('selected');
				$("#select1").siblings('dl').find('dd').removeClass('selected');
				var copyThisA = $(this).clone();
				if ($("#selectA").length > 0) {
//					$("#selectA").append('<a href="javascript:void(0);" data-count='+index+'>'+$(this).text()+'</a>');
					$("#selectA a").html($(this).text())
				} else {
					$(".select-result dl").append(copyThisA.attr("id", "selectA"));

				}

				$("#selectA a:last").bind("click", function () {
					$(this).remove();
					reloadNewsList();
					if($("#selectA a").length > 0){
						var dataCount = $(this).attr('data-count');
						$('#select1 dd.selected').each(function(index) {
							if($(this).find('a').attr('data-count') == dataCount){
								$(this).removeClass('selected');
							}
						});
					}else{
						$('#selectA').remove();
						$("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
						$("#select1").siblings('dl').slideUp();
					}

					$(".select dd").on("click", function () {
						if ($(".select-result dd").length > 1) {
							$(".select-no").hide();
						}else{
							$(".select-no").show();
						}
					});
					
				});
			}
			//刷新列表
			reloadNewsList();
		});
		
	});

	$("#select1").siblings('dl').find('dd').each(function(index) {
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			if($(this).hasClass('regionOtherRet')){
				$("#select1").siblings('dl').slideUp();
			}else{
				$(this).addClass("selected");
				$(this).siblings().removeClass('selected');
				$("#select1 dd").removeClass('selected')
				$("#select1 dd.select-all").removeClass('selected');
				$(this).find('a').attr('data-count-amb',index);
				if ($(this).hasClass("select-all")) {
					$("#selectA").remove();
					
				} else {
					var copyThisA = $(this).clone();
					if ($("#selectA").length > 0) {
//						$("#selectA").append('<a href="javascript:void(0);" data-count-amb='+index+'>'+$(this).text()+'</a>');
						$("#selectA a").html($(this).text())
					} else {
						$(".select-result dl").append(copyThisA.attr("id", "selectA"));
						$(".select-no").hide();
					}
				}				
				$("#selectA a:last").on("click", function () {
					$(this).remove();
					reloadNewsList();
					if($("#selectA a").length > 0){
						var dataCount = $(this).attr('data-count-amb');
						$('#select1').siblings('dl').find('dd.selected').each(function(index) {
							if($(this).find('a').attr('data-count-amb') == dataCount){
								$(this).removeClass('selected');
							}
						});
					}else{
						$('#selectA').remove();
						$("#select1 .select-all").addClass("selected").parents('#select1').siblings('dl').find('dd').removeClass('selected');
						$("#select1").siblings('dl').slideUp();
					}
				});						
				$(".select dd").on("click", function () {
					if ($(".select-result dd").length > 1) {
						$(".select-no").hide();
					} else {
						$(".select-no").show();
					}
				});
			}
			//刷新列表
			reloadNewsList();
		});
		
	});
	
	$("#select2 dd").each(function(index) {
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			$(this).addClass("selected");
			$(this).siblings().removeClass('selected');
			$("#select2 .select-all").removeClass('selected');
			$(this).find('a').attr('data-count',index);
			if ($(this).hasClass("select-all")) {
				$("#selectB").remove();
				$(this).addClass('selected').siblings('dd').removeClass('selected');
			} else {
				var copyThisB = $(this).clone();
				if ($("#selectB").length > 0) {
//					$("#selectB").append('<a href="javascript:void(0);" data-count='+index+'>'+$(this).text()+'</a>');
					$("#selectB a").html($(this).text())
				} else {
					$(".select-result dl").append(copyThisB.attr("id", "selectB"));
					$(".select dd").on("click", function () {
						if ($(".select-result dd").length > 1) {
							$(".select-no").hide();
						} else {
							$(".select-no").show();
						}
					});
				}
				$("#selectB a:last").on("click", function () {
					$(this).remove();
					reloadNewsList();
					if($("#selectB a").length > 0){
						var dataCount = $(this).attr('data-count');
						$('#select2 dd.selected').each(function(index) {
							if($(this).find('a').attr('data-count') == dataCount){
								$(this).removeClass('selected');
							}
						});
					}else{
						$("#selectB").remove();
						$("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
					}
				});
			}
			//刷新列表
			reloadNewsList();
		});
		
	});

	$('.timeSelected').change(function(){
		console.log($('.timeSelected').prop('selectedIndex'));
		var timeIndex = $('.timeSelected').prop('selectedIndex');
		$('#select3').find('dd').eq(timeIndex).addClass('selected').siblings('dd').removeClass('selected');
		if($(this).val() == '全部'){
			$("#selectC").remove();
			$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
		}else{
			if($("#selectC").length > 0){
				$("#selectC a").html($(this).val());
			}else{
				$(".select-result dl").append('<dd class="selected" id="selectC"><a href="javascript:void(0);">'+$(this).val()+'</a></dd>');

				$("#selectC").on("click", function () {
					$(this).remove();
					reloadNewsList();
					$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
					 $(".timeSelected ").val("全部");
					 $('.timeCustomCon').slideUp();
					$('#TimeStart').val('');
					$('#TimeEnd').val('');
				});
				$(".select-no").hide();
			}
		}
		//刷新列表
		reloadNewsList();
	});
	
	$("#select3 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if($(this).find('a').html() == '自定义'){
			$(".timeSelected ").val('全部');
		}else{

			$(".timeSelected ").val($(this).find('a').html());
		}
		if ($(this).hasClass("select-all")) {
			$("#selectC").remove();
		} else if($(this).find('a').hasClass('timeCustom')){
		}else{
			var copyThisC = $(this).clone();
			if ($("#selectC").length > 0) {
				$("#selectC a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisC.attr("id", "selectC"));

				$("#selectC").on("click", function () {
					$(this).remove();
					reloadNewsList();
					$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
					$(".timeSelected ").val("全部");
					$('.timeCustomCon').slideUp();
				});

				$(".select dd").on("click", function () {
					if ($(".select-result dd").length > 1) {
						$(".select-no").hide();
					} else {
						$(".select-no").show();
					}
				});
			}
		}
		//刷新列表
		reloadNewsList();
	});

	$("#select4 dd").each(function(index){
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			$(this).addClass("selected");
			
			$(this).siblings().removeClass('selected');
			
			$(this).find('a').attr('data-count',index);
			$('#select4 .select-all').removeClass('selected');
			if ($(this).hasClass("select-all")) {
				$("#selectF").remove();
				$(this).addClass('selected').siblings('dd').removeClass('selected');
				$('#select4').siblings('dl').slideUp();
				if($('.classificationAmb').height()>0){
					$('.sortDown').find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(0deg)',
						'-moz-transform': 'rotate(0deg)',
						'-webkit-transform': 'rotate(0deg)',
						'transform': 'rotate(0deg)'
					});
				};
			} else {
				if($(this).hasClass('selectedClass')){
					$('#select4').siblings('dl').slideDown();
					$(this).find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(-90deg)',
						'-moz-transform': 'rotate(-90deg)',
						'-webkit-transform': 'rotate(-90deg)',
						'transform': 'rotate(-90deg)'
					});
				}else{
					$(this).addClass('selected');
					$(this).siblings().removeClass('selected');
					$('#select4').siblings('dl').slideUp();
					$('.sortDown').find('i').css({
						'-o-transition': 'transform .2s linear',
						'-moz-transition':' transform .2s linear',
						'-webkit-transition': 'transform .2s linear',
						'-ms-transition': 'transform .2s linear',
						'-ms-transform': 'rotate(0deg)',
						'-moz-transform': 'rotate(0deg)',
						'-webkit-transform': 'rotate(0deg)',
						'transform': 'rotate(0deg)'
					});
					
					if($.trim($(this).text()) == '经济'){
						var addClassCon = addClassification(index-1);
						/*将二级分类下拉*/
						$('#select4').siblings('dl').html('').append(addClassCon).slideDown();
						$(this).find('i').css({
							'-o-transition': 'transform .2s linear',
							'-moz-transition':' transform .2s linear',
							'-webkit-transition': 'transform .2s linear',
							'-ms-transition': 'transform .2s linear',
							'-ms-transform': 'rotate(-90deg)',
							'-moz-transform': 'rotate(-90deg)',
							'-webkit-transform': 'rotate(-90deg)',
							'transform': 'rotate(-90deg)'
						});
						
						/*对新添加的标签添加事件*/
						$("#select4").siblings('dl').find('dd').each(function(index){
							
							$(this).click(function(){
								if($(this).hasClass('selected')){return false};
								$(this).find('a').attr('data-count-next',index);
								
								if ($(this).hasClass("select-all")) {
									$("#selectF").remove();
									$(this).addClass("selected").siblings().removeClass("selected");
									$("#select4 dd").removeClass('selected');
								} else if ($(this).hasClass('classificationFold')){
									$('#select4').siblings('dl').slideUp();

								}else{
									$(this).addClass("selected");
									$(this).siblings().removeClass('selected');
									var copyThisF = $(this).clone();
//									$('#selectF').find('a').each(function(){
//										if($.trim($(this).text())=='经济'){
//											$(this).remove();
//										}
//									});
//									alert($(this).text());
//									$("#selectF").append('<a href="javascript:void(0);" data-count-next='+index+'>'+$(this).text()+'</a>');
									$("#selectF a").html($(this).text());
								}
								
								$("#selectF a:last").on("click", function () {
									$(this).remove();
									reloadNewsList();
									if($('#selectF a').length >0){
										var dataCount = $(this).attr('data-count-next');
										$("#select4").siblings('dl').find('dd.selected').each(function(index) {
											if($(this).find('a').attr('data-count-next') == dataCount){
												$(this).removeClass('selected');
											}
										});
										$('#selectF').find('a').each(function(){
											if($(this).attr('data-count-next') != undefined){return false;}
												$('#select4').siblings('dl').slideUp();
												if($('.classificationAmb').height()>0){
													$('.sortDown').find('i').css({
														'-o-transition': 'transform .2s linear',
														'-moz-transition':' transform .2s linear',
														'-webkit-transition': 'transform .2s linear',
														'-ms-transition': 'transform .2s linear',
														'-ms-transform': 'rotate(0deg)',
														'-moz-transform': 'rotate(0deg)',
														'-webkit-transform': 'rotate(0deg)',
														'transform': 'rotate(0deg)'
													});
												};
												$('#select4 dd').find('a.sortDown').parent('dd').removeClass('selected');
											
										});
										
									}else{
										$('#selectF').remove();
										$("#select4 .select-all").addClass("selected").siblings().removeClass("selected selectedClass");
										$("#select4").siblings('dl').find('dd').removeClass('selected');
										$('#select4').siblings('dl').slideUp();
										if($('.classificationAmb').height()>0){
											$('.sortDown').find('i').css({
												'-o-transition': 'transform .2s linear',
												'-moz-transition':' transform .2s linear',
												'-webkit-transition': 'transform .2s linear',
												'-ms-transition': 'transform .2s linear',
												'-ms-transform': 'rotate(0deg)',
												'-moz-transform': 'rotate(0deg)',
												'-webkit-transform': 'rotate(0deg)',
												'transform': 'rotate(0deg)'
											});
										};

										$(".select dd").on("click", function () {
											if ($(".select-result dd").length > 1) {
												$(".select-no").hide();
											} else {
												$(".select-no").show();
											}
										});
									}
									
								});
								//刷新列表
								reloadNewsList();
							});
						});
						
						/*对新添加的标签添加事件*/
						
					}
					
					/*$('#select4').siblings('dl').html('').append(addClassCon);*/
					if($.trim($(this).text()) == '经济'){
						var copyThisF = $(this).clone();
						copyThisF.find('i').remove();
					}else{
						var copyThisF = $(this).clone();
					}
					if ($("#selectF").length > 0) {
//						$("#selectF").append('<a href="javascript:void(0);" data-count='+index+'>'+$(this).text()+'</a>');
						$("#selectF a").html($(this).text());
					} else {
						$(".select-result dl").append(copyThisF.attr("id", "selectF"));

						
					}
				}
				
			}
			
			

			$("#selectF a:last").on("click", function () {
				$(this).remove();
				reloadNewsList();
				if($('#selectF a').length > 0){
					var dataCount = $(this).attr('data-count');
					$('#select4 dd.selected').each(function(index) {
						if($(this).find('a').attr('data-count') == dataCount){
							$(this).removeClass('selected');
						}
					});
					if($(this).hasClass('sortDown')){
						$('#select4').siblings('dl').slideUp();
						if($('.classificationAmb').height()>0){
							$('.sortDown').find('i').css({
								'-o-transition': 'transform .2s linear',
								'-moz-transition':' transform .2s linear',
								'-webkit-transition': 'transform .2s linear',
								'-ms-transition': 'transform .2s linear',
								'-ms-transform': 'rotate(0deg)',
								'-moz-transform': 'rotate(0deg)',
								'-webkit-transform': 'rotate(0deg)',
								'transform': 'rotate(0deg)'
							});
						};
					}
				}else{
					$('#selectF').remove();
					$("#select4 .select-all").addClass("selected").siblings().removeClass("selected selectedClass");
					$('#select4').siblings('dl').slideUp();
					if($('.classificationAmb').height()>0){
						$('.sortDown').find('i').css({
							'-o-transition': 'transform .2s linear',
							'-moz-transition':' transform .2s linear',
							'-webkit-transition': 'transform .2s linear',
							'-ms-transition': 'transform .2s linear',
							'-ms-transform': 'rotate(0deg)',
							'-moz-transform': 'rotate(0deg)',
							'-webkit-transform': 'rotate(0deg)',
							'transform': 'rotate(0deg)'
						});
					};

					$(".select dd").on("click", function () {
						if ($(".select-result dd").length > 1) {
							$(".select-no").hide();
						} else {
							$(".select-no").show();
						}
					});
				}
				
			});
			
			//刷新列表
			reloadNewsList();

			
		});
	});

		
	
	var inputValOld = $('.customAddBtn').siblings('input').val();
	$('.customAdd').find('.customAddBtn').click(function() {
		$('.dataSortWays').each(function(index){
			if(index == 0){
				$(this).addClass('active');
				
			}else{
				$(this).removeClass('active');
			}
		});
//		$('.screenTableClick').each(function(){
//			if($(this).hasClass('activeOrange')){
//				$(this).removeClass('activeOrange');
//				$('#showSimilar').val('false');
//			}else{
//				$('#showSimilar').val('true');
//			}
//		});
		if($.trim($(this).siblings('input').val()) == ''){return false;}
//		if(inputValOld == $('.customAddBtn').siblings('input').val()){
//			return false;
//		}else{
//			inputValOld = $('.customAddBtn').siblings('input').val();
//		}
		if ($("#selectD").length > 0) {
//			$("#selectD").append('<a href="javascript:void(0);">'+)+'</a>');
			$("#selectD a").html($.trim($(this).siblings('input').val()));
		} else {
			$(".select-no").hide();
			$(".select-result dl").append('<dd class="selected" id="selectD"><a href="javascript:void(0);">'+$.trim($(this).siblings('input').val())+'</a></dd>');
		}
		$("#selectD").on("click", function () {
			$(this).remove();
			if($('#selectD a').length == 0){
				$('.dataSortWays').each(function(index){
					if(index == 0){
						$(this).removeClass('active');
						
					}else{
						$(this).addClass('active');
					}
				});
			}
			
			//刷新列表
			reloadNewsList();
		});
		$(".select dd").on("click", function () {
			if ($(".select-result dd").length > 1) {
				$(".select-no").hide();
			} else {
				$(".select-no").show();
			}
		});
		/*$('.customAddBtn').siblings('input').val('');*/
		
		//刷新列表
		reloadNewsList();
	});

	$('#screenSource').find('li').each(function(index) {

		$(this).click(function(){

			if($(this).hasClass('active')){return false};
			
			$(this).attr('data-count',index);
			if ($("#selectE").length > 0) {
//				$("#selectE").append('<a href="javascript:void(0);" data-count='+index+'>'+$(this).text()+'</a>');
				$("#selectE a").html($(this).text())
			} else {
				$(".select-no").hide();
				$(".select-result dl").append('<dd class="selected" id="selectE"><a href="javascript:void(0);" data-count='+index+'>'+$(this).text()+'</a></dd>');
				/*$("#selectE a").on("click", function () {
					$(this).remove();
					$('#screenSource').find('li').removeClass('active');
				});*/
				$(".select dd").on("click", function () {
					if ($(".select-result dd").length > 1) {
						$(".select-no").hide();
					} else {
						$(".select-no").show();
					}
				});
			}

			$("#selectE a:last").on("click", function () {
				$(this).remove();
				reloadNewsList();
				if($('#selectE a').length > 0){
					var dataCount = $(this).attr('data-count');
					$('#screenSource li').each(function(index) {
						if($(this).attr('data-count') == dataCount){
							$(this).removeClass('active');
						}
					});
				}else{
					$('#selectE').remove();
					$('.userSider').find('ul.nav>li.navItem').eq(0).click();
					$(".select dd").on("click", function () {
						if ($(".select-result dd").length > 1) {
							$(".select-no").hide();
						} else {
							$(".select-no").show();
						}
					});
				}
				
			});
			reloadNewsList();
		});
		
		$('.userSider').find('ul.nav>li.navItem').eq(0).click(function(){
			$('#selectE').remove();
			reloadNewsList();
		});
	});
	
	$(".select dd").on("click", function () {
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});

	/*来源*/
	$('#checkCity').find('input#homecity_name').blur(function(){
		
		
		if($.trim($(this).val()) == ''){
			if($("#CheckCity").length > 0){
				$('#CheckCity').remove();
			}else{
				return;
			}
		}else{
			if ($("#CheckCity").length > 0) {
				$("#CheckCity").html('');
				$("#CheckCity").append('<a href="javascript:void(0);">'+$.trim($(this).val())+'</a>');
			} else {
				$(".select-no").hide();
				$(".select-result dl").append('<dd class="selected" id="CheckCity"><a href="javascript:void(0);">'+$.trim($(this).val())+'</a></dd>');
			}
		}
		$("#CheckCity a").on("click", function () {
			$(this).remove();
		});
		//刷新列表
		reloadNewsList();
	});
	
	/*清空全部*/
	$('.clearAllBtn').click(function(){
		$('.select-result dd').each(function(){
			$(this).find('a').click();
		});
		$(".select-no").show();
		$(this).css({
			'color':'#F44336',
			'border':'0px'
		});
		//刷新列表
		reloadNewsList();
	});
	
});

var classificationArr = [
//	[],
//	['人才','就业','建设','社会问题','灾难','事故','救助','社会万象','环境','环保'],
//	['经济','工业','农业','林业','矿业','三农','财经','金融','股票','证券','彩票','能源','基金','理财','商业','银行','外汇','保险','房产'],
//	['人才','就业','建设','社会问题','灾难','事故','救助','社会万象','环境','环保'],
//	['美术','戏曲','戏剧','杂技','魔术','摄影','民俗','民间艺术','世界遗产','文学','佛学','宗教','书画','小说','舞蹈','古文物','哲学','历史'],
//	['购物','汽车','美食','旅游','健康','天气','医疗','医药','时尚','美容','家具','亲子'],
//	['足球','篮球','彩票','跑步','网球','高尔夫','CBA','NBA','中超','中甲','亚冠','西甲','意甲','德甲','英超','羽毛球','赛车','棋牌','台球','乒乓球','滑冰','滑雪','欧冠','奥运会','运动会','棋牌'],
//	['音乐','电视剧','影视节','电影','电影节','电影报道','明星','选美','动漫','动画','综艺','星座','游戏','演出'],
//	['战争','国防','战争','武器','防务','军情','军事教育','军事历史','军制'],
//	['法治','反腐','犯罪','司法','法律','法规','产权'],
//	['教育体制','教育管理','基础教育','学前教育','初等教育','中等教育','高等教育','成人教育','业余教育','职业技术教育','特殊教育','师范教育','少数民族地区教育综合报道','民办教育','留学','商学院','公开课','高校','培训机构','高考','考研','教育学'],
//	[]
];
function addClassification(index){
	
	var addClassCon = '';
	for(var i = 0 ; i< classificationArr[index].length; i++){
		addClassCon += '<dd><a href="javascript:void(0);"><span dataName="'+classificationArr[index][i]+'">'+classificationArr[index][i]+'</span></a></dd>';
	}
	/*addClassCon += '<dd class="classificationFold"><a href="javascript:void(0);">收起&nbsp;<i class="fa fa-angle-double-up"></i></a></dd>'*/
	return addClassCon;
}