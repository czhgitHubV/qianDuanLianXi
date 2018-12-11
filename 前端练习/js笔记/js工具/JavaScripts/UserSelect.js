; (function ($) {
    $.fn.userSelect = function (option) {
        $.fn.userSelect.defaults = {
            mapping: "",//选择后需要反写值的对应元素
            columns: "工号:Code,姓名:Name", //默认显示的行
            postpara: "",//默认筛选参数
            ajaxsrc: _PORTALROOT_GLOBAL + "/Ajax/GetSirio2015.ashx?method=GetUserInfo", //默认取数Url
            serchtitle: "&nbsp;&nbsp;查找："//标题
        }
        var options = $.extend({}, $.fn.userSelect.defaults, option);
        var _data;
        return this.each(function () {
            var _ele = $(this);
            if (_ele.attr("readonly") == "readonly") {
                return;
            }
            _ele.unbind("click").bind("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(".userSelect")[0]) {
                    $(".userSelect").remove();
                }
                var ih = $(this).height(),
					iw = $(this).width() < 250 ? 250 : $(this).width(),
					PosY = $(this).offset().top + ih + 7,
                    PosX = $(this).offset().left;
                renderPage(PosX, PosY, iw);
                $("#txtSearchKey").focus();
            });
            var renderPage = function renderPage(x, y, w) {
                var html = [
                '<div class="userSelect" id="test" style="border:1px solid #e4e4e4;background-color:#FFFFFF;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;z-index:99999">',
                '<form class="form-inline">',
                '<div class="form-group has-feedback"><label for="txtSearchKey" class="control-label">' + options.serchtitle + '</label><input id="txtSearchKey" placeholder="支持模糊查询" style="padding-left: 3px;" class="form-control" type="text"/>',
                '<span class="fa fa-search form-control-feedback"></span></div>',
                '</form>',
                '<div style="height:220px;overflow-x:hidden;overflow-y:auto;width:100%">',
                '<table class="table table-hover scrollTable selecttb" id="tbSelectWord">',
                '</table></div></div>'
                ].join("");
                if ($(".userSelect") && $(".userSelect").length == 0) {
                    $("body").append(html);
                    getList(next);
                } else if (!$(".userSelect").is(":visible")) {
                    $(".userSelect").fadeIn(100)
                }
            };
            var setValue = function setValue(e) {
                if (options.mapping != "") {
                    var datarow = $(e).attr("dataindex");
                    result = _data[datarow];
                    var arr = options.mapping.split(",");
                    var keyValue;
                    for (var i = 0; i < arr.length; i++) {
                        keyValue = arr[i].split(":");
                        if (keyValue.length != 2) continue;
                        if (result[keyValue[1]] == null) continue;
                        setControlValue(keyValue[0], result[keyValue[1]], getRow());
                    }
                    $(e).focus();
                    $(e).change();
                    var obj = $.isFunction(_ele.SheetUIManager) ? _ele.SheetUIManager() : _ele;
                    if (obj && obj.OnChange) {
                        obj.RunScript(_ele[0], obj.OnChange);
                    }
                    $("#txtSearchKey").val("");
                    $(".userSelect").hide();
                    return;
                }
                var v = $(e).find("td").eq(0).text();
                _ele.val(v);
            };
            var setControlValue = function (datafiled, val, rownum) {
                var row = rownum == undefined ? 0 : rownum;
                var ctl = undefined;
                var control1 = $("input[datafield='" + datafiled + "'],textarea[datafield='" + datafiled + "'],select[datafield='" + datafiled + "'],input[data-datafield='" + datafiled + "'],textarea[data-datafield='" + datafiled + "'],select[data-datafield='" + datafiled + "']").find("[data-row=" + row + "]");
                var parentControl = $(control1).attr("id");
                if (parentControl != null) {
                    if ($("#" + parentControl) != null) {
                        ctl = $("#" + parentControl);
                    }
                }
                else if ($("#" + datafiled) != null && $("#" + datafiled).length > 0) {
                    ctl = $("#" + datafiled);
                }
                else {
                    //搜索子表
                    if (datafiled.indexOf('.') > -1) {
                        //子表
                        if (rownum == undefined) {
                            row = 1;//默认第一行
                        }
                        ctl = $("[data-datafield='" + datafiled + "'][data-row=" + row + "]");
                        if (!ctl) {
                            var startObj = $(_ele).parent().parent();
                            var ctls = startObj.find("input[datafield='" + datafiled + "'],textarea[datafield='" + datafiled + "'],select[datafield='" + datafiled + "'],div[datafield='" + datafiled + "'],input[data-datafield='" + datafiled + "'],textarea[data-datafield='" + datafiled + "'],div[data-datafield='" + datafiled + "'],select[data-datafield='" + datafiled + "']");
                            if (ctls.length > 0) {
                                ctl = ctls;
                            }
                        }
                    } else {
                        //div用于人员选择框
                        var ctls = $("input[datafield='" + datafiled + "'],textarea[datafield='" + datafiled + "'],select[datafield='" + datafiled + "'],div[datafield='" + datafiled + "'],input[data-datafield='" + datafiled + "'],textarea[data-datafield='" + datafiled + "'],div[data-datafield='" + datafiled + "'],select[data-datafield='" + datafiled + "']");
                        if (ctls.length > 0) {
                            ctl = ctls;
                        }
                    }
                }
                if (ctl) {
                    if (val && $.isFunction(ctl.SheetUIManager)) {
                        var manager = ctl.SheetUIManager();
                        if (manager) {
                            manager.SetValue(val);
                        } else {
                            ctl.val(val);
                            _ele.SheetUIManager().RemoveInvalidText(ctl[0]);
                        }
                    } else {
                        ctl.val(val);

                    }
                }
            };
            var getRow = function () {
                var row = _ele.attr("data-row");
                if (row <= 0) {
                    row = _ele.closest("tr[class='rows']").attr("data-row");
                }
                return row;
            }
            var getList = function (callback) {
                try {
                    para = eval(options.postpara);
                } catch (e) {
                    para = '';
                }
                $.ajax({
                    url: options.ajaxsrc,
                    type: "post",
                    dataType: 'json',
                    data: typeof (para) != 'undefined' && typeof (para[0]) != 'undefined' ? para[0] : '',
                    success: function (data) {
                        if (data != null) {
                            data = eval(data);
                            _data = data;
                            setSelect();
                        }
                        if (typeof (callback) == "function") {
                            callback && callback();
                        }
                    }
                });
            };
            var setSelect = function setSelect() {
                if (_data) {
                    var keyWord = $.trim($('#txtSearchKey').val());
                    var columntitle = options.columns.split(",");
                    //生成表头
                    var trValues = "";
                    trValues += "<thead><tr>";
                    for (var j = 0; j < columntitle.length; j++) {
                        var keyValue = columntitle[j].split(":");
                        trValues += "<th>" + keyValue[0] + "</th>";
                    }
                    trValues += "</tr></thead>";
                    for (var i = 0; i < _data.length; i++) {
                        if (keyWord.length > 0 && JSON.stringify(_data[i]).indexOf(keyWord) < 0) {
                            continue;
                        }
                        var result = JSON.stringify(_data[i]);
                        result = result.replace(/"/g, "'");
                        trValues += "<tr dataindex = '" + i + "'>";
                        for (var k = 0; k < columntitle.length; k++) {
                            keyValue = columntitle[k].split(":");
                            trValues += "<td>" + _data[i][keyValue[1]] + "</td>";
                        }
                        trValues += "</tr>";
                    }
                    $(".selecttb").html(trValues);
                    //注册点击事件
                    $(".userSelect").find("tr").on("click", function (ele) {
                        ele.preventDefault();
                        ele.stopPropagation();
                        setValue(this);
                        $(".userSelect").hide();
                    });
                }
            }
            var next = function next() {
                if ($(".userSelect").is(":visible")) {

                    $(".userSelect").find("button").bind("click", function () {
                        $(".userSelect").hide();
                    })
                    $("#txtSearchKey").on("input propertychange", function () {
                        setSelect();
                    })
                    $(document).on("click", function (e) {
                        var e1 = e || window.event;
                        var elem = e1.target || e1.srcElement;
                        while (elem) {
                            if (elem.className && elem.className == 'userSelect') {
                                return;
                            }
                            elem = elem.parentNode;
                        }
                        $(".userSelect").remove();
                    })
                }
            };
        });
    };
})(jQuery);