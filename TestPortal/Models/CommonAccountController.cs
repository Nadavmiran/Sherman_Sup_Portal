using System.Web.Mvc;

namespace TestPortal.Models
{
    public abstract class CommonAccountController : Controller
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public void LoginAction(AppUser user)
        {
            user.UserLogin();
            if (user.IsAuthenticated)
            {
                Session.Add("USER_LOGIN", user);
            }
        }
    }
}