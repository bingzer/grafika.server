namespace Grafika
{
    public class AuthenticationToken
    {
        public static AuthenticationToken Empty => new AuthenticationToken();

        /// <summary>
        /// Generic public id (maybe null)
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// The token
        /// </summary>
        public string Token { get; set; }
    }
}
