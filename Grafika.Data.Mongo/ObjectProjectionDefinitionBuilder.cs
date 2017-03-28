using Grafika.Utilities;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Grafika.Data.Mongo
{
    public class ObjectProjectionDefinitionBuilder<TEntity, TProjection> : IBuilder<ProjectionDefinition<TEntity, TProjection>>
        where TProjection : class, new()
    {
        public ObjectProjectionDefinitionBuilder()
        {
        }

        public ProjectionDefinition<TEntity, TProjection> Build()
        {
            var jobj = new JObject();
            foreach(var propInfo in typeof(TProjection).GetProperties())
            {
                var customAttribute = propInfo.GetCustomAttribute<BsonElementAttribute>();
                if (customAttribute == null) continue;

                jobj.Add(new JProperty(customAttribute.ElementName, 1));
            }

            return new JsonProjectionDefinition<TEntity, TProjection>(jobj.ToString());

            //return new ObjectProjectionDefinition<TEntity, TProjection>(obj);
        }
    }
}
