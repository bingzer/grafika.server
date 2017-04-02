using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Grafika.Utilities
{
    public static class ObjectJsonExtensions
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings().ApplySerializerSettings();

        public static JsonSerializerSettings ApplySerializerSettings(this JsonSerializerSettings settings)
        {
            if (settings != null)
            {
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                settings.DefaultValueHandling = DefaultValueHandling.Include;
                settings.NullValueHandling = NullValueHandling.Ignore;
            }

            return settings;
        }

        public static string ToJson(this object any)
        {
            return JsonConvert.SerializeObject(any, Settings);
        }

        public static JObject ToJObject(this object any)
        {
            var jsonString = any.ToJson();
            return JObject.Parse(jsonString);
        }
    }
}
