using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.WebSite.ViewModels
{
    public class AccountViewModel
    {
        public IUser User { get; set; }
        public UserPreference Preference { get; set; }
    }
}
