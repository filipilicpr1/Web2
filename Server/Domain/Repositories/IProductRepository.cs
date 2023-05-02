using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product> GetDetailed(Guid id);
        Task<IEnumerable<Product>> GetAllDetailed();
        Task<IEnumerable<Product>> GetAllDetailedBySeller(Guid id);
    }
}
