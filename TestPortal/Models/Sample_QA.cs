using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Sample_QA : PriorityAPI
    {
        #region Properties
        /// <summary>
        /// מפתח דגימה
        /// </summary>
        public string QA { get; set; }
        /// <summary>
        /// מספר דגימה
        /// </summary>
        public string DOCNO { get; set; }
        /// <summary>
        /// מספר ספק
        /// </summary>
        public string SUPNAME { get; set; }
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
        /// <summary>
        /// מק"ט
        /// </summary>
        public string PARTNAME { get; set; }
        public List<Sample_QA_Resultdet> MED_RESULTDET_SUBFORM { get; set; }
        #endregion

        internal List<Sample_QA> GetCommonSamplesList()
        {
            string query = "MED_QA";
            string res = Call_Get(query);
            Sample_QAWarpper ow = JsonConvert.DeserializeObject<Sample_QAWarpper>(res);
            if((null == ow) || (ow.Value.Count == 0))
            return new List<Sample_QA>();

            return ow.Value;
        }
    }

    public class Sample_QAWarpper : ODataBase
    {
        public List<Sample_QA> Value { get; set; }
    }

    public class Sample_QA_Resultdet
    {
        public int? KLINE { get; set; }
        public decimal? RESULT { get; set; }
    }

    public class SampleTestMsgWarpper
    {
        public List<SampleTestMsg> form { get; set; }
        public List<Sample_QA_Resultdet> SUB_RES { get; set; }
        public List<Attachments> files { get; set; }
    }

    public class SampleTestMsg
    {
        public string hdnQA { get; set; }
        public string hdnQaSUPNAME { get; set; }
        public string hdnQaDOCNO { get; set; }
        public string hdnQACODE { get; set; }
        public string hdnLOCATION { get; set; }
        public string txtQaRESULTANT { get; set; }
        public string txtQaNORMAL { get; set; }
        public string txtQaMEASUREDES { get; set; }
        public string txtQaRESULT { get; set; }
        public string txtQaREMARK { get; set; }
        public string hdnQaPARTNAME { get; set; }
        public string hdnQaREPETITION { get; set; }
        public string hdnQaSAMPQUANT { get; set; }
        //[{"":"20523"},{"":"C2000001488"},{"":"007"},{"":"2"},{"":"7"},{"":"on"},{"":"on"},{"txtQaMEASUREDES":"מדיד הברגה"},{"":"12"},{"":""},{"attachments":""},{"fire-modal-1-submit":""}]
    }

    public class CreateSampleTestMsgWarpper
    {
        public List<CreateSampleTestMsg> form { get; set; }
    }

    public class CreateSampleTestMsg
    {

        public string RESULTMIN { get; set; }
        public string RESULTMAX { get; set; }
        public string REPETITION { get; set; }
        public string QACODE { get; set; }
    }
}