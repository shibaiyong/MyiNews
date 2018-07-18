var hotNewsList,
	batchCheckWebPageCode = [], //被选择的新闻的webpageCode
	tableItemWebPageCodeArr = []; //当前页面中显示的列表的webpageCode

$(function(){
	/* 头部导航高亮 */
    $().showHeader();
	footerPutBottom();
//	榜单周期数据获取
	rankingCycleData();
	var path=window.location.pathname;
	var i=path.split('/').length-1;
	var num=path.split('/')[i];
	var innerid=path.split('/')[i-1];
	console.log(innerid);
	//alert(num);
    if(num==111){
        $('.header-vimeo h2').html('热点排行新闻列表');
    }
    if(num==20){
        $('.header-vimeo h2').html('体育热点排行新闻列表');
    }
    if(num==21){
        $('.header-vimeo h2').html('娱乐热点排行新闻列表');
    }
    if(num==22){
        $('.header-vimeo h2').html('军事热点排行新闻列表');
    }
    if(num==23){
        $('.header-vimeo h2').html('财经热点排行新闻列表');
    }
    if(num==24){
        $('.header-vimeo h2').html('科技热点排行新闻列表');
    }
    //alert(window.location.pathname);
//媒体分类 2018-3-15
	$('.mediaClassify').removeClass('hide');
    // $().getData({
    //     getAjaxUrl:ctx + '/hot/front/getTotalHotSources'+'?label='+num,
    //     boxClassName:'.mediaClassify',
    //     ulClassName:'#mediaClassifyPro'
    // })
    $.ajax({
        url : ctx+ '/hot/front/getTotalHotSources'+'?label='+num,
        data:num,
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
            var content='';
            console.log(data);
            var obj=data.resultObj.value;
            if(data.result==true){
                for(var i=0;i<obj.length;i++) {
                    if (obj[i].innerid == innerid) {
                        content += '<h2 data-inter=\'false\' data-innerId=\'\'>' + obj[i].displayName + '<i class="fa fa-caret-down"></i></h2>';
                        content += '<ul class="prosul clearfix" id="mediaClassifyPro">';
                        // content+='<li class=""> <a class="ti" href="">全部</a></li>';

                        for(var j=0;j<obj.length;j++){
                            content += ' <li class=""> <a class="ti" href="' + ctx + '/hot/front/hot/more/' + obj[j].innerid + '/' + num + '">' + obj[j].displayName + '</a></li>'
                        }
                    }

                }
                content+='</ul>';
            }
            $('.mediaClassify').html(content);
        }
    })

    // 媒体分类下拉框
	$('.mediaClassify').click(function () {
        $(".mediaClassify ul").slideToggle("fast");
    });

//	全选功能
	$('.table-operation-status').find('a').eq(0).allCheck({
		'allFun':function(status){
			if(status){
				console.log(status);
				if(batchCheckWebPageCode.length == 0){
					for(var ca=0;tableItemWebPageCodeArr.length>ca;ca++){
						batchCheckWebPageCode.push(tableItemWebPageCodeArr[ca]);
					}
				}else{
					for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
						
						var jishustatus = 0;
						
						for(var j = 0;batchCheckWebPageCode.length>j;j++){
							if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
								++jishustatus;
							}
						}
						
						if(jishustatus == 0){
							batchCheckWebPageCode.push(tableItemWebPageCodeArr[i])
						}else{
							jishustatus = 0
						}
					}
				}
			}else{
				for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
					for(var j = 0;batchCheckWebPageCode.length>j;j++){
						if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
							batchCheckWebPageCode.splice(j,1)
						}
					}
				}
			}
		}
	});
