using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrialApp.Models
{
    public class department
    {
        public int id { get; set; }
        public string text { get; set; }
        public string level { get; set; }
        public List<Product> items { get; set;}
    }
}