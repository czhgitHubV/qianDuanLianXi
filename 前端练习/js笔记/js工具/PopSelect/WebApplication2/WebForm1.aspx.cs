using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Windows.Forms;
using System.Diagnostics;

namespace WebApplication2
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        //数据库连接字符串
        string connstring = System.Configuration.ConfigurationManager.ConnectionStrings["connstring"].ToString();

        public void Page_Load(object sender, EventArgs e)
        {

        }

        public void btnInsert_Click(object sender, EventArgs e)
        {
            string Name = tbxUpdateName.Text;
            string Price = tbxUpdatePrice.Text;
            string Author = tbxUpdateAuthor.Text;

            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "insert into dbo.books(book_name,book_price,book_auth) values(N'"+ Name + "',"+ Price + ",N'"+ Author + "')";

            if (cmd.ExecuteNonQuery() != 0)
            {
                MessageBox.Show("数据添加成功!\n书名："+ Name+"\n价格:"+Price+"\n作者:"+Author);
                btnSelectAll_Click(sender, e);

            }
            else
            {
                MessageBox.Show("添加数据失败!");
            }

            conn.Close();

        }

        public void btnSelectAll_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "select * from dbo.books";
            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                GridView1.DataSource = dr; //设置数据源
                GridView1.DataBind();//进行数据绑定
            }
            else
            {
                MessageBox.Show("表中没有数据!");
            }
            conn.Close();
        }

        public void btnDelete_Click(object sender, EventArgs e)
        {
            string Id = tbxDeleteID.Text;
            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "delete from books where book_id in("+Id+")";
            if (cmd.ExecuteNonQuery()!=0)
            {
                MessageBox.Show("删除"+Id+"成功!");
                btnSelectAll_Click(sender,e);
            }
            else
            {
                MessageBox.Show("删除失败!");
            }
            conn.Close();
        }

        public void btnEdit_Click(object sender, EventArgs e)
        {
            string ID = tbxEditId.Text;
            string Name = tbxEditName.Text;
            string Price = tbxEditPrice.Text;
            string Author = tbxEditAuth.Text;

            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "update books set book_name=N'"+ Name +"',book_price="+Price+",book_auth=N'"+ Author + "' where book_id="+ID;
            if (cmd.ExecuteNonQuery() != 0)
            {
                MessageBox.Show("更新"+ID+"成功!");
                btnSelectAll_Click(sender, e);

            }
            else
            {
                MessageBox.Show("更新失败!");
            }
            conn.Close();

        }

        public void btnSelectOne_Click(object sender, EventArgs e)
        {
            string ID = tbxSelectID.Text;
            SqlConnection conn = new SqlConnection(connstring);
            conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "select * from books where book_id="+ID;
            SqlDataReader dr= cmd.ExecuteReader();
            if (dr.HasRows)
            {
                GridView1.DataSource = dr;
                GridView1.DataBind();
            }
            else
            {
                MessageBox.Show("表中没有ID="+ID+"的数据!");
            }
            while (dr.Read())
            {
                for(int i=0;i<dr.FieldCount;i++)
                {
                    string name = dr["book_name"].ToString();
                    Debug.Write(name);
                }
            }
            conn.Close();

        }
    }
}