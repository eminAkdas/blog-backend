using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogApp.Core.DTOs;
using BlogApp.Core.Services;

namespace BlogApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // 1. Ekleme (Sadece Giriş Yapanlar)
        [HttpPost]
        [Authorize] // KİLİT! Token yoksa 401 hatası verir.
        public async Task<IActionResult> Create(CreateCategoryDto createCategoryDto)
        {
            var result = await _categoryService.CreateAsync(createCategoryDto);
            return Ok(result);
        }

        // 2. Listeleme (Herkes)
        [HttpGet]
        // Burada [Authorize] yok, yani public.
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            return Ok(result);
        }
    }
}