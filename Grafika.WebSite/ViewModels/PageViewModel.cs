namespace Grafika.WebSite.ViewModels
{
    public class PageViewModel
    {
        public string Title { get; set; }
        public string Description { get; set; }

        // optional can be blank
        public string ThumbnailUrl { get; set; }

        // TODO: MOVE ME
        public string FacebookAppId => "1742692282614357";
        public string TwitterSiteId => "791028721138401281";
        public string TwitterHandle => "@grafikapp";
        public string SiteName => "Grafika";
        public string SiteUrl => "https://grafika.bingzer.com";
    }
}
