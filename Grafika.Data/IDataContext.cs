using Grafika.Animations;
using System;

namespace Grafika.Data
{
    public interface IDataContext : IDisposable
    {
        IDataSet<Animation> Animations { get; }
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
