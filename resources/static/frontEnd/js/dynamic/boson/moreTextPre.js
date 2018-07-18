function textAreaControl() {
	
	var content = $("#txt-analysis").val();
	//alert(content.trim());
	content = content.trim();
	// conten is null
	if (content.length==0) {

		$('#btn-analysis').addClass('disabled');
		$('#btn-analysis').attr('disabled', "true");
		$('#btn-analysis').css('pointer-events','visible')

	} else {
		$('#btn-analysis').removeAttr("disabled");
		$('#btn-analysis').removeClass("disabled");
	}

}
function submitText() {

	// page init
	$("#wordFreqClassify").html("<dt>实体类别图示:</dt>");
	$("#wordFreqAnalysis").html("");
	var content = $("#txt-analysis").val();
	// get data
	var jsonStr = {
		content : content,
		// sentiment parameter
		sentimentType : "news",
		// ner parameter
		nerSensitivity : 3,
		// cluster parameter
		clusterValue : "3",
		// comment parameter
		commentValue : "3",
	}
	var postdata = JSON.stringify(jsonStr);

	$('#overview-emotion').find('.note').text('最负面');
	$('.EmotionAnalysis').find('.list-content').html('');
	$('.horizontal-nav').find('li').each(function() {
		$(this).attr('class', 'item');
	});
	$('.horizontal-nav').find('li').eq(0).addClass('selected');

	// --典型意见--初始化
	$('.left-content').find('.classic-list').html('');
	$('.right-content').find('.list').html('');

	// process and return data

	$('input[name="viewcluster"][value="3"]').click();
	$('input[name="viewComment"][value="3"]').click();
	sentimentProcess(postdata);
	wordCloudProcess(postdata);
	$('input[name="viewWordFreq"][value="3"]').click();
//	wordFreqProcess(postdata);
	commentProcess

}

function clusterClick(obj) {
	// get data and parameter
	var clusterValue = $("input[name='viewcluster']:checked").val();

	var jsonStr = {
		content : $("#txt-analysis").val(),
		clusterValue : clusterValue,
	}
	var postdata = JSON.stringify(jsonStr);
	clusterProcess(postdata);
}

function sentimentClick(obj) {
	 //alert("sentimentClick");
	 
	 if(obj.getAttribute("value") == 0){
		 $('.horizontal-nav').find('li').eq(2).removeClass('selected');
		 $('.horizontal-nav').find('li').eq(0).addClass('selected');
		
		 $('#overview-emotion').find('.note').text('最正面');
		 
		// 设置显示
		 $('.EmotionAnalysis').find('.list-item.negative').each(function(){
			 if (!$(this).hasClass('hide')){
					$(this).addClass('hide');
				} 
		  });
		 $('.EmotionAnalysis').find('.list-item.positive').each(function(){
			 if ($(this).hasClass('hide')){
					$(this).removeClass('hide');
				} 
		  });
		 
	 }else {
		 $('.horizontal-nav').find('li').eq(0).removeClass('selected');
		 $('.horizontal-nav').find('li').eq(2).addClass('selected');
		 
		 $('#overview-emotion').find('.note').text('最负面');
		 
		 // 设置显示
		 $('.EmotionAnalysis').find('.list-item.positive').each(function(){
			 if (!$(this).hasClass('hide')){
					$(this).addClass('hide');
				} 
		  });
		 $('.EmotionAnalysis').find('.list-item.negative').each(function(){
			 if ($(this).hasClass('hide')){
					$(this).removeClass('hide');
				} 
		  });
		 
	 }
}

function wordFreqClick(obj) {
	$("#wordFreqClassify").html("<dt>实体类别图示:</dt>");
	$("#wordFreqAnalysis").html("");
	var nerSensitivity = $("input[name='viewWordFreq']:checked").val();
	var jsonStr = {
		content : $("#txt-analysis").val(),
		nerSensitivity : nerSensitivity,
	}
	var postdata = JSON.stringify(jsonStr);
	wordFreqProcess(postdata);
}

function commentClick(obj) {
	// comment page init
	$('.left-content').find('.classic-list').html('');
	$('.right-content').find('.list').html('');
	// get data and parameter
	var commentValue = $("input[name='viewComment']:checked").val();

	var jsonStr = {
		content : $("#txt-analysis").val(),
		commentValue : commentValue,
	}

	var postdata = JSON.stringify(jsonStr);
	commentProcess(postdata);
}

function commentTypicalClick(obj) {
	$('.left-content').find('.classic-list').find('dd').each(
			function(index) {
				$(this).click(
						function() {
							$('.left-content').find('.classic-list').find('dd')
									.each(function() {
										$(this).removeClass('active');
									});
							$(this).addClass('active');
							$('.right-content').find('.list')
									.find('.list-item').addClass('hide');
							$('.right-content').find('.list')
									.find('.list-item').eq($(this).index())
									.removeClass('hide');
						});
			});
}

