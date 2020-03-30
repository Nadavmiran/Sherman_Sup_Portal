using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Attachments
    {
        /// <summary>
        /// שורה
        /// </summary>
        public int SHR_LINE { get; set; }
        /// <summary>
        /// טקסט נושא למסמך
        /// </summary>
        public string SHR_EXTFILEDESTEXT { get; set; }
        /// <summary>
        /// File Type e.g pdf, doc
        /// </summary>
        public string SUFFIX { get; set; }
        /// <summary>
        /// נתיב הקובץ
        /// </summary>
        public string EXTFILENAME { get; set; }
        /// <summary>
        /// תג רכש
        /// </summary>
        public string SHR_PURCH_FLAG { get; set; }

        public string FOLDER { get; set; }
        public string FILE_NAME { get; set; }

    }
}