using System;
using System.ComponentModel;

namespace Grafika.Animations
{
    public class Resource : IResource
    {
        public virtual string Id { get; set; }
        public virtual string Type { get; set; }
        public virtual string ContentType { get; set; }
    }
}
