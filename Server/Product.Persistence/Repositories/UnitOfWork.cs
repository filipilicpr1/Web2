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
        private readonly ProductApiDbContext _dbContext;
        public IProductRepository Products { get; }
        public IOrderRepository Orders { get; }
        public IOrderProductRepository OrderProducts { get; }

        public UnitOfWork(ProductApiDbContext dbContext,
                          IProductRepository products,
                          IOrderRepository orders,
                          IOrderProductRepository orderPrdocuts)
        {
            _dbContext = dbContext;
            Products = products;
            Orders = orders;
            OrderProducts = orderPrdocuts;
        }
        public async Task Save()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
