namespace Grafika.Web.ViewModels
{
    public class FileUploadViewModel
    {
        public string UploadFunction { get; set; }
    }

    public class ImageFileUploadViewModel : FileUploadViewModel
    {
        public int Width { get; set; } = 100;
        public int Height { get; set; } = 100;
        public int PreviewWidth { get; set; } = 100;
        public int PreviewHeight { get; set; } = 100;

    }
}
