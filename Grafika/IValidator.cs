using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Grafika
{
    public interface IValidator<TEntity>
    {
        /// <summary>
        /// Validate entity
        /// </summary>
        /// <param name="entity"></param>
        /// <exception cref="NotValidException"></exception>
        void Validate(TEntity entity);
    }

    public class Validator<TEntity> : IValidator<TEntity>
    {
        public virtual void Validate(TEntity entity)
        {
            var list = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(entity, new ValidationContext(entity), list, true);
            if (!isValid)
                throw new NotValidException(list);
        }
    }
}
