namespace Grafika.Services
{
    public interface IService
    {
        IServiceContext Context { get; }

        /// <summary>
        /// Current user
        /// </summary>
        IUserIdentity User { get; }
    }
}
