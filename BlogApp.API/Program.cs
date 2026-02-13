using Scalar.AspNetCore;
using BlogApp.Data.Context;
using Microsoft.EntityFrameworkCore;
using BlogApp.Core.Entities;
using BlogApp.Data.Repositories;
using BlogApp.Core.Repositories;
using BlogApp.Data.UnitOfWorks;
using BlogApp.Core.UnitOfWorks;
using BlogApp.Core.Services;
using BlogApp.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ...

// Servisleri (Dependecies) eklediğimiz alan (Container)
// Uygulamaya diyoruz ki: PostgreSql kullanacağız, ayarları da appsettings'den (DefaultConnection) al.
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// ...
// CORS Politikası Tanımlama
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        b => b.WithOrigins(
                "http://localhost:5173", // Localde çalışırken lazım
                "https://meminblog.vercel.app" // YENİ: Vercel adresini buraya ekledik
             )
              .AllowAnyHeader()
              .AllowAnyMethod());
});
// Scoped: Her HTTP isteği (Request) için yeni bir nesne üretir. 
// İstek bitince hafızadan siler. Veritabanı işlemleri için en uygun yaşam döngüsüdür.

// 1. Generic Repository Tanımlaması
// typeof(GenericRepository<>) kullanımı önemlidir çünkü generic tiplerle çalışıyoruz.
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// 2. Unit of Work Tanımlaması
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 3. AuthService Tanımlaması
builder.Services.AddScoped<IAuthService, AuthService>();    

// 4. CategoryService Tanımlaması
builder.Services.AddScoped<ICategoryService, CategoryService>();

// 5. PostService Tanımlaması
builder.Services.AddScoped<IPostService, PostService>();

// Add services to the container.

// Custom Exception Handler Tanımlaması
builder.Services.AddExceptionHandler<BlogApp.API.Middlewares.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true, // İmza kontrolü yapılsın mı? (EVET!)
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)), // Hangi anahtarla?
            
            ValidateIssuer = false, // Şimdilik yayıncı kontrolü yapma
            ValidateAudience = false, // Şimdilik alıcı kontrolü yapma
            ValidateLifetime = true, // Süre kontrolü yap (Expire olmuşsa reddet)
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// Global Exception Handler'ı devreye al (Kendi yazdığımız sınıf)
app.UseExceptionHandler();

// CORS'u devreye al (Tanımladığımız politika ismiyle)
app.UseCors("AllowReactApp"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
