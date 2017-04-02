using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika
{
    public interface IEntity
    {
        [JsonProperty("_id")]
        string Id { get; }
    }
}
