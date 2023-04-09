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
        private readonly ProjectDbContext _dbContext;
        public IUserRepository Users { get; }
        public IArticleRepository Articles { get; }
        public IOrderRepository Orders { get; }

        public UnitOfWork(ProjectDbContext dbContext,
                          IUserRepository users,
                          IArticleRepository articles,
                          IOrderRepository orders)
        {
            _dbContext = dbContext;
            Users = users;
            Articles = articles;
            Orders = orders;
        }
        public async Task Save()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
