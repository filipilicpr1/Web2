using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.UserDTOs
{
    public class DisplayUserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address { get; set; }
        public string ImageSource { get; set; }
        public string UserType { get; set; }
        public bool IsVerified { get; set; }
    }
}
