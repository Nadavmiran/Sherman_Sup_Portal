using LMNS.App.Log;
using Newtonsoft.Json;
//using ReportingPortal.ODATA;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using System.Xml;

namespace LMNS.Priority.API
{
    public class PriorityAPI
    {
        public string TestAPI()
        {
            IRestResponse response = null;
            string res = string.Empty;
            var uri = new Uri(ConfigurationManager.AppSettings["AppAPI"].ToString());  // Replace with your Service Root URL
            //string aline_one_data = CreateBaseFormData(rptData, exRPT, rdf, null, isNewRPT);

            try
            {
                //var client = new RestClient(ConfigurationManager.AppSettings["AppAPI"].ToString() + dbName + "/ALINE_ONE"); // ("https://priority.metalicone.com/odata/priority/tabula.ini/metalic/ALINE_ONE");
                var client = new RestClient("https://priority.metalicone.com/odata/priority/tabula.ini/metalic/ALINE_ONE?%24filter=DOC%20eq%20907350");
                var request = new RestRequest(Method.GET);
                request.AddHeader("postman-token", "fec359c7-7a6a-3c70-7095-a5ec2123a638");
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("content-type", "application/atom+xml");
                request.AddHeader("authorization", "Basic cmVwb3J0YWxuZXc6cmVwb3J0YWwxOA==");
                //IRestResponse response = client.Execute(request);

                response = client.Execute(request);
                res = TransformeResultToXml(response.Content);
            }
            catch (Exception ex)
            {
                AppLogger.log.Debug(AppLogger.CreateLogText("PriorityAPI", ex.Message));
                AppLogger.log.Debug(AppLogger.CreateLogText("PriorityAPI", response.ErrorMessage), response.ErrorException);
            }

            return res;
        }

