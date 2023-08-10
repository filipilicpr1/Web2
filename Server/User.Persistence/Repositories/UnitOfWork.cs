using Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly UserApiDbContext _dbContext;
        public IUserRepository Users { get; }

        public UnitOfWork(UserApiDbContext dbContext,
                          IUserRepository users)
        {
            _dbContext = dbContext;
            Users = users;
        }
        public async Task Save()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
