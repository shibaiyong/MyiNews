$(function(){

	$('#select1').siblings('dl').append('<dd><a href="#">湖北</a></dd><dd ><a href="#">湖南</a></dd><dd ><a href="#">广东</a></dd><dd ><a href="#">海南</a></dd><dd ><a href="#">四川</a></dd><dd ><a href="#">贵州</a></dd><dd ><a href="#">云南</a></dd><dd ><a href="#">陕西</a></dd><dd ><a href="#">甘肃</a></dd><dd ><a href="#">青海</a></dd><dd ><a href="#">台湾</a></dd><dd ><a href="#">广西</a></dd><dd ><a href="#">西藏</a></dd><dd ><a href="#">新疆</a></dd><dd ><a href="#">香港</a></dd><dd ><a href="#">澳门</a></dd><dd ><a href="#">内蒙古</a></dd><dd ><a href="#">黑龙江</a></dd><dd ><a href="#">宁夏回族</a></dd><dd class="regionOtherRet"><a href="#">收起&nbsp;<i class="fa fa-angle-double-up"></i></a></dd>');

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

				var copyThisA = $(this).clone();
				if ($("#selectA").length > 0) {
					$("#selectA").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');
				} else {
					$(".select-result dl").append(copyThisA.attr("id", "selectA"));

				}

				$("#selectA a:last").bind("click", function () {
					$(this).remove();
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
		});
		
	});

	$("#select1").siblings('dl').find('dd').each(function(index) {
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			if($(this).hasClass('regionOtherRet')){
				$("#select1").siblings('dl').slideUp();
			}else{
				$(this).addClass("selected");
				$("#select1 dd.select-all").removeClass('selected');
				$(this).find('a').attr('data-count-amb',index);
				if ($(this).hasClass("select-all")) {
					$("#selectA").remove();
				} else {
					var copyThisA = $(this).clone();
					if ($("#selectA").length > 0) {
						$("#selectA").append('<a href="#" data-count-amb='+index+'>'+$(this).text()+'</a>');
					} else {
						$(".select-result dl").append(copyThisA.attr("id", "selectA"));
						$(".select-no").hide();
					}
				}				
				$("#selectA a:last").on("click", function () {
					$(this).remove();
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
			
		});
	});
	
	$("#select2 dd").each(function(index) {
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			$(this).addClass("selected");
			$("#select2 .select-all").removeClass('selected');
			$(this).find('a').attr('data-count',index);
			if ($(this).hasClass("select-all")) {
				$("#selectB").remove();
				$(this).addClass('selected').siblings('dd').removeClass('selected');
			} else {
				var copyThisB = $(this).clone();
				if ($("#selectB").length > 0) {
					$("#selectB").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');;
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
					$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
					 $(".timeSelected ").val("全部");
					 $('.timeCustomCon').slideUp();
					$('#TimeStart').val('');
					$('#TimeEnd').val('');
				});
				$(".select-no").hide();
			}
		}
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
	});

	$("#select4 dd").each(function(index){
		$(this).click(function () {

			if($(this).hasClass('selected')){return false};

			$(this).addClass("selected");
			$(this).find('a').attr('data-count',index);
			$('#select4 .select-all').removeClass('selected');
			if ($(this).hasClass("select-all")) {
				$("#selectF").remove();
				$(this).addClass('selected').siblings('dd').removeClass('selected');
				$('#select4').siblings('dl').slideUp();

			} else {
				if($(this).hasClass('selectedClass')){
					$('#select4').siblings('dl').slideDown();
				}else{
					$(this).addClass('selected');
					var addClassCon = addClassification(index-1);
					/*将二级分类下拉
					$('#select4').siblings('dl').html('').append(addClassCon).slideDown();*/
					$('#select4').siblings('dl').html('').append(addClassCon);
					var copyThisF = $(this).clone();
					if ($("#selectF").length > 0) {
						$("#selectF").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');
					} else {
						$(".select-result dl").append(copyThisF.attr("id", "selectF"));

						
					}
				}
				
			}

			$("#selectF a:last").on("click", function () {
				$(this).remove();
				if($('#selectF a').length > 0){
					var dataCount = $(this).attr('data-count');
					$('#select4 dd.selected').each(function(index) {
						if($(this).find('a').attr('data-count') == dataCount){
							$(this).removeClass('selected');
						}
					});
				}else{
					$('#selectF').remove();
					$("#select4 .select-all").addClass("selected").siblings().removeClass("selected selectedClass");
					$('#select4').siblings('dl').slideUp();

					$(".select dd").on("click", function () {
						if ($(".select-result dd").length > 1) {
							$(".select-no").hide();
						} else {
							$(".select-no").show();
						}
					});
				}
				
			});
			

			/*对新添加的标签添加事件*/
			/*$("#select4").siblings('dl').find('dd').click(function () {

				if ($(this).hasClass("select-all")) {
					$("#selectF").remove();
					$(this).addClass("selected").siblings().removeClass("selected");
					$("#select4 dd").removeClass('selected');
				} else if ($(this).hasClass('classificationFold')){
					$('#select4').siblings('dl').slideUp();

				}else {
					$(this).addClass("selected").siblings().removeClass("selected");
					$("#select4 dd").removeClass('selected');

					var copyThisF = $(this).clone();
					if ($("#selectF").length > 0) {
						$("#selectF a").html($(this).text());
					} else {
						$(".select-result dl").append(copyThisF.attr("id", "selectF"));

						$("#selectF").on("click", function () {
							$(this).remove();
							$("#select4 .select-all").addClass("selected").siblings().removeClass("selected");
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
			});*/
			
			/*对新添加的标签添加事件*/
		});
	});

		
	

	$('.customAdd').find('.customAddBtn').click(function() {
		$('.screenTableClick').each(function(){
			if($(this).hasClass('activeOrange')){
				$(this).removeClass('activeOrange');
			}
		});
		if($.trim($(this).siblings('input').val()) == ''){return false;}
		if ($("#selectD").length > 0) {
			$("#selectD").append('<a href="#">'+$.trim($(this).siblings('input').val())+'</a>');
		} else {
			$(".select-no").hide();
			$(".select-result dl").append('<dd class="selected" id="selectD"><a href="#">'+$.trim($(this).siblings('input').val())+'</a></dd>');
		}
		$("#selectD a").on("click", function () {
			$(this).remove();
			$('.customAddBtn').siblings('input').val('');
		});
		$(".select dd").on("click", function () {
			if ($(".select-result dd").length > 1) {
				$(".select-no").hide();
			} else {
				$(".select-no").show();
			}
		});
		$('.customAddBtn').siblings('input').val('');
	});

	$('#screenSource').find('li').each(function(index) {

		$(this).click(function(){

			if($(this).hasClass('active')){return false};

			$(this).attr('data-count',index);

			if ($("#selectE").length > 0) {
				$("#selectE").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');
			} else {
				$(".select-no").hide();
				$(".select-result dl").append('<dd class="selected" id="selectE"><a href="#" data-count='+index+'>'+$(this).text()+'</a></dd>');
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
		});
		
		$('.userSider').find('ul.nav>li.navItem').eq(0).click(function(){
			$('#selectE').remove();
			
		});
	});
	
	$(".select dd").on("click", function () {
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
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
	});
	
});

