;
(function ($, window, document, undefined) {
    var pluginName = "MultipleSelect",
    defaults = {
        ajaxsrc: _PORTALROOT_GLOBAL + "/Ajax/GetSirio2015.ashx?method=GetCommonComment", //默认取数Url
        Editable: false,
        CommonType: 'QACommon'
    };
    function MultipleSelect(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v0.0.1';
        this.init();
    }
    MultipleSelect.prototype = {
        init: function () {
            var $element = $(this.element)
            this.render(this);
        },
        render: function (instance) {
            var LatestCommentPanel = $("<div></div>").width(instance.Width).css({ "text-align": "right", "margin-top": "5px" }),
                LatestCommentSel;
            LatestCommentSel = $("<select></select>");
            LatestCommentPanel.css("text-align", "center");
            LatestCommentSel.css({ width: "90%", height: "initial", border: "1px solid #DFDDDD" });

            LatestCommentSel.append("<option value=''>--" + SheetLanguages.Current.SelectComment + "--</option>");

            var e = $(instance.element);
            if (e.next() != null && e.next().length > 0) {
                e = e.next();
            }
            e.after(LatestCommentPanel);

            //获取意见数据
            $.ajax({
                url: instance.settings.ajaxsrc,
                type: "post",
                dataType: 'json',
                data: { Code: instance.settings.CommonType },
                success: function (data) {
                    if (data != null) {
                        data = eval(data);
                        for (var i = 0; i < data.length; i++) {
                            var text = data[i];
                            if (text.length > 18) {
                                text = text.substring(0, 18) + "...";
                            }
                            var option = $("<option value='" + data[i] + "'>" + text + "</option>");
                            LatestCommentSel.append(option);
                        }
                        $(LatestCommentSel).unbind("change.LatestCommentSel").bind("change.LatestCommentSel", instance, function (e) {
                            if ($(this).val().length > 0) {
                                if (!e.data.element.disabled) {
                                    $(e.data.element).val($(e.data.element).val() + $(this).val());
                                    $(e.data.element).SheetUIManager().Validate();
                                }
                            }
                        });
                        LatestCommentPanel.append(LatestCommentSel);
                    }
                }
            });
        }
    };
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new MultipleSelect(this, options));
            } else {
                $.data(this, "plugin_" + pluginName).init();
            }
        });

        // chain jQuery functions
        return this;
    };
})(jQuery, window, document);