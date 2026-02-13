using BlogApp.Core.DTOs;

namespace BlogApp.Core.Services
{
    public interface IPostService
    {
        Task<IEnumerable<PostDto>> GetAllAsync();
        
        // Ekleme yaparken UserId'yi parametre olarak alacağız
        Task<PostDto> CreateAsync(CreatePostDto createPostDto, int userId);
        Task<PostDto?> GetByIdAsync(int id);
        Task UpdateAsync(int id, CreatePostDto updatePostDto, int currentUserId); // Update
        Task DeleteAsync(int id, int currentUserId); // Delete
    }
}