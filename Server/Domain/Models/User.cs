using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address { get; set; }
        public UserTypes UserType { get; set; }
        public bool IsVerified { get; set; }
        public string ImageSource { get; set; }
        public List<Order> Orders { get; set; }
        public List<Article> Articles { get; set; }
    }
}