var classificationArr = [
	['24小时','头版头条','重大新闻事件'],
	['外交','时局','国际关系','政党','行政','国家元首','政治理论','对外关系','涉外机构'],
	['经济','工业','农业','林业','矿业','三农','财经','金融','股票','证券','彩票','能源','基金','理财','商业','银行','外汇','保险','房产'],
	['人才','就业','建设','社会问题','灾难','事故','救助','社会万象','环境','环保'],
	['美术','戏曲','戏剧','杂技','魔术','摄影','民俗','民间艺术','世界遗产','文学','佛学','宗教','书画','小说','舞蹈','古文物','哲学','历史'],
	['购物','汽车','美食','旅游','健康','天气','医疗','医药','时尚','美容','家具','亲子'],
	['足球','篮球','彩票','跑步','网球','高尔夫','CBA','NBA','中超','中甲','亚冠','西甲','意甲','德甲','英超','羽毛球','赛车','棋牌','台球','乒乓球','滑冰','滑雪','欧冠','奥运会','运动会','棋牌'],
	['音乐','电视剧','影视节','电影','电影节','电影报道','明星','选美','动漫','动画','综艺','星座','游戏','演出'],
	['战争','国防','战争','武器','防务','军情','军事教育','军事历史','军制'],
	['法治','反腐','犯罪','司法','法律','法规','产权'],
	['教育体制','教育管理','基础教育','学前教育','初等教育','中等教育','高等教育','成人教育','业余教育','职业技术教育','特殊教育','师范教育','少数民族地区教育综合报道','民办教育','留学','商学院','公开课','高校','培训机构','高考','考研','教育学'],
	['数码','创业','移动&互联网','IT','通信','自然科学','宗教','哲学','医药科学','农业科学','科研队伍','科学体质','科研机构']
];
function addClassification(index){
	var addClassCon = '';
	for(var i = 0 ; i< classificationArr[index].length; i++){
		addClassCon += '<dd><a href="#">'+classificationArr[index][i]+'</a></dd>';
	}
	addClassCon += '<dd class="classificationFold"><a href="#">收起&nbsp;<i class="fa fa-angle-double-up"></i></a></dd>'
	return addClassCon;
}