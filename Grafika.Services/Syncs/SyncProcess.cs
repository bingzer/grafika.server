using Grafika.Syncs;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using Grafika.Utilities;

namespace Grafika.Services.Syncs
{
    internal abstract class SyncProcess : ISyncProcess
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SyncProcess> _logger;
        private readonly IUser _user;

        public IServiceProvider ServiceProvider => _serviceProvider;
        public ILogger<SyncProcess> Logger => _logger;
        public IUser User => _user;

        public abstract string ProcessName { get; }

        protected SyncProcess(IServiceProvider serviceProvider, IUser user)
        {
            _serviceProvider = serviceProvider;
            _user = user;

            ILoggerFactory loggerFactory = _serviceProvider.Get<ILoggerFactory>();
            _logger = loggerFactory.CreateLogger<SyncProcess>();
        }

        public async Task<SyncResult> Sync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            await Task.Delay(100);

            Logger.LogInformation(ProcessName);

            await ExecuteSync(result, localChanges, serverChanges);
            return result;
        }

        protected abstract Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges);
    }
}
