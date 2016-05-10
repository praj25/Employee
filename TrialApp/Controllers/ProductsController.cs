using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TrialApp.Models;

namespace TrialApp.Controllers
{
    public class ProductsController : ApiController
    {
        Product[] products = new Product[]
        {
           // new Product {Id=1,Name="yo-yo",Category="toys",Price=1000}
        };
         [HttpGet]
        public IHttpActionResult getTree()
        {
            List<department> dept = new List<department>();
            List<Product> emp;
            Product empData;
            department dptData;
            int i=0;
            int group_id;
            var response = 0;
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ConnectionString"].ToString());
            SqlDataAdapter sa = new SqlDataAdapter();
            SqlCommand sqlCommandSelect = new SqlCommand("get_treeData",con);
            sqlCommandSelect.CommandType = System.Data.CommandType.StoredProcedure;
            sa.SelectCommand = sqlCommandSelect;
            DataSet ds = new DataSet();
            sa.Fill(ds);
            group_id = Convert.ToInt32(ds.Tables[0].Rows[0]["dpt_id"]);
            response = ds.Tables[0].Rows.Count;
        
             for (i=0;i<ds.Tables[0].Rows.Count;i++)
             {
                 
                var dpt_id = ds.Tables[0].Rows[i]["dpt_id"];
                var dpt_name = ds.Tables[0].Rows[i]["dpt_name"];
                emp = new List<Product>();
                if (group_id == Convert.ToInt32(ds.Tables[0].Rows[i]["dpt_id"])) {
                           while( i < response && group_id == Convert.ToInt32(ds.Tables[0].Rows[i]["dpt_id"])  )
                                {
                                     empData = new Product();
                                     empData.id = Convert.ToInt32(ds.Tables[0].Rows[i]["emp_id"]);
                                     empData.text = ds.Tables[0].Rows[i]["fname"].ToString();
                                     empData.level = "emp";
                                     emp.Add(empData);
                                     i++;
                                }

                           dptData = new department();
                           dptData.id = Convert.ToInt32(dpt_id);
                           dptData.text = dpt_name.ToString();
                           dptData.level = "dpt";
                           dptData.items = emp;
                           dept.Add(dptData);
                    }
                 if(i< response)
                 {
                     group_id = Convert.ToInt32(ds.Tables[0].Rows[i]["dpt_id"]);
                     i--;
                 }          
                        
             }
           
            return Json(dept);
        }
        public IHttpActionResult GetProduct(int id)
        {
           /* var product = products.FirstOrDefault((p) => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }*/
            return Ok("done");
        }

    }
}