//	批量收藏
	$('.table-operation-status a').click(function(){
		$(this).batchCollect({
			dataUrl:ctx+'/latest/front/collectingAllNews', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode,'type':4},  //传递参数
			callback:function(data){
				console.log(data);
	    		if(data.result){
	    			var obj = data.resultObj;
	    			for(var key in obj){
	        			if(obj[key]){
	        				for(var j = 0;tableItemWebPageCodeArr.length>j;j++){
	        					if(key == tableItemWebPageCodeArr[j]){
	        						$('.inewsOperation').eq(j).find('i:first').attr('class','fa fa-heart active');
	        						$('.searchesTable').find('span.check-child').eq(j).removeClass('checked');
                                    $('.searchesTable').find('span').eq(0).removeClass('checked');
	        						//$('.table-operation-status').find('a:first').removeAttr('style').find('span').removeClass('checked')
	        					}
	        				}
	        			}
	        		}
	    			batchCheckWebPageCode = [];
	    		}
			}
		})
	});
//	批量建稿
	$('.table-operation-status a').eq(3).click(function(){
		$(this).batchBuild({
			dataUrl:ctx+'/latest/front/draft/release/more', //请求路径
			dataParam:{'webpageCodeList':batchCheckWebPageCode},  //传递参数
			callback:function(data,tempwindow){
				if(data.result){
					
					tempwindow.location=data.resultObj;
					$('span.check-child').removeClass('checked');
					batchCheckWebPageCode = [];
					
					hotNewsList.ajax.reload();
				}
				
			}
		})
	})
	
