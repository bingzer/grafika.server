using Grafika.Animations;
using Grafika.Services;
using Grafika.Web.Controllers;
using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Web
{
    public class AnimationsControllerTest
    {
        [Fact]
        public async void TestIndex()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.List(It.IsAny<AnimationQueryOptions>()))
                .ReturnsAsync(new List<Animation>())
                .Verifiable();

            var controller = new AnimationsController(mockAnimService.Object);
            await controller.Index(new AnimationQueryOptions());

            mockAnimService.VerifyAll();
        }

        [Fact]
        public async void TestRecents()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.List(It.IsAny<AnimationQueryOptions>()))
                .ReturnsAsync(new List<Animation>())
                .Verifiable();

            var controller = new AnimationsController(mockAnimService.Object);
            await controller.Recents(new AnimationQueryOptions());

            mockAnimService.VerifyAll();
        }

        [Fact]
        public async void TestEdit()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.Is<string>(str => str == "animationId")))
                .ReturnsAsync(new Animation { Id = "animationId" })
                .Verifiable();

            var controller = new AnimationsController(mockAnimService.Object);
            var viewResult = (await controller.Edit("animationId")) as ViewResult;

            mockAnimService.VerifyAll();

            Assert.Equal("Edit", viewResult.ViewName);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async void TestPlayer()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.Is<string>(str => str == "animationId")))
                .ReturnsAsync(new Animation { Id = "animationId" })
                .Verifiable();

            var viewModel = new AnimationPlayerViewModel
            {
                AnimationId = "animationId"
            };

            var controller = new AnimationsController(mockAnimService.Object);
            var viewResult = (await controller.Player(viewModel)) as PartialViewResult;

            mockAnimService.VerifyAll();

            Assert.NotNull(viewResult);
        }

        [Fact]
        public async void TestDetail()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.Is<string>(str => str == "animationId")))
                .ReturnsAsync(new Animation { Id = "animationId" })
                .Verifiable();

            var controller = new AnimationsController(mockAnimService.Object);
            var viewResult = (await controller.Detail("animationId")) as ViewResult;

            mockAnimService.VerifyAll();

            Assert.NotNull(viewResult);
        }

        [Fact]
        public async void TestList()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.List(It.Is<AnimationQueryOptions>(opt => opt.TemplateName == "_List")))
                .ReturnsAsync(new List<Animation>())
                .Verifiable();

            var controller = new AnimationsController(mockAnimService.Object);
            var viewResult = (await controller.List(new AnimationQueryOptions())) as PartialViewResult;

            mockAnimService.VerifyAll();

            Assert.NotNull(viewResult);
        }

        [Fact]
        public async void TestCreate()
        {
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(c => c.Get(It.Is<string>(str => str == "userId")))
                .ReturnsAsync(new TestIdentity())
                .Verifiable();

            var mockAnimService = new Mock<IAnimationService>();

            var controller = new AnimationsController(mockAnimService.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new TestPrincipal(new TestIdentity { Id = "userId" }) }
                }
            };
            var viewResult = (await controller.Create(mockUserService.Object)) as PartialViewResult;

            mockAnimService.VerifyAll();

            Assert.NotNull(viewResult);
        }
    }
}
