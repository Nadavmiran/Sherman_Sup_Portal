﻿using LMNS.Priority.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TestPortal.Models;

namespace TestPortal.Controllers
{
    public class AccountController : CommonAccountController
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
            if(po.User.IsAuthenticated)
                if (po.User.Language.Equals("עברית"))
                    return RedirectToAction("Index", "Home_IL");
                else
                    return RedirectToAction("Index", "Home");
            else
            {
                ModelState.AddModelError(string.Empty, "Wrong User Name or Password. Please try again or mail Sherman system administrator: sales@sherman.com");
                return View("Login", po);
            }
        }

        public ActionResult UserProfile()
        {
            PageObject po = new PageObject();
            po.User = Session["USER_LOGIN"] as AppUser;
            return View(po);
        }

        public ActionResult LogOff()
        {
            Session.Remove("USER_LOGIN");
            return RedirectToAction("Index", "Home");
        }
    }
}