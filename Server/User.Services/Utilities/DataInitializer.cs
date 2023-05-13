using Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Utilities;
using Domain.Models;
using Microsoft.Extensions.Options;
using Domain.AppSettings;

namespace Services.Utilities
{
    public class DataInitializer : IDataInitializer
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<AppSettings> _settings;
        public DataInitializer(IUnitOfWork unitOfWork, IOptions<AppSettings> settings)
        {
            _unitOfWork = unitOfWork;
            _settings = settings;
        }

        public void InitializeData()
        {
            Task<User> task = _unitOfWork.Users.FindByEmail("admin@admin.com");
            task.Wait();
            User user = task.Result;
            if (user != null) 
            {
                return;
            }

            User newUser = new User()
            {
                Name = _settings.Value.AdminName,
                LastName = _settings.Value.AdminName,
                Username = _settings.Value.AdminName,
                Email = _settings.Value.AdminEmail,
                UserType = Domain.Enums.UserTypes.ADMIN,
                Address = _settings.Value.DefaultAddress,
                BirthDate = DateTime.Parse(_settings.Value.DefaultBirthDate),
                IsVerified = true,
                VerificationStatus = Domain.Enums.VerificationStatuses.ACCEPTED,
                FinishedRegistration = true,
                ImageSource = _settings.Value.DefaultImageName,
                Password = BCrypt.Net.BCrypt.HashPassword(_settings.Value.AdminName, BCrypt.Net.BCrypt.GenerateSalt()),
            };

            _unitOfWork.Users.Add(newUser).Wait();
            _unitOfWork.Save().Wait();
        }
    }
}