function clusterProcess(postdata) {
	// page init
	$('.list-wrap').children('.list').html('');
	$("#overview-cluster").find('.loading').removeClass('hide');
		$.ajax({
				type : "POST",
				url : "inlppre/multiple/cluster",
				data : {
					data : postdata
				},
				dataType : "json",
				success : function(data) {
					console.log(data);
					$("#overview-cluster").find('.warn-tips').addClass('hide');
					$("#overview-cluster").find('.loading').addClass('hide');

					var size = JSON.stringify(data.size);
					if(size == 0){
						$("#overview-cluster").find('.loading').addClass('hide');
						$("#overview-cluster").find('.warn-tips').removeClass('hide');
					}

					multipClusterList = data.multipClusterList;

					$('.list-wrap').children('.list').html('');
					$('#overview-cluster').find('.count').text(size);

					for (var i = 0; i < size; i++) {
						var multipCluster = multipClusterList[i];
						var num = multipCluster.num;

						var clustList = multipCluster.clustList;
						// alert(clustList.length);

						var contHTML = '';
						contHTML += '<div class="list-item"><span class="value">'
								+ num
								+ '</span><span class="arrow"></span><dl>';
						contHTML += '<dt class="cursor">' + clustList[0]
								+ '</dt>';
						for (var j = 0; j < clustList.length; j++) {
							contHTML += '<dd class="hide">' + clustList[j]
									+ '</dd>';
						}
						contHTML += '</dl><div id="cluster-footer-51" class="list-footer hide"></div></div>';

						$('.list-wrap').children('.list').append(contHTML);

					}
					topic_clustering();

				},
				error : function(e) {
					$("#overview-cluster").find('.loading').addClass('hide');
					$("#overview-cluster").find('.warn-tips').removeClass('hide');
				},
			});
}

function sentimentProcess(postdata){
	$("#overview-emotion").find('.warn-tips').addClass('hide');
	$("#overview-emotion").find('.loading').removeClass('hide');
	$.ajax({
			type : "POST",
			url : "inlppre/multi/sentiment",
			data : {
				data : postdata
			},
			dataType : "json",
			success : function(data) {
			$("#overview-emotion").find('.loading').addClass('hide');

			var positiveList = data.positiveList;
			var negativeList = data.negativeList;
					
			$('#overview-emotion').find('.count').text(positiveList.length);
					
			for(var i = 0; i < positiveList.length;i++){
				var emotion = positiveList[i];
				var content = emotion.content;
				
				var value = parseInt(emotion.value * 100);
				var divHTML = '';
				divHTML += '<div class="list-item positive" ><div class="highchartSolidGauge" data-highcharts-chart="11" style="float:left;width:56px;height:56px;margin-left:5px"></div>';
				divHTML += '<span class="arrow"></span><dl><dt>'+ content + '</dt></dl></div>';
				$('.EmotionAnalysis').find('.list-content').append(divHTML);
				createSolidgauge('.highchartSolidGauge:last', value);
			}
					
			for(var i = 0; i < negativeList.length;i++){
				var emotion = negativeList[i];
				var content = emotion.content;
				var value = parseInt(emotion.value * 100);
				var divHTML = '';
				divHTML += '<div class="list-item hide negative" ><div class="highchartSolidGauge"  style="float:left;width:56px;height:56px;margin-left:5px"></div>';
				divHTML += '<span class="arrow"></span><dl><dt>'+ content + '</dt></dl></div>';
				$('.EmotionAnalysis').find('.list-content').append(divHTML);
				createSolidgauge('.highchartSolidGauge:last', value);
			}
			
			},
		error : function(e) {
			$("#overview-emotion").find('.loading').addClass('hide');
			$("#overview-emotion").find('.warn-tips').removeClass('hide');

		}
	});
}

