using BlogApp.Core.UnitOfWorks;
using BlogApp.Data.Context;

namespace BlogApp.Data.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BlogDbContext _context;

        public UnitOfWork(BlogDbContext context)
        {
            _context = context;
        }

        public void Commit()
        {
            _context.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}