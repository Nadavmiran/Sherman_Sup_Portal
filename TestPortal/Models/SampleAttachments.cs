using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class SampleAttachments : PriorityAPI
    {
        public string EXTFILEDES { get; set; }
        public int EXTFILENUM { get; set; }
        public string EXTFILENAME { get; set; }
        public string FOLDER { get; set; }
        public string SUFFIX { get; set; }
        public string SUFFIX_TEXT { get; set; }

        internal List<SampleAttachments> GetSampleAttachments(string DOCNO)
        {
            string query = "MED_SAMPLE?$filter=DOCNO eq '" + DOCNO + "'&$expand=MED_EXTFILES_SUBFORM";
            string res = Call_Get(query);
            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if(null == ow.Value || null == ow.Value[0].MED_EXTFILES_SUBFORM || ow.Value[0].MED_EXTFILES_SUBFORM.Count == 0)
                return new List<SampleAttachments>();

            return ow.Value[0].MED_EXTFILES_SUBFORM;
        }
    }
}