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

namespace TestPortal.Models
{
    public partial class CommonController : Controller
    {
        public ActionResult TestProduct(int orderID, string orderNumber)
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
            {
                Test t = new Test();// { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
                Order o = new Order();
                Product p = new Product();
                PageObject po = new PageObject();
                po.objSample = new Sample();
                po.User = Session["USER_LOGIN"] as AppUser;
                po.objOrder = o.GetOrderDetails(orderID);//new Order { OrderID = orderID, OrderNumber = orderNumber };
                if(null != po.objOrder)
                {
                    if (null != po.objOrder.PORDERITEMS_SUBFORM)
                    {
                        po.lstItemsObject = new List<OrderItems>();
                        po.lstItemsObject.AddRange(po.objOrder.PORDERITEMS_SUBFORM);
                        foreach (OrderItems item in po.lstItemsObject)
                        {
                            item.ORD = po.objOrder.ORD;
                        }
                    }
                }
                po.objProduct = new OrderItems();// { OrderID = 0, OrderNumber = string.Empty, LeftAmountToDeliver = 0, TotalAmountInOrder = 0, LineStatus = string.Empty, ProductDescription = string.Empty, ProductID = 0, ProductName = string.Empty, SupplyDate = string.Empty };
                po.TestObject = t;
                return View(po);
            }
        }

        [HttpPost]
        public JsonResult GetOrdersData(string supplier)
        {
            Order ord = new Order();
            PageObject po = new PageObject();
            po.TestObject = new Test();
            po.lstOrderObject = ord.GetSupplierOrders(supplier);
            po.lstItemsObject = new List<OrderItems>();
            foreach (Order obj in po.lstOrderObject)
            {
                if (null == obj.PORDERITEMS_SUBFORM)
                    continue;

                for (int i = 0; i < obj.PORDERITEMS_SUBFORM.Length; i++)
                {
                    obj.PORDERITEMS_SUBFORM[i].ORD = obj.ORD;
                }
                po.lstItemsObject.AddRange(obj.PORDERITEMS_SUBFORM);
            }
            //PORDERS?$filter=SUPNAME eq '22000' and (STATDES eq 'מאושרת' or STATDES eq 'נשלחה-עדכון' or STATDES eq 'נשלחה' or STATDES eq 'אישור ספק' or STATDES eq 'פתיחה חוזרת' or STATDES eq 'מוקפאת')&$expand=PORDERITEMS_SUBFORM($expand=PORDERITEMSTEXT_SUBFORM)

            return Json(po);
        }

