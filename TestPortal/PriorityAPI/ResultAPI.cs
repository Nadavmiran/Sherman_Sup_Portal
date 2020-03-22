using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMNS.Priority.API
{
    public class ResultAPI
    {
        public int ResultCode { get; set; }
        public string ErrorDescription { get; set; }
        public string ResultStatus { get; set; }
        public object ResultData { get; set; }
        public string JsonResult { get; set; }
    }
}