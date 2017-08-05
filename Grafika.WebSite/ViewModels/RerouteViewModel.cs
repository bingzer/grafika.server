using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.WebSite.ViewModels
{
    public class RerouteViewModel
    {
        public const string ResetPassword = "reset-pwd";

        public string Action { get; set; }
        public string Hash { get; set; }
        public string User { get; set; }
    }
}
