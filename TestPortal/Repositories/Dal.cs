using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace LMNS.Repositories
{
    public class Dal
    {
        private SqlConnection _conn;
        public string MyConnectionString;
        public int CommandTimeout = 999;
        public static string ConnName { get; set; }
        internal static string DefultConnStr = null;

        public static string GetConnectionString()
        {
            return ConnectionStringByCompany(ConnName);
            //return ConfigurationManager.ConnectionStrings[ConnName].ConnectionString;
        }
        public Dal()
        {

        }

        public Dal(string constr)
        {
            _conn = new SqlConnection { ConnectionString = constr };
            MyConnectionString = constr;
            _conn.Open();
        }

        public void Connect()
        {
            _conn = new SqlConnection();
            MyConnectionString = GetConnectionString();
            _conn.ConnectionString = MyConnectionString;
            _conn.Open();
        }

        public void Connect(string dbName)
        {
            _conn = new SqlConnection();

            if (string.IsNullOrEmpty(MyConnectionString))

                _conn.ConnectionString = MyConnectionString;
            _conn.Open();
        }

        private void MakeSureConnectionOpen()
        {
            if (_conn.State != ConnectionState.Open)
                _conn.Open();
        }


        public SqlDataReader GetRecordSet(string spName, CommandType cmdType, params SqlParameter[] p)
        {
            _conn = new SqlConnection(MyConnectionString);
            _conn.Open();
            var command = new SqlCommand(spName, _conn)
            {
                CommandTimeout = CommandTimeout,
                CommandType = cmdType
            };

            foreach (var y in p)
                command.Parameters.Add(y);
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }

        public SqlDataReader GetRecordSet(string spName, params SqlParameter[] p)
        {
            MyConnectionString = DefultConnStr;
            _conn = new SqlConnection(MyConnectionString ?? GetConnectionString());
            _conn.Open();
            var command = new SqlCommand(spName, _conn)
            {
                CommandTimeout = CommandTimeout,
                CommandType = CommandType.StoredProcedure
            };

            foreach (var y in p)
                command.Parameters.Add(y);
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }

        public SqlDataReader GetRecordSet(string spName)
        {
            _conn = new SqlConnection(MyConnectionString ?? GetConnectionString());
            _conn.Open();
            var command = new SqlCommand(spName, _conn)
            {
                CommandTimeout = CommandTimeout,
                CommandType = CommandType.StoredProcedure
            };

            //foreach (var y in p)
            //    command.Parameters.Add(y);
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }

        public object ExecuteSclar(string spName, params SqlParameter[] p)
        {
            _conn = new SqlConnection(MyConnectionString ?? GetConnectionString());
            _conn.Open();
            var command = new SqlCommand(spName, _conn)
            {
                CommandTimeout = CommandTimeout,
                CommandType = CommandType.StoredProcedure
            };

            foreach (var y in p)
            {
                if (y != null)
                    command.Parameters.Add(y);
            }

            return command.ExecuteScalar();
        }

        public void Excute(string spName, params SqlParameter[] p)
        {
            _conn = new SqlConnection(MyConnectionString ?? GetConnectionString());
            _conn.Open();

            var command = new SqlCommand(spName, _conn)
            {
                CommandTimeout = CommandTimeout,
                CommandType = CommandType.StoredProcedure
            };



            foreach (var y in p)
            {
                if (y != null)
                {
                    command.Parameters.Add(y);
                }
            }

            try
            {
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                var s = ex.Message;
            }
        }

        public SqlParameter ParamMaker(string pName, SqlDbType pType, int pSize, ParameterDirection pDir,
            ref object pValue)
        {
            var p = new SqlParameter(pName, pType, pSize)
            {
                Direction = pDir,
                Value = pValue
            };
            return p;
        }


        public SqlParameter ParamMaker(string pName, SqlDbType pType, int pSize, object pValue)
        {
            var p = new SqlParameter(pName, pType, pSize)
            {
                Direction = ParameterDirection.Input,
                Value = pValue ?? DBNull.Value
            };
            return p;
        }

        public SqlParameter ParamMaker(string pName, object pValue)
        {
            SqlParameter p = null;
            if (pValue is int)
            {
                p = new SqlParameter(pName, SqlDbType.Int, 4);
            }
            else if (pValue is long)
            {
                p = new SqlParameter(pName, SqlDbType.BigInt, 10);
            }
            else if (pValue is string)
            {
                p = new SqlParameter(pName, SqlDbType.VarChar, pValue.ToString().Length);
            }
            else if (pValue is bool)
            {
                p = new SqlParameter(pName, SqlDbType.Bit);
            }
            else if (pValue == null)
            {
                p = new SqlParameter(pName, DBNull.Value);
            }
            else if (pValue is DateTime)
            {
                p = new SqlParameter(pName, SqlDbType.DateTime);
                // pValue = new DateTime(1973, 8, 26);
            }
            if (p != null && p.Value == null)
            {
                p.Direction = ParameterDirection.Input;
                p.Value = pValue;
            }

            return p;
        }

        internal static string ConnectionStringByCompany(string companyName)
        {
            string connName = string.Empty;
            if (string.IsNullOrEmpty(companyName))
            {
                connName = ConfigurationManager.AppSettings["Defult_ConnStr"].ToString();
                ConnName = companyName = ConfigurationManager.AppSettings["Defult_DNAME"].ToString();
                DefultConnStr = ConfigurationManager.ConnectionStrings[connName].ConnectionString;
                DefultConnStr = ConfigurationManager.ConnectionStrings[connName].ConnectionString.Replace("{COMPANY_NAME}", ConnName);
            }
            else
            {
                ConnName = companyName;
                connName = ConfigurationManager.AppSettings["Defult_ConnStr"].ToString();
                DefultConnStr = ConfigurationManager.ConnectionStrings[connName].ConnectionString.Replace("{COMPANY_NAME}", ConnName);
            }

            return DefultConnStr;
        }
    }
}