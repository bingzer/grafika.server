using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface ITemplatedRenderingEngine<TOutput>
    {
        Task<TOutput> Render<TModel>(string name, TModel model, string renderingType = ContentTypes.Html);
    }
}