        public ActionResult TestProductItem(int orderID, string prodName, int ordLine)
        {
           if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");

            return View("TestProduct", getProductTestData(orderID, prodName, ordLine));
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
            Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            Sample s = new Sample();
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            po.lstAttachments = new List<Attachments>();
            po.User = Session["USER_LOGIN"] as AppUser;
            po.objOrder = o.GetOrderProductDetails(orderID, prodName);

            if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
            {
                po.objProduct = po.objOrder.PORDERITEMS_SUBFORM[0];

                // Get order line text
                if ((null != po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM.Length > 0))
                {
                    po.objItemText = po.objOrder.PORDERITEMS_SUBFORM[0].PORDERITEMSTEXT_SUBFORM[0];
                }

                if (null != po.objProduct)
                {
                    GetProductObjAndSamples(orderID, ordLine, ref po);
                }

                string rev = string.IsNullOrEmpty(po.objProduct.REVNAME) ? po.objProduct.SHR_SERIAL_REVNUM : po.objProduct.REVNAME;
                if (string.IsNullOrEmpty(rev))
                {
                    // To do: create new document
                }
                else
                {
                    // Get Sampels
                    //po.objSample = s.GetProductSamples(po.User.Supplier_ID, po.objProduct.PARTNAME, po.objProduct.REVNAME, po.objProduct.LINE);
                    if ((null != po.objSample) && (null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM) && (po.objSample.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                    {
                        po.objSample.pageCURDATE = po.objSample.CURDATE.ToShortDateString();
                        foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                        {
                            item.DOCNO = po.objSample.DOCNO;
                            item.SUPNAME = po.objSample.SUPNAME;
                            item.PARTNAME = po.objSample.PARTNAME;
                        }
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
            po.TestObject = t;
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
            po.objOrder = o.GetOrderDetails(orderID);
            po.lstItemsObject = new List<OrderItems>();

            if ((null != po.objOrder.PORDERITEMS_SUBFORM) && (po.objOrder.PORDERITEMS_SUBFORM.Length > 0))
            {
                for (int i = 0; i < po.objOrder.PORDERITEMS_SUBFORM.Length; i++)
                {
                    po.objOrder.PORDERITEMS_SUBFORM[i].ORD = po.objOrder.ORD;
                }
            }

            po.lstItemsObject.AddRange(po.objOrder.PORDERITEMS_SUBFORM);
            po.objProduct = po.lstItemsObject.Where(x => x.ORD == orderID && x.LINE == ordLine).SingleOrDefault();
            if (null != po.objProduct)
            {
                GetProductObjAndSamples(orderID, ordLine, ref po);
            }
            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }

            return po;
        }

        private void GetProductObjAndSamples(int orderID, int ordLine, ref PageObject po)
        {
            Sample s = new Sample();
            try
            {
                po.objSample = s.GetProductSamples(po.User.Supplier_ID, po.objProduct.PARTNAME, po.objProduct.REVNAME, po.objProduct.LINE);
                
                if ((null != po.objSample) && (!string.IsNullOrEmpty(po.objSample.DOCNO)) && (null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM) && (po.objSample.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                {
                    po.objSample.pageCURDATE = po.objSample.CURDATE.ToShortDateString();
                    foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                    {
                        item.DOCNO = po.objSample.DOCNO;
                        item.SUPNAME = po.objSample.SUPNAME;
                        item.PARTNAME = po.objSample.PARTNAME;
                    }
                }
                else
                {
                    Sample_QA sq = new Sample_QA();
                    po.lstSamplQA = sq.GetCommonSamplesList();
                }
                //}
            }
            catch (Exception ex)
            {
                AppLogger.log.Info("GetProductObjAndSamples ==> exeption = ", ex);
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
            Sample s = new Sample();
            PageObject po = new PageObject();
            po.objSample = s.GetOrderProductTests(prodName, supplier, qaCode);
            return Json(po);
        }

        [HttpPost]
        public JsonResult SaveTest(string data)
        {
            Sample s = new Sample();
            SampleTestMsgWarpper ow = JsonConvert.DeserializeObject<SampleTestMsgWarpper>(data);
            ResultAPI ra = s.UpdateTest(ow.form[0], ow.SUB_RES);

            if (ra.ResultStatus.ToUpper().Equals("OK"))
            {
                s = s.GetProductSamples(ow.form[0].hdnQaSUPNAME, ow.form[0].hdnQaPARTNAME, string.Empty, 0);
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
            string filePath = Path.Combine(Server.MapPath("~/Docs/PriorityDocs/"), fileFolder + "/" + fileName);
            return File(filePath, "application/force-download", fileName);
        }

        [HttpPost]
        public JsonResult UploadFiles()
        {
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
                    if (file != null && file.ContentLength > 0)
                    {
                        string fileName = Path.GetFileName(file.FileName);
                        string dir = Path.Combine(Server.MapPath("~/PortalDocs/" + ow.form[0].hdnQaSUPNAME + "/" + ow.form[0].hdnQaDOCNO));
                        var path = Path.Combine(Server.MapPath("~/PortalDocs/" + ow.form[0].hdnQaSUPNAME + "/" + ow.form[0].hdnQaDOCNO + "/"), fileName);
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
        public JsonResult CreateTest(string supName, string partName, string qaCode)
        {
            ResultAPI ra = null;
            Sample s = null;
            PageObject po = new PageObject();
            CreateSampleTestMsgWarpper ow = JsonConvert.DeserializeObject<CreateSampleTestMsgWarpper>(qaCode);
            if(null != ow)
            {
                s = new Sample();
                po.objSample = s.GetProductSamples(supName, partName, string.Empty, 0);
                if ((null == po.objSample) || (string.IsNullOrEmpty(po.objSample.DOCNO)))
                    ra = s.Createtest(supName, partName, ow.form, true);
                else
                    ra = s.AddSampleTests(supName, partName, ow.form, false, po.objSample.DOCNO);
                //Get the test list after creation or update
                po.objSample = s.GetProductSamples(supName, partName, string.Empty, 0);
            }
            return Json(po);
        }

        [HttpPost]
        public JsonResult GetSampleTestList(string supName, string partName)
        {
            Sample s = new Sample();
            PageObject po = new PageObject();
            Sample_QA sq = new Sample_QA();
            po.lstSamplQA = sq.GetCommonSamplesList();
            po.objSample = s.GetProductSamples(supName, partName, string.Empty, 0);
            return Json(po);
        }

        public ActionResult QA_Page()
        {
            return View();
        }

    }
}