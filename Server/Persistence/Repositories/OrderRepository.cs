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
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(ProjectDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Order>> GetDeliveredOrCanceledDetailedBySeller(Guid id)
        {
            IEnumerable<Order> orders = await _dbContext.Orders.Include(o => o.Buyer)
                                                               .Include(o => o.Product)
                                                               .Where(o => o.Product.SellerId == id &&
                                                                           o.DeliveryTime < DateTime.Now)
                                                               .OrderBy(o => o.OrderTime)
                                                               .ToListAsync();
            return orders;
        }

        public async Task<IEnumerable<Order>> GetDeliveredDetailedByBuyer(Guid id)
        {
            IEnumerable<Order> orders = await _dbContext.Orders.Include(o => o.Buyer)
                                                               .Include(o => o.Product)
                                                               .Where(o => o.Buyer.Id == id &&
                                                                           o.DeliveryTime < DateTime.Now &&
                                                                           !o.IsCanceled)
                                                               .OrderBy(o => o.OrderTime)
                                                               .ToListAsync();
            return orders;
        }

        public async Task<Order> GetDetailed(Guid id)
        {
            Order order = await _dbContext.Orders.Include(o => o.Buyer)
                                                 .Include(o => o.Product)
                                                 .Where(o => o.Id == id)
                                                 .FirstOrDefaultAsync();
            return order;
        }

        public async Task<IEnumerable<Order>> GetNonDeliveredDetailedByBuyer(Guid id)
        {
            IEnumerable<Order> orders = await _dbContext.Orders.Include(o => o.Buyer)
                                                               .Include(o => o.Product)
                                                               .Where(o => o.Buyer.Id == id &&
                                                                           o.DeliveryTime > DateTime.Now &&
                                                                           !o.IsCanceled)
                                                               .OrderBy(o => o.DeliveryTime)
                                                               .ToListAsync();
            return orders;
        }

        public async Task<IEnumerable<Order>> GetNonDeliveredDetailedBySeller(Guid id)
        {
            IEnumerable<Order> orders = await _dbContext.Orders.Include(o => o.Buyer)
                                                               .Include(o => o.Product)
                                                               .Where(o => o.Product.SellerId == id &&
                                                                           o.DeliveryTime > DateTime.Now &&
                                                                           !o.IsCanceled)
                                                               .OrderBy(o => o.DeliveryTime)
                                                               .ToListAsync();
            return orders;
        }

        public async Task<IEnumerable<Order>> GetAllDetailed()
        {
            IEnumerable<Order> orders = await _dbContext.Orders.Include(o => o.Buyer)
                                                               .Include(o => o.Product)
                                                               .OrderBy(o => o.OrderTime)
                                                               .ToListAsync();
            return orders;
        }
    }
}
