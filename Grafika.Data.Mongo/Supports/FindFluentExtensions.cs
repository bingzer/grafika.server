using Grafika.Animations;
using MongoDB.Driver;

namespace Grafika.Data.Mongo.Supports
{
    internal static class FindFluentExtensions
    {
        /// <summary>
        /// Animation OrderBy by sort options
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

        /// <summary>
        /// Background OrderBy by sort options
        /// </summary>
        /// <param name="findFluent"></param>
        /// <param name="sortOptions"></param>
        /// <returns></returns>
        internal static IFindFluent<Background, Background> OrderBy(this IFindFluent<Background, Background> findFluent, SortOptions sortOptions)
        {
            // order by
            switch (sortOptions?.Name)
            {
                case "lastModified" when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.DateModified);
                    break;
                case "lastModified" when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
                    break;
                default:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
                    break;
            }

            return findFluent;
        }
    }
}
