namespace BlogApp.Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        
        // Şifreyi asla düz metin (plain text) saklamayacağız!
        public byte[] PasswordHash { get; set; } = new byte[0];
        public byte[] PasswordSalt { get; set; } = new byte[0];

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}