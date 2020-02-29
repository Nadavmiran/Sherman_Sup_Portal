using log4net;
using System.Data.SqlClient;
using System.Text;

namespace LMNS.App.Log
{
    public static class AppLogger
    {
        public static ILog log = log4net.LogManager.GetLogger("Reporting Portal Logger");
        public static string CreateLogText(string FunctionName, string ExceptionMsg)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("FunctionName = ");
            sb.Append(FunctionName);
            sb.Append("ExceptionMsg = ");
            sb.Append(ExceptionMsg);

            return sb.ToString();
        }

        public static string CreateLogText(string FunctionName, string ExceptionMsg, params object[] Parameters)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("FunctionName = ");
            sb.Append(FunctionName);
            sb.Append("@\n");
            sb.Append("Parameters = ");
            sb.Append(GetParametersList(Parameters));
            sb.Append("@\n");
            sb.Append(" ExceptionMsg = ");
            sb.Append(ExceptionMsg);
           

            return sb.ToString();
        }

        private static string GetParametersList(params object[] Parameters)
        {
            StringBuilder sb = new StringBuilder();
            foreach (var p in Parameters)
            {
                if(p is SqlParameter)
                {
                    sb.Append("ParameterName = ");
                    sb.Append((p as SqlParameter).ParameterName);
                    sb.Append("@\n");
                    sb.Append("ParameterValue = ");
                    sb.Append((p as SqlParameter).Value);
                    sb.Append("@\n");
                }
                else
                {
                    sb.Append("ParameterValue = ");
                    sb.Append(p.ToString());
                }
            }
            return sb.ToString();
        }
    }
}