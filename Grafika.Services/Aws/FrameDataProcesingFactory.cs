using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Services.Aws
{
    internal class FrameDataProcesingFactory : IFrameDataProcessingFactory
    {
        private readonly ICollection<IFrameDataProcessingStrategy> _strategies = new List<IFrameDataProcessingStrategy>();

        public FrameDataProcesingFactory(IServiceProvider serviceProvider)
        {
            _strategies.Add(serviceProvider.Get<FrameDataRawProcessingStrategy>());
            _strategies.Add(serviceProvider.Get<FrameDataDeflatedProcessingStrategy>());
        }

        public IFrameDataProcessingStrategy GetProcessor(string contentEncoding)
        {
            return _strategies.First(s => s.AcceptEncoding(contentEncoding));
        }
    }
}
