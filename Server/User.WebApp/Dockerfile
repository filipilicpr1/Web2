FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

ENV ASPNETCORE_ENVIRONMENT=Development

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["User.WebApp/User.WebApp.csproj", "User.WebApp/"]
COPY ["User.WebApp/images/*", "User.WebApp/images/"]
COPY ["User.Domain/User.Domain.csproj", "User.Domain/"]
COPY ["User.Contracts/User.Contracts.csproj", "User.Contracts/"]
COPY ["User.Services/User.Services.csproj", "User.Services/"]
COPY ["User.Services.Abstractions/User.Services.Abstractions.csproj", "User.Services.Abstractions/"]
COPY ["User.Presentation/User.Presentation.csproj", "User.Presentation/"]
COPY ["User.Persistence/User.Persistence.csproj", "User.Persistence/"]

RUN dotnet restore "User.WebApp/User.WebApp.csproj"
COPY . .
WORKDIR "/src/User.WebApp"
RUN dotnet build "User.WebApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "User.WebApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "User.WebApp.dll"]