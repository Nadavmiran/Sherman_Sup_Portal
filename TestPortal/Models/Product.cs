using LMNS.App.Log;
using LMNS.Priority.API;
using LMNS.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Product : PriorityAPI
    {
        public int OrderID { get; set; }
        public string OrderNumber { get; set; }
        public int LINE { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public int TotalAmountInOrder { get; set; }
        public int LeftAmountToDeliver { get; set; }
        public string SupplyDate { get; set; } // תאריך אספקה
        public string EstimateSupplyDate { get; set; } // תאריך צפוי לאספקה
        public string LineStatus { get; set; }
        public string TYPE { get; set; } // P/R
        public string REVNUM { get; set; } //מהדורה
        public int REV { get; set; } //מהדורה - קוד

        internal List<Product> GetOrderItems(int parentRowKey)
        {
            Dal d = new Dal();
            List<Product> lst = new List<Product>();
            Product obj = null;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_GetOrderItems", new SqlParameter("@ord", parentRowKey));
                while (dr.Read())
                {
                    obj = new Product();
                    obj.LINE = Convert.ToInt32(dr["LINE"].ToString());
                    obj.OrderID = parentRowKey;
                    obj.ProductID = Convert.ToInt32(dr["PART"].ToString());
                    obj.ProductName = dr["PARTNAME"].ToString();
                    obj.TYPE = dr["TYPE"].ToString();
                    obj.ProductDescription = dr["PARTDES"].ToString();
                    obj.TotalAmountInOrder = Convert.ToInt32(dr["TQUANT"].ToString());
                    obj.LeftAmountToDeliver = Convert.ToInt32(dr["TBALANCE"].ToString());
                    obj.SupplyDate = dr["REQDATE"].ToString();
                    obj.EstimateSupplyDate = dr["ARRDATE"].ToString();
                    obj.REVNUM = dr["REVNUM"].ToString();
                    if (string.IsNullOrEmpty(dr["REV"].ToString()))
                        obj.REV = 0;
                    else
                        obj.REV = Convert.ToInt32(dr["REV"].ToString());
                    lst.Add(obj);
			
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetOrderItems ==> SP = LMNS_GetOrderItems ==> ORD [key] = " + parentRowKey, ex);
            }
            return lst;
        }

        internal Product GetProductDetailse(int orderID, int prodId, int ordLine)
        {
            Dal d = new Dal();
            Product obj = null;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_GetProductDetails", new SqlParameter("@ord", orderID), new SqlParameter("@prodId", prodId), new SqlParameter("@ordeLine", ordLine));
                while (dr.Read())
                {
                    obj = new Product();
                    obj.OrderID = orderID;
                    obj.ProductID = prodId;
                    obj.LINE = ordLine;
                    obj.ProductName = dr["PARTNAME"].ToString();
                    obj.TYPE = dr["TYPE"].ToString();
                    obj.ProductDescription = dr["PARTDES"].ToString();
                    obj.TotalAmountInOrder = Convert.ToInt32(dr["TQUANT"].ToString());
                    obj.LeftAmountToDeliver = Convert.ToInt32(dr["TBALANCE"].ToString());
                    obj.SupplyDate = dr["REQDATE"].ToString();
                    obj.EstimateSupplyDate = dr["ARRDATE"].ToString();
                    obj.REVNUM = dr["REVNUM"].ToString();
                    if (string.IsNullOrEmpty(dr["REV"].ToString()))
                        obj.REV = 0;
                    else
                        obj.REV = Convert.ToInt32(dr["REV"].ToString());
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetProductDetailse ==> SP = LMNS_GetProductDetails ==> ORD [key] = " + orderID + " ==> @prodId = " + prodId + " Line = " + ordLine, ex);
            }
            return obj;
        }

        
    }
}