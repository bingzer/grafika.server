using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace Grafika.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var port = Environment.GetEnvironmentVariable("PORT");
            Console.WriteLine("Assigned port is " + port);

            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                //.UseApplicationInsights()
                .UseUrls("http://+:" + port)
                .Build();

            host.Run();
        }
    }
}
