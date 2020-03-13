using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TestPortal.Models;

namespace TestPortal.Controllers
{
    public class Account_ILController : CommonAccountController
    {
        // GET: Account
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DoLogin(PageObject po)
        {
            LoginAction(po.User);
            if (po.User.IsAuthenticated)
                return RedirectToAction("Index", "Home_IL");
            else
            {
                ModelState.AddModelError(string.Empty, "שם משתמש ו/או סיסמה שגויים. נסה שנית או פנה לאיש הקשר בחברת 'שרמן' במייל לכתובת: sales@sherman.com");
                return View("Login", po);
            }
        }

        public ActionResult UserProfile()
        {
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            return View( po);
        }

        public ActionResult LogOff()
        {
            Session.Remove("USER_LOGIN");
            return RedirectToAction("Index", "Home_IL");
        }
    }
    
}