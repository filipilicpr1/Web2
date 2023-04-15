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

        public async Task<Order> GetDetailed(Guid id)
        {
            Order order = await _dbContext.Orders.Include(o => o.Buyer).Include(o => o.Product).Where(o => o.Id == id).FirstOrDefaultAsync();
            return order;
        }
    }
}
