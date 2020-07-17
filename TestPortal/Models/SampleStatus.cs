using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class SampleStatus : PriorityAPI
    {
        public int SAMPLESTATUS { get; set; }
        public string STATDES { get; set; }
        public string ESTATDES { get; set; }
        internal List<SampleStatus> GetSampleStatusList()
        {
            string res = Call_Get("MED_SAMPLESTATUS?$filter=CANCELLED ne 'Y'");
            SampleStatusWarpper ow = JsonConvert.DeserializeObject<SampleStatusWarpper>(res);
            if (null == ow)
                return new List<SampleStatus>();

            return ow.Value;
        }
    }

    public class SampleStatusWarpper : ODataBase
    {
        public List<SampleStatus> Value { get; set; }
    }
}