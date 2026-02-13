namespace BlogApp.Core.DTOs
{
    public class UserRegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Kullanıcının girdiği ham şifre (örn: "123456")
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}