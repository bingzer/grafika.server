﻿using Newtonsoft.Json;

namespace Grafika.Web.Models
{
    public class ServerModel
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public string ContentUrl { get; set; }
        public string HealthUrl { get; set; }

        [JsonProperty("environment")]
        public string EnvironmentName { get; set; }
    }
}
