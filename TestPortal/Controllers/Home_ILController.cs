using LMNS.App.Log;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TestPortal.Models;

namespace TestPortal.Controllers
{
    public class Home_ILController : CommonController
    {
        public ActionResult Index()
        {
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account_IL");
            else
            {
                PageObject po = new PageObject();
                po.User = Session["USER_LOGIN"] as AppUser;
                return View(po);
            }
        }

    }
}