FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

ENV ASPNETCORE_ENVIRONMENT=Development

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Product.WebApp/Product.WebApp.csproj", "Product.WebApp/"]
COPY ["Product.WebApp/images/*", "Product.WebApp/images/"]
COPY ["Product.Domain/Product.Domain.csproj", "Product.Domain/"]
COPY ["Product.Contracts/Product.Contracts.csproj", "Product.Contracts/"]
COPY ["Product.Services/Product.Services.csproj", "Product.Services/"]
COPY ["Product.Services.Abstractions/Product.Services.Abstractions.csproj", "Product.Services.Abstractions/"]
COPY ["Product.Presentation/Product.Presentation.csproj", "Product.Presentation/"]
COPY ["Product.Persistence/Product.Persistence.csproj", "Product.Persistence/"]

RUN dotnet restore "Product.WebApp/Product.WebApp.csproj"
COPY . .
WORKDIR "/src/Product.WebApp"
RUN dotnet build "Product.WebApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Product.WebApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Product.WebApp.dll"]