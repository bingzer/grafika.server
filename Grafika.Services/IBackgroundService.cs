using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IBackgroundService : IEntityService<Background, BackgroundQueryOptions>
    {
        Task Delete(IEnumerable<string> backgroundIds);
    }
}
