using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace TestPortal.Models
{
    public class Attachments : PriorityAPI
    {
        #region Properties
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
        #endregion

        internal List<Attachments> GetProductAttachments(int orderID, string prodName)
        {
            string query = "/PORDERS?$filter=ORD eq " + orderID + "&$expand=EXTFILES_SUBFORM($filter=SHR_PARTNAME eq '" + prodName + "')";
            query = query.Replace("\"", "");

            string res = Call_Get(query);
            List<Attachments> lst = null;

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            if (null == ow)
                return lst;

            if (null == ow.Value[0].EXTFILES_SUBFORM)
                return lst;

            lst = new List<Attachments>();
            foreach (Attachments item in ow.Value[0].EXTFILES_SUBFORM)
            {
                lst.Add(item);
            }
            return lst;
        }

        private string CreateJsonMsg(SampleTestMsg sampleTestMsg, List<Attachments> files)
        {
            /*
              {
	"DOCNO":"C2000000091",
	"PARTNAME":"28609002",
	"MED_EXTFILES_SUBFORM": [
		{
		"EXTFILEDES":"TEXT",
		"EXTFILENAME":"C:\\Users\\orong\\Desktop\\DBconnection.txt"
		}
	]
}
             * */
            StringBuilder sb = new StringBuilder();
            int idx = 0;
            sb.Append("{");
            sb.Append("\r\n\t\"DOCNO\":");
            sb.Append("\"" + sampleTestMsg.hdnQaDOCNO + "\",");
            sb.Append("\r\n\t\"PARTNAME\":");
            sb.Append("\"" + sampleTestMsg.hdnQaPARTNAME + "\",");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + sampleTestMsg.hdnQaSUPNAME + "\",");
            sb.Append("\r\n\t\"MED_EXTFILES_SUBFORM\": [");
            foreach (Attachments item in files)
            {
                idx++;
                if ((idx > 1) && (idx <= files.Count))
                    sb.Append(",");

                sb.Append("\r\n\t{");
                sb.Append("\r\n\t\"EXTFILEDES\":");
                sb.Append("\"" + item.FILE_NAME + "\",");
                sb.Append("\r\n\t\"EXTFILENAME\":");
                sb.Append("\"" + item.EXTFILENAME.Replace(@"\", @"\\") + "\"");
                sb.Append("\r\n\t}");
            }
            sb.Append("\r\n\t]"); //End Sub form
            sb.Append("}"); // End msg

            return sb.ToString();
        }

        internal ResultAPI UploadSampleAttachments(SampleTestMsg sampleTestMsg, List<Attachments> files)
        {
            ResultAPI ra = null;
            string query = CreateJsonMsg(sampleTestMsg, files);
            ra = Call_PATCH(query);

            return ra;
        }
    }
}