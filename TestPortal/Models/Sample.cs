using LMNS.App.Log;
using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        /// מספר ספק
        /// </summary>
        public string SUPNAME { get; set; }
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
            string query = "MED_SAMPLE?$filter=PARTNAME eq '" + partName + "' and SUPNAME eq '" + supplierName + "'&$expand=MED_TRANSSAMPLEQA_SUBFORM($expand=MED_RESULTDET_SUBFORM)";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return new Sample();
        }

        internal ResultAPI UpdateTest(SampleTestMsg data, List<Sample_QA_Resultdet> sUB_RES)
        {
            string reqBody = CreateUpdateTestMsg(data, sUB_RES);
            ResultAPI ra = Call_PATCH(reqBody);
            return ra;
        }

        private string GetDateTimeOffset(string date, string time)
        {
            DateTime dt = TestDateFormat(date, time);
            DateTimeOffset dto = new DateTimeOffset(dt);
            return string.Format("{0:O}", dto);
        }

        private DateTime TestDateFormat(string date, string time)
        {
            //AppLogger.log.Info(AppLogger.CreateLogText("TestDateFormat => Date Value:", date));
            double hh = 0;
            double mm = 0;

            if (null == date)
                return DateTime.Now;

            DateTime dtRes = new DateTime();
            if (string.IsNullOrEmpty(time))
                time = DateTime.Now.ToShortTimeString();

            string[] arrT = time.Split(':');

            if (arrT.Length > 0)
            {
                hh = Convert.ToDouble(arrT[0]);
                mm = Convert.ToDouble(arrT[1]);
            }

            if (DateTime.TryParse(date, out dtRes))
            {
                dtRes.AddHours(hh);
                dtRes.AddMinutes(mm);
            }
            else
            {
                string[] arr = date.Split('-');
                if (arr.Length > 0)
                {
                    dtRes = new DateTime(Convert.ToInt32(arr[2]), Convert.ToInt32(arr[1]), Convert.ToInt32(arr[0]), (int)hh, (int)mm, 0);
                }
                else
                    AppLogger.log.Info(AppLogger.CreateLogText("TestDateFormat => Date Value:", "Wrong date format"));
            }
            return dtRes;
        }

        private string CreateUpdateTestMsg(SampleTestMsg data, List<Sample_QA_Resultdet> sUB_RES)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\r\n\t\"DOCNO\":");
            sb.Append("\"" + data.hdnQaDOCNO + "\",");
            //sb.Append("\r\n\t\"CURDATE\":");
            //sb.Append("\"" + GetDateTimeOffset(DateTime.Now.ToString(), "00:00") + "\",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + data.hdnQaPARTNAME + "\",");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + data.hdnQaSUPNAME + "\",");

            if (data.txtQaRESULTANT.ToLower().Equals("on") && Convert.ToInt32(data.hdnQaREPETITION) == 0)
                Update_Normal_MED_RESULTDET_SUBFORM(data, sUB_RES, ref sb);
            else if (data.txtQaRESULTANT.ToLower().Equals("on") && Convert.ToInt32(data.hdnQaREPETITION) > 0)
                Update_Normal_MED_RESULTDET_SUBFORM(data, sUB_RES, ref sb);
            else
                Update_Normal_MED_RESULTDET_SUBFORM(data, sUB_RES, ref sb);

            sb.Append("}"); // End msg

            AppLogger.log.Info("CreateUpdateTestMsg ==> msg = " + sb.ToString());
            return sb.ToString();
        }

        private void Update_Normal_MED_RESULTDET_SUBFORM(SampleTestMsg data, List<Sample_QA_Resultdet> sUB_RES, ref StringBuilder sb)
        {
            /*
     {
      "DOCNO": "C2000001488",
      "CURDATE": "2020-03-24T00:00:00+02:00",
      "PARTNAME": "23559000",
      "SUPNAME": "20523",
       "MED_TRANSSAMPLEQA_SUBFORM": [
        {
            "QA": 7,
           "QACODE": "007",
          "LOCATION": "2",
          "RESULT": 12.00000,
          "REMARK": null
        }]
    }
*/
            //SubForm
            sb.Append("\r\n\t\"MED_TRANSSAMPLEQA_SUBFORM\": [");
            sb.Append("\r\n\t{");
            sb.Append("\r\n\t\"QA\":");
            sb.Append(Convert.ToInt32(data.hdnQA) + ",");
            sb.Append("\r\n\t\"QACODE\":");
            sb.Append("\"" + data.hdnQACODE + "\",");
            sb.Append("\r\n\t\"LOCATION\":");
            sb.Append("\"" + data.hdnLOCATION + "\",");
            if (data.txtQaRESULTANT.ToLower().Equals("on")) //אם תוצאתית
            {
                if (Convert.ToInt32(data.hdnQaREPETITION) == 0) // אם מספר חזרות = 0
                {
                    sb.Append("\r\n\t\"RESULT\":");
                    sb.Append(Convert.ToDouble(data.txtQaRESULT) + ",");
                }
            }
            else
            {
                if (data.txtQaNORMAL.ToLower().Equals("on"))// עדכון ערך בשדה 'תקין'  בלבד
                {
                    sb.Append("\r\n\t\"NORMAL\":");
                    sb.Append("\"Y\",");
                }
                else
                {
                    sb.Append("\r\n\t\"NORMAL\":");
                    sb.Append("\"N\",");
                }
            }
            sb.Append("\r\n\t\"REMARK\":");
            sb.Append("\"" + data.txtQaREMARK + "\"");

            //If needed then creat sub form for MED_RESULTDET_SUBFORM
            if ((data.txtQaRESULTANT.ToLower().Equals("on") && (Convert.ToInt32(data.hdnQaREPETITION) > 0)) && ((null != sUB_RES) && (sUB_RES.Count > 0)))
            {
                sb.Append(",");
                // To do: Update grandsun screen
                sb.Append("\r\n\t\"MED_RESULTDET_SUBFORM\": [");
                int ind = 0;
                foreach (Sample_QA_Resultdet item in sUB_RES)
                {
                    ind++;
                    if ((null == item.KLINE) || (null == item.RESULT))
                        continue;

                    if((ind > 1) && (ind <= sUB_RES.Count))
                        sb.Append(",");

                    sb.Append("\r\n\t{");
                    sb.Append("\r\n\t\"KLINE\":");
                    sb.Append(item.KLINE.Value + ",");
                    sb.Append("\r\n\t\"RESULT\":");
                    sb.Append(item.RESULT.Value);
                    sb.Append("\r\n\t}");
                }
                sb.Append("\r\n\t]"); //End Sub form
            }
            sb.Append("\r\n\t}");
            sb.Append("\r\n\t]"); //End Sub form
        }

        internal Sample GetOrderProductTests(string partName, string supplierName, string qaCode)
        {
            // /MED_SAMPLE?$filter=PARTNAME eq '23559000' and SUPNAME eq '20523'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '007';$expand=MED_RESULTDET_SUBFORM)
            string query = "MED_SAMPLE?$filter=PARTNAME eq '" + partName + "' and SUPNAME eq '" + supplierName + "'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '" + qaCode + "';$expand=MED_RESULTDET_SUBFORM)";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
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

}