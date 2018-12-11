using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication2
{
    /// <summary>
    /// insert 的摘要说明
    /// </summary>
    public class insert : IHttpHandler
    {
        //数据库连接字符串
        string connstring = ConfigurationManager.ConnectionStrings["connstring"].ToString();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
            string name = context.Request["name"];
            string price = context.Request["price"];
            string author = context.Request["auth"];

            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "insert into books(book_name,book_price,book_auth) values(N'" + name + "'," + price + ",N'" + author + "')";
            if (cmd.ExecuteNonQuery() != 0)
            {
                context.Response.Write("1");
            }else
            {
                context.Response.Write("0");
            }
            conn.Close();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}