function createSolidgauge(className, value) {
	var chart = {
		type : 'solidgauge',
		margin : [ 0, 0, 0, 0 ],
	};
	var title = null;

	var pane = {
		center : [ '50%', '50%' ],
		size : '100%',
		borderWidth : 0,
		startAngle : 0,
		endAngle : 360,
		background : {
			backgroundColor : '#ddd',
			innerRadius : '95%',
			outerRadius : '95%',
		},
	};
	var tooltip = {
		enabled : false
	};
	// the value axis
	var yAxis = {
		lineWidth : 0,
		minorTickInterval : null,
		tickWidth : 0,
		min : 0,
		max : 100,
		tickPixelInterval : 0,
		stops : [ [ 1.0, '#e5613b' ] // red
		],
	};

	var credits = {
		enabled : false
	};

	var series = [ {
		name : 'Speed',
		data : [ value ],
		innerRadius : 90,
		dataLabels : {
			y : 25,
			verticalAlign : 'bottom',
			enabled : true,
			format : '<div style="text-align:center;"><span style="font-size:16px;font-weight:normal;color:#777">{y}</span>'
					+ '<span style="font-size:16px;font-weight:normal;color:#777">%</span></div>'
		},
	} ];

	var json = {};
	json.chart = chart;
	json.title = title;
	json.pane = pane;
	json.tooltip = tooltip;
	json.yAxis = yAxis;
	json.credits = credits;
	json.series = series;
	$(className).highcharts(json);

	$('rect').attr('stroke-width', '0');
}
function wordFreqProcess(postdata) {
	$("#overview-wc").find('.warn-tips').addClass('hide');
	$("#overview-wc").find('.loading').removeClass('hide');
	$.ajax({
			type : "POST",
			url : "inlppre/multi/wordFreq",
			data : {
				data : postdata
			},
			dataType : "json",
			success : function(data) {
				$("#overview-wc").find('.loading').addClass('hide');
				// analysis
				var listCollection = data.listCollection;
				for (var i = 0; i < listCollection.length; i++) {
					var list = listCollection[i];
					$("#wordFreqAnalysis").append(
							'<dl class="words col-xs-12"></dl>');
					
					var listLength = list.length;
					if(listLength > 50){
						listLength = 50;
					}
					for (var j = 0; j < listLength; j++) {
						var word = list[j].word;
						var num = list[j].num;
						var entity = list[j].entity;
						$(".words.col-xs-12:last").append(
								"<dd class=" + entity + ">" + word
										+ "<span>" + num + "</span></dd>");
					}
				}
				// noEntity
				var noEntityList = data.noEntityList;
				$("#wordFreqAnalysis")
						.append('<div class="col-xs-12 title" style="padding:0;margin-top:20px;margin-bottom:15px">非实体</div>');
				$("#wordFreqAnalysis").append(
						'<dl class="words col-xs-12"></dl>');

				var noEntityListSize = noEntityList.length;
				if (noEntityListSize > 50) {
					noEntityListSize = 50;
				}

				for (var i = 0; i < noEntityListSize; i++) {
					var word = noEntityList[i].word;
					var num = noEntityList[i].num;
					var entity = noEntityList[i].entity;
					$(".words.col-xs-12:last").append(
							"<dd class=" + entity + ">" + word + "<span>"
									+ num + "</span></dd>");
				}
				// classify
				var classifyList = data.classifyList;
				for (var i = 0; i < classifyList.length; i++) {
					var classification = JSON
							.stringify(classifyList[i].classification);
					classification = classification.substring(1,
							classification.length - 1);
					var myclass = JSON.stringify(classifyList[i].entity);
					$("#wordFreqClassify").append(
							"<dd class=" + myclass + ">" + classification
									+ "</dd>");
				}
			},
			error : function(e) {
				$("#wordFreqClassify").html("<dt>实体类别图示:</dt>");
				$("#wordFreqAnalysis").html("");
				
				$("#overview-wc").find('.loading').addClass('hide');
				$("#overview-wc").find('.warn-tips').removeClass('hide');
			}
		});
}

