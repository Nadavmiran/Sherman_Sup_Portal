using LMNS.App.Log;
using LMNS.Priority.API;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Configuration;

namespace TestPortal.Models
{
    public partial class CommonController : Controller
    {
        public ActionResult UserProfile()
        {
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            return View(po);
        }

        [HttpGet]
        public ActionResult TestProduct(int orderID, string orderNumber)
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
            {
                //return View(GetOrder(orderID, orderNumber));
                return PartialView("_TestProduct");
            }
        }

        [HttpPost]
        public ActionResult PostTestProduct(int orderID, string orderNumber)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));

            return Json(GetOrder(orderID, orderNumber));
        }

        private PageObject GetOrder(int orderID, string orderNumber)
        {
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            OrderType oi = null;
            po.objSample = new Sample();
            po.lstOrderAttachments = new List<OrderAttachment>();
            po.User = Session["USER_LOGIN"] as AppUser;
            o.UserLanguage = po.User.Language;
            po.objOrder = o.GetOrderDetails(orderID);
            if (null != po.objOrder)
            {
                po.lstOrderAttachments = o.GetOrderAttachments(po.objOrder.ORDNAME);
                if (null != po.lstOrderAttachments && po.lstOrderAttachments.Count > 0)
                {
                    if (null != po.lstOrderAttachments[0].EXTFILES_SUBFORM && po.lstOrderAttachments[0].EXTFILES_SUBFORM.Count > 0)
                    {
                        foreach (Attachments item in po.lstOrderAttachments[0].EXTFILES_SUBFORM)
                        {
                            string[] arr = item.EXTFILENAME.Split('\\');
                            if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                            {
                                item.FILE_NAME = arr[0];
                                item.FOLDER = arr[1];
                            }
                            else
                            {
                                if (arr.Length == 3)
                                {
                                    item.FILE_NAME = arr[arr.Length - 1];
                                    item.FOLDER = arr[arr.Length - 2];
                                }
                                if (arr.Length == 4)
                                {
                                    item.FILE_NAME = arr[arr.Length - 1];
                                    item.FOLDER = arr[arr.Length - 3] + @"\" + arr[arr.Length - 2];
                                }
                            }
                        }
                    }
                }
                if ((null != po.objOrder.PORDERSTEXT_SUBFORM) && (po.objOrder.PORDERSTEXT_SUBFORM.Length > 0))
                {
                    foreach (PORDERSTEXT item in po.objOrder.PORDERSTEXT_SUBFORM)
                    {
                        po.objOrderText += item.TEXT.Replace("Pdir", "P dir").Replace("dir", " dir");
                        //po.objOrderText += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir").Replace("dir", " dir");
                    }
                }
                if (null != po.objOrder.PORDERITEMS_SUBFORM)
                {
                    po.lstItemsObject = new List<OrderItems>();
                    po.lstItemsObject.AddRange(po.objOrder.PORDERITEMS_SUBFORM);
                    foreach (OrderItems item in po.lstItemsObject)
                    {
                        item.ORD = po.objOrder.ORD;
                        item.ORDNAME = po.objOrder.ORDNAME;
                    }
                }

                if(!string.IsNullOrEmpty(po.objOrder.TYPECODE))
                {
                    oi = new OrderType();
                    if (po.User.Language.Equals("English"))
                        po.htmlText = oi.GetOrderTypeText_EN(po.objOrder.TYPECODE);
                    else
                        po.htmlText = oi.GetOrderTypeText(po.objOrder.TYPECODE);
                }
            }
            return po;
        }

        [HttpPost]
        public JsonResult GetOrdersData(string supplier)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            Order ord = new Order();
            po.User = Session["USER_LOGIN"] as AppUser;
            ord.UserLanguage = po.User.Language;
            po.lstOrderObject = ord.GetSupplierOrders(supplier);
            po.lstItemsObject = new List<OrderItems>();
            foreach (Order obj in po.lstOrderObject)
            {
                if (null == obj.PORDERITEMS_SUBFORM)
                    continue;

                List<SHR_OPENSUPORDERS_T> lstLog = GetOrderLineUpdates(obj.ORDNAME);
                for (int i = 0; i < obj.PORDERITEMS_SUBFORM.Length; i++)
                {
                    if (null == lstLog)
                        obj.PORDERITEMS_SUBFORM[i].SumOrdLineUpdates = 0;
                    else
                    {
                        try
                        {
                            obj.PORDERITEMS_SUBFORM[i].SumOrdLineUpdates = lstLog.Where(x => x.ORDI == obj.PORDERITEMS_SUBFORM[i].ORDI).SingleOrDefault().SHR_DUEDATELOG_SUBFORM.Length;
                        }
                        catch (Exception ex)
                        {
                            AppLogger.log.Info("IN GetOrdersData ==> Try to get sum of log chenges for order ORDNAME = " + obj.ORDNAME, ex);
                            obj.PORDERITEMS_SUBFORM[i].SumOrdLineUpdates = lstLog.Count(x => x.ORDI == obj.PORDERITEMS_SUBFORM[i].ORDI);
                        }
                    }
                    obj.PORDERITEMS_SUBFORM[i].ORDNAME = obj.ORDNAME;
                    obj.PORDERITEMS_SUBFORM[i].ORD = obj.ORD;
                    
                }
                po.lstItemsObject.AddRange(obj.PORDERITEMS_SUBFORM);
            }
            //PORDERS?$filter=SUPNAME eq '22000' and (STATDES eq 'מאושרת' or STATDES eq 'נשלחה-עדכון' or STATDES eq 'נשלחה' or STATDES eq 'אישור ספק' or STATDES eq 'פתיחה חוזרת' or STATDES eq 'מוקפאת')&$expand=PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)

            return Json(po);
        }

        private List<SHR_OPENSUPORDERS_T> GetOrderLineUpdates(string ORDNAME)
        {
            OrderItems oi = new OrderItems();
            string res = oi.Call_Get("/SHR_OPENSUPORDERS_T?$filter=ORDNAME eq '" + ORDNAME + "'&$expand=SHR_DUEDATELOG_SUBFORM($filter=USERLOGIN eq '" + ConfigurationManager.AppSettings["AppAPI_U"].ToString() + "')");
            SHR_OPENSUPORDERS_T_Warpper ow = JsonConvert.DeserializeObject<SHR_OPENSUPORDERS_T_Warpper>(res);
            if (null == ow || ow.Value.Count == 0)
                return null;

            return  ow.Value;
        }

        public ActionResult TestProductItem(int orderID, string prodName, int ordLine)
        {
           if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");

            return View("TestProduct", getProductTestData(orderID, prodName, ordLine));
        }

        [HttpPost]
        public JsonResult GetSalesorderDetail(int orderID, string prodName, int ordLine)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            Order o = new Order();
            //Product p = new Product();
            DelayReason d = new DelayReason();
            po.lstAttachments = new List<Attachments>();
            po.lstOrderAttachments = new List<OrderAttachment>();
            o.UserLanguage = po.User.Language;
            d.UserLanguage = po.User.Language;
            s.UserLanguage = po.User.Language;
            po.objOrder = o.GetOrderProductDetailsByLine(orderID, prodName, ordLine);
            po.lstDelayReason = d.GetDelayReasons();
            po.lstOrderAttachments = o.GetOrderAttachments(po.objOrder.ORDNAME);

            if (null != po.lstOrderAttachments && po.lstOrderAttachments.Count > 0)
                if (null != po.lstOrderAttachments[0].EXTFILES_SUBFORM && po.lstOrderAttachments[0].EXTFILES_SUBFORM.Count > 0)
                {
                    foreach (Attachments item in po.lstOrderAttachments[0].EXTFILES_SUBFORM)
                    {
                        string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                        if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                        {
                            item.FILE_NAME = arr[0];
                            item.FOLDER = arr[1];
                        }
                        else
                        {
                            if (arr.Length == 3)
                            {
                                item.FILE_NAME = arr[arr.Length - 1];
                                item.FOLDER = arr[arr.Length - 2];
                            }
                            if (arr.Length == 4)
                            {
                                item.FILE_NAME = arr[arr.Length - 1];
                                item.FOLDER = arr[arr.Length - 3] + @"\" + arr[arr.Length - 2];
                            }
                        }
                    }
                }
            if (!string.IsNullOrEmpty(po.objOrder.TYPECODE))
            {
                OrderType oi = new OrderType();
                if(po.User.Language.Equals("English"))
                    po.htmlText = oi.GetOrderTypeText_EN(po.objOrder.TYPECODE);
                else
                    po.htmlText = oi.GetOrderTypeText(po.objOrder.TYPECODE);
            }

            if ((null != po.objOrder.PORDERSTEXT_SUBFORM) && (po.objOrder.PORDERSTEXT_SUBFORM.Length > 0))
            {
                foreach (PORDERSTEXT item in po.objOrder.PORDERSTEXT_SUBFORM)
                {
                    po.objOrderText += item.TEXT.Replace("Pdir", "P dir").Replace("dir", " dir");
                    //po.objOrderText += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir").Replace("dir", " dir");
                }
            }

            if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
            {
                po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];
                po.objProduct.ORD = po.objOrder.ORD;
                po.objProduct.ORDNAME = po.objOrder.ORDNAME;
                po.objProduct.SHR_SUP_REMARKS = po.objProduct.GerSupplierRemarks(po.objOrder.ORDNAME, po.objProduct.KLINE);
                // Get order line text
                if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
                {
                    po.objItemText = new OrdersItemText();
                    foreach (OrdersItemText item in po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM)
                    {
                        po.objItemText.TEXT += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir");
                    }
                }
            }
            return Json(po);
        }

        [HttpPost]
        public JsonResult PostTestProductItem(int orderID, string prodName, int ordLine)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            return Json(getPostProductTestData(orderID, prodName, ordLine));
        }

        private object getPostProductTestData(int orderID, string prodName, int ordLine)
        {
            Sample s = new Sample();
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            DelayReason d = new DelayReason();
            po.lstAttachments = new List<Attachments>();
            po.lstOrderAttachments = new List<OrderAttachment>();
            po.User = Session["USER_LOGIN"] as AppUser;
            o.UserLanguage = po.User.Language;
            d.UserLanguage = po.User.Language;
            s.UserLanguage = po.User.Language;
            po.objOrder = o.GetOrderProductDetails(orderID, prodName);
            po.lstDelayReason = d.GetDelayReasons();
            po.lstOrderAttachments = o.GetOrderAttachments(po.objOrder.ORDNAME);
            if(null != po.lstOrderAttachments && po.lstOrderAttachments.Count > 0)
                if(null != po.lstOrderAttachments[0].EXTFILES_SUBFORM && po.lstOrderAttachments[0].EXTFILES_SUBFORM.Count > 0)
                {
                    foreach (Attachments item in po.lstOrderAttachments[0].EXTFILES_SUBFORM)
                    {
                        string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                        if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                        {
                            item.FILE_NAME = arr[0];
                            item.FOLDER = arr[1];
                        }
                        else
                        {
                            if (arr.Length == 3)
                            {
                                item.FILE_NAME = arr[arr.Length - 1];
                                item.FOLDER = arr[arr.Length - 2];
                            }
                            if (arr.Length == 4)
                            {
                                item.FILE_NAME = arr[arr.Length - 1];
                                item.FOLDER = arr[arr.Length - 3] + @"\" + arr[arr.Length - 2];
                            }
                        }
                    }
                }
            if (!string.IsNullOrEmpty(po.objOrder.TYPECODE))
            {
                OrderType oi = new OrderType();
                if (po.User.Language.Equals("English"))
                    po.htmlText = oi.GetOrderTypeText_EN(po.objOrder.TYPECODE);
                else
                    po.htmlText = oi.GetOrderTypeText(po.objOrder.TYPECODE);
            }

            if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
            {
                po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];
                po.objProduct.ORD = po.objOrder.ORD;
                po.objProduct.ORDNAME = po.objOrder.ORDNAME;
                // Get order line text
                if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
                {
                    po.objItemText = new OrdersItemText();
                    foreach (OrdersItemText item in po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM)
                    {
                        po.objItemText.TEXT += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir");
                    }
                }

                if (null != po.objProduct)
                {
                    GetProductObjAndSamples(po.objOrder.OrderID, po.objOrder.OrderNumber, po.objProduct.PARTNAME, ordLine, ref po);
                }

                // Get Sampels
                if ((null != po.objSample) && (null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM) && (po.objSample.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                {
                    foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                    {
                        item.DOCNO = po.objSample.DOCNO;
                        item.SUPNAME = po.objSample.SUPNAME;
                        item.PARTNAME = po.objSample.PARTNAME;
                    }
                }
            }
            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }
            else
            {
                po.lstAttachments = new List<Attachments>();
                po.lstAttachments.AddRange(po.objOrder.EXTFILES_SUBFORM);
                foreach (Attachments item in po.lstAttachments)
                {
                    string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                    if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                    {
                        item.FILE_NAME = arr[0];
                        item.FOLDER = arr[1];
                    }
                    else
                    {
                        item.FILE_NAME = arr[arr.Length - 1];
                        item.FOLDER = arr[arr.Length - 2];
                    }
                }
            }
            return po;
        }

        [HttpPost]
        public JsonResult TestProductItemData(int orderID, string prodName, int ordLine)
        {
            return Json(getProductTestData(orderID, prodName, ordLine));
        }

        private PageObject getProductTestData(int orderID, string prodName, int ordLine)
        {
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            o.UserLanguage = po.User.Language;
            po.objOrder = o.GetOrderDetails(orderID);
            po.lstItemsObject = new List<OrderItems>();

            if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
            {
                for (int i = 0; i < po.objOrder.PORDERITEMS_SUBFORM.Length; i++)
                {
                    po.objOrder.PORDERITEMS_SUBFORM[i].ORD = po.objOrder.ORD;
                    po.objOrder.PORDERITEMS_SUBFORM[i].ORDNAME = po.objOrder.ORDNAME;
                }
            }

            po.lstItemsObject.AddRange(po.objOrder.PORDERITEMS_SUBFORM);
            po.objProduct = po.lstItemsObject.Where(x => x.ORD == orderID && x.LINE == ordLine).SingleOrDefault();
            if (null != po.objProduct)
            {
                GetProductObjAndSamples(po.objOrder.OrderID, po.objOrder.OrderNumber, po.objProduct.PARTNAME, ordLine, ref po);
            }
            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }

            return po;
        }

        private void GetProductObjAndSamples(int orderID, string orderName, string prodName, int ordLine, ref PageObject po)
        {
            Sample s = new Sample();
            Order o = new Order();
            if (null != po.objOrder)
            {
                try
                {
                    if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
                    {
                        po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];
                        po.objProduct.ORD = po.objOrder.ORD;
                        po.objProduct.ORDNAME = po.objOrder.ORDNAME;
                        po.objSample = s.GetProductSamples(po.User.Supplier_ID, po.objOrder.ORDNAME, po.objProduct.PARTNAME, ordLine);

                        if ((null != po.objSample) && (!string.IsNullOrEmpty(po.objSample.DOCNO)))
                        {
                            //po.objSample.pageCURDATE = po.objSample.CURDATE.ToShortDateString();
                            foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                            {
                                item.DOCNO = po.objSample.DOCNO;
                                item.SUPNAME = po.objSample.SUPNAME;
                                item.PARTNAME = po.objSample.PARTNAME;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    AppLogger.log.Info("GetProductObjAndSamples ==> exeption = ", ex);
                }
            }
        }

        private void GetProductAttachments(int orderID, string prodName, ref PageObject po)
        {
            Attachments attch = new Attachments();
            po.lstAttachments = new List<Attachments>();
            po.lstAttachments = attch.GetProductAttachments(orderID, prodName);
            foreach (Attachments item in po.lstAttachments)
            {
                string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                {
                    item.FILE_NAME = arr[0];
                    item.FOLDER = arr[1];
                }
                else
                {
                    item.FILE_NAME = arr[arr.Length - 1];
                    for (int i = 1; i < arr.Length - 1; i++)
                    {
                        item.FOLDER += arr[i] + "\\";
                    }
                    //item.FOLDER = arr[arr.Length - 2];
                }
            }
        }

        //[HttpPost]
        //public JsonResult GetProductRevisionList(int prodId, int revId)
        //{

        //    Revision r = new Revision();
        //    PageObject po = new PageObject();
        //    po.lstRevision = r.GetProdRevisionList(prodId, revId);
        //    return Json(po);
        //}

        [HttpPost]
        public JsonResult GetOrderProductTests(string prodName, string supplier, string qaCode)
        {
            //MED_SAMPLE?$filter=PARTNAME eq '23559000' and SUPNAME eq '20523'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '007';$expand=MED_RESULTDET_SUBFORM)

            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            po.objSample = s.GetOrderProductTests(prodName, supplier, qaCode);
            return Json(po);
        }

        [HttpPost]
        public JsonResult GetOrderProductTestsByDoc(string DOCNO, string qaCode)
        {
            //MED_SAMPLE?$filter=PARTNAME eq '23559000' and SUPNAME eq '20523'&$expand=MED_TRANSSAMPLEQA_SUBFORM($filter=QACODE eq '007';$expand=MED_RESULTDET_SUBFORM)
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            po.objSample = s.GetOrderProductTests(DOCNO, qaCode);
            return Json(po);
        }

        [HttpPost]
        public JsonResult SaveTest(string data)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            SampleTestMsgWarpper ow = JsonConvert.DeserializeObject<SampleTestMsgWarpper>(data);
            ResultAPI ra = s.UpdateTest(ow.form[0], ow.SUB_RES);

            if (ra.ResultStatus.ToUpper().Equals("OK"))
            {
                s = s.GetProductSamples(ow.form[0].hdnQaDOCNO);
                if ((null != s) && (null != s.MED_TRANSSAMPLEQA_SUBFORM) && (s.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                {
                    foreach (Sample_QA item in s.MED_TRANSSAMPLEQA_SUBFORM)
                    {
                        item.DOCNO = s.DOCNO;
                        item.SUPNAME = s.SUPNAME;
                        item.PARTNAME = s.PARTNAME;
                    }
                    ra.ResultData = s;
                }
                if(null != s && null != s.MED_EXTFILES_SUBFORM && s.MED_EXTFILES_SUBFORM.Count > 0)
                {
                    foreach (SampleAttachments item in s.MED_EXTFILES_SUBFORM)
                    {
                        string[] arr = item.EXTFILENAME.Split('\\');
                        if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                        {
                            //item.FILE_NAME = arr[0];
                            item.FOLDER = arr[1];
                        }
                        else
                        {
                            switch (arr.Length)
                            {
                                case 3:
                                    item.FOLDER = arr[arr.Length - 2];
                                    break;
                                case 4:
                                    item.FOLDER = arr[arr.Length - 3] + @"\" + arr[arr.Length - 2];
                                    break;
                                default:
                                    item.FOLDER = arr[arr.Length - 2];
                                    break;
                            }
                        }
                    }
                }
            }
            return Json(ra);
        }

        [HttpPost]
        public ActionResult Download(string fileFolder, string fileName)
        {
            AppLogger.log.Info("Function => Download ==> fileFolder = " + fileFolder);
            AppLogger.log.Info("Function => Download ==> fileName = " + fileName);
            string filePath = string.Empty;
            string fpath = string.Empty;
            try
            {
                filePath = Path.Combine(Server.MapPath("~/PriorityDocs"), fileFolder  + "/" + fileName);
                AppLogger.log.Info("Function => Download ==> filePath = " + filePath);
                            }
            catch (Exception ex)
            {
                AppLogger.log.Info("filePath = Exception", ex);
                return Json(new { status = "error", message = "error creating folder path" });
            }
            string filename = fileName;
            byte[] filedata = null;

            try
            {
                
                
                FileStream fs = System.IO.File.OpenRead(filePath);
                filedata = new byte[fs.Length];
                //return View();
            }
            catch (Exception ex)
            {
                AppLogger.log.Info("Function => Download ==> ReadAllBytes = " + filePath);
                AppLogger.log.Info("filePath ==> ReadAllBytes ==> Exception", ex);
                return Json(new { status = "error", message = "error reading from folder" });
            }

            string contentType = MimeMapping.GetMimeMapping(filePath);
            var content_type = "";
            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = true,
            };

            Response.Clear();
            Response.ClearContent();
            Response.Buffer = true;
            Response.ClearHeaders();

            if (filePath.Contains(".doc"))
            {
                content_type = "application/msword";
            }
            else if (filePath.Contains(".docx"))
            {
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            else if (filePath.Contains(".pdf"))
            {
                content_type = "application/pdf";
            }
            else if (filePath.Contains(".xsl"))
            {
                content_type = "application/vnd.ms-excel";
            }
            else if (filePath.Contains(".jpeg") || filePath.Contains(".jpg"))
            {
                content_type = "image/jpeg";
            }
            else if (filePath.Contains(".xsl"))
            {
                content_type = "application/vnd.ms-excel";
            }
            else if (filePath.Contains(".csv"))
            {
                content_type = "text/csv";
            }
            else if (filePath.Contains(".bmp"))
            {
                content_type = "image/x-windows-bmp";
            }
            else if (filePath.Contains(".xlsx"))
            {
                content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            else
                content_type = "text/plain";

            Response.ContentType = content_type;
            Response.AppendHeader("Content-Disposition", "attachment; " + cd.ToString());

            Response.TransmitFile(filePath);
            Response.End();

            return File(filedata, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        [HttpGet]//
        public virtual ActionResult DownloadFile(string fileFolder, string fileName)
        {
            AppLogger.log.Info("Function => DownloadFile ==> Server.MapPath = " + Server.MapPath("~/PriorityDocs/" + fileFolder));
            string filePath = Path.Combine(Server.MapPath("~/PriorityDocs/"), fileFolder + "/" + fileName);
            //Path.Combine(Server.MapPath("~/Docs/PriorityDocs/"), fileFolder + "/" + fileName);
            return File(filePath, "application/force-download", fileName);
        }

        [HttpPost]
        public JsonResult UploadFiles()
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            HttpFileCollectionBase files = Request.Files;
            SampleTestMsgWarpper ow = JsonConvert.DeserializeObject<SampleTestMsgWarpper>(Request.Form[0]);
            
            ResultAPI ra = null;
            //string decodedUrl = HttpUtility.UrlDecode();
            ow.files = new List<Attachments>();
            if (Request.Files.Count > 0)
            {
                //var file = Request.Files[0];
                Attachments a = null;
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    var file = Request.Files[i];
                    a = new Attachments();
                    a.UserLanguage = po.User.Language;
                    if (file != null && file.ContentLength > 0)
                    {
                        string fileName = Path.GetFileName(file.FileName);
                        //string dir = Path.Combine(Server.MapPath("~/SupDocs/" + ow.form[0].hdnQaSUPNAME + "/" + ow.form[0].hdnQaDOCNO));
                        string dir = Path.Combine(Server.MapPath("~/SupDocs/" + ow.form[0].hdnQaSUPNAME));
                        //var path = Path.Combine(Server.MapPath("~/SupDocs/" + ow.form[0].hdnQaSUPNAME + "/" + ow.form[0].hdnQaDOCNO + "/"), ow.form[0].hdnQaDOCNO + "_" + fileName);
                        var path = Path.Combine(Server.MapPath("~/SupDocs/" + ow.form[0].hdnQaSUPNAME), ow.form[0].hdnQaDOCNO + "_" + fileName);
                        if (!Directory.Exists(dir))
                            Directory.CreateDirectory(dir);

                        a.FILE_NAME = fileName.Split('.')[0];
                        a.EXTFILENAME = path;
                       file.SaveAs(path);
                        ow.files.Add(a);
                    }
                }

                ra = a.UploadSampleAttachments(ow.form[0], ow.files);
            }
            return Json(ra);
        }

        [HttpPost]
        public JsonResult CreateTest(string supName, string partName, string DOCNO, string ordName, string qaCode)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            ResultAPI ra = null;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            CreateSampleTestMsgWarpper ow = JsonConvert.DeserializeObject<CreateSampleTestMsgWarpper>(qaCode);
            if(null != ow)
            {
                if (string.IsNullOrEmpty(DOCNO))
                {
                    ra = s.Createtest(supName, ordName, partName, ow.form, po.User.FullName, true);
                }
                else
                {
                    //po.objSample = s.GetProductSamples(DOCNO);
                    //if ((null == po.objSample) || (string.IsNullOrEmpty(po.objSample.DOCNO)))
                    //    ra = s.Createtest(supName, ordName, partName, ow.form, true);
                    //else
                        ra = s.AddSampleTests(supName, ordName, partName, ow.form, false, DOCNO);

                }
                //Get the test list after creation or update
                po.objSample = s.GetProductSamples(supName, ordName, partName, 0);
                po.lstSampleObject = s.GetOrderSamples(ordName, supName, partName);
            }
            return Json(po);
        }

        [HttpPost]
        public JsonResult CreateSampleDocument(string supName, string partName, string ordName, int ordLine)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            ResultAPI ra = null;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            ra = s.CreateSampleDocument(supName, ordName, partName, ordLine);
            //Get the test list after creation or update
            po.objSample = s.GetProductSamples(supName, ordName, partName, ordLine);
            po.lstSampleObject = s.GetOrderSamples(ordName, supName, partName);
            return Json(po);
        }

        [HttpPost]
        public JsonResult GetSampleTestList(string supName, string partName, string ordName, int ordLine)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            Sample_QA sq = new Sample_QA();
            sq.UserLanguage = po.User.Language;
            po.lstSamplQA = sq.GetCommonSamplesList();
            po.objSample = s.GetProductSamples(supName, ordName, partName, ordLine);
            return Json(po);
        }

        public ActionResult QA_Page(int orderID, string orderName, string prodName, int ordLine)
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");

            return View(getProductQaData(orderID, orderName, prodName, ordLine));
        }

        private PageObject getProductQaData(int orderID, string orderName, string prodName, int ordLine)
        {
            OrderItems oi = new OrderItems();
            PageObject po = new PageObject();
            Sample s = new Sample();
            po.User = Session["USER_LOGIN"] as AppUser;
            oi.UserLanguage = po.User.Language;
            s.UserLanguage = po.User.Language;
            if (string.IsNullOrEmpty(orderName) || (orderName.Equals("undefined")))
            {
                Order o = new Order();
                o.UserLanguage = po.User.Language;
                po.objOrder = o.GetOrderDetails(orderID);
                if (null != po.objOrder)
                {
                    orderName = po.objOrder.ORDNAME;

                    // Get order line text
                    if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
                    {
                        po.objItemText = new OrdersItemText();
                        foreach (OrdersItemText item in po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM)
                        {
                            po.objItemText.TEXT += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir");
                        }
                    }
                }
            }
            //GetProductObjAndSamples(orderID, orderName, prodName, ordLine, ref po);
            po.objOrder = oi.GetProductDetailse(po.User.Supplier_ID, orderName, prodName);
            if (null == po.objOrder)
                return po;
            po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];
            po.lstSampleObject = s.GetOrderSamples(orderName, po.User.Supplier_ID, prodName);
            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }
            else
            {
                po.lstAttachments = new List<Attachments>();
                po.lstAttachments.AddRange(po.objOrder.EXTFILES_SUBFORM);
                foreach (Attachments item in po.lstAttachments)
                {
                    string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                    if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                    {
                        item.FILE_NAME = arr[0];
                        item.FOLDER = arr[1];
                    }
                    else
                    {
                        item.FILE_NAME = arr[arr.Length - 1];
                        item.FOLDER = arr[arr.Length - 2];
                    }
                }
            }

            return po;
        }

        [HttpGet]
        public ActionResult QA_Page()
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            return PartialView("_QA_Page");
        }

        [HttpPost]
        public JsonResult GetProductQaData(int orderID, string orderName, string prodName, int ordLine)
        {
            OrderItems oi = new OrderItems();
            PageObject po = new PageObject();
            Sample s = new Sample();
            
            po.User = Session["USER_LOGIN"] as AppUser;
            s.UserLanguage = oi.UserLanguage = po.User.Language;

            if (string.IsNullOrEmpty(orderName) || (orderName.Equals("undefined")))
            {
                Order o = new Order();
                o.UserLanguage = po.User.Language;
                po.objOrder = o.GetOrderDetails(orderID);
                if (null != po.objOrder)
                {
                    orderName = po.objOrder.ORDNAME;

                    // Get order line text
                    //if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
                    //{
                    //    po.objItemText = new OrdersItemText();
                    //    foreach (OrdersItemText item in po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM)
                    //    {
                    //        po.objItemText.TEXT += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir");
                    //    }
                    //}
                }
            }
            else
                po.objOrder = oi.GetProductDetailse(po.User.Supplier_ID, orderName, prodName);
            if (null == po.objOrder)
                return Json(po);

            // Get order line text
            if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
            {
                po.objItemText = new OrdersItemText();
                foreach (OrdersItemText item in po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM)
                {
                    po.objItemText.TEXT += item.TEXT.Replace(" ", "&nbsp;").Replace("Pdir", "P dir");
                }
            }

            po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];
            po.lstSampleObject = s.GetOrderSamples(orderName, po.User.Supplier_ID, prodName);

            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }
            else
            {
                po.lstAttachments = new List<Attachments>();
                po.lstAttachments.AddRange(po.objOrder.EXTFILES_SUBFORM);
                foreach (Attachments item in po.lstAttachments)
                {
                    string[] arr = item.EXTFILENAME.Split('\\'); //item.EXTFILENAME.Split(' / ');
                    if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                    {
                        item.FILE_NAME = arr[0];
                        item.FOLDER = arr[1];
                    }
                    else
                    {
                        item.FILE_NAME = arr[arr.Length - 1];
                        item.FOLDER = arr[arr.Length - 2];
                    }
                }
            }

            return Json(po);
        }

        [HttpPost]
        public JsonResult GetSampleTests(string PARTNAME, string SUPNAME, string DOCNO)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            SampleAttachments sa = new SampleAttachments();
            s.UserLanguage = po.User.Language;
            po.objSample = s.GetProductSamples(DOCNO);
            if(null != po.objSample && null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
            {
                foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                {
                    item.DOCNO = DOCNO;
                    item.SUPNAME = SUPNAME;
                    item.PARTNAME = PARTNAME;
                }
            }
            po.lstSampleAttachments = sa.GetSampleAttachments(DOCNO);
            if (null != po.lstSampleAttachments && null != po.lstSampleAttachments && po.lstSampleAttachments.Count > 0)
            {
                foreach (SampleAttachments item in po.lstSampleAttachments)
                { 
                    item.SUFFIX_TEXT = item.SUFFIX;
                    string[] arr = item.EXTFILENAME.Split('\\');
                    if (string.IsNullOrEmpty(arr[arr.Length - 1]))
                    {
                        //item.FILE_NAME = arr[0];
                        item.FOLDER = arr[1];
                    }
                    else
                    {
                        switch (arr.Length)
                        {
                            case 3:
                                item.FOLDER = arr[arr.Length - 2];
                                break;
                            case 4:
                                item.FOLDER = arr[arr.Length - 3] + @"\" + arr[arr.Length - 2];
                                break;
                            default:
                                item.FOLDER = arr[arr.Length - 2];
                                break;
                        }
                    }
                }
            }
            return Json(po);
        }

        [HttpPost]
        public JsonResult GetSampleStandardList()
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            SampleStandard s = new SampleStandard();
            SampleStatus ss = new SampleStatus();
            s.UserLanguage = ss.UserLanguage = po.User.Language;
            po.lstSampleStandard = s.GetSampleStandardList();
            po.lstSampleStatus = ss.GetSampleStatusList();
            return Json(po);
        }

        [HttpPost]
        public JsonResult UpdateSupplyDateAndDelayReason(string PARTNAME, string SUPNAME, int LINE, string ORDNAME, string REQDATE, string DELAYREASON, string SHR_SUP_REMARKS)
        {
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            OrderItems oi = new OrderItems();
            oi.UserLanguage = po.User.Language;
            oi.ORDNAME = ORDNAME;
            oi.PARTNAME = PARTNAME;
            oi.LINE = LINE;
            oi.EFI_DELAYREASON = DELAYREASON;
            oi.SHR_SUP_REMARKS = SHR_SUP_REMARKS;
            if (!string.IsNullOrEmpty(REQDATE))
                oi.REQDATE = Convert.ToDateTime(REQDATE);
            ResultAPI ra = oi.UpdateOrderLineData(SUPNAME);
            return Json(ra);
        }

        [HttpPost]
        public JsonResult UpdateSampleDetails(string STATDES,  string SAMPLE_TYPE_CODE, string EFI_SUPNO, int SHR_QUANT, string SHR_ROHS, string SHR_SAMPLE_STD_CODE, string DOCNO, string SERIALNAME, string PARTNAME)
        {
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            Sample s = new Sample();
            s.UserLanguage = po.User.Language;
            ResultAPI ra = s.UpdateSampleDetails(STATDES, SAMPLE_TYPE_CODE, EFI_SUPNO, SHR_QUANT, SHR_ROHS, SHR_SAMPLE_STD_CODE, DOCNO, SERIALNAME, PARTNAME);
            if (ra.ResultStatus.ToUpper() == "OK")
            {
                s = JsonConvert.DeserializeObject<Sample>(ra.JsonResult);
                if (null != s)
                {
                    po.objSample = s;
                    po.lstSampleObject = s.GetOrderSamples(s.EFI_PORDNAME, po.User.Supplier_ID, s.PARTNAME);
                }
            }
            else
                po.apiResultMessage = ra.ErrorDescription;
            return Json(po);
        }
    }
}