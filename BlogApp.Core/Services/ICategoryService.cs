using BlogApp.Core.DTOs;
using BlogApp.Core.Entities;

namespace BlogApp.Core.Services
{
    public interface ICategoryService
    {
        // Tüm kategorileri getir
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        
        // Yeni kategori ekle
        Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto);
    }
}