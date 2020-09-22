using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class ProductRevisionTest
    {
        /// <summary>
        /// קוד בדיקה
        /// </summary>
        public int QACODE { get; set; }
        public int PART { get; set; }
        public int REV { get; set; }
        public int LOCATION { get; set; }
        /// <summary>
        /// תאור בדיקה
        /// </summary>
        public string QADES { get; set; }
        /// <summary>
        /// תאור בדיקה באנגלית
        /// </summary>
        public string EFI_QADES { get; set; }
        /// <summary>
        /// בדיקה - טקסט
        /// </summary>
        public string SHR_TEST { get; set; }
        /// <summary>
        /// תוצאת מינימום
        /// </summary>
        public float RESULTMIN { get; set; }
        /// <summary>
        /// תוצאת מקסימום
        /// </summary>
        public float RESULTMAX { get; set; }
        /// <summary>
        /// סטייה מותרת ב %
        /// </summary>
        public float DEVIATIONPER { get; set; }
        /// <summary>
        /// סטייה מותרת מספרית
        /// </summary>
        public string DEVIATIONNUM { get; set; }
        /// <summary>
        /// תוצאתית (N/Y)
        /// </summary>
        public string RESULTANT { get; set; }
        /// <summary>
        /// UNITNAME
        /// </summary>
        public string UNITNAME { get; set; }
        
    }
}