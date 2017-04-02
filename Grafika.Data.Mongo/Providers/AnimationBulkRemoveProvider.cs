using Grafika.Animations;
using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace Grafika.Data.Mongo.Providers
{
    public class AnimationBulkRemoveProvider : IBulkRemoveProvider<Animation>
    {
        public async Task BulkRemove(IDataSet<Animation> dataset, IEnumerable<string> idsToRemove)
        {
            var mongoCollection = dataset.As<IMongoCollection<Animation>>();

            var filterDefinition = new ExpressionFilterDefinition<Animation>(doc => idsToRemove.Contains(doc.Id));
            var updateDefinition = new JsonUpdateDefinition<Animation>("{ $set: { removed: true } }");
            await mongoCollection.UpdateManyAsync(filterDefinition, updateDefinition);
        }
    }
}
