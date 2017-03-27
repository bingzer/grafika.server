using System.IO;

namespace Grafika.Animations
{
    public class FrameData
    {
        private string _contentType;

        public Stream Stream { get; set; }
        public string ContentType
        {
            get => _contentType;
            set => _contentType = ContentTypes.NoCharset(value);
        }
        public string ContentEncoding { get; set; }
        public long? ContentLength { get; set; }

        public FrameData()
        {
        }

        public FrameData(FrameData frameData = null)
        {
            Stream = frameData.Stream;
            ContentType = frameData.ContentType;
            ContentLength = frameData.ContentLength;
            ContentEncoding = frameData.ContentEncoding;
        }
    }
}
