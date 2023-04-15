using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<Order> GetDetailed(Guid id);
        Task<IEnumerable<Order>> GetAllDetailed();
        Task<IEnumerable<Order>> GetNonDeliveredDetailedByBuyer(Guid id);
        Task<IEnumerable<Order>> GetDeliveredDetailedByBuyer(Guid id);
        Task<IEnumerable<Order>> GetNonDeliveredDetailedBySeller(Guid id);
        Task<IEnumerable<Order>> GetDeliveredOrCanceledDetailedBySeller(Guid id);
    }
}
