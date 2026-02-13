namespace BlogApp.Core.UnitOfWorks
{
    public interface IUnitOfWork
    {
        // Asenkron Kaydetme (Genelde bunu kullanacağız)
        Task CommitAsync();

        // Senkron Kaydetme (Bazı durumlarda lazım olabilir)
        void Commit();
    }
}