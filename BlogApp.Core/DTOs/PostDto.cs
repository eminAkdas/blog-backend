namespace BlogApp.Core.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UrlHandle { get; set; } = string.Empty;
        public string FeaturedImageUrl { get; set; } = string.Empty;
        public bool IsVisible { get; set; }
        public DateTime PublishedDate { get; set; }
        
        // İlişkili Veriler
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty; // Category nesnesi yerine sadece ismi
        public string AuthorName { get; set; } = string.Empty;   // User nesnesi yerine sadece ismi
    }
}