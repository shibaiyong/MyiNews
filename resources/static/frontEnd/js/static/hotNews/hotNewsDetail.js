$(function(){
	/*加载头部与尾部*/
	$('#header').loadPage('../common/header.html');
	$('#footer').loadPage('../common/footer.html');

	/*评论地区分布*/
	cAEchartsMap();
	/*热门评论词*/
	commentWordCloud();
	/*5日评论量*/
	commentCountCharts();
	/*情感分析*/
	emotionAnalyze();
	/*典型意见*/
	reportCount();

	summarydotdotdot();

	/*newsDetailSummary();*/
	uec_inews_picture_group_news();

	$('.commentHotConTable1').DataTable({
   		iDisplayLength : 20,
   		'sPaginationType': "bootstrap",
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	});
	$('.commentHotConTable2').DataTable({
   		iDisplayLength : 20,
   		'sPaginationType': "bootstrap",
	  	"aoColumns": [ 
	  		{ "bSortable": false },
	    ],
	     	"aaSorting": [[0, ""]],
	});
});
/*评论地区分布*/
function randomData() {
    return Math.round(Math.random()*500);
}
function cAEchartsMap(){
	$('#cAEchartsMap').css({
		'width':$('#commentCountCharts').width(),
	});
	var cAChart = echarts.init(document.getElementById('cAEchartsMap'));
	var cAChartOption = {
		tooltip : {
			trigger : 'item',
		/* axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
		} */
		},
		visualMap : {
			min : 0,
			max : 500,
			x : 'left',
			y : 'bottom',
			text : [ '高', '低' ], // 文本，默认为数值文本
			calculable : true,
			color : [ 'red', '#f5d47a' ],
			itemWidth:'10',
			itemHeight:'100',
		},
		toolbox : {
			show : true,
			orient : 'horizontal',
			x : 'right',
			y : 'top',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : true,
					buttonColor : '#F44336',
					optionToContent : function(opt) {
						var series = opt.series[0].data;
						for ( var i = 0; i < series.length; i++) {
							for ( var j = i; j < series.length; j++) {
								if (parseInt(series[i].value) < parseInt(series[j].value)) {
									var serVal = series[i];
									series[i] = series[j];
									series[j] = serVal;
								}
							}
						}
						var table = '<div style="width:100%;height:100%"><table class="table" style="width:100%;"><tbody>'
						/* + '<td>' + series[0].data[0].name + '</td>'
						+ '</tr>'; */
						for ( var i = 0, l = 8; i < l; i++) {
							table += '<tr>' + '<td>' + series[i].name + '：'
									+ series[i].value + '</td>' + '<td>'
									+ series[i + 9].name + '：'
									+ series[i + 9].value + '</td>'
									+ '<td>' + series[i + 18].name + '：'
									+ series[i + 18].value + '</td>'
									+ '<td>' + series[i + 26].name + '：'
									+ series[i + 26].value + '</td>'
									+ '</tr>';
						}
						table += '<tr>' + '<td>' + series[8].name + '：'
								+ series[8].value + '</td>' + '<td>'
								+ series[17].name + '：' + series[17].value
								+ '</td>' + '<td></td><td></td>'
								+ '</tr></tbody></table></div>';
						return table;
					}
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [
		{
			name : '评论',
			type : 'map',
			mapType : 'china',
			top : '12%',
			bottom : '11%',
			left : '3%',
			right : '3%',
			roam : false,
			itemStyle : {
				normal : {
					label : {
						show : false
					},
					areaStyle : {
						color : '#11EEEE'
					},
					color : 'rgba(255,0,255,0.8)'
				},
				emphasis : {
					label : {
						show : true
					}
				}
			},
			data:[
                {name: '北京',value: randomData() },
                {name: '天津',value: randomData() },
                {name: '上海',value: randomData() },
                {name: '重庆',value: randomData() },
                {name: '河北',value: randomData() },
                {name: '河南',value: randomData() },
                {name: '云南',value: randomData() },
                {name: '辽宁',value: randomData() },
                {name: '黑龙江',value: randomData() },
                {name: '湖南',value: randomData() },
                {name: '安徽',value: randomData() },
                {name: '山东',value: randomData() },
                {name: '新疆',value: randomData() },
                {name: '江苏',value: randomData() },
                {name: '浙江',value: randomData() },
                {name: '江西',value: randomData() },
                {name: '湖北',value: randomData() },
                {name: '广西',value: randomData() },
                {name: '甘肃',value: randomData() },
                {name: '山西',value: randomData() },
                {name: '内蒙古',value: randomData() },
                {name: '陕西',value: randomData() },
                {name: '吉林',value: randomData() },
                {name: '福建',value: randomData() },
                {name: '贵州',value: randomData() },
                {name: '广东',value: randomData() },
                {name: '青海',value: randomData() },
                {name: '西藏',value: randomData() },
                {name: '四川',value: randomData() },
                {name: '宁夏',value: randomData() },
                {name: '海南',value: randomData() },
                {name: '台湾',value: randomData() },
                {name: '香港',value: randomData() },
                {name: '澳门',value: randomData() }
            ],
		} ]
	};
	cAChart.setOption(cAChartOption);
}

/*5日评论量*/
function commentCountCharts(){
	var cAChart = echarts.init(document.getElementById('commentCountCharts'));
	var cAEchartsOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		toolbox : {
			orient : 'horizontal',
			x : 'right',
			y : 'top',
			right:'35%',
			feature : {
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '5%',
			top : '11%',
			containLabel : true
		},
		xAxis : [ {
			type : 'category',
			/*name : '日期',*/
			data : ['01日', '02日', '03日', '04日', '05日'],
		} ],
		yAxis : [ {
			type : 'value',
			min : 0,
			max : 2500,
			interval : 500,
			axisLabel : {
				formatter : '{value}'
			},
		} ],
		series : [ {
			name : '评论数(个)',
			type : 'bar',
			data : [10, 52, 200, 334, 390],
			barWidth : '30%',
			markPoint : {
				data : [ {
					type : 'max',
					name : '最大值'
				}, ]
			},
		} ]
	};
	cAChart.setOption(cAEchartsOption);
}

/*热门评论词*/
function commentWordCloud(){
	var hotCWChart = echarts.init(document.getElementById('hotCWEcharts'));
	var hotCWOption = {
		backgroundColor : '#f9f9f9',
	    tooltip: {},
	    series: [{
	        type: 'wordCloud',
	        gridSize: 20,
	        sizeRange: [12, 50],
	        textRotation : [ 0, 30, 90, -30 ],
	        textPadding : 10,
	        shape: 'square',
	        left: 'center',
	        top: 'center',
	        width: '95%',
	        height: '95%',
	        right: null,
        	bottom: null,
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
	        data: [{
	            name: '智商',
	            value: 10000,
	            textStyle: {
	                normal: {
	                    color: 'black'
	                },
	                emphasis: {
	                    color: 'red'
	                }
	            }
	        }, {
	            name: '上台',
	            value: 6181
	        }, {
	            name: '政治',
	            value: 4386
	        }, {
	            name: '世界',
	            value: 4055
	        }, {
	            name: '关系',
	            value: 2467
	        }, {
	            name: '百姓',
	            value: 2244
	        }, {
	            name: '美元',
	            value: 1898
	        }, {
	            name: '台湾',
	            value: 1484
	        }, {
	            name: '独立',
	            value: 1112
	        }, {
	            name: '特朗普',
	            value: 965
	        }, {
	            name: '民主',
	            value: 847
	        }, {
	            name: '联邦',
	            value: 582
	        }, {
	            name: '傻逼',
	            value: 555
	        }, {
	            name: '总统',
	            value: 550
	        }, {
	            name: '美国',
	            value: 462
	        }, {
	            name: '中国',
	            value: 366
	        }, {
	            name: '代表',
	            value: 360
	        }, {
	            name: '支持',
	            value: 282
	        }, {
	            name: '选举',
	            value: 273
	        }, {
	            name: '商人',
	            value: 265
	        }, {
	            name: '国债',
	            value: 282
	        }, {
	            name: '权利',
	            value: 273
	        }, {
	            name: '希拉里',
	            value: 265
	        }]
	    }]
	};
	hotCWChart.setOption(hotCWOption);
};

/*情感分析*/
function emotionAnalyze(){
	$('#emotionAnalyzeEchart').css({
		'width':$('#commentCountCharts').width(),
	});
	var eAChart = echarts.init(document.getElementById('emotionAnalyzeEchart'));
	var eAOption = {
		color : [ '#c23531', '#2f4554', '#61a0a8', ],
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		legend : {
			orient : 'horizontal',
			x : 'right',
			top : '2%',
			data : [ '正面指数', '中性指数', '负面指数' ],
		},
		series : [ {
			name : '情感分析',
			type : 'pie',
			center:['50%','50%'],
			radius : [ '30%', '45%' ],
			label : {
				normal : {
					show : true,
					formatter : "{d}%",
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
				value : 100,
				name : '正面指数'
			}, {
				value : 100,
				name : '中性指数'
			}, {
				value : 100,
				name : '负面指数'
			}, ]
		} ]
	};
	eAChart.setOption(eAOption);
}

/*典型意见*/
function reportCount(){
	var rCChart = echarts.init(document.getElementById('reportCountCharts'));
	var rCOption = {
		color : [ '#d9534f' ],
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'none'
			},
			formatter : '{a}<br/>{b} : {c}',
		},
		grid : {
			left : '0%',
			right : '10%',
			bottom : '5%',
			top : '5%',
			containLabel : true
		},
		xAxis : {
			type : 'value',
			boundaryGap : [ 0, 0.01 ],
			position : 'top',
			name : '%'
		},
		yAxis : {
			type : 'category',
			axisLabel: {
	            interval: 0,
	            formatter: function(value, index){
	            	var valueStr = '';
	            	if(value.length>8){
	            		valueStr = value.substring(0,8)+'...';
	            	}else{
	            		valueStr = value;
	            	}
	            	return valueStr
	            },
	        },
			data : [    '那个时候的照片都漂亮','我心中的女神','那个年代不容易','美女特工','太漂亮了','超级老寿星','巾帼英雄','老人家一路走好','标准东方美人脸','年轻时漂亮',
					  ]
		},
		series : [ {
			name : '媒体提及率',
			type : 'bar',
			data : [   18,18, 22,24, 24,31,32, 33, 33,99, ],
			barWidth : '20px',
			barGap : '10px',
			label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
		}, ]
	};
	rCChart.setOption(rCOption);
}

