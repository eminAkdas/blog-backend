using Microsoft.AspNetCore.Mvc;
using BlogApp.Core.DTOs;
using BlogApp.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BlogApp.API.Controllers
{
    [Route("api/[controller]")] // Adres: api/auth
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Servisi çağırıyoruz (Dependency Injection)
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")] // Adres: api/auth/register
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            // 1. Kontrol: Bu mail zaten var mı?
            if (await _authService.UserExists(userRegisterDto.Email))
            {
                return BadRequest("Bu e-posta adresi zaten kullanılıyor.");
            }

            // 2. Kayıt İşlemi
            var registeredUser = await _authService.RegisterAsync(userRegisterDto);

            // 3. Yanıt (Response)
            // DİKKAT: Asla "return Ok(registeredUser);" yapma! 
            // Çünkü User nesnesinin içinde PasswordHash ve Salt var. Bunları dışarı açmamalıyız.
            
            return StatusCode(201, new { message = "Kayıt başarılı!", userId = registeredUser.Id });
        }

        [HttpPost("login")] // Adres: api/auth/login
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var token = await _authService.LoginAsync(userLoginDto.Email, userLoginDto.Password);
            if (token == null)
            {
                return BadRequest("Giriş başarısız! E-posta veya şifre hatalı.");
            }
            return Ok(token);
        }

        [HttpGet("test-auth")]
        [Authorize] 
        public IActionResult TestAuth()
        {
             var userName = User.Identity?.Name;
             return Ok($"Tebrikler {userName}!...");
        }
    }
}   