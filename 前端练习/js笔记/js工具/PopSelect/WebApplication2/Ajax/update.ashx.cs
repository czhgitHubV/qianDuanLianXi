using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication2.Ajax
{
    /// <summary>
    /// update 的摘要说明
    /// </summary>
    public class update : IHttpHandler
    {
        string connstring = ConfigurationManager.ConnectionStrings["connstring"].ToString();
        public void ProcessRequest(HttpContext context)
        {
            string id = context.Request["id"];
            string name = context.Request["name"];
            string price = context.Request["price"];
            string auth = context.Request["auth"];

            context.Response.ContentType = "text/plain";
            SqlConnection con = new SqlConnection(connstring);
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = "update books set book_name=N'" + name + "',book_price=" + price + ",book_auth=N'" + auth + "' where book_id=" + id;
            if (cmd.ExecuteNonQuery() != 0) {
                context.Response.Write("1");
            }else
            {
                context.Response.Write("0");
            }
            con.Close();
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