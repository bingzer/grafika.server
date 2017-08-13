using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Services.Web.Filters
{
    public class ModelStateActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (ShouldSkipModelValidation(context))
                return;

            if (!context.ModelState.IsValid)
            {
                var errors = new List<string>();
                errors.AddRange(context.ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)));
                throw new NotValidException(string.Join("\n", errors));
            }
        }

        private bool ShouldSkipModelValidation(ActionExecutingContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor)
            {
                var skipAttribute = ((ControllerActionDescriptor)context.ActionDescriptor).MethodInfo.CustomAttributes
                    .FirstOrDefault(att => att.AttributeType == typeof(SkipModelValidationAttribute));
                return (skipAttribute != null);
            }

            return false;
        }
    }
}
