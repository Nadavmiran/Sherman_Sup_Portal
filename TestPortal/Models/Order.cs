using LMNS.App.Log;
using LMNS.Repositories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TestPortal.Models
{
    public class Order
    {
        public string OrderNumber { get; set; }
        public int OrderID { get; set; }
        public string OrderDescription { get; set; }
        public string OrderDate { get; set; }
        public string OrderStatus { get; set; }

        internal List<Order> GetSupplierOrders(string supplier)
        {
            Dal d = new Dal();
            List<Order> lst = new List<Order>();
            Order o = null;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_GetSupplierOrders", new SqlParameter("@supName", supplier));
                while (dr.Read())
                {
                    o = new Order();
                    o.OrderID = Convert.ToInt32(dr["ORD"].ToString());
                    o.OrderNumber = dr["ORDNAME"].ToString();
                    o.OrderDate = dr["CURDATE"].ToString();
                    o.OrderDescription = dr["CODEDES"].ToString();
                    o.OrderStatus = dr["STATDES"].ToString();
                    lst.Add(o);
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetSupplierOrders ==> SP = LMNS_GetSupplierOrders ==> supplier = " + supplier, ex);
            }
            return lst;
        }

        internal Order GetOrderDetails(int orderID)
        {
            Dal d = new Dal();
            Order o = null;
            try
            {
                SqlDataReader dr = d.GetRecordSet("LMNS_GetOrderDetails", new SqlParameter("@ord", orderID));
                while (dr.Read())
                {
                    o = new Order();
                    o.OrderID = Convert.ToInt32(dr["ORD"].ToString());
                    o.OrderNumber = dr["ORDNAME"].ToString();
                    o.OrderDate = dr["CURDATE"].ToString();
                    o.OrderDescription = dr["CODEDES"].ToString();
                    o.OrderStatus = dr["STATDES"].ToString();
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("OrderDetails ==> SP = LMNS_GetOrderDetails ==> ord = " + orderID, ex);
            }
            return o;
        }
    }
}