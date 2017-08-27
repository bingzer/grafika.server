using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Grafika
{
    public abstract class EntityValidator<TEntity> : IEntityValidator<TEntity>
        where TEntity : class, IEntity
    {
        private readonly IEntityIdValidator _entityIdValidator;

        public EntityValidator(IEntityIdValidator entityIdValidator)
        {
            _entityIdValidator = entityIdValidator;
        }

        public virtual void Validate(TEntity entity)
        {
            var list = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(entity, new ValidationContext(entity), list, true);
            if (!isValid)
                throw new NotValidException(list);
        }

        public virtual bool ValidateId(string entityId)
        {
            return _entityIdValidator.ValidateId(entityId);
        }

        public abstract void Sanitize(TEntity entity, IUser caller = null);
    }
}
