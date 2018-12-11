;
(function ($, window, document, undefined) {
    var pluginName = "PopSelect",
    defaults = {
        ajaxsrc: "", //默认取数Url
        Params: { def: "" },
        Columns: [],
        ToolBar: null,
        Multiple: false,
        DisplayText: "选择",//标题文本
        DisplaySearch: false,
        PopLink: "<a href='javascript:;'>选择</a>",//再控件后增加的点击弹出按钮
        DisplayLink: true,//是否显示点击弹出按钮
        IsClickPop: true,//是否控件点击时弹出S
        AutoRefresh: true,//是否自动刷新数据
        PopupWidth: "600px",
        PopupHeight: "400px",
        CheckedParams: function () { return true },//调用数据前检查
        CallBack: function (data) { }//选择数据后回调
    };
    function PopSelect(element, options) {
        this.$element = $(element);
        this.$element_ = this.$element.clone();
        this.settings = options;
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v0.0.2';
        this.init();
    };
    function RunScript(obj, script, args) {
        if (!script) return false;
        if ($.isFunction(script)) {
            if (args != null && args != undefined) {
                return script.call(obj, args);
            } else {
                return script.apply(obj);
            }
        }
        else {
            if (args != null && args != undefined) {
                return (new Function(script)).call(obj, args);
            } else {
                return (new Function(script)).apply(obj);
            }
        }
    };
    PopSelect.prototype = {
        init: function () {
            this.element = this.$element[0];
            this.render(this);
        },
        render: function (instance) {
            var displayText = instance.settings.DisplayText == "" ? "&nbsp;" : instance.settings.DisplayText;
            var w = instance.settings.PopupWidth;
            var h = instance.settings.PopupHeight;
            //弹窗div
            popId = "popupLink" + (new Date()).getTime();
            var popupDiv = "<div id='" + popId + "' class='modal fade' tabindex='-1' role='dialog' aria-hidden='true'>"
            popupDiv += "<div class='modal-dialog' style='width:" + w + "'>";
            popupDiv += "<div class='modal-content' >";
            popupDiv += "<div class='modal-header'>";
            popupDiv += "<button type='button' class='close' data-dismiss='modal'>";
            popupDiv += "<span aria-hidden='true'>&times;</span></button>";
            popupDiv += "<h4 class='modal-title'>" + displayText + "</h4>";
            popupDiv += "</div><div class='modal-body' style='margin:2px;overflow:auto;'></div>";
            popupDiv += "<div class='modal-footer'>"
                        + "<button type='button' class='btn btn-default' data-dismiss='modal'>取消</button>"
                        + "<button type='button' class ='btn btn-primary'>确定</button></div>"
            popupDiv += "</div></div></div>";
            popupDiv = $(popupDiv);

            //输出Table

            //弹窗按钮
            var showModal = function () {
                if (RunScript(instance, instance.settings.CheckedParams)) {
                    popupDiv.modal("show");
                    instance.renderTable(instance, popupDiv);
                };
            };
            if (instance.settings.DisplayLink) {
                var popupLink = $(instance.settings.PopLink);
                this.$element.after(popupLink)
                popupLink.unbind('click').bind('click', function () {
                    showModal();
                });
            }
            //增加控件点击时弹出选择
            if (instance.settings.IsClickPop) {
                this.$element.unbind('click').bind('click', function () {
                    showModal();
                });
            }
            //在Element后添加弹窗元素
            this.$element.after(popupDiv);

            popupDiv.find(".btn-primary").unbind('click').bind("click", function () {
                var data = instance.Table.bootstrapTable('getAllSelections');
                data = !instance.settings.Multiple && data.length > 0 ? data[0] : data;
                if (RunScript(instance.element, instance.settings.CallBack, data) == false) {
                    return;
                };
                popupDiv.modal("hide");
            });

            //popupDiv.on('hide.bs.modal', function (e) {
            //    //获取选中的数据

            //    if ($.isFunction(instance.settings.CallBack)) {
            //        instance.settings.CallBack.apply($(instance.element));
            //    } else {
            //        (new Function(instance.settings.CallBack)).apply($(instance.element));
            //    };
            //})
        },
        renderTable: function (instance, popDiv) {
            if (instance.Table == null || typeof (instance.Table) == "undefined") {
                //创建表格
                var toolid = "toolbar" + (new Date()).getTime();
                var popupTableId = "popupTable" + (new Date()).getTime();
                var tableEle = "<table id='" + popupTableId + "'width='100%'></table>";

                instance.Table = $(tableEle);
                if (instance.settings.ToolBar != null) {
                    var $toolbar = $("<div id='" + toolid + "'>" + instance.settings.ToolBar + "</div>");
                    instance.toolbar = $toolbar;
                    popDiv.find(".modal-body").append($toolbar);
                    instance.setToolbarValue();
                    instance.setParamsFromToolbar(instance);
                }
                popDiv.find(".modal-body").append(instance.Table);
                instance.initBootstrapTable(instance, toolid);


                //注册双击事件,单选才支持
                if (!instance.settings.Multiple) {
                    instance.Table.on('dbl-click-row.bs.table', function (e, row, $element) {
                        RunScript(instance.element, instance.settings.CallBack, row);
                        popDiv.modal("hide");
                    });
                }

                //注册自定义筛选字段
                if ($toolbar != null || typeof ($toolbar) != "undefined") {
                    $toolbar.find('.btn_search').unbind("click").bind("click", function () {
                        instance.setParamsFromToolbar(instance);
                        instance.Table.bootstrapTable('refresh', { query: instance.settings.Params, url: instance.settings.ajaxsrc });
                    });
                    $toolbar.find('input[name]').each(function () {
                        $(this).bind('keypress', function (event) {
                            if (event.keyCode == "13") {
                                $toolbar.find('.btn_search').click();
                            }
                        });
                    });
                }
            } else {
                if (instance.toolbar) {
                    //清除toolbar参数值，如果有isclear = false 则不清除
                    instance.toolbar.find('input[name],select[name] option:selected').each(function () {
                        if ($(this).attr('isclear') == undefined || !$(this).attr('isclear')) {
                            $(this).val("");
                        }
                    });
                    instance.setToolbarValue();
                }
                instance.Table.bootstrapTable('refresh', { query: instance.settings.Params });
            }


        },
        initBootstrapTable: function (instance, toolid) {
            //多选则增加复选框
            var columns = instance.settings.Columns;
            if (typeof (columns[0].checkbox) == "undefined") {
                columns.splice(0, 0, { checkbox: true });
            }
            instance.Table.bootstrapTable({
                url: instance.settings.AutoRefresh ? instance.settings.ajaxsrc : "",
                queryParams: instance.settings.Params,
                columns: columns,
                showColumns: true,
                iconsPrefix: "fa",
                icons: {
                    paginationSwitchDown: 'fa-chevron-down',
                    paginationSwitchUp: 'fa-chevron-up',
                    refresh: 'fa-refresh',
                    toggle: 'th-list-alt',
                    columns: 'fa-th',
                    detailOpen: 'fa-plus',
                    detailClose: 'fa-minus'
                },
                //striped: true,
                cache: false,
                pagination: true,
                sidePagination: 'client',
                pageSize: 10,
                selectItemName: '选择',
                search: instance.settings.DisplaySearch,
                toolbar: "#" + toolid,
                clickToSelect: true,
                singleSelect: !instance.settings.Multiple
            });
        },
        getSelectedData: function () {
            return this.Table.getSelections();
        },
        setParamer: function (params) {
            this.settings.Params = params;
        },
        setToolbarValue: function () {
            var params = this.settings.Params;
            for (var i in params) {
                var input = this.toolbar.find("[name='" + i + "']");
                if (input) {
                    input.val(params[i]);
                }
            }
        },
        setParamsFromToolbar: function (instance) {
            instance.toolbar.find('input[name],select[name] option:selected').each(function () {
                var v = $.trim($(this).val());
                var name = $(this).attr('name');
                if (name == null || name == undefined || name == "") {
                    name = $(this).parent().attr('name');
                }
                if (v != null && typeof (v) != "undefined") {
                    instance.settings.Params[name] = v;
                } else {
                    delete instance.settings.Params[name];
                }
            });
        },
        destroy: function () {
            this.$element.next().remove();
            this.$element.html(this.$element_.html());
        }
    };

    var allowedMethods = [
        'destroy',
        'getSelectedData'
    ];

    $.fn[pluginName] = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1),
            name = "plugin_" + pluginName;

        this.each(function () {
            var $this = $(this),
                data = $this.data(name),
                options = $.extend({}, defaults, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData(name);
                }
            }

            if (!data) {
                $this.data(name, (data = new PopSelect(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };
})(jQuery, window, document);