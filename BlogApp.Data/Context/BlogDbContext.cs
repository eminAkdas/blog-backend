using Microsoft.EntityFrameworkCore;
using BlogApp.Core.Entities; // Core katmanını tanıması lazım


namespace BlogApp.Data.Context
{
    // DbContext: EF Core'un ana sınıfı. Veritabanı oturumunu temsil eder.
    public class BlogDbContext : DbContext
    {
        // Constructor: Bu sınıfın ayarlarını (örneğin hangi veritabanına bağlanacağı bilgisini) dışarıdan alır.
        // "options" parametresi Program.cs'den (API katmanından) gelecek.
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
        {
        }

        // DbSet: Veritabanındaki bir tabloyu temsil eder.
        // C# tarafındaki "User" nesneleri, SQL tarafındaki "Users" tablosuna dönüşecek.
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }

        // OnModelCreating: Tablolar oluşurken ince ayar yaptığımız yer (Fluent API).
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Örnek: Email alanı boş geçilemez olsun diye kural koyuyoruz.
            // Data Annotation ([Required]) yerine bu yöntem daha temizdir (Separation of Concerns).
            modelBuilder.Entity<User>().Property(u => u.Email).IsRequired();
            
            base.OnModelCreating(modelBuilder);
        }
    }
}