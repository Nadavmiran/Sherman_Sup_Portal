using LMNS.Priority.API;
using System.Web.Mvc;

namespace TestPortal.Models
{
    public abstract class CommonAccountController : Controller
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public void LoginAction(AppUser user)
        {
            //user.UserLogin();
            user.DoLogin();
            if (user.IsAuthenticated)
            {
                Session.Add("USER_LOGIN", user);
            }
        }

        [HttpPost]
        public ActionResult SaveUserProfile(string lang, string fullName, string pass)
        {
            ResultAPI ra = null;
            if (Session["USER_LOGIN"] == null)
                return RedirectToAction("Login", "Account");
            else
            {
                AppUser au = Session["USER_LOGIN"] as AppUser;
                ra = au.SaveUserProfile(lang, fullName, pass);
            }
            return Json(ra);
        }
    }
}