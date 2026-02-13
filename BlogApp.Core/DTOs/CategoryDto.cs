namespace BlogApp.Core.DTOs
{
    // Category Entity'sinin aynısı gibi durabilir ama Entity'i dışarı açmamak kuraldır.
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}