using System.Collections.Generic;

namespace Grafika.Configurations
{
    public class ContentConfiguration
    {
        public string Url { get; set; }
        public string OAuthCallbackPath { get; set; }

        public string PrivacyPath { get; set; }
        public string EulaPath { get; set; }
        public string BackdropsPath { get; set; }

        public string DefaultAvatarPath { get; set; }
        public string DefaultBackdropPath { get; set; }

        public IEnumerable<string> HandpickedAnimationIds { get; set; }
        public int UsersCount { get; set; }
        public int AnimationsCount { get; set; }

        public string PageTitle { get; set; } = "Grafika - Animation Maker";
        public string PageDescription { get; set; } = "A super simple animation maker, viewer, sharer and community for the web and Android by creators like you provided by Grafika";
        public string PageKeyword { get; set; } = "grafika,animation,animation maker,animation creator";
    }
}
