using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface ISeriesService : IEntityService<Grafika.Animations.Series, SeriesQueryOptions>
    {
        Task EnsureHandpickedSeriesCreated();
        Task<Series> GetHandpickedSeries();
    }
}
