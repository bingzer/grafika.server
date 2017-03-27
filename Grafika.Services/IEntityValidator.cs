namespace Grafika.Services
{
    public interface IEntityValidator<TEntity> : IValidator<TEntity>
        where TEntity : class, IEntity
    {
        /// <summary>
        /// Sanitize entity if needed
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="caller"></param>
        /// <returns></returns>
        void Sanitize(TEntity entity, IUser caller = null);
    }
}
