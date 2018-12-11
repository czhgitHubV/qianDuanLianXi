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
    /// delete 的摘要说明
    /// </summary>
    public class delete : IHttpHandler
    {
        string connstring = ConfigurationManager.ConnectionStrings["connstring"].ToString();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string id=context.Request["id"];
            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "delete from books where book_id=" + id;
            if (cmd.ExecuteNonQuery() != 0)
            {
                context.Response.Write("1");
            }
            else {
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