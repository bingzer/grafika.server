﻿using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IBackgroundService : IEntityService<Background, BackgroundQueryOptions>
    {
        Task Delete(IEnumerable<string> backgroundIds);

        Task<FrameData> GetFrameData(string backgroundId, FrameData frameData);
        Task PostFrameData(string backgroundId, FrameData frameData);

        Task<string> GetThumbnailUrl(string backgroundId);
        Task<ISignedUrl> CreateThumbnail(string backgroundId);
        Task<bool> HasThumbnail(string backgroundId);
        Task<bool> DeleteThumbnail(string backgroundId);
    }
}
