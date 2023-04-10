using AutoMapper;
using Domain.AppSettings;
using Domain.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Persistence;
using Persistence.Repositories;
using Services;
using Services.Abstractions;
using Services.Mapping;
using System.Text;
using WebApp.Middleware;

string _cors = "cors";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddApplicationPart(typeof(Presentation.AssemblyReference).Assembly);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "projekat", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
      {
        new OpenApiSecurityScheme
        {
          Reference = new OpenApiReference
          {
            Type=ReferenceType.SecurityScheme,
            Id="Bearer"
          }
        },
        new string[]{}
      }
    });
});

builder.Services.AddAuthentication(opt => {
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings")["SecretKey"]));
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "http://localhost:7126",
        IssuerSigningKey = key
    };
});


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: _cors, builder => {
        builder.SetIsOriginAllowed(origin => true)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
builder.Services.AddOptions();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddDbContext<ProjectDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ProjectDatabase"), b => b.MigrationsAssembly("WebApp")));

var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new UserMappingProfile());
});

IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddTransient<ExceptionHandlingMiddleware>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    // apply new migrations on startup
    var context = scope.ServiceProvider.GetRequiredService<ProjectDbContext>();
    context.Database.MigrateAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(_cors);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