// 	hotNewsList = $('.searchesTable').DataTable({
//        serverSide: true,//标示从服务器获取数据
//        sAjaxSource :ctx+'/hot/front/getHotNewsMore',//服务器请求
//        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
//        fnServerParams : function ( aoData ) {
//     	   var source = $('.source').val();
//     	   var rankingCycle = '';
//     	   $('.period a').each(function(){
//     		   if($(this).hasClass('active')){
//     			   rankingCycle = $(this).attr('data-innerid');
//     		   }
//     	   })
//     	   aoData.push(
//         		{"name":"rankingCycle","value":rankingCycle},
//         		{"name":"source","value":source}
//         	);
//        },
//
// //		       服务器传过来的值
//        "rowCallback" : function(row, data, index) {
//     	   //checkbox选择
//     	   var checkCon = '<span data-webpagecode="'+data.webpageCode+'" class="check-box check-child"><i class="fa fa-check"></i></span>';
//     	   $('td:eq(0)', row).html(checkCon);
//
//
//     	   //title
//     	   var titleCon = '<a href="'+ctx+'/hot/front/hot/detail/'+data.webpageCode+'" target="_blank"  class="beyondEllipsis" tabindex="0" data-id="'+data.webpageCode+'">'+data.title+'</a>'
//     	   $('td:eq(2)', row).html(titleCon).addClass('titleRightClick');
//
//     	   var sameNum = '(<span class="sameNum'+index+'"></span>)';
//     	   var relevantNum = '(<span class="relevantNum'+index+'"></span>)';
//     	   var browseNum = '<span class="browseNum'+index+'"></span>';
//     	   $('td:eq(10)', row).html(sameNum);
//     	   $('td:eq(11)', row).html(relevantNum);
//     	   $('td:eq(13)', row).html(browseNum);
//
//     	   var negativeCon = '<span class="negativeNum'+index+'"></span>';
//     	   $('td:eq(12)', row).html(negativeCon);
//
//     	   //操作
//     	   var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> <span><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
//     	   //var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> ';
//     	   $('td:eq(14)', row).html(operationCon).addClass('inewsOperation').attr('data-id',data.webpageCode);
//
//        },
//
// //		       服务器传过来的值
//        columns: [//显示的列
//            {data: 'webpageCode', "bSortable": false},
//            {data: 'releaseDatetime', "bSortable": false,
//         	   render:function(data, type, row){
//              		if(null != data && "" != data){
//              			var releaseDatetime = new Date(data);
//
//              			//获取当前年
//              			var nowDate = new Date();
//              			var nowyear=nowDate.getFullYear();
//              			var year = releaseDatetime.formatDate('yyyy');
//              			var time = '';
// //             			判断发布时间是否为当前年份
//              			if(year == nowyear){
//              				time = releaseDatetime.formatDate('MM-dd hh:mm');
//              			}else{
//              				time = releaseDatetime.formatDate('yyyy-MM-dd');
//              			}
//
//  						return time;
//              		}else{
//              			return '-';
//              		}
//                }
//            },
//            { data: 'title', "bSortable": false},
//            { data: 'rankingTypeDetail', "bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.name != null && data.name != ''){
//         				   var rankingType = data.name;
//             			   return rankingType;
//         			   }else{
//         				   return '-'
//         			   }
//
//         		   }else{
//         			   return '-'
//         		   }
//         	   }
//            },
//            { data: 'rankingCycleDetail', "bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.name != null && data.name != ''){
//         				   var rankingCycle = data.name;
//             			   return rankingCycle;
//         			   }else{
//         				   return '-'
//         			   }
//         		   }else{
//         			   return '-'
//         		   }
//         	   }
//            },
//            { data: 'sourceCrawlDetail', "bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.website.displayName != null && data.website.displayName != ''){
//         				   var sourceCrawl = data.website.displayName;
//             			   return sourceCrawl;
//         			   }else{
//         				   return '-'
//         			   }
//
//         		   }else{
//         			   return '-'
//         		   }
//         	   }
//            },
//            { data: 'rankingNum', "bSortable": false},
//            { data: 'clickingNum', "bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//             		   return data;
//             	   }else{
//             		   return '-'
//             	   }
//         	   }
//            },
//            { data: 'commentNum',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//             		   return data;
//             	   }else{
//             		   return '-'
//             	   }
//         	   }
//            },
//            { data: 'participateNum',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//             		   return data;
//             	   }else{
//             		   return '-'
//             	   }
//         	   }
//            },
//            { data: 'statEntity',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.sameNum != null && data.sameNum != ''){
//         				   var sameNum = data.sameNum * 100 + '%';
//             			   return sameNum;
//         			   }else{
//         				   return '-'
//         			   }
//         		   }else{
//         			   return '-';
//         		   }
//         	   }
//            },
//            { data: 'statEntity',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.relevantNum != null && data.relevantNum != ''){
//         				   var relevantNum = data.relevantNum * 100 + '%';
//             			   return relevantNum;
//         			   }else{
//         				   return '-'
//         			   }
//         		   }else{
//         			   return '-';
//         		   }
//         	   }
//            },
//            { data: 'sentiment',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   var negative = data.negative * 100 + '&';
//         			   return negative;
//         		   }else{
//         			   return '-';
//         		   }
//         	   }
//            },
//            { data: 'statEntity',"bSortable": false,
//         	   render:function(data,type,row){
//         		   if(data != null && data != ''){
//         			   if(data.browseNum != null && data.browseNum != ''){
//         				   var browseNum = data.browseNum ;
//             			   return browseNum;
//         			   }else{
//         				   return '-';
//         			   }
//         		   }else{
//         			   return '-';
//         		   }
//         	   }
//            },
//            {data: 'webpageCode', "bSortable": false}
//        ],
//
//        "aaSorting": [[0, ""]],
//    });


	//2018-3-15 lizehua
    hotNewsList = $('.searchesTable').DataTable({
        serverSide: true,//标示从服务器获取数据
        sAjaxSource :ctx+'/hot/front/getHotNewsToMore',//服务器请求
        fnServerData : retrieveData,//用于替换默认发到服务端的请求操作,默认方法为：$.getJSON
        fnServerParams : function ( aoData ) {
            var source = $('.source').val();
            var rankingCycle = '';
            $('.period a').each(function(){
                if($(this).hasClass('active')){
                    rankingCycle = $(this).attr('data-innerid');
                }
            })
            aoData.push(
                {"name":"rankingCycle","value":rankingCycle},
                {"name":"source","value":source},
                {"name":"label","value":num}
            );
        },

//		       服务器传过来的值
        "rowCallback" : function(row, data, index) {
            //checkbox选择
            var checkCon = '<span data-webpagecode="'+data.webpageCode+'" class="check-box check-child"><i class="fa fa-check"></i></span>';
            $('td:eq(0)', row).html(checkCon);


            //title
            var titleCon = '<a href="'+ctx+'/hot/front/hot/detail/'+data.webpageCode+'" target="_blank"  class="beyondEllipsis" tabindex="0" data-id="'+data.webpageCode+'">'+data.title+'</a>'
            $('td:eq(2)', row).html(titleCon).addClass('titleRightClick');

            var sameNum = '<span class="sameNum'+index+'"></span>';
            var relevantNum = '<span class="relevantNum'+index+'"></span>';
          //  var browseNum = '<span class="browseNum'+index+'"></span>';
            $('td:eq(6)', row).html(relevantNum+'/'+sameNum);
            //$('td:eq(11)', row).html(relevantNum);
           // $('td:eq(13)', row).html(browseNum);

            var negativeCon = '<span class="negativeNum'+index+'"></span>';
            $('td:eq(7)', row).html(negativeCon);

            //操作
            var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> <span><i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="建稿"></i></span>';
            //var operationCon = '<span><i class="fa fa-heart-o" data-toggle="tooltip" data-placement="top" title="收藏"></i></span> ';
            $('td:eq(8)', row).html(operationCon).addClass('inewsOperation').attr('data-id',data.webpageCode);

        },

//		       服务器传过来的值
        columns: [//显示的列
            {data: 'webpageCode', "bSortable": false},
            {data: 'releaseDatetime', "bSortable": false,
                render:function(data, type, row){
                    if(null != data && "" != data){
                        var releaseDatetime = new Date(data);

                        //获取当前年
                        var nowDate = new Date();
                        var nowyear=nowDate.getFullYear();
                        var year = releaseDatetime.formatDate('yyyy');
                        var time = '';
//             			判断发布时间是否为当前年份
                        if(year == nowyear){
                            time = releaseDatetime.formatDate('MM-dd hh:mm');
                        }else{
                            time = releaseDatetime.formatDate('yyyy-MM-dd');
                        }

                        return time;
                    }else{
                        return '-';
                    }
                }
            },
            { data: 'title', "bSortable": false},
            // { data: 'sourceCrawlDetail', "bSortable": false,    //榜单来源
            //     render:function(data,type,row){
            //         if(data != null && data != ''){
            //             if(data.website.displayName != null && data.website.displayName != ''){
            //                 var sourceCrawl = data.website.displayName;
            //                 return sourceCrawl;
            //             }else{
            //                 return '-'
            //             }
            //
            //         }else{
            //             return '-'
            //         }
            //     }
           // },
            { data: 'rankingNum', "bSortable": false},
            { data: 'commentNum',"bSortable": false,  //评论量
                render:function(data,type,row){
                    if(data != null && data != ''){
                        return data;
                    }else{
                        return '-'
                    }
                }
            },
            { data: 'clickingNum', "bSortable": false,  //点击量
                render:function(data,type,row){
                    if(data != null && data != ''){
                        return data;
                    }else{
                        return '-'
                    }
                }
            },
            // { data: 'participateNum',"bSortable": false,
            //     render:function(data,type,row){
            //         if(data != null && data != ''){
            //             return data;
            //         }else{
            //             return '-'
            //         }
            //     }
            // },
            // { data: 'statEntity',"bSortable": false,  //相似
            //     render:function(data,type,row){
            //         if(data != null && data != ''){
            //             if(data.sameNum != null && data.sameNum != ''){
            //                 var sameNum = data.sameNum * 100 + '%';
            //                 return sameNum;
            //             }else{
            //                 return '-'
            //             }
            //         }else{
            //             return '-';
            //         }
            //     }
            // },
            { data: 'statEntity',"bSortable": false  //相关
                // render:function(data,type,row){
                //     if(data != null && data != ''){
                //         if(data.relevantNum != null && data.relevantNum != ''){
                //             var relevantNum = data.relevantNum * 100 + '%';
                //             return relevantNum;
                //         }else{
                //             return '-'
                //         }
                //     }else{
                //         return '-';
                //     }
                // }
            },
            { data: 'sentiment',"bSortable": false,    //QG指数
                render:function(data,type,row){
                    if(data != null && data != ''){
                        var negative = data.negative * 100 + '&';
                        return negative;
                    }else{
                        return '-';
                    }
                }
            },
            // { data: 'statEntity',"bSortable": false,
            //     render:function(data,type,row){
            //         if(data != null && data != ''){
            //             if(data.browseNum != null && data.browseNum != ''){
            //                 var browseNum = data.browseNum ;
            //                 return browseNum;
            //             }else{
            //                 return '-';
            //             }
            //         }else{
            //             return '-';
            //         }
            //     }
            // },
            {data: 'webpageCode', "bSortable": false}
        ],

        "aaSorting": [[0, ""]],
    });
	//

	
	$('.searchesTable').on('draw.dt',function() {
		
		$('.searchesTable').itemCheck({   //给每一条新闻增加单击的事件
			'itemFun':function($this,statusItem){
				if(statusItem){
//					console.log($this[0].attributes[0].nodeValue);
					batchCheckWebPageCode.push($this[0].attributes[0].nodeValue);
				}else{
					for(var i = 0;batchCheckWebPageCode.length>i;i++){
						var webpageCodeItem = $this[0].attributes[0].nodeValue;
						if(webpageCodeItem == batchCheckWebPageCode[i]){
							batchCheckWebPageCode.splice(i,1);
						}
					}
				}
			}
		});
		
//		点击翻页页面自动移动到上方
		$('.paginate_button').each(function(){
			$(this).click(function(){
				$(this).scrollOffset({
					'scrollPos':115
				});
			})
		})
		
//		相似相关获取
		var textArr = hotNewsList.column(2).nodes().data();
		tableItemWebPageCodeArr =[];
		if(textArr.length > 0){
			for(var count = 0;textArr.length>count;count++){
				tableItemWebPageCodeArr.push(textArr[count].webpageCode);
			}
			//相似
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getSameNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.searchesTable tbody').find('[class*="sameNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
			
//			相关
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getRelevantNewsNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.searchesTable tbody').find('[class*="relevantNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
//			负面指数
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getsentimentindex',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					console.log(data);
					$('.searchesTable tbody').find('[class*="negativeNum"]').each(function(index){
						if(data[index].negative != null && data[index].negative != ''){
							var colorStyle = ''
							// if(data[index].negative > 60){
							// 	colorStyle = 'red'
							// }else
							if(data[index].negative > 40){
								colorStyle = 'gray'
							}else{
								colorStyle = 'green'
							}
							//QG指数显示修改
                            var negative=data[index].negative;
                            if(negative>40){
                                $(this).text('-'+negative.toFixed(2));
                            }else{
                                $(this).text((100-negative).toFixed(2));
                            }
							//$(this).text(data[index].negative);
							$(this).addClass(colorStyle);
						}else{
							$(this).text('-');
						}
						
					})
				}
			});
//		浏览量
			$().adraticAjaxData({
				'dataUrl':ctx+'/latest/front/getBrowseNum',
				'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
				'callback':function(data){
					$('.searchesTable tbody').find('[class*="browseNum"]').each(function(index){
						$(this).text(data[index]);
					})
				}
			});
            //操作-收藏
            $().adraticAjaxData({
                'dataUrl':ctx+'/latest/front/getUserFavorites',
                'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
                'callback':function(data){
                    $('.searchesTable tbody').find('.inewsOperation').each(function(index){
                        if(data[index] == true){
                            $(this).find('i').eq(0).attr('class','fa fa-heart active');
                        }else{

                        }
                    })
                }
            });
//			操作-建稿
			$('.inewsOperation').each(function(index){
				$(this).find('span').eq(1).releaseBuild({
					'webpageCode':tableItemWebPageCodeArr[index],
					'buildingCon':function(_$this){
						_$this.find('i').addClass('hide');
        				_$this.append('<div style="color:#F44336"  class="la-timer la-sm"><div></div></div>');
        			},
        			'buildedCon':function(_$this){
//        				_$this.html('<i class="fa fa-file-text-o" data-toggle="tooltip" data-placement="top" title="" data-original-title="建稿"></i>').removeAttr("disabled");
//        				$("[data-toggle='tooltip']").tooltip();
        				hotNewsList.ajax.reload();
        			}
				})
			})
//			建、采
            $().adraticAjaxData({
                'dataUrl':ctx+'/latest/front/getDraftType',
                'dataParam':{'webpageCode':tableItemWebPageCodeArr.join(',')},
                'callback':function(data,con){
                    console.log(data);
                    $('.searchesTable tbody').find('.titleRightClick').each(function(index){
                        if(data[index][0] == 1){
                        	$(this).find('a').css({
                        		'width':'84%'
                        	})
                            $(this).append('<span class="label-status label-jian">【建】</span>');
                        }else if(data[index][0] == 2){
                        	$(this).find('a').css({
                        		'width':'84%'
                        	})
                            $(this).append('<span class="label-status label-cai">【采】</span>');
                        }else{}
                    })
                }
            });
            
//			datatables翻页时查询页面中是否有选中的新闻
			for(var i = 0;tableItemWebPageCodeArr.length>i;i++){
				for(var j = 0;batchCheckWebPageCode.length>j;j++){
					if(tableItemWebPageCodeArr[i] == batchCheckWebPageCode[j]){
						$('.searchesTable').find('.check-child').eq(i).addClass('checked');
					}
				}
			}
			
		}
		
		/*鼠标划入悬停提示*/
		$("[data-toggle='tooltip']").tooltip();
		$("[data-toggle='popover']").popover({
	    	html:true,
	    	trigger:'hover',
	    });
		
		
//		列表展示方式中的操作的样式
		$('.searchesTable tbody').find('.inewsOperation').each(function(){
			$(this).find('i').each(function(index){
				$(this).click(function(){
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						if(index == 0){
							$(this).attr('class','fa fa-heart-o');
						}
						if(index == 1){
							$(this).attr('class','fa fa-file-text-o');
						}
					}else{
						if(index == 0){
							$(this).attr('class','fa fa-heart');
						}
						if(index == 1){
							$(this).attr('class','fa fa-file-text');
						}
						$(this).addClass('active')
					}
//					操作-收藏与后台交互
                    if(index == 0){
                        var webpageCode = $(this).parents('td.inewsOperation').attr('data-id');
                        $().judgeKeep({
                            'dataUrl':ctx+'/latest/front/collectingNews',
                            'dataParam':{'webpageCode':webpageCode,'type':4}
                        })
                    }
				})
			})
		});
	})
})
//	榜单周期数据获取
function rankingCycleData(){
	$.ajax({
        url : ctx+'/common/dic/front/listRankingCycle',//这个就是请求地址对应sAjaxSource
        type : 'get',
        dataType : 'json',
        async : true,
        success : function(data) {
        	console.log(data);
        	if(data.result == true){
        		var obj = data.resultObj;
        		var content = '';
        		for(var count = 0;obj.length>count;count++){
        			content += '<a href="javascript:void(0)" data-innerid="'+obj[count].innerid+'" class="periodItem">'+obj[count].name+'</a>';
        		}
        		$('.period').html(content);

        		$('.period .periodItem').each(function(){
        			if($(this).attr('data-innerid') == '72'){
        				$(this).addClass('active');
        			}
        			$(this).click(function(){
        				$(this).addClass('active').siblings().removeClass('active');
        				hotNewsList.ajax.reload();
        			})
        		})
        	}

        }
	})
}