using Newtonsoft.Json;

namespace Grafika
{
    public interface ISignedUrl
    {
        [JsonProperty("mime")]
        string ContentType { get; }
        [JsonProperty("signedUrl")]
        string Url { get; }
    }

}
