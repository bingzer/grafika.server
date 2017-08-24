﻿using System;
using Grafika.Animations;
using Amazon.S3.Model;
using System.Threading.Tasks;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Amazon.S3;
using Grafika.Utilities;

namespace Grafika.Services.Aws
{
    class AwsFrameRepository : AwsRepository, IAwsFrameRepository
    {
        private readonly IFrameDataProcessingFactory _factory;

        public AwsFrameRepository(IFrameDataProcessingFactory factory, 
            IOptions<AwsOAuthProviderConfiguration> serverOpts,
            IAmazonS3 client = null) 
            : base(serverOpts, client)
        {
            _factory = factory;
        }

        public async Task<FrameData> GetFrameData(IDrawableEntity entity, FrameData frameData)
        {
            var signedUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = Config.Bucket,
                Expires = DefaultExpiration,
                Key = Utility.CombineUrl(Config.Folder, entity.Type.GetGroupName(), entity.Id, "frames")
            };

            var signedUrl = Client.GetPreSignedURL(signedUrlRequest);
            frameData = new FrameData(frameData) { ContentType = ContentTypes.Json };

            var processor = _factory.GetProcessor(frameData.ContentEncoding);
            return await processor.ProcessHttpGet(frameData, signedUrl);
        }

        public async Task PostFrameData(IDrawableEntity entity, FrameData frameData)
        {
            var putObjectRequest = new PutObjectRequest
            {
                BucketName = Config.Bucket,
                Key = $"{Config.Folder}/{entity.Type.GetGroupName()}/{entity.Id}/frames",
                ContentType = frameData.ContentType,
                CannedACL = S3CannedACL.AuthenticatedRead
            };
            putObjectRequest.Headers.ContentEncoding = "deflate";

            var processor = _factory.GetProcessor(frameData.ContentEncoding);
            await processor.ProcessHttpPost(frameData, putObjectRequest);

            var response = await Client.PutObjectAsync(putObjectRequest);
            // TODO: maybe throw exception when http status code is not 200ish
        }
    }
}
