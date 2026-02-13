namespace BlogApp.Core.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UrlHandle { get; set; } = string.Empty; // SEO dostu URL için (orn: "c-sharp-dersleri")
        public string FeaturedImageUrl { get; set; } = string.Empty; // Kapak resmi linki
        public bool IsVisible { get; set; } = true; // Yayında mı?
        public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

        // İLİŞKİ 1: Kategori ile Bağlantı
        public int CategoryId { get; set; } // Foreign Key (Veritabanında tutulan ID)
        public Category Category { get; set; } = null!; // Navigation Property (Nesne olarak erişim)

        // İLİŞKİ 2: Yazar (User) ile Bağlantı
        public int UserId { get; set; } // Foreign Key (Hangi kullanıcı yazdı?)
        public User User { get; set; } = null!; // Navigation Property (Yazarın adına, mailine erişmek için)
    }
}