using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Product
    {
        public int OrderID { get; set; }
        public string OrderNumber { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public int TotalAmountInOrder { get; set; }
        public int LeftAmountToDeliver { get; set; }
        public string SupplyDate { get; set; }
        public string LineStatus { get; set; }
    }
}