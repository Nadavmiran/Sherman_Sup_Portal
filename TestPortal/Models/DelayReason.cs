using LMNS.Priority.API;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace TestPortal.Models
{
    public class DelayReason : PriorityAPI
    {
        public int DELAYREASON { get; set; }
        public string CODE { get; set; }
        public string DES { get; set; }
        public string EDES { get; set; }

        internal List<DelayReason> GetDelayReasons()
        {
            string query = "EFI_DELAYREASONS";
            string res = Call_Get(query);

            DelayReasonsWarpper ow = JsonConvert.DeserializeObject<DelayReasonsWarpper>(res);
            if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value;
            }
            return null;
        }
    }

    public class DelayReasonsWarpper : ODataBase
    {
        public List<DelayReason> Value { get; set; }
    }
}