        public string GetCustOrdersStatus(string dbName, string custName, string ordStatus)
        {
            IRestResponse response = null;
            string res = string.Empty;
            var uri = new Uri(ConfigurationManager.AppSettings["AppAPI"].ToString());  // Replace with your Service Root URL
            //string aline_one_data = CreateBaseFormData(rptData, exRPT, rdf, null, isNewRPT);

            try
            {
                var client = new RestClient(ConfigurationManager.AppSettings["AppAPI"].ToString() + dbName + "/ORDERS?$filter=CUSTNAME eq '" + custName + "' and (CURDATE gt " + DateTime.Now.AddMonths(-18).ToShortDateString() +") and ORDSTATUSDES eq '" + ordStatus + "'"); // ("https://priority.metalicone.com/odata/priority/tabula.ini/metalic/ALINE_ONE");
               
                var request = new RestRequest(Method.GET);
                request.AddHeader("postman-token", "fec359c7-7a6a-3c70-7095-a5ec2123a638");
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("content-type", "application/json");
                request.AddHeader("authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes((ConfigurationManager.AppSettings["AppAPI_U"].ToString() + ":" + (ConfigurationManager.AppSettings["AppAPI_P"].ToString())))));
                //IRestResponse response = client.Execute(request);

                response = client.Execute(request);
                ResultAPI ra = CreateResultApi(response);
                res = TransformeResultToXml(response.Content);
            }
            catch (Exception ex)
            {
                AppLogger.log.Debug(AppLogger.CreateLogText("GetCustOrdersStatus", ex.Message));
                AppLogger.log.Debug(AppLogger.CreateLogText("GetCustOrdersStatus", response.ErrorMessage), response.ErrorException);
            }

            return res;
        }

        #region Reporting Portal
        //public ResultAPI CreateRPT(string dbName, ProductionReport rptData, ReportData exRPT, List<ReportingDefectCodes> rdf)
        //{
        //    IRestResponse response = null;
        //    var uri = new Uri(ConfigurationManager.AppSettings["AppAPI"].ToString());  // Replace with your Service Root URL
        //    bool isNewRPT = true;
        //    string aline_one_data = CreateBaseFormData(rptData, exRPT, rdf, null, isNewRPT);

        //    try
        //    {
        //        var client = new RestClient(ConfigurationManager.AppSettings["AppAPI"].ToString() + dbName + "/ALINE_ONE"); // ("https://priority.metalicone.com/odata/priority/tabula.ini/metalic/ALINE_ONE");
        //        var request = new RestRequest(Method.POST);
        //        request.AddHeader("postman-token", "869a9852-0cee-9abf-3432-ea9511eeaf6c");
        //        request.AddHeader("cache-control", "no-cache");
        //        request.AddHeader("authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes((ConfigurationManager.AppSettings["AppAPI_U"].ToString() + ":" + (ConfigurationManager.AppSettings["AppAPI_P"].ToString())))));
        //        request.AddHeader("content-type", "application/json");
        //        request.AddParameter("application/json", aline_one_data, ParameterType.RequestBody);

        //        response = client.Execute(request);

        //    }
        //    catch (Exception ex)
        //    {
        //        AppLogger.log.Debug(AppLogger.CreateLogText("CreateRPT", ex.Message));
        //        AppLogger.log.Debug(AppLogger.CreateLogText("CreateRPT", response.ErrorMessage), response.ErrorException);
        //    }

        //    return CreateResultApi(response);
        //}

        //public ResultAPI UpdateRPT(string dbName, ProductionReport rptData, ReportData exRPT, List<ReportingDefectCodes> rdf)
        //{
        //    IRestResponse response = null;
        //    var uri = new Uri(ConfigurationManager.AppSettings["AppAPI"].ToString());  // Replace with your Service Root URL
        //    bool isNewRPT = true;
        //    string aline_one_data = CreateBaseFormData(rptData, exRPT, rdf, null, isNewRPT);
        //    try
        //    {
        //        var client = new RestClient(ConfigurationManager.AppSettings["AppAPI"].ToString() + dbName + "/ALINE_ONE"); // ("https://priority.metalicone.com/odata/priority/tabula.ini/metalic/ALINE_ONE");
        //        var request = new RestRequest(Method.PATCH);
        //        request.AddHeader("postman-token", "4f2baeb2-bf9a-3acb-1dde-302895567ea9");
        //        request.AddHeader("cache-control", "no-cache");
        //        request.AddHeader("if-match", "W/\"08D2931BACB7D7FD\"");
        //        request.AddHeader("authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes((ConfigurationManager.AppSettings["AppAPI_U"].ToString() + ":" + (ConfigurationManager.AppSettings["AppAPI_P"].ToString())))));
        //        request.AddHeader("content-type", "application/json");
        //        request.AddParameter("application/json", aline_one_data, ParameterType.RequestBody);
        //        //request.AddParameter("application/json", "{\r\n\t\"CURDATE\":\"2017-11-18T00:00:00+02:00\",\r\n\t\"SERIALNAME\":\"51601704\",\r\n\t\"USERID\":504795,\r\n\t\"MET_SETUP\":\"D\",\r\n\t\"RTYPEBOOL\":\"N\",\r\n\t\"PLS_TEXT\":\"\",\r\n\t\"MET_ADDSETUP\":\"\",\r\n\t\"STIME\":\"11:16\",\r\n\t\"EMPSTIME\":\"11:16\",\r\n\t\"MET_ROBOT\":\"\",\r\n\t\"MET_START\":\"Y\",\r\n\t\"ACTNAME\":\"A15-1\"\r\n}", ParameterType.RequestBody);

        //        response = client.Execute(request);

        //    }
        //    catch (Exception ex)
        //    {
        //        AppLogger.log.Debug(AppLogger.CreateLogText("UpdateRPT", ex.Message));
        //        AppLogger.log.Debug(AppLogger.CreateLogText("UpdateRPT", response.ErrorMessage), response.ErrorException);
        //    }

        //    return CreateResultApi(response);
        //}

        //private string CreateBaseFormData(ProductionReport rptData, ReportData exRPT, List<ReportingDefectCodes> rdf, string[] subForm, bool isNewRPT)
        //{
        //    StringBuilder sb = new StringBuilder();

        //    //"CURDATE":"2017-12-04T00:00:00.000+02:00",
        //    //"EMPSDATE":"2017-12-04T06:00:00.000+02:00",
        //    //"EMPEDATE":"2017-12-04T08:00:00+02:00",
        //    //"DOC":907077,
        //    //"SERIALNAME":"51601899",
        //    //"MET_START":"Y",
        //    //"MET_END":"Y",
        //    //"MET_SETUP":"D",
        //    //"ACTNAME":"QC-10550",
        //    //"USERID":503872,
        //    //"QUANT":14,
        //    //"SQUANT":3,
        //    //"MQUANT":6,
        //    //"RTYPEBOOL":"N",
        //    //"PLS_TEXT":"PUTESDDA_TEM",
        //    //"MET_ADDSETUP":"N",
        //    //"MET_ROBOT":"N",

        //    //"STIME":"06:00",
        //    //"ETIME":"08:00",
        //    //"SDATE": "2017-12-04T08:00:00+02:00",
        //    //"EMPSTIME":"06:00",	
        //    //"EMPETIME":"08:00",
        //    //"EDATE":"2017-12-04T22:10:33.049+02:00",
        //    //"WORKCNAME":"A14-5",
        //    //"MET_MTIME":"N",
        //    //"MET_WORKTIME":"N",
        //    //"MET_SETUPEND":"N"}


        //    sb.Append("{");
        //    sb.Append("\r\n\t\"CURDATE\":");
        //    sb.Append("\"" + GetDateTimeOffset(rptData.CURDATE, "00:00") + "\",");

        //    sb.Append("\n\t\"SDATE\":");
        //    sb.Append("\"" + GetDateTimeOffset(rptData.SDATE, exRPT.MachineStartDateTime) + "\",");

        //    sb.Append("\n\t\"EDATE\":"); //סיום מכונה
        //    sb.Append("\"" + GetDateTimeOffset(rptData.EDATE, exRPT.MachineEndDateTime) + "\",");

        //    sb.Append("\n\t\"EMPSDATE\":");
        //    sb.Append("\"" + GetDateTimeOffset(exRPT.EmployeeStartDate, exRPT.EmployeeStartTime) + "\",");

        //    sb.Append("\n\t\"EMPEDATE\":");
        //    sb.Append("\"" + GetDateTimeOffset(exRPT.EmployeeEndDate, exRPT.EmployeeEndTime) + "\",");

        //    if (rptData.AL > 0)
        //    {
        //        sb.Append("\r\n\t\"DOC\":");
        //        sb.Append(rptData.AL + ",");
        //    }

        //    sb.Append("\r\n\t\"SERIALNAME\":");
        //    sb.Append("\"" + rptData.SERIALNAME + "\",");

        //    sb.Append("\r\n\t\"MET_START\":");
        //    sb.Append("\"Y\",");

        //    if (rptData.MET_END)
        //    {
        //        sb.Append("\n\t\"MET_END\":");
        //        sb.Append("\"Y\",");
        //    }

        //    sb.Append("\r\n\t\"MET_SETUP\":");
        //    sb.Append("\"" + exRPT.ReportingSetupID + "\",");

        //    sb.Append("\r\n\t\"USERID\":");
        //    sb.Append(Convert.ToInt32(rptData.USERID) + ",");

        //    sb.Append("\r\n\t\"ACTNAME\":");
        //    sb.Append("\"" + rptData.ACTNAME + "\",");

        //    sb.Append("\n\t\"QUANT\":");
        //    sb.Append(rptData.A_QUANT + ",");

        //    sb.Append("\n\t\"SQUANT\":");
        //    sb.Append(rptData.A_SQUANT + ",");

        //    sb.Append("\n\t\"MQUANT\":");
        //    sb.Append(rptData.A_MQUANT + ",");

        //    sb.Append("\r\n\t\"STIME\":");
        //    sb.Append("\"" + exRPT.MachineStartDateTime + "\",");

        //    //if (rptData.MET_END)
        //    //{
        //    sb.Append("\n\t\"ETIME\":");
        //    sb.Append("\"" + exRPT.MachineEndDateTime + "\",");
        //    //}

        //    sb.Append("\r\n\t\"EMPSTIME\":");
        //    sb.Append("\"" + exRPT.EmployeeStartTime + "\",");

        //    //if (rptData.MET_END)
        //    //{
        //    sb.Append("\n\t\"EMPETIME\":");
        //    sb.Append("\"" + exRPT.EmployeeEndTime + "\",");
        //    //}

        //    sb.Append("\r\n\t\"RTYPEBOOL\":");
        //    if (exRPT.Rework)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    if (!string.IsNullOrEmpty(exRPT.ToWarehouse))
        //    {
        //        sb.Append("\r\n\t\"WARHSNAME\":");
        //        sb.Append("\"" + exRPT.ToWarehouse + "\",");
        //    }

        //    sb.Append("\n\t\"MET_SETUPEND\":");
        //    if (rptData.MET_SETUPEND)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\r\n\t\"MET_ADDSETUP\":");
        //    if (rptData.MET_ADDSETUP)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\r\n\t\"MET_ROBOT\":");
        //    if (rptData.MET_ROBOT)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\n\t\"WORKCNAME\":");
        //    sb.Append("\"" + rptData.WORKCNAME + "\",");

        //    sb.Append("\n\t\"MET_MTIME\":");
        //    if (rptData.MET_MTIME)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\n\t\"MET_WORKTIME\":");
        //    if (rptData.MET_WORKTIME)
        //        sb.Append("\"Y\"");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\n\t\"EXCDES\":");
        //    sb.Append("\"\",");

        //    sb.Append("\r\n\t\"PLS_TEXT\":");
        //    if (string.IsNullOrEmpty(rptData.PLS_TEXT))
        //        sb.Append("\"\"");
        //    else
        //        sb.Append("\"" + rptData.PLS_TEXT + "\"");
        //    /***/

        //    if ((null != rdf) && (rdf.Count > 0))
        //    {
        //        int indx = 1;
        //        sb.Append("\t,");
        //        sb.Append("\r\n\t\"ALINEDEFECTCODES_SUBFORM\": [");
        //        foreach (var item in rdf)
        //        {
        //            sb.Append("\r\n{");
        //            sb.Append("\r\n\t\"DEFECTCODE\":");
        //            sb.Append("\"" + item.DEFECTCODE + "\",\r\n");

        //            sb.Append("\r\n\t\"MET_ACTNAME\":");
        //            sb.Append("\"" + rptData.ACTNAME + "\",\r\n");

        //            sb.Append("\r\n\t\"MET_USERNUM\":");
        //            sb.Append(item.USERID + ",\r\n");

        //            sb.Append("\r\n\t\"QUANT\":");
        //            sb.Append(item.QUANT + ",\r\n");

        //            sb.Append("\r\n\t\"REMARK\":");
        //            if (string.IsNullOrEmpty(item.REMARK))
        //            {
        //                item.REMARK = " ";
        //                sb.Append("\"" + item.REMARK + "\"\r\n");
        //            }
        //            else
        //                sb.Append("\"" + item.REMARK + "\"\r\n");

        //            sb.Append("}");

        //            if (indx < rdf.Count)
        //                sb.Append(",");

        //            indx++;
        //        }
        //        sb.Append("]\r\n");
        //    }

        //    if (subForm != null)
        //        foreach (var item in subForm)
        //        {
        //            sb.Append(item);
        //        }

        //    sb.Append("}");

        //    return sb.ToString();
        //}

        //internal ResultAPI SaveBreakeTime(string dbName, ProductionReport rptData, ReportData exRPT, List<ReportingDefectCodes> rdf, string breakCode, string breakTime)
        //{
        //    IRestResponse response = null;
        //    var uri = new Uri(ConfigurationManager.AppSettings["AppAPI"].ToString());  // Replace with your Service Root URL
        //    string PLS_ALINESTOP_SUBFORM = CreateAlineStopData(breakCode, breakTime);
        //    string[] subForm = { PLS_ALINESTOP_SUBFORM };
        //    string aline_one_data = CreateBreakReport(rptData, exRPT, breakCode, breakTime);

        //    try
        //    {
        //        var client = new RestClient(ConfigurationManager.AppSettings["AppAPI"].ToString() + dbName + "/ALINE_ONE");
        //        var request = new RestRequest(Method.POST);
        //        request.AddHeader("postman-token", "869a9852-0cee-9abf-3432-ea9511eeaf6c");
        //        request.AddHeader("cache-control", "no-cache");
        //        request.AddHeader("authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes((ConfigurationManager.AppSettings["AppAPI_U"].ToString() + ":" + (ConfigurationManager.AppSettings["AppAPI_P"].ToString())))));
        //        request.AddHeader("content-type", "application/json");
        //        request.AddParameter("application/json", aline_one_data, ParameterType.RequestBody);
        //        //request.AddParameter("application/json", "{\r\n\t\"CURDATE\":\"2017-11-18T00:00:00+02:00\",\r\n\t\"SERIALNAME\":\"51601704\",\r\n\t\"USERID\":504795,\r\n\t\"MET_SETUP\":\"D\",\r\n\t\"RTYPEBOOL\":\"N\",\r\n\t\"PLS_TEXT\":\"\",\r\n\t\"MET_ADDSETUP\":\"\",\r\n\t\"STIME\":\"11:16\",\r\n\t\"EMPSTIME\":\"11:16\",\r\n\t\"MET_ROBOT\":\"\",\r\n\t\"MET_START\":\"Y\",\r\n\t\"ACTNAME\":\"A15-1\"\r\n}", ParameterType.RequestBody);

        //        response = client.Execute(request);

        //    }
        //    catch (Exception ex)
        //    {
        //        AppLogger.log.Debug(AppLogger.CreateLogText("SaveBreakeTime", ex.Message));
        //        AppLogger.log.Debug(AppLogger.CreateLogText("SaveBreakeTime", response.ErrorMessage), response.ErrorException);
        //    }

        //    return CreateResultApi(response);
        //}

        //private string CreateBreakReport(ProductionReport rptData, ReportData exRPT, string breakCode, string breakTime)
        //{
        //    //	"CURDATE":"2018-01-12T14:26:35.8778406+02:00",
        //    //"SERIALNAME":"21613905",
        //    //"MET_START":"Y",
        //    //"MET_SETUP":"B",
        //    //"ACTNAME":"1363-1",
        //    //"USERID":503872,
        //    //"STIME":"14:26",
        //    //"ETIME":"14:26",
        //    //"EMPSTIME":"14:26",
        //    //"EMPETIME":"14:26",
        //    //"RTYPEBOOL":"N",
        //    //"PLS_TEXT":"",
        //    //"MET_ROBOT":"N",
        //    //"MET_ADDSETUP":"N",	
        //    StringBuilder sb = new StringBuilder();
        //    sb.Append("{");
        //    if (!exRPT.ReportingSetupID.Equals("B"))
        //    {
        //        sb.Append("\r\n\t\"CURDATE\":");
        //        sb.Append("\"" + GetDateTimeOffset(rptData.CURDATE, "00:00") + "\",");

        //        sb.Append("\n\t\"EMPSDATE\":");
        //        sb.Append("\"" + GetDateTimeOffset(exRPT.EmployeeStartDate, exRPT.EmployeeStartDateTime) + "\",");

        //        sb.Append("\n\t\"EMPEDATE\":");
        //        sb.Append("\"" + GetDateTimeOffset(exRPT.EmployeeEndDate, exRPT.EmployeeEndDateTime) + "\",");
        //    }
        //    sb.Append("\r\n\t\"SERIALNAME\":");
        //    sb.Append("\"" + rptData.SERIALNAME + "\",");

        //    sb.Append("\r\n\t\"MET_START\":");
        //    sb.Append("\"Y\",");

        //    sb.Append("\r\n\t\"MET_SETUP\":");
        //    sb.Append("\"" + exRPT.ReportingSetupID + "\",");

        //    sb.Append("\r\n\t\"ACTNAME\":");
        //    sb.Append("\"" + rptData.ACTNAME + "\",");

        //    sb.Append("\r\n\t\"USERID\":");
        //    sb.Append(Convert.ToInt32(rptData.USERID) + ",");

        //    sb.Append("\r\n\t\"STIME\":");
        //    sb.Append("\"" + exRPT.MachineStartDateTime + "\",");

        //    sb.Append("\n\t\"ETIME\":");
        //    sb.Append("\"" + exRPT.MachineEndDateTime + "\",");

        //    sb.Append("\r\n\t\"EMPSTIME\":");
        //    sb.Append("\"" + exRPT.EmployeeStartDateTime + "\",");

        //    sb.Append("\n\t\"EMPETIME\":");
        //    sb.Append("\"" + exRPT.EmployeeEndDateTime + "\",");

        //    sb.Append("\r\n\t\"RTYPEBOOL\":");
        //    if (exRPT.Rework)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\r\n\t\"PLS_TEXT\":");
        //    if (string.IsNullOrEmpty(rptData.PLS_TEXT))
        //        sb.Append("\"\",");
        //    else
        //        sb.Append("\"" + rptData.PLS_TEXT + "\",");

        //    sb.Append("\r\n\t\"MET_ROBOT\":");
        //    if (rptData.MET_ROBOT)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\",");

        //    sb.Append("\n\t\"SDATE\":");
        //    sb.Append("\"" + GetDateTimeOffset(exRPT.MachineStartDate, exRPT.MachineStartDateTime) + "\",");

        //    //if (rptData.MET_END)
        //    //{
        //    sb.Append("\n\t\"EDATE\":"); //סיום מכונה
        //    sb.Append("\"" + GetDateTimeOffset(exRPT.MachineEndDate, exRPT.MachineEndDateTime) + "\",");

        //    sb.Append("\r\n\t\"MET_ADDSETUP\":");
        //    if (rptData.MET_ADDSETUP)
        //        sb.Append("\"Y\",");
        //    else
        //        sb.Append("\"N\"");

        //    sb.Append(CreateAlineStopData(breakCode, breakTime));
        //    sb.Append("}");

        //    return sb.ToString();

        //}

        //private string CreateAlineStopData(string breakCode, string breakTime)
        //{
        //    StringBuilder sb = new StringBuilder();
        //    sb.Append(",\n\t\"PLS_ALINESTOP_SUBFORM\": [\n\t\t{\n\t\t\t");
        //    sb.Append("\"STOPCODE\":");
        //    sb.Append("\"" + breakCode + "\",");

        //    if (string.IsNullOrEmpty(breakTime))
        //        breakTime = "00:00";

        //    sb.Append("\n\t\t\t\"STOPTIME\":");
        //    sb.Append("\"" + breakTime + "\"");

        //    sb.Append("\n\t\t}");
        //    sb.Append("\n\t\t]\n\t");
        //    //,\n\t\"PLS_ALINESTOP_SUBFORM\": [\n\t\t{\n\t\t\t\"STOPCODE\":\"05\",\n\t\t\t\"STOPTIME\":\"07:30:00.000\",\n\t\t\t\"PLS_STOPRE\":5\n\t\t}\n\t]
        //    return sb.ToString();
        //} 
        #endregion
//{
//  "@odata.context":"https://priority.metalicone.com/odata/Priority/tabula.ini/metalic/$metadata#ALINE_ONE","value":[
//    {
//      "CURDATE":"2018-02-10T00:00:00+02:00","DOC":907350,"SERIALNAME":"51701906","SERQUANT":100,"MET_PRODCOSTCNAME":null,"MET_WCCOSTCNAME":"M105","PARTNAME":"H10CA341-10230","MET_START":"Y","MET_END":null,"ACTNAME":"M42-11-17","ACTDES":"MILLING DMG70-105","WORKCNAME":"1367","WORKCDES":"\u05db\u05e8\u05e1\u05d5\u05dd EVO linear 70-DMG \u05de\u05d7' 105","USERID":503872,"BNAME":"\u05d0\u05d5\u05dc\u05d2 \u05d1\u05d5\u05d2\u05d3\u05e0\u05d5\u05d1 102","EMPCODE":null,"SNAME":null,"QUANT":0,"SQUANT":0,"MQUANT":0,"UNITNAME":"\u05d9\u05d7'","STIME":"19:58","ETIME":"19:58","ASPAN":"000:00","EMPSTIME":"19:58","EMPETIME":"19:58","EMPASPAN":"000:00","RTYPEBOOL":null,"WARHSNAME":null,"LOCNAME":null,"AINVFLAG":"R","EDATE":"2018-02-10T19:58:00+02:00","MET_QC":null,"SDATE":"2018-02-10T19:58:00+02:00","REVNAME":"01","ANALYSISVALID":null,"ANALYSISNOTVALID":null,"FORMNAME":"D180000046","GENERAL":"Y","MET_ROBOT":"Y","MET_STEP":null,"MET_SUMQUANT":0,"MET_SETUP":"S","EXCNAME":null,"EXCDES":null,"MET_COSTCNAME":null,"PLS_TEXT":null,"MET_MTIME":"N","MET_WORKTIME":"N","MET_SETUPEND":"N","MET_ADDSETUP":"N","MET_WEIGHT":null,"MET_WUNITNAME":null,"PLS_PARTDES":"IMP DRUM MACH MERON CL47600003","MET_USERLOGINSIG":"reportalnew","MET_UDATESIGN":"2018-02-10T19:59:00+02:00","EFI_ENGSUTIME":"002:00","EFI_ENGSTTIME":"001:10","EFI_SERSUTIME":"002:00","EFI_SERSTTIME":"001:10","PLS_SHIFTNAME":"2","MET_REPORTDATE":"2018-02-10T00:00:00+02:00","EMPSDATE":"2018-02-10T19:58:00+02:00","EMPEDATE":"2018-02-10T19:58:00+02:00","FORM":248903,"KLINE":1
//    }
//  ]
//}

        private string TransformeResultToXml(string res)
        {
            StringBuilder xml = new StringBuilder();
            string[] sperator1 = { "{", "}" };
            string[] cleanRes = res.Split(sperator1, StringSplitOptions.RemoveEmptyEntries);
            int indx = 0;

            if (cleanRes.Length > 0)
            {
                try
                {
                    xml.Append("<ROOT>");
                    
                    foreach (string row in cleanRes)
                    {
                        if (row.Contains("@odata.context"))
                            continue;

                        if (row.Trim().Equals("]"))
                            continue;

                        if (row.Trim().Equals(","))
                            continue;

                        xml.Append("<RESULT>");
                        string[] sper = { @",""" };
                        string[] arr = row.Split(sper, StringSplitOptions.RemoveEmptyEntries);
                        if (arr.Length > 0)
                        {

                            string[] tmp = null;
                            string[] sperator = { @""":""" };
                            foreach (var item in arr)
                            {
                                tmp = item.Split(sperator, StringSplitOptions.RemoveEmptyEntries);
                                if (tmp.Length == 1)
                                    tmp = item.Split(':');

                                if (tmp.Length > 0)
                                {
                                    var elm = tmp[0].Replace(@"""", "");
                                    elm = elm.Replace("\r\n", "").Trim();
                                    xml.Append("<");
                                    xml.Append(elm);
                                    xml.Append(">");
                                    xml.Append(tmp[1].Replace(@"""", ""));
                                    xml.Append("</");
                                    xml.Append(elm);
                                    xml.Append(">");
                                }
                            }
                            xml.Append("</RESULT>");
                        }
                        indx++;
                    }
                    xml.Append("</ROOT>");

                }
                catch (Exception ex)
                {
                    
                    string err = ex.Message;
                }
            }
            return xml.ToString();
        }

        private string TransformeResultToXml1(string res)
        {
            StringBuilder xml = new StringBuilder();
             string[] sperator1 = { "{", "}"};
             string[] cleanRes = res.Split(sperator1, StringSplitOptions.RemoveEmptyEntries);
             if (cleanRes.Length > 0)
             {
                 string[] arr = cleanRes[1].Split(',');
                 if (arr.Length > 0)
                 {
                     xml.Append("<RESULT>");
                     string[] tmp = null;
                     string[] sperator = { @""":"""};
                     foreach (var item in arr)
                     {
                         tmp = item.Split(sperator, StringSplitOptions.RemoveEmptyEntries);
                         if (tmp.Length == 1)
                             tmp = item.Split(':');

                         if (tmp.Length > 0)
                         {
                             var elm = tmp[0].Replace(@"""", "");
                             elm = elm.Replace("\r\n", "").Trim();
                             xml.Append("<");
                             xml.Append(elm);
                             xml.Append(">");
                             xml.Append(tmp[1].Replace(@"""", ""));
                             xml.Append("</");
                             xml.Append(elm);
                             xml.Append(">");
                         }
                     }
                     xml.Append("</RESULT>");
                 }
             }
            return xml.ToString();
        }
        
        private DateTime TestDateFormat(string date, string time)
        {
            AppLogger.log.Debug(AppLogger.CreateLogText("TestDateFormat => Date Value:", date));
            double hh = 0;
            double mm = 0;

            if (null == date)
                return DateTime.Now;

            DateTime dtRes = new DateTime();
            if (string.IsNullOrEmpty(time))
                time = DateTime.Now.ToShortTimeString();

            string[] arrT = time.Split(':');

            if (arrT.Length > 0)
            {
                hh = Convert.ToDouble(arrT[0]);
                mm = Convert.ToDouble(arrT[1]);
            }

            if (DateTime.TryParse(date, out dtRes))
            {
                dtRes.AddHours(hh);
                dtRes.AddMinutes(mm);
            }
            else
            {
                string[] arr = date.Split('-');
                if (arr.Length > 0)
                {
                    dtRes = new DateTime(Convert.ToInt32(arr[2]), Convert.ToInt32(arr[1]), Convert.ToInt32(arr[0]), (int)hh, (int)mm, 0);
                }
                else
                    AppLogger.log.Debug(AppLogger.CreateLogText("TestDateFormat => Date Value:", "Wrong date format"));
            }
            return dtRes;
        }

        private string GetDateTimeOffset(string date, string time)
        {
            DateTime dt = TestDateFormat(date, time);
            DateTimeOffset dto = new DateTimeOffset(dt);
            //string format = dto.Offset == TimeSpan.Zero ? "yyyy-MM-ddTHH:mm:ss.fffZ" : "yyyy-MM-ddTHH:mm:ss.fffzzz";
            return string.Format("{0:O}", dto);
        }

        private ResultAPI CreateResultApi(IRestResponse response)
        {
            ResultAPI res = new ResultAPI();
            XmlDocument doc = new XmlDocument();

            res.ResultStatus = response.StatusDescription;
            try
            {
                if ((res.ResultStatus.Equals("Created")) || res.ResultStatus.Equals("OK"))
                {
                    string json = response.Content;

                    res.ResultData = JsonConvert.DeserializeObject<OData>(json);

                    //doc = (XmlDocument)JsonConvert.DeserializeXmlNode(json, "RPT");
                    //if (null != doc)
                    //    res.ResultData = doc.GetElementsByTagName("DOC").Item(0).InnerText;
                }
                else if (res.ResultStatus.Equals("Conflict"))
                {
                    res.ErrorDescription = "Conflict - Check with system administrator";
                }
                else if (res.ResultStatus.ToLower().Equals("forbidden"))
                {
                    res.ErrorDescription = "Call Network system administrator, ned to reset 'Priority .NET Service'";
                }
                else if(res.ResultStatus.ToLower().Equals("internal server error"))
                {
                    res.ErrorDescription = "No Data.";
                }
                else
                {
                    doc.LoadXml(response.Content);
                    XmlNodeList parentNode = doc.GetElementsByTagName("InterfaceErrors");
                    if (null != parentNode)
                    {
                        AppLogger.log.Debug(AppLogger.CreateLogText("CreateResultApi => Response XML", response.Content), null);
                        foreach (XmlNode childrenNode in parentNode)
                        {
                            res.ErrorDescription += childrenNode.InnerText.Replace("'", "''") + "<br/>";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                AppLogger.log.Debug(AppLogger.CreateLogText("CreateResultApi", ex.Message));
            }
            return res;
        }

        
    }
    internal class OData
    {
        [JsonProperty("odata.metadata")]
        public string Metadata { get; set; }
        public List<Value> Value { get; set; }
    }

    internal class Value
    {
       // [JsonProperty("odata.type")]
        public string CDES { get; set; }
        public string CUSTNAME { get; set; }
        public string NAME { get; set; }
        public DateTime CURDATE { get; set; }
        public string ORDNAME { get; set; }
        public string AGENTNAME { get; set; }
        public string ORDSTATUSDES { get; set; }
    }
}