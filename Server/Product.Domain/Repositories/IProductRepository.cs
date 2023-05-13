using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IProductRepository : IGenericRepository<Domain.Models.Product>
    {
        Task<Domain.Models.Product> GetDetailed(Guid id);
        Task<IEnumerable<Domain.Models.Product>> GetAllDetailed();
        Task<IEnumerable<Domain.Models.Product>> GetAllDetailedBySeller(Guid id);
    }
}
