namespace Grafika
{
    public interface IEntityValidator<TEntity> where TEntity : class, IEntity
    {
        bool ValidateId(string entityId);

        /// <summary>
        /// Validate entity
        /// </summary>
        /// <param name="entity"></param>
        /// <exception cref="NotValidException"></exception>
        void Validate(TEntity entity);

        /// <summary>
        /// Sanitize entity if needed
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="caller"></param>
        /// <returns></returns>
        void Sanitize(TEntity entity, IUser caller = null);
    }
}
