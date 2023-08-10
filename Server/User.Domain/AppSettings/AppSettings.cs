using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.AppSettings
{
    public class AppSettings
    {
        public string SecretKey { get; set; }
        public int MinPasswordLength { get; set; }
        public int MinBirthYear { get; set; }
        public string DefaultImagePath { get; set; }
        public string DefaultImageName { get; set; }
        public string DefaultAddress { get; set; }
        public string DefaultBirthDate { get; set; }
        public string DefaultPassword { get; set; }
        public string AdminName { get; set; }
        public string AdminEmail { get; set; }
        public int UsersPageSize { get; set; }
        public string TokenIssuer { get; set; }
        public int TokenDuration { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string GoogleClientId { get; set; }
        public string GoogleClientSecret { get; set; }
    }
}
