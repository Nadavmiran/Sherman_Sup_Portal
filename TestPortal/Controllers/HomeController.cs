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

        [HttpPost]
        public ActionResult Download(string fileFolder, string fileName)
        {
            string filePath = Path.Combine(Server.MapPath("~/PriorityDocs/" + fileFolder), fileName);

            //AppLogger.log.Info("Function => Download ==> FIlePath = " + filePath);
            //AppLogger.log.Info("filePath = " + filePath);
            string filename = fileName;
            byte[] filedata = null;

            try
            {
                filedata = System.IO.File.ReadAllBytes(filePath);
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
            }

            string contentType = MimeMapping.GetMimeMapping(filePath);
            var content_type = "";
            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = true,
            };

            Response.Clear();
            Response.ClearContent();
            Response.Buffer = true;
            Response.ClearHeaders();

            if (filePath.Contains(".doc"))
            {
                content_type = "application/msword";
            }
            else if (filePath.Contains(".docx"))
            {
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            else if (filePath.Contains(".pdf"))
            {
                content_type = "application/pdf";
            }
            else if (filePath.Contains(".xsl"))
            {
                content_type = "application/vnd.ms-excel";
            }
            else if (filePath.Contains(".jpeg") || filePath.Contains(".jpg"))
            {
                content_type = "image/jpeg";
            }
            else if (filePath.Contains(".xsl"))
            {
                content_type = "application/vnd.ms-excel";
            }
            else if (filePath.Contains(".csv"))
            {
                content_type = "text/csv";
            }
            else if (filePath.Contains(".bmp"))
            {
                content_type = "image/x-windows-bmp";
            }
            else if (filePath.Contains(".xlsx"))
            {
                content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            else
                content_type = "text/plain";

            Response.ContentType = content_type;
            Response.AppendHeader("Content-Disposition", "attachment; " + cd.ToString());

            Response.TransmitFile(filePath);
            Response.End();

            return File(filedata, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        [HttpGet]
        public virtual ActionResult DownloadFile(string fileFolder, string fileName)
        {
            string filePath = Path.Combine(Server.MapPath("~/PriorityDocs/" + fileFolder), fileName);
            return File(filePath, "application/force-download", fileName);
        }
    }
}
