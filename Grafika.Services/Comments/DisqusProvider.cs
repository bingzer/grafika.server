﻿using Grafika.Configurations;
using Grafika.Services.Extensions;
using Grafika.Utilities;
using Microsoft.Extensions.Options;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Services.Comments
{
    class DisqusProvider : ICommentProvider
    {
        private readonly IUserService _userService;
        private readonly DisqusOAuthProviderConfiguration _disqusConfig;
        private readonly ServerConfiguration _serverConfig;

        public DisqusProvider(IUserService userService, 
            IOptions<DisqusOAuthProviderConfiguration> disqusOpts, 
            IOptions<ServerConfiguration> serverOpts)
        {
            _userService = userService;
            _disqusConfig = disqusOpts.Value;
            _serverConfig = serverOpts.Value;
        }

        public async Task<AuthenticationToken> GenerateAuthenticationToken(IUser user)
        {
            var userdata = new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                avatar = await _userService.GetAvatarOrBackdropUrl(user.Id, "avatar"),
                url = user.GetUrl()
            };

            return new AuthenticationToken
            {
                Id = _disqusConfig?.Id,
                Token = GenerateSsoPayload(userdata.ToJson())
            };
        }

        public async Task<Uri> GetCommentUrl(ICommentAuthenticationContext context)
        {
            var serverUrl = context.ServerUrl.ToString();
            var disqusToken = context.User == null ? AuthenticationToken.Empty : await GenerateAuthenticationToken(context.User);
            var userToken = context.UserToken;

            var seoUrl = context.Url;
            var postUrl = context.PostUrl;
            var queryString = $"url={seoUrl}&title={EncodeAscii(context.Title)}&shortname=grafika-app&identifier={context.Id}&pub={disqusToken.Id}&disqusToken={disqusToken.Token}&postUrl={postUrl}&jwtToken={userToken.Token}";

            var urlBuilder = new UriBuilder(Utility.CombineUrl(_serverConfig.Url, "comments"))
            {
                Query = queryString
            };

            return urlBuilder.Uri;
        }

        private static string EncodeAscii(string any)
        {
            var utf8Bytes = Encoding.UTF8.GetBytes(any.Replace("\n", ""));
            var ascii = Encoding.ASCII.GetString(utf8Bytes);
            ascii = ascii.Replace("#", "").Replace("?", "");

            return ascii;
        }

        #region https://github.com/disqus/DISQUS-API-Recipes/blob/master/sso/cs/DisqusSSO.cs

        private string GenerateSsoPayload(string serializedUserData)
        {
            byte[] userDataAsBytes = Encoding.UTF8.GetBytes(serializedUserData);

            // Base64 Encode the message
            string Message = System.Convert.ToBase64String(userDataAsBytes);

            // Get the proper timestamp
            TimeSpan ts = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0));
            string Timestamp = Convert.ToInt32(ts.TotalSeconds).ToString();

            // Convert the message + timestamp to bytes
            byte[] messageAndTimestampBytes = Encoding.ASCII.GetBytes(Message + " " + Timestamp);

            // Convert Disqus API key to HMAC-SHA1 signature
            byte[] apiBytes = Encoding.ASCII.GetBytes(_disqusConfig.Secret);
            using (HMACSHA1 hmac = new HMACSHA1(apiBytes))
            {
                byte[] hashedMessage = hmac.ComputeHash(messageAndTimestampBytes);

                // Put it all together into the final payload
                return Message + " " + ByteToString(hashedMessage) + " " + Timestamp;
            }
        }

        private string ByteToString(byte[] buff)
        {
            string sbinary = "";

            for (int i = 0; i < buff.Length; i++)
            {
                sbinary += buff[i].ToString("x2"); // hex format
            }
            return (sbinary);
        }
        #endregion
    }
}
