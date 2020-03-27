using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Sample : PriorityAPI
    {
        #region Properties
        /// <summary>
        ///תאריך דגימה
        /// </summary>
        public DateTime CURDATE { get; set; }
        /// <summary>
        /// מספר דגימה
        /// </summary>
        public string DOCNO { get; set; }
        /// <summary>
        /// סטאטוס
        /// </summary>
        public string STATDES { get; set; }
        /// <summary>
        /// מק"ט
        /// </summary>
        public string PARTNAME { get; set; }
        /// <summary>
        /// תאור מוצר
        /// </summary>
        public string PARTDES { get; set; }
        /// <summary>
        /// פק"ע
        /// </summary>
        public string SERIALNAME { get; set; }
        /// <summary>
        /// כמות הפק"ע 
        /// </summary>
        public int SHR_SERIAL_QUANT { get; set; }
        /// <summary>
        /// גודל מנה 
        /// </summary>
        public int SHR_QUANT { get; set; }
        /// <summary>
        /// תקן דגימה 
        /// </summary>
        public string SHR_SAMPLE_STD_CODE { get; set; }
        /// <summary>
        /// כמות במדגם 
        /// </summary>
        public int QUANT { get; set; }
        /// <summary>
        /// שרטוט 
        /// </summary>
        public string SHR_DRAW { get; set; }
        /// <summary>
        /// רמת איכות רצויה 
        /// </summary>
        public decimal SHR_RAR { get; set; }
        /// <summary>
        /// מקסימום כמות פסולים 
        /// </summary>
        public int MAX_REJECT { get; set; }

        public List<Sample_QA> MED_TRANSSAMPLEQA_SUBFORM { get; set; } 
        #endregion

        internal Sample GetProductSamples(string supplierName, string partName, string revName, int ordLine)
        {
            // MED_SAMPLE ?$filter = PARTNAME eq '23559000' and SUPNAME eq '20523' &$expand = MED_TRANSSAMPLEQA_SUBFORM
            string query = "MED_SAMPLE?$filter=PARTNAME eq '" + partName + "' and SUPNAME eq '" + supplierName + "'&$expand=MED_TRANSSAMPLEQA_SUBFORM";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return new Sample();
        }
    }

    public class SamplesWarpper : ODataBase
    {
        public List<Sample> Value { get; set; }
    }
    public class Sample_QA
    {
        /// <summary>
        /// קוד בדיקה
        /// </summary>
        public string QACODE { get; set; }
        /// <summary>
        /// תאור בדיקה
        /// </summary>
        public string QADES { get; set; }
        /// <summary>
        /// מיקום
        /// </summary>
        public string LOCATION { get; set; }
        /// <summary>
        /// בדיקה - טקסט
        /// </summary>
        public string SHR_TEST { get; set; }
        /// <summary>
        /// תוצאת מינימום
        /// </summary>
        public decimal RESULTMIN { get; set; }
        /// <summary>
        /// תוצאת מקסימום
        /// </summary>
        public decimal RESULTMAX { get; set; }
        /// <summary>
        /// חזרות
        /// </summary>
        public int REPETITION { get; set; }
        /// <summary>
        /// תוצאתית
        /// </summary>
        public string RESULTANT { get; set; }
        /// <summary>
        /// תוצאה נדרשת
        /// </summary>
        public decimal REQUIRED_RESULT { get; set; }
        /// <summary>
        /// גודל המדגם
        /// </summary>
        public int SAMPQUANT { get; set; }
        /// <summary>
        /// תאור כלי מדידה
        /// </summary>
        public string MEASUREDES { get; set; }
        /// <summary>
        /// תוצאת בדיקה
        /// </summary>
        public decimal RESULT { get; set; }
        /// <summary>
        /// תקין
        /// </summary>
        public string NORMAL { get; set; }
        /// <summary>
        /// הערה
        /// </summary>
        public string REMARK { get; set; }
    }
}