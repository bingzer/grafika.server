using Grafika.Animations;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Data.Mongo.Providers
{
    internal static class FindFluentExtensions
    {
        /// <summary>
        /// OrderBy by sort options
        /// </summary>
        /// <param name="findFluent"></param>
        /// <param name="sortOptions"></param>
        /// <returns></returns>
        internal static IFindFluent<Animation, Animation> OrderBy(this IFindFluent<Animation, Animation> findFluent, SortOptions sortOptions)
        {
            // order by
            switch (sortOptions?.Name)
            {
                case "views" when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.Views);
                    break;
                case "views" when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.Views);
                    break;
                case "lastModified" when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.DateModified);
                    break;
                case "lastModified" when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
                    break;
                case "rating" when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.Rating);
                    break;
                case "rating" when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.Rating);
                    break;
                default:
                    findFluent = findFluent.SortByDescending(anim => anim.DateModified);
                    break;
            }

            return findFluent;
        }
    }
}
