using Grafika.Data.Mongo;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoEntityIdValidatorTest
    {

        [Theory]
        [InlineData("58d5b799963ca021041cb6a2", true)]
        [InlineData("58d5b799963ca021041cb6b3", true)]
        [InlineData("58d57799963ca021041cb6b3", true)]
        [InlineData("58d5b799963ca021041", false)]
        [InlineData("", false)]
        [InlineData("789789", false)]
        [InlineData(null, false)]
        public void TestValidateId(string id, bool expected)
        {
            var validator = new MongoEntityIdValidator();
            Assert.Equal(expected, validator.ValidateId(id));

        }
    }
}
