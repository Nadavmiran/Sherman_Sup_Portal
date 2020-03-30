using LMNS.App.Log;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TestPortal.Models
{
    public abstract class CommonController : Controller
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
                //po.lstItemsObject = new List<OrderItems>();
                //po.lstItemsObject = p.GetOrderItems(orderID);
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
        [HttpPost]
        public JsonResult GetProductTestToEdit(int orderId, int pordId, string test)
        {
            PageObject po = new PageObject();

            po.TestObject = new Test { TestCode = test, TestComments = "No Comments - Edit", TestResult = "222", TestType = "XX" };
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
            //Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            //Revision r = new Revision();
            //Order o = new Order();
            //Product p = new Product();
            //PageObject po = new PageObject();
            //po.objOrder = o.GetOrderDetails(orderID);
            //po.objProduct = p.GetProductDetailse(orderID, prodId, ordLine);//new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = prodId, ProductName = prodName, SupplyDate = "14-02-2020" };
            //po.lstRevision = r.GetProdRevisionList(prodId, po.objProduct.REV);
            //po.TestObject = new Test();
            if (Session["USER_LOGIN"] == null)
                return Json(RedirectToAction("Login", "Account"));

            return Json(getPostProductTestData(orderID, prodName, ordLine));
        }

        private object getPostProductTestData(int orderID, string prodName, int ordLine)
        {
            Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            //Revision r = new Revision();
            Sample s = new Sample();
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            //po.objSamplQA = new Sample_QA();
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

                string rev = string.IsNullOrEmpty(po.objProduct.REVNAME) ? po.objProduct.SHR_SERIAL_REVNUM : po.objProduct.REVNAME;
                if (string.IsNullOrEmpty(rev))
                {
                    // To do: create new document
                }
                else
                {
                    // Get Sampels
                    po.objSample = s.GetProductSamples(po.User.Supplier_ID, po.objProduct.PARTNAME, po.objProduct.REVNAME, po.objProduct.LINE);
                    if ((null != po.objSample) && (null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM) && (po.objSample.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                    {
                        foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                        {
                            item.DOCNO = po.objSample.DOCNO;
                            item.SUPNAME = po.objSample.SUPNAME;
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
            //Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            //Revision r = new Revision();
            //Order o = new Order();
            //Product p = new Product();
            //PageObject po = new PageObject();
            //po.objOrder = o.GetOrderDetails(orderID);
            //po.objProduct = p.GetProductDetailse(orderID, prodId, ordLine);//new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = prodId, ProductName = prodName, SupplyDate = "14-02-2020" };
            //po.lstRevision = r.GetProdRevisionList(prodId, po.objProduct.REV);
            //po.TestObject = new Test();
            //return View("TestProduct", po);
        }

        private PageObject getProductTestData(int orderID, string prodName, int ordLine)
        {
            Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            //Revision r = new Revision();
            
            Order o = new Order();
            Product p = new Product();
            PageObject po = new PageObject();
            //po.objSamplQA = new Sample_QA();
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

            GetProductObjAndSamples(orderID, ordLine, ref po);

            // Get Attachments
            if ((null == po.objOrder.EXTFILES_SUBFORM) || (po.objOrder.EXTFILES_SUBFORM.Length == 0))
            {
                GetProductAttachments(orderID, prodName, ref po);
            }

            po.TestObject = t;
            return po;
        }

        private void GetProductObjAndSamples(int orderID, int ordLine, ref PageObject po)
        {
            Sample s = new Sample();
            po.objProduct = new OrderItems();
            try
            {
                po.objProduct = po.lstItemsObject.Where(x => x.ORD == orderID && x.LINE == ordLine).SingleOrDefault();
                if (null != po.objProduct)
                {
                    string rev = string.IsNullOrEmpty(po.objProduct.REVNAME) ? po.objProduct.SHR_SERIAL_REVNUM : po.objProduct.REVNAME;
                    if (string.IsNullOrEmpty(rev))
                    {
                        // To do: create new document
                    }
                    else
                    {
                        po.objSample = s.GetProductSamples(po.User.Supplier_ID, po.objProduct.PARTNAME, po.objProduct.REVNAME, po.objProduct.LINE);
                        if((null != po.objSample) && (null != po.objSample.MED_TRANSSAMPLEQA_SUBFORM) && (po.objSample.MED_TRANSSAMPLEQA_SUBFORM.Count > 0))
                        {
                            foreach (Sample_QA item in po.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                            {
                                item.DOCNO = po.objSample.DOCNO;
                                item.SUPNAME = po.objSample.SUPNAME;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Info("getProductTestData ==> exeption = ", ex);
            }
        }

        private void GetProductAttachments(int orderID, string prodName, ref PageObject po)
        {
            Product p = new Product();
            po.lstAttachments = new List<Attachments>();
            po.lstAttachments = p.GetProductAttachments(orderID, prodName);
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

        [HttpPost]
        public JsonResult GetProductRevisionList(int prodId, int revId)
        {
            
            Revision r = new Revision();
            PageObject po = new PageObject();
            po.lstRevision = r.GetProdRevisionList(prodId, revId);
            return Json(po);
        }

        [HttpPost]
        public JsonResult GetOrderProductTests(int orderId, int pordId)
        {
            //GetOrderItems(orderId);
            PageObject po = new PageObject();
            po.lstTestObject = new List<Test>();

            po.lstTestObject.Add(new Test { TestCode = "12224", TestComments = "No Comments 1", TestResult = "0.0999", TestType = "89" });
            po.lstTestObject.Add(new Test { TestCode = "12225", TestComments = "No Comments 2", TestResult = "1", TestType = "90" });
            po.lstTestObject.Add(new Test { TestCode = "12226", TestComments = "No Comments 3", TestResult = "13", TestType = "91" });
            po.lstTestObject.Add(new Test { TestCode = "12227", TestComments = "No Comments 4", TestResult = "22", TestType = "92" });
            return Json(po);
        }

        [HttpPost]
        public ActionResult SaveTest(string data)
        {
            
            return View();
        }

        [HttpPost]
        public ActionResult UploadFiles()
        {
            HttpFileCollectionBase fies = Request.Files;
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];

                if (file != null && file.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Images/"), fileName);
                    file.SaveAs(path);
                }
            }
            return View();
        }

        public ActionResult QA_Page()
        {
            return View();
        }
    }

}