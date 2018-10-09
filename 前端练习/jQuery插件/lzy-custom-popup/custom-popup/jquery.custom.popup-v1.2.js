/*
    自定义工具
    I am liangzhenyu
    2018-07-05
*/

/*
插件-弹框提示-v1.1(可以展示大内容，也可以是确认框)
使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery
    2.获取对象
        var myPop = $.initPopop(cfg);
        cfg:配置文件如果不设置将使用默认设置
    3.设置配置
        myPop.setStyle(cfg, status);
        cfg:配置文件如果不设置将使用默认设置
        status:配置文件的状态（false:在原配置上追加，重复的将覆盖；true:全新覆盖，未配置的将使用默认值），默认值为false
    4.显示提示框
        myPop.showPopup(content,title);
        content:任意内容（可选），若无则使用 cfg 配置中的内容设置，若cfg配置中也没有设置将为空白，强制水平和垂直居中
        title:标题(可选)，若无则使用 cfg 配置中的标题设置，若cfg配置中也没有设置将使用默认值：“消息”
    5.关闭提示框
        myPop.closePopup();
    6.添加底框按钮
        myPop.addButton(btnName,callback); //需要注意的是添加的按键过多（弹框的宽不足容纳所有按键）时，将自动适应设置弹框的宽来容纳所有按键
        btnName:按键的名称,注：添加的名称含有“关闭，取消”等的将带有点击关闭弹框的事件，
        callback:回调函数(按键点击事件在这里，就是说每添加一个按键都自动绑定了一个点击事件)，函数中的 this->当前弹框对象
 参数说明：
    cfg:{
        width:弹框的长,
        height:弹框的高,
        border:弹框边框设置,
        borderRadius:边框的圆角大小,
        themeColor:弹框的主题颜色,
        isShowShadow:是否显示边框阴影,默认为true,
        shadowSize:阴影的长度，如果 isShowShadow为false则该值无效，默认长度为10px，
        isShowIcon:是否显示左上图标,默认:true,
        icon:图标的图片（可以是路径，也可以是图片base64编码）,
        allowedFullscreen：是否允许全屏，即是否添加全屏按键，默认值：false,
        allowedKeyboard:是否允许键盘操作，目前暂时只要Esc按键点击退出事件，默认允许，true
        content:任意内容,可以是节点，可以是ID，可以是类。使用建议：弹框作为模态框时建议在这里配置选择器，作为提示框时这里不要配置，直接在showPopup方法配置；
            简而言之就是不常改变的内容（一般都是配置了样式的节点）放在这，经常改变的内容（一般都是一句疑问句）就放在showPopup方法中。
        title:弹框标题,
        buttonAlign:按键对齐方式，left,center和right三种方式,
        isShowBg:是否显示背景,默认:false,
        allowedMove:是否允许移动,默认:false,
        targetSelector:目标选择器，用于弹框设置位置的相对节点，默认：body节点(居中显示)，
        centerOrFollow:弹框类型设置，“center”和“follow”两种类型，默认“center”，中心显示或跟随指定目标节点（targetSelector）显示,
        followPosition:弹框跟随目标相对位置，默认："bottom right"(右下) ,
        followOffset: 弹框跟随目标相对偏差位置，默认偏移10px
    }
 */
