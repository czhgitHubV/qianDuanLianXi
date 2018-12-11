<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="WebApplication2.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link href="JavaScript/bootstrap-table.css" rel="stylesheet" />
    <link href="JavaScript/themes.min.css" rel="stylesheet" />
    <link href="JavaScript/bootstrap.min.css" rel="stylesheet" />
    <link href="JavaScript/pixel-admin.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="JavaScript/viewer.min.css"/>

    <script src="JavaScript/jquery-1.10.2.min.js"></script>
    <script src="JavaScript/bootstrap.min.js"></script>
    <script src="JavaScript/bootstrap-table.js"></script>
    <script src="JavaScript/bootstrap-table-zh-CN.js"></script>
    <script src="JavaScript/pixel-admin.min.js"></script>
    <script src="JavaScript/PopSelect.js"></script>

    <script>
        window.onload = function () {
            var el = $("#inpId");
            initPopselect(el);
        }
        function Insert() {
            var name = $('#iptInsertName').val();
            var price = $('#iptInsertPrice').val();
            var author = $('#iptInsertAuthor').val();
            $.ajax({
                type: "post",
                url: "/Ajax/insert.ashx",
                data: {
                    name: name,
                    price: price,
                    auth: author
                },
                success: function (data, textStatus) {
                    alert(data);
                    console.log(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("请求在连接过程中出现错误..\n" + errorThrown);
                }
            });
        }

        function Delete(){
            var ID = $("#iptDeleteId").val();
            $.ajax({
                type: "post",
                url: "/Ajax/delete.ashx",
                data: {
                    id: ID
                },
                success: function (data) {
                    console.log(data);
                    alert(data);
                },
                error: function (msg) {
                    alert(msg);
                }
            });
        }

        function Edit() {
            var id = $("#iptEditId").val();
            var name = $("#iptEditName").val();
            var price = $("#iptEditPrice").val();
            var auth = $("#iptEditAuthor").val();

            $.ajax({
                type: "post",
                url: "/Ajax/update.ashx",
                data: {
                    id: id,
                    name: name,
                    price: price,
                    auth: auth
                },
                success: function (data) {
                    console.log(data);
                    alert(data);
                },
                error: function (err) {
                    alert(err);
                }
            });

        }

        function Select() {
            $.ajax({
                type: "post",
                dataType:"json",
                url: "/Ajax/selectAll.ashx",
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    alert(err);
                }

            });
        }
        function initPopselect(e) {
            console.log(e);
            e.PopSelect({
                ajaxsrc: "/Ajax/selectAll.ashx",
                Columns: [
                { checkbox: true, width: "40px"},
                { field: 'book_id', title: 'ID', sortable: true, width: "80px" },
                { field: 'book_name', title: '书名', sortable: true, width: "20px" },
                { field: 'book_price', title: '价格', sortable: true, width: "80px" },
                { field: 'book_auth', title: '作者', width: "140px" }
                ],
                Multiple: true,
                DisplayLink: true,
                AutoRefresh: true,
                DisplaySearch: false,
                PopupWidth: "800px",
                PopupHeight: "400px",
                ToolBar: "<div class='form-inline'><div class='form-group'><input name='WorkOrder' class='form-control' type='text' isclear='false' autofocus='autofocus' placeholder='工单号'></div>" +
                     "<a herf='void(0);' class='btn btn-default btn_search'>查找</a></div>",
                CheckedParams: function () {
                    var id = $("#inpId").val();
                    this.setParamer({ WorkOrder: id });
                    return true;
                },
                CallBack: function (data) {
                    if (data != null) {
                        console.log(data);
                        return true;
                    }
                }
            })
        }

    </script>
</head>
<body>
    <input id="inpId" type="text" placeholder="输入ID" onclick="fun();" />
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="btnSelectAll" runat="server" Text="点击查看所有数据" OnClick="btnSelectAll_Click" />
        </div>
        <br />
        <div>
            <asp:GridView ID="GridView1" runat="server"></asp:GridView>
        </div>
        <div>
            <h3>增加</h3>
            <asp:Label ID="Label4" runat="server" Text="Name："></asp:Label>
            <asp:TextBox ID="tbxUpdateName" runat="server"></asp:TextBox>
            &nbsp;<asp:Label ID="Label5" runat="server" Text="Price："></asp:Label>
            <asp:TextBox ID="tbxUpdatePrice" runat="server"></asp:TextBox>
            &nbsp;<asp:Label ID="Label3" runat="server" Text="Author："></asp:Label>
            <asp:TextBox ID="tbxUpdateAuthor" runat="server"></asp:TextBox>
            &nbsp;<asp:Button ID="btnInsert" runat="server" Text="确认添加" OnClick="btnInsert_Click" />
        </div>
        <div>
            <h3>删除</h3>
            <asp:Label ID="Label6" runat="server" Text="ID："></asp:Label>
            <asp:TextBox ID="tbxDeleteID" runat="server"></asp:TextBox>
            &nbsp;<asp:Button ID="btnDelete" runat="server" Text="确认删除" OnClick="btnDelete_Click" />
        </div>
        <div>
            <h3>编辑</h3>
            <asp:Label ID="Label10" runat="server" Text="ID："></asp:Label>
            <asp:TextBox ID="tbxEditId" runat="server"></asp:TextBox>
            &nbsp;<asp:Label ID="Label7" runat="server" Text="Name："></asp:Label>
            <asp:TextBox ID="tbxEditName" runat="server"></asp:TextBox>
            &nbsp;<asp:Label ID="Label8" runat="server" Text="Price："></asp:Label>
            <asp:TextBox ID="tbxEditPrice" runat="server"></asp:TextBox>
            &nbsp;<asp:Label ID="Label9" runat="server" Text="Author："></asp:Label>
            <asp:TextBox ID="tbxEditAuth" runat="server"></asp:TextBox>
            &nbsp;<asp:Button ID="btnEdit" runat="server" Text="确认修改" OnClick="btnEdit_Click" />
        </div>
        <div>
            <h3>查询</h3>
            <asp:Label ID="Label11" runat="server" Text="ID："></asp:Label>
            <asp:TextBox ID="tbxSelectID" runat="server"></asp:TextBox>
            &nbsp;<asp:Button ID="btnSelectOne" runat="server" Text="确认查询" OnClick="btnSelectOne_Click" />
        </div>
    </form>
    <hr />
    <h5>增加</h5>
    <label>Name：</label><input id="iptInsertName" />
    <label>Price：</label><input id="iptInsertPrice" />
    <label>Author：</label><input id="iptInsertAuthor" />
    <button id="btnInsertAjax" onclick="Insert()">确认添加</button>

    <h5>删除</h5>
    <label>ID：</label><input id="iptDeleteId" />
    <button id="btnDeleteAjax" onclick="Delete()">确认删除</button>

    <h5>修改</h5>
    <label>ID：</label><input id="iptEditId" />
    <label>Name：</label><input id="iptEditName" />
    <label>Price：</label><input id="iptEditPrice" />
    <label>Author：</label><input id="iptEditAuthor" />
    <button id="btnEditAjax" onclick="Edit()">确认修改</button>

    <h5>查询</h5>
    <label>ID：</label><input id="iptSelectId" />
    <button id="btnSelectAjax" onclick="Select()">确认查询</button>
</body>
</html>
