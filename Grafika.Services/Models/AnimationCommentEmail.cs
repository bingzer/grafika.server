namespace Grafika.Services.Models
{
    public class AnimationCommentEmail : BaseEmailModel
    {
        public string Link { get; set; }

        public string ThumbnailUrl { get; set; }
        public string CommentUser { get; set; }
        public string Comment { get; set; }
    }
}
