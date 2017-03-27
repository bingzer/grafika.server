using System.Collections.Generic;
using System.Linq;

namespace Grafika.Services.Aws
{
    internal class FrameDataProcesingFactory : IFrameDataProcessingFactory
    {
        private readonly IEnumerable<IFrameDataProcessingStrategy> _strategies = new List<IFrameDataProcessingStrategy>
        {
            new FrameDataRawProcessingStrategy(),
            new FrameDataDeflatedProcessingStrategy()
        };

        public IFrameDataProcessingStrategy GetProcessor(string contentEncoding)
        {
            return _strategies.First(s => s.AcceptEncoding(contentEncoding));
        }
    }
}
