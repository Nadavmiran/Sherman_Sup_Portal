using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class SampleStandard : PriorityAPI
    {
        public int SHR_SAMPLE_STD { get; set; }
        public string SAMPLE_STD_CODE { get; set; }

        internal List<SampleStandard> GetSampleStandardList()
        {
            string res = Call_Get("SHR_SAMPLE_STD");
            SampleStandardWarpper ow = JsonConvert.DeserializeObject<SampleStandardWarpper>(res);
            if (null == ow)
                return new List<SampleStandard>();

            return ow.Value;
        }
    }

    public class SampleStandardWarpper : ODataBase
    {
        public List<SampleStandard> Value { get; set; }
    }
}