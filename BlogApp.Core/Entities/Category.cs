namespace BlogApp.Core.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Örn: "Teknoloji"
        public string Description { get; set; } = string.Empty; // Örn: "Yazılım ve donanım haberleri"

        // NAVIGATION PROPERTY
        // Bir kategorinin içinde birden fazla yazı olabilir.
        // Bu liste veritabanında sütun olmaz, kod tarafında ilişkiyi yönetmemizi sağlar.
        public ICollection<Post> Posts { get; set; } = new List<Post>(); 
    }
}