function newsDetailSummary(){
	if($('.summaryCon').height()>110){
		$('.summaryCon').css({
			'height':'110px',
			'overflow':'hidden'
		});
	}
	
}

/*摘要内容超出一定长度时，隐藏*/
function summarydotdotdot(){
    if($('.summaryCon').height()>90){
        $('.summaryCon').css({
            'height':100,
        });
        var $summaryCon = $('.summaryCon');
            $summaryCon.append( ' <a class="toggle" href="#"><span class="open">[展开]</span><span class="close1">[收起]</span></a>' );
            function createDots()
            {
                $summaryCon.dotdotdot({
                    after: 'a.toggle',
                    wrap: 'letter'
                });
            }
            function destroyDots() {
                $summaryCon.trigger( 'destroy' );
            }
            createDots();
            $summaryCon.on(
                'click',
                'a.toggle',
                function() {
                    $summaryCon.toggleClass( 'opened' );

                    if ( $summaryCon.hasClass( 'opened' ) ) {
                        destroyDots();
                    } else {
                        createDots();
                    }
                    return false;
                }
            );
    }
    
}


/*新闻详情页-图组新闻更换*/
function uec_inews_picture_group_news(){

    var uec_inews_picture_group_content = '';
    
    if($('#uec_inews_picture_group_news').length>0){
        uec_inews_picture_group_content  += '<div id="turn" class="turn"><div class="turn-loading"><img src="../../../static/frontEnd/image/newsDetail/loading_comment.gif" alt=""/></div><ul class="turn-pic">';
        if(uec_inews_picture_group_json.pic == undefined){
        }else{
            for(var i = 0; i < uec_inews_picture_group_json.pic.length;i++){

                uec_inews_picture_group_content += '<li><a href="http://www.miaov.com"><img src="'+uec_inews_picture_group_json.pic[i].url + '"   title="'+uec_inews_picture_group_json.pic[i].desc+'" alt="'+uec_inews_picture_group_json.pic[i].desc+'" /></a></li>';
            }
        }
        
        if(uec_inews_picture_group_json.desc == undefined){
            uec_inews_picture_group_content += '</ul></div>';
        }else{
            uec_inews_picture_group_content += '</ul></div><div class="center">'+uec_inews_picture_group_json.desc+'</div>';
        }
        $('#uec_inews_picture_group_news').html(uec_inews_picture_group_content);
        iNews_picture_group_js();

    }else if($('#uec_inews_picture_group_weibo').length>0){
        
            var imageArr = new Array();
            if (uec_inews_picture_group_json.pic == undefined) {
            }else{
                for(var i =0;i<uec_inews_picture_group_json.pic.length;i++){
                    imageArr[i] = uec_inews_picture_group_json.pic[i].url;
                }
            };
            
        
        uec_inews_picture_group_content += '<div class="pic_mul"><div class="pic_content">'+uec_inews_picture_group_json.desc+'</div><ul class="clearfix pic_mul_ul">';
        if(uec_inews_picture_group_json.pic == undefined){
            console.log(uec_inews_picture_group_json.pic);
        }else{
            for(var i=0;i<uec_inews_picture_group_json.pic.length;i++){
                uec_inews_picture_group_content += '<li class="unlog_pic"><span class="photoBox"><div class="loadingBox"><span class="loading"></span></div><img src="'+imageArr[i]+' " class="zoom" onclick="zoom_image($(this).parent());"/></span></li>'
            }

            uec_inews_picture_group_content += '</ul></div><div class="photoArea" style="display:none;"><p><img src="about:blank" class="minifier" onclick="zoom_image($(this).parent().parent());"></p><p class="toolBar gc"><span><a class="green" href="javascript:void(0)" onclick="zoom_image($(this).parent().parent().parent());">收起</a></span>|<span class="view"><a class="green" href="images/1326l.jpg" target="_blank">查看原图</a></span></p></div>';
        }
        

        

        $('#uec_inews_picture_group_weibo').html(uec_inews_picture_group_content);

        var unlog_pic_icon = '';
        unlog_pic_icon += '<i class="unlog_pic_icon">长图</i>'
        var image = new Image();
        image.src=imageArr[0];
        image.onload=function(){
            for(var i=0;i<imageArr.length;i++){
                var image1 = new Image();
                image1.src = imageArr[i];
                if (image1.height/image1.width>3) {
                    $('.pic_mul_ul').find('li.unlog_pic').eq(i).prepend(unlog_pic_icon);
                };
            }
        };
        if (uec_inews_picture_group_json.pic == undefined) {

        }else{
            if(uec_inews_picture_group_json.pic.length == 4 || uec_inews_picture_group_json.pic.length == 7){
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
    
}

/*将图片放大*/
function zoom_image(obj) {
    if (obj.hasClass('photoBox')) {
        var load = obj.find('.loadingBox');
        load.show();
        var img = $('#uec_inews_picture_group_weibo').find('.photoArea').find('img');
        if (img.attr('src') == 'about:blank') {
            img.attr('src', obj.find('img').attr('src').replace('m.', 'l.'));
            img.load(function() {
                $('#uec_inews_picture_group_weibo').find('.pic_mul').hide();
                $('#uec_inews_picture_group_weibo').find('.photoArea').show();
            });
        } else {
            $('#uec_inews_picture_group_weibo').find('.pic_mul').hide();
            $('#uec_inews_picture_group_weibo').find('.photoArea').show();
        }
    } else {
        var img = $('#uec_inews_picture_group_weibo').find('.photoArea').find('img').attr('src','about:blank');
        $('#uec_inews_picture_group_weibo').find('.photoArea').hide();

        $('#uec_inews_picture_group_weibo').find('.pic_mul').show();
        $('#uec_inews_picture_group_weibo').find('.pic_mul').find('.loadingBox').hide();
    }
}

/*新闻详情页-轮播图JS*/
function iNews_picture_group_js(){

    (function(id,t){
        if(!document.getElementById(id)){return false;}
        var doc = document,
            auto='',
            oId = doc.getElementById(id),
            IE = /msie (\d+\.\d)/i.test(navigator.userAgent),
            num = 0,
            bot = true,
            setOpacity = function(obj, opacity){
                if(IE){
                    obj.style.filter = 'Alpha(Opacity=' + (opacity * 100) + ')';    
                }
                else{
                    obj.style.opacity = opacity;
                };
            },
            setBottom = function(obj, bottom){
                obj.style.bottom = bottom + 'px';
            },
            fideIn = function(obj, timeLimit){
                if(obj.style.display === 'none'){
                    obj.style.display = 'block';
                };
                setOpacity(obj, 0);
                obj.style.zIndex = 1;
                if(!timeLimit){
                    timeLimit = 200;
                };
                var opacity = 0,
                step = timeLimit / 20;
                clearTimeout(fideInTime);
                var fideInTime = setTimeout(function(){
                    bot = false;
                    if(opacity >= 1){
                        bot = true;
                        return;
                    };
                    opacity += 1 / step;
                    setOpacity(obj, opacity);
                    fideInTime = setTimeout(arguments.callee, 20);
                },20);
            },
            fideOut = function(obj, timeLimit){
                if(!timeLimit){
                    timeLimit = 200;
                };
                setOpacity(obj, 1);
                obj.style.zIndex = 0;
                var opacity = 1,
                step = timeLimit / 20;
                clearTimeout(fideOutTime);
                var fideOutTime = setTimeout(function(){
                    if (opacity <= 0) {
                        setOpacity(obj, 0);
                        return;
                    };
                    opacity -= 1 / step;
                    setOpacity(obj, opacity);
                    fideOutTime = setTimeout(arguments.callee, 20);
            
                },20);

            },
            heightIn = function(obj, timeLimit){
                if(obj.style.display === 'none'){
                    obj.style.display = 'block';
                };
                
                setBottom(obj, -obj.offsetHeight-10);
                
                if(!timeLimit){
                    timeLimit = 200;
                };
                var bottom = -obj.offsetHeight-10,
                step = timeLimit / 20;
                clearTimeout(heightInTime);
                var heightInTime = setTimeout(function(){
                    if(bottom >= 8){
                        setBottom(obj, 8);
                        return;
                    };
                    bottom += 28 / step;
                    setBottom(obj, bottom);
                    heightInTime = setTimeout(arguments.callee, 20);
                },20);
                var turnBg = getClass(oId,'div','turn-bg')[0];
                turnBg.style.height = obj.offsetHeight+16+'px';
            },
            heightOut = function(obj, timeLimit){
                if(!timeLimit){
                    timeLimit = 200;
                };
                setBottom(obj, 8);
                var bottom = 8,
                step = timeLimit / 20;
                clearTimeout(heightOutTime);
                var heightOutTime = setTimeout(function(){
                    if(bottom <= -obj.offsetHeight-10){
                        setBottom(obj, -obj.offsetHeight-10);
                        return;
                    };
                    bottom -= 60 / step;
                    setBottom(obj, bottom);
                    heightOutTime = setTimeout(arguments.callee, 20);
                },20);
            },
            getClass = function(oElem, strTagName, strClassName){   
                var arrElements = (strTagName == '*' && oElem.all) ? oElem.all : oElem.getElementsByTagName(strTagName);
                var returnArrElements = new Array();   
                var oRegExp =  new RegExp('(^|\\s)' + strClassName + '($|\\s)');   
                for(var i=0; i<arrElements.length; i++){   
                    if(oRegExp.test(arrElements[i].className)){   
                        returnArrElements.push(arrElements[i]);   
                    }   
                }   
                return (returnArrElements);
            },
            createElement = function(tag, id, cla){
                var elem = document.createElement(tag);
                if(id && id !== ""){
                    elem.id = id;
                }
                if(cla && cla !== ""){
                    elem.className = cla;
                }
                return elem;
            },
            showImg = function(n,b){
                var turnPic = getClass(oId,'ul','turn-pic')[0];
                var oLi = turnPic.getElementsByTagName('li');
                var turnTit = getClass(oId,'ul','turn-tit')[0];
                var oLi2 = turnTit.getElementsByTagName('li');
                var turnBtn = getClass(oId,'div','turn-count')[0];
                var oSpan = turnBtn.getElementsByTagName('span')[0];
                fideIn(oLi[n],300);
                heightIn(oLi2[n],300);
                oSpan.innerHTML = '<em>'+(n+1)+'</em>'+'/'+oLi.length;
                if(b==true){
                    if(n==oLi.length-1){
                        fideOut(oLi[0],300);
                        heightOut(oLi2[0],300);
                    }
                    if(n<oLi.length-1){
                        fideOut(oLi[n+1],300);
                        heightOut(oLi2[n+1],300);
                    }
                }
                else{
                    if(n>0){
                        fideOut(oLi[n-1],300);
                        heightOut(oLi2[n-1],300);
                    }
                    if(n==0){
                        fideOut(oLi[oLi.length-1],300);
                        heightOut(oLi2[oLi2.length-1],300);
                    }
                }
            },
            addHtml = function(){
                var oBg = createElement('div','','turn-bg');
                var oTit = createElement('ul','','turn-tit');
                var oBtn = createElement('div','','turn-btn');
                var oCount = createElement('div','','turn-count');
                var turnPic = getClass(oId,'ul','turn-pic')[0];
                var oA = turnPic.getElementsByTagName('a');
                var oImg = turnPic.getElementsByTagName('img');
                for(var i=0,len=oA.length;i<len;i++){
                    oTit.innerHTML += '<li><a href="'+ oA[i].href +'">'+ oImg[i].title +'</a></li>';
                }
                oBtn.innerHTML = '<div class="lb"></div><div class="rb"></div>';
                oCount.innerHTML = '<span></span>';
                oId.appendChild(oBg);
                oId.appendChild(oTit);
                oId.appendChild(oBtn);
                oId.appendChild(oCount);
            },
            init = function(){
                addHtml();
                showImg(0);
                var turnLoading = getClass(oId,'div','turn-loading')[0];
                oId.removeChild(turnLoading);
                oId.onmouseover = function(){
                    clearInterval(auto);
                };
                oId.onmouseout = function(){
                    auto = setInterval(autoTurn, t*1000);
                };
                var turnPic = getClass(oId,'ul','turn-pic')[0];
                var oLi = turnPic.getElementsByTagName('li');
                var oLb = getClass(oId,'div','lb')[0];
                var oRb = getClass(oId,'div','rb')[0];
                oLb.onclick = function(){
                    if(!bot){ return false; }
                    if(num==0){
                        num = oLi.length-1;
                    }
                    else{
                        num = num - 1;
                    }
                    showImg(num,1);
                }
                oRb.onclick = function(){
                    if(!bot){ return false; }
                    if(num==oLi.length-1){
                        num = 0;
                    }
                    else{
                        num = num + 1;
                    }
                    showImg(num);
                }
            },
            autoTurn=function(){
                var turnPic = getClass(oId,'ul','turn-pic')[0];
                var oLi = turnPic.getElementsByTagName('li');
                if(num==oLi.length-1){
                    num = 0;
                }
                else{
                    num = num + 1;
                }
                showImg(num);
            };
            init();
            auto = setInterval(autoTurn, t*1000);
    })('turn',3);
}