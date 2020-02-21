using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Order
    {
        public string OrderNumber { get; set; }
        public int OrderID { get; set; }
        public string OrderDescription { get; set; }
        public string OrderDate { get; set; }
        public string OrderStatus { get; set; }
    }
}