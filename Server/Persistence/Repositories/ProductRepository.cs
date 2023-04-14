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
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ProjectDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<Product> GetDetailed(Guid id)
        {
            Product product = await _dbContext.Products.Include(p => p.Seller).Where(p => p.Id == id).FirstOrDefaultAsync();
            return product;
        }
    }
}
