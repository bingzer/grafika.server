namespace Grafika.WebSite.ViewModels
{
    public class PageViewModel
    {
        public string Title { get; set; } = "Grafika Animations";
        public string Description { get; set; } = "A super simple animation maker, viewer, sharer and community for the web and Android by creators like you provided by Grafika";
        public string Keyword { get; set; } = "grafika,animation,animation maker,animation creator";

        // optional can be blank
        public string ThumbnailUrl { get; set; }

        // TODO: MOVE ME
        public string FacebookAppId => "1742692282614357";
        public string TwitterSiteId => "791028721138401281";
        public string TwitterHandle => "@grafikapp";
        public string SiteName => "Grafika";
        public string SiteUrl => "https://grafika.bingzer.com";
        public string SiteAuthor => "Grafika Team";
    }
}
