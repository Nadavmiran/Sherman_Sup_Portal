using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TestPortal.Models;

namespace TestPortal.Controllers
{
    public class HomeController : CommonController
    {
        // GET: Home
        public ActionResult Index()
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
            {
                PageObject po = new PageObject();
                po.User = Session["USER_LOGIN"] as AppUser;
                return View(po);
            };
        }

        //public ActionResult TestProduct(int orderID, string orderNumber)
        //{
        //    Test t = new Test();// { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
        //    Order o = new Order();
        //    Product p = new Product();
        //    PageObject po = new PageObject();
        //    po.objOrder = o.GetOrderDetails(orderID);//new Order { OrderID = orderID, OrderNumber = orderNumber };
        //    po.lstItemsObject = p.GetOrderItems(orderID);
        //    po.objProduct = new Product();// { OrderID = 0, OrderNumber = string.Empty, LeftAmountToDeliver = 0, TotalAmountInOrder = 0, LineStatus = string.Empty, ProductDescription = string.Empty, ProductID = 0, ProductName = string.Empty, SupplyDate = string.Empty };
        //    po.TestObject = t;
        //    return View(po);
        //}

        //[HttpPost]
        //public JsonResult GetOrdersData(string supplier)
        //{
        //    Order ord = new Order();
        //    PageObject po = new PageObject();
        //    po.TestObject = new Test();
        //    po.lstOrderObject = ord.GetSupplierOrders(supplier);
        //    //po.lstOrderObject = new List<Order>();
        //    //po.lstOrderObject.Add(new Order {OrderDate = "11-02-2020", OrderDescription = "Plag&play parts - 1", OrderID = 123, OrderNumber = "23/856", OrderStatus = "In progress" });
        //    //po.lstOrderObject.Add(new Order { OrderDate = "12-02-2020", OrderDescription = "Plag&play parts - 2", OrderID = 124, OrderNumber = "23/857", OrderStatus = "Waiting" });
        //    //po.lstOrderObject.Add(new Order { OrderDate = "13-02-2020", OrderDescription = "Plag&play parts - 3", OrderID = 125, OrderNumber = "23/858", OrderStatus = "Frozen" });

        //    return Json(po);
        //}
        //[HttpPost]
        //public JsonResult GetProductTestToEdit(int orderId, int pordId, string test)
        //{
        //    PageObject po = new PageObject();

        //    po.TestObject = new Test { TestCode = test, TestComments = "No Comments - Edit", TestResult = "222", TestType = "XX" };
        //    return Json(po);
        //}

        //[HttpPost]
        //public JsonResult GetOrderItems(int parentRowKey)
        //{
        //    Product p = new Product();
        //    PageObject po = new PageObject();
        //    po.lstItemsObject = p.GetOrderItems(parentRowKey);
        //    //po.lstItemsObject = new List<Product>();
        //    //po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = 8747, ProductName = "IT8947", SupplyDate = "14-02-2020" });
        //    //po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 2, TotalAmountInOrder = 11, LineStatus = "In Progress", ProductDescription = "פלטה 5 חורים", ProductID = 8749, ProductName = "IT8948", SupplyDate = "15-02-2020" });
        //    //po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 3, TotalAmountInOrder = 13, LineStatus = "In Progress", ProductDescription = "פלטה 6 חורים", ProductID = 8748, ProductName = "IT8949", SupplyDate = "16-02-2020" });
        //    //po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 4, TotalAmountInOrder = 15, LineStatus = "In Progress", ProductDescription = "פלטה 7 חורים", ProductID = 8746, ProductName = "IT8940", SupplyDate = "17-02-2020" });
        //    return Json(po);
        //}

        //public ActionResult TestProductItem(int orderID, int prodId, int ordLine)
        //{
        //    //Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
        //    //Revision r = new Revision();
        //    //Order o = new Order();
        //    //Product p = new Product();
        //    //PageObject po = new PageObject();
        //    //po.objOrder = o.GetOrderDetails(orderID);
        //    //po.objProduct = p.GetProductDetailse(orderID, prodId, ordLine);//new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = prodId, ProductName = prodName, SupplyDate = "14-02-2020" };
        //    //po.lstRevision = r.GetProdRevisionList(prodId, po.objProduct.REV);
        //    //po.TestObject = new Test();
        //    return View("TestProduct", getProductTestData(orderID, prodId, ordLine));
        //}

        //[HttpPost]
        //public JsonResult TestProductItemData(int orderID, int prodId, int ordLine)
        //{
        //    return Json(getProductTestData(orderID, prodId, ordLine));
        //    //Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
        //    //Revision r = new Revision();
        //    //Order o = new Order();
        //    //Product p = new Product();
        //    //PageObject po = new PageObject();
        //    //po.objOrder = o.GetOrderDetails(orderID);
        //    //po.objProduct = p.GetProductDetailse(orderID, prodId, ordLine);//new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = prodId, ProductName = prodName, SupplyDate = "14-02-2020" };
        //    //po.lstRevision = r.GetProdRevisionList(prodId, po.objProduct.REV);
        //    //po.TestObject = new Test();
        //    //return View("TestProduct", po);
        //}

        //private PageObject getProductTestData(int orderID, int prodId, int ordLine)
        //{
        //    Test t = new Test { TestCode = "12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
        //    Revision r = new Revision();
        //    Order o = new Order();
        //    Product p = new Product();
        //    PageObject po = new PageObject();
        //    po.objOrder = o.GetOrderDetails(orderID);
        //    po.objProduct = p.GetProductDetailse(orderID, prodId, ordLine);//new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = prodId, ProductName = prodName, SupplyDate = "14-02-2020" };
        //    po.lstRevision = r.GetProdRevisionList(prodId, po.objProduct.REV);
        //    po.TestObject = new Test();
        //    return po;
        //}

        //[HttpPost]
        //public JsonResult TestProductOrderItems(int orderId)
        //{
        //    return GetOrderItems(orderId);
        //}

        //[HttpPost]
        //public JsonResult GetProductRevisionList(int prodId, int revId)
        //{
        //    Revision r = new Revision();
        //    PageObject po = new PageObject();
        //    po.lstRevision = r.GetProdRevisionList(prodId, revId);
        //    return Json(po);
        //}

        //[HttpPost]
        //public JsonResult GetOrderProductTests(int orderId, int pordId)
        //{
        //    //GetOrderItems(orderId);
        //    PageObject po = new PageObject();
        //    po.lstTestObject = new List<Test>();

        //    po.lstTestObject.Add(new Test { TestCode = "12224", TestComments = "No Comments 1", TestResult = "0.0999", TestType = "89" });
        //    po.lstTestObject.Add(new Test { TestCode = "12225", TestComments = "No Comments 2", TestResult = "1", TestType = "90" });
        //    po.lstTestObject.Add(new Test { TestCode = "12226", TestComments = "No Comments 3", TestResult = "13", TestType = "91" });
        //    po.lstTestObject.Add(new Test { TestCode = "12227", TestComments = "No Comments 4", TestResult = "22", TestType = "92" });
        //    return Json(po); 
        //}

        //[HttpPost]
        //public ActionResult SaveTest(string data)
        //{
        //    return View();
        //}

        //[HttpPost]
        //public ActionResult UploadFiles()
        //{
        //    HttpFileCollectionBase fies = Request.Files;
        //    if (Request.Files.Count > 0)
        //    {
        //        var file = Request.Files[0];

        //        if (file != null && file.ContentLength > 0)
        //        {
        //            var fileName = Path.GetFileName(file.FileName);
        //            var path = Path.Combine(Server.MapPath("~/Images/"), fileName);
        //            file.SaveAs(path);
        //        }
        //    }
        //    return View();
        //}

        //public ActionResult QA_Page()
        //{
        //    return View();
        //}
    }
}
