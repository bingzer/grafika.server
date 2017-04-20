using Grafika.Animations;
using System;
using System.Threading.Tasks;

namespace Grafika.Data
{
    public interface IDataContext : IDisposable
    {
        IDataSet<Animation> Animations { get; }
        IDataSet<Background> Backgrounds { get; }
        IDataSet<User> Users { get; }

        IDataSet<IEntity> Set<IEntity>() where IEntity : class;

        /// <summary>
        /// Validate Id format
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool ValidateId(string id);
    }
}
