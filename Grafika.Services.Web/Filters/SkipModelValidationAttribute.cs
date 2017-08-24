using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Services.Web.Filters
{
    /// <summary>
    /// Used by ModelStateActionFilter
    /// </summary>
    public class SkipModelValidationAttribute : ActionFilterAttribute
    {
    }
}
