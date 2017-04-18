using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Grafika.Animations
{
    public interface IResource
    {
        string Id { get; }
        string Type { get; }
        [JsonProperty("mime")]
        string ContentType { get; }
    }
}
