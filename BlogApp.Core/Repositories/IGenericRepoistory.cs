using System.Linq.Expressions;

namespace BlogApp.Core.Repositories
{
    // Generic Interface: Her entity için ortak olan metod şablonları
    public interface IGenericRepository<T> where T : class
    {
        // Id'ye göre veri getir (Örn: User getirmek için)
        Task<T?> GetByIdAsync(int id);

        // Tüm veriyi getir
        Task<IEnumerable<T>> GetAllAsync();

        // Belirli bir şarta göre getir (Örn: Email'i 'ahmet@test.com' olanları bul)
        // Expression: LINQ sorgusu yazabilmemizi sağlar (x => x.Email == "...")
        IQueryable<T> Where(Expression<Func<T, bool>> predicate);

        // Veri ekle
        Task AddAsync(T entity);

        // Veri sil (Silme işlemi genelde hafiftir, async olmasına gerek olmayabilir ama EF Core'da Remove senkrodur)
        void Remove(T entity);

        // Veri güncelle
        T Update(T entity);
    }
}