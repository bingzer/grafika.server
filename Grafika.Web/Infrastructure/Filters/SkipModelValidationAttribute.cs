﻿using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Web.Infrastructure.Filters
{
    /// <summary>
    /// Used by ModelStateActionFilter
    /// </summary>
    public class SkipModelValidationAttribute : ActionFilterAttribute
    {
    }
}