function wordCloudProcess(postdata) {
	$("#overview-cloud").find('.warn-tips').addClass('hide');
	$("#overview-cloud").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
		url : "inlppre/multi/wordCloud",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			$("#overview-cloud").find('.loading').addClass('hide');
//			wordCloudEchart(data.wordCloudList);
			wordCloudEchart02(data.wordCloudList);
//			return data.wordCloudList;
		},
		error : function(e) {
			$("#overview-cloud").find('.loading').addClass('hide');
			$("#overview-cloud").find('.warn-tips').removeClass('hide');
		}
	});
}
/*boson多文本词云分析效果展示---实现二*/
function wordCloudEchart02(data){
	var hotCWChart = echarts.init(document.getElementById('wordCloud'));
	var hotCWOption = {
		backgroundColor : '#f6f6f6',
	    tooltip: {},
	    series: [{
	    	width:'80%',
	    	height:'80%',
	    	name:'频率',
	        type: 'wordCloud',
	        gridSize: 5,
	        size: ['90%', '90%'],
	        textRotation : [ 0, 45, 90, -45 ],
	        textPadding : 50,
	        autoSize : {
				enable : true,
				minSize : 18
			},
	        textStyle: {
	            normal: {
	                color: function() {
	                    return 'rgb(' + [
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160),
	                        Math.round(Math.random() * 160)
	                    ].join(',') + ')';
	                }
	            },
	        },
	        data: data
	    }]
	};
	hotCWChart.setOption(hotCWOption);
};
/*boson多文本词云分析效果展示---实现一*/
function wordCloudEchart(data) {
//	require.config({
//		paths : {
////			echarts :  path + '/media/js/dist'
////			echarts :  '../../../static/common/plugins/dist'
//			echarts :  '../../../static/common/plugins/dist'
//		}
//	});
	require.config({
	    paths: {
	        echarts: 'http://echarts.baidu.com/build/dist'
	    }
	});
	require([ 'echarts', 'echarts/chart/wordCloud',
	],
	function(ec) {
		var cloudChart = ec.init(document.getElementById('wordCloud'));
		cloudOption = {
			backgroundColor : '#f6f6f6',
			title : {
				text : ''
			},
			series : [ {
				name : '频率',
				type : 'wordCloud',
				size : [ '90%', '90%' ],
				textRotation : [ 0, 45, 90, -45 ],
				textPadding : 20,
				autoSize : {
					enable : true,
					minSize : 18
				},
				data : data
			} 
		]
	};
		cloudChart.setOption(cloudOption);

		/* var cloudOptions = cloudChart.getOption(); */
		/* cloudChart.showLoading({}); */// 数据加载完之前先显示一段简单的loading动画
		// 异步加载数据
		/*
		 * cloudOptions.series[0].data = data;
		 * cloudChart.setOption(cloudOptions);
		 */
		}
	);
}
// echarts word cloud

function commentProcess(postdata) {
	$("#overview-comments").find('.loading').removeClass('hide');
	$
			.ajax({
				type : "POST",
				url : "inlppre/multi/typicalComment",
				data : {
					data : postdata
				},
				dataType : "json",
				success : function(data) {
					$("#overview-comments").find('.warn-tips').addClass('hide');
					$("#overview-comments").find('.loading').addClass('hide');
					
					var typicalCommentList = data.typicalCommentList;
					var typicalHTML = '';
					typicalHTML += '<dl>'

					var typicalCommentListSize = typicalCommentList.length;
					
					if(typicalCommentListSize == 0){
						$("#overview-comments").find('.loading').addClass('hide');
						$("#overview-comments").find('.warn-tips').removeClass('hide');

					}
						
					if (typicalCommentListSize > 20) {
						typicalCommentListSize = 20;
					}

					for (var i = 0; i < typicalCommentListSize; i++) {

						var num = typicalCommentList[i].num;
						var typicalComment = typicalCommentList[i].typicalComment;
						var id = typicalCommentList[i].id;

						typicalHTML += '<dd id="auto_comments-comments-2-' + i
								+ '"  class="l-0" data-index="' + id + '">'
								+ typicalComment + '（' + num + '）</dd>';
					}
					typicalHTML += '</dl>';
					$('.left-content').find('.classic-list')
							.append(typicalHTML);
					$('.left-content').find('.classic-list').find('dd').eq(0)
							.addClass('active');

					for (var y = 0; y < typicalCommentList.length; y++) {
						var commentListCollection = data.commentListCollection;
						var commentList = commentListCollection[y];

						var typicalContentHTML = '';
						typicalContentHTML += '<div><div id="for-auto_comments-comments-2-'+ y + '" class="list-item hide"><div class="list-content"><span class="arrow"></span><dl>';
						var commentListSize = commentList.length;
						if (commentListSize > 10) {
							commentListSize = 10;
						}

						for (var i = 0; i < commentListSize; i++) {
							var comment = commentList[i].comment;
							var content = commentList[i].content;

							typicalContentHTML += '<dd class="">'
									+ content.replace(comment,
											'<span class="highlight">'
													+ comment + '</span>')
									+ '</dd>';
						}
						typicalContentHTML += '</dl></div><div class="list-footer"><div class="more-msg">共有'+ commentList.length + '条</div></div></div></div>';
						$('.right-content').find('.list').append(
								typicalContentHTML);
						$('.right-content').find('.list-content').find(
								'dd:even').addClass('multi');
					}
					$('.right-content').find('.list').find('.list-item').eq(0)
							.removeClass('hide');
					commentTypicalClick();
				},
				error : function(e) {
					$("#overview-comments").find('.wrap').html("");
					$("#overview-comments").find('.loading').addClass('hide');
					$("#overview-comments").find('.warn-tips').removeClass('hide');

				}
			});
}

function topic_clustering() {
	$('.list-item').each(function(index) {
		$(this).find('dt.cursor').click(function() {
			if ($(this).next().attr('class') == 'hide') {
				$(this).nextAll().removeClass('hide');
			} else {
				$(this).nextAll().addClass('hide');
			}
		});
	});
}