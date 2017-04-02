using Grafika.Services;
using Grafika.Services.Emails;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Emails
{
    public class TemplatedEmailDataTest
    {
        [Theory]
        [InlineData("test-html", ContentTypes.Html)]
        [InlineData("test-text", ContentTypes.Text)]
        public async void TestGetContent(string templateName, string contentType)
        {
            var mockEngine = new Mock<ITemplatedRenderingEngine<string>>();
            mockEngine.Setup(c => c.Render<SimpleModel>(
                It.Is<string>(str => str == templateName),
                It.Is<SimpleModel>(m => m.Foo == "Bar"),
                It.Is<string>(str => str == contentType)
                ))
                .ReturnsAsync(() => "Rendering result for " + templateName)
                .Verifiable();

            var emailData = new TemplatedEmailData<SimpleModel>(mockEngine.Object, templateName, new SimpleModel { Foo = "Bar" });
            var result = await emailData.GetContent(contentType);

            Assert.Equal("Rendering result for " + templateName, result);

            mockEngine.VerifyAll();
        }

        [Fact]
        public async void TestGetContent_NotSupported()
        {
            var emailData = new TemplatedEmailData<SimpleModel>(null, "templateName", new SimpleModel { Foo = "Bar" });
            await Assert.ThrowsAsync<NotSupportedException>(() => emailData.GetContent(ContentTypes.Xml));

        }

        class SimpleModel
        {
            public string Foo { get; set; }
        }
    }
}
