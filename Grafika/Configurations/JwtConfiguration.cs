using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Configurations
{
    public class JwtConfiguration
    {
        /*
         * 
            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);
                */
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public TimeSpan ExpirationLength { get; set; } = TimeSpan.FromDays(1);
    }
}
