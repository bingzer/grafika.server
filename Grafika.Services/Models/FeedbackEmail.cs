namespace Grafika.Services.Models
{
    public class FeedbackEmail : BaseEmailModel
    {
        public string Category { get; set; }
        public string Content { get; set; }
        public string FeedbackFrom { get; set; }

        public FeedbackEmail() { }
        public FeedbackEmail(FeedbackEmail model)
        {
            Category = model.Category;
            Content = model.Content;
            Subject = "New feedback: " + model.Subject;
        }
    }
}
