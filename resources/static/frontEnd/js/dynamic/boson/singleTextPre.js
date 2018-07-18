function textAreaControl() {
	
	var content = $("#txt-analysis").val();
	//alert(content.trim());
	content = content.trim();
	// conten is null
	if (content.length==0) {

		$('#btn-analysis').addClass('disabled');
		//$('#btn-analysis').attr('disabled', "true");
		//$('#btn-analysis').css('pointer-events','visible')

	} else {
		$('#btn-analysis').removeAttr("disabled");
		$('#btn-analysis').removeClass("disabled");
	}

}

function submitText() {
	
	// clear page
	$("#wordAnalysis").html("");
	$("#wordClassify").html("<dt>词性类别图示:</dt>");

	$("#entityAnalysis").html("");
	$("#entityClassify").html("<dt>实体类别图示:</dt>");

	// hide keywords table
	for (var i = 0; i < 3; i++) {
		$(".col-small-" + i).hide();
		$("#tbody" + i).html("");
	}

	var content = $("#txt-analysis").val();

	// conten is null
	
	var jsonStr = {};
	// get data
	jsonStr = {
		content : content,

		// tag parameter
		tagSpace_mode : "0",
		tagOoov_level : "3",
		tagT2s : "0",
		tagSpecial_char_conv : "0",

		// keywords parameter
		keywordsTop_k : "100",
		keywordsSegmented : "",

		// ner parameter
		nerSensitivity : 3,

		// sentiment parameter
		sentimentType : "content",

		// summary parameter
		percentage : 0.5,
		not_exceed : 0,
		title : "",

	}
	var postdata = JSON.stringify(jsonStr);
	// process and return data

	tagProcess(postdata);
	// $('input[name="viewner"][value="3"]').click();
	sentimentProcess(postdata);
	keywordsProcess(postdata);
//	$('input[name="viewsummary"][value="0.5"]').click();
	summaryProcess(postdata);
    nerProcess(postdata);

}

function keywordsClick(obj) {
	// alert("keywordsClick");

	// hide keywords table
	for (var i = 0; i < 3; i++) {
		$(".col-small-" + i).hide();
		$("#tbody" + i).html("");
	}
	// get data
	var jsonStr = {
		content : $("#txt-analysis").val(),
		keywordsTop_k : "100",
		keywordsSegmented : ""
	}

	var postdata = JSON.stringify(jsonStr);
	keywordsProcess(postdata);

}

function nerClick(obj) {
	// alert("nerClick");

	$("#entityAnalysis").html("");
	$("#entityClassify").html("<dt>实体类别图示:</dt>");
	// get data
	var nerSensitivity = $("input[name='viewner']:checked").val();
	// alert(nerSensitivity);
	var jsonStr = {
		content : $("#txt-analysis").val(),
		nerSensitivity : nerSensitivity,
	}

	var postdata = JSON.stringify(jsonStr);
	nerProcess(postdata);
}

function sentimentClick(obj) {
	var sentimentType = $("input[name='viewemotion']:checked").val();
	var jsonStr = {
		content : $("#txt-analysis").val(),
		sentimentType : sentimentType,
	}
	var postdata = JSON.stringify(jsonStr);
	sentimentProcess(postdata);
}

function summaryClick(obj) {
	// alert("summaryClick");

	// get data
	var summaryType = $("input[name='viewsummary']:checked").val();
	var jsonStr = {
		content : $("#txt-analysis").val(),
		percentage : summaryType,

	}

	var postdata = JSON.stringify(jsonStr);
	summaryProcess(postdata);
}

function tagProcess(postdata) {
	$("#overview-analysis").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
		url : "inlppre/single/tag",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			// alert("tag,success");
			$("#overview-analysis").find('.loading').addClass('hide');
			if (null != data){
                if (null != data.wordClassify){
                    var wordClassify = JSON.stringify(data.wordClassify);
                    var wordAnalysis = JSON.stringify(data.wordAnalysis);
                    wordAnalysis = JSON.parse(wordAnalysis);
                    wordClassify = JSON.parse(wordClassify);

                    // alert(typeof(wordAnalysis));//object
                    // alert(JSON.stringify(wordAnalysis[0]));//map
                    // alert(JSON.stringify(wordAnalysis[0].tag));//tag
                    for (var i = 0; i < wordAnalysis.length; i++) {
                        var word = JSON.stringify(wordAnalysis[i].word);
                        word = word.substring(1, word.length - 1);
                        var myclass = JSON.stringify(wordAnalysis[i].tag);
                        var classification = JSON
                            .stringify(wordAnalysis[i].classification);
                        $("#wordAnalysis").append(
                            "<dd title=" + classification + "class=" + myclass
                            + ">" + word + "</dd>");
                    }
                    // dupliRemove
                    for (var i = 0; i < wordClassify.length; i++) {
                        var myclass = JSON.stringify(wordClassify[i].tag);
                        var classification = JSON
                            .stringify(wordClassify[i].classification);
                        classification = classification.substring(1,
                            classification.length - 1);
                        $("#wordClassify")
                            .append(
                                "<dd class=" + myclass + ">" + classification
                                + "</dd>");
                    }
                }
			}
		},
		error : function(e) {
			$("#wordAnalysis").html("");
			$("#wordClassify").html("<dt>词性类别图示:</dt>");
			$("#overview-analysis").find('.warn-tips').removeClass('hide');

		}
	});
}

