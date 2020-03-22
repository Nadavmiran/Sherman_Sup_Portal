using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class OrderItems
    {
        /// <summary>
        /// הזמנה
        /// </summary>
        public int ORD { get; set; }
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

                return new DateTime(REQDATE.Value.Year, REQDATE.Value.Month, REQDATE.Value.Day).ToShortDateString();
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

                return new DateTime(REQDATE2.Value.Year, REQDATE2.Value.Month, REQDATE2.Value.Day).ToShortDateString();
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
        public OrdersItemText[] PORDERITEMSTEXT_SUBFORM { get; set; }

        // TO ADD LATER
        /// <summary>
        /// סיבת דחייה
        /// </summary>
        //public string XXXXX { get; set; }
    }
}