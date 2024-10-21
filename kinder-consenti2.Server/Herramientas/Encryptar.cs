using System.Security.Cryptography;
using System.Text;

namespace kinder_consenti2.Server.Herramientas
{
    public class Encryptar
    {
        public static string encripSHA256(string dato) 
        { 
            SHA256 sha256 = SHA256.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] stream = null;
            StringBuilder sb = new StringBuilder();
            stream = sha256.ComputeHash(encoding.GetBytes(dato));
            for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:x2}", stream[i]);
            return sb.ToString();
        }
    }
}
