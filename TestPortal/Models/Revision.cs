using LMNS.App.Log;
using LMNS.Repositories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Revision
    {
        public int ORD { get; set; }
        public int PART { get; set; }
        public int REV { get; set; }
        public int LOCATION { get; set; }
        public string QACODE { get; set; }
        public string QADES { get; set; }
        public string SHR_TEST { get; set; }
        public string MEASURECODE { get; set; }
        public string MEASUREDES { get; set; }
        public string REQUIRED_RESULT { get; set; }
        public string REMARKS { get; set; }
        public string EXTFILENAME { get; set; }

        internal List<Revision> GetProdRevisionList(int prodId, int revId)
        {
            Dal d = new Dal();
            List<Revision> lst = new List<Revision>();
            Revision obj = null;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_GetProductTestsList", new SqlParameter("@partId", prodId), new SqlParameter("@revId", revId));
                while (dr.Read())
                {
                    obj = new Revision();
                    obj.PART = prodId;
                    obj.EXTFILENAME = dr["EXTFILENAME"].ToString();
                    obj.LOCATION = Convert.ToInt32(dr["Location"].ToString());
                    obj.MEASURECODE = dr["MEASURECODE"].ToString();
                    obj.MEASUREDES = dr["MEASUREDES"].ToString();
                    obj.QACODE = dr["QACODE"].ToString();
                    obj.QADES = dr["QADES"].ToString();
                    obj.REMARKS = dr["REMARKS"].ToString();
                    obj.REQUIRED_RESULT = dr["REQUIRED_RESULT"].ToString();
                    obj.REV = revId;
                    obj.SHR_TEST = dr["SHR_TEST"].ToString();
                    lst.Add(obj);
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetProdRevisionList ==> SP = LMNS_GetProductTestsList ==> PART [key] = " + prodId + " ==> @revId = " + revId, ex);
            }
            return lst;
        }
    }
}