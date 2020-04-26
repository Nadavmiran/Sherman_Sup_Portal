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
        public OrdersItemText objItemText { get; set; }
        public Test TestObject { get; set; }
        public Sample objSample { get; set; }
        public Sample_QA objSamplQA { get; set; }
        public List<Sample> lstSampleObject { get; set; }
        public List<Test> lstTestObject { get; set; }
        public List<Order> lstOrderObject { get; set; }
        public List<OrderItems> lstItemsObject { get; set; }
        public List<Attachments> lstAttachments { get; set; }
        public List<Revision> lstRevision { get; set; }
        public List<Sample_QA> lstSamplQA { get; set; }
        public IEnumerable<HttpPostedFileBase> attachments { get; set; }
        public AppUser User { get; set; }
    }
}