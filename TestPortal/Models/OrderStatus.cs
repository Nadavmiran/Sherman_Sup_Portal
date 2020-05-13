using LMNS.Priority.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class OrderStatus : PriorityAPI
    {
        public int ORIGSTAT { get; set; }
        public string STATDES { get; set; }
        public string ESTATDES { get; set; }
    }

    public class OrderStatusWarpper : ODataBase
    {
        public List<OrderStatus> Value { get; set; }
    }
}