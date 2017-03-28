using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace Grafika.Data.Mongo
{
    public class ObjectPartialUpdateDefinitionBuilder<TEntity> : IBuilder<UpdateDefinition<TEntity>>
    {
        private readonly TEntity _entity;
        private UpdateDefinition<TEntity> _update;

        public ObjectPartialUpdateDefinitionBuilder(TEntity entity)
        {
            _entity = entity;
            _update = new JsonUpdateDefinition<TEntity>($"{{ $set: {{ __vn: '{entity.GetType()}' }} }}");

            var type = entity.GetType();
            foreach (PropertyInfo propInfo in type.GetProperties())
            {
                var customAttribute = propInfo.GetCustomAttribute<BsonElementAttribute>();
                if (customAttribute == null) continue;

                if (propInfo.GetCustomAttribute<BsonIdAttribute>() != null)
                    continue;

                var name = customAttribute.ElementName;
                var value = propInfo.GetValue(entity);

                if (value != null)
                    _update = _update.Set(name, value);
            }
        }

        public ObjectPartialUpdateDefinitionBuilder<TEntity> AddIfNotNull(Expression<Func<TEntity, object>> exp)
        {
            var kvp = GetFromExpression(exp);
            if (kvp.Value != null)
                _update = _update.Set(kvp.Key, kvp.Value);
            return this;
        }

        public UpdateDefinition<TEntity> Build()
        {
            return _update;
        }

        private KeyValuePair<string, object> GetFromExpression(Expression<Func<TEntity, object>> exp)
        {
            MemberExpression member = null;

            if (exp.Body is MemberExpression)
                member = exp.Body as MemberExpression;
            if (exp.Body is UnaryExpression)
                member = (exp.Body as UnaryExpression).Operand as MemberExpression;

            PropertyInfo propInfo = member.Member as PropertyInfo;
            var customAttribute = propInfo.GetCustomAttribute<BsonElementAttribute>();
            var name = customAttribute.ElementName;
            var value = exp.Compile()(_entity);

            return new KeyValuePair<string, object>(name, value);
        }
    }
}
