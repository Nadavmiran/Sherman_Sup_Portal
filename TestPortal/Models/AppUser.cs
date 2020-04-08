using LMNS.App.Log;
using LMNS.Priority.API;
using LMNS.Repositories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace TestPortal.Models
{
    public class AppUser : PriorityAPI
    {
        public bool IsAuthenticated { get; set; }
        public int PRIORITY_ID { get; set; }
        public int LINE { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Language { get; set; }
        public string Supplier_ID { get; set; }
        public string SupplierName { get; set; }

        internal ResultAPI SaveUserProfile(string language, string fullName)
        {
            string reqBody = CreateUpdateProfileMsg(language, fullName);
            ResultAPI ra = Call_PATCH_USER(reqBody);
            return ra;
        }

        private string CreateUpdateProfileMsg(string language, string fullName)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\r\n\t\"SUPNAME\":");
            sb.Append("\"" + this.Supplier_ID + "\",");
            sb.Append("\r\n\t\"SUPPERSONNEL_SUBFORM\": [");
            sb.Append("\r\n\t{");
            sb.Append("\r\n\t\"NAME\":");
            sb.Append("\"" + this.FullName + "\",");
            sb.Append("\r\n\t\"EFI_PORTALDEF_SUBFORM\": ["); 
            sb.Append("\r\n\t{");
            sb.Append("\r\n\t\"DEF\":");
            sb.Append(this.LINE + ",");
            sb.Append("\r\n\t\"USEREMAIL\":");
            sb.Append("\"" + this.Email + "\",");
            sb.Append("\r\n\t\"LANGUAGE\":");
            sb.Append("\"" + language + "\"");
            sb.Append("\r\n\t}");
            sb.Append("\r\n\t]"); //END EFI_PORTALDEF_SUBFORM
            sb.Append("\r\n\t}");
            sb.Append("\r\n\t]");//END SUPPERSONNEL_SUBFORM
            sb.Append("\r\n\t}");// END form
            return sb.ToString();

            /*
{
	"SUPNAME":"20523",
	"SUPPERSONNEL_SUBFORM": 
	[
		{
		"NAME":"אסנת",
		"EFI_PORTALDEF_SUBFORM":[
									{
										"USEREMAIL":"English",
										"LANGUAGE":"English"
									}
								]
		}
	]
}             
             */
        }

        public string Error { get; set; }

        internal void UserLogin()
        {
            Dal d = new Dal();
            IsAuthenticated = false;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_UserLogin", new SqlParameter("@email", Email), new SqlParameter("@pass", Password));
                while (dr.Read())
                {
                    PRIORITY_ID = Convert.ToInt32(dr["PHONE"].ToString());
                    LINE = Convert.ToInt32(dr["DEF"].ToString());
                    Supplier_ID = dr["SUPNAME"].ToString();
                    SupplierName = dr["SUPDES"].ToString();
                    FullName = dr["NAME"].ToString();
                    Language = dr["LANGUAGE"].ToString();
                    IsAuthenticated = true;
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("UserLogin ==> SP = LMNS_UserLogin ==> @email = " + Email + " @pass = " + Password, ex);
            }
        }
    }
}