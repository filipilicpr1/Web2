FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

ENV ASPNETCORE_ENVIRONMENT=Development

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["OcelotGateway/OcelotGateway.csproj", "OcelotGateway/"]

RUN dotnet restore "OcelotGateway/OcelotGateway.csproj"
COPY . .
WORKDIR "/src/OcelotGateway"
RUN dotnet build "OcelotGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OcelotGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OcelotGateway.dll"]