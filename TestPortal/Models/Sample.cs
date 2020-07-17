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
        public string pageCURDATE
        {
            get
            {
                return pageDateFormat(CURDATE);
            }
        }
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
        public string EFI_ESTATDES { get; set; }
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
        /// <summary>
        /// תאור רמת איכות רצויה
        /// </summary>
        public string EFI_RAR_DES { get; set; }
        public string EFI_SUPNO { get; set; }
        public string SAMPLE_TYPE_CODE { get; set; }
        public string SHR_ROHS { get; set; }
        public string EFI_PORDNAME { get; set; }
        public List<SampleAttachments> MED_EXTFILES_SUBFORM { get; set; }
        public List<Sample_QA> MED_TRANSSAMPLEQA_SUBFORM { get; set; }
        #endregion
        internal Sample GetProductSamples(string supplierName, string orderName, string partName, int ordLine)
        {
            // MED_SAMPLE ?$filter = PARTNAME eq '23559000' and SUPNAME eq '20523' &$expand = MED_TRANSSAMPLEQA_SUBFORM
            string query = "MED_SAMPLE?$filter=EFI_PORDNAME eq '" + orderName + "' and PARTNAME eq '" + partName + "' and SUPNAME eq '" + supplierName + "' and STATDES ne 'מבוטלת'&$select=EFI_RAR_DES, CURDATE,DOCNO,SUPNAME,STATDES,PARTNAME,PARTDES,SERIALNAME,SHR_SERIAL_QUANT,SHR_QUANT,SHR_SAMPLE_STD_CODE,QUANT,SHR_DRAW,SHR_RAR,MAX_REJECT &$expand=MED_TRANSSAMPLEQA_SUBFORM($expand=MED_RESULTDET_SUBFORM)";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return new Sample();
        }

        internal Sample GetProductSamples(string DOCNO)
        {
            string query = "MED_SAMPLE?$filter=DOCNO eq '" + DOCNO + "' and STATDES ne 'מבוטלת'&$expand=MED_TRANSSAMPLEQA_SUBFORM($expand=MED_RESULTDET_SUBFORM),MED_EXTFILES_SUBFORM";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return new Sample();
        }

        internal List<Sample> GetOrderSamples(string ORDNAME, string SUPNAME, string PARTNAME)
        {
            string query = "MED_SAMPLE?$filter=EFI_PORDNAME eq '" + ORDNAME + "' and SUPNAME eq '" + SUPNAME + "' and PARTNAME eq '" + PARTNAME + "' and STATDES ne 'מבוטלת'&$expand=MED_EXTFILES_SUBFORM";
            string res = Call_Get(query);
            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            return ow.Value;
        }

        internal ResultAPI UpdateTest(SampleTestMsg data, List<Sample_QA_Resultdet> sUB_RES)
        {
            string reqBody = CreateUpdateTestMsg(data, sUB_RES);
            ResultAPI ra = Call_PATCH(reqBody);
            return ra;
        }

        //private string GetDateTimeOffset(string date, string time)
        //{
        //    DateTime dt = TestDateFormat(date, time);
        //    DateTimeOffset dto = new DateTimeOffset(dt);
        //    return string.Format("{0:O}", dto);
        //}

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
                if (data.txtQaNORMAL.ToLower().Equals("y"))// עדכון ערך בשדה 'תקין'  בלבד
                {
                    sb.Append("\r\n\t\"NORMAL\":");
                    sb.Append("\"Y\",");
                }
                else if(data.txtQaNORMAL.ToLower().Equals("n"))
                {
                    sb.Append("\r\n\t\"NORMAL\":");
                    sb.Append("\"N\",");
                }
                else
                {
                    sb.Append("\r\n\t\"NORMAL\":");
                    sb.Append("\"\",");
                }
            }
            sb.Append("\r\n\t\"EFI_MEASURESUPTOOLS\":");
            sb.Append("\"" + data.txtQaEFI_MEASURESUPTOOLS + "\",");
            sb.Append("\r\n\t\"REMARK\":");
            sb.Append("\"" + data.txtQaREMARK + "\",");
            sb.Append("\r\n\t\"EFI_CRITICALFLAG\":");
            sb.Append("\"" + data.txtQaEFI_CRITICALFLAG + "\"");
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

        internal Sample GetOrderProductTests(string DOCNO, string qaCode)
        {
            // /MED_SAMPLE?$filter=PARTNAME eq '23559000' and SUPNAME eq '20523'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '007';$expand=MED_RESULTDET_SUBFORM)
            string query = "MED_SAMPLE?$filter=DOCNO eq '" + DOCNO + "'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '" + qaCode + "';$expand=MED_RESULTDET_SUBFORM)";
            string res = Call_Get(query);

            SamplesWarpper ow = JsonConvert.DeserializeObject<SamplesWarpper>(res);
            if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return new Sample();
        }

        internal ResultAPI Createtest(string supName, string ordName, string partName, List<CreateSampleTestMsg> form, bool isNewSample, string DOCNO = "")
        {
            string reqBody = CreateNewsampleMsg(supName, ordName, partName, form, isNewSample);
            ResultAPI ra = Call_POST(reqBody);
            return ra;
        }

        private string CreateNewsampleMsg(string supName, string ordName, string partName, List<CreateSampleTestMsg> form, bool isNewSample, string DOCNO = "")
        {
            int indx = 0;
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            if (isNewSample)
            {
                sb.Append("\r\n\t\"CURDATE\":");
                sb.Append("\"" + GetDateTimeOffset(DateTime.Now.ToString(), "00:00") + "\",");
            }
            else
            {
                if(!string.IsNullOrEmpty(DOCNO))
                {
                    sb.Append("\r\n\t\"DOCNO\":");
                    sb.Append("\"" + DOCNO + "\",");
                }
            }
            sb.Append("\r\n\t\"EFI_PORDNAME\":");
            sb.Append("\"" + ordName + "\",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + partName + "\",");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + supName + "\",");
            sb.Append("\r\n\t\"MED_TRANSSAMPLEQA_SUBFORM\": [");
            foreach (CreateSampleTestMsg item in form)
            {
                indx++;
                sb.Append("\r\n\t{");
                sb.Append("\r\n\t\"QACODE\":");
                sb.Append("\"" + item.QACODE + "\",");
                sb.Append("\r\n\t\"RESULTMIN\":");
                sb.Append(Convert.ToDecimal(item.RESULTMIN) + ",");
                sb.Append("\r\n\t\"RESULTMAX\":");
                sb.Append(Convert.ToDecimal(item.RESULTMAX) +",");
                sb.Append("\r\n\t\"REPETITION\":");
                sb.Append(Convert.ToInt32(item.REPETITION));
                sb.Append("\r\n\t}");
                if (indx < form.Count)
                    sb.Append("\r\n\t,");
            }
            sb.Append("\r\n\t]}");
            return sb.ToString();
        }

        private string CreateNewsampleMsg(string supName, string ordName, string partName, int ordLine)
        {
            StringBuilder sb = new StringBuilder();
            string SAMPLE_TYPE_CODE = string.Empty;
            string res = Call_Get("SHR_SAMPLE_TYPE?$filter=EFI_CONT eq 'Y'");
            if(string.IsNullOrEmpty(res))
            {
                SAMPLE_TYPE_CODE = "ספק";
            }
            else
            {
                SampleTypeWarpper ow = JsonConvert.DeserializeObject<SampleTypeWarpper>(res);
                if(null == ow || null == ow.Value || ow.Value.Count == 0)
                    SAMPLE_TYPE_CODE = "ספק";
                else
                    SAMPLE_TYPE_CODE = ow.Value[0].SAMPLE_TYPE_CODE;
            }                

            sb.Append("{");
            sb.Append("\r\n\t\"CURDATE\":");
            sb.Append("\"" + GetDateTimeOffset(DateTime.Now.ToString(), "00:00") + "\",");
            sb.Append("\r\n\t\"EFI_PORDNAME\":");
            sb.Append("\"" + ordName + "\",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + partName + "\",");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + supName + "\",");
            sb.Append("\r\n\t\"SAMPLE_TYPE_CODE\":");
            sb.Append("\"" + SAMPLE_TYPE_CODE + "\",");
            sb.Append("\r\n\t\"EFI_PILINE\":");
            sb.Append(ordLine);

            sb.Append("}");
            return sb.ToString();
        }

        internal ResultAPI AddSampleTests(string supName, string ordName, string partName, List<CreateSampleTestMsg> form, bool isNewSample, string DOCNO = "")
        {
            string reqBody = CreateNewsampleMsg(supName, ordName, partName, form, isNewSample, DOCNO);
            ResultAPI ra = Call_PATCH(reqBody);
            return ra;
        }

        internal ResultAPI CreateSampleDocument(string supName, string ordName, string partName, int ordLine)
        {
            string reqBody = CreateNewsampleMsg(supName, ordName, partName, ordLine);
            ResultAPI ra = Call_POST(reqBody);
            return ra;
        }

        internal ResultAPI UpdateSampleDetails(string STATDES, string SAMPLE_TYPE_CODE, string EFI_SUPNO, int SHR_QUANT, string SHR_ROHS, string SHR_SAMPLE_STD_CODE, string DOCNO, string SERIALNAME, string PARTNAME)
        {
            string reqBody = CreateUpdateSampleDetailsMessage(STATDES, SAMPLE_TYPE_CODE, EFI_SUPNO, SHR_QUANT, SHR_ROHS, SHR_SAMPLE_STD_CODE, DOCNO, SERIALNAME, PARTNAME);
            ResultAPI ra = Call_Common_PATCH("/MED_SAMPLE", reqBody);
            return ra;
        }

        private string CreateUpdateSampleDetailsMessage(string STATDES, string SAMPLE_TYPE_CODE, string EFI_SUPNO, int SHR_QUANT, string SHR_ROHS, string SHR_SAMPLE_STD_CODE, string DOCNO, string SERIALNAME, string PARTNAME)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\r\n\t\"DOCNO\":");
            sb.Append("\"" + DOCNO + "\",");
            sb.Append("\r\n\t\"STATDES\":");
            sb.Append("\"" + STATDES + "\",");
            sb.Append("\r\n\t\"SERIALNAME\":");
            sb.Append("\"" + SERIALNAME + "\",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + PARTNAME + "\",");
            sb.Append("\r\n\t\"SHR_SAMPLE_STD_CODE\":");
            sb.Append("\"" + SHR_SAMPLE_STD_CODE + "\",");
            sb.Append("\r\n\t\"EFI_SUPNO\":");
            sb.Append("\"" + EFI_SUPNO + "\",");
            sb.Append("\r\n\t\"SHR_QUANT\":");
            sb.Append(SHR_QUANT + ",");
            sb.Append("\r\n\t\"SAMPLE_TYPE_CODE\":");
            sb.Append("\"" + SAMPLE_TYPE_CODE + "\",");
            sb.Append("\r\n\t\"SHR_ROHS\":");
            sb.Append("\"" + SHR_ROHS + "\"");
            sb.Append("}");
            return sb.ToString();
        }
    }

    public class SamplesWarpper : ODataBase
    {
        public List<Sample> Value { get; set; }
    }
}