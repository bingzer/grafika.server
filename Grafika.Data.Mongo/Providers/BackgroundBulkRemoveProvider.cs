using Grafika.Animations;
using Grafika.Data.Mongo.Supports;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.Providers
{
    class BackgroundBulkRemoveProvider : IBulkRemoveProvider<Background>
    {
        public Task BulkRemove(IDataSet<Background> dataSet, IEnumerable<string> idsToRemove)
        {
            var filterDefinition = new ExpressionFilterDefinition<Background>(doc => idsToRemove.Contains(doc.Id));
            var updateDefinition = new JsonUpdateDefinition<Background>("{ $set: { removed: true } }");
            return dataSet.ToMongoDataSet().Collection.UpdateManyAsync(filterDefinition, updateDefinition);
        }
    }
}
