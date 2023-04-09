using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> FindByUsername(string username);
        Task<User> FindByEmail(string email);
    }
}
