using LMNS.App.Log;
using LMNS.Priority.API;
using LMNS.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
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

                return pageDateFormat(CURDATE);
            }
        }
        public int ORD { get; set; }
        public string CODEDES { get; set; }
        public string SUPNAME { get; set; }
        public string CDES { get; set; }
        public string SHR_SUPTYPEDES { get; set; }
        public string OWNERLOGIN { get; set; }
        public string TYPECODE { get; set; }
        public string TYPEDES { get; set; }
        public string EFI_ESTATDES { get; set; }
        public string EFI_ETYPEDES { get; set; }
        /// <summary>
        /// מהדורה נוכחית
        /// </summary>
        public int CURVERSION { get; set; }
        public OrderItems[] PORDERITEMS_SUBFORM { get; set; }
        public Attachments[] EXTFILES_SUBFORM { get; set; }
        public PORDERSTEXT[] PORDERSTEXT_SUBFORM { get; set; }
        internal List<Order> GetSupplierOrders(string supplier)
        {
            OrdersWarpper ow = null;
            string portalOrderStatus = GetOrderStatus();
            if(string.IsNullOrEmpty(portalOrderStatus))
            {
                AppLogger.log.Error("GetSupplierOrders ==> No oreders status were found!!!");
                return new List<Order>();
            }
            try
            {//STATDES eq 'מאושרת' or STATDES eq 'נשלחה-עדכון' or STATDES eq 'נשלחה' or STATDES eq 'אישור ספק' or STATDES eq 'פתיחה חוזרת' or STATDES eq 'מוקפאת'
                string query = "/PORDERS?$filter=SUPNAME eq '" + supplier + "' and CLOSEDBOOL ne 'Y' and(" + portalOrderStatus + ")&$select=EFI_ETYPEDES, EFI_ESTATDES,CURVERSION, TYPEDES, CLOSEDBOOL, ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=PORDERITEMS_SUBFORM($filter=CLOSEDBOOL ne 'Y';$expand=PORDERITEMSTEXT_SUBFORM)";
                string res = Call_Get(query);

                ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
                if((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
                {
                    return ow.Value;
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetSupplierOrders ==> supplier = " + supplier, ex);
            }
            return new List<Order>();
        }

        private string GetOrderStatus()
        {
            OrderStatusWarpper ow = null;
            StringBuilder sb = new StringBuilder();
            string query = "/PORDSTATS?$filter=EFI_WEBENABLE eq 'Y'";
            int indx = 0;
            try
            {
                string res = Call_Get(query);

                ow = JsonConvert.DeserializeObject<OrderStatusWarpper>(res);
                if ((null != ow) && (null != ow.Value) && (ow.Value.Count > 0))
                {
                    foreach (OrderStatus item in ow.Value)
                    {
                        sb.Append("STATDES eq '");
                        sb.Append(item.STATDES);
                        sb.Append("'");
                        indx++;
                        if (indx < ow.Value.Count)
                            sb.Append(" or ");
                    }
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Error("GetOrderStatus ==> Error!! => ", ex);
            }
            return sb.ToString();
        }

        internal Order GetOrderDetails(int orderID)
        {
            //"/PORDERS?$filter=ORD eq " + orderID + "&$expand=EXTFILES_SUBFORM,PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)";
            string query = "/PORDERS?$filter=ORD eq " + orderID + "&$select=EFI_ETYPEDES, EFI_ESTATDES, CURVERSION, TYPECODE, TYPEDES, ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=PORDERITEMS_SUBFORM($filter=CLOSEDBOOL ne 'Y';$expand=PORDERITEMSTEXT_SUBFORM),PORDERSTEXT_SUBFORM";
            string res = Call_Get(query);

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            return ow.Value[0];
        }

        internal Order GetOrderProductDetails(int orderID, string prodName)
        {
            string query = "/PORDERS?$filter=ORD eq  " + orderID + "&$select=CURVERSION, TYPECODE, TYPEDES, ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=EXTFILES_SUBFORM($filter=SHR_PARTNAME eq '" + prodName + "'),PORDERITEMS_SUBFORM($filter=PARTNAME eq '" + prodName + "';$expand=PORDERITEMSTEXT_SUBFORM)";
            string res = Call_Get(query);

            OrdersWarpper ow = JsonConvert.DeserializeObject<OrdersWarpper>(res);
            return ow.Value[0];
        }

        internal List<OrderAttachment> GetOrderAttachments(string ORDNAME)
        {
            string query = "/PORDERS?$filter=ORDNAME eq '" + ORDNAME + "'&$select=ORDNAME&$expand=EXTFILES_SUBFORM&($filter=SHR_PURCH_FLAG eq 'Y')";
            string res = Call_Get(query);

            AttachmentWarpper ow = JsonConvert.DeserializeObject<AttachmentWarpper>(res);
            return ow.Value;
        }

        internal Order GetOrderProductDetailsByLine(int orderID, string prodName, int ordLine)
        {
            string query = "/PORDERS?$filter=ORD eq  " + orderID + "&$select=EFI_ETYPEDES, EFI_ESTATDES,CURVERSION, TYPECODE, TYPEDES, ORDNAME,STATDES,CURDATE,ORD,CODEDES,SUPNAME,CDES,SHR_SUPTYPEDES,OWNERLOGIN&$expand=EXTFILES_SUBFORM($filter=SHR_PARTNAME eq '" + prodName + "'),PORDERITEMS_SUBFORM($filter=PARTNAME eq '" + prodName + "' and LINE eq " + ordLine + ";$expand=PORDERITEMSTEXT_SUBFORM),PORDERSTEXT_SUBFORM";
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