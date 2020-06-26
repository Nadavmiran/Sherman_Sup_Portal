using LMNS.Priority.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class SHR_OPENSUPORDERS_T
    {
        public int ORDI { get; set; }
        public int KLINE { get; set; }
        public string EFI_DELAYREASON { get; set; }
        public string SHR_SUPUPD_DATE { get; set; }
        public DueDateLog[] SHR_DUEDATELOG_SUBFORM { get; set; }
    }

    public class SHR_OPENSUPORDERS_T_Warpper : ODataBase
    {
        public List<SHR_OPENSUPORDERS_T> Value { get; set; }
    }
}