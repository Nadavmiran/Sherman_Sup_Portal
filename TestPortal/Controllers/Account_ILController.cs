using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TestPortal.Controllers
{
    public class Account_ILController : Controller
    {
        // GET: Account
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult DoLogin()
        {
            Session.Add("USER_LOGIN", "111");
            return RedirectToAction("Index", "Home");
        }

        public ActionResult LogOff()
        {
            Session.Remove("USER_LOGIN");
            return RedirectToAction("Index", "Home");
        }
    }
    
}