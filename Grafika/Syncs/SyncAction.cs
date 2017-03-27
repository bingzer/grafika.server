namespace Grafika.Syncs
{
    public enum SyncAction
    {
        Ok,
        ClientOutOfDate,
        ClientMissing,
        ClientDelete,
        ServerMissing,
        ServerOutOfDate,
        ServerDelete
    }
}
