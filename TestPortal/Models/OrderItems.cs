using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Text;

namespace TestPortal.Models
{
    public class OrderItems : PriorityAPI
    {
        #region Properties
        /// <summary>
        /// הזמנה
        /// </summary>
        public int ORD { get; set; }
        /// <summary>
        /// הזמנה
        /// </summary>
        public string ORDNAME { get; set; }
        /// <summary>
        /// שורה
        /// </summary>
        public int LINE { get; set; }
        /// <summary>
        /// מקט
        /// </summary>
        public string PARTNAME { get; set; }
        /// <summary>
        /// תאור מוצר
        /// </summary>
        public string PDES { get; set; }
        /// <summary>
        /// כמות
        /// </summary>
        public int TQUANT { get; set; }
        /// <summary>
        /// יתרה לאספקה
        /// </summary>
        public int TBALANCE { get; set; }
        /// <summary>
        /// ת. אספקה
        /// </summary>
        public DateTime? REQDATE { get; set; }
        public string pageREQDATE
        {
            get
            {
                if (!REQDATE.HasValue)
                    return string.Empty;

                return pageDateFormat(REQDATE);
            }
        }
        /// <summary>
        /// שרטוט
        /// </summary>
        public string SHR_DRAW { get; set; }
        /// <summary>
        /// מהדורת מוצר
        /// </summary>
        public string REVNAME { get; set; }
        /// <summary>
        /// מה.עץ מוצר מפק"ע
        /// </summary>
        public string SHR_SERIAL_REVNUM { get; set; }
        /// <summary>
        /// לפק"ע
        /// </summary>
        public string SERIALNAME { get; set; }
        /// <summary>
        /// פעולה-תאור פעולה
        /// </summary>
        public string ACTNAME { get; set; }
        /// <summary>
        /// מק"ט ספק/יצרן
        /// </summary>
        public string SUPPARTNAME { get; set; }
        /// <summary>
        /// תאריך אספקה מבוקש
        /// </summary>
        public DateTime? REQDATE2 { get; set; }
        public string pageREQDATE2
        {
            get
            {
                if (!REQDATE2.HasValue)
                    return string.Empty;

                return pageDateFormat(REQDATE2);
            }
        }
        /// <summary>
        /// שם יצרן לשורת הזמנה
        /// </summary>
        public string SHR_MNFDES { get; set; }
        /// <summary>
        /// מק"ט יצרן
        /// </summary>
        public string SHR_MNFPARTNAME { get; set; }
        /// <summary>
        /// סטטוס שורת הזמנה
        /// </summary>
        public string PORDISTATUSDES { get; set; }
        /// <summary>
        /// סיבת דחייה
        /// </summary>
        public string EFI_DELAYREASON { get; set; }
        /// <summary>
        /// קריטית
        /// </summary>
        public string EFI_CRITICALFLAG { get; set; }
        public OrdersItemText[] PORDERITEMSTEXT_SUBFORM { get; set; }
        #endregion

        internal Order GetProductDetailse(string SUPNAME, string ORDNAME, string PARTNAME)
        {
            string query = "PORDERS?$filter=SUPNAME eq '" + SUPNAME + "' and ORDNAME eq '" + ORDNAME + "'&$expand=PORDERITEMS_SUBFORM($filter=PARTNAME eq '" + PARTNAME + "')";
            string res = Call_Get(query);

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
            {
                return ow.Value[0];
            }
            return null;
        }

        internal ResultAPI UpdateOrderLineData(string SUPNAME)
        {
            string message = CreateUpdateOrderLineMsg(SUPNAME);
            ResultAPI ra = Call_Common_PATCH("/SHR_OPENSUPORDERS_T", message);
            return ra;
        }

        private string CreateUpdateOrderLineMsg(string sUPNAME)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\r\n\t\"ORDNAME\":");
            sb.Append("\"" + ORDNAME + "\",");
            sb.Append("\r\n\t\"KLINE\":");
            sb.Append(LINE + ",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + PARTNAME + "\",");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + sUPNAME + "\",");
            sb.Append("\r\n\t\"REQDATE\":");
            sb.Append("\"" + GetDateTimeOffset(REQDATE.ToString(), "00:00") + "\",");
            sb.Append("\r\n\t\"SHR_DUEDATE_APPROVED\":");
            sb.Append("\"Y\",");
            sb.Append("\r\n\t\"SHR_SUPUPD_FLAG\":");
            sb.Append("\"Y\",");
            sb.Append("\r\n\t\"EFI_DELAYREASON\":");
            sb.Append("\"" + EFI_DELAYREASON + "\"");
            sb.Append("}");
            return sb.ToString(); 
        }
    }
}