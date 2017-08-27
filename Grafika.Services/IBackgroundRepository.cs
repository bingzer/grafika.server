using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IBackgroundRepository : IRepository<Background, BackgroundQueryOptions>
    {
        Task RemoveByIds(IEnumerable<string> backgroundIds);
    }
}
