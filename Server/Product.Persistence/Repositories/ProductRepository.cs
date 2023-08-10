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
    public class ProductRepository : GenericRepository<Domain.Models.Product>, IProductRepository
    {
        public ProductRepository(ProductApiDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Domain.Models.Product>> GetAllDetailed()
        {
            IEnumerable<Domain.Models.Product> products = await _dbContext.Products
                                                                     .Where(p => !p.IsDeleted)
                                                                     .OrderBy(p => p.Name)
                                                                     .ToListAsync();
            return products;
        }

        public async Task<IEnumerable<Domain.Models.Product>> GetAllDetailedBySeller(Guid id)
        {
            IEnumerable<Domain.Models.Product> products = await _dbContext.Products
                                                                     .Where(p => !p.IsDeleted && p.SellerId == id)
                                                                     .OrderBy(p => p.Name)
                                                                     .ToListAsync();
            return products;
        }

        public async Task<Domain.Models.Product> GetDetailed(Guid id)
        {
            Domain.Models.Product product = await _dbContext.Products
                                                       .Where(p => p.Id == id)
                                                       .FirstOrDefaultAsync();
            return product;
        }
    }
}
