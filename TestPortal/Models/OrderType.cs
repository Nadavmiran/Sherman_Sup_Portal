using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class OrderType : PriorityAPI
    {
        public string TYPECODE { get; set; }
        public string TYPEDES { get; set; }
        public string ETYPEDES { get; set; }
        public PORDTYPESTEXT_SUBFORM[] PORDTYPESTEXT_SUBFORM { get; set; }

        internal string GetOrderTypeText(string TYPECODE)
        {
            string res = Call_Get("PORDTYPES?$filter=TYPECODE eq '" + TYPECODE + "'&$expand=PORDTYPESTEXT_SUBFORM");
            OrderTypeWarpper ow = JsonConvert.DeserializeObject<OrderTypeWarpper>(res);
            if (null == ow || null == ow.Value)
                return string.Empty;

            if(null == ow.Value[0].PORDTYPESTEXT_SUBFORM || ow.Value[0].PORDTYPESTEXT_SUBFORM.Length == 0)
                return string.Empty;

            res = string.Empty;
            foreach (PORDTYPESTEXT_SUBFORM item in ow.Value[0].PORDTYPESTEXT_SUBFORM)
            {
                res += item.TEXT;
            }
            return res;
        }
    }

    public class PORDTYPESTEXT_SUBFORM
    {
        public int TEXTLINE { get; set; }
        public string TEXT { get; set; }
    }

    public class OrderTypeWarpper : ODataBase
    {
        public List<OrderType> Value { get; set; }
    }
}