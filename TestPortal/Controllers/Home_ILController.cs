using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TestPortal.Controllers
{
    public class Home_ILController : Controller
    {
        public ActionResult Index()
        {
            if(Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
                return View();
        }

        public ActionResult QA_Page()
        {
            return View();
        }
    }
}