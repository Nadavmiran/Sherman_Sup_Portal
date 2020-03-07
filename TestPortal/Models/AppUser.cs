using LMNS.App.Log;
using LMNS.Repositories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class AppUser
    {
        public bool IsAuthenticated { get; set; }
        public int PRIORITY_ID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Language { get; set; }
        public int Supplier_ID { get; set; }
        public string SupplierName { get; set; }
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
                    Supplier_ID = Convert.ToInt32(dr["SUPNAME"].ToString());
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