function keywordsProcess(postdata) {
	$("#overview-key").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
		url : "inlppre/single/keywords",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			$("#overview-key").find('.loading').addClass('hide');
            if (null != data){
                if (null != data.list &&  data.list.length > 0){
                    var keywords = data.list;
                    var length = keywords.length;
                    console.log('keywords' + keywords);
                    console.log('length' + length);
                    if (keywords.length > 0){
                        if (length > 15) {
                            length = 15;
                        }
                        for (var i = 0; i < length; i++) {
                            // var word = JSON.stringify(keywords[i].word);
                            var word = keywords[i].word;
                            // word = word.substring(1, word.length - 1);
                            // var weight = JSON.stringify(keywords[i].weight);
                            var weight = keywords[i].weight;
                            // weight = weight.substring(2, 4);
							/*if(JSON.stringify(keywords[i].weight).substring(4, 5) < 5){
							 weight = parseFloat(weight);
							 }else{
							 weight = parseFloat(weight) + 1;
							 }*/
                            var j = Math.floor(i / 5);
                            $(".col-small-" + j).show();
                            $("#tbody" + j)
                                .append(
                                    "<tr><td>" + word + "</td><td>" + weight
                                    + "</td></tr>");
                        }
                    }
                }
			}
		},
		error : function(e) {
			$("#overview-key").find('.result').html('');
			$("#overview-key").find('.warn-tips').removeClass('hide');
		}
	});

}

function nerProcess(postdata) {
	$("#overview-ner").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
//		url : "inlppre/demo1/ner",
		url : "inlppre/single/ner",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			// alert("ner,success");
			$("#overview-ner").find('.loading').addClass('hide');
			if (null != data){
                if (null != data.entityAnalysis && null != data.entityClassify){
                    var entityAnalysis = data.entityAnalysis;
                    var entityClassify = data.entityClassify;
                    // alert(typeof(wordAnalysis));//object
                    // alert(JSON.stringify(wordAnalysis[0]));//map
                    // alert(JSON.stringify(wordAnalysis[0].tag));//tag

                    for (var i = 0; i < entityAnalysis.length; i++) {
                        var classification = JSON
                            .stringify(entityAnalysis[i].classification);
                        var myclass = JSON.stringify(entityAnalysis[i].entity);
                        var word = JSON.stringify(entityAnalysis[i].word);
                        word = word.substring(1, word.length - 1);
                        $("#entityAnalysis").append(
                            "<dd title=" + classification + "class=" + myclass
                            + ">" + word + "</dd>");
                    }

                    for (var i = 0; i < entityClassify.length; i++) {
                        var classification = JSON
                            .stringify(entityClassify[i].classification);
                        classification = classification.substring(1,
                            classification.length - 1);
                        var myclass = JSON.stringify(entityClassify[i].entity);
                        $("#entityClassify")
                            .append(
                                "<dd class=" + myclass + ">" + classification
                                + "</dd>");

                    }
                }
			}
		},
		error : function(e) {
			$("#entityAnalysis").html("");
			$("#entityClassify").html("<dt>实体类别图示:</dt>");
			$("#overview-ner").find('.warn-tips').removeClass('hide');

		}
	});
}

function sentimentProcess(postdata) {
	$("#overview-emotion").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
		url : "inlppre/single/sentiment",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			$("#overview-emotion").find('.loading').addClass('hide');
			console.log('sentiment' + data);
			if (null != data){
                if (null != data.positive){
                    if (null != data.positive && data.positive!=''){
                        sentiPiechart(data);
                    }
                }
			}
		},
		error : function(e) {
			$("#overview-emotion").find('.row').css('display','none');
			$("#overview-emotion").find('.warn-tips').removeClass('hide');
		}
	});
}

function sentiPiechart(data) {
	var pieChart = echarts.init(document.getElementById('emotion-chart'));

	var pieoption = {
		color : [ '#4daf7c', '#e5613b' ],
		tooltip : {
			trigger : 'item',
			formatter : "{c}"
		},

		series : [ {
			name : '情感分析',
			type : 'pie',
			radius : [ '40%', '60%' ],
			label : {
				normal : {
					show : true,
					position : 'outside',
					formatter : '{b} : {c}',
					textStyle : {
						fontSize : 14
					}
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					},

				}
			},
			labelLine : {
				normal : {
					show : true
				}
			},
			itemStyle : {
				normal : {
					areaStyle : {
						color : '#F44336'
					},
				},

			},
			data : [ {
				value : (data.positive).toFixed(4),
				name : '正面指数',
			}, {
				value : (data.negative).toFixed(4),
				name : '负面指数',
			}, ]
		} ]
	};
	pieChart.setOption(pieoption);

}

function summaryProcess(postdata) {
	$("#overview-summary").find('.loading').removeClass('hide');
	$.ajax({
		type : "POST",
		url : "inlppre/single/summary",
		data : {
			data : postdata
		},
		dataType : "json",
		success : function(data) {
			console.log(data);
			if (null != data){
                if (null != data.summary && data.summary != ''){
                    $("#overview-summary").find('.loading').addClass('hide');
                    var summary = JSON.stringify(data.summary);
                    summary = summary.substring(1, summary.length - 1);

                    $("#summaryResult").html(summary);
                }
			}
		},
		error : function(e) {
			$("#summaryResult").html("");
			$("#overview-summary").find('.warn-tips').removeClass('hide');

		}
	});
}