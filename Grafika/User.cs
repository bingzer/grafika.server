using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika
{
    [BsonIgnoreExtraElements]
    public class User : BaseEntity, IUser
    {
        public const string Anonymous = "Anonymous";

        #region Constructor
        public User()
        {
        }

        public User(string id)
        {
            Id = id;
        }

        public User(IUser user)
        {
            Id = user.Id;
            Email = user.Email;
            Username = user.Username;
            FirstName = user.FirstName;
            LastName = user.LastName;
            IsActive = user.IsActive;
            DateCreated = user.DateCreated;
            DateModified = user.DateModified;
            Username = user.Username;

            if (user.Roles != null)
                Roles = new List<string>(user.Roles);
        }
        #endregion

        [BsonElement("email")]
        public string Email { get; set; }
        [BsonElement("username")]
        public string Username { get; set; }
        [BsonElement("firstName")]
        public string FirstName { get; set; }
        [BsonElement("lastName")]
        public string LastName { get; set; }
        [BsonElement("active")]
        public bool? IsActive { get; set; }

        [BsonElement("prefs")]
        public UserPreference Prefs { get; set; }

        [BsonElement("roles")]
        public IEnumerable<string> Roles { get; set; }

        [BsonElement("local")]
        public UserLocal Local { get; set; }
        [BsonElement("google")]
        public UserOAuth Google { get; set; }
        [BsonElement("facebook")]
        public UserOAuth Facebook { get; set; }
        [BsonElement("activation")]
        public UserActivation Activation { get; set; }
        [BsonElement("subscriptions")]
        public UserSubscriptions Subscriptions { get; set; }
        [BsonElement("stats")]
        public UserStats Stats { get; set; }

        /// <summary>
        /// Called by JSON.NET to skip serialization
        /// when roles is empty
        /// </summary>
        public bool ShouldSerializeRoles() => Roles.Any();
    }

    [BsonIgnoreExtraElements]
    public class UserLocal
    {
        [JsonProperty("registered")]
        [BsonElement("registered")]
        public bool? IsRegistered { get; set; }
        [BsonElement("password")]
        public string Password { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class UserOAuth
    {
        [BsonElement("id")]
        public string Id { get; set; }
        [BsonElement("token")]
        public string Token { get; set; }
        [BsonElement("displayName")]
        public string DisplayName { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class UserActivation
    {
        [BsonElement("hash")]
        public string Hash { get; set; }
        [BsonElement("timestamp")]
        public DateTime? Timestamp { get; set; }

        public bool IsActivationValid(string hash, TimeSpan timespan)
        {
            return (Hash == hash && !IsExpired(timespan));
        }

        /// <summary>
        /// Checks to see if timestamp is expired
        /// </summary>
        /// <param name="timespan"></param>
        /// <returns></returns>
        public bool IsExpired(TimeSpan timespan)
        {
            if (Timestamp == null)
                return true;

            var now = DateTimeOffset.UtcNow - new DateTimeOffset(Timestamp.Value);
            return now.TotalMinutes > timespan.TotalMinutes;
        }
    }

    [BsonIgnoreExtraElements]
    public class UserPreference
    {
        [BsonElement("avatar")]
        public string Avatar { get; set; }
        [BsonElement("backdrop")]
        public string Backdrop { get; set; }

        [BsonElement("drawingIsPublic")]
        public bool? DrawingIsPublic { get; set; }
        [BsonElement("drawingAuthor")]
        public string DrawingAuthor { get; set; }

        [BsonElement("drawingTimer")]
        public int? DrawingTimer { get; set; }

        [BsonElement("playbookLoop")]
        public bool? PlaybackLoop { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class UserSubscriptions
    {
        [BsonElement("emailMarketing")]
        public bool? EmailMarketing { get; set; }
        [BsonElement("emailAnimationComment")]
        public bool? EmailOnComments { get; set; }
        [BsonElement("emailAnimationRating")]
        public bool? EmailOnRating { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class UserStats
    {
        [BsonElement("dateLastSeen")]
        public long? DateLastSeen { get; set; }
    }
}
