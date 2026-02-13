using BlogApp.Core.Repositories;
using BlogApp.Data.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BlogApp.Data.Repositories
{
    // Interface'i implemente ediyoruz.
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly BlogDbContext _context;
        private readonly DbSet<T> _dbSet;

        // Dependency Injection ile Context'i alıyoruz
        public GenericRepository(BlogDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>(); // T neyse (User, Post) onun tablosunu ayarla
        }

        public async Task AddAsync(T entity)
        {
            // Memory'ye ekler, veritabanına henüz yansımaz (SaveChanges gerekir)
            await _dbSet.AddAsync(entity);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            // Veritabanındaki tüm kayıtları çeker
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public T Update(T entity)
        {
            _dbSet.Update(entity);
            return entity;
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> predicate)
        {
            return _dbSet.Where(predicate);
        }
    }
}