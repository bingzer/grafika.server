using Grafika.Animations;
using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Grafika.Data.Mongo.Supports;

namespace Grafika.Data.Mongo.Providers
{
    class AnimationBulkRemoveProvider : IBulkRemoveProvider<Animation>
    {
        public Task BulkRemove(IDataSet<Animation> dataset, IEnumerable<string> idsToRemove)
        {
            var filterDefinition = new ExpressionFilterDefinition<Animation>(doc => idsToRemove.Contains(doc.Id));
            var updateDefinition = new JsonUpdateDefinition<Animation>("{ $set: { removed: true } }");
            return dataset.ToMongoDataSet().Collection.UpdateManyAsync(filterDefinition, updateDefinition);
        }
    }
}
