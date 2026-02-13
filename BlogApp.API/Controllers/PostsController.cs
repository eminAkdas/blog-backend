using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogApp.Core.DTOs;
using BlogApp.Core.Services;
using System.Security.Claims; // Claim okumak için
using BlogApp.Core.Entities;

namespace BlogApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpPost]
        [Authorize] // Sadece giriş yapanlar yazı yazabilir
        public async Task<IActionResult> Create(CreatePostDto createPostDto)
        {
            // Token'ın içindeki "NameIdentifier" (User Id) claim'ini bul
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim.Value);

            var result = await _postService.CreateAsync(createPostDto, userId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _postService.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{id}")] // Örn: api/posts/5
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _postService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, CreatePostDto updatePostDto)
        {
            // Try-Catch sildik, çünkü GlobalExceptionHandler yakalayacak.
           var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
           if (userIdClaim == null) return Unauthorized();
           
           int userId = int.Parse(userIdClaim.Value);
            
           await _postService.UpdateAsync(id, updatePostDto, userId);
           return Ok();
        }
        
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
           if (userIdClaim == null) return Unauthorized();
           
           int userId = int.Parse(userIdClaim.Value);

           await _postService.DeleteAsync(id, userId);
           return Ok();
        }
    }
}