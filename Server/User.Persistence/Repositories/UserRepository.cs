using Domain.Enums;
using Domain.Models;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(UserApiDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<User> FindByEmail(string email)
        {
            User user = await _dbContext.Users.FirstOrDefaultAsync(e => String.Equals(e.Email, email));
            return user;
        }

        public async Task<User> FindByUsername(string username)
        {
            User user = await _dbContext.Users.FirstOrDefaultAsync(e => String.Equals(e.Username, username));
            return user;
        }

        public async Task<IEnumerable<User>> GetSellers(bool onlyVerified)
        {
            IEnumerable<User> users = await _dbContext.Users
                                                      .Where(user => user.UserType == UserTypes.SELLER && (!onlyVerified || user.VerificationStatus == VerificationStatuses.ACCEPTED))
                                                      .OrderBy(user => user.Username)
                                                      .ToListAsync();
            return users;
        }
    }
}
