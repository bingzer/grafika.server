﻿using Grafika.Animations;
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
                case AnimationQueryOptions.SortByViews when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.Views);
                    break;
                default:
                case AnimationQueryOptions.SortByViews when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.Views);
                    break;
                case AnimationQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.DateModified);
                    break;
                case AnimationQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
                    break;
                case AnimationQueryOptions.SortByRatings when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.Rating);
                    break;
                case AnimationQueryOptions.SortByRatings when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.Rating);
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
                case BackgroundQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.DateModified);
                    break;
                default:
                case BackgroundQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
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
        internal static IFindFluent<Series, Series> OrderBy(this IFindFluent<Series, Series> findFluent, SortOptions sortOptions)
        {
            // order by
            switch (sortOptions?.Name)
            {
                case SeriesQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Ascending:
                    findFluent = findFluent.SortBy(q => q.DateModified);
                    break;
                default:
                case SeriesQueryOptions.SortByLastModified when sortOptions.Direction == SortDirection.Descending:
                    findFluent = findFluent.SortByDescending(q => q.DateModified);
                    break;
            }

            return findFluent;
        }
    }
}
