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
        public PORDTYPESTEXTLANG_SUBFORM[] PORDTYPESTEXTLANG_SUBFORM { get; set; }

        internal string GetOrderTypeText(string TYPECODE)
        {
            string res = Call_Get("PORDTYPES?$filter=TYPECODE eq '" + TYPECODE + "'&$expand=PORDTYPESTEXT_SUBFORM");

            OrderTypeWarpper ow = JsonConvert.DeserializeObject<OrderTypeWarpper>(res);
            if (null == ow || null == ow.Value)
                return string.Empty;

            if (null == ow.Value[0].PORDTYPESTEXT_SUBFORM || ow.Value[0].PORDTYPESTEXT_SUBFORM.Length == 0)
                return string.Empty;

            res = string.Empty;
            foreach (PORDTYPESTEXT_SUBFORM item in ow.Value[0].PORDTYPESTEXT_SUBFORM)
            {
                res += "&nbsp;" + item.TEXT.Replace("Pdir", "P dir") + "&nbsp;";
            }
            return res;
        }

        internal string GetOrderTypeText_EN(string TYPECODE)
        {
            string res = Call_Get("PORDTYPES?$filter=TYPECODE eq '" + TYPECODE + "'&$expand=PORDTYPESTEXTLANG_SUBFORM");
            OrderTypeWarpper ow = JsonConvert.DeserializeObject<OrderTypeWarpper>(res);
            if (null == ow || null == ow.Value)
                return string.Empty;

            if (null == ow.Value[0].PORDTYPESTEXTLANG_SUBFORM || ow.Value[0].PORDTYPESTEXTLANG_SUBFORM.Length == 0)
                return string.Empty;

            res = string.Empty;
            foreach (PORDTYPESTEXTLANG_SUBFORM item in ow.Value[0].PORDTYPESTEXTLANG_SUBFORM)
            {
                res += "&nbsp;" + item.TEXTA.Replace("Pdir", "P dir") + "&nbsp;";
            }
            return res;
        }
    }

public class PORDTYPESTEXT_SUBFORM
    {
        public int TEXTLINE { get; set; }
        public string TEXT { get; set; }
    }

    public class PORDTYPESTEXTLANG_SUBFORM
    {
        public int TEXTLINE { get; set; }
        public string TEXTA { get; set; }
    }

    public class OrderTypeWarpper : ODataBase
    {
        public List<OrderType> Value { get; set; }
    }
}