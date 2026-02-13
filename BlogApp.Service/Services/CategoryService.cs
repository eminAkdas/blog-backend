using BlogApp.Core.DTOs;
using BlogApp.Core.Entities;
using BlogApp.Core.Repositories;
using BlogApp.Core.Services;
using BlogApp.Core.UnitOfWorks;

namespace BlogApp.Service.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IGenericRepository<Category> categoryRepository, IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto)
        {
            // 1. DTO -> Entity Dönüşümü (Mapping)
            var category = new Category
            {
                Name = createCategoryDto.Name,
                Description = createCategoryDto.Description
            };

            // 2. Repository'e ekle
            await _categoryRepository.AddAsync(category);
            
            // 3. Veritabanına kaydet (Burada ID oluşur)
            await _unitOfWork.CommitAsync();

            // 4. Entity -> Output DTO Dönüşümü
            return new CategoryDto
            {
                Id = category.Id, // Artık ID var
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            // Listeyi tek tek dönüp DTO'ya çeviriyoruz (Select metodu)
            return categories.Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description
            }).ToList();
        }
    }
}