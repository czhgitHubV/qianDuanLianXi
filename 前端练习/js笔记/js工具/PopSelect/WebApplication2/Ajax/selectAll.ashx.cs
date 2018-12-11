using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication2.Ajax
{
    /// <summary>
    /// selectAll 的摘要说明
    /// </summary>
    public class selectAll : IHttpHandler
    {
        string constring = ConfigurationManager.ConnectionStrings["connstring"].ToString();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string id = context.Request["WorkOrder"];
            SqlConnection con = new SqlConnection(constring);
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            string sql= "select * from books";
            if (!string.IsNullOrEmpty(id) && id != "")
            {
                sql = sql + " where book_id=" + id;;
            }
            cmd.CommandText = sql;
            SqlDataReader dr = cmd.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Load(dr);
            context.Response.Write(JsonConvert.SerializeObject(dt));
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