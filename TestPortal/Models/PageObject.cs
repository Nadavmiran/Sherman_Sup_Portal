using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class PageObject
    {
        public Order objOrder { get; set; }
        //public Product objProduct1 { get; set; }
        public OrderItems objProduct { get; set; }
        public OrdersItemText objItemText { get; set; }
        public string objOrderText { get; set; }
        public Sample objSample { get; set; }
        public Sample_QA objSamplQA { get; set; }
        public List<DelayReason> lstDelayReason { get; set; }
        public List<Sample> lstSampleObject { get; set; }
        public List<SampleAttachments> lstSampleAttachments { get; set; }
        public List<Order> lstOrderObject { get; set; }
        public List<OrderItems> lstItemsObject { get; set; }
        public List<Attachments> lstAttachments { get; set; }
        public List<OrderAttachment> lstOrderAttachments { get; set; }
        public List<Revision> lstRevision { get; set; }
        public List<Sample_QA> lstSamplQA { get; set; }
        public List<SampleStatus> lstSampleStatus { get; set; }
        public List<SampleStandard> lstSampleStandard { get; set; }
        public IEnumerable<HttpPostedFileBase> attachments { get; set; }
        public AppUser User { get; set; }
        public string htmlText { get; set; }
        public string apiResultMessage { get; set; }
        public string ErrorDescription { get; set; }
    }
}