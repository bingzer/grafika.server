using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text;

namespace Grafika
{
    public static class EntityTypeExtensions
    {
        public static string GetGroupName(this EntityType entityType)
        {
            var memberInfo = entityType.GetType().GetMember(entityType.ToString())[0];
            var customAttributes = memberInfo.GetCustomAttribute<DisplayAttribute>();
            return customAttributes.GroupName;
        }

        public static string GetName(this EntityType entityType)
        {
            var memberInfo = entityType.GetType().GetMember(entityType.ToString())[0];
            var customAttributes = memberInfo.GetCustomAttribute<DisplayAttribute>();
            return customAttributes.Name;
        }
    }
}
