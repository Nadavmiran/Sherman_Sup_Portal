using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class PageObject
    {
        public Order objOrder { get; set; }
        public Product objProduct1 { get; set; }
        public OrderItems objProduct { get; set; }
        public Test TestObject { get; set; }
        public List<Test> lstTestObject { get; set; }
        public List<Order> lstOrderObject { get; set; }
        public List<OrderItems> lstItemsObject { get; set; }
        public List<Revision> lstRevision { get; set; }
        public IEnumerable<HttpPostedFileBase> attachments { get; set; }
        public AppUser User { get; set; }
    }
}