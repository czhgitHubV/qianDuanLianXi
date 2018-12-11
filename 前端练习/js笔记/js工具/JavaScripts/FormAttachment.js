;
(function ($, window, document, undefined) {
    var pluginName = "Attachment",
    defaults = {
        ajaxsrc: _PORTALROOT_GLOBAL + "/Ajax/GetBasicData.ashx?method=GetFileInfo", //默认取数Url
        FileUploadHandler: _PORTALROOT_GLOBAL + "/Ajax/FileUploadHandler.ashx",//上传地址
        SheetAttachmentHandler: _PORTALROOT_GLOBAL + "/Ajax/SheetAttachmentHandler.ashx",//附件修改地址
        //增加删除文件事件
        OnChange: "",
        //文件数
        Files: 0,
        //新添加的
        AddAttachments: {},
        UploadAttachmentsIds: [],
        //删除数据库的
        RomveAttachments: [],
        //隐藏了可配置属性，设置固定多选
        Multiple: true,
        Editable: false,
        //是否添加完成后保存
        Saveable: false
    };
    function Attachment(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._feild = $(element).data("field");
        this._value = $(element).data("value");
        this._schemaCode = $(element).data("schemacode");
        this.OnChange = $(element).data("onchange");
        this.FileExtensions = $(element).data("fileextensions");
        this.MaxUploadSize = $(element).data("maxuploadsize");
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v0.0.1';
        this.init();
    }
    Attachment.prototype = {
        init: function () {
            var $element = $(this.element)
            this.render(this, $element);
            this.html5Render(this, $element);
        },
        GetValue: function () {
            var AttachmentIds = "";
            //如果是支持Html5的话，得判断是否已经上传完整，需要等待
            for (var key in this.settings.AddAttachments) {
                if (this.settings.AddAttachments[key].state == 1 && this.settings.AddAttachments[key].AttachmentId) {
                    AttachmentIds += this.settings.AddAttachments[key].AttachmentId + ";";
                }
            }

            var DelAttachmentIds = "";
            for (var i = 0; i < this.settings.RomveAttachments.length; ++i) {
                DelAttachmentIds += this.settings.RomveAttachments[i] + ";";
            }
            var result = {
                AttachmentIds: AttachmentIds,
                DelAttachmentIds: DelAttachmentIds
            };
            return result;
        },
        render: function (instance, $element) {
            //设置宽度
            $element.addClass("SheetAttachment");
            //添加附件展示列表和按钮
            this.UploadList = $("<table class='table table-striped'></table>").css("margin", 0).css("min-height", "0px");
            $element.append(this.UploadList);
            //根据ID获取附件
            $.ajax({
                url: instance.settings.ajaxsrc,
                type: "post",
                dataType: 'json',
                data: { Code: this._value, Feild: this._feild },
                success: function (data) {
                    if (data != null && typeof (data) != "undefined") {
                        //data = JSON.stringify(data);
                        for (var i = 0; i < data.length; i++) {
                            instance.createFileElement($(instance.element), data[i].ObjectID, data[i].FileName, data[i].FileSize, data[i].FilePath, data[i].ContentType);
                        }
                    }
                }
            });
        },
        // Html5渲染
        html5Render: function (instance, $element) {
            if (!instance.settings.Editable) return;
            // 是否多选
            instance.FileUpload = $("<input type='file' />").attr("data-attachment", true);
            if (instance.settings.Multiple) {
                instance.FileUpload.attr("multiple", "multiple");
                instance.FileUpload.attr("Name", this.NewGuid());
            }

            //上传地址
            if (instance._schemaCode == null || typeof (instance._schemaCode) == "undefined") {
                alert("SchemaCode不能为空，请联系管理员！");
                return;
            }
            instance.settings.FileUploadHandler += "?IsMobile=false &" + "SchemaCode=" + encodeURI(instance._schemaCode) + "&fileid=";

            instance.ActionPanel = $("<div>点击上传</div>")
            instance.ActionPanel.width("100%")
                .addClass("btn").addClass("btn-outline").addClass("btn-lg")
                .css("border", "1px dashed #ddd");
            $element.append(instance.ActionPanel);

            if (instance.FileExtensions) {
                instance.FileUpload.attr("accept", instance.FileExtensions);
            }

            //添加上传控件
            $element.append(instance.FileUpload);
            instance.FileUpload.hide();
            $(instance.ActionPanel).unbind("click.SheetAttachment").bind("click.SheetAttachment", instance, function (e) {
                $.extend(this, e.data);
                e.data.FileUpload.click();
            });

            instance.FileUpload.unbind("change.FileUpload").bind("change.FileUpload", instance, function (e) {
                e.data.AddFiles.apply(e.data, [e.data.getFiles(this.files)]);
                $(this).val("")
            });

            instance.BindDrag();
        },
        //绑定拖拽上传事件
        BindDrag: function () {
            $(this.ActionPanel).on({
                dragenter: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },
                dragleave: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            var that = this;
            this.ActionPanel[0].addEventListener("drop", function (e) {
                e.stopPropagation();
                e.preventDefault();//取消默认浏览器拖拽效果

                var files = that.getFiles(e.dataTransfer.files);
                that.AddFiles.apply(that, [files]);
            }, false);
        },
        getFiles: function (files) {
            var filesArr = [];
            for (var i = 0; i < files.length; i++) {
                filesArr.push(files[i]);
            }
            return filesArr;
        },
        createFileElement: function ($element, fileid, name, size, url, contentType) {
            var fileSizeStr = 0;
            if (size > 1024 * 1024)
                fileSizeStr = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            else
                fileSizeStr = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
            if (size == 0) {
                fileSizeStr = '文件大小未知';
            }
            var fileSize = $("<td data-filesize='" + fileid + "'><span data-filerate='" + fileid + "'>请稍候...</span> (" + fileSizeStr + ")</td>").addClass("text-info");
            var actionTd = $("<td data-action='" + fileid + "' class=\"printHidden col-sm-2\"></td>");

            var actionStr = $("<a href='javascript:void(0);' class='fa fa-minus'>" + "删除" + "</a>");
            if (this.settings.Editable) {
                actionStr.unbind("click.fileDeleteBtn").bind("click.fileDeleteBtn", this, function (e) {
                    if (confirm("是否确认删除")) {
                        e.data.RemoveFile.apply(e.data, [$(this).closest("tr").attr("id")]);
                    }
                });
            }
            else {
                actionStr.hide();
            }
            //标志是否能上传
            var flag = true;
            var fileName = name;
            var fileType = "";
            if (fileName.lastIndexOf(".") > 0) {
                fileName = name.substring(0, name.lastIndexOf("."));
                fileType = name.substring(name.lastIndexOf("."), name.length);
            }
            if (url == undefined) {
                if (this.FileExtensions) {
                    //文件格式校验
                    if (fileType != "") {
                        if (this.FileExtensions.indexOf(fileType) < 0) {
                            flag = false;
                        }
                    }
                    else {
                        flag = false;
                    }
                }
                if (!flag) {
                    fileSize = $("<td data-filesize='" + fileid + "'><span data-filerate='" + fileid + "' style='color:red;'>文件格式不对</span> (" + fileSizeStr + ")</td>").addClass("col-sm-4 text-info");
                }
                else {
                    //判断文件大小
                    var mbSize = Math.round(size * 100 / (1024 * 1024)) / 100;
                    if (size > 1024 * 1024 && mbSize > this.MaxUploadSize) {
                        flag = false;
                        fileSize = $("<td data-filesize='" + fileid + "'><span data-filerate='" + fileid + "'  style='color:red;'>超出限制文件上传的大小</span> (" + fileSizeStr + ")</td>").addClass("col-sm-4 text-info");
                    }
                }
            } else {
                //actionTd.append($("<a href='" + url + "' class='fa fa-download' target='_blank' UC=true>下载</a>"));
                //actionTd.append("&nbsp;&nbsp;");
                fileSize = $("<td data-filesize='" + fileid + "'>" + fileSizeStr + "</td>").addClass("col-sm-4 text-info");
            }
            var trRow = $("<tr></tr>").attr("id", fileid);

            if (contentType && contentType.toLowerCase().indexOf("image/") == 0) {
                var anchor = $("<a data-img-url='" + url + "' href='javascript:void(0)' class=''><div class='LongWord' style='-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;display: inline;'><i class='fa fa-download'></i>" + name + "</div></a>");
                trRow.append($("<td>").append(anchor));

                this.RenderImageAnchor(anchor, url);
            }
            else {
                trRow.append("<td ><a href='" + url + "'target='_blank' class='' UC=true><div class='LongWord' style='-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;display: inline;'><i class='fa fa-download'></i>" + name + "</div></a></td>");
            }

            if (this.settings.Editable) {
                trRow.append(fileSize.css("text-align", "right"));
            }
            trRow.append(actionTd.append(actionStr).css("text-align", "center"));
            this.UploadList.append(trRow);
            if (flag) {
                this.settings.Files++;
            }
            var divWidth = 150;
            if ($element.width() > 100)
                divWidth = $element.width() / 2;

            trRow.find(".LongWord").width(divWidth + "px");
            //计算文字的长度
            var temID = this.NewGuid();
            var wordWidth = $("<span>").attr("id", temID).text(name).appendTo("body").width();
            $("#" + temID).remove();
            if (divWidth < wordWidth) {
                trRow.find(".LongWord").attr("title", name).css("float", "left").after(fileType);
            }

            return flag;
        },
        ClearFiles: function () {
            $(this.Element).html("");
            this.settings.Files = 0;
        },
        //添加文件
        AddFiles: function (files) {
            if (!this.settings.Multiple) {
                this.ClearFiles();
            }
            // 改成列队上传模式
            if (files && files.length > 0) {
                var fileid = this.NewGuid();
                if (this.createFileElement($(this.element), fileid, files[0].name, files[0].size, null, files[0].type)) {
                    //需要添加的附件
                    this.settings.AddAttachments[fileid] = {
                        fileid: fileid,
                        file: files[0],
                        ContentType: files[0].type,
                        xhr: new XMLHttpRequest(),
                        state: 0//0:未上传完，1:已上传完,100:失败
                    };

                    files.splice(0, 1);
                    this.UploadFile(fileid, files);
                }
            }
        },
        //上传
        UploadFile: function (fileid, files) {
            if (this.settings.AddAttachments[fileid] == null && this.settings.AddAttachments[fileid].state != 0) return;

            var fd = new FormData();
            fd.append('fileToUpload', this.settings.AddAttachments[fileid].file);
            fd.append('MaxSize', this.MaxUploadSize * 1024);

            var xhr = this.settings.AddAttachments[fileid].xhr;
            xhr.context = this;
            xhr.files = files;
            xhr.upload.fileid = fileid;
            xhr.abort.fileid = fileid;

            xhr.upload.addEventListener('progress', this.UploadProgress, false);
            xhr.addEventListener('load', this.UploadComplete, false);
            xhr.addEventListener('error', this.UploadFailed, false);
            xhr.addEventListener('abort', this.UploadCanceled, false);

            xhr.open('POST', this.settings.FileUploadHandler + fileid);
            xhr.send(fd);
        },
        UploadProgress: function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                /*
                 * 在上传大文件的时候，在后台处理的时间会比较久
                 * 先只将上传进度显示为99%，在UploadComplete里改为100%
                 */
                if (percentComplete >= 100) percentComplete = 99;
                $("span[data-filerate='" + evt.currentTarget.fileid + "']").html(percentComplete + "%");
            }
            else {
                this.context.settings.AddAttachments[evt.currentTarget.fileid].state = 100;
                $("span[data-filerate='" + evt.currentTarget.fileid + "']").css("color", "red").html("上传出错");
            }
        },
        UploadComplete: function (evt) {
            if (evt.target.status == 200) {
                var resultObj = eval('(' + evt.target.responseText + ')');
                var fileid = resultObj.FileId;
                this.context.settings.AddAttachments[fileid].state = 1;
                this.context.settings.AddAttachments[fileid].AttachmentId = resultObj.AttachmentId;
                $("td[data-action='" + fileid + "']").prepend("&nbsp;&nbsp;");
                //if (this.context.IsMobile) {
                //显示图片
                if (this.context.settings.AddAttachments[fileid].ContentType && this.context.settings.AddAttachments[fileid].ContentType.toLowerCase().indexOf("image/") == 0) {
                    var anchor = $("<a>").attr("data-img-url", resultObj.Url).attr("href", "javascript:void(0)").addClass("fa").addClass("fa-download").html($("#" + fileid + ">td:first").html());
                    $("#" + fileid + ">td:first").empty().append(anchor);

                    this.context.RenderImageAnchor(anchor, resultObj.Url);
                }
                else {
                    $("#" + fileid + ">td:first").html($("<a href='" + resultObj.Url + "' class='fa fa-download' target='_blank' UC=true>" + $("#" + fileid + ">td:first").html() + "</a>"));
                }
                //}
                //else {
                //    $("td[data-action='" + fileid + "']").prepend($("<a href='" + resultObj.Url + "' class='fa fa-download' target='_blank' UC=true>下载</a>"));
                //}

                /*
                 *android对upload的progress事件支持不完善
                 *在Complete事件里将上传进度赋值为100%
                 */
                $("span[data-filerate='" + fileid + "']").html("100%");
                this.context._OnChange();
            }
            else {
                this.context.UploadFailed(evt);
            }
            // 单个附件上传完成，继续下一个
            this.context.AddFiles(this.files);
        },

        UploadFailed: function (evt) {
            this.context.AddAttachments[evt.currentTarget.fileid].state = 100;
            $("span[data-filerate='" + evt.currentTarget.fileid + "']").html("上传失败");
        },

        UploadCanceled: function () {
        },
        //链接点击时打开图片
        _OpenImage: function (e) {
            var thisAnchor = $(e.target);
            if (!thisAnchor.is("[data-img-url]")) {
                thisAnchor = $(thisAnchor).closest("[data-img-url]");
            }
            var panelId = $(thisAnchor).attr("img-panel-id");


            if (!panelId) {
                var getStr = function (len) {
                    if (len > 12) len = 12;
                    return Math.floor(Math.random() * 100000000000000).toString("16").substring(0, len);
                };
                panelId = (getStr(8) + "-" + getStr(4) + "-4" + getStr(3) + "-" + getStr(4) + "-" + getStr(12)).trim();
                $(thisAnchor).attr("img-panel-id", panelId);

                var _panel = $('<div class="modal fade" id="' + panelId + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>');
                var modalDialog = $('<div class="modal-dialog modal-lg"></div>');
                var modalContent = $('<div class="modal-content"></div>');
                var modalHeader = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">图片查看</h4></div>');
                var ModalBody = $('<div class="modal-body"></div>');

                _panel.append(modalDialog);
                modalDialog.append(modalContent);
                modalContent.append(modalHeader);
                modalContent.append(ModalBody);

                var _imgWrapper = $("<div>").addClass("img-wrapper");
                var img = document.createElement("img");


                img.style.width = "100%";
                _imgWrapper.append(img);
                ModalBody.append(_imgWrapper);
                _panel.modal("show");
                $(img).viewer({
                    navbar: 0
                });
                //img.onload = function () {
                //    var thisImg = $(arguments[0].target);
                //    var imgWidth = thisImg.width();
                //    //var imgheight = thisImg.height();
                //    var panelWidth = $(thisImg).closest(".modal-dialog").width();
                //    //var panelHeight = $("#content").height();

                //    //默认缩放
                //    var zoomMin = 1;
                //    //如果图片过宽，将图片默认显示为适应屏幕宽度
                //    if (imgWidth > panelWidth) {
                //        zoomMin = panelWidth / imgWidth;
                //    }

                //    setTimeout(function () {
                //        imgScroll = new IScroll(_imgWrapper.get(0), {
                //            zoom: true,
                //            zoomMin: zoomMin,
                //            zoomMax: 4,
                //            scrollX: true,
                //            scrollY: true,
                //            wheelAction: "zoom"
                //        });
                //        imgScroll.zoom(zoomMin);
                //    }, 600)
                //}

                img.src = $(thisAnchor).attr("data-img-url");
            }
            else {
                $('#' + panelId).modal("show");
            }
        },
        //渲染图片链接
        RenderImageAnchor: function (anchor, url) {
            anchor.unbind("click").bind("click", this._OpenImage);
        },
        RemoveFile: function (fileID) {
            fileID = $.trim(fileID);
            $("#" + fileID).remove();
            this.settings.Files--;
            if (this.settings.AddAttachments[fileID]) {
                this.settings.AddAttachments[fileID].xhr.abort();
                delete this.settings.AddAttachments[fileID];
            }
            else {
                this.settings.RomveAttachments.push(fileID);
            }
            this._OnChange();
        },
        //值改变事件
        _OnChange: function (e) {

            if (this.settings.OnChange) {
                //执行绑定事件
                this.RunScript(this.Element, this.settings.OnChange);
            }
            if (this.settings.Saveable) {
                //保存
                this._Save();
            }
        },
        _Save: function () {
            var saveurl = this.settings.SheetAttachmentHandler + "?IsMobile=false &" + "SchemaCode=" + encodeURI(this._schemaCode)
                + "&DataField=" + this._feild + "&BizObjectID=" + this._value;
            var that = this;
            //根据ID获取附件
            $.ajax({
                url: saveurl,
                type: "post",
                dataType: 'json',
                data: { AttachmentIds: this.GetValue().AttachmentIds, DelAttachmentIds: this.GetValue().DelAttachmentIds },
                success: function (data) {
                    //that.settings.DelAttachmentIds = [];
                }
            });
        },
        NewGuid: function () {
            var getStr = function (len) {
                if (len > 12) len = 12;
                return Math.floor(Math.random() * 100000000000000).toString("16").substring(0, len);
            };
            return (getStr(8) + "-" + getStr(4) + "-4" + getStr(3) + "-" + getStr(4) + "-" + getStr(12)).trim();
        }
    };
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Attachment(this, options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);