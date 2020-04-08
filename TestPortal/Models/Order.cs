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
    public class Order : PriorityAPI
    {
        public string OrderNumber { get; set; }
        public int OrderID { get; set; }
        public string OrderDescription { get; set; }
        public string OrderDate { get; set; }
        public string OrderStatus { get; set; }
        
        public string ORDNAME { get; set; }
        public string STATDES { get; set; }
        public DateTime? CURDATE { get; set; }
        public string pageCURDATE
        {
            get
            {
                if (!CURDATE.HasValue)
                    return string.Empty;

                return new DateTime(CURDATE.Value.Year, CURDATE.Value.Month, CURDATE.Value.Day).ToShortDateString();
            }
        }
        public int ORD { get; set; }
        public string CODEDES { get; set; }
        public string SUPNAME { get; set; }
        public string CDES { get; set; }
        public string SHR_SUPTYPEDES { get; set; }
        public string OWNERLOGIN { get; set; }
        public OrderItems[] PORDERITEMS_SUBFORM { get; set; }
        public Attachments[] EXTFILES_SUBFORM { get; set; }

        internal List<Order> GetSupplierOrders(string supplier)
        {
            OrdersWarpper ow = null;
            try
            {
                string query = "/PORDERS?$filter=SUPNAME eq '" + supplier + "' and(STATDES eq 'מאושרת' or STATDES eq 'נשלחה-עדכון' or STATDES eq 'נשלחה' or STATDES eq 'אישור ספק' or STATDES eq 'פתיחה חוזרת' or STATDES eq 'מוקפאת')&$select=ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)";
                string res = Call_Get(query);

                ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
                if((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
                {
                    return ow.Value;
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetSupplierOrders ==> SP = LMNS_GetSupplierOrders ==> supplier = " + supplier, ex);
            }
            return new List<Order>();
        }

        internal Order GetOrderDetails(int orderID)
        {
            //"/PORDERS?$filter=ORD eq " + orderID + "&$expand=EXTFILES_SUBFORM,PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)";
            string query = "/PORDERS?$filter=ORD eq " + orderID + "&$select=ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)";
            string res = Call_Get(query);

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            return ow.Value[0];
        }

        internal Order GetOrderProductDetails(int orderID, string prodName)
        {
            string query = "/PORDERS?$filter=ORD eq  " + orderID + "&$select=ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=EXTFILES_SUBFORM($filter=SHR_PARTNAME eq '" + prodName + "'),PORDERITEMS_SUBFORM($filter=PARTNAME eq '" + prodName + "';$expand=PORDERITEMSTEXT_SUBFORM)";
            string res = Call_Get(query);

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            return ow.Value[0];
        }
    }

    public class OrdersWarpper : ODataBase
    {
        public List<Order> Value { get; set; }
    }
}