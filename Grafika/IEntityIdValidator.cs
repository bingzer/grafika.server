namespace Grafika
{
    public interface IEntityIdValidator
    {
        /// <summary>
        /// Validate Id format
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool ValidateId(string id);
    }
}
