//$(document).ready(function(){
//    /*高级筛选-榜单*/	
//	$("#hotSale dd").each(function(index) {
//		$(this).click(function () {
//
//			if($(this).hasClass('selected')){return false};
//
//			$(this).addClass("selected");
//			$("#hotSale .select-all").removeClass('selected');
//			$(this).find('a').attr('data-count',index);
//			if ($(this).hasClass("select-all")) {
//				$("#HotSale").remove();
//				$(this).addClass('selected').siblings('dd').removeClass('selected');
//			} else {
//				var copyThisB = $(this).clone();
//				if ($("#HotSale").length > 0) {
//					$("#HotSale").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');;
//				} else {
//					$(".select-result dl").append(copyThisB.attr("id", "HotSale"));
//					$(".select dd").on("click", function () {
//						if ($(".select-result dd").length > 1) {
//							$(".select-no").hide();
//						} else {
//							$(".select-no").show();
//						}
//					});
//				}
//				$("#HotSale a:last").on("click", function () {
//					$(this).remove();
//					if($("#HotSale a").length > 0){
//						var dataCount = $(this).attr('data-count');
//						$('#hotSale dd.selected').each(function(index) {
//							if($(this).find('a').attr('data-count') == dataCount){
//								$(this).removeClass('selected');
//							}
//						});
//					}else{
//						$("#HotSale").remove();
//						$("#hotSale .select-all").addClass("selected").siblings().removeClass("selected");
//					}
//				});
//			}
//
//		});
//	});
//	/*高级筛选-时间*/
//	$("#customTime dd").click(function () {
//		$(this).addClass("selected").siblings().removeClass("selected");
//		if ($(this).hasClass("select-all")) {
//			$("#CustomTime").remove();
//		} else if($(this).find('a').hasClass('timeCustom')){
//			var copyThisC = $(this).clone();
//			copyThisC.find('a').text('自定义时间');
//			$('.applyBtn').click(function(){
//				if($('#TimeStart').val() == '' || $('#TimeEnd').val() == ''){
//					$(this).siblings('span').removeClass('hide');
//					return false
//				}else{
//					$(this).siblings('span').addClass('hide');
//				}
//				if ($("#CustomTime").length > 0) {
//					$("#CustomTime a").html('自定义时间');
//				} else {
//					$(".select-result dl").append(copyThisC.attr("id", "CustomTime"));
//
//					$("#CustomTime").on("click", function () {
//						$(this).remove();
//						$("#customTime .select-all").addClass("selected").siblings().removeClass("selected");
//						$('.timeCustomCon').slideUp();
//						$('#TimeStart').val('');
//						$('#TimeEnd').val('');
//					});
//					$(".select-no").hide();
//				}
//			});
//		}else{
//			var copyThisC = $(this).clone();
//			if ($("#CustomTime").length > 0) {
//				$("#CustomTime a").html($(this).text());
//			} else {
//				$(".select-result dl").append(copyThisC.attr("id", "CustomTime"));
//
//				$("#CustomTime").on("click", function () {
//					$(this).remove();
//					$("#customTime .select-all").addClass("selected").siblings().removeClass("selected");
//				});
//
//				$(".select dd").on("click", function () {
//					if ($(".select-result dd").length > 1) {
//						$(".select-no").hide();
//					} else {
//						$(".select-no").show();
//					}
//				});
//			}
//		}
//	});
//	/*高级筛选-分类*/
//	$("#hotRankClassification dd").each(function(index){
//		$(this).click(function () {
//
//			if($(this).hasClass('selected')){return false};
//
//			$(this).addClass("selected");
//			$(this).find('a').attr('data-count',index);
//			$('#hotRankClassification .select-all').removeClass('selected');
//			if ($(this).hasClass("select-all")) {
//				$("#HotRankClassification").remove();
//				$(this).addClass('selected').siblings('dd').removeClass('selected');
//				$('#hotRankClassification').siblings('dl').slideUp();
//
//			} else {
//				if($(this).hasClass('selectedClass')){
//					$('#hotRankClassification').siblings('dl').slideDown();
//				}else{
//					$(this).addClass('selected');
//					var addClassCon = addClassification(index-1);
//					/*将二级分类下拉
//					$('#hotRankClassification').siblings('dl').html('').append(addClassCon).slideDown();*/
//					$('#hotRankClassification').siblings('dl').html('').append(addClassCon);
//					var copyThisF = $(this).clone();
//					if ($("#HotRankClassification").length > 0) {
//						$("#HotRankClassification").append('<a href="#" data-count='+index+'>'+$(this).text()+'</a>');
//					} else {
//						$(".select-result dl").append(copyThisF.attr("id", "HotRankClassification"));
//
//						
//					}
//				}
//				
//			}
//
//			$("#HotRankClassification a:last").on("click", function () {
//				$(this).remove();
//				if($('#HotRankClassification a').length > 0){
//					var dataCount = $(this).attr('data-count');
//					$('#hotRankClassification dd.selected').each(function(index) {
//						if($(this).find('a').attr('data-count') == dataCount){
//							$(this).removeClass('selected');
//						}
//					});
//				}else{
//					$('#HotRankClassification').remove();
//					$("#hotRankClassification .select-all").addClass("selected").siblings().removeClass("selected selectedClass");
//					$('#hotRankClassification').siblings('dl').slideUp();
//
//					$(".select dd").on("click", function () {
//						if ($(".select-result dd").length > 1) {
//							$(".select-no").hide();
//						} else {
//							$(".select-no").show();
//						}
//					});
//				}
//				
//			});
//			
//
//			/*对新添加的标签添加事件*/
//			/*$("#hotRankClassification").siblings('dl').find('dd').click(function () {
//
//				if ($(this).hasClass("select-all")) {
//					$("#HotRankClassification").remove();
//					$(this).addClass("selected").siblings().removeClass("selected");
//					$("#hotRankClassification dd").removeClass('selected');
//				} else if ($(this).hasClass('classificationFold')){
//					$('#hotRankClassification').siblings('dl').slideUp();
//
//				}else {
//					$(this).addClass("selected").siblings().removeClass("selected");
//					$("#hotRankClassification dd").removeClass('selected');
//
//					var copyThisF = $(this).clone();
//					if ($("#HotRankClassification").length > 0) {
//						$("#HotRankClassification a").html($(this).text());
//					} else {
//						$(".select-result dl").append(copyThisF.attr("id", "HotRankClassification"));
//
//						$("#HotRankClassification").on("click", function () {
//							$(this).remove();
//							$("#hotRankClassification .select-all").addClass("selected").siblings().removeClass("selected");
//						});
//
//						$(".select dd").on("click", function () {
//							if ($(".select-result dd").length > 1) {
//								$(".select-no").hide();
//							} else {
//								$(".select-no").show();
//							}
//						});
//					}
//				}
//			});*/
//			
//			/*对新添加的标签添加事件*/
//		});
//	});
//	/*高级筛选-添加*/
//	$('.customAdd').find('.customAddBtn').click(function() {
//		if($.trim($(this).siblings('input').val()) == ''){return false;}
//		if ($("#CustomAdd").length > 0) {
//			$("#CustomAdd").append('<a href="#">'+$.trim($(this).siblings('input').val())+'</a>');
//		} else {
//			$(".select-no").hide();
//			$(".select-result dl").append('<dd class="selected" id="CustomAdd"><a href="#">'+$.trim($(this).siblings('input').val())+'</a></dd>');
//		}
//		$("#CustomAdd a").on("click", function () {
//			$(this).remove();
//			$('.customAddBtn').siblings('input').val('');
//		});
//		$(".select dd").on("click", function () {
//			if ($(".select-result dd").length > 1) {
//				$(".select-no").hide();
//			} else {
//				$(".select-no").show();
//			}
//		});
//		$('.customAddBtn').siblings('input').val('');
//	});
//
//	
//	$(".select dd").on("click", function () {
//		if ($(".select-result dd").length > 1) {
//			$(".select-no").hide();
//		} else {
//			$(".select-no").show();
//		}
//	});
//
//	/*清空全部*/
//	$('.clearAllBtn').click(function(){
//		$('.select-result dd').each(function(){
//			$(this).find('a').click();
//		});
//		$(".select-no").show();
//		$(this).css({
//			'color':'#F44336',
//			'border':'0px'
//		});
//	});
//	
//});
//
//var classificationArr = [
//	['24小时','头版头条','重大新闻事件'],
//	['外交','时局','国际关系','政党','行政','国家元首','政治理论','对外关系','涉外机构'],
//	['经济','工业','农业','林业','矿业','三农','财经','金融','股票','证券','彩票','能源','基金','理财','商业','银行','外汇','保险','房产'],
//	['人才','就业','建设','社会问题','灾难','事故','救助','社会万象','环境','环保'],
//	['美术','戏曲','戏剧','杂技','魔术','摄影','民俗','民间艺术','世界遗产','文学','佛学','宗教','书画','小说','舞蹈','古文物','哲学','历史'],
//	['购物','汽车','美食','旅游','健康','天气','医疗','医药','时尚','美容','家具','亲子'],
//	['足球','篮球','彩票','跑步','网球','高尔夫','CBA','NBA','中超','中甲','亚冠','西甲','意甲','德甲','英超','羽毛球','赛车','棋牌','台球','乒乓球','滑冰','滑雪','欧冠','奥运会','运动会','棋牌'],
//	['音乐','电视剧','影视节','电影','电影节','电影报道','明星','选美','动漫','动画','综艺','星座','游戏','演出'],
//	['战争','国防','战争','武器','防务','军情','军事教育','军事历史','军制'],
//	['法治','反腐','犯罪','司法','法律','法规','产权'],
//	['教育体制','教育管理','基础教育','学前教育','初等教育','中等教育','高等教育','成人教育','业余教育','职业技术教育','特殊教育','师范教育','少数民族地区教育综合报道','民办教育','留学','商学院','公开课','高校','培训机构','高考','考研','教育学'],
//	['数码','创业','移动&互联网','IT','通信','自然科学','宗教','哲学','医药科学','农业科学','科研队伍','科学体质','科研机构']
//];
//function addClassification(index){
//	var addClassCon = '';
//	for(var i = 0 ; i< classificationArr[index].length; i++){
//		addClassCon += '<dd><a href="#">'+classificationArr[index][i]+'</a></dd>';
//	}
//	addClassCon += '<dd class="classificationFold"><a href="#">收起&nbsp;<i class="fa fa-angle-double-up"></i></a></dd>'
//	return addClassCon;
//}