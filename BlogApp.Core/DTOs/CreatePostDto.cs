namespace BlogApp.Core.DTOs
{
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UrlHandle { get; set; } = string.Empty; // Örn: "react-nedir"
        public string FeaturedImageUrl { get; set; } = string.Empty;
        public bool IsVisible { get; set; } = true;
        public int CategoryId { get; set; } // Hangi kategoride?
    }
}