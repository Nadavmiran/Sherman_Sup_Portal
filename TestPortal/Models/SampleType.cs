using LMNS.Priority.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class SampleType : PriorityAPI
    {
        public int SAMPLE_TYPE { get; set; }
        public string SAMPLE_TYPE_CODE { get; set; }
    }

    public class SampleTypeWarpper : ODataBase
    {
        public List<SampleType> Value { get; set; }
    }
}