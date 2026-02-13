using BlogApp.Core.DTOs;
using BlogApp.Core.Entities;
using BlogApp.Core.Repositories;
using BlogApp.Core.Services;
using BlogApp.Core.UnitOfWorks;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Collections.Generic;



namespace BlogApp.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        public AuthService(IGenericRepository<User> userRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<User> RegisterAsync(UserRegisterDto registerDto)
        {
            // 1. Önce şifreyi güvenli hale getir (Hash & Salt oluştur)
            CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // 2. User nesnesini oluştur (DTO -> Entity dönüşümü)
            // Normalde burada AutoMapper kullanılır ama öğrenmek için elle yapıyoruz.
            var user = new User
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PasswordHash = passwordHash, // Şifrelenmiş veri
                PasswordSalt = passwordSalt, // Şifreleme anahtarı
                CreatedDate = DateTime.UtcNow
            };

            // 3. Veritabanına ekle (Repository)
            await _userRepository.AddAsync(user);

            // 4. İşlemi onayla (UnitOfWork)
            await _unitOfWork.CommitAsync();

            return user;
        }

        public async Task<bool> UserExists(string email)
        {
            // Email veritabanında var mı?
            var users = await _userRepository.GetAllAsync();
            return users.Any(x => x.Email == email);
             // Not: Performans için repository'e "AnyAsync" veya "FirstOrDefault" eklenmesi daha iyidir,
             // şimdilik GetAll ile idare ediyoruz ama büyük veride bu yöntem yavaştır.
        }
            
        public async Task<string?> LoginAsync(string email, string password)
        {
            // 1. Kullanıcıyı bul
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return null; // Kullanıcı yok
            }
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null; // Hatalı şifre
            }

            return CreateToken(user);
            
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }            
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };
            var tokenKey = _configuration["AppSettings:Token"] ?? throw new NullReferenceException("Token key is missing in appsettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);  
        }   

        // YARDIMCI METOD: Şifreleme İşlemi
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // HMACSHA512 algoritmasını başlat.
            using (var hmac = new HMACSHA512())
            {
                // Key: Algoritmanın rastgele ürettiği anahtar (Salt)
                passwordSalt = hmac.Key; 
                
                // ComputeHash: Şifreyi byte'lara çevirip hash'le
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}