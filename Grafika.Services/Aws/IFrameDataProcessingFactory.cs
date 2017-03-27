using System;
using System.Linq;
using System.Text;

namespace Grafika.Services.Aws
{
    public interface IFrameDataProcessingFactory
    {
        IFrameDataProcessingStrategy GetProcessor(string contentEncoding);
    }
}
