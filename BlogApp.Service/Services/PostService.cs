using BlogApp.Core.DTOs;
using BlogApp.Core.Entities;
using BlogApp.Core.Repositories;
using BlogApp.Core.Services;
using BlogApp.Core.UnitOfWorks;
using Microsoft.EntityFrameworkCore; // Include için gerekli

namespace BlogApp.Service.Services
{
    public class PostService : IPostService
    {
        private readonly IGenericRepository<Post> _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PostService(IGenericRepository<Post> postRepository, IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PostDto> CreateAsync(CreatePostDto createPostDto, int userId)
        {
            var post = new Post
            {
                Title = createPostDto.Title,
                Content = createPostDto.Content,
                UrlHandle = createPostDto.UrlHandle,
                FeaturedImageUrl = createPostDto.FeaturedImageUrl,
                IsVisible = createPostDto.IsVisible,
                PublishedDate = DateTime.UtcNow,
                CategoryId = createPostDto.CategoryId,
                UserId = userId // Controller'dan gelen ID
            };

            await _postRepository.AddAsync(post);
            await _unitOfWork.CommitAsync();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                UrlHandle = post.UrlHandle,
                IsVisible = post.IsVisible,
                PublishedDate = post.PublishedDate,
                CategoryId = post.CategoryId,
                // Kayıt anında ilişkili veriler null olabilir, sorun değil
                CategoryName = "", 
                AuthorName = ""
            };
        }

        public async Task<IEnumerable<PostDto>> GetAllAsync()
        {
            // Include Mantığı:
            // EF Core normalde sadece Post tablosunu çeker. 
            // Include diyerek "Git yan tabloları da (Category ve User) birleştir getir" diyoruz (SQL JOIN).
            var posts = await _postRepository.Where(x => x.IsVisible == true)
                                             .Include(x => x.Category)
                                             .Include(x => x.User)
                                             .ToListAsync();

            return posts.Select(x => new PostDto
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                UrlHandle = x.UrlHandle,
                FeaturedImageUrl = x.FeaturedImageUrl,
                IsVisible = x.IsVisible,
                PublishedDate = x.PublishedDate,
                CategoryName = x.Category?.Name ?? "Kategorisiz",
                CategoryId = x.CategoryId,
                AuthorName = x.User != null ? $"{x.User.FirstName} {x.User.LastName}" : "Bilinmiyor"
            }).ToList();

        }
        public async Task<PostDto?> GetByIdAsync(int id)
        {
            // GetByIdAsync sadece tabloyu çeker, ilişkileri (Category, User) getirmez.
            // Bu yüzden Include kullanarak manuel sorgu atıyoruz.
            var post = await _postRepository.Where(x => x.Id == id)
                                            .Include(x => x.Category)
                                            .Include(x => x.User)
                                            .FirstOrDefaultAsync();
            
            if (post == null)
            {
                return null;
            }

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                UrlHandle = post.UrlHandle,
                FeaturedImageUrl = post.FeaturedImageUrl,
                IsVisible = post.IsVisible,
                PublishedDate = post.PublishedDate,
                CategoryName = post.Category?.Name ?? "Kategorisiz",
                CategoryId = post.CategoryId,
                AuthorName = post.User != null ? $"{post.User.FirstName} {post.User.LastName}" : "Bilinmiyor"
            };  
        }   
        
        public async Task UpdateAsync(int id, CreatePostDto updatePostDto, int currentUserId)
        {
            var post = await _postRepository.GetByIdAsync(id);

            if (post != null)
            {
                // KONTROL: Yazı bu kullanıcıya mı ait?
                if (post.UserId != currentUserId)
                {
                    throw new Exception("Bu yazıyı güncelleme yetkiniz yok! (Yazı size ait değil)");
                }

                // Mevcut postun bilgilerini yeni gelenlerle değiştiriyoruz
                post.Title = updatePostDto.Title;
                post.Content = updatePostDto.Content;
                post.UrlHandle = updatePostDto.UrlHandle;
                post.FeaturedImageUrl = updatePostDto.FeaturedImageUrl;
                post.IsVisible = updatePostDto.IsVisible;
                post.CategoryId = updatePostDto.CategoryId;
                post.PublishedDate = DateTime.UtcNow; // Güncellenme tarihi

                _postRepository.Update(post);
                await _unitOfWork.CommitAsync();
            }
        }

        public async Task DeleteAsync(int id, int currentUserId)
        {
            var post = await _postRepository.GetByIdAsync(id);

            if (post != null)
            {
                // KONTROL: Yazı bu kullanıcıya mı ait?
                if (post.UserId != currentUserId)
                {
                    throw new Exception("Bu yazıyı silme yetkiniz yok! (Yazı size ait değil)");
                }

                _postRepository.Remove(post);
                await _unitOfWork.CommitAsync();
            }
        }
    }
}