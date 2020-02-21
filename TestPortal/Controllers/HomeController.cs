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
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
                return View();
        }

        [HttpPost]
        public JsonResult GetOrdersData(string supplier)
        {
            PageObject po = new PageObject();
            po.lstOrderObject = new List<Order>();
            po.lstOrderObject.Add(new Order {OrderDate = "11-02-2020", OrderDescription = "Plag&play parts - 1", OrderID = 123, OrderNumber = "23/856", OrderStatus = "In progress" });
            po.lstOrderObject.Add(new Order { OrderDate = "12-02-2020", OrderDescription = "Plag&play parts - 2", OrderID = 124, OrderNumber = "23/857", OrderStatus = "Waiting" });
            po.lstOrderObject.Add(new Order { OrderDate = "13-02-2020", OrderDescription = "Plag&play parts - 3", OrderID = 125, OrderNumber = "23/858", OrderStatus = "Frozen" });

            return Json(po);
        }

        [HttpPost]
        public JsonResult GetOrderItems(string parentRowKey)
        {
            PageObject po = new PageObject();
            po.lstItemsObject = new List<Product>();
            po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 1, TotalAmountInOrder = 21, LineStatus = "In Progress", ProductDescription = "פלטה 4 חורים", ProductID = 8747, ProductName = "IT8947", SupplyDate = "14-02-2020" });
            po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 2, TotalAmountInOrder = 11, LineStatus = "In Progress", ProductDescription = "פלטה 5 חורים", ProductID = 8749, ProductName = "IT8948", SupplyDate = "15-02-2020" });
            po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 3, TotalAmountInOrder = 13, LineStatus = "In Progress", ProductDescription = "פלטה 6 חורים", ProductID = 8748, ProductName = "IT8949", SupplyDate = "16-02-2020" });
            po.lstItemsObject.Add(new Product { OrderID = 123, OrderNumber = "23/856", LeftAmountToDeliver = 4, TotalAmountInOrder = 15, LineStatus = "In Progress", ProductDescription = "פלטה 7 חורים", ProductID = 8746, ProductName = "IT8940", SupplyDate = "17-02-2020" });
            return Json(po);
        }

        public ActionResult TestProduct(int orderID, string orderNumber)
        {
            Test t = new Test{TestCode="12224", TestComments = "No Comments", TestResult = "0.0999", TestType = "89" };
            PageObject po = new PageObject();
            po.objOrder = new Order { OrderID = orderID, OrderNumber = orderNumber };
            po.TestObject = t;
            return View(po);
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
