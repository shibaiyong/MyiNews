/*
  1、控制所有的dataTables中的样式
  2、在使用dataTables时需要引入这个JS
  3、这个js只是控制样式，并不控制数据的传输
*/
(function(window, document, undefined){
var factory = function( $, DataTable ) {
"use strict";

/* Set the defaults for DataTables initialisation */
/*$.extend( true, $.fn.dataTable.defaults, {
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sSearch": "快速搜索:",
        "bAutoWidth": true,
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sZeroRecords": "Nothing found - 没有记录",
        "sInfo": "_START_ 到 _END_ 条,共 _TOTAL_ 条",
        "sInfoEmpty": "显示0条记录",
        "sInfoFiltered": "(从 _MAX_ 条中过滤)",
        "sProcessing":"<div style=''><img src='../static/img/loader.gif'><span>加载中...</span></div>",
        "oPaginate": {
            "sPrevious": "",
            "sNext":     "",
            "sLast":     ">>",
            "sFirst":    "<<"
        }
    }
} );*/

$.extend( true, DataTable.defaults, {
    dom:
        "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-4'i><'col-sm-8'p>>",
 // sEmptyTable: "抱歉， 没有找到",当表格中没有数据（无视因为过滤导致的没有数据）时，该字符串年优先与sZeroRecords显示
//  sZeroRecords: "抱歉， 没有找到", //当对数据进行过滤操作后，如果没有要显示的数据，会在表格记录中显示该字符串
//  bDestroy: true, //是否删除就数据
//  bRetrieve: true, //是否允许生成新表格
    "sPaginationType": "bootstrap",
    bAutoWidth:false,//自动计算列宽
    bLengthChange: false, //每页显示数量选择
    searching: false,   //搜索框
    iDisplayLength : 8,//每页显示条数
    bInfo : true,  //页脚信息  (当前第 1 - 1 条　共计 1 条)
    bPaginate : true,//是否启用翻页功能
   /* sPaginationType : "full_numbers",//是否显示所有页码，数字的翻页样式
*/    bProcessing: true,//开关，以指定当正在处理数据的时候，是否显示“正在处理”这个提示信息;true or false, defualt false;
    // serverSide: true,//标示从服务器获取数据
    oLanguage: { // 对表格国际化
        // "sLengthMenu" : "每页显示 _MENU_条",
        "sZeroRecords" : "没有找到符合条件的数据",/*在查询的时候没有查找到相关信息的时候显示*/
        "sProcessing" : "数据加载中...",
        "sInfo" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
        "sInfoEmpty" : "当前第0条　共计0条",
        "sEmptyTable":"没有可以显示的数据",/*没有数据的显示 No data available in table*/
        "sInfoFiltered" : "(从 _MAX_ 条记录中过滤)",
        "sSearch" : "搜索：",
        "sLengthMenu":  "_MENU_ ",/*自定义页面显示条数*/
        "oPaginate" : {
            "sFirst" : "<i class='fa fa-fw fa-angle-double-left'></i>",
            "sPrevious" : "<i class='fa fa-fw fa-angle-left'></i>",
            "sNext" : "<i class='fa fa-fw fa-angle-right'></i>",
            "sLast" : "<i class='fa fa-fw fa-angle-double-right'></i>"
        }
    },

    renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
    "sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
};

    


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
                }
            };

            $(nPaging).addClass('pagination').append(
                '<ul>'+
                '<li class="first disabled"><a href="#">'+oLang.sFirst+'</a></li>'+
                '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                '<li class="last disabled"><a href="#">'+oLang.sLast+'</a></li>'+
                '<input type="text" style="width: 30px;padding-top: 5px;padding-bottom: 5px;height: 18px;border-left: 0px;border-radius: 0px 4px 4px 0px;" id="redirect" class="redirect">'+
                '</ul>'
                );

            //datatables分页跳转
            $(nPaging).find(".redirect").keyup(function(e){
                var ipage = parseInt($(this).val());
                var oPaging = oSettings.oInstance.fnPagingInfo();
                if(isNaN(ipage) || ipage<1){
                    ipage = 1;
                }else if(ipage>oPaging.iTotalPages){
                    ipage=oPaging.iTotalPages;
                }
                $(this).val(ipage);
                ipage--;
                oSettings._iDisplayStart = ipage * oPaging.iLength;
                fnDraw( oSettings );
            });

            var els = $('a', nPaging);
            $(els[0]).bind( 'click.DT', {
                action: "first"
            }, fnClickHandler );
            $(els[1]).bind( 'click.DT', {
                action: "previous"
            }, fnClickHandler );
            $(els[2]).bind( 'click.DT', {
                action: "next"
            }, fnClickHandler );
            $(els[3]).bind( 'click.DT', {
                action: "last"
            }, fnClickHandler );
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for ( i=0, ien=an.length ; i<ien ; i++ ) {
                // Remove the middle elements
                ($('li:gt(1)', an[i]).filter(':not(:last)')).filter(':not(:last)').remove();

                // Add the new list items and their event handlers
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                    .insertBefore( $('.next', an[i])[0] )
                    .bind('click', function (e) {
                        e.preventDefault();
                        oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                        fnDraw( oSettings );
                    } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('li:lt(2)', an[i]).addClass('disabled');
                } else {
                    $('li:lt(2)', an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('.next', an[i]).addClass('disabled');
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('.next', an[i]).removeClass('disabled');
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( $.fn.DataTable.TableTools ) {
    // Set the classes that TableTools uses to something suitable for Bootstrap
    $.extend( true, $.fn.DataTable.TableTools.classes, {
        "container": "DTTT btn-group",
        "buttons": {
            "normal": "btn",
            "disabled": "disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu",
            "buttons": {
                "normal": "",
                "disabled": "disabled"
            }
        },
        "print": {
            "info": "DTTT_print_info modal"
        },
        "select": {
            "row": "active"
        }
    } );

    // Have the collection use a bootstrap compatible dropdown
    $.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
        "collection": {
            "container": "ul",
            "button": "li",
            "liner": "a"
        }
    } );
}


}; // /factory

if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery ) {
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);

