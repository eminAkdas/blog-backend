using BlogApp.Core.DTOs;
using BlogApp.Core.Entities; // User dönüş tipi için

namespace BlogApp.Core.Services
{
    public interface IAuthService
    {
        // Kayıt olma metodu: DTO alır, geriye kayıt olan User'ı döner (veya duruma göre Token döner)
        Task<User> RegisterAsync(UserRegisterDto registerDto);
        
        // Giriş yapma metodu (Token döner veya null)
        Task<string?> LoginAsync(string email, string password);
        
        // Kullanıcı var mı kontrolü
        Task<bool> UserExists(string email);
    }
}