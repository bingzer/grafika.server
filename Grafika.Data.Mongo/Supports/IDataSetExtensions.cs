using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Data.Mongo.Supports
{
    internal static class IDataSetExtensions
    {
        public static IMongoDataSet<TEntity> ToMongoDataSet<TEntity>(this IDataSet<TEntity> dataSet)
            where TEntity : class
        {
            var mongoDataSet = dataSet as IMongoDataSet<TEntity>;
            if (mongoDataSet == null)
                throw new NotExpectedException("Expecting type of IMongoDataSet<" + typeof(TEntity) + ">");

            return mongoDataSet;
        }
    }
}
