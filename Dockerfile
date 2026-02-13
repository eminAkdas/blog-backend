# 1. Build Aşaması
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala
COPY ["BlogApp.API/BlogApp.API.csproj", "BlogApp.API/"]
COPY ["BlogApp.Core/BlogApp.Core.csproj", "BlogApp.Core/"]
COPY ["BlogApp.Data/BlogApp.Data.csproj", "BlogApp.Data/"]
COPY ["BlogApp.Service/BlogApp.Service.csproj", "BlogApp.Service/"]

# Bağımlılıkları yükle
RUN dotnet restore "BlogApp.API/BlogApp.API.csproj"

# Tüm kodları kopyala
COPY . .

# Build işlemini yap
WORKDIR "/src/BlogApp.API"
RUN dotnet build "BlogApp.API.csproj" -c Release -o /app/build

# Yayınla (Publish)
FROM build AS publish
RUN dotnet publish "BlogApp.API.csproj" -c Release -o /app/publish

# 2. Çalıştırma (Run) Aşaması
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BlogApp.API.dll"]
