using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.WebSite.ViewModels
{
    public class PageViewModel
    {
        public string Title { get; set; } = AppEnvironment.Default.Content.PageTitle;
        public string Description { get; set; } = AppEnvironment.Default.Content.PageDescription;
        public string Keyword { get; set; } = AppEnvironment.Default.Content.PageKeyword;

        public bool UseNavigationBar { get; set; } = true;
        public bool UseFooter { get; set; } = true;

        // optional can be blank
        public ThumbnailViewModel Thumbnail { get; set; } = new ThumbnailViewModel(Utility.CombineUrl(AppEnvironment.Default.Content.Url, "/img/feature-graphics-min.png"), 1024, 500);

        // TODO: MOVE ME
        public string FacebookAppId => "1742692282614357";
        public string TwitterSiteId => "791028721138401281";
        public string TwitterHandle => "@grafikapp";
        public string SiteName => "Grafika";
        public string SiteUrl => "https://grafika.bingzer.com";
        public string SiteAuthor => "Grafika Team";

        public static PageViewModel StickDrawPageViewModel => new PageViewModel
        {
            Title = "StickDraw",
            Description = "An animation maker app for Android that is super easy to learn or use. Get your animation up and running within seconds. StickDraw is great for animating your Stick Figure / Stick Person drawings or a simple stop motion animation.",
            Keyword = "StickDraw, animation maker, StickDraw android",
            Thumbnail = new ThumbnailViewModel(Utility.CombineUrl(AppEnvironment.Default.Content.Url, "/img/stickdraw-background-min.png"), 1025, 500),
        };

    }

    public class ThumbnailViewModel
    {
        public string Url { get; private set; }
        public int Width { get; private set; }
        public int Height { get; private set; }

        public ThumbnailViewModel(string url, int? width, int? height)
        {
            Url = url;
            Width = width ?? 800;
            Height = height ?? 400;
        }
    }
}
