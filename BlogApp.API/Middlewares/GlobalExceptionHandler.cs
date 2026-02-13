using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BlogApp.API.Middlewares
{
    // IExceptionHandler arayüzü .NET 8 ile gelen modern bir hata yakalama yöntemidir.
    // Eskiden Middleware sınıfı yazıp içine try-catch koyardık, şimdi bu interface işi kolaylaştırıyor.
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            // 1. Hatayı Logla (Terminalde veya Log dosyasında görmek için)
            _logger.LogError(exception, "Beklenmeyen bir hata oluştu: {Message}", exception.Message);

            // 2. Hata Detaylarını Hazırla (ProblemDetails standardı)
            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Sunucu Hatası",
                Detail = exception.Message, // Geliştirme aşamasında hatayı direkt gösteriyoruz. Prod'da "Bir hata oluştu" denmeli.
                Instance = httpContext.Request.Path
            };

            // Eğer hata bizim fırlattığımız "Yetkiniz Yok" gibi logic hatalarıysa status kodunu 400 (Bad Request) yapabiliriz.
            // Örnek: Basit bir kontrol
            if (exception.Message.Contains("yetkiniz yok") || exception.Message.Contains("bulunamadı")) 
            {
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Title = "İşlem Başarısız";
            }

            httpContext.Response.StatusCode = problemDetails.Status.Value;

            // 3. Cevabı JSON olarak dön
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true; // Hatayı yönettik, zincir devam etmesin.
        }
    }
}
