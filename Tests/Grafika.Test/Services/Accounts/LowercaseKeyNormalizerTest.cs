using Grafika.Services.Accounts;
using Xunit;

namespace Grafika.Test.Services.Accounts
{
    public class LowercaseKeyNormalizerTest
    {
        [Fact]
        public void TestNormalize()
        {
            var normalizer = new LowercaseKeyNormalizer();

            Assert.Equal("abcde1234", normalizer.Normalize("AbCDe1234"));
            Assert.Equal("", normalizer.Normalize(""));
            Assert.Null(normalizer.Normalize(null));
        }
    }
}
