using Newtonsoft.Json;

namespace Grafika.Web.Models
{
    public class OAuthIdTokenModel
    {
        [JsonProperty("id_token")]
        public string GoogleToken { get; set; }

        [JsonProperty("access_token")]
        public string FacebookToken { get; set; }

        public string FindToken()
        {
            if (GoogleToken != null)
                return GoogleToken;
            if (FacebookToken != null)
                return FacebookToken;

            return null;
        }
    }
}