;(function ($, window, document, undefined) {
    $.extend({
        initPopup: function (cfg) {
            var toRGB = function (color) {
                eval(function (p, a, c, k, e, d) {
                    e = function (c) {
                        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
                    };
                    if (!''.replace(/^/, String)) {
                        while (c--) d[e(c)] = k[c] || e(c);
                        k = [function (e) {
                            return d[e]
                        }];
                        e = function () {
                            return '\\w+'
                        };
                        c = 1;
                    }
                    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                    return p;
                }('28 29={2a:{r:4,g:p,b:1},27:{r:3,g:B,b:W},23:{r:0,g:1,b:1},24:{r:i,g:1,b:26},2b:{r:4,g:1,b:1},2g:{r:6,g:6,b:d},2h:{r:1,g:y,b:Y},2i:{r:0,g:0,b:0},2f:{r:1,g:B,b:7},2c:{r:0,g:0,b:1},2d:{r:2e,g:43,b:1Q},1R:{r:s,g:42,b:42},1S:{r:n,g:N,b:D},1P:{r:1M,g:1N,b:l},1O:{r:i,g:1,b:0},1T:{r:u,g:a,b:30},1Y:{r:1,g:i,b:1Z},22:{r:P,g:1X,b:1U},1V:{r:1,g:p,b:d},1W:{r:d,g:20,b:15},2C:{r:0,g:1,b:1},2D:{r:0,g:0,b:5},2E:{r:0,g:5,b:5},2B:{r:N,g:2y,b:11},2z:{r:z,g:z,b:z},2A:{r:0,g:P,b:0},2F:{r:2K,g:2L,b:q},2M:{r:5,g:0,b:5},2J:{r:13,g:q,b:47},2G:{r:1,g:F,b:0},2H:{r:S,g:o,b:14},2I:{r:5,g:0,b:0},2n:{r:2o,g:2p,b:I},2m:{r:m,g:J,b:m},2j:{r:10,g:2k,b:5},2l:{r:47,g:Q,b:Q},2q:{r:0,g:C,b:A},2v:{r:2w,g:0,b:h},2x:{r:1,g:20,b:w},2u:{r:0,g:12,b:1},2r:{r:a,g:a,b:a},2s:{r:30,g:e,b:1},2t:{r:A,g:1L,b:1i},1h:{r:V,g:34,b:34},1g:{r:1,g:3,b:4},1n:{r:34,g:5,b:34},1o:{r:1,g:0,b:1},1m:{r:d,g:d,b:d},16:{r:p,g:p,b:1},1b:{r:1,g:W,b:0},1E:{r:v,g:s,b:32},1F:{r:2,g:2,b:2},1C:{r:0,g:2,b:0},1G:{r:x,g:1,b:47},1H:{r:4,g:1,b:4},1t:{r:1,g:a,b:G},1u:{r:7,g:M,b:M},1r:{r:1y,g:0,b:E},1v:{r:1,g:1,b:4},1w:{r:4,g:9,b:F},1z:{r:9,g:9,b:3},1D:{r:1,g:4,b:6},1p:{r:1c,g:1a,b:0},1d:{r:1,g:3,b:7},1e:{r:x,g:f,b:9},1k:{r:4,g:2,b:2},1l:{r:j,g:1,b:1},1J:{r:3,g:3,b:u},1K:{r:h,g:h,b:h},1I:{r:e,g:8,b:e},1A:{r:1,g:1s,b:1x},1q:{r:1,g:l,b:I},1B:{r:32,g:V,b:t},18:{r:D,g:C,b:3},17:{r:1f,g:c,b:1},1j:{r:4o,g:4t,b:S},3Q:{r:X,g:Y,b:n},3P:{r:1,g:1,b:j},3S:{r:0,g:1,b:0},3K:{r:o,g:7,b:o},3X:{r:3,g:4,b:9},40:{r:1,g:0,b:1},3Y:{r:2,g:0,b:0},3Z:{r:3V,g:7,b:t},3W:{r:0,g:0,b:7},49:{r:4a,g:13,b:h},4b:{r:w,g:c,b:f},41:{r:15,g:K,b:44},48:{r:3U,g:3L,b:8},3M:{r:0,g:3,b:U},3N:{r:10,g:A,b:14},3I:{r:3J,g:21,b:R},3R:{r:25,g:25,b:c},3T:{r:6,g:1,b:3},3O:{r:1,g:y,b:H},4c:{r:1,g:y,b:4s},4u:{r:1,g:n,b:x},4p:{r:0,g:0,b:2},4q:{r:4r,g:6,b:9},4x:{r:2,g:2,b:0},4w:{r:q,g:4v,b:35},4g:{r:1,g:s,b:0},4h:{r:1,g:L,b:0},4f:{r:v,g:c,b:4d},4e:{r:8,g:4i,b:t},4m:{r:T,g:4n,b:T},4l:{r:4j,g:8,b:8},4k:{r:f,g:c,b:w},37:{r:1,g:38,b:39},31:{r:1,g:v,b:33},36:{r:7,g:R,b:3a},3e:{r:1,g:k,b:3f},3g:{r:Z,g:l,b:Z},3b:{r:X,g:j,b:9},3c:{r:2,g:0,b:2},3d:{r:1,g:0,b:0},2Q:{r:J,g:m,b:m},2R:{r:2S,g:a,b:H},2N:{r:5,g:L,b:19},2O:{r:3,g:2,b:2P},2T:{r:2X,g:2Y,b:2Z},2U:{r:46,g:5,b:2V},2W:{r:1,g:6,b:8},3h:{r:l,g:3y,b:45},3z:{r:k,g:k,b:k},3A:{r:D,g:C,b:B},3v:{r:3w,g:3x,b:7},3B:{r:c,g:2,b:e},3F:{r:1,g:3,b:3},3G:{r:0,g:1,b:i},3H:{r:3C,g:E,b:G},3D:{r:u,g:G,b:F},3E:{r:0,g:2,b:2},3l:{r:f,g:12,b:f},3m:{r:1,g:3n,b:3i},3j:{r:3k,g:j,b:O},3o:{r:8,g:E,b:8},3s:{r:O,g:32,b:e},3t:{r:6,g:n,b:K},3u:{r:1,g:1,b:1},3p:{r:6,g:6,b:6},3q:{r:1,g:1,b:0},3r:{r:U,g:7,b:o}};', 62, 282, '|255|128|250|240|139|245|205|238|230|105||112|220|144|216||211|127|224|192|160|143|222|50|248|107||165|170|210|218|147|173|228|169|209|235|206|135|130|140|180|225|122|188|179|69|92|184|208|100|79|133|153|152|154|178|215|176|196|221|72||191|85|204|60|ghostwhite|lightslateblue|lightskyblue||252|gold|124|lemonchiffon|lightblue|132|floralwhite|firebrick|117|lightslategray|lightcoral|lightcyan|gainsboro|forestgreen|fuchsia|lawngreen|lightsalmon|indigo|182|hotpink|indianred|ivory|khaki|193|75|lavender|lightpink|lightseagreen|green|lavenderblush|goldenrod|gray|greenyellow|honeydew|lightgreen|lightgoldenrodyellow|lightgrey|146|95|158|chartreuse|cadetblue|226|brown|burlywood|chocolate|237|cornsilk|crimson|149|coral|80|||cornflowerblue|aqua|aquamarine||212|antiquewhite|var|EN_COLOR|aliceblue|azure|blue|blueviolet|138|blanchedalmond|beige|bisque|black|darkslateblue|61|darkslategray|darkseagreen|darksalmon|233|150|darkturquoise|dimgray|dodgerblue|feldspar|deepskyblue|darkviolet|148|deeppink|134|darkgray|darkgreen|darkgoldenrod|cyan|darkblue|darkcyan|darkkhaki|darkorange|darkorchid|darkred|darkolivegreen|189|183|darkmagenta|saddlebrown|salmon|114|rosybrown|royalblue|65|sandybrown|seagreen|87|seashell|244|164|96||peachpuff||185|||peru|papayawhip|239|213|63|powderblue|purple|red|pink|203|plum|sienna|71|turquoise|64|thistle|tomato|99|violet|whitesmoke|yellow|yellowgreen|violetred|wheat|white|slateblue|106|90|82|silver|skyblue|slategray|70|tan|teal|snow|springgreen|steelblue|mediumvioletred|199|limegreen|104|mediumspringgreen|mediumturquoise|mistyrose|lightyellow|lightsteelblue|midnightblue|lime|mintcream|123|102|mediumblue|linen|maroon|mediumaquamarine|magenta|mediumseagreen|||113||||mediumslateblue|mediumorchid|186|mediumpurple|moccasin|214|palegoldenrod|orchid|orange|orangered|232|175|palevioletred|paleturquoise|palegreen|251|119|navy|oldlace|253|181|136|navajowhite|142|olivedrab|olive'.split('|'), 0, {}));
                var sColor = color.toLowerCase();
                if (sColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i = 1; i < 4; i += 1) sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        sColor = sColorNew;
                    }
                    var sColorChange = [];
                    for (var i = 1; i < 7; i += 2) sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    return "rgb(" + sColorChange[0] + "," + sColorChange[1] + "," + sColorChange[2] + ")";
                } else if (sColor.indexOf("rgb") >= 0) {
                    if (sColor.indexOf("%") >= 0) {
                        var arrRgb = sColor.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                        return "rgb(" + parseInt(arrRgb[0] / 100 * 255) + "," + parseInt(arrRgb[1] / 100 * 255) + "," + parseInt(arrRgb[2] / 100 * 255) + ")";
                    } else {
                        return sColor;
                    }
                } else {
                    var rgbObj = EN_COLOR[sColor];
                    if (!rgbObj) return null;
                    return "rgb(" + rgbObj.r + "," + rgbObj.g + "," + rgbObj.b + ")";
                }
            };
            var dimColor = function (color, opacity) {
                var opa = opacity || 0.5;
                if (color.indexOf("rgba") >= 0) return color.substr(0, color.lastIndexOf(",")) + "," + parseFloat(color.substr(color.lastIndexOf(",") + 1, color.lastIndexOf(")") - 1)) * opa + ")";
                var arrRgb = toRGB(color).replace("rgb(", "").replace(")", "").split(",");
                return "rgba(" + arrRgb[0] + "," + arrRgb[1] + "," + arrRgb[2] + "," + opa + ")";
            };
            var darkColor = function (color, oft) {
                oft = oft || 0.5;
                var arrRgb = toRGB(color).replace("rgb(", "").replace(")", "").split(",");
                return "rgb(" + parseInt(arrRgb[0] * oft) + "," + parseInt(arrRgb[1] * oft) + "," + parseInt(arrRgb[2] * oft) + ")";
            };
            var isIE = function () {
                var userAgent = navigator.userAgent;
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
                var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
                var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
                if (isIE) {
                    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                    reIE.test(userAgent);
                    var fIEVersion = parseInt(RegExp["$1"]);
                    if (fIEVersion === 7) return 7;
                    else if (fIEVersion === 8) return 8;
                    else if (fIEVersion === 9) return 9;
                    else if (fIEVersion === 10) return 10;
                    else return 0;
                }
                if (isEdge) return "edge";
                if (isIE11) return 11;
                return false;
            };
            var isFire = function () {
                return navigator.userAgent.indexOf("Firefox") > -1;
            };
            var lzyPopup = function (cfg) {
                var _this = this;
                this.popupObj = null;
                this.bgObj = null;
                this.cfg = null;
                this.fullTemp = {full: false};
                this.bgObj = $("<div class='lzy_custom_bg'></div>").appendTo("body");
                this.popupObj = $("<div class='lzy_custom_popup'><div class='lzy_popup_nav'><div class='lzy_nav_icon'>!</div>" +
                    "<div class='lzy_nav_title'>消息</div><div class='lzy_nav_close'>×</div><div class='lzy_nav_full lzy_nav_full_normal'><span>◻</span></div></div>" +
                    "<div class='lzy_popup_cont'></div><div class='lzy_popup_footer'></div></div>").appendTo("body").on("click", ".lzy_nav_close", function () {
                    _this.closePopup();
                });
                this.setStyle(cfg, true);
            };
            lzyPopup.prototype = {
                setStyle: function (cfg, status) {
                    cfg = cfg || {};
                    var isEmpty = function (val) {
                        return val === null || typeof(val) === "undefined";
                    };
                    if (status) {
                        this.cfg = {
                            width: cfg.width || 350,
                            height: cfg.height || 200,
                            border: cfg.border || '1px solid black',
                            borderRadius: isEmpty(cfg.borderRadius) ? 5 : cfg.borderRadius,
                            isShowIcon: isEmpty(cfg.isShowIcon) ? true : cfg.isShowIcon,
                            icon: cfg.icon || null,
                            allowedFullscreen: cfg.allowedFullscreen,
                            allowedKeyboard: isEmpty(cfg.allowedKeyboard) ? true : cfg.allowedKeyboard,
                            content: cfg.content || null,
                            title: cfg.title || null,
                            buttonAlign: cfg.buttonAlign || 'right',
                            themeColor: cfg.themeColor || "#358aff",
                            isShowShadow: isEmpty(cfg.isShowShadow) ? true : cfg.isShowShadow,
                            shadowSize: isEmpty(cfg.shadowSize) ? 10 : cfg.shadowSize,
                            isShowBg: cfg.isShowBg,
                            allowedMove: cfg.allowedMove,
                            centerOrFollow: (cfg.centerOrFollow || 'center').toLowerCase(),
                            targetSelector: cfg.targetSelector || 'body',
                            followPosition: (cfg.followPosition || 'right bottom').toLowerCase(),
                            followOffset: cfg.followOffset || 10
                        };
                    } else {
                        this.cfg = {
                            width: cfg.width || this.cfg.width,
                            height: cfg.height || this.cfg.height,
                            border: cfg.border || this.cfg.border,
                            borderRadius: !isEmpty(cfg.borderRadius) ? cfg.borderRadius : this.cfg.borderRadius,
                            isShowIcon: !isEmpty(cfg.isShowIcon) ? cfg.isShowIcon : this.cfg.isShowIcon,
                            icon: cfg.icon || this.cfg.icon,
                            allowedFullscreen: !isEmpty(cfg.allowedFullscreen) ? cfg.allowedFullscreen : this.cfg.allowedFullscreen,
                            allowedKeyboard: !isEmpty(cfg.allowedKeyboard) ? cfg.allowedKeyboard : this.cfg.allowedKeyboard,
                            content: cfg.content || this.cfg.content,
                            title: cfg.title || this.cfg.title,
                            buttonAlign: cfg.buttonAlign || this.cfg.buttonAlign,
                            themeColor: cfg.themeColor || this.cfg.themeColor,
                            isShowShadow: !isEmpty(cfg.isShowShadow) ? cfg.isShowShadow : this.cfg.isShowShadow,
                            shadowSize: !isEmpty(cfg.shadowSize) ? cfg.shadowSize : this.cfg.shadowSize,
                            isShowBg: !isEmpty(cfg.isShowBg) ? cfg.isShowBg : this.cfg.isShowBg,
                            allowedMove: !isEmpty(cfg.allowedMove) ? cfg.allowedMove : this.cfg.allowedMove,
                            centerOrFollow: (cfg.centerOrFollow || this.cfg.centerOrFollow).toLowerCase(),
                            targetSelector: cfg.targetSelector || this.cfg.targetSelector,
                            followPosition: (cfg.followPosition || this.cfg.followPosition).toLowerCase(),
                            followOffset: cfg.followOffset || this.cfg.followOffset
                        };
                    }

                    var _this = this;
                    this.popupObj.css({
                        'width': this.cfg.width,
                        'height': this.cfg.height,
                        'margin-left': -Math.floor(this.cfg.width / 2) + "px",
                        'margin-top': -Math.floor(this.cfg.height / 2) + "px",
                        'border': this.cfg.border,
                        'border-radius': this.cfg.borderRadius
                    }).find(".lzy_popup_footer").css({
                        'text-align': cfg.buttonAlign
                    });

                    this.popupObj.css({'border-color': this.cfg.themeColor});
                    this.popupObj.find(".lzy_popup_nav").css({
                        'border-bottom-color': this.cfg.themeColor,
                        'background-color': dimColor(this.cfg.themeColor, .15)
                    });
                    this.popupObj.find(".lzy_nav_icon").css({
                        'border-color': this.cfg.themeColor,
                        'color': this.cfg.themeColor
                    });
                    this.popupObj.find(".lzy_nav_close").css({'color': this.cfg.themeColor});
                    this.popupObj.find(".lzy_nav_full").css({'color': this.cfg.themeColor});

                    this.bgObj.css('background-color', dimColor(this.cfg.themeColor, .1));
                    if (this.cfg.isShowShadow) this.popupObj.css({'box-shadow': "0 0 " + this.cfg.shadowSize.toString().replace("px", "") + "px " + this.cfg.themeColor});
                    if (this.cfg.isShowIcon) {
                        if (this.cfg.icon) {
                            this.popupObj.find(".lzy_nav_icon").css({
                                'background-image': 'url(' + this.cfg.icon + ')',
                                'border-radius': 0,
                                'border': 'none'
                            }).html("");
                        }
                    } else {
                        this.popupObj.find(".lzy_nav_icon").hide();
                    }
                    if (this.cfg.allowedFullscreen) {
                        this.popupObj.find(".lzy_nav_full").show().on("click", function () {
                            if ($(this).hasClass("lzy_nav_full_normal")) {
                                $(this).addClass("lzy_nav_full_big").removeClass("lzy_nav_full_normal").find("span").html("❐");
                                _this.fullTemp = {
                                    top: _this.popupObj.css("top"),
                                    left: _this.popupObj.css("left"),
                                    marginTop: _this.popupObj.css("margin-top"),
                                    marginLeft: _this.popupObj.css("margin-left"),
                                    full: true
                                };
                                _this.popupObj.animate({
                                    'top': 1,
                                    'left': 1,
                                    "margin-top": 0,
                                    "margin-left": 0,
                                    'width': window.innerWidth - _this.popupObj.css("border-left-width").replace("px", "") * 2 - 2,
                                    'height': window.innerHeight - _this.popupObj.css("border-left-width").replace("px", "") * 2 - 2
                                }, "fast");
                            } else {
                                _this.fullTemp.full = false;
                                $(this).addClass("lzy_nav_full_normal").removeClass("lzy_nav_full_big").find("span").html("◻");
                                _this.popupObj.animate({
                                    'top': _this.fullTemp.top,
                                    'left': _this.fullTemp.left,
                                    "margin-top": _this.fullTemp.marginTop,
                                    "margin-left": _this.fullTemp.marginLeft,
                                    'width': _this.cfg.width,
                                    'height': _this.cfg.height
                                }, "fast");
                            }
                        });
                    }

                    if (this.cfg.allowedKeyboard) {
                        $(document).on("keyup", function (event) {
                            var e = event || window.event || arguments.callee.caller.arguments[0];
                            if (e && e.keyCode === 27) _this.closePopup();
                        });
                    }
                    if (this.cfg.title) this.popupObj.find(".lzy_nav_title").html(this.cfg.title);
                    if (this.cfg.content) {
                        if ($(this.cfg.content).get(0)) this.popupObj.find(".lzy_popup_cont").append($(this.cfg.content));
                        else this.popupObj.find(".lzy_popup_cont").html("<span>" + this.cfg.content + "</span>");
                    }
                    if (this.cfg.allowedMove) {
                        var popupObj = this.popupObj;
                        var pW = this.cfg.centerOrFollow !== "center" ? 0 : popupObj.width() / 2;
                        var pH = this.cfg.centerOrFollow !== "center" ? 0 : popupObj.height() / 2;
                        popupObj.find(".lzy_popup_nav").addClass("lzy_popup_nav_move").mousedown(function (e) {
                            var isMove = true;
                            var div_x = e.pageX - popupObj.offset().left - pW;
                            var div_y = e.pageY - popupObj.offset().top - pH;
                            $(document).off("mousemove").mousemove(function (e) {
                                if (isMove) popupObj.css({'left': e.pageX - div_x, 'top': e.pageY - div_y});
                            }).mouseup(function () {
                                isMove = false;
                            });
                        });
                    }

                    if (isFire()) this.popupObj.find(".lzy_nav_close").css({'font-size': "25px"});
                    if (isIE()) {
                        this.popupObj.find(".lzy_nav_title").css('line-height', "33px");
                        this.popupObj.find(".lzy_nav_full>span").css('font-size', "19px");
                        this.popupObj.find(".lzy_nav_close").css({
                            'font-size': "25px",
                            'line-height': "20px"
                        });
                    }
                },
                showPopup: function (content, title) {
                    if (this.cfg.isShowBg) this.bgObj.show();
                    if (this.cfg.targetSelector) {
                        var rect = document.querySelector(this.cfg.targetSelector).getBoundingClientRect();
                        var _this = this, fPos = this.cfg.followPosition;
                        var setFull = function () {
                            _this.popupObj.css({
                                'top': 1,
                                'left': 1,
                                "margin-top": 0,
                                "margin-left": 0,
                                'width': window.innerWidth - _this.popupObj.css("border-left-width").replace("px", "") * 2 - 2,
                                'height': window.innerHeight - _this.popupObj.css("border-left-width").replace("px", "") * 2 - 2
                            });
                        };
                        if (this.cfg.centerOrFollow === 'follow') {
                            if (this.fullTemp.full) {
                                setFull();
                            } else {
                                var setCss = function (val1, val2) {
                                    _this.popupObj.css({'left': val1, 'top': val2});
                                };
                                this.popupObj.css({marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0});
                                if (fPos.indexOf('top') >= 0) setCss(rect.left, rect.top - this.popupObj.height() - this.cfg.followOffset);
                                if (fPos.indexOf('bottom') >= 0) setCss(rect.left, rect.bottom + this.cfg.followOffset);
                                if (fPos.indexOf('left') >= 0) setCss(rect.left - this.popupObj.width() - this.cfg.followOffset, rect.top);
                                if (fPos.indexOf('right') >= 0) setCss(rect.right + this.cfg.followOffset, rect.top);
                                if (fPos.indexOf('top') >= 0 && fPos.indexOf('right') >= 0) setCss(rect.right + this.cfg.followOffset, rect.top - this.popupObj.height() - this.cfg.followOffset);
                                if (fPos.indexOf('top') >= 0 && fPos.indexOf('left') >= 0) setCss(rect.left - this.popupObj.width() - this.cfg.followOffset, rect.top - this.popupObj.height() - this.cfg.followOffset);
                                if (fPos.indexOf('bottom') >= 0 && fPos.indexOf('left') >= 0) setCss(rect.left - this.popupObj.width() - this.cfg.followOffset, rect.bottom + this.cfg.followOffset);
                                if (fPos.indexOf('bottom') >= 0 && fPos.indexOf('right') >= 0) setCss(rect.right + this.cfg.followOffset, rect.bottom + this.cfg.followOffset);
                            }
                        } else {
                            if (this.fullTemp.full) {
                                setFull();
                            } else {
                                this.popupObj.css({
                                    'top': rect.top + rect.height / 2,
                                    'left': rect.left + rect.width / 2
                                });
                            }
                        }
                    }
                    this.popupObj.find(".lzy_popup_nav").css({
                        'border-top-right-radius': this.cfg.borderRadius,
                        'border-top-left-radius': this.cfg.borderRadius
                    });
                    this.popupObj.find(".lzy_popup_footer").css("text-align", this.cfg.buttonAlign);
                    this.popupObj.find(".lzy_footer_btn").css({
                        'border-color': this.cfg.themeColor,
                        'background-color': this.cfg.themeColor
                    });
                    this.popupObj.find(".lzy_footer_btn_close").css({
                        'color': this.cfg.themeColor,
                        'border-color': this.cfg.themeColor,
                        'background-color': 'white'
                    });

                    if (title) this.popupObj.find(".lzy_nav_title").html(title);
                    if (content && content !== "") {
                        if ($(content).get(0)) this.popupObj.find(".lzy_popup_cont").append($(content));
                        else this.popupObj.find(".lzy_popup_cont").html("<span>" + content + "</span>");
                    }
                    this.popupObj.removeClass("lzy_popup_close").show().addClass("lzy_popup_show");
                },
                closePopup: function () {
                    var _this = this;
                    _this.popupObj.removeClass("lzy_popup_show").addClass("lzy_popup_close");
                    setTimeout(function () {
                        _this.popupObj.hide();
                        _this.bgObj.hide();
                    }, 90);
                },
                addButton: function (btnName, callback) {
                    var _this = this, tempColor;
                    var curBtn = $("<div class='lzy_footer_btn'>" + btnName + "</div>").css({borderRadius: this.cfg.borderRadius}).appendTo(this.popupObj.find(".lzy_popup_footer"))
                        .on("click", function () {
                            if (callback) callback.call(_this);
                            if (btnName && (btnName.indexOf("关") >= 0 || btnName.indexOf("消") >= 0)) _this.closePopup();
                        })
                        .hover(function () {
                            tempColor = $(this).css("background-color");
                            $(this).css('background-color', curBtn.hasClass("lzy_footer_btn_close") ? dimColor(_this.cfg.themeColor, .1) : darkColor(_this.cfg.themeColor, .92));
                        }, function () {
                            $(this).css('background-color', tempColor);
                        });
                    if (isIE()) curBtn.css({'line-height': "25px"});
                    if (btnName && (btnName.indexOf("关") >= 0 || btnName.indexOf("消") >= 0)) curBtn.addClass("lzy_footer_btn_close");
                    var size = 0, btns = _this.popupObj.find(".lzy_popup_footer").find(".lzy_footer_btn");
                    for (var i = 0; i < btns.length; i++) size += btns.eq(i).outerWidth() + parseFloat(btns.eq(i).css('margin-right').replace("px", "")) + parseFloat(btns.eq(i).css('margin-left').replace("px", ""));
                    if (size > _this.popupObj.width()) _this.setStyle({width: size + 20});
                    return this;
                }
            };
            return new lzyPopup(cfg);
        }
    });

})(jQuery, window, document);