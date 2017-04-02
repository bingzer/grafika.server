using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Services.Aws
{
    class SignedUrl : ISignedUrl
    {
        public string Url { get; set; }
        public string ContentType { get; set; }
    }
}
