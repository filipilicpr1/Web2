FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

ENV ASPNETCORE_ENVIRONMENT=Development

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY Server.sln ./
COPY Product.Domain/*.csproj ./Product.Domain/
COPY Product.Contracts/*.csproj ./Product.Contracts/
COPY Product.Services/*.csproj ./Product.Services/
COPY Product.Services.Abstractions/*.csproj ./Product.Services.Abstractions/
COPY Product.Persistence/*.csproj ./Product.Persistence/
COPY Product.Presentation/*.csproj ./Product.Presentation/
COPY Product.WebApp/*.csproj ./Product.WebApp/
COPY Product.WebApp/images/* ./Product.WebApp/images/
COPY User.Domain/*.csproj ./User.Domain/
COPY User.Contracts/*.csproj ./User.Contracts/
COPY User.Services/*.csproj ./User.Services/
COPY User.Services.Abstractions/*.csproj ./User.Services.Abstractions/
COPY User.Persistence/*.csproj ./User.Persistence/
COPY User.Presentation/*.csproj ./User.Presentation/
COPY User.WebApp/*.csproj ./User.WebApp/
COPY User.WebApp/images/* ./User.WebApp/images/
COPY OcelotGateway/*.csproj ./OcelotGateway/

RUN dotnet restore
COPY . .
WORKDIR /src/Product.Domain
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.Contracts
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.Services
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.Services.Abstractions
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.Persistence
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.Presentation
RUN dotnet build -c Release -o /app

WORKDIR /src/Product.WebApp
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Product.WebApp.